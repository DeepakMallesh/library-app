import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  // Fetch suggestions from backend based on query with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/books?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          // Add BLOB URLs to suggestions
          const suggestionsWithUrls = data.slice(0, 5).map(book => ({
            ...book,
            coverUrl: `http://localhost:5000/api/books/${book.id}/cover`,
            pdfUrl: `http://localhost:5000/api/books/${book.id}/pdf`
          }));
          setSuggestions(suggestionsWithUrls);
          setShowSuggestions(true);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions dropdown when clicked outside
  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // When user selects a suggestion
  const onSelect = (book) => {
    setQuery(book.title);
    setShowSuggestions(false);
    // Optionally navigate to details page
    // navigate(`/books/${book.id}`);
  };

  // Book Card Component
  const BookCard = ({ book }) => (
    <div
      className="border rounded-xl shadow-md p-3 bg-white hover:shadow-xl transition cursor-pointer flex flex-col"
      style={{ height: '280px', width: 'calc(100% - 5px)' }} // Adjusted dimensions
      onClick={() => window.open(book.pdfUrl, '_blank')}
    >
      <div className="flex justify-center mb-3">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-24 h-32 object-cover rounded border"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden w-24 h-32 items-center justify-center bg-gray-100 rounded border text-gray-400 text-xs">
          No Cover
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-indigo-800 mb-2 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
        <p className="text-sm text-indigo-700 mb-1">Language: {book.language || 'N/A'}</p>
        <p className="text-sm text-purple-700 mb-2">Category: {book.category || 'N/A'}</p>
        <p className="text-xs text-gray-700 line-clamp-3">{book.description || 'No description available.'}</p>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors..."
        className="w-full rounded border px-4 py-2"
      />
      {showSuggestions && (
        <ul className="absolute bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto z-50">
          {suggestions.length > 0 ? (
            suggestions.map(book => (
              <li
                key={book.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => onSelect(book)}
              >
                <div className="font-semibold">{book.title}</div>
                <div className="text-sm text-gray-600">{book.author}</div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No suggestions</li>
          )}
        </ul>
      )}

      {/* Display matched books below the search bar */}
      {query.trim() && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.length === 0 ? (
            <p className="text-gray-500">No books found.</p>
          ) : (
            suggestions.map(book => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

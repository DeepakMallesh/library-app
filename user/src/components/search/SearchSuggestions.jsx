import React, { useState, useEffect } from 'react';

export default function SearchSuggestions({ query, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/books?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          // Add BLOB URLs to suggestions
          const suggestionsWithUrls = data.slice(0, 8).map(book => ({
            ...book,
            coverUrl: `http://localhost:5000/api/books/${book.id}/cover`,
            pdfUrl: `http://localhost:5000/api/books/${book.id}/pdf`
          }));
          setSuggestions(suggestionsWithUrls);
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded mb-4 p-4">
        <div className="text-gray-500 text-center">Searching...</div>
      </div>
    );
  }

  if (suggestions.length === 0 && query.trim().length >= 2) {
    return (
      <div className="bg-white shadow rounded mb-4 p-4">
        <div className="text-gray-500 text-center">No books found for "{query}"</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded mb-4 p-2 max-h-80 overflow-y-auto">
      {suggestions.map(book => (
        <div
          key={book.id}
          onClick={() => onSelect(book)}
          className="py-2 px-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
        >
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-10 h-12 object-cover rounded"
            onError={e => {
              e.target.style.display = 'none';
            }}
          />
          <div className="flex-1">
            <div className="font-semibold text-indigo-800">{book.title}</div>
            <div className="text-sm text-gray-600">by {book.author}</div>
            <div className="text-xs text-gray-500">{book.category} • {book.language}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

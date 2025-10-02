import React, { useState, useRef, useEffect } from 'react';
import booksData from '../data/books.json'; // Array of books
import Fuse from 'fuse.js';

const filterOptions = {
  genre: ['All Genres', ...Array.from(new Set(booksData.map(b => b.genre)).values()).filter(Boolean)],
  language: ['All Languages', ...Array.from(new Set(booksData.map(b => b.language)).values()).filter(Boolean)],
  year: ['All Years', ...Array.from(new Set(booksData.map(b => b.year)).values()).filter(Boolean)],
};

function BookCard({ book }) {
  const stars = Math.round(book.rating || 0);

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col hover:shadow-xl transition relative overflow-hidden min-h-[200px]">
      <img
        src={book.cover || '/images/placeholder.png'}
        alt={book.title}
        loading="lazy"
        className="w-full h-32 object-cover rounded-t"
      />
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-amazon-blue mb-1">{book.title}</h3>
        <p className="text-gray-600 italic mb-1">By {book.author}</p>
        <div className="flex items-center mb-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <polygon points="9.9,1.1 7.7,6.9 1.7,7.6 6.1,11.7 4.7,17.6 9.9,14.5 15.1,17.6 13.7,11.7 18.1,7.6 12.1,6.9 " />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-700">{(book.rating ?? 0).toFixed(1)}</span>
        </div>
        <div className="text-sm font-medium text-gray-800 mb-1">${book.price}</div>
        <div className={`text-xs font-semibold mb-2 ${book.available ? 'text-green-600' : 'text-red-600'}`}>
          {book.available ? 'Available' : 'Not available'}
        </div>
        <button
          className="mt-auto bg-amazon-orange rounded text-white py-1 font-semibold hover:bg-orange-600 transition flex items-center justify-center"
        >
          Borrow
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  // SEARCH BAR LOGIC
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const suggestionRef = useRef(null);

  // FILTER LOGIC
  const [filters, setFilters] = useState({
    genre: 'All Genres',
    language: 'All Languages',
    year: 'All Years',
    available: false,
  });

  // Fuse.js for instant fuzzy search
  const fuse = new Fuse(booksData, {
    keys: ['title', 'author'],
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (query.trim().length > 0) {
      const results = fuse.search(query).slice(0, 7).map(r => r.item);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedBook(null);
    }
  }, [query]);

  // Click outside handler to close suggestions
  useEffect(() => {
    function handleClick(e) {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filtered books based on selectedBook and applied filters
  const filteredBooks = booksData.filter((book) => {
    // If no book selected, don't show results
    if (!selectedBook) return false;
    // Matches selectedBook (by title or author)
    if (
      selectedBook.title &&
      book.title.toLowerCase().indexOf(selectedBook.title.toLowerCase()) === -1 &&
      (!selectedBook.author || book.author.toLowerCase().indexOf(selectedBook.author.toLowerCase()) === -1)
    ) {
      return false;
    }
    // Genre filter
    if (filters.genre !== 'All Genres' && book.genre !== filters.genre) return false;
    // Language filter
    if (filters.language !== 'All Languages' && book.language !== filters.language) return false;
    // Year filter
    if (filters.year !== 'All Years' && book.year !== filters.year) return false;
    // Availability
    if (filters.available && !book.available) return false;
    return true;
  });

  // Update filter
  const handleFilterChange = (filter, value) => {
    setFilters({ ...filters, [filter]: value });
  };

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-amazon-light flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-10">
        {/* SEARCH BAR */}
        <div className="w-full max-w-3xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search books, authors..."
            className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            onFocus={() => query.trim().length > 0 && setShowSuggestions(true)}
          />
          {/* Suggestions dropdown */}
          {showSuggestions && (
            <ul
              ref={suggestionRef}
              className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto"
            >
              {suggestions.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No matches found</li>
              )}
              {suggestions.map(book => (
                <li
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setShowSuggestions(false);
                    setQuery(book.title);
                  }}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">{book.title}</span>
                    <span className="text-xs text-gray-600 ml-2">by {book.author}</span>
                  </div>
                  {book.cover && (
                    <img src={book.cover} alt={book.title} className="w-10 h-10 object-cover rounded ml-2" loading="lazy" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* MAIN BODY: Filters + Results only if a suggestion was picked */}
        {selectedBook && (
          <div className="flex gap-10 mt-10">
            {/* Filters Sidebar */}
            <aside className="sticky top-20 w-72 bg-white p-6 rounded-lg shadow-lg h-fit">
              <h4 className="text-lg font-bold mb-4 text-amazon-blue">Filters</h4>
              {/* Genre */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Genre</label>
                <select
                  value={filters.genre}
                  onChange={e => handleFilterChange('genre', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  {filterOptions.genre.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Language */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Language</label>
                <select
                  value={filters.language}
                  onChange={e => handleFilterChange('language', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  {filterOptions.language.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Year */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Year</label>
                <select
                  value={filters.year}
                  onChange={e => handleFilterChange('year', e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  {filterOptions.year.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Available Checkbox */}
              <div className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  checked={filters.available}
                  onChange={e => handleFilterChange('available', e.target.checked)}
                  id="available"
                  className="mr-2"
                />
                <label htmlFor="available" className="text-sm">Available Now</label>
              </div>
            </aside>

            {/* Results Grid */}
            <section className="flex-grow">
              {filteredBooks.length === 0 ? (
                <div className="text-gray-500 py-10">No books found matching these filters.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredBooks.map(book => (
                    <BookCard book={book} key={book.id} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

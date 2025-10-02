import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BASE_URL = "https://library-backend-jrs5.onrender.com";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    category: '',
  });
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const languages = ['English', 'Kannada'];
  const categories = [
    'Novel',
    'Moral Story',
    'Love Story',
    'Horror',
    'Adventure',
    'Sci-Fi',
    'Biography',
    'History',
    'Fantasy',
  ];

  // Fetch suggestions for dropdown with alphabetical sorting
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`${BASE_URL}/api/books?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          const suggestionsWithUrls = data.map(book => ({
            ...book,
            coverUrl: `${BASE_URL}/api/books/${book.id}/cover`,
            pdfUrl: `${BASE_URL}/api/books/${book.id}/pdf`
          }));
          
          // Sort alphabetically by book title
          const sortedSuggestions = suggestionsWithUrls
            .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
            .slice(0, 8);
          
          setSuggestions(sortedSuggestions);
          setShowSuggestions(true);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside handler for suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && 
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main search results
  useEffect(() => {
    if (!searchQuery.trim() && !filters.language && !filters.category) {
      setFilteredBooks([]);
      return;
    }
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filters.language) params.append('language', filters.language);
    if (filters.category) params.append('category', filters.category);
    
    fetch(`${BASE_URL}/api/books?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const booksWithUrls = data.map(book => ({
          ...book,
          coverUrl: `${BASE_URL}/api/books/${book.id}/cover`,
          pdfUrl: `${BASE_URL}/api/books/${book.id}/pdf`
        }));
        setFilteredBooks(booksWithUrls);
      })
      .catch(() => setFilteredBooks([]));
  }, [searchQuery, filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (book) => {
    setSearchQuery(book.title);
    setShowSuggestions(false);
  };

  // Book Card component
  const BookCard = ({ book }) => (
    <div
      className="border rounded-xl shadow-md p-3 bg-white hover:shadow-xl transition cursor-pointer flex flex-col items-center"
      style={{ height: '280px', minWidth: '175px' }}
      onClick={() => window.open(book.pdfUrl, '_blank')}
    >
      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-full"
        style={{ height: '110px', objectFit: 'contain', borderRadius: '8px', marginBottom: '8px' }}
        onError={e => {
          e.target.style.display = 'none';
          e.target.parentElement.querySelector('.fallback-cover').style.display = 'flex';
        }}
      />
      <div 
        className="fallback-cover hidden items-center justify-center w-full h-[110px] bg-gray-100 rounded text-gray-400 text-xs mb-2"
      >
        No cover image
      </div>
      
      <div className="w-full text-left px-1">
        <div className="flex items-center space-x-1 mb-1">
          <h3 className="text-base font-bold text-indigo-800 truncate">{book.title}</h3>
          <span className="text-xs text-gray-600 truncate">by {book.author}</span>
        </div>
        <p className="text-xs text-indigo-700 truncate">Language: {book.language}</p>
        <p className="text-xs text-purple-700 truncate mb-1">Category: {book.category}</p>
        <p className="text-xs text-gray-700 truncate">{book.description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <Header />
      {/* Modern pastel gradient shapes */}
      <div
        aria-hidden="true"
        className="fixed top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 opacity-20 filter blur-3xl pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-300 to-pink-400 opacity-15 filter blur-2xl pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <main className="flex flex-1 relative z-10">
        {/* Filters Sidebar */}
        <aside
          className="w-1/4 min-w-[220px] max-w-xs px-8 py-10 border-r border-gray-200 shadow-sm relative"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #fbd4f8 0%, transparent 60%), ' +
              'radial-gradient(circle at 75% 15%, #c2f0fc 0%, transparent 65%), ' +
              'radial-gradient(circle at 50% 80%, #ffe8cc 0%, transparent 65%), ' +
              'radial-gradient(circle at 80% 60%, #e0d5fc 0%, transparent 55%)',
            backgroundBlendMode: 'lighten',
          }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700 font-serif border-b border-indigo-300 pb-2">
            Filters
          </h2>
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-medium">Language</label>
            <select
              value={filters.language}
              onChange={e => handleFilterChange('language', e.target.value)}
              className="w-full border border-indigo-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
            >
              <option value="">Select Language</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Category</label>
            <select
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="w-full border border-indigo-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 px-6 py-8">
          <div className="mb-6 text-center">
            <h1
              className="text-4xl font-extrabold font-serif tracking-wide mb-2"
              style={{
                background: 'linear-gradient(90deg, #6549D5 40%, #BC6FF1 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your Reading Companion
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse, read, and bookmark your favorite books—fast and beautifully.
            </p>
          </div>
          
          {/* Search Bar with Alphabetically Sorted Dropdown */}
          <div ref={searchRef} className="relative max-w-xl mx-auto mb-8">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-700 text-xl">
              🔎
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 1 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Search books, authors..."
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-indigo-300 placeholder-indigo-500 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 text-indigo-900 text-lg transition"
              style={{ minHeight: '48px' }}
            />
            
            {/* Alphabetically Sorted Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50"
              >
                {suggestions.map(book => (
                  <div
                    key={book.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 border-b last:border-b-0"
                    onClick={() => handleSuggestionSelect(book)}
                  >
                    {book.title} by {book.author}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(searchQuery || filters.language || filters.category) && (
            <div>
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center text-lg pt-10">No books found.</p>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

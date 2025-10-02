import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Book Card Component
const BookCard = ({ book }) => (
  <div
    className="border rounded-xl shadow-md p-3 bg-white hover:shadow-xl transition cursor-pointer flex flex-col"
    style={{ minHeight: '300px' }}
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

export default function SearchPage() {
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    language: '',
    year: '',
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const params = new URLSearchParams();
    if (filters.title) params.append('search', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.language) params.append('language', filters.language);
    if (filters.year) params.append('year', filters.year);

    try {
      const res = await fetch(`http://localhost:5000/api/books?${params.toString()}`);
      const data = await res.json();
      
      // Add BLOB URLs to search results
      const booksWithUrls = data.map(book => ({
        ...book,
        coverUrl: `http://localhost:5000/api/books/${book.id}/cover`,
        pdfUrl: `http://localhost:5000/api/books/${book.id}/pdf`
      }));
      
      setBooks(booksWithUrls);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Advanced Book Search</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={filters.title}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="author"
              placeholder="Author Name"
              value={filters.author}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="language"
              placeholder="Language"
              value={filters.language}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={filters.year}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Books'}
          </button>
        </form>
        
        <div>
          {loading ? (
            <p className="text-gray-500 text-center py-8">Searching for books...</p>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">No books found. Try different search terms.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">Found {books.length} book{books.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

export default function SearchResults({ books, loading, error }) {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 max-w-7xl mx-auto">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer"
          style={{ height: '420px', width: 'calc(100% - 5px)' }} // +10px height, -5px width
          onClick={() => window.open(`http://localhost:5000/api/books/${book.id}/pdf`, '_blank')}
        >
          <div
            className="mb-4 flex justify-center items-center"
            style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#f5f5f5', borderRadius: '8px' }}
          >
            <img
              src={`http://localhost:5000/api/books/${book.id}/cover`}
              alt={book.title}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="text-gray-400 text-sm">No cover image</div>';
              }}
            />
          </div>
          <h3 className="text-lg font-semibold text-indigo-800 mb-1 truncate">
            {book.title} <span className="font-normal">by {book.author}</span>
          </h3>
          <p className="text-gray-700 mb-1 truncate">{book.language}</p>
          <p className="text-gray-500 truncate">{book.category}</p>
          <p className="text-gray-700 flex-grow line-clamp-3 mt-2">{book.description}</p>
        </div>
      ))}
    </div>
  );
}

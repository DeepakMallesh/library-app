import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then(data => {
        // Add BLOB URLs to the book object
        const bookWithUrls = {
          ...data,
          coverUrl: `http://localhost:5000/api/books/${data.id}/cover`,
          pdfUrl: `http://localhost:5000/api/books/${data.id}/pdf`
        };
        setBook(bookWithUrls);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load book details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <Breadcrumbs />
        <main className="p-4 max-w-2xl mx-auto text-center text-gray-500">
          Loading book details...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div>
        <Header />
        <Breadcrumbs />
        <main className="p-4 max-w-2xl mx-auto text-center text-red-600">
          {error || 'Book not found.'}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Breadcrumbs />
      <main className="p-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row gap-6 items-start">
          {/* Book Cover */}
          <div className="w-56 h-72 flex-shrink-0">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover rounded border shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full hidden items-center justify-center bg-gray-100 rounded border text-gray-400">
              No Cover Image
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold text-indigo-900 mb-4">{book.title}</h1>
            <p className="mb-2"><strong>Author:</strong> {book.author || 'N/A'}</p>
            <p className="mb-2"><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p className="mb-2"><strong>Category:</strong> {book.category || 'N/A'}</p>
            <p className="mb-4 whitespace-pre-line text-gray-700">{book.description || 'No description available.'}</p>

            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition font-semibold shadow mt-auto"
            >
              Open Book
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BASE_URL = "https://library-backend-jrs5.onrender.com";

export default function Home() {
  const [booksByCategory, setBooksByCategory] = useState({});
  const scrollRefs = useRef({});

  useEffect(() => {
    // Fetch all recommended books, grouped by category
    async function fetchRecommended() {
      try {
        const res = await fetch(`${BASE_URL}/api/books?limit=50&sort=newest`);
        if (!res.ok) throw new Error('Failed to fetch recommended books');
        const data = await res.json();

        // Add BLOB URLs to each book and group by category
        const booksWithUrls = data.map(book => ({
          ...book,
          coverUrl: `${BASE_URL}/api/books/${book.id}/cover`,
          pdfUrl: `${BASE_URL}/api/books/${book.id}/pdf`
        }));

        const grouped = {};
        booksWithUrls.forEach(book => {
          const cat = book.category || 'General';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(book);
        });
        setBooksByCategory(grouped);
      } catch {
        setBooksByCategory({});
      }
    }
    fetchRecommended();
  }, []);

  const scrollLeft = cat => {
    if (scrollRefs.current[cat]) {
      scrollRefs.current[cat].scrollBy({ left: -180, behavior: 'smooth' });
    }
  };
  const scrollRight = cat => {
    if (scrollRefs.current[cat]) {
      scrollRefs.current[cat].scrollBy({ left: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow px-4 md:px-10 py-10 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <section className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center font-serif text-indigo-700 tracking-tight">
            Newest in Library
          </h2>
          {Object.keys(booksByCategory).length === 0 ? (
            <p className="text-center text-gray-500 w-full py-24">No recommendations available.</p>
          ) : (
            Object.entries(booksByCategory).map(([category, books]) => (
              <div key={category} className="mb-7">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 pl-0">
                  {category}
                </h3>
                <div className="relative">
                  <button
                    aria-label="Scroll left"
                    onClick={() => scrollLeft(category)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition opacity-80 hover:opacity-100"
                    style={{ minWidth: '30px', minHeight: '30px' }}
                  >
                    ‹
                  </button>
                  <div
                    ref={el => (scrollRefs.current[category] = el)}
                    className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide py-3 px-1"
                    style={{ scrollSnapType: 'x mandatory', minHeight: '160px' }}
                  >
                    {books.map(book => (
                      <div
                        key={book.id}
                        className="flex-none w-32 md:w-40 rounded-lg shadow-md bg-white border hover:shadow-lg transition-transform transform hover:scale-[1.04] cursor-pointer scroll-snap-align-start flex flex-col px-2 py-2 mx-1"
                        title={book.title}
                        style={{ marginLeft: '7px', marginRight: '7px', padding: '1px 0', boxSizing: 'border-box', minHeight: '170px' }}
                        onClick={() => window.open(book.pdfUrl, '_blank')}
                      >
                        <div className="h-28 w-full relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
                          <img
                            src={book.coverUrl}
                            alt={`Cover of ${book.title}`}
                            style={{
                              maxHeight: '100%',
                              maxWidth: '100%',
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                              borderRadius: '8px'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-xs">No Cover</div>';
                            }}
                          />
                        </div>
                        {/* Card content */}
                        <div className="p-0 flex flex-col items-start">
                          <div className="flex items-center w-full space-x-1 mb-0">
                            <h3 className="text-sm font-bold text-indigo-800 truncate">{book.title}</h3>
                            <span className="text-xs text-gray-600 truncate">by {book.author}</span>
                          </div>
                          <span className="text-xs text-indigo-700">Language: {book.language}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    aria-label="Scroll right"
                    onClick={() => scrollRight(category)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition opacity-80 hover:opacity-100"
                    style={{ minWidth: '30px', minHeight: '30px' }}
                  >
                    ›
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

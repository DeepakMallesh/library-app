// src/components/common/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import booksData from '../../data/books.json';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const fuse = new Fuse(booksData, {
    keys: ['title', 'author'],
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (query.length > 1) {
      const fuseResults = fuse.search(query).slice(0, 5);
      setResults(fuseResults.map(r => r.item));
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    navigate(`/book/${id}`);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setOpen(true)}
        placeholder="Search books, authors..."
        className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto text-gray-900">
          {results.length ? (
            results.map((book) => (
              <li
                key={book.id}
                className="cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-amber-100"
                onClick={() => handleSelect(book.id)}
              >
                <span>{book.title}</span>
                <span className="text-sm italic text-gray-600">by {book.author}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-600">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
}

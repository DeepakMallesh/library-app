import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="shadow-md relative"
      style={{
        background: 'linear-gradient(90deg, #4f46e5 65%, #bc6ff1 100%)',
        borderBottomLeftRadius: '1.5rem',
        borderBottomRightRadius: '1.5rem',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="inline-block bg-white rounded-full px-2 py-1 text-indigo-700 text-2xl shadow hover:scale-110 transition">
              📚
            </span>
            <span className="ml-2 text-2xl font-extrabold font-serif text-white drop-shadow">
              Library App
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Link
              to="/"
              className={`rounded-xl px-4 py-2 font-semibold transition shadow-sm ${
                isActive('/')
                  ? "bg-indigo-200 text-indigo-900 scale-105 shadow-lg"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`rounded-xl px-4 py-2 font-semibold transition shadow-sm ${
                isActive('/books')
                  ? "bg-indigo-200 text-indigo-900 scale-105 shadow-lg"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              }`}
            >
              🔎 Search
            </Link>
            <Link
              to="/upload"
              className={`rounded-xl px-4 py-2 font-semibold transition shadow-sm ${
                isActive('/upload')
                  ? "bg-indigo-200 text-indigo-900 scale-105 shadow-lg"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              }`}
            >
              Upload
            </Link>
            <Link
              to="/about"
              className={`rounded-xl px-4 py-2 font-semibold transition shadow-sm ${
                isActive('/about')
                  ? "bg-indigo-200 text-indigo-900 scale-105 shadow-lg"
                  : "text-white hover:bg-indigo-400 hover:text-white"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState('All Genres');
  const [year, setYear] = useState('All Years');
  const [language, setLanguage] = useState('All Languages');
  const [available, setAvailable] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://library-backend-jrs5.onrender.com";

  // Fetch books from backend API with applied filters
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (genre && genre !== 'All Genres') params.append('category', genre);
      if (year && year !== 'All Years') params.append('year', year);
      if (language && language !== 'All Languages') params.append('language', language);
      if (available !== null) params.append('available', available);

      // Potential place to append sortBy if backend supports sorting
      // params.append('sortBy', sortBy);

      const response = await fetch(`${BASE_URL}/api/books?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books initially and whenever filters or sortBy change
  useEffect(() => {
    fetchBooks();
  }, [genre, year, language, available, sortBy]);

  return (
    <AppContext.Provider
      value={{
        books,
        genre,
        setGenre,
        year,
        setYear,
        language,
        setLanguage,
        available,
        setAvailable,
        sortBy,
        setSortBy,
        loading,
        error,
        fetchBooks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

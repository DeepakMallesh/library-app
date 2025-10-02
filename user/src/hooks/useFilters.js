import { useState, useEffect } from 'react';
import { filterBooks, sortBooks } from '../utils/searchHelpers';

export default function useFilters({ books, genre, year, language, available, sortBy }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let temp = filterBooks(books, { genre, year, language, available });
    temp = sortBooks(temp, sortBy);
    setFiltered(temp);
  }, [books, genre, year, language, available, sortBy]);

  return filtered;
}

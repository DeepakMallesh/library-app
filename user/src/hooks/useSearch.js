import { useState, useEffect } from 'react';
import { createFuseInstance } from '../utils/searchHelpers';
import booksData from '../data/books.json';

export default function useSearch(query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fuse = createFuseInstance(booksData);
    if (query) {
      const res = fuse.search(query).map(r => r.item);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [query]);

  return results;
}

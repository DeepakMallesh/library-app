import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';

export default function Navbar() {
  const { query, setQuery } = useContext(SearchContext);

  return (
    <div className="flex items-center p-4 bg-white shadow">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search books..."
        className="search-input"
      />
      <Link to="/search" className="btn-primary ml-2">Search</Link>
    </div>
  );
}

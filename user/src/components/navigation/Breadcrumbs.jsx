import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  return (
    <nav className="text-gray-600 text-sm p-2">
      <Link to="/">Home</Link>
      {parts.map((part, idx) => {
        const url = '/' + parts.slice(0, idx + 1).join('/');
        return (
          <span key={url}>
            {' > '}
            <Link to={url} className="capitalize hover:underline">{part}</Link>
          </span>
        );
      })}
    </nav>
  );
}

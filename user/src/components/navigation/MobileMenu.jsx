import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="p-2">
        ☰
      </button>
      {open && (
        <div className="bg-white shadow-md p-4">
          <Link to="/" className="block py-1">Home</Link>
          <Link to="/search" className="block py-1">Search</Link>
          <Link to="/profile" className="block py-1">Profile</Link>
        </div>
      )}
    </div>
  );
}

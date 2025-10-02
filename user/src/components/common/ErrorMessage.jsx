import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
      {message || 'An error occurred.'}
    </div>
  );
}

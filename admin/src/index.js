import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css'; // Import your global CSS or Tailwind styles here

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

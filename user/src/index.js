import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Search from './pages/Search'; // Use this for search results
import BookDetailsPage from './pages/BookDetails';
import UploadPage from './pages/Upload';
import AboutPage from './pages/About';
import NotFound from './pages/NotFound';

// Import context
import { AppProvider } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';

// Import global css
import './styles/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AppProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/books" element={<Search />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchProvider>
    </AppProvider>
  </BrowserRouter>
);

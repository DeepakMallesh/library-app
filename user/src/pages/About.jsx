import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-amazon-light">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-amazon-blue mb-8">About Library App</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            We're building a modern, accessible digital library where knowledge is free and beautiful to explore.
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Search and browse thousands of books</li>
            <li>Bookmark your favorites</li>
            <li>Track reading progress</li>
            <li>Multiple download formats</li>
            <li>Mobile-friendly design</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have feedback or want to contribute? Reach out to us at 
            <span className="text-amazon-blue"> contact@libraryapp.com</span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

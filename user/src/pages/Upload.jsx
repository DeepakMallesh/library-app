import React, { useState, useRef } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BASE_URL = "https://library-backend-jrs5.onrender.com";

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    language: '',
    category: '',
    description: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [uploading, setUploading] = useState(false); // Add loading state
  const coverInputRef = useRef();
  const bookInputRef = useRef();

  const languages = ['English', 'Kannada'];
  const categories = [
    'Novel', 'Moral Story', 'Love Story', 'Horror', 'Adventure',
    'Sci-Fi', 'Biography', 'History', 'Fantasy',
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverSelect = e => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Book cover must be a JPG, JPEG, or PNG image.');
      setCoverFile(null);
      // Clear file input
      e.target.value = '';
    } else {
      setCoverFile(file);
    }
  };

  const handleBookSelect = e => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Book must be in PDF format only.');
      setBookFile(null);
      // Clear file input
      e.target.value = '';
    } else {
      setBookFile(file);
    }
  };

  const handleDrag = (setter, validTypes) => e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'drop' && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!validTypes.includes(file.type)) {
        alert(
          validTypes[0] === 'application/pdf'
            ? 'Book must be in PDF format only.'
            : 'Book cover must be JPG, JPEG, or PNG image.'
        );
        setter(null);
      } else {
        setter(file);
      }
    }
  };

  // Function to reset the entire form
  const resetForm = () => {
    setForm({
      title: '',
      author: '',
      language: '',
      category: '',
      description: '',
    });
    setCoverFile(null);
    setBookFile(null);
    // Clear file inputs
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (bookInputRef.current) bookInputRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!bookFile) {
      alert('Please select a Book PDF file.');
      return;
    }
    if (!coverFile) {
      alert('Please select a Book Cover image (JPG, JPEG, PNG).');
      return;
    }

    setUploading(true); // Start loading

    const data = new FormData();
    data.append('cover', coverFile);
    data.append('book', bookFile);
    data.append('title', form.title);
    data.append('author', form.author);
    data.append('language', form.language);
    data.append('category', form.category);
    data.append('description', form.description);

    try {
      const res = await fetch(`${BASE_URL}/api/books/upload`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');

      // Success: Reset form and show success message
      alert('Book uploaded successfully! 📚');
      resetForm(); // Clear all form data

    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading book. Please try again.');
    } finally {
      setUploading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Header />

      {/* Decorative semi-circle background behind heading */}
      <div
        className="relative w-full flex justify-center items-center"
        style={{ height: '320px', marginBottom: '-120px', overflow: 'hidden' }}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            zIndex: 0,
            width: '110vw',
            height: '320px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #6A5CF6, #9F45EA)',
            opacity: 0.54,
            filter: 'blur(1.5px)',
            borderBottomLeftRadius: '55% 100%',
            borderBottomRightRadius: '55% 100%',
          }}
        />
        {/* Centered heading inside the circle */}
        <div
          className="absolute left-1/2 flex justify-center w-full"
          style={{ transform: 'translateX(-50%)', zIndex: 2, top: '40px' }}
        >
          <h1
            className="font-serif font-extrabold text-white text-center tracking-wide drop-shadow-lg"
            style={{
              fontSize: '2.4rem',
              letterSpacing: '0.05em',
              lineHeight: '1.1',
              padding: '0.5rem 2rem',
              maxWidth: '85vw',
            }}
          >
            Add a Book
          </h1>
        </div>
      </div>

      {/* Form area positioned and sized for reliable layout */}
      <main
        className="flex flex-col items-center justify-center flex-grow px-2 md:px-8 pb-10"
        style={{ position: 'relative', zIndex: 2, marginTop: '-90px' }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-2xl w-full mx-auto rounded-lg shadow-lg p-8 space-y-8 border border-gray-100"
          style={{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Book Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="Enter book title"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Author *</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                type="text"
                placeholder="Enter author name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Language *</label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={uploading}
              >
                <option value="" disabled>Select Language</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={uploading}
              >
                <option value="" disabled>Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Book Description / Synopsis *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short summary (1-2 paragraphs)..."
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
              disabled={uploading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrag(setCoverFile, ['image/jpeg', 'image/png', 'image/jpg'])}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer shadow-sm transition ${
                uploading 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-indigo-400 hover:border-indigo-600 bg-white'
              }`}
              onClick={() => !uploading && coverInputRef.current.click()}
              aria-label="Upload Book Cover Image"
            >
              <input
                ref={coverInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleCoverSelect}
                disabled={uploading}
              />
              <p className={`font-semibold ${uploading ? 'text-gray-500' : 'text-indigo-700'}`}>
                Drag & drop a <br />
                Book Cover Image <br />
                <span className={`text-xs ${uploading ? 'text-gray-400' : 'text-indigo-400'}`}>
                  (.jpg, .jpeg, .png only)
                </span>
              </p>
              {coverFile && (
                <div className={`text-xs mt-2 font-medium ${uploading ? 'text-gray-600' : 'text-indigo-900'}`}>
                  Selected: {coverFile.name}
                </div>
              )}
            </div>
            
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrag(setBookFile, ['application/pdf'])}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer shadow-sm transition ${
                uploading 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-indigo-400 hover:border-indigo-600 bg-white'
              }`}
              onClick={() => !uploading && bookInputRef.current.click()}
              aria-label="Upload Book PDF File"
            >
              <input
                ref={bookInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleBookSelect}
                disabled={uploading}
              />
              <p className={`font-semibold ${uploading ? 'text-gray-500' : 'text-indigo-700'}`}>
                Drag & drop a <br />
                Book <br />
                <span className={`text-xs ${uploading ? 'text-gray-400' : 'text-indigo-400'}`}>
                  (.pdf only)
                </span>
              </p>
              {bookFile && (
                <div className={`text-xs mt-2 font-medium ${uploading ? 'text-gray-600' : 'text-indigo-900'}`}>
                  Selected: {bookFile.name}
                </div>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className={`w-full px-6 py-3 rounded-md font-semibold transition ${
              uploading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Book'
            )}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchBooks("");
  }, []);

  function fetchBooks(query = "") {
    axios
      .get("http://localhost:5000/api/books", {
        params: query ? { search: query } : {},
      })
      .then((res) => {
        const booksWithPdfUrl = res.data.map((b) => ({
          ...b,
          pdfUrl: `http://localhost:5000/api/books/${b.id}/pdf`,
          coverUrl: `http://localhost:5000/api/books/${b.id}/cover`
        }));
        setBooks(booksWithPdfUrl);
      })
      .catch(() => setBooks([]));
  }

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      fetchBooks("");
      return;
    }
    
    const timer = setTimeout(() => {
      axios
        .get("http://localhost:5000/api/books", { params: { search } })
        .then((res) => {
          const sortedBooks = res.data.sort((a, b) => 
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          );
          
          const sortedSuggestions = sortedBooks.map((b) => ({
            id: b.id,
            label: `${b.title} by ${b.author}`,
            title: b.title,
          })).slice(0, 8);
          
          const booksWithPdfUrl = sortedBooks.map((b) => ({
            ...b,
            pdfUrl: `http://localhost:5000/api/books/${b.id}/pdf`,
            coverUrl: `http://localhost:5000/api/books/${b.id}/cover`
          }));
          
          setSuggestions(sortedSuggestions);
          setBooks(booksWithPdfUrl);
        })
        .catch(() => {
          setSuggestions([]);
          setBooks([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  function handleSuggestionClick(s) {
    setSearch(s.title);
    fetchBooks(s.title);
    setSuggestions([]);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this book?")) return;
    axios
      .delete(`http://localhost:5000/api/books/${id}`)
      .then(() => {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      })
      .catch(() => {
        alert("Failed to delete book. Please try again.");
      });
  }

  function openPdfInNewTab(pdfUrl) {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("No PDF available for this book.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800">Library Admin Portal</h1>
        
        <div className="mb-6 relative max-w-md mx-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-lg border border-indigo-300 w-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          
          {suggestions.length > 0 && (
            <ul className="absolute mt-1 left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50 border-b last:border-b-0 text-gray-800"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-x-auto mt-8 rounded-lg shadow-lg border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-200">
                <th className="p-4 text-left">Cover</th>
                <th className="p-4 text-left">Book Name</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Language</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-12 h-16 relative">
                      <img 
                        src={b.coverUrl} 
                        alt={`Cover of ${b.title}`}
                        className="w-full h-full object-cover rounded shadow"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center bg-gray-100 rounded text-xs text-gray-400">
                        No Cover
                      </div>
                    </div>
                  </td>
                  <td
                    className="p-4 font-semibold text-indigo-700 cursor-pointer hover:underline transition"
                    onClick={() => openPdfInNewTab(b.pdfUrl)}
                    title="Click to open PDF"
                  >
                    {b.title}
                  </td>
                  <td className="p-4 text-gray-700">{b.author}</td>
                  <td className="p-4 text-gray-600">{b.category || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{b.language || 'N/A'}</td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 text-sm transition"
                        onClick={() => openPdfInNewTab(b.pdfUrl)}
                        title="View PDF"
                      >
                        View
                      </button>
                      <button
                        className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 text-sm transition"
                        onClick={() => handleDelete(b.id)}
                        title="Delete Book"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📚</div>
                      <div>No books found.</div>
                      <div className="text-sm mt-1">Try adjusting your search terms</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-white rounded-lg shadow px-4 py-2 border">
            <span className="text-gray-600 mr-2">Total Books:</span>
            <span className="font-semibold text-indigo-700 text-lg">{books.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

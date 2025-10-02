const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'library.db'));

// Add blob columns if not exist (run once)
db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    language TEXT,
    category TEXT,
    description TEXT,
    book_path TEXT,
    cover_path TEXT,
    book_blob BLOB,
    cover_blob BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Multer setup with memory storage (store buffer in memory not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'book') {
      if (file.mimetype === 'application/pdf') cb(null, true);
      else cb(new Error('Only PDF files allowed for book.'));
    } else if (file.fieldname === 'cover') {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) cb(null, true);
      else cb(new Error('Only JPG, JPEG, PNG images allowed for cover.'));
    } else {
      cb(null, false);
    }
  }
});

// Upload route (store files as blobs)
app.post('/api/books/upload', upload.fields([
  { name: 'book', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), (req, res) => {
  const { title, author, language, category, description } = req.body;
  const bookFile = req.files?.book?.[0];
  const coverFile = req.files?.cover?.[0];

  if (!title || !author) return res.status(400).json({ error: 'Title and Author are required.' });
  if (!bookFile) return res.status(400).json({ error: 'Book PDF file is required.' });
  if (!coverFile) return res.status(400).json({ error: 'Book cover image is required.' });

  // Use buffers directly from multer memory storage
  const bookBuffer = bookFile.buffer;
  const coverBuffer = coverFile.buffer;

  // Insert metadata and blob
  try {
    const stmt = db.prepare(`
      INSERT INTO books 
      (title, author, language, category, description, book_blob, cover_blob)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      author,
      language || null,
      category || null,
      description || null,
      bookBuffer,
      coverBuffer
    );
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('DB insert error:', error);
    res.status(500).json({ error: 'Failed to store book metadata' });
  }
});

// Serve blobs on request: PDF
app.get('/api/books/:id/pdf', (req, res) => {
  try {
    const row = db.prepare('SELECT book_blob FROM books WHERE id = ?').get(req.params.id);
    if (!row || !row.book_blob) return res.status(404).send('PDF not found');
    res.contentType('application/pdf');
    res.send(row.book_blob);
  } catch (error) {
    console.error('Error fetching PDF blob:', error);
    res.status(500).send('Internal server error');
  }
});

// Serve blobs on request: Cover
app.get('/api/books/:id/cover', (req, res) => {
  try {
    const row = db.prepare('SELECT cover_blob FROM books WHERE id = ?').get(req.params.id);
    if (!row || !row.cover_blob) return res.status(404).send('Cover not found');
    // For simplicity, assuming JPEG; adapt based on actual type if needed
    res.contentType('image/jpeg');
    res.send(row.cover_blob);
  } catch (error) {
    console.error('Error fetching cover blob:', error);
    res.status(500).send('Internal server error');
  }
});

// Fetch books metadata (don't send blobs here for bandwidth)
app.get('/api/books', (req, res) => {
  const { search, language, category } = req.query;
  let sql = 'SELECT id, title, author, language, category, description, created_at FROM books WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (language) {
    sql += ' AND language = ?';
    params.push(language);
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY created_at DESC';

  try {
    const rows = db.prepare(sql).all(...params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Fetch single book metadata (no blobs)
app.get('/api/books/:id', (req, res) => {
  try {
    const book = db.prepare('SELECT id, title, author, language, category, description, created_at FROM books WHERE id = ?').get(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Book not found or already deleted' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

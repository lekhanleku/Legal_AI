const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first
dotenv.config();

// Initialize SQLite Database
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable Chrome/Edge Private Network Access (PNA) for local and file:// origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Serve static frontend files (index.html, style.css, script.js, hero.png)
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/lawyers', require('./routes/lawyers'));
app.use('/api/courts', require('./routes/courts'));
app.use('/api/articles', require('./routes/articles'));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LegalAI API is running smoothly' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 LegalAI Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  [PORT BUSY] Port ${PORT} is already in use by another process.`);
    console.error(`If LegalAI is already running in another window, you can open http://localhost:${PORT} in your browser.`);
    console.error(`To restart, close the existing window or kill the process using port ${PORT}.\n`);
  } else {
    console.error('❌ Server startup error:', err);
  }
});


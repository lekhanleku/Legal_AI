const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const User = require('../models/User');
const { processLegalQuery, LEGAL_DOMAINS } = require('../services/aiService');

// Optional auth helper: decodes user token if provided
const extractUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return User.findById(decoded.id) || null;
  } catch (err) {
    return null;
  }
};

// @route   POST /api/ai/chat
// @desc    Send a message to the LegalAI Assistant
// @access  Public (Enhanced with user context if authenticated)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid message prompt is required.'
      });
    }

    const user = extractUser(req);
    const userId = user ? user.id : null;

    // Process query through AI Service
    const aiResult = await processLegalQuery({
      prompt: message,
      user,
      history: []
    });

    // Persist conversation in SQLite
    try {
      const insertStmt = db.prepare(`
        INSERT INTO ai_chats (userId, role, message, category)
        VALUES (?, ?, ?, ?)
      `);

      // Store user prompt
      insertStmt.run(userId, 'user', message.trim(), aiResult.category);
      // Store assistant response
      insertStmt.run(userId, 'assistant', aiResult.text, aiResult.category);
    } catch (dbErr) {
      console.warn('⚠️ Could not persist chat in SQLite:', dbErr.message);
    }

    return res.json({
      success: true,
      response: aiResult.text,
      category: aiResult.category,
      suggestedLawyer: aiResult.suggestedLawyer,
      suggestedCourt: aiResult.suggestedCourt,
      timestamp: aiResult.timestamp,
      user: user ? { id: user.id, name: user.name } : null
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error processing legal query: ' + err.message
    });
  }
});

// @route   GET /api/ai/history
// @desc    Retrieve chat history for the authenticated user
// @access  Private
router.get('/history', (req, res) => {
  const user = extractUser(req);
  if (!user) {
    return res.json({ success: true, history: [] });
  }

  try {
    const stmt = db.prepare(`
      SELECT id, role, message, category, timestamp
      FROM ai_chats
      WHERE userId = ?
      ORDER BY id ASC
      LIMIT 50
    `);

    const rows = stmt.all(user.id);
    return res.json({ success: true, history: rows });
  } catch (err) {
    console.error('AI History Error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch history' });
  }
});

// @route   DELETE /api/ai/history
// @desc    Clear chat history for the authenticated user
// @access  Private
router.delete('/history', (req, res) => {
  const user = extractUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const stmt = db.prepare('DELETE FROM ai_chats WHERE userId = ?');
    stmt.run(user.id);
    return res.json({ success: true, message: 'Chat history cleared successfully' });
  } catch (err) {
    console.error('Clear History Error:', err);
    return res.status(500).json({ success: false, message: 'Could not clear history' });
  }
});

// @route   GET /api/ai/domains
// @desc    Get supported legal practice domains and starter prompts
// @access  Public
router.get('/domains', (req, res) => {
  const samplePrompts = [
    { label: 'Tenant Rights', prompt: 'What are my legal rights if my landlord refuses to return my security deposit?' },
    { label: 'LLC vs S-Corp', prompt: 'What are the legal liabilities and differences between forming an LLC and an S-Corp?' },
    { label: 'Police Interrogation', prompt: 'What are my 5th and 6th Amendment rights during a police investigation?' },
    { label: 'Breach of Contract', prompt: 'A client breached our signed services agreement and refuses payment. What are my legal steps?' },
    { label: 'Wrongful Termination', prompt: 'I was fired after reporting workplace safety issues. Do I have a wrongful termination claim?' }
  ];

  return res.json({
    success: true,
    domains: LEGAL_DOMAINS.map(d => ({ id: d.id, name: d.name, specialty: d.attorneyRole })),
    samplePrompts
  });
});

module.exports = router;

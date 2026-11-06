const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const Case = require('../models/Case');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');

// Helper to authenticate lawyer from Bearer token
function authenticateLawyer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in database' });
    }

    // Resolve lawyer record
    let lawyer = null;
    if (user.lawyerId) {
      lawyer = Lawyer.findById(user.lawyerId);
    }
    if (!lawyer && user.email) {
      const stmt = db.prepare('SELECT * FROM lawyers WHERE LOWER(email) = LOWER(?)');
      lawyer = stmt.get(user.email);
    }
    if (!lawyer && user.name) {
      const stmt = db.prepare('SELECT * FROM lawyers WHERE LOWER(name) LIKE ? LIMIT 1');
      lawyer = stmt.get(`%${user.name.toLowerCase().trim()}%`);
    }

    // Fallback to first lawyer if user is an admin or testing
    if (!lawyer && user.role === 'admin') {
      lawyer = db.prepare('SELECT * FROM lawyers ORDER BY id ASC LIMIT 1').get();
    }

    if (!lawyer) {
      return res.status(403).json({
        success: false,
        message: 'This account is not associated with an authorized advocate/lawyer profile.'
      });
    }

    req.user = user;
    req.lawyer = lawyer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
}

// ── GET /api/lawyer/profile ──
router.get('/profile', authenticateLawyer, (req, res) => {
  const stats = Case.getStats(req.lawyer.id);
  res.json({
    success: true,
    lawyer: req.lawyer,
    user: req.user,
    stats
  });
});

// ── GET /api/lawyer/cases ──
router.get('/cases', authenticateLawyer, (req, res) => {
  const { search = '', status = '', court = '', limit = 100, offset = 0 } = req.query;
  const cases = Case.findByLawyerId(req.lawyer.id, { search, status, court, limit, offset });
  const stats = Case.getStats(req.lawyer.id);

  res.json({
    success: true,
    total: cases.length,
    cases,
    stats,
    lawyer: {
      id: req.lawyer.id,
      name: req.lawyer.name,
      specialty: req.lawyer.specialty,
      firmName: req.lawyer.firmName,
      primaryCourt: req.lawyer.primaryCourt
    }
  });
});

// ── GET /api/lawyer/cases/:id ──
router.get('/cases/:id', authenticateLawyer, (req, res) => {
  const cs = Case.findById(req.params.id);
  if (!cs || Number(cs.lawyerId) !== Number(req.lawyer.id)) {
    return res.status(404).json({ success: false, message: 'Case not found or does not belong to this lawyer' });
  }
  res.json({ success: true, case: cs });
});

// ── PUT /api/lawyer/cases/:id ──
router.put('/cases/:id', authenticateLawyer, (req, res) => {
  const cs = Case.findById(req.params.id);
  if (!cs || Number(cs.lawyerId) !== Number(req.lawyer.id)) {
    return res.status(404).json({ success: false, message: 'Case not found or does not belong to this lawyer' });
  }

  const { status, stage, nextHearingDate, hearingTime, lawyerNotes, bench } = req.body;
  const updated = Case.update(req.params.id, { status, stage, nextHearingDate, hearingTime, lawyerNotes, bench });

  res.json({
    success: true,
    message: 'Case docket updated successfully',
    case: updated
  });
});

// ── POST /api/lawyer/cases ──
router.post('/cases', authenticateLawyer, (req, res) => {
  const {
    caseNumber, title, clientName, clientEmail, clientPhone,
    opposingParty, opposingCounsel, courtCode, courtName, bench,
    practiceArea, relevantActs, nextHearingDate, hearingTime, stage,
    status, disputeValue, caseSummary, lawyerNotes
  } = req.body;

  if (!title || !clientName) {
    return res.status(400).json({ success: false, message: 'Case title and Client Name are required.' });
  }

  // Generate unique case number if omitted
  const finalCaseNumber = caseNumber && caseNumber.trim() 
    ? caseNumber.trim() 
    : `DOCK/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

  // Check duplicate
  const existing = Case.findByCaseNumber(finalCaseNumber);
  if (existing) {
    return res.status(400).json({ success: false, message: 'A case with this Case Number already exists.' });
  }

  const newCase = Case.create({
    caseNumber: finalCaseNumber,
    title,
    lawyerId: req.lawyer.id,
    clientName,
    clientEmail: clientEmail || '',
    clientPhone: clientPhone || '',
    opposingParty: opposingParty || 'Opposing Party / State',
    opposingCounsel: opposingCounsel || '',
    courtCode: courtCode || (req.lawyer.courtCodes || 'SCI').split(',')[0],
    courtName: courtName || req.lawyer.primaryCourt || 'Supreme Court of India',
    bench: bench || 'Principal Division Bench',
    practiceArea: practiceArea || req.lawyer.specialty || 'General Litigation',
    relevantActs: relevantActs || 'Bharatiya Nagarik Suraksha Sanhita / CPC',
    nextHearingDate: nextHearingDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    hearingTime: hearingTime || '10:30 AM IST',
    stage: stage || 'Notice & Admission',
    status: status || 'Active Hearing',
    disputeValue: disputeValue || '',
    caseSummary: caseSummary || 'Matter filed before the Hon\'ble Court.',
    lawyerNotes: lawyerNotes || 'Initial case registration memo.'
  });

  res.status(201).json({
    success: true,
    message: 'New case docket created successfully',
    case: newCase
  });
});

// ── GET /api/lawyer/consultations ──
router.get('/consultations', authenticateLawyer, (req, res) => {
  const consults = db.prepare(`
    SELECT * FROM consultations 
    WHERE lawyerId = ? 
    ORDER BY id DESC
  `).all(req.lawyer.id);

  res.json({
    success: true,
    total: consults.length,
    consultations: consults
  });
});

// ── PUT /api/lawyer/consultations/:id ──
router.put('/consultations/:id', authenticateLawyer, (req, res) => {
  const consult = db.prepare('SELECT * FROM consultations WHERE id = ? AND lawyerId = ?').get(req.params.id, req.lawyer.id);
  if (!consult) {
    return res.status(404).json({ success: false, message: 'Consultation not found for this lawyer' });
  }

  const { status, preferredDate } = req.body;
  const updates = [];
  const params = [];

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (preferredDate) {
    updates.push('preferredDate = ?');
    params.push(preferredDate);
  }

  if (updates.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE consultations SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  const updatedConsult = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);
  res.json({
    success: true,
    message: 'Consultation updated successfully',
    consultation: updatedConsult
  });
});

// ── GET /api/lawyer/all-lawyers (For "Switch Lawyer" dropdown across all 54 advocates) ──
router.get('/all-lawyers', (req, res) => {
  const lawyers = db.prepare(`
    SELECT l.id, l.name, l.title, l.specialty, l.firmName, l.city, l.barNumber, l.email, l.avatarUrl, l.primaryCourt,
           (SELECT count(*) FROM cases WHERE lawyerId = l.id) as caseCount,
           (SELECT count(*) FROM consultations WHERE lawyerId = l.id) as consultCount
    FROM lawyers l
    ORDER BY l.name ASC
  `).all();

  res.json({
    success: true,
    total: lawyers.length,
    lawyers
  });
});

// ── POST /api/lawyer/switch-lawyer (Instant demo/test switch to any lawyer) ──
router.post('/switch-lawyer', (req, res) => {
  const { lawyerId } = req.body;
  if (!lawyerId) {
    return res.status(400).json({ success: false, message: 'lawyerId is required' });
  }

  const lawyer = Lawyer.findById(lawyerId);
  if (!lawyer) {
    return res.status(404).json({ success: false, message: 'Lawyer not found' });
  }

  // Find or create matching user record
  let user = db.prepare('SELECT * FROM users WHERE lawyerId = ? OR LOWER(email) = LOWER(?)').get(lawyer.id, lawyer.email);
  if (!user) {
    const defaultPasswordHash = '$2a$08$K6qG25c.XwA30XWqQ96uueD9v8lR0wE8W1501d5oX46k26pL5O'; // 'lawyer1234'
    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, isVerified, lawyerId)
      VALUES (?, ?, ?, ?, 'lawyer', 1, ?)
    `).run(lawyer.name, lawyer.email.toLowerCase().trim(), defaultPasswordHash, lawyer.phone || '', lawyer.id);
    user = User.findById(result.lastInsertRowid);
  } else if (user.role !== 'lawyer' || user.lawyerId !== lawyer.id) {
    db.prepare('UPDATE users SET role = "lawyer", lawyerId = ? WHERE id = ?').run(lawyer.id, user.id);
    user = User.findById(user.id);
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: 'lawyer', lawyerId: lawyer.id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const stats = Case.getStats(lawyer.id);

  res.json({
    success: true,
    message: `Switched session to ${lawyer.name}`,
    token,
    user: {
      id: user.id,
      name: lawyer.name,
      email: user.email,
      phone: lawyer.phone || user.phone || '',
      role: 'lawyer',
      lawyerId: lawyer.id
    },
    lawyer,
    stats
  });
});

// ── GET /api/lawyer/notifications ──
router.get('/notifications', authenticateLawyer, (req, res) => {
  const notifs = db.prepare(`
    SELECT * FROM notifications 
    WHERE lawyerId = ? 
    ORDER BY id DESC LIMIT 50
  `).all(req.lawyer.id);

  const unreadCount = db.prepare(`
    SELECT count(*) as c FROM notifications 
    WHERE lawyerId = ? AND isRead = 0
  `).get(req.lawyer.id)?.c || 0;

  res.json({
    success: true,
    total: notifs.length,
    unreadCount,
    notifications: notifs
  });
});

// ── PUT /api/lawyer/notifications/:id/read ──
router.put('/notifications/:id/read', authenticateLawyer, (req, res) => {
  db.prepare(`
    UPDATE notifications SET isRead = 1 
    WHERE id = ? AND lawyerId = ?
  `).run(req.params.id, req.lawyer.id);

  const unreadCount = db.prepare(`
    SELECT count(*) as c FROM notifications 
    WHERE lawyerId = ? AND isRead = 0
  `).get(req.lawyer.id)?.c || 0;

  res.json({ success: true, message: 'Notification marked as read', unreadCount });
});

// ── PUT /api/lawyer/notifications/mark-all-read ──
router.put('/notifications/mark-all-read', authenticateLawyer, (req, res) => {
  db.prepare(`
    UPDATE notifications SET isRead = 1 
    WHERE lawyerId = ?
  `).run(req.lawyer.id);

  res.json({ success: true, message: 'All notifications marked as read', unreadCount: 0 });
});

// ── DELETE /api/lawyer/notifications/:id ──
router.delete('/notifications/:id', authenticateLawyer, (req, res) => {
  db.prepare(`
    DELETE FROM notifications 
    WHERE id = ? AND lawyerId = ?
  `).run(req.params.id, req.lawyer.id);

  const unreadCount = db.prepare(`
    SELECT count(*) as c FROM notifications 
    WHERE lawyerId = ? AND isRead = 0
  `).get(req.lawyer.id)?.c || 0;

  res.json({ success: true, message: 'Notification deleted', unreadCount });
});

module.exports = router;


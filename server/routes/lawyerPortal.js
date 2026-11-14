const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const Case = require('../models/Case');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');
const AdvocateAccount = require('../models/AdvocateAccount');

// Helper to authenticate lawyer from Bearer token
function authenticateLawyer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Strict boundary: Client accounts cannot enter Advocate Chambers
    if (decoded.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Client accounts cannot access Advocate Chambers.'
      });
    }

    let advocate = null;
    if (decoded.role === 'lawyer') {
      if (decoded.lawyerId) {
        advocate = AdvocateAccount.findByLawyerId(decoded.lawyerId);
      }
      if (!advocate && decoded.id) {
        advocate = AdvocateAccount.findById(decoded.id);
      }
      if (!advocate && decoded.email) {
        advocate = AdvocateAccount.findByEmail(decoded.email);
      }
    } else if (decoded.role === 'admin') {
      // Administrator session: select requested lawyer or first advocate
      const targetLawyerId = req.query.lawyerId || req.body.lawyerId;
      if (targetLawyerId) {
        advocate = AdvocateAccount.findByLawyerId(Number(targetLawyerId));
      }
      if (!advocate) {
        advocate = db.prepare('SELECT * FROM advocate_accounts ORDER BY id ASC LIMIT 1').get();
      }
    }

    if (!advocate) {
      return res.status(403).json({
        success: false,
        message: 'This account is not enrolled in the Advocate Chambers registry.'
      });
    }

    const lawyer = Lawyer.findById(advocate.lawyerId);
    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Advocate profile record not found in system directory.'
      });
    }

    req.user = advocate;
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

// ── POST /api/lawyer/switch-lawyer (Protected Administrator Session Switching) ──
router.post('/switch-lawyer', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Unauthenticated lawyer account switching is prohibited. Please sign in with advocate credentials.'
    });
  }

  try {
    const callerToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(callerToken, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin' && decoded.role !== 'lawyer') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only administrators or verified advocates can switch chambers sessions.'
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid authentication credentials for session switching.'
    });
  }

  const { lawyerId } = req.body;
  if (!lawyerId) {
    return res.status(400).json({ success: false, message: 'lawyerId is required' });
  }

  const lawyer = Lawyer.findById(lawyerId);
  if (!lawyer) {
    return res.status(404).json({ success: false, message: 'Lawyer not found' });
  }

  // Lookup in isolated advocate_accounts table
  let advocate = AdvocateAccount.findByLawyerId(lawyer.id);
  if (!advocate) {
    advocate = AdvocateAccount.findByEmail(lawyer.email);
  }

  if (!advocate) {
    return res.status(404).json({ success: false, message: 'No advocate account registered for this lawyer.' });
  }

  const token = jwt.sign(
    { id: advocate.id, name: advocate.name, email: advocate.email, role: 'lawyer', lawyerId: lawyer.id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const stats = Case.getStats(lawyer.id);

  res.json({
    success: true,
    message: `Switched session to ${lawyer.name}`,
    token,
    user: {
      id: advocate.id,
      name: lawyer.name,
      email: advocate.email,
      phone: lawyer.phone || advocate.phone || '',
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


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

// ── PUT /api/lawyer/consultations/:id (Advocate updates client consultation status or notes) ──
router.put('/consultations/:id', authenticateLawyer, (req, res) => {
  const consult = db.prepare('SELECT * FROM consultations WHERE id = ? AND lawyerId = ?').get(req.params.id, req.lawyer.id);
  if (!consult) {
    return res.status(404).json({ success: false, message: 'Consultation not found for this lawyer' });
  }

  const { status, preferredDate, caseSummary } = req.body;
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
  if (caseSummary) {
    updates.push('caseSummary = ?');
    params.push(caseSummary);
  }

  if (updates.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE consultations SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  const updatedConsult = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);
  res.json({
    success: true,
    message: `Consultation #${req.params.id} updated successfully`,
    consultation: updatedConsult
  });
});

// ── DELETE /api/lawyer/consultations/:id (Advocate cancels/removes consultation) ──
router.delete('/consultations/:id', authenticateLawyer, (req, res) => {
  const consult = db.prepare('SELECT * FROM consultations WHERE id = ? AND lawyerId = ?').get(req.params.id, req.lawyer.id);
  if (!consult) {
    return res.status(404).json({ success: false, message: 'Consultation not found for this lawyer' });
  }

  db.prepare('DELETE FROM consultations WHERE id = ?').run(req.params.id);
  db.prepare('DELETE FROM notifications WHERE consultationId = ?').run(req.params.id);

  res.json({
    success: true,
    message: `Consultation #${req.params.id} removed from docket`
  });
});

// ── DELETE /api/lawyer/consultations/all (Advocate clears all consultations for their chambers) ──
router.delete(['/consultations/all', '/consultations/clear-all'], authenticateLawyer, (req, res) => {
  const count = db.prepare('DELETE FROM consultations WHERE lawyerId = ?').run(req.lawyer.id).changes;
  db.prepare('DELETE FROM notifications WHERE lawyerId = ? AND (type = "booking" OR consultationId IS NOT NULL)').run(req.lawyer.id);
  res.json({
    success: true,
    message: `All (${count}) consultations cleared from chambers docket`,
    clearedCount: count
  });
});

// ── GET /api/lawyer/clients (Advocate lists all clients represented by or consulting with their chambers) ──
router.get('/clients', authenticateLawyer, (req, res) => {
  const lawyerId = req.lawyer.id;
  const { search = '' } = req.query;

  let query = `
    WITH all_clients AS (
      SELECT clientName as name, LOWER(clientEmail) as email, clientPhone as phone, filingDate as activityDate
      FROM cases 
      WHERE lawyerId = ? AND clientEmail IS NOT NULL AND clientEmail != ''
      UNION ALL
      SELECT clientName as name, LOWER(clientEmail) as email, clientPhone as phone, createdAt as activityDate
      FROM consultations 
      WHERE lawyerId = ? AND clientEmail IS NOT NULL AND clientEmail != ''
    )
    SELECT 
      name,
      email,
      phone,
      (SELECT COUNT(*) FROM cases WHERE lawyerId = ? AND LOWER(clientEmail) = all_clients.email) as caseCount,
      (SELECT COUNT(*) FROM consultations WHERE lawyerId = ? AND LOWER(clientEmail) = all_clients.email) as consultCount,
      MAX(activityDate) as lastActivityDate
    FROM all_clients
    WHERE 1=1
  `;
  const params = [lawyerId, lawyerId, lawyerId, lawyerId];

  if (search && search.trim()) {
    const s = `%${search.trim().toLowerCase()}%`;
    query += ' AND (LOWER(name) LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(s, s, s);
  }

  query += ' GROUP BY email ORDER BY lastActivityDate DESC';

  const clients = db.prepare(query).all(...params);
  res.json({
    success: true,
    total: clients.length,
    clients
  });
});

// ── GET /api/lawyer/clients/:email/dossier (Advocate views full client dossier with litigation history) ──
router.get('/clients/:email/dossier', authenticateLawyer, (req, res) => {
  const lawyerId = req.lawyer.id;
  const cleanEmail = req.params.email.toLowerCase().trim();

  // Find client cases with this lawyer
  const cases = db.prepare(`
    SELECT * FROM cases 
    WHERE lawyerId = ? AND LOWER(clientEmail) = ?
    ORDER BY id DESC
  `).all(lawyerId, cleanEmail);

  // Find client consultations with this lawyer
  const consultations = db.prepare(`
    SELECT * FROM consultations 
    WHERE lawyerId = ? AND LOWER(clientEmail) = ?
    ORDER BY id DESC
  `).all(lawyerId, cleanEmail);

  // Find user account in users table
  const userAccount = db.prepare('SELECT id, name, email, phone, isVerified, createdAt FROM users WHERE LOWER(email) = ?').get(cleanEmail);

  const clientName = cases[0]?.clientName || consultations[0]?.clientName || userAccount?.name || 'Client';
  const clientPhone = cases[0]?.clientPhone || consultations[0]?.clientPhone || userAccount?.phone || '';

  res.json({
    success: true,
    client: {
      name: clientName,
      email: cleanEmail,
      phone: clientPhone,
      isRegistered: !!userAccount,
      isVerified: userAccount ? userAccount.isVerified : 0,
      registeredAt: userAccount ? userAccount.createdAt : null,
      totalCases: cases.length,
      totalConsultations: consultations.length,
      cases,
      consultations
    }
  });
});

// ── POST /api/lawyer/clients (Advocate registers/intakes a new client under chambers) ──
router.post('/clients', authenticateLawyer, async (req, res) => {
  const { name, email, phone, caseSummary, preferredDate } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Client name and email are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const bcrypt = require('bcryptjs');

  // Find or create in users table
  let user = db.prepare('SELECT id, name, email, phone FROM users WHERE LOWER(email) = ?').get(cleanEmail);
  if (!user) {
    const defaultPassword = 'demo1234';
    const hash = await bcrypt.hash(defaultPassword, 10);
    const r = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, isVerified)
      VALUES (?, ?, ?, ?, 'user', 1)
    `).run(name, cleanEmail, hash, phone || '');
    user = { id: r.lastInsertRowid, name, email: cleanEmail, phone };
  }

  // Schedule an intake consultation if summary provided
  let consult = null;
  if (caseSummary) {
    const cResult = db.prepare(`
      INSERT INTO consultations (lawyerId, userId, clientName, clientEmail, clientPhone, preferredDate, caseSummary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `).run(
      req.lawyer.id,
      user.id,
      name,
      cleanEmail,
      phone || '',
      preferredDate || new Date().toISOString().split('T')[0] + ' 11:00 AM',
      caseSummary
    );
    consult = db.prepare('SELECT * FROM consultations WHERE id = ?').get(cResult.lastInsertRowid);
  }

  res.status(201).json({
    success: true,
    message: `Client ${name} registered under Chambers of ${req.lawyer.name}.`,
    client: user,
    consultation: consult
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


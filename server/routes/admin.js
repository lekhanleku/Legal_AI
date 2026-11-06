const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Court = require('../models/Court');
const Case = require('../models/Case');

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
    }

    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
}

// @route   GET /api/admin/stats
// @desc    Get aggregate platform metrics, analytics, and operational health
// @access  Admin
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const userStats = User.getStats();
    const lawyerStats = Lawyer.getStats();
    const consultStats = Lawyer.getConsultationStats();
    const courtStats = Court.getStats();
    const caseStats = Case.getAdminStats();

    // AI chat metrics
    const totalAIChats = db.prepare('SELECT COUNT(*) as count FROM ai_chats').get().count;
    const aiCategories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM ai_chats 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 6
    `).all();

    // Recent consultation activities
    const recentConsultations = db.prepare(`
      SELECT c.id, c.clientName, c.clientEmail, c.preferredDate, c.status, c.createdAt,
             l.name as lawyerName, l.specialty as lawyerSpecialty
      FROM consultations c
      JOIN lawyers l ON c.lawyerId = l.id
      ORDER BY c.id DESC
      LIMIT 8
    `).all();

    return res.json({
      success: true,
      stats: {
        users: userStats,
        lawyers: lawyerStats,
        consultations: consultStats,
        courts: courtStats,
        cases: caseStats,
        ai: {
          totalQueries: totalAIChats,
          topCategories: aiCategories
        },
        recentConsultations
      }
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch platform stats: ' + err.message });
  }
});

// @route   GET /api/admin/users
// @desc    List all users with search, role filtering, and pagination
// @access  Admin
router.get('/users', requireAdmin, (req, res) => {
  try {
    const { search, role, limit = 50, offset = 0 } = req.query;
    const result = User.findAll({ search, role, limit, offset });
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('Admin Users Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user/lawyer/admin directly from admin panel
// @access  Admin
router.post('/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const newUser = await User.create({ name, email, password, role });
    return res.status(201).json({ success: true, user: newUser, message: 'User account created successfully' });
  } catch (err) {
    console.error('Admin Create User Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change a user's role (user, lawyer, admin)
// @access  Admin
router.put('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'lawyer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const targetUser = User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent removing admin privileges from oneself if it's the current user
    if (req.admin.id === Number(req.params.id) && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot revoke your own administrator status.' });
    }

    const updated = await User.update(req.params.id, { role });
    return res.json({ success: true, user: updated, message: `User role updated to ${role}` });
  } catch (err) {
    console.error('Admin Update Role Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Toggle user verification flag
// @access  Admin
router.put('/users/:id/verify', requireAdmin, async (req, res) => {
  try {
    const targetUser = User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStatus = targetUser.isVerified ? 0 : 1;
    const updated = await User.update(req.params.id, { isVerified: newStatus });
    return res.json({ success: true, user: updated, message: `User verification updated to ${newStatus === 1 ? 'Verified' : 'Unverified'}` });
  } catch (err) {
    console.error('Admin Verify User Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user account
// @access  Admin
router.delete('/users/:id', requireAdmin, (req, res) => {
  try {
    if (req.admin.id === Number(req.params.id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const success = User.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User account removed successfully' });
  } catch (err) {
    console.error('Admin Delete User Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/consultations
// @desc    List all platform consultations with status and search
// @access  Admin
router.get('/consultations', requireAdmin, (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    const result = Lawyer.getAllConsultations({ status, search, limit, offset });
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('Admin Consultations Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/consultations/:id/status
// @desc    Update consultation status (pending, confirmed, completed, cancelled)
// @access  Admin
router.put('/consultations/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const success = Lawyer.updateConsultationStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }
    return res.json({ success: true, message: `Consultation status updated to ${status}` });
  } catch (err) {
    console.error('Admin Update Consultation Status Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/consultations/:id
// @desc    Delete consultation record permanently
// @access  Admin
router.delete('/consultations/:id', requireAdmin, (req, res) => {
  try {
    const success = Lawyer.deleteConsultation(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }
    return res.json({ success: true, message: 'Consultation deleted successfully' });
  } catch (err) {
    console.error('Admin Delete Consultation Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/lawyers
// @desc    Get all lawyers in the directory with administrative details
// @access  Admin
router.get('/lawyers', requireAdmin, (req, res) => {
  try {
    const { search, specialty, limit = 100 } = req.query;
    const lawyers = Lawyer.findAll({ search, specialty, limit });
    return res.json({ success: true, lawyers, count: lawyers.length });
  } catch (err) {
    console.error('Admin Fetch Lawyers Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/lawyers
// @desc    Add new attorney to directory
// @access  Admin
router.post('/lawyers', requireAdmin, (req, res) => {
  try {
    const lawyer = Lawyer.create(req.body);
    return res.status(201).json({ success: true, lawyer, message: 'Attorney added to verified directory' });
  } catch (err) {
    console.error('Admin Add Lawyer Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/lawyers/:id
// @desc    Get single lawyer profile for admin inspection or editing
// @access  Admin
router.get('/lawyers/:id', requireAdmin, (req, res) => {
  try {
    const lawyer = Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Attorney not found' });
    }
    return res.json({ success: true, lawyer });
  } catch (err) {
    console.error('Admin Get Lawyer Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/lawyers/:id
// @desc    Update lawyer profile
// @access  Admin
router.put('/lawyers/:id', requireAdmin, (req, res) => {
  try {
    const updated = Lawyer.update(req.params.id, req.body);
    return res.json({ success: true, lawyer: updated, message: 'Attorney profile updated' });
  } catch (err) {
    console.error('Admin Update Lawyer Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/lawyers/:id
// @desc    Remove lawyer from directory
// @access  Admin
router.delete('/lawyers/:id', requireAdmin, (req, res) => {
  try {
    const success = Lawyer.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }
    return res.json({ success: true, message: 'Attorney removed from directory' });
  } catch (err) {
    console.error('Admin Delete Lawyer Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ================================================================
// COURTS DIRECTORY ADMINISTRATION
// ================================================================

// @route   GET /api/admin/courts
// @desc    Get all courts for administrative control
// @access  Admin
router.get('/courts', requireAdmin, (req, res) => {
  try {
    const { search, jurisdiction, state, limit = 100 } = req.query;
    const courts = Court.findAllAdmin({ search, jurisdiction, state, limit });
    return res.json({ success: true, courts, count: courts.length });
  } catch (err) {
    console.error('Admin Fetch Courts Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/courts/:id
// @desc    Get single court details
// @access  Admin
router.get('/courts/:id', requireAdmin, (req, res) => {
  try {
    const court = Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court venue not found' });
    }
    return res.json({ success: true, court });
  } catch (err) {
    console.error('Admin Get Court Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/courts
// @desc    Add new court venue to directory
// @access  Admin
router.post('/courts', requireAdmin, (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Court name is required.' });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Court unique identifier code is required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = Court.findByCode(cleanCode);
    if (existing) {
      return res.status(400).json({ success: false, message: `A court venue with code "${cleanCode}" already exists.` });
    }

    const payload = {
      ...req.body,
      name: name.trim(),
      code: cleanCode
    };

    const court = Court.create(payload);
    return res.status(201).json({ success: true, court, message: 'Court venue successfully added to directory' });
  } catch (err) {
    console.error('Admin Add Court Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/courts/:id
// @desc    Update court venue details or availability
// @access  Admin
router.put('/courts/:id', requireAdmin, (req, res) => {
  try {
    const existing = Court.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Court venue not found' });
    }

    if (req.body.code && req.body.code.trim().toUpperCase() !== existing.code) {
      const cleanCode = req.body.code.trim().toUpperCase();
      const codeTaken = Court.findByCode(cleanCode);
      if (codeTaken && codeTaken.id !== existing.id) {
        return res.status(400).json({ success: false, message: `Court code "${cleanCode}" is already in use by another venue.` });
      }
      req.body.code = cleanCode;
    }

    const updated = Court.update(req.params.id, req.body);
    return res.json({ success: true, court: updated, message: 'Court venue details updated successfully' });
  } catch (err) {
    console.error('Admin Update Court Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/courts/:id
// @desc    Delete court venue from directory
// @access  Admin
router.delete('/courts/:id', requireAdmin, (req, res) => {
  try {
    const success = Court.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Court venue not found' });
    }
    return res.json({ success: true, message: 'Court venue removed from directory' });
  } catch (err) {
    console.error('Admin Delete Court Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/chats
// @desc    Inspect recent AI interactions, queries, and categories
// @access  Admin
router.get('/chats', requireAdmin, (req, res) => {
  try {
    const chats = db.prepare(`
      SELECT c.id, c.userId, c.role, c.message, c.category, c.timestamp,
             u.name as userName, u.email as userEmail
      FROM ai_chats c
      LEFT JOIN users u ON c.userId = u.id
      ORDER BY c.id DESC
      LIMIT 50
    `).all();

    return res.json({ success: true, chats });
  } catch (err) {
    console.error('Admin Chats Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ================================================================
// COURT CASES & LITIGATION DOCKETS ADMINISTRATION
// ================================================================

// @route   GET /api/admin/cases
// @desc    Get all court dockets across all lawyers with search, filters, pagination
// @access  Admin
router.get('/cases', requireAdmin, (req, res) => {
  try {
    const { search, status, court, lawyerId, limit = 100, offset = 0 } = req.query;
    const result = Case.findAllAdmin({ search, status, court, lawyerId, limit, offset });
    const stats = Case.getAdminStats();
    return res.json({ success: true, ...result, stats });
  } catch (err) {
    console.error('Admin Cases Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/cases/stats
// @desc    Get summary statistics for litigation cases
// @access  Admin
router.get('/cases/stats', requireAdmin, (req, res) => {
  try {
    const stats = Case.getAdminStats();
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/cases/:id
// @desc    Get single case docket details with attorney and court data
// @access  Admin
router.get('/cases/:id', requireAdmin, (req, res) => {
  try {
    const caseItem = db.prepare(`
      SELECT c.*, l.name as lawyerName, l.specialty as lawyerSpecialty, l.firmName as lawyerFirm,
             l.barNumber as lawyerBarNumber, l.phone as lawyerPhone, l.email as lawyerEmail
      FROM cases c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE c.id = ?
    `).get(Number(req.params.id));

    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case docket not found' });
    }
    return res.json({ success: true, case: caseItem });
  } catch (err) {
    console.error('Admin Get Case Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/cases
// @desc    Create new court case assigned to lawyer and client
// @access  Admin
router.post('/cases', requireAdmin, (req, res) => {
  try {
    const {
      caseNumber, title, lawyerId, clientName, clientEmail, clientPhone,
      courtCode, courtName, bench, practiceArea, relevantActs,
      nextHearingDate, hearingTime, stage, status, disputeValue,
      caseSummary, lawyerNotes
    } = req.body;

    if (!title || !clientName || !lawyerId) {
      return res.status(400).json({ success: false, message: 'Case title, client name, and assigned lawyer are required.' });
    }

    const cnr = caseNumber && caseNumber.trim()
      ? caseNumber.trim()
      : `CNR-${(courtCode || 'IN').toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCase = Case.create({
      caseNumber: cnr,
      title: title.trim(),
      lawyerId: Number(lawyerId),
      clientName: clientName.trim(),
      clientEmail: clientEmail ? clientEmail.trim() : '',
      clientPhone: clientPhone ? clientPhone.trim() : '',
      courtCode: courtCode || 'SCI',
      courtName: courtName || 'Supreme Court of India',
      bench: bench || 'Principal Bench',
      practiceArea: practiceArea || 'General Litigation',
      relevantActs: relevantActs || 'Constitution of India',
      nextHearingDate: nextHearingDate || new Date().toISOString().split('T')[0],
      hearingTime: hearingTime || '10:30 AM IST',
      stage: stage || 'Notice & Admission',
      status: status || 'Active Hearing',
      disputeValue: disputeValue || '',
      caseSummary: caseSummary || '',
      lawyerNotes: lawyerNotes || ''
    });

    return res.status(201).json({ success: true, case: newCase, message: 'Case docket created successfully' });
  } catch (err) {
    console.error('Admin Add Case Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/cases/:id
// @desc    Update case docket status, hearing date, bench, notes
// @access  Admin
router.put('/cases/:id', requireAdmin, (req, res) => {
  try {
    const target = Case.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Case docket not found' });
    }
    const updated = Case.update(req.params.id, req.body);
    return res.json({ success: true, case: updated, message: 'Case docket updated successfully' });
  } catch (err) {
    console.error('Admin Update Case Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/cases/:id
// @desc    Delete case docket permanently
// @access  Admin
router.delete('/cases/:id', requireAdmin, (req, res) => {
  try {
    const success = Case.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Case docket not found' });
    }
    return res.json({ success: true, message: 'Case docket removed successfully' });
  } catch (err) {
    console.error('Admin Delete Case Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ================================================================
// CLIENT & LAWYER FULL DOSSIER INSPECTION
// ================================================================

// @route   GET /api/admin/users/:id/dossier
// @desc    Get complete 360-degree client dossier (profile, consultations, cases, chats)
// @access  Admin
router.get('/users/:id/dossier', requireAdmin, (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Client account not found' });
    }

    const consultations = db.prepare(`
      SELECT c.*, l.name as lawyerName, l.specialty as lawyerSpecialty, l.firmName as lawyerFirm, l.hourlyRate as lawyerRate
      FROM consultations c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE c.userId = ? OR LOWER(c.clientEmail) = LOWER(?)
      ORDER BY c.id DESC
    `).all(user.id, user.email);

    const cases = db.prepare(`
      SELECT c.*, l.name as lawyerName, l.specialty as lawyerSpecialty
      FROM cases c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE LOWER(c.clientEmail) = LOWER(?) OR LOWER(c.clientName) = LOWER(?)
      ORDER BY c.nextHearingDate ASC, c.id DESC
    `).all(user.email, user.name);

    const chats = db.prepare(`
      SELECT id, message, category, timestamp
      FROM ai_chats
      WHERE userId = ?
      ORDER BY id DESC
      LIMIT 25
    `).all(user.id);

    return res.json({
      success: true,
      user,
      consultations,
      cases,
      chats
    });
  } catch (err) {
    console.error('Admin Client Dossier Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update client/user details (name, email, phone, role, isVerified)
// @access  Admin
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const updated = await User.update(req.params.id, req.body);
    return res.json({ success: true, user: updated, message: 'User updated successfully' });
  } catch (err) {
    console.error('Admin Update User Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/lawyers/:id/dossier
// @desc    Get complete 360-degree attorney dossier (profile, full litigation dockets, client inquiries, notifications)
// @access  Admin
router.get('/lawyers/:id/dossier', requireAdmin, (req, res) => {
  try {
    const lawyer = Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Attorney not found' });
    }

    const cases = Case.findByLawyerId(lawyer.id, { limit: 100 });
    const consultations = db.prepare(`
      SELECT c.*, u.name as userName, u.email as userEmail
      FROM consultations c
      LEFT JOIN users u ON c.userId = u.id
      WHERE c.lawyerId = ?
      ORDER BY c.id DESC
    `).all(lawyer.id);

    const notifications = db.prepare(`
      SELECT * FROM notifications WHERE lawyerId = ? ORDER BY id DESC LIMIT 25
    `).all(lawyer.id);

    return res.json({
      success: true,
      lawyer,
      cases,
      consultations,
      notifications,
      stats: Case.getStats(lawyer.id)
    });
  } catch (err) {
    console.error('Admin Lawyer Dossier Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ================================================================
// ADMIN IMPERSONATION & DIRECT PORTAL ACCESS
// ================================================================

// @route   POST /api/admin/impersonate
// @desc    Admin accesses client or lawyer portal with authentic session token
// @access  Admin
router.post('/impersonate', requireAdmin, async (req, res) => {
  try {
    const { type, id } = req.body;
    if (!type || !id) {
      return res.status(400).json({ success: false, message: 'Target type and ID are required' });
    }

    let targetUser = null;
    let lawyerRecord = null;
    let redirectUrl = 'index.html';

    if (type === 'user' || type === 'client') {
      targetUser = User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'Client account not found' });
      }
      redirectUrl = 'user.html';
    } else if (type === 'lawyer') {
      lawyerRecord = Lawyer.findById(id);
      if (!lawyerRecord) {
        return res.status(404).json({ success: false, message: 'Attorney not found' });
      }

      // Check if there is an existing user account for this lawyer
      targetUser = db.prepare('SELECT id, name, email, phone, role, isVerified, lawyerId FROM users WHERE lawyerId = ? OR LOWER(email) = LOWER(?)').get(lawyerRecord.id, lawyerRecord.email);
      if (!targetUser) {
        const bcrypt = require('bcryptjs');
        const defaultHash = await bcrypt.hash('lawyer1234', 10);
        const stmt = db.prepare(`
          INSERT INTO users (name, email, password, phone, role, isVerified, lawyerId)
          VALUES (?, ?, ?, ?, 'lawyer', 1, ?)
        `);
        const r = stmt.run(
          lawyerRecord.name,
          lawyerRecord.email.toLowerCase(),
          defaultHash,
          lawyerRecord.phone || '',
          lawyerRecord.id
        );
        targetUser = User.findById(r.lastInsertRowid);
      }

      targetUser.lawyerId = lawyerRecord.id;
      redirectUrl = 'lawyer.html';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid target type. Must be "user" or "lawyer".' });
    }

    const token = jwt.sign(
      {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        lawyerId: targetUser.lawyerId || (lawyerRecord ? lawyerRecord.id : null),
        adminImpersonator: req.admin.email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      token,
      user: targetUser,
      lawyer: lawyerRecord,
      redirectUrl,
      message: `Admin access granted as ${targetUser.name} (${targetUser.role})`
    });
  } catch (err) {
    console.error('Admin Impersonate Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

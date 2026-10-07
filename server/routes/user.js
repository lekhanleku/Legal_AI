const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');

// User Auth Middleware
function requireUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in database.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token.' });
  }
}

// @route   GET /api/user/profile
// @desc    Get current user profile, case metrics, and activity summary
// @access  Private
router.get('/profile', requireUser, (req, res) => {
  try {
    const user = req.user;

    // Get user consultation count
    const consultCount = db.prepare('SELECT COUNT(*) as count FROM consultations WHERE userId = ? OR LOWER(clientEmail) = LOWER(?)')
      .get(user.id, user.email).count;

    // Get user active consultation count
    const activeConsultCount = db.prepare(`
      SELECT COUNT(*) as count FROM consultations 
      WHERE (userId = ? OR LOWER(clientEmail) = LOWER(?)) AND status IN ('pending', 'confirmed')
    `).get(user.id, user.email).count;

    // Get user AI chats count
    const aiChatCount = db.prepare('SELECT COUNT(*) as count FROM ai_chats WHERE userId = ?').get(user.id).count;

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      stats: {
        totalConsultations: consultCount,
        activeConsultations: activeConsultCount,
        totalAIQueries: aiChatCount
      }
    });
  } catch (err) {
    console.error('User Profile Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile name and email
// @access  Private
router.put('/profile', requireUser, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }

    if (email && email.toLowerCase().trim() !== req.user.email.toLowerCase()) {
      const existing = User.findByEmail(email.toLowerCase().trim());
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Email address is already in use by another account.' });
      }
    }

    const updated = await User.update(req.user.id, {
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : undefined
    });

    return res.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isVerified: updated.isVerified
      },
      message: 'Profile updated successfully!'
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/user/password
// @desc    Update user password
// @access  Private
router.put('/password', requireUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    // Verify current password
    const fullUser = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const isMatch = await User.comparePassword(currentPassword, fullUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    await User.update(req.user.id, { password: newPassword });
    return res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    console.error('Update Password Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/user/consultations
// @desc    Get all consultations booked by the authenticated user
// @access  Private
router.get('/consultations', requireUser, (req, res) => {
  try {
    const user = req.user;
    const consultations = db.prepare(`
      SELECT 
        c.*,
        l.name as lawyerName,
        l.specialty as lawyerSpecialty,
        l.title as lawyerTitle,
        l.firmName as lawyerFirm,
        l.hourlyRate as lawyerRate,
        l.avatarUrl as lawyerAvatar,
        l.phone as lawyerPhone,
        l.email as lawyerEmail
      FROM consultations c
      JOIN lawyers l ON c.lawyerId = l.id
      WHERE c.userId = ? OR LOWER(c.clientEmail) = LOWER(?)
      ORDER BY c.id DESC
    `).all(user.id, user.email);

    return res.json({
      success: true,
      count: consultations.length,
      consultations
    });
  } catch (err) {
    console.error('User Consultations Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/user/consultations/:id
// @desc    Cancel user consultation
// @access  Private
router.delete('/consultations/:id', requireUser, (req, res) => {
  try {
    const user = req.user;
    const consult = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);

    if (!consult) {
      return res.status(404).json({ success: false, message: 'Consultation record not found' });
    }

    // Verify ownership
    if (consult.userId !== user.id && consult.clientEmail.toLowerCase() !== user.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking.' });
    }

    const success = Lawyer.cancelConsultation(req.params.id);
    return res.json({ success: true, message: 'Consultation booking has been cancelled.' });
  } catch (err) {
    console.error('Cancel Booking Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/user/chats
// @desc    Get user past legal AI chats
// @access  Private
router.get('/chats', requireUser, (req, res) => {
  try {
    const chats = db.prepare(`
      SELECT id, role, message, category, timestamp
      FROM ai_chats
      WHERE userId = ?
      ORDER BY id DESC
      LIMIT 30
    `).all(req.user.id);

    return res.json({ success: true, count: chats.length, chats });
  } catch (err) {
    console.error('User Chats Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

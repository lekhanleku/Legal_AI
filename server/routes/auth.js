const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, lawyerId: user.lawyerId || null },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user in SQLite DB
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').trim().notEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, email, password, confirmPassword, phone, role } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    if (confirmPassword && confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please re-enter your password.',
      });
    }

    if (phone) {
      const digitsOnly = String(phone).replace(/\D/g, '');
      if (digitsOnly.length > 0 && (digitsOnly.length < 10 || digitsOnly.length > 15)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 10-digit mobile number.',
        });
      }
    }

    try {
      const existingUser = User.findByEmail(cleanEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const newUser = await User.create({
        name,
        email: cleanEmail,
        password,
        phone: phone ? String(phone).trim() : '',
        role: role || 'user',
      });

      let lawyerId = null;
      if (role === 'lawyer') {
        const db = require('../db');
        const match = db.prepare('SELECT id FROM lawyers WHERE LOWER(email) = LOWER(?)').get(cleanEmail);
        if (match) {
          lawyerId = match.id;
        } else {
          const Lawyer = require('../models/Lawyer');
          const newLawyer = Lawyer.create({
            name: name,
            title: 'Advocate & Legal Counsel',
            specialty: req.body.specialty || 'General Litigation',
            barNumber: req.body.barNumber || `D/${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`,
            experienceYears: 5,
            education: 'Bar Council of India Verified',
            firmName: `Chambers of ${name}`,
            city: 'New Delhi',
            state: 'Delhi',
            hourlyRate: 15000,
            languages: 'English, Hindi',
            bio: `Verified practicing advocate enrolled before the Bar Council. Chambers of ${name}.`,
            phone: phone || '',
            email: cleanEmail,
            isAvailable: 1
          });
          lawyerId = newLawyer.id;
          try {
            const { generateCasesForLawyer } = require('../services/caseSyncService');
            const initialCases = generateCasesForLawyer(newLawyer);
            const insertCaseStmt = db.prepare(`
              INSERT INTO cases (
                caseNumber, title, lawyerId, clientName, clientEmail, clientPhone,
                opposingParty, opposingCounsel, courtCode, courtName, bench,
                practiceArea, relevantActs, nextHearingDate, hearingTime, stage,
                status, disputeValue, caseSummary, lawyerNotes, filingDate
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            for (const cs of initialCases) {
              insertCaseStmt.run(
                cs.caseNumber, cs.title, cs.lawyerId, cs.clientName, cs.clientEmail, cs.clientPhone,
                cs.opposingParty, cs.opposingCounsel, cs.courtCode, cs.courtName, cs.bench,
                cs.practiceArea, cs.relevantActs, cs.nextHearingDate, cs.hearingTime, cs.stage,
                cs.status, cs.disputeValue, cs.caseSummary, cs.lawyerNotes, cs.filingDate
              );
            }
          } catch (_) {}
        }
        db.prepare('UPDATE users SET lawyerId = ? WHERE id = ?').run(lawyerId, newUser.id);
        newUser.lawyerId = lawyerId;
      }

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Saved to SQLite)!',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || '',
          role: newUser.role,
          lawyerId: newUser.lawyerId || lawyerId || null,
          storage: 'sqlite',
        },
      });
    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during registration: ' + err.message,
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token using SQLite DB
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const user = User.findByEmail(cleanEmail);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials. Please check your email and password.',
        });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials. Please check your email and password.',
        });
      }

      // Check if user is a lawyer or matches lawyer record
      const db = require('../db');
      let lawyerId = user.lawyerId || null;
      if (!lawyerId) {
        const lawyerMatch = db.prepare('SELECT id FROM lawyers WHERE LOWER(email) = LOWER(?)').get(cleanEmail);
        if (lawyerMatch) {
          lawyerId = lawyerMatch.id;
          db.prepare('UPDATE users SET lawyerId = ?, role = "lawyer" WHERE id = ?').run(lawyerId, user.id);
          user.role = 'lawyer';
          user.lawyerId = lawyerId;
        }
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          lawyerId: user.lawyerId || lawyerId || null,
          storage: 'sqlite',
        },
      });
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during login: ' + err.message,
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user profile from token using SQLite DB
// @access  Private
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = User.findById(decoded.id);
    
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          lawyerId: user.lawyerId || null,
          storage: 'sqlite',
        },
      });
    }

    return res.status(404).json({ success: false, message: 'User not found in SQLite database' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;


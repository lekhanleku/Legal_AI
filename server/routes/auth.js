const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
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

    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase().trim();

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
        role: role || 'user',
      });

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Saved to SQLite)!',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
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

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
          role: user.role,
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


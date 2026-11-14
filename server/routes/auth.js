const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');
const AdvocateAccount = require('../models/AdvocateAccount');

// Helper to generate JWT Token
const generateToken = (account) => {
  return jwt.sign(
    {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      lawyerId: account.lawyerId || null
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new client or advocate account in isolated tables
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

    // Security check: Never allow public registration of admin accounts
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Master Administrator accounts cannot be self-registered publicly.',
      });
    }

    try {
      if (role === 'lawyer') {
        // Enrolled Advocate registration in isolated advocate_accounts table
        const existingAdvocate = AdvocateAccount.findByEmail(cleanEmail);
        if (existingAdvocate) {
          return res.status(400).json({
            success: false,
            message: 'An advocate account with this email address already exists.',
          });
        }

        const Lawyer = require('../models/Lawyer');
        let matchedLawyer = Lawyer.findByEmail(cleanEmail);
        if (!matchedLawyer) {
          matchedLawyer = Lawyer.create({
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
        }

        const newAdvocate = await AdvocateAccount.create({
          lawyerId: matchedLawyer.id,
          name: name,
          email: cleanEmail,
          password: password,
          phone: phone ? String(phone).trim() : '',
          barNumber: matchedLawyer.barNumber || req.body.barNumber || 'D/BCI/VERIFIED',
          specialty: matchedLawyer.specialty || 'General Litigation'
        });

        const token = generateToken(newAdvocate);

        return res.status(201).json({
          success: true,
          message: 'Advocate Chambers account registered successfully!',
          token,
          user: {
            id: newAdvocate.id,
            name: newAdvocate.name,
            email: newAdvocate.email,
            phone: newAdvocate.phone || '',
            role: 'lawyer',
            lawyerId: matchedLawyer.id,
          },
          redirectUrl: 'lawyer.html',
          portalName: 'Advocate Chambers'
        });
      }

      // Default: Client / Seeker registration in isolated users table
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
        role: 'user',
      });

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Client account created successfully!',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || '',
          role: 'user',
          storage: 'sqlite',
        },
        redirectUrl: 'user.html',
        portalName: 'Client Portal'
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
// @desc    Authenticate user with strict database table segregation
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

    const { email, password, role: requestedRole } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    try {
      // 1. ADMIN PORTAL LOGIN: Check dedicated 'admins' table
      if (requestedRole === 'admin') {
        const admin = Admin.findByEmail(cleanEmail);
        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Access Denied: Invalid administrator credentials or account not found in Master Admin registry.',
          });
        }

        const isMatch = await Admin.comparePassword(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Access Denied: Invalid administrator password.',
          });
        }

        const token = generateToken(admin);
        return res.json({
          success: true,
          message: 'Authenticated as Master Administrator!',
          token,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            role: 'admin',
            isSuperAdmin: admin.isSuperAdmin
          },
          redirectUrl: 'admin.html',
          portalName: 'Master Administrator Console'
        });
      }

      // 2. ADVOCATE PORTAL LOGIN: Check dedicated 'advocate_accounts' table
      if (requestedRole === 'lawyer') {
        const advocate = AdvocateAccount.findByEmail(cleanEmail);
        if (!advocate) {
          return res.status(401).json({
            success: false,
            message: 'Access Restricted: This account is not enrolled in the Advocate Chambers registry. Please sign in via the Client Portal.',
          });
        }

        const isMatch = await AdvocateAccount.comparePassword(password, advocate.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your advocate email and password.',
          });
        }

        const token = generateToken(advocate);
        return res.json({
          success: true,
          message: `Welcome to Advocate Chambers, ${advocate.name}!`,
          token,
          user: {
            id: advocate.id,
            lawyerId: advocate.lawyerId,
            name: advocate.name,
            email: advocate.email,
            phone: advocate.phone || '',
            barNumber: advocate.barNumber,
            specialty: advocate.specialty,
            role: 'lawyer'
          },
          redirectUrl: 'lawyer.html',
          portalName: 'Advocate Chambers'
        });
      }

      // 3. CLIENT PORTAL LOGIN: Check dedicated 'users' table
      if (requestedRole === 'user') {
        const client = User.findByEmail(cleanEmail);
        if (!client) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your email and password.',
          });
        }

        const isMatch = await User.comparePassword(password, client.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your email and password.',
          });
        }

        const token = generateToken(client);
        return res.json({
          success: true,
          message: 'Logged in successfully to Client Portal!',
          token,
          user: {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            role: 'user'
          },
          redirectUrl: 'user.html',
          portalName: 'Client Portal'
        });
      }

      // 4. FALLBACK (no explicit role requested): Strict priority resolution
      // Try Client table first
      const client = User.findByEmail(cleanEmail);
      if (client && await User.comparePassword(password, client.password)) {
        const token = generateToken(client);
        return res.json({
          success: true,
          message: 'Logged in successfully to Client Portal!',
          token,
          user: {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            role: 'user'
          },
          redirectUrl: 'user.html',
          portalName: 'Client Portal'
        });
      }

      // Try Advocate table
      const advocate = AdvocateAccount.findByEmail(cleanEmail);
      if (advocate && await AdvocateAccount.comparePassword(password, advocate.password)) {
        const token = generateToken(advocate);
        return res.json({
          success: true,
          message: `Welcome to Advocate Chambers, ${advocate.name}!`,
          token,
          user: {
            id: advocate.id,
            lawyerId: advocate.lawyerId,
            name: advocate.name,
            email: advocate.email,
            phone: advocate.phone || '',
            barNumber: advocate.barNumber,
            specialty: advocate.specialty,
            role: 'lawyer'
          },
          redirectUrl: 'lawyer.html',
          portalName: 'Advocate Chambers'
        });
      }

      // Try Admin table
      const admin = Admin.findByEmail(cleanEmail);
      if (admin && await Admin.comparePassword(password, admin.password)) {
        const token = generateToken(admin);
        return res.json({
          success: true,
          message: 'Authenticated as Master Administrator!',
          token,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            role: 'admin',
            isSuperAdmin: admin.isSuperAdmin
          },
          redirectUrl: 'admin.html',
          portalName: 'Master Administrator Console'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
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
// @desc    Get current user profile from token using segregated DB tables
// @access  Private
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (decoded.role === 'admin') {
      const admin = Admin.findById(decoded.id);
      if (admin) {
        return res.json({
          success: true,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone || '',
            role: 'admin',
            isSuperAdmin: admin.isSuperAdmin
          }
        });
      }
    } else if (decoded.role === 'lawyer') {
      const advocate = AdvocateAccount.findById(decoded.id) || (decoded.lawyerId ? AdvocateAccount.findByLawyerId(decoded.lawyerId) : null);
      if (advocate) {
        return res.json({
          success: true,
          user: {
            id: advocate.id,
            lawyerId: advocate.lawyerId,
            name: advocate.name,
            email: advocate.email,
            phone: advocate.phone || '',
            barNumber: advocate.barNumber,
            specialty: advocate.specialty,
            role: 'lawyer'
          }
        });
      }
    } else {
      const client = User.findById(decoded.id);
      if (client) {
        return res.json({
          success: true,
          user: {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            role: 'user'
          }
        });
      }
    }

    return res.status(404).json({ success: false, message: 'Account not found in segregated databases' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');

// @route   GET /api/lawyers
// @desc    Search and filter lawyers by specialty, court, keyword, rate, or rating
// @access  Public
router.get('/', (req, res) => {
  try {
    const { search, specialty, court, courtCode, maxFee, minRating, availability, limit, offset } = req.query;
    const lawyers = Lawyer.findAll({ search, specialty, court, courtCode, maxFee, minRating, availability, limit, offset });
    const stats = Lawyer.getStats();

    return res.json({
      success: true,
      count: lawyers.length,
      specialties: stats.specialties,
      lawyers
    });
  } catch (err) {
    console.error('Fetch Lawyers Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lawyers: ' + err.message
    });
  }
});

// @route   GET /api/lawyers/stats
// @desc    Get aggregate lawyer network stats
// @access  Public
router.get('/stats', (req, res) => {
  try {
    const stats = Lawyer.getStats();
    return res.json({ success: true, stats });
  } catch (err) {
    console.error('Lawyer Stats Error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch stats' });
  }
});

// @route   GET /api/lawyers/consultations
// @desc    Get booked consultations with full attorney details
// @access  Public
router.get('/consultations', (req, res) => {
  try {
    const { email, userId, lawyerId, limit } = req.query;
    const consultations = Lawyer.getConsultations({ email, userId, lawyerId, limit });
    return res.json({
      success: true,
      count: consultations.length,
      consultations
    });
  } catch (err) {
    console.error('Fetch Consultations Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booked consultations: ' + err.message
    });
  }
});

// @route   DELETE /api/lawyers/consultations/:id
// @desc    Cancel a booked consultation (marks as cancelled)
// @access  Public
router.delete('/consultations/:id', (req, res) => {
  try {
    const success = Lawyer.cancelConsultation(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Consultation record not found' });
    }
    return res.json({
      success: true,
      message: 'Consultation successfully cancelled.'
    });
  } catch (err) {
    console.error('Cancel Consultation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not cancel consultation: ' + err.message
    });
  }
});

// @route   POST /api/lawyers/consultations/:id/restore
// @desc    Restore / reactivate a cancelled consultation
// @access  Public
router.post('/consultations/:id/restore', (req, res) => {
  try {
    const success = Lawyer.restoreConsultation(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Consultation record not found' });
    }
    return res.json({
      success: true,
      message: 'Consultation successfully restored!'
    });
  } catch (err) {
    console.error('Restore Consultation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not restore consultation: ' + err.message
    });
  }
});

// @route   DELETE /api/lawyers/consultations/:id/permanent
// @desc    Permanently remove a consultation record
// @access  Public
router.delete('/consultations/:id/permanent', (req, res) => {
  try {
    const success = Lawyer.deleteConsultation(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Consultation record not found' });
    }
    return res.json({
      success: true,
      message: 'Consultation record permanently removed.'
    });
  } catch (err) {
    console.error('Permanent Delete Consultation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not remove consultation: ' + err.message
    });
  }
});

// @route   GET /api/lawyers/:id
// @desc    Get a single lawyer profile by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const lawyer = Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Attorney profile not found' });
    }
    return res.json({ success: true, lawyer });
  } catch (err) {
    console.error('Fetch Lawyer Profile Error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
});

// @route   POST /api/lawyers
// @desc    Register a new attorney profile
// @access  Public
router.post('/', (req, res) => {
  try {
    const { name, specialty, barNumber, phone, email } = req.body;
    if (!name || !specialty || !barNumber || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialty, bar number, phone, and email are required fields.'
      });
    }

    const newLawyer = Lawyer.create(req.body);
    return res.status(210 || 201).json({
      success: true,
      message: 'Attorney profile registered successfully!',
      lawyer: newLawyer
    });
  } catch (err) {
    console.error('Create Lawyer Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not register lawyer profile: ' + err.message
    });
  }
});

// @route   POST /api/lawyers/:id/consult
// @desc    Book a consultation with a specified attorney (Authentication Mandatory)
// @access  Private (Requires valid JWT Bearer Token)
router.post('/:id/consult', (req, res) => {
  try {
    // 1. Mandatory Authentication Check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Please log in or register to book a lawyer consultation.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again to book a lawyer consultation.'
      });
    }

    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authenticated user account not found in database. Please log in or register.'
      });
    }

    const lawyerId = req.params.id;
    const lawyer = Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Attorney not found' });
    }

    const { clientName, clientEmail, clientPhone, preferredDate, caseSummary } = req.body;
    if (!clientName || !clientEmail || !clientPhone || !preferredDate || !caseSummary) {
      return res.status(400).json({
        success: false,
        message: 'Client name, email, phone, preferred date, and case summary are required.'
      });
    }

    // Phone number format validation (at least 10 digits, max 15, valid phone chars)
    const phoneTrimmed = String(clientPhone).trim();
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    const digitsOnly = phoneTrimmed.replace(/\D/g, '');
    if (!phoneRegex.test(phoneTrimmed) || digitsOnly.length < 10 || digitsOnly.length > 15 || /^(\d)\1+$/.test(digitsOnly)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Please give a correct phone number (e.g. (555) 000-0000 or +1 213-555-0121).'
      });
    }

    // 2. Save consultation with authenticated userId and lawyerId
    const consultation = Lawyer.bookConsultation({
      lawyerId: Number(lawyerId),
      userId: user.id,
      clientName: clientName || user.name,
      clientEmail: user.email, // Bound directly to authenticated user
      clientPhone: phoneTrimmed,
      preferredDate,
      caseSummary
    });

    return res.status(201).json({
      success: true,
      message: `Consultation request successfully submitted for ${lawyer.name}!`,
      bookingId: consultation.id,
      consultation,
      lawyer: {
        id: lawyer.id,
        name: lawyer.name,
        specialty: lawyer.specialty,
        phone: lawyer.phone,
        email: lawyer.email
      }
    });
  } catch (err) {
    console.error('Book Consultation Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not book consultation: ' + err.message
    });
  }
});

module.exports = router;

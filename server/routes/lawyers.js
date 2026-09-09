const express = require('express');
const router = express.Router();
const Lawyer = require('../models/Lawyer');

// @route   GET /api/lawyers
// @desc    Search and filter lawyers by specialty, keyword, rate, or rating
// @access  Public
router.get('/', (req, res) => {
  try {
    const { search, specialty, maxFee, minRating, availability, limit, offset } = req.query;
    const lawyers = Lawyer.findAll({ search, specialty, maxFee, minRating, availability, limit, offset });
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
// @desc    Cancel a booked consultation
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
// @desc    Book a consultation with a specified attorney
// @access  Public
router.post('/:id/consult', (req, res) => {
  try {
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

    const consultation = Lawyer.bookConsultation({
      lawyerId: Number(lawyerId),
      clientName,
      clientEmail,
      clientPhone,
      preferredDate,
      caseSummary
    });

    return res.json({
      success: true,
      message: `Consultation request successfully submitted for ${lawyer.name}!`,
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

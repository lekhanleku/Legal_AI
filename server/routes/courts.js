const express = require('express');
const router = express.Router();
const Court = require('../models/Court');

// @route   GET /api/courts
// @desc    Search and filter courts by jurisdiction, state, filing system, or keyword
// @access  Public
router.get('/', (req, res) => {
  try {
    const { search, jurisdiction, state, filingSystem, limit, offset } = req.query;
    const courts = Court.findAll({ search, jurisdiction, state, filingSystem, limit, offset });
    const stats = Court.getStats();

    return res.json({
      success: true,
      count: courts.length,
      total: stats.totalCourts,
      jurisdictions: stats.jurisdictions,
      states: stats.states,
      courts
    });
  } catch (err) {
    console.error('Fetch Courts Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve courts: ' + err.message
    });
  }
});

// @route   GET /api/courts/stats
// @desc    Get aggregate court directory stats
// @access  Public
router.get('/stats', (req, res) => {
  try {
    const stats = Court.getStats();
    return res.json({ success: true, stats });
  } catch (err) {
    console.error('Court Stats Error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch court statistics' });
  }
});

// @route   GET /api/courts/:id
// @desc    Get single court details by ID or code (with practicing lawyers)
// @access  Public
router.get('/:id', (req, res) => {
  try {
    let court = null;
    if (isNaN(Number(req.params.id))) {
      court = Court.findByCode(req.params.id.toUpperCase());
    } else {
      court = Court.findById(Number(req.params.id));
    }

    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }
    return res.json({ success: true, court });
  } catch (err) {
    console.error('Fetch Court Profile Error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving court record' });
  }
});

// @route   GET /api/courts/:id/lawyers
// @desc    Get advocates practicing in this court
// @access  Public
router.get('/:id/lawyers', (req, res) => {
  try {
    let court = null;
    if (isNaN(Number(req.params.id))) {
      court = Court.findByCode(req.params.id.toUpperCase());
    } else {
      court = Court.findById(Number(req.params.id));
    }

    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    const lawyers = Court.getPracticingLawyers(court.code);
    return res.json({
      success: true,
      court: { id: court.id, name: court.name, code: court.code },
      count: lawyers.length,
      lawyers
    });
  } catch (err) {
    console.error('Fetch Court Lawyers Error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving court advocates' });
  }
});

// @route   GET /api/courts/:id/suggest-lawyers
// @desc    Suggest verified lawyers associated with this court who specialize in the relevant legal area,
//          grounded in relevant legal rules and jurisdiction.
// @access  Public
router.get('/:id/suggest-lawyers', (req, res) => {
  try {
    const { specialty } = req.query;
    const result = Court.getSuggestedLawyers(req.params.id, specialty);

    if (!result.court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    return res.json({
      success: true,
      count: result.suggestedLawyers.length,
      court: result.court,
      specialty: result.specialty,
      jurisdictionRule: result.jurisdictionRule,
      suggestedLawyers: result.suggestedLawyers
    });
  } catch (err) {
    console.error('Suggest Court Lawyers Error:', err);
    return res.status(500).json({ success: false, message: 'Error generating lawyer recommendations: ' + err.message });
  }
});

module.exports = router;

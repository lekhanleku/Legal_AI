const db = require('../db');

class Lawyer {
  /**
   * Find lawyers matching search and filter criteria
   */
  static findAll(filters = {}) {
    const {
      search = '',
      specialty = '',
      maxFee = null,
      minRating = null,
      availability = '',
      limit = 50,
      offset = 0
    } = filters;

    let query = 'SELECT * FROM lawyers WHERE 1=1';
    const params = [];

    if (availability === 'available' || availability === '1') {
      query += ' AND isAvailable = 1';
    } else if (availability === 'booked' || availability === '0') {
      query += ' AND isAvailable = 0';
    }

    if (specialty && specialty !== 'All Specialties') {
      query += ' AND specialty = ?';
      params.push(specialty);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR firmName LIKE ? OR bio LIKE ? OR city LIKE ? OR state LIKE ? OR barNumber LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (maxFee) {
      query += ' AND hourlyRate <= ?';
      params.push(Number(maxFee));
    }

    if (minRating) {
      query += ' AND rating >= ?';
      params.push(Number(minRating));
    }

    query += ' ORDER BY isAvailable DESC, rating DESC, casesWon DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Find lawyer by primary key ID
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM lawyers WHERE id = ?');
    return stmt.get(id) || null;
  }

  /**
   * Create a new lawyer record
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO lawyers (
        name, title, specialty, barNumber, experienceYears, education,
        firmName, city, state, hourlyRate, rating, reviewCount,
        languages, bio, casesWon, successRate, phone, email, avatarUrl, isAvailable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.name,
      data.title || 'Attorney at Law',
      data.specialty,
      data.barNumber,
      data.experienceYears || 5,
      data.education || 'Juris Doctor (J.D.)',
      data.firmName || 'Independent Practice',
      data.city || 'New York',
      data.state || 'NY',
      data.hourlyRate || 300,
      data.rating || 5.0,
      data.reviewCount || 1,
      data.languages || 'English',
      data.bio || 'Dedicated legal professional committed to justice.',
      data.casesWon || 50,
      data.successRate || 95,
      data.phone,
      data.email,
      data.avatarUrl || '',
      1
    );

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Book a consultation request with an attorney
   */
  static bookConsultation(data) {
    const stmt = db.prepare(`
      INSERT INTO consultations (
        lawyerId, userId, clientName, clientEmail, clientPhone, preferredDate, caseSummary
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.lawyerId,
      data.userId || null,
      data.clientName,
      data.clientEmail,
      data.clientPhone,
      data.preferredDate,
      data.caseSummary
    );

    return {
      id: result.lastInsertRowid,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Get consultations with joined lawyer information
   */
  static getConsultations(filters = {}) {
    const { email = '', userId = null, lawyerId = null, limit = 50 } = filters;
    let query = `
      SELECT c.*, 
             l.name as lawyerName, 
             l.title as lawyerTitle, 
             l.specialty as lawyerSpecialty, 
             l.avatarUrl as lawyerAvatar, 
             l.hourlyRate as lawyerRate, 
             l.phone as lawyerPhone, 
             l.email as lawyerEmail, 
             l.firmName as lawyerFirm, 
             l.city as lawyerCity, 
             l.state as lawyerState,
             l.isAvailable as lawyerAvailability
      FROM consultations c
      JOIN lawyers l ON c.lawyerId = l.id
      WHERE 1=1
    `;
    const params = [];

    if (email && email.trim()) {
      query += ' AND LOWER(c.clientEmail) = LOWER(?)';
      params.push(email.trim());
    }

    if (userId) {
      query += ' AND c.userId = ?';
      params.push(Number(userId));
    }

    if (lawyerId) {
      query += ' AND c.lawyerId = ?';
      params.push(Number(lawyerId));
    }

    query += ' ORDER BY c.id DESC LIMIT ?';
    params.push(Number(limit));

    return db.prepare(query).all(...params);
  }

  /**
   * Cancel or delete a consultation
   */
  static cancelConsultation(id) {
    const stmt = db.prepare("UPDATE consultations SET status = 'cancelled' WHERE id = ?");
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Get legal network summary statistics
   */
  static getStats() {
    const totalLawyers = db.prepare('SELECT COUNT(*) as count FROM lawyers').get().count;
    const totalCasesWon = db.prepare('SELECT SUM(casesWon) as total FROM lawyers').get().total || 0;
    const avgSuccess = db.prepare('SELECT AVG(successRate) as avg FROM lawyers').get().avg || 96;
    const specialties = db.prepare('SELECT DISTINCT specialty FROM lawyers').all().map(r => r.specialty);

    return {
      totalLawyers,
      totalCasesWon,
      avgSuccessRate: Math.round(avgSuccess),
      specialtiesCount: specialties.length,
      specialties
    };
  }
}

module.exports = Lawyer;

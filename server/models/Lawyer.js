const db = require('../db');
const Consultation = require('./Consultation');
const Notification = require('./Notification');

class Lawyer {
  /**
   * Find lawyers matching search and filter criteria
   */
  static findAll(filters = {}) {
    const {
      search = '',
      specialty = '',
      court = '',
      courtCode = '',
      maxFee = null,
      minRating = null,
      availability = '',
      limit = 50,
      offset = 0
    } = filters;

    let query = `
      SELECT l.*,
        (SELECT COUNT(*) FROM cases cs WHERE cs.lawyerId = l.id) as caseCount,
        (SELECT COUNT(*) FROM cases cs WHERE cs.lawyerId = l.id AND LOWER(cs.status) LIKE '%active%') as activeCasesCount,
        (SELECT COUNT(*) FROM consultations cn WHERE cn.lawyerId = l.id) as consultationCount
      FROM lawyers l
      WHERE 1=1
    `;
    const params = [];

    if (availability === 'available' || availability === '1') {
      query += ' AND l.isAvailable = 1';
    } else if (availability === 'booked' || availability === '0') {
      query += ' AND l.isAvailable = 0';
    }

    if (specialty && specialty !== 'All Specialties') {
      query += ' AND l.specialty = ?';
      params.push(specialty);
    }

    const activeCourt = (court || courtCode || '').trim();
    if (activeCourt && activeCourt !== 'All Courts' && activeCourt !== 'All') {
      query += ' AND (l.courtCodes LIKE ? OR l.practicingCourts LIKE ? OR l.primaryCourt LIKE ?)';
      params.push(`%${activeCourt}%`, `%${activeCourt}%`, `%${activeCourt}%`);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (l.name LIKE ? OR l.firmName LIKE ? OR l.bio LIKE ? OR l.city LIKE ? OR l.state LIKE ? OR l.barNumber LIKE ? OR l.practicingCourts LIKE ? OR l.courtCodes LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (maxFee) {
      query += ' AND l.hourlyRate <= ?';
      params.push(Number(maxFee));
    }

    if (minRating) {
      query += ' AND l.rating >= ?';
      params.push(Number(minRating));
    }

    query += ' ORDER BY l.isAvailable DESC, l.rating DESC, l.casesWon DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Find all lawyers practicing before a specific court
   */
  static findByCourtCode(courtCode) {
    if (!courtCode) return [];
    const stmt = db.prepare(`
      SELECT * FROM lawyers 
      WHERE courtCodes LIKE ? OR practicingCourts LIKE ?
      ORDER BY isAvailable DESC, rating DESC, casesWon DESC
    `);
    const pattern = `%${courtCode}%`;
    return stmt.all(pattern, pattern);
  }

  /**
   * Find lawyer by primary key ID (supports direct ID, fallback index, bar number, or name)
   */
  static findById(id) {
    if (!id && id !== 0) return null;
    try {
      const stmt = db.prepare('SELECT * FROM lawyers WHERE id = ?');
      const lawyer = stmt.get(id);
      if (lawyer) return lawyer;
    } catch (_) {}

    // Check if ID is numeric and matches a 1-based index from fallback dataset
    if (!isNaN(Number(id))) {
      const numericId = Number(id);
      try {
        const { INDIAN_LAWYERS } = require('../services/lawyersData');
        if (Array.isArray(INDIAN_LAWYERS) && numericId >= 1 && numericId <= INDIAN_LAWYERS.length) {
          const fallback = INDIAN_LAWYERS[numericId - 1];
          if (fallback) {
            if (fallback.barNumber) {
              const byBar = db.prepare('SELECT * FROM lawyers WHERE barNumber = ?').get(fallback.barNumber);
              if (byBar) return byBar;
            }
            if (fallback.name) {
              const byName = db.prepare('SELECT * FROM lawyers WHERE name = ? OR name LIKE ?').get(fallback.name, `%${fallback.name}%`);
              if (byName) return byName;
            }
          }
        }
      } catch (_) {}
    }

    // Try finding by name or partial name match
    try {
      const byName = db.prepare('SELECT * FROM lawyers WHERE name = ? OR name LIKE ?').get(String(id), `%${String(id)}%`);
      if (byName) return byName;
    } catch (_) {}

    return null;
  }

  /**
   * Find lawyer by exact or partial name
   */
  static findByName(name) {
    if (!name) return null;
    try {
      const stmt = db.prepare('SELECT * FROM lawyers WHERE name = ? OR name LIKE ? LIMIT 1');
      return stmt.get(name, `%${name}%`) || null;
    } catch (_) {
      return null;
    }
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
      data.title || 'Advocate / Senior Counsel',
      data.specialty,
      data.barNumber,
      data.experienceYears || 10,
      data.education || 'Faculty of Law, University of Delhi, LL.B.',
      data.firmName || 'Independent Chambers',
      data.city || 'New Delhi',
      data.state || 'Delhi',
      data.hourlyRate || 30000,
      data.rating || 5.0,
      data.reviewCount || 1,
      data.languages || 'English, Hindi',
      data.bio || 'Dedicated legal advocate committed to justice.',
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

    const consultId = result.lastInsertRowid;

    // Automatically trigger notification for the lawyer
    try {
      const notifStmt = db.prepare(`
        INSERT INTO notifications (
          lawyerId, consultationId, type, title, message,
          clientName, clientEmail, clientPhone, preferredDate, isRead
        ) VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?, 0)
      `);
      notifStmt.run(
        data.lawyerId,
        consultId,
        `New Consultation Booking: ${data.clientName}`,
        `Client ${data.clientName} has scheduled a consultation for ${data.preferredDate}. Legal Matter: ${data.caseSummary}`,
        data.clientName,
        data.clientEmail,
        data.clientPhone,
        data.preferredDate
      );
    } catch (nErr) {
      console.warn('Could not insert lawyer notification:', nErr.message);
    }

    return {
      id: consultId,
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
   * Cancel consultation (marks as cancelled)
   */
  static cancelConsultation(id) {
    const stmt = db.prepare("UPDATE consultations SET status = 'cancelled' WHERE id = ?");
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Cancel all booked consultations
   */
  static cancelAllConsultations(userId = null) {
    if (userId) {
      const stmt = db.prepare("UPDATE consultations SET status = 'cancelled' WHERE userId = ? AND status != 'cancelled'");
      const res = stmt.run(userId);
      return res.changes;
    }
    const stmt = db.prepare("UPDATE consultations SET status = 'cancelled' WHERE status != 'cancelled'");
    const res = stmt.run();
    return res.changes;
  }

  /**
   * Permanently clear all consultations across all lawyers
   */
  static clearAllConsultations(userId = null) {
    if (userId) {
      const res = db.prepare('DELETE FROM consultations WHERE userId = ?').run(Number(userId));
      return res.changes;
    }
    try {
      db.prepare("DELETE FROM notifications WHERE type = 'booking' OR consultationId IS NOT NULL").run();
    } catch (_) {}
    const res = db.prepare('DELETE FROM consultations').run();
    try {
      db.prepare('UPDATE lawyers SET isAvailable = 1').run();
    } catch (_) {}
    return res.changes;
  }

  /**
   * Restore / reactivate a consultation
   */
  static restoreConsultation(id) {
    const stmt = db.prepare("UPDATE consultations SET status = 'pending' WHERE id = ?");
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Permanently delete a consultation record
   */
  static deleteConsultation(id) {
    const stmt = db.prepare('DELETE FROM consultations WHERE id = ?');
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Update consultation status (pending, confirmed, completed, cancelled)
   */
  static updateConsultationStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    const stmt = db.prepare("UPDATE consultations SET status = ? WHERE id = ?");
    const res = stmt.run(status, Number(id));
    return res.changes > 0;
  }

  /**
   * Get all consultations with status filter and search for admin
   */
  static getAllConsultations({ status = '', search = '', limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT 
        c.*,
        l.name as lawyerName,
        l.specialty as lawyerSpecialty,
        l.title as lawyerTitle,
        l.firmName as lawyerFirm,
        l.hourlyRate as lawyerRate,
        l.avatarUrl as lawyerAvatar
      FROM consultations c
      JOIN lawyers l ON c.lawyerId = l.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(c.clientName) LIKE ? OR LOWER(c.clientEmail) LIKE ? OR LOWER(l.name) LIKE ? OR LOWER(c.caseSummary) LIKE ?)';
      params.push(s, s, s, s);
    }

    const countQuery = query.replace(/SELECT\s+c\.\*[\s\S]*?FROM consultations c/, 'SELECT COUNT(*) as total FROM consultations c');
    const total = db.prepare(countQuery).get(...params).total;

    query += ' ORDER BY c.id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const consultations = db.prepare(query).all(...params);
    return { consultations, total };
  }

  /**
   * Get consultation statistics for admin dashboard
   */
  static getConsultationStats() {
    const total = db.prepare('SELECT COUNT(*) as count FROM consultations').get().count;
    const statuses = db.prepare('SELECT status, COUNT(*) as count FROM consultations GROUP BY status').all();
    
    const statusMap = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    statuses.forEach(s => { statusMap[s.status] = s.count; });

    return {
      total,
      byStatus: statusMap
    };
  }

  /**
   * Add a new lawyer to the directory (Admin)
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO lawyers (
        name, title, specialty, barNumber, experienceYears, education, firmName,
        city, state, hourlyRate, rating, reviewCount, languages, bio, casesWon,
        successRate, phone, email, avatarUrl, isAvailable,
        courtCodes, practicingCourts, primaryCourt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    const result = stmt.run(
      data.name,
      data.title || 'Advocate / Senior Counsel',
      data.specialty,
      data.barNumber,
      Number(data.experienceYears) || 10,
      data.education || 'Faculty of Law, University of Delhi, LL.B.',
      data.firmName || 'Independent Chambers',
      data.city || 'New Delhi',
      data.state || 'Delhi',
      Number(data.hourlyRate) || 30000,
      Number(data.rating) || 5.0,
      Number(data.reviewCount) || 10,
      data.languages || 'English, Hindi',
      data.bio || 'Dedicated legal advocate specializing in client advocacy.',
      Number(data.casesWon) || 25,
      Number(data.successRate) || 95,
      data.phone,
      data.email,
      data.avatarUrl || '',
      data.isAvailable !== undefined ? (data.isAvailable ? 1 : 0) : 1,
      data.courtCodes || '',
      data.practicingCourts || '',
      data.primaryCourt || ''
    );

    const created = Lawyer.findById(result.lastInsertRowid);
    try {
      const { syncLawyersDataset } = require('../services/datasetSyncService');
      syncLawyersDataset(db);
    } catch (e) {}
    return created;
  }

  /**
   * Update existing lawyer details (Admin)
   */
  static update(id, data) {
    const fields = [];
    const params = [];

    const allowed = [
      'name', 'title', 'specialty', 'barNumber', 'experienceYears', 'education',
      'firmName', 'city', 'state', 'hourlyRate', 'rating', 'reviewCount',
      'languages', 'bio', 'casesWon', 'successRate', 'phone', 'email',
      'avatarUrl', 'isAvailable', 'courtCodes', 'practicingCourts', 'primaryCourt'
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return Lawyer.findById(id);

    const sql = `UPDATE lawyers SET ${fields.join(', ')} WHERE id = ?`;
    params.push(Number(id));

    db.prepare(sql).run(...params);
    try {
      const { syncLawyersDataset } = require('../services/datasetSyncService');
      syncLawyersDataset(db);
    } catch (e) {}
    return Lawyer.findById(id);
  }

  /**
   * Delete lawyer by ID (Admin)
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM lawyers WHERE id = ?');
    const res = stmt.run(Number(id));
    try {
      const { syncLawyersDataset } = require('../services/datasetSyncService');
      syncLawyersDataset(db);
    } catch (e) {}
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

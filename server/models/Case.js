const db = require('../db');

class Case {
  /**
   * Find all cases assigned to a specific lawyer with search, status filtering, and sorting
   */
  static findByLawyerId(lawyerId, { search = '', status = '', court = '', limit = 100, offset = 0 } = {}) {
    if (!lawyerId) return [];

    let query = 'SELECT * FROM cases WHERE lawyerId = ?';
    const params = [Number(lawyerId)];

    if (status && status !== 'all' && status !== 'All') {
      query += ' AND LOWER(status) = LOWER(?)';
      params.push(status);
    }

    if (court && court !== 'all' && court !== 'All') {
      query += ' AND (courtCode = ? OR courtName LIKE ?)';
      params.push(court, `%${court}%`);
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(caseNumber) LIKE ? OR LOWER(title) LIKE ? OR LOWER(clientName) LIKE ? OR LOWER(courtName) LIKE ? OR LOWER(relevantActs) LIKE ? OR LOWER(opposingParty) LIKE ?)';
      params.push(q, q, q, q, q, q);
    }

    query += ' ORDER BY nextHearingDate ASC, id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    return db.prepare(query).all(...params);
  }

  /**
   * Find a specific case by ID
   */
  static findById(id) {
    if (!id) return null;
    return db.prepare('SELECT * FROM cases WHERE id = ?').get(id) || null;
  }

  /**
   * Find case by unique case number
   */
  static findByCaseNumber(caseNumber) {
    if (!caseNumber) return null;
    return db.prepare('SELECT * FROM cases WHERE caseNumber = ?').get(caseNumber) || null;
  }

  /**
   * Create a new case docket
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO cases (
        caseNumber, title, lawyerId, clientName, clientEmail, clientPhone,
        opposingParty, opposingCounsel, courtCode, courtName, bench,
        practiceArea, relevantActs, nextHearingDate, hearingTime, stage,
        status, disputeValue, caseSummary, lawyerNotes, filingDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.caseNumber,
      data.title,
      Number(data.lawyerId),
      data.clientName,
      data.clientEmail || '',
      data.clientPhone || '',
      data.opposingParty || '',
      data.opposingCounsel || '',
      data.courtCode || 'SCI',
      data.courtName || 'Supreme Court of India',
      data.bench || 'Principal Division Bench',
      data.practiceArea || 'General Litigation',
      data.relevantActs || '',
      data.nextHearingDate || new Date().toISOString().split('T')[0],
      data.hearingTime || '10:30 AM IST',
      data.stage || 'Notice & Admission',
      data.status || 'Active Hearing',
      data.disputeValue || '',
      data.caseSummary || '',
      data.lawyerNotes || '',
      data.filingDate || new Date().toISOString().split('T')[0]
    );

    return Case.findById(result.lastInsertRowid);
  }

  /**
   * Update case details (status, notes, hearing date, stage)
   */
  static update(id, updates = {}) {
    const fields = [];
    const params = [];

    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.stage !== undefined) {
      fields.push('stage = ?');
      params.push(updates.stage);
    }
    if (updates.nextHearingDate !== undefined) {
      fields.push('nextHearingDate = ?');
      params.push(updates.nextHearingDate);
    }
    if (updates.hearingTime !== undefined) {
      fields.push('hearingTime = ?');
      params.push(updates.hearingTime);
    }
    if (updates.lawyerNotes !== undefined) {
      fields.push('lawyerNotes = ?');
      params.push(updates.lawyerNotes);
    }
    if (updates.bench !== undefined) {
      fields.push('bench = ?');
      params.push(updates.bench);
    }

    if (fields.length === 0) return Case.findById(id);

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    db.prepare(`UPDATE cases SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return Case.findById(id);
  }

  /**
   * Get executive statistics for a lawyer's dashboard
   */
  static getStats(lawyerId) {
    if (!lawyerId) return { totalCases: 0, activeHearings: 0, disposed: 0, upcomingHearings: 0 };

    const total = db.prepare('SELECT count(*) as c FROM cases WHERE lawyerId = ?').get(lawyerId)?.c || 0;
    const active = db.prepare('SELECT count(*) as c FROM cases WHERE lawyerId = ? AND LOWER(status) LIKE "%active%"').get(lawyerId)?.c || 0;
    const disposed = db.prepare('SELECT count(*) as c FROM cases WHERE lawyerId = ? AND LOWER(status) LIKE "%disposed%"').get(lawyerId)?.c || 0;
    const consults = db.prepare('SELECT count(*) as c FROM consultations WHERE lawyerId = ?').get(lawyerId)?.c || 0;

    return {
      totalCases: total,
      activeHearings: active,
      disposedCases: disposed,
      consultationsCount: consults
    };
  }
}

module.exports = Case;


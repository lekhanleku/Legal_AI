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

    if (updates.title !== undefined) {
      fields.push('title = ?');
      params.push(updates.title);
    }
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
    if (updates.caseSummary !== undefined) {
      fields.push('caseSummary = ?');
      params.push(updates.caseSummary);
    }
    if (updates.opposingParty !== undefined) {
      fields.push('opposingParty = ?');
      params.push(updates.opposingParty);
    }
    if (updates.opposingCounsel !== undefined) {
      fields.push('opposingCounsel = ?');
      params.push(updates.opposingCounsel);
    }
    if (updates.courtCode !== undefined) {
      fields.push('courtCode = ?');
      params.push(updates.courtCode);
    }
    if (updates.courtName !== undefined) {
      fields.push('courtName = ?');
      params.push(updates.courtName);
    }
    if (updates.practiceArea !== undefined) {
      fields.push('practiceArea = ?');
      params.push(updates.practiceArea);
    }
    if (updates.relevantActs !== undefined) {
      fields.push('relevantActs = ?');
      params.push(updates.relevantActs);
    }
    if (updates.clientName !== undefined) {
      fields.push('clientName = ?');
      params.push(updates.clientName);
    }
    if (updates.clientEmail !== undefined) {
      fields.push('clientEmail = ?');
      params.push(updates.clientEmail);
    }
    if (updates.clientPhone !== undefined) {
      fields.push('clientPhone = ?');
      params.push(updates.clientPhone);
    }
    if (updates.disputeValue !== undefined) {
      fields.push('disputeValue = ?');
      params.push(updates.disputeValue);
    }

    if (fields.length === 0) return Case.findById(id);

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    db.prepare(`UPDATE cases SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return Case.findById(id);
  }

  /**
   * Delete case docket permanently
   */
  static delete(id) {
    if (!id) return false;
    const stmt = db.prepare('DELETE FROM cases WHERE id = ?');
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Find all platform cases for master admin with joins to lawyer details
   */
  static findAllAdmin({ search = '', status = '', court = '', lawyerId = null, limit = 100, offset = 0 } = {}) {
    let query = `
      SELECT c.*, l.name as lawyerName, l.specialty as lawyerSpecialty, l.firmName as lawyerFirm, l.barNumber as lawyerBarNumber
      FROM cases c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE 1=1
    `;
    const params = [];

    if (lawyerId && lawyerId !== 'all') {
      query += ' AND c.lawyerId = ?';
      params.push(Number(lawyerId));
    }

    if (status && status !== 'all' && status !== 'All') {
      query += ' AND LOWER(c.status) LIKE LOWER(?)';
      params.push(`%${status}%`);
    }

    if (court && court !== 'all' && court !== 'All') {
      query += ' AND (c.courtCode = ? OR c.courtName LIKE ?)';
      params.push(court, `%${court}%`);
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(c.caseNumber) LIKE ? OR
        LOWER(c.title) LIKE ? OR
        LOWER(c.clientName) LIKE ? OR
        LOWER(c.clientEmail) LIKE ? OR
        LOWER(COALESCE(l.name, '')) LIKE ? OR
        LOWER(c.courtName) LIKE ? OR
        LOWER(c.relevantActs) LIKE ? OR
        LOWER(c.opposingParty) LIKE ?
      )`;
      params.push(q, q, q, q, q, q, q, q);
    }

    const countQuery = query.replace(
      'SELECT c.*, l.name as lawyerName, l.specialty as lawyerSpecialty, l.firmName as lawyerFirm, l.barNumber as lawyerBarNumber',
      'SELECT COUNT(*) as total'
    );
    const total = db.prepare(countQuery).get(...params).total;

    query += ' ORDER BY c.nextHearingDate ASC, c.id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const cases = db.prepare(query).all(...params);
    return { cases, total };
  }

  /**
   * Get executive statistics for master admin
   */
  static getAdminStats() {
    const totalCases = db.prepare('SELECT count(*) as c FROM cases').get()?.c || 0;
    const activeHearings = db.prepare("SELECT count(*) as c FROM cases WHERE LOWER(status) LIKE '%active%' OR LOWER(status) LIKE '%hearing%' OR LOWER(status) LIKE '%arguments%'").get()?.c || 0;
    const disposedCases = db.prepare("SELECT count(*) as c FROM cases WHERE LOWER(status) LIKE '%disposed%' OR LOWER(status) LIKE '%settled%' OR LOWER(status) LIKE '%dismissed%'").get()?.c || 0;
    const distinctCourts = db.prepare('SELECT count(DISTINCT courtCode) as c FROM cases').get()?.c || 0;
    const lawyersWithCases = db.prepare('SELECT count(DISTINCT lawyerId) as c FROM cases').get()?.c || 0;

    return {
      totalCases,
      activeHearings,
      disposedCases,
      distinctCourts,
      lawyersWithCases
    };
  }

  /**
   * Get executive statistics for a lawyer's dashboard
   */
  static getStats(lawyerId) {
    if (!lawyerId) return { totalCases: 0, activeHearings: 0, disposed: 0, upcomingHearings: 0 };

    const total = db.prepare('SELECT count(*) as c FROM cases WHERE lawyerId = ?').get(lawyerId)?.c || 0;
    const active = db.prepare("SELECT count(*) as c FROM cases WHERE lawyerId = ? AND LOWER(status) LIKE '%active%'").get(lawyerId)?.c || 0;
    const disposed = db.prepare("SELECT count(*) as c FROM cases WHERE lawyerId = ? AND LOWER(status) LIKE '%disposed%'").get(lawyerId)?.c || 0;
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


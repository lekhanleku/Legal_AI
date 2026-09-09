const db = require('../db');

class Court {
  /**
   * Find courts matching search and filter criteria
   */
  static findAll(filters = {}) {
    const {
      search = '',
      jurisdiction = '',
      state = '',
      filingSystem = '',
      limit = 50,
      offset = 0
    } = filters;

    let query = 'SELECT * FROM courts WHERE isAvailable = 1';
    const params = [];

    if (jurisdiction && jurisdiction !== 'All Jurisdictions') {
      query += ' AND jurisdiction = ?';
      params.push(jurisdiction);
    }

    if (state && state !== 'All States') {
      query += ' AND state = ?';
      params.push(state);
    }

    if (filingSystem && filingSystem !== 'All Systems') {
      query += ' AND filingSystem LIKE ?';
      params.push(`%${filingSystem}%`);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR code LIKE ? OR city LIKE ? OR state LIKE ? OR chiefJudge LIKE ? OR divisions LIKE ? OR overview LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Find court by primary key ID
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM courts WHERE id = ?');
    return stmt.get(id) || null;
  }

  /**
   * Find court by court unique code
   */
  static findByCode(code) {
    const stmt = db.prepare('SELECT * FROM courts WHERE code = ?');
    return stmt.get(code) || null;
  }

  /**
   * Get aggregate court directory stats
   */
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) AS total FROM courts WHERE isAvailable = 1');
    const total = totalStmt.get().total;

    const jurisdictionsStmt = db.prepare(`
      SELECT jurisdiction, COUNT(*) AS count
      FROM courts
      WHERE isAvailable = 1
      GROUP BY jurisdiction
      ORDER BY count DESC
    `);
    const jurisdictions = jurisdictionsStmt.all();

    const statesStmt = db.prepare(`
      SELECT state, COUNT(*) AS count
      FROM courts
      WHERE isAvailable = 1
      GROUP BY state
      ORDER BY count DESC
    `);
    const states = statesStmt.all();

    return {
      totalCourts: total,
      jurisdictions,                             
      states
    };
  }
}

module.exports = Court;

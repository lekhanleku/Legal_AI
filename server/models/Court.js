const db = require('../db');

class Court {
  /**
   * Find courts matching search and filter criteria for public directory
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
   * Find all courts for admin management (including inactive/recessed)
   */
  static findAllAdmin(filters = {}) {
    const {
      search = '',
      jurisdiction = '',
      state = '',
      limit = 100,
      offset = 0
    } = filters;

    let query = 'SELECT * FROM courts WHERE 1=1';
    const params = [];

    if (jurisdiction && jurisdiction !== 'All Jurisdictions' && jurisdiction !== 'all') {
      query += ' AND jurisdiction = ?';
      params.push(jurisdiction);
    }

    if (state && state !== 'All States' && state !== 'all') {
      query += ' AND state = ?';
      params.push(state);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(code) LIKE ? OR LOWER(city) LIKE ? OR LOWER(state) LIKE ? OR LOWER(chiefJudge) LIKE ? OR LOWER(divisions) LIKE ? OR LOWER(overview) LIKE ?)';
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
    return stmt.get(Number(id)) || null;
  }

  /**
   * Find court by court unique code
   */
  static findByCode(code) {
    const stmt = db.prepare('SELECT * FROM courts WHERE code = ?');
    return stmt.get(code) || null;
  }

  /**
   * Add new court venue (Admin)
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO courts (
        name, code, jurisdiction, level, circuit, city, state, address,
        zipCode, phone, website, clerkHours, filingSystem, chiefJudge,
        divisions, overview, badge, isAvailable
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      data.name,
      data.code,
      data.jurisdiction || 'Federal District',
      data.level || 'Trial',
      data.circuit || '',
      data.city,
      data.state,
      data.address,
      data.zipCode || '',
      data.phone,
      data.website,
      data.clerkHours || '8:30 AM - 5:00 PM',
      data.filingSystem || 'CM/ECF',
      data.chiefJudge || 'Chief Judge Presiding',
      data.divisions || 'Civil, Criminal',
      data.overview || 'Authoritative judicial forum and trial venue.',
      data.badge || '',
      data.isAvailable !== undefined ? (data.isAvailable ? 1 : 0) : 1
    );

    return Court.findById(result.lastInsertRowid);
  }

  /**
   * Update existing court venue (Admin)
   */
  static update(id, data) {
    const fields = [];
    const params = [];

    const allowed = [
      'name', 'code', 'jurisdiction', 'level', 'circuit', 'city', 'state',
      'address', 'zipCode', 'phone', 'website', 'clerkHours', 'filingSystem',
      'chiefJudge', 'divisions', 'overview', 'badge', 'isAvailable'
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return Court.findById(id);

    const sql = `UPDATE courts SET ${fields.join(', ')} WHERE id = ?`;
    params.push(Number(id));

    db.prepare(sql).run(...params);
    return Court.findById(id);
  }

  /**
   * Delete court venue by ID (Admin)
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM courts WHERE id = ?');
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Get aggregate court directory stats
   */
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) AS total FROM courts');
    const total = totalStmt.get().total;

    const activeStmt = db.prepare('SELECT COUNT(*) AS active FROM courts WHERE isAvailable = 1');
    const active = activeStmt.get().active;

    const jurisdictionsStmt = db.prepare(`
      SELECT jurisdiction, COUNT(*) AS count
      FROM courts
      GROUP BY jurisdiction
      ORDER BY count DESC
    `);
    const jurisdictions = jurisdictionsStmt.all();

    const statesStmt = db.prepare(`
      SELECT state, COUNT(*) AS count
      FROM courts
      GROUP BY state
      ORDER BY count DESC
    `);
    const states = statesStmt.all();

    return {
      totalCourts: total,
      activeCourts: active,
      jurisdictions,
      states
    };
  }
}

module.exports = Court;

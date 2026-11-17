const db = require('../db');

class Consultation {
  /**
   * Book / create a new consultation
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO consultations (
        lawyerId, userId, clientName, clientEmail, clientPhone, preferredDate, caseSummary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.lawyerId,
      data.userId || null,
      data.clientName,
      data.clientEmail,
      data.clientPhone,
      data.preferredDate,
      data.caseSummary,
      data.status || 'pending'
    );

    const consultId = result.lastInsertRowid;

    // Automatically trigger notification for the lawyer
    try {
      const notifStmt = db.prepare(`
        INSERT INTO notifications (
          lawyerId, consultationId, type, title, message,
          clientName, clientEmail, clientPhone, preferredDate
        ) VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?)
      `);
      notifStmt.run(
        data.lawyerId,
        consultId,
        `New Consultation Request from ${data.clientName}`,
        `Preferred session time: ${data.preferredDate}. Summary: ${(data.caseSummary || 'Legal Advisory').substring(0, 120)}...`,
        data.clientName,
        data.clientEmail,
        data.clientPhone,
        data.preferredDate
      );
    } catch (_) {}

    return this.findById(consultId);
  }

  /**
   * Find consultation by primary ID
   */
  static findById(id) {
    if (!id) return null;
    return db.prepare(`
      SELECT c.*, l.name as lawyerName, l.firmName, l.hourlyRate, l.phone as lawyerPhone, l.email as lawyerEmail
      FROM consultations c
      LEFT JOIN lawyers l ON l.id = c.lawyerId
      WHERE c.id = ?
    `).get(Number(id));
  }

  /**
   * Get all consultations for a lawyer
   */
  static findByLawyerId(lawyerId, status = null) {
    let query = `
      SELECT c.*, l.name as lawyerName, l.firmName, l.hourlyRate
      FROM consultations c
      JOIN lawyers l ON l.id = c.lawyerId
      WHERE c.lawyerId = ?
    `;
    const params = [Number(lawyerId)];

    if (status && status !== 'all') {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.id DESC';
    return db.prepare(query).all(...params);
  }

  /**
   * Get all consultations for a user
   */
  static findByUserId(userId) {
    return db.prepare(`
      SELECT c.*, l.name as lawyerName, l.firmName, l.hourlyRate, l.avatarUrl as lawyerAvatar
      FROM consultations c
      LEFT JOIN lawyers l ON l.id = c.lawyerId
      WHERE c.userId = ?
      ORDER BY c.id DESC
    `).all(Number(userId));
  }

  /**
   * Query all consultations with filters and pagination (Admin / Reporting)
   */
  static findAll(filters = {}) {
    const { status = 'all', search = '', limit = 50, offset = 0 } = filters;

    let query = `
      SELECT c.*, l.name as lawyerName, l.firmName, l.hourlyRate
      FROM consultations c
      LEFT JOIN lawyers l ON l.id = c.lawyerId
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
   * Update consultation status
   */
  static updateStatus(id, status) {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}`);
    }

    const stmt = db.prepare('UPDATE consultations SET status = ? WHERE id = ?');
    stmt.run(status, Number(id));
    return this.findById(id);
  }

  /**
   * Cancel consultation by ID
   */
  static cancel(id) {
    return this.updateStatus(id, 'cancelled');
  }

  /**
   * Delete consultation by ID
   */
  static delete(id) {
    const res = db.prepare('DELETE FROM consultations WHERE id = ?').run(Number(id));
    return res.changes > 0;
  }

  /**
   * Permanently delete all consultations across all lawyers
   */
  static clearAll(userId = null) {
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
   * Get aggregate consultation statistics
   */
  static getStats() {
    const total = db.prepare('SELECT COUNT(*) as count FROM consultations').get().count;
    const statuses = db.prepare('SELECT status, COUNT(*) as count FROM consultations GROUP BY status').all();

    const statusMap = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    statuses.forEach(s => { statusMap[s.status] = s.count; });

    return {
      total,
      byStatus: statusMap
    };
  }
}

module.exports = Consultation;


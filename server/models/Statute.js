const db = require('../db');

class Statute {
  /**
   * Find all statutes matching filters
   */
  static findAll(filters = {}) {
    const { domain = '', jurisdiction = '', status = '', search = '', limit = 100, offset = 0 } = filters;

    let query = 'SELECT * FROM statutes WHERE 1=1';
    const params = [];

    if (domain && domain !== 'All') {
      query += ' AND LOWER(domain) LIKE ?';
      params.push(`%${domain.toLowerCase()}%`);
    }

    if (jurisdiction && jurisdiction !== 'All') {
      query += ' AND LOWER(jurisdiction) = ?';
      params.push(jurisdiction.toLowerCase());
    }

    if (status && status !== 'All') {
      query += ' AND UPPER(status) = ?';
      params.push(status.toUpperCase());
    }

    if (search && search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(title) LIKE ? OR LOWER(citation) LIKE ? OR LOWER(text) LIKE ? OR LOWER(actName) LIKE ? OR LOWER(section) LIKE ?)';
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params);
    return rows.map(r => Statute._parseJsonFields(r));
  }

  /**
   * Find statute by docKey (e.g. STATUTE_DPDP_2023_S06)
   */
  static findByDocKey(docKey) {
    if (!docKey) return null;
    const row = db.prepare('SELECT * FROM statutes WHERE docKey = ?').get(docKey);
    return row ? Statute._parseJsonFields(row) : null;
  }

  /**
   * Find statutes by domain
   */
  static findByDomain(domain) {
    if (!domain) return [];
    const rows = db.prepare('SELECT * FROM statutes WHERE LOWER(domain) LIKE ?').all(`%${domain.toLowerCase()}%`);
    return rows.map(r => Statute._parseJsonFields(r));
  }

  /**
   * Get statute transition/evolution versions
   */
  static getVersions(transitionKey = null) {
    if (transitionKey) {
      return db.prepare('SELECT * FROM statute_versions WHERE transitionKey = ?').all(transitionKey);
    }
    return db.prepare('SELECT * FROM statute_versions ORDER BY id ASC').all();
  }

  /**
   * Get corpus statistics for evaluation and analytics
   */
  static getCorpusStats() {
    const totalStatutes = db.prepare('SELECT COUNT(*) as count FROM statutes').get().count;
    const totalVersions = db.prepare('SELECT COUNT(*) as count FROM statute_versions').get().count;
    const byDomain = db.prepare('SELECT domain, COUNT(*) as count FROM statutes GROUP BY domain ORDER BY count DESC').all();
    const byJurisdiction = db.prepare('SELECT jurisdiction, COUNT(*) as count FROM statutes GROUP BY jurisdiction').all();

    return {
      totalStatutes,
      totalVersions,
      byDomain,
      byJurisdiction
    };
  }

  /**
   * Internal helper to parse structured JSON fields safely
   */
  static _parseJsonFields(row) {
    if (!row) return null;
    const jsonFields = [
      'structureJson', 'preconditionsJson', 'exceptionsJson',
      'crossReferencesJson', 'keyElementsJson', 'actionChecklistJson',
      'supersedesJson', 'supersededByJson'
    ];

    for (const f of jsonFields) {
      if (row[f] && typeof row[f] === 'string') {
        try {
          row[f] = JSON.parse(row[f]);
        } catch (_) {}
      }
    }
    return row;
  }
}

module.exports = Statute;


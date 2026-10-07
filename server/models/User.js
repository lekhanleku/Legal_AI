const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Find user by email address
   * @param {string} email 
   * @returns {object|null}
   */
  static findByEmail(email) {
    if (!email) return null;
    const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
    return stmt.get(email) || null;
  }

  /**
   * Find user by ID
   * @param {number|string} id 
   * @returns {object|null}
   */
  static findById(id) {
    if (!id) return null;
    const stmt = db.prepare('SELECT id, name, email, role, isVerified, createdAt, updatedAt FROM users WHERE id = ?');
    return stmt.get(id) || null;
  }

  /**
   * Create a new user with hashed password
   * @param {object} userData { name, email, password, role }
   * @returns {object} Created user object (excluding password)
   */
  static async create({ name, email, password, role = 'user' }) {
    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, cleanEmail, hashedPassword, role);
    
    return User.findById(result.lastInsertRowid);
  }

  /**
   * Compare candidate password with stored hash
   * @param {string} candidatePassword 
   * @param {string} hashedPassword 
   * @returns {Promise<boolean>}
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Find all users with search, role filtering, and pagination
   */
  static findAll({ search = '', role = '', limit = 50, offset = 0 } = {}) {
    let query = 'SELECT id, name, email, role, isVerified, createdAt, updatedAt FROM users WHERE 1=1';
    const params = [];

    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search && search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ?)';
      params.push(s, s);
    }

    const countStmt = db.prepare(query.replace('SELECT id, name, email, role, isVerified, createdAt, updatedAt', 'SELECT COUNT(*) as total'));
    const total = countStmt.get(...params).total;

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const users = db.prepare(query).all(...params);
    return { users, total };
  }

  /**
   * Update user details (name, email, role, isVerified, password)
   */
  static async update(id, updates = {}) {
    const fields = [];
    const params = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      params.push(updates.name.trim());
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      params.push(updates.email.toLowerCase().trim());
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      params.push(updates.role);
    }
    if (updates.isVerified !== undefined) {
      fields.push('isVerified = ?');
      params.push(updates.isVerified ? 1 : 0);
    }
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      fields.push('password = ?');
      params.push(hashedPassword);
    }

    if (fields.length === 0) return User.findById(id);

    fields.push("updatedAt = CURRENT_TIMESTAMP");
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(Number(id));

    db.prepare(sql).run(...params);
    return User.findById(id);
  }

  /**
   * Delete user by ID
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const res = stmt.run(Number(id));
    return res.changes > 0;
  }

  /**
   * Get user summary statistics for admin dashboard
   */
  static getStats() {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const verifiedUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE isVerified = 1').get().count;
    const roles = db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all();
    
    const roleMap = { user: 0, lawyer: 0, admin: 0 };
    roles.forEach(r => { roleMap[r.role] = r.count; });

    const recentUsers = db.prepare('SELECT id, name, email, role, createdAt FROM users ORDER BY id DESC LIMIT 5').all();

    return {
      totalUsers,
      verifiedUsers,
      roleBreakdown: roleMap,
      recentUsers
    };
  }
}

module.exports = User;


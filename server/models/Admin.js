const bcrypt = require('bcryptjs');
const db = require('../db');

class Admin {
  static findById(id) {
    if (!id) return null;
    const stmt = db.prepare('SELECT id, name, email, phone, role, isSuperAdmin, createdAt, updatedAt FROM admins WHERE id = ?');
    return stmt.get(id) || null;
  }

  static findByEmail(email) {
    if (!email) return null;
    const stmt = db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)');
    return stmt.get(email.trim()) || null;
  }

  static async create({ name, email, password, phone = '', isSuperAdmin = 0 }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const cleanEmail = email.toLowerCase().trim();

    const stmt = db.prepare(`
      INSERT INTO admins (name, email, password, phone, role, isSuperAdmin)
      VALUES (?, ?, ?, ?, 'admin', ?)
    `);

    const result = stmt.run(name, cleanEmail, hashedPassword, phone, isSuperAdmin ? 1 : 0);
    return this.findById(result.lastInsertRowid);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static getAll() {
    return db.prepare('SELECT id, name, email, phone, role, isSuperAdmin, createdAt, updatedAt FROM admins ORDER BY id ASC').all();
  }
}

module.exports = Admin;

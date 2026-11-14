const bcrypt = require('bcryptjs');
const db = require('../db');

class AdvocateAccount {
  static findById(id) {
    if (!id) return null;
    const stmt = db.prepare('SELECT id, lawyerId, name, email, phone, barNumber, specialty, role, isVerified, createdAt, updatedAt FROM advocate_accounts WHERE id = ?');
    return stmt.get(id) || null;
  }

  static findByEmail(email) {
    if (!email) return null;
    const stmt = db.prepare('SELECT * FROM advocate_accounts WHERE LOWER(email) = LOWER(?)');
    return stmt.get(email.trim()) || null;
  }

  static findByLawyerId(lawyerId) {
    if (!lawyerId) return null;
    const stmt = db.prepare('SELECT * FROM advocate_accounts WHERE lawyerId = ?');
    return stmt.get(lawyerId) || null;
  }

  static async create({ lawyerId, name, email, password, phone = '', barNumber = '', specialty = '', isVerified = 1 }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const cleanEmail = email.toLowerCase().trim();

    const stmt = db.prepare(`
      INSERT INTO advocate_accounts (lawyerId, name, email, password, phone, barNumber, specialty, role, isVerified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'lawyer', ?)
    `);

    const result = stmt.run(lawyerId, name, cleanEmail, hashedPassword, phone, barNumber, specialty, isVerified ? 1 : 0);
    return this.findById(result.lastInsertRowid);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static getAll() {
    return db.prepare(`
      SELECT a.id, a.lawyerId, a.name, a.email, a.phone, a.barNumber, a.specialty, a.role, a.isVerified, a.createdAt,
             l.title, l.firmName, l.city, l.state, l.hourlyRate, l.avatarUrl
      FROM advocate_accounts a
      LEFT JOIN lawyers l ON a.lawyerId = l.id
      ORDER BY a.id ASC
    `).all();
  }
}

module.exports = AdvocateAccount;

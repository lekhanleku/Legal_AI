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
}

module.exports = User;


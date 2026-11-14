const db = require('../db');

class Notification {
  /**
   * Create a notification
   */
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO notifications (
        lawyerId, consultationId, type, title, message,
        clientName, clientEmail, clientPhone, preferredDate, isRead
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.lawyerId,
      data.consultationId || null,
      data.type || 'booking',
      data.title,
      data.message,
      data.clientName || '',
      data.clientEmail || '',
      data.clientPhone || '',
      data.preferredDate || '',
      data.isRead !== undefined ? (data.isRead ? 1 : 0) : 0
    );

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Find notification by ID
   */
  static findById(id) {
    if (!id) return null;
    return db.prepare('SELECT * FROM notifications WHERE id = ?').get(Number(id));
  }

  /**
   * Get notifications for a lawyer
   */
  static findByLawyerId(lawyerId, limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM notifications 
      WHERE lawyerId = ? 
      ORDER BY createdAt DESC 
      LIMIT ?
    `);
    return stmt.all(Number(lawyerId), Number(limit));
  }

  /**
   * Mark a single notification as read
   */
  static markAsRead(notificationId, lawyerId = null) {
    if (lawyerId) {
      const stmt = db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ? AND lawyerId = ?');
      stmt.run(Number(notificationId), Number(lawyerId));
    } else {
      const stmt = db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?');
      stmt.run(Number(notificationId));
    }
    return this.findById(notificationId);
  }

  /**
   * Mark all notifications for a lawyer as read
   */
  static markAllAsRead(lawyerId) {
    const stmt = db.prepare('UPDATE notifications SET isRead = 1 WHERE lawyerId = ?');
    stmt.run(Number(lawyerId));
    return { success: true };
  }

  /**
   * Delete notification by ID
   */
  static delete(id) {
    const res = db.prepare('DELETE FROM notifications WHERE id = ?').run(Number(id));
    return res.changes > 0;
  }
}

module.exports = Notification;


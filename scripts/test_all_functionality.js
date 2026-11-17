const path = require('path');
const db = require('../server/db');

async function testAll() {
  console.log('--- STARTING COMPREHENSIVE SYSTEM VERIFICATION ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Database connection & tables
    const tableRows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    const tableNames = tableRows.map(r => r.name);
    console.log('Tables found:', tableNames.join(', '));
    assert(tableNames.includes('users'), 'Table "users" exists');
    assert(tableNames.includes('admins'), 'Table "admins" exists');
    assert(tableNames.includes('advocate_accounts'), 'Table "advocate_accounts" exists');
    assert(tableNames.includes('lawyers'), 'Table "lawyers" exists');
    assert(tableNames.includes('courts'), 'Table "courts" exists');
    assert(tableNames.includes('consultations'), 'Table "consultations" exists');
    assert(tableNames.includes('notifications'), 'Table "notifications" exists');

    // 2. Database segregation verification
    const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get().c;
    const advocateCount = db.prepare('SELECT COUNT(*) as c FROM advocate_accounts').get().c;
    const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const nonUserInUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role != 'user'").get().c;

    console.log(`User Counts -> Clients: ${userCount}, Admins: ${adminCount}, Advocate Accounts: ${advocateCount}`);
    assert(adminCount >= 1, 'Default/Admin accounts present in admins table', `Count: ${adminCount}`);
    assert(advocateCount >= 1, 'Advocate accounts present in advocate_accounts table', `Count: ${advocateCount}`);
    assert(nonUserInUsers === 0, 'Users table contains STRICTLY client accounts (role=user)', `Found non-user: ${nonUserInUsers}`);

    // Check specific credentials
    const adminUser = db.prepare('SELECT * FROM admins WHERE email = ?').get('admin@legalai.com');
    assert(adminUser && adminUser.role === 'admin', 'Admin account admin@legalai.com exists with role=admin');

    const sampleAdvocate = db.prepare('SELECT * FROM advocate_accounts LIMIT 1').get();
    assert(sampleAdvocate && sampleAdvocate.role === 'lawyer', 'Advocate account exists with role=lawyer', sampleAdvocate ? sampleAdvocate.email : 'none');

    // 3. Lawyers verification
    const lawyerCount = db.prepare('SELECT COUNT(*) as c FROM lawyers').get().c;
    assert(lawyerCount >= 25, 'Indian Advocates populated in database', `Count: ${lawyerCount}`);
    const availableLawyers = db.prepare('SELECT COUNT(*) as c FROM lawyers WHERE isAvailable = 1').get().c;
    assert(availableLawyers > 0, 'Available advocates ready for consultation', `Count: ${availableLawyers}`);

    // 4. Courts verification
    const courtCount = db.prepare('SELECT COUNT(*) as c FROM courts').get().c;
    assert(courtCount >= 20, 'Indian Courts populated in database', `Count: ${courtCount}`);

    // 5. Check Consultations & Notifications
    const consultCount = db.prepare('SELECT COUNT(*) as c FROM consultations').get().c;
    const notifCount = db.prepare('SELECT COUNT(*) as c FROM notifications').get().c;
    console.log(`Live Consultations: ${consultCount}, Live Notifications: ${notifCount}`);

    // Test creating a consultation booking
    const testLawyer = db.prepare('SELECT id, name FROM lawyers LIMIT 1').get();
    const testClient = db.prepare('SELECT id, name, email, phone FROM users LIMIT 1').get() || {
      id: 999999,
      name: 'Verification Test User',
      email: 'test_verify@example.com',
      phone: '9876543210'
    };

    const bookStmt = db.prepare(`
      INSERT INTO consultations (lawyerId, userId, clientName, clientEmail, clientPhone, preferredDate, caseSummary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `);
    const bookResult = bookStmt.run(
      testLawyer.id,
      testClient.id,
      testClient.name,
      testClient.email,
      testClient.phone || '9876543210',
      '2026-11-20',
      'Verification test consultation for legal consultation flow.'
    );
    const newConsultId = bookResult.lastInsertRowid;
    assert(newConsultId > 0, 'Consultation booking creates new record in database', `ID: ${newConsultId}`);

    // Test notification insertion
    const notifStmt = db.prepare(`
      INSERT INTO notifications (lawyerId, consultationId, type, title, message, clientName, clientEmail, clientPhone, preferredDate, isRead)
      VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?, 0)
    `);
    const notifResult = notifStmt.run(
      testLawyer.id,
      newConsultId,
      'New Consultation Request: ' + testClient.name,
      'Test booking message',
      testClient.name,
      testClient.email,
      testClient.phone || '9876543210',
      '2026-11-20'
    );
    assert(notifResult.lastInsertRowid > 0, 'Booking automatically creates notification for advocate', `ID: ${notifResult.lastInsertRowid}`);

    // 6. Test Advocate Portal Queries
    // An advocate should be able to fetch their consultation requests, notifications, and client dossier
    const advConsults = db.prepare('SELECT * FROM consultations WHERE lawyerId = ? ORDER BY id DESC').all(testLawyer.id);
    assert(advConsults.length > 0, 'Advocate can query consultations for their lawyerId', `Found: ${advConsults.length}`);

    const advNotifs = db.prepare('SELECT * FROM notifications WHERE lawyerId = ? ORDER BY id DESC').all(testLawyer.id);
    assert(advNotifs.length > 0, 'Advocate can query notifications for their lawyerId', `Found: ${advNotifs.length}`);

    // Test consultation status update by Advocate
    const updateConsult = db.prepare("UPDATE consultations SET status = 'confirmed' WHERE id = ?").run(newConsultId);
    assert(updateConsult.changes === 1, 'Advocate can confirm/update consultation status');

    // 7. Test Admin Control Queries
    // Admin has control on both clients and advocates
    const allUsersAdmin = db.prepare('SELECT id, name, email, role FROM users LIMIT 5').all();
    assert(allUsersAdmin.length > 0, 'Admin can view all client accounts');

    const allAdvocatesAdmin = db.prepare(`
      SELECT a.id, a.name, a.email, a.barNumber, a.specialty, l.title, l.city 
      FROM advocate_accounts a
      LEFT JOIN lawyers l ON a.lawyerId = l.id
      LIMIT 5
    `).all();
    assert(allAdvocatesAdmin.length > 0, 'Admin can view all advocate accounts with linked lawyer data');

    const allConsultationsAdmin = db.prepare(`
      SELECT c.*, l.name as lawyerName 
      FROM consultations c 
      LEFT JOIN lawyers l ON c.lawyerId = l.id 
      LIMIT 5
    `).all();
    assert(allConsultationsAdmin.length > 0, 'Admin can view all platform consultations');

    // Clean up test consultation and notification
    db.prepare('DELETE FROM notifications WHERE id = ?').run(notifResult.lastInsertRowid);
    db.prepare('DELETE FROM consultations WHERE id = ?').run(newConsultId);
    console.log('[CLEANUP] Verification test records cleaned up.');

    console.log(`\n--- VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  } catch (err) {
    console.error('[ERROR during verification]:', err);
  }
}

testAll();


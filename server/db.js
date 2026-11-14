const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.SQLITE_DB_PATH 
  ? path.resolve(__dirname, process.env.SQLITE_DB_PATH)
  : path.join(__dirname, 'legalai.db');

let db;

try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Auto-create users, ai_chats, lawyers, and consultations tables if they do not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      isVerified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NULL,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lawyers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      specialty TEXT NOT NULL,
      barNumber TEXT NOT NULL,
      experienceYears INTEGER NOT NULL,
      education TEXT NOT NULL,
      firmName TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      hourlyRate REAL NOT NULL,
      rating REAL DEFAULT 5.0,
      reviewCount INTEGER DEFAULT 0,
      languages TEXT NOT NULL,
      bio TEXT NOT NULL,
      casesWon INTEGER DEFAULT 0,
      successRate INTEGER DEFAULT 95,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      avatarUrl TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      courtCodes TEXT DEFAULT '',
      practicingCourts TEXT DEFAULT '',
      primaryCourt TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lawyerId INTEGER NOT NULL,
      userId INTEGER NULL,
      clientName TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      preferredDate TEXT NOT NULL,
      caseSummary TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lawyerId INTEGER NOT NULL,
      consultationId INTEGER NULL,
      type TEXT DEFAULT 'booking',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      preferredDate TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      jurisdiction TEXT NOT NULL,
      level TEXT NOT NULL,
      circuit TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      phone TEXT NOT NULL,
      website TEXT NOT NULL,
      clerkHours TEXT NOT NULL,
      filingSystem TEXT NOT NULL,
      chiefJudge TEXT NOT NULL,
      divisions TEXT NOT NULL,
      overview TEXT NOT NULL,
      badge TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      mapUrl TEXT DEFAULT '',
      mapEmbedUrl TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS statutes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      docKey TEXT NOT NULL UNIQUE,
      actCode TEXT DEFAULT '',
      actName TEXT DEFAULT '',
      domain TEXT NOT NULL,
      jurisdiction TEXT DEFAULT 'India',
      language TEXT DEFAULT 'en',
      section TEXT DEFAULT '',
      title TEXT NOT NULL,
      citation TEXT NOT NULL,
      effectiveDate TEXT DEFAULT NULL,
      repealDate TEXT DEFAULT NULL,
      status TEXT DEFAULT 'IN_FORCE',
      text TEXT NOT NULL,
      structureJson TEXT DEFAULT '{}',
      preconditionsJson TEXT DEFAULT '[]',
      exceptionsJson TEXT DEFAULT '[]',
      crossReferencesJson TEXT DEFAULT '[]',
      keyElementsJson TEXT DEFAULT '[]',
      actionChecklistJson TEXT DEFAULT '[]',
      supersedesJson TEXT DEFAULT 'null',
      supersededByJson TEXT DEFAULT 'null',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_statutes_docKey ON statutes(docKey);
    CREATE INDEX IF NOT EXISTS idx_statutes_domain ON statutes(domain);
    CREATE INDEX IF NOT EXISTS idx_statutes_jurisdiction ON statutes(jurisdiction);
    CREATE INDEX IF NOT EXISTS idx_statutes_status ON statutes(status);

    CREATE TABLE IF NOT EXISTS statute_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transitionKey TEXT NOT NULL UNIQUE,
      oldAct TEXT NOT NULL,
      oldSection TEXT NOT NULL,
      title TEXT NOT NULL,
      newAct TEXT NOT NULL,
      newSection TEXT NOT NULL,
      effectiveDate TEXT NOT NULL,
      status TEXT DEFAULT 'REPEALED_SUPERSEDED',
      jurisdiction TEXT DEFAULT 'India',
      punishment TEXT DEFAULT '',
      proceduralCode TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_statute_versions_key ON statute_versions(transitionKey);

    CREATE TABLE IF NOT EXISTS rag_query_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NULL,
      engine TEXT DEFAULT 'node-rag',
      query TEXT NOT NULL,
      category TEXT DEFAULT '',
      confidence REAL DEFAULT 0.0,
      route TEXT DEFAULT 'RETRIEVE',
      complexityScore REAL DEFAULT 0.0,
      jurisdiction TEXT DEFAULT 'India',
      retrievedDocKeysJson TEXT DEFAULT '[]',
      attributionPrecision REAL NULL,
      judgeScore REAL NULL,
      latencyMs REAL DEFAULT 0.0,
      userRating INTEGER NULL,
      userFeedback TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_rag_logs_user ON rag_query_logs(userId);
    CREATE INDEX IF NOT EXISTS idx_rag_logs_category ON rag_query_logs(category);

    CREATE TABLE IF NOT EXISTS rag_evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      benchmarkName TEXT NOT NULL,
      evaluatorType TEXT NOT NULL,
      krippendorffAlpha REAL DEFAULT 0.0,
      spearmanRho REAL DEFAULT 0.0,
      faithfulness REAL DEFAULT 0.0,
      citationPrecision REAL DEFAULT 0.0,
      preconditionCompleteness REAL DEFAULT 0.0,
      expertRating REAL DEFAULT 0.0,
      metricsJson TEXT DEFAULT '{}',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure map columns exist on existing SQLite databases
  try { db.prepare('ALTER TABLE courts ADD COLUMN latitude REAL DEFAULT 0').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN longitude REAL DEFAULT 0').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN mapUrl TEXT DEFAULT ""').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN mapEmbedUrl TEXT DEFAULT ""').run(); } catch(e){}

  // Ensure court affiliation columns exist on existing SQLite databases
  try { db.prepare("ALTER TABLE lawyers ADD COLUMN courtCodes TEXT DEFAULT ''").run(); } catch(e){}
  try { db.prepare("ALTER TABLE lawyers ADD COLUMN practicingCourts TEXT DEFAULT ''").run(); } catch(e){}
  try { db.prepare("ALTER TABLE lawyers ADD COLUMN primaryCourt TEXT DEFAULT ''").run(); } catch(e){}

  // Ensure phone column exists on users table
  try { db.prepare("ALTER TABLE users ADD COLUMN phone TEXT DEFAULT ''").run(); } catch(e){}

  // Cleanup any legacy placeholder/non-Indian lawyers
  db.prepare(`
    DELETE FROM lawyers WHERE barNumber LIKE '%Bar #%' 
      OR barNumber LIKE '%CA Bar%' 
      OR barNumber LIKE '%NY Bar%' 
      OR barNumber LIKE '%MA Bar%' 
      OR barNumber LIKE '%IL Bar%' 
      OR barNumber LIKE '%DC Bar%' 
      OR barNumber LIKE '%FL Bar%' 
      OR barNumber LIKE '%TX Bar%' 
      OR barNumber LIKE '%GA Bar%' 
      OR barNumber LIKE '%WA Bar%' 
      OR barNumber LIKE '%PA Bar%' 
      OR barNumber LIKE '%CO Bar%' 
      OR barNumber LIKE '%AZ Bar%' 
      OR barNumber LIKE '%OR Bar%' 
      OR barNumber LIKE '%NC Bar%'
  `).run();

  // Seed / Sync Lawyers table with authoritative Indian advocates with court affiliations
  const { INDIAN_LAWYERS } = require('./services/lawyersData');
  const checkLawyer = db.prepare('SELECT id FROM lawyers WHERE barNumber = ?');
  const updateLawyer = db.prepare(`
    UPDATE lawyers SET
      name = ?, title = ?, specialty = ?, experienceYears = ?, education = ?,
      firmName = ?, city = ?, state = ?, hourlyRate = ?, rating = ?, reviewCount = ?,
      languages = ?, bio = ?, casesWon = ?, successRate = ?, phone = ?, email = ?,
      avatarUrl = ?, isAvailable = ?, courtCodes = ?, practicingCourts = ?, primaryCourt = ?
    WHERE barNumber = ?
  `);
  const insertLawyer = db.prepare(`
    INSERT INTO lawyers (
      name, title, specialty, barNumber, experienceYears, education,
      firmName, city, state, hourlyRate, rating, reviewCount,
      languages, bio, casesWon, successRate, phone, email, avatarUrl, isAvailable,
      courtCodes, practicingCourts, primaryCourt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const syncLawyersTransaction = db.transaction((lawyers) => {
    let inserted = 0;
    let updated = 0;
    for (const l of lawyers) {
      const existing = checkLawyer.get(l.barNumber);
      if (existing) {
        updateLawyer.run(
          l.name, l.title, l.specialty, l.experienceYears, l.education,
          l.firmName, l.city, l.state, l.hourlyRate, l.rating !== undefined ? l.rating : 5.0, l.reviewCount || 0,
          l.languages, l.bio, l.casesWon || 0, l.successRate || 95, l.phone, l.email,
          l.avatarUrl || '', l.isAvailable !== undefined ? l.isAvailable : 1,
          l.courtCodes || '', l.practicingCourts || '', l.primaryCourt || '',
          l.barNumber
        );
        updated++;
      } else {
        insertLawyer.run(
          l.name, l.title, l.specialty, l.barNumber, l.experienceYears, l.education,
          l.firmName, l.city, l.state, l.hourlyRate, l.rating !== undefined ? l.rating : 5.0, l.reviewCount || 0,
          l.languages, l.bio, l.casesWon || 0, l.successRate || 95, l.phone, l.email,
          l.avatarUrl || '', l.isAvailable !== undefined ? l.isAvailable : 1,
          l.courtCodes || '', l.practicingCourts || '', l.primaryCourt || ''
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

  const lawyerSyncResult = syncLawyersTransaction(INDIAN_LAWYERS);
  console.log(` Synchronized ${INDIAN_LAWYERS.length} Indian Advocates with Court Affiliations (Inserted: ${lawyerSyncResult.inserted}, Updated: ${lawyerSyncResult.updated}).`);

  // Purge legacy foreign/US courts to ensure only authentic Indian courts remain
  db.prepare(`
    DELETE FROM courts WHERE code IN (
      'SCOTUS', 'CA9', 'CA2', 'CADC', 'CAFC', 'SDNY', 'NDCA', 'NDIL', 'CDCA',
      'EDTX', 'DE-CHANCERY', 'SDNY-BANKR', 'USTC', 'CASC', 'NYCA', 'TXSC',
      'COOK-IL', 'MASS-SUFFOLK', 'SDFL', 'FL-11TH', 'US-SDNY', 'US-CA9'
    ) OR circuit LIKE '%Circuit%' OR state IN ('NY', 'CA', 'DE', 'TX', 'IL', 'FL', 'MA', 'DC')
  `).run();

  // Seed / Sync Courts table with authoritative Indian apex courts, state high courts, tribunals, district courts, small causes & taluka courts with map locations
  const { INDIAN_COURTS } = require('./services/indianCourtsData');
  const checkCourt = db.prepare('SELECT id FROM courts WHERE code = ?');
  const updateCourt = db.prepare(`
    UPDATE courts SET
      name = ?, jurisdiction = ?, level = ?, circuit = ?, city = ?, state = ?,
      address = ?, zipCode = ?, phone = ?, website = ?, clerkHours = ?,
      filingSystem = ?, chiefJudge = ?, divisions = ?, overview = ?, badge = ?,
      isAvailable = ?, latitude = ?, longitude = ?, mapUrl = ?, mapEmbedUrl = ?
    WHERE code = ?
  `);
  const insertCourt = db.prepare(`
    INSERT INTO courts (
      name, code, jurisdiction, level, circuit, city, state,
      address, zipCode, phone, website, clerkHours, filingSystem,
      chiefJudge, divisions, overview, badge, isAvailable,
      latitude, longitude, mapUrl, mapEmbedUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const syncCourtsTransaction = db.transaction((courts) => {
    let inserted = 0;
    let updated = 0;
    for (const c of courts) {
      const existing = checkCourt.get(c.code);
      if (existing) {
        updateCourt.run(
          c.name, c.jurisdiction, c.level, c.circuit || '', c.city, c.state,
          c.address, c.zipCode, c.phone, c.website, c.clerkHours,
          c.filingSystem, c.chiefJudge, c.divisions, c.overview, c.badge || '',
          c.isAvailable !== undefined ? c.isAvailable : 1,
          c.latitude || 0, c.longitude || 0, c.mapUrl || '', c.mapEmbedUrl || '',
          c.code
        );
        updated++;
      } else {
        insertCourt.run(
          c.name, c.code, c.jurisdiction, c.level, c.circuit || '', c.city, c.state,
          c.address, c.zipCode, c.phone, c.website, c.clerkHours,
          c.filingSystem, c.chiefJudge, c.divisions, c.overview, c.badge || '',
          c.isAvailable !== undefined ? c.isAvailable : 1,
          c.latitude || 0, c.longitude || 0, c.mapUrl || '', c.mapEmbedUrl || ''
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

  const courtSyncResult = syncCourtsTransaction(INDIAN_COURTS);
  console.log(` Synchronized ${INDIAN_COURTS.length} Indian courts with Maps & Coordinates (Inserted: ${courtSyncResult.inserted}, Updated: ${courtSyncResult.updated}).`);

  // Auto-sync dataset files (datasets/ and ml/dataset/)
  try {
    const { syncAllDatasets } = require('./services/datasetSyncService');
    const syncRes = syncAllDatasets(db);
    console.log(` Synchronized dataset files: ${syncRes.courts.count} courts, ${syncRes.lawyers.count} advocates.`);
  } catch (dErr) {
    console.warn(' Dataset sync warning:', dErr.message);
  }

  // Auto-sync lawyer accounts and individual caseloads for all Indian advocates
  try {
    const { syncLawyerCasesAndAccounts } = require('./services/caseSyncService');
    syncLawyerCasesAndAccounts(db);
  } catch (cErr) {
    console.warn(' Lawyer cases sync warning:', cErr.message);
  }

  // Auto-sync statutory RAG corpus, temporal versions, and evaluation baseline
  try {
    const { syncStatutesAndVersions } = require('./services/statuteSyncService');
    const syncStats = syncStatutesAndVersions(db);
    console.log(` Synced ${syncStats.statutesCount} statutes and ${syncStats.versionsCount} statute versions to SQLite`);
  } catch (sErr) {
    console.warn(' Statutes sync warning:', sErr.message);
  }

  console.log(` SQLite Database connected & initialized: ${dbPath}`);
} catch (err) {
  console.error(` SQLite Connection Error: ${err.message}`);
}

module.exports = db;



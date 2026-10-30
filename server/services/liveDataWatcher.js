/**
 * liveDataWatcher.js
 * Automatically watches court and lawyer data files on disk.
 * Whenever changes are saved, it automatically updates and persists
 * those changes into the SQLite database (`legalai.db`) and dataset files in real time.
 */

const fs = require('fs');
const path = require('path');
const db = require('../db');
const { syncAllDatasets, syncCourtsDataset, syncLawyersDataset } = require('./datasetSyncService');

let isInternalSyncing = false;
const debounceTimers = new Map();

function debounce(key, delayMs, fn) {
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
  }
  debounceTimers.set(key, setTimeout(() => {
    debounceTimers.delete(key);
    fn();
  }, delayMs));
}

/**
 * Synchronize Courts from memory or data file to SQLite DB
 */
function syncCourtsToDB(courtsList) {
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

  const tx = db.transaction((items) => {
    let inserted = 0;
    let updated = 0;
    for (const c of items) {
      if (!c.code || !c.name) continue;
      const existing = checkCourt.get(c.code);
      if (existing) {
        updateCourt.run(
          c.name, c.jurisdiction || 'District & Sessions Court', c.level || 'Trial', c.circuit || '', c.city || '', c.state || '',
          c.address || '', c.zipCode || '', c.phone || '', c.website || '', c.clerkHours || '',
          c.filingSystem || '', c.chiefJudge || '', c.divisions || '', c.overview || '', c.badge || '',
          c.isAvailable !== undefined ? (c.isAvailable ? 1 : 0) : 1,
          Number(c.latitude) || 0, Number(c.longitude) || 0, c.mapUrl || '', c.mapEmbedUrl || '',
          c.code
        );
        updated++;
      } else {
        insertCourt.run(
          c.name, c.code, c.jurisdiction || 'District & Sessions Court', c.level || 'Trial', c.circuit || '', c.city || '', c.state || '',
          c.address || '', c.zipCode || '', c.phone || '', c.website || '', c.clerkHours || '',
          c.filingSystem || '', c.chiefJudge || '', c.divisions || '', c.overview || '', c.badge || '',
          c.isAvailable !== undefined ? (c.isAvailable ? 1 : 0) : 1,
          Number(c.latitude) || 0, Number(c.longitude) || 0, c.mapUrl || '', c.mapEmbedUrl || ''
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

  return tx(courtsList);
}

/**
 * Synchronize Lawyers from memory or data file to SQLite DB
 */
function syncLawyersToDB(lawyersList) {
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
      languages, bio, casesWon, successRate, phone, email,
      avatarUrl, isAvailable, courtCodes, practicingCourts, primaryCourt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((items) => {
    let inserted = 0;
    let updated = 0;
    for (const l of items) {
      if (!l.barNumber || !l.name) continue;
      const existing = checkLawyer.get(l.barNumber);
      if (existing) {
        updateLawyer.run(
          l.name, l.title || 'Advocate', l.specialty || 'General Practice', Number(l.experienceYears) || 10, l.education || '',
          l.firmName || '', l.city || '', l.state || '', Number(l.hourlyRate) || 25000, Number(l.rating) || 5.0, Number(l.reviewCount) || 10,
          l.languages || 'English, Hindi', l.bio || '', Number(l.casesWon) || 20, Number(l.successRate) || 95, l.phone || '', l.email || '',
          l.avatarUrl || '', l.isAvailable !== undefined ? (l.isAvailable ? 1 : 0) : 1,
          l.courtCodes || '', l.practicingCourts || '', l.primaryCourt || '',
          l.barNumber
        );
        updated++;
      } else {
        insertLawyer.run(
          l.name, l.title || 'Advocate', l.specialty || 'General Practice', l.barNumber, Number(l.experienceYears) || 10, l.education || '',
          l.firmName || '', l.city || '', l.state || '', Number(l.hourlyRate) || 25000, Number(l.rating) || 5.0, Number(l.reviewCount) || 10,
          l.languages || 'English, Hindi', l.bio || '', Number(l.casesWon) || 20, Number(l.successRate) || 95, l.phone || '', l.email || '',
          l.avatarUrl || '', l.isAvailable !== undefined ? (l.isAvailable ? 1 : 0) : 1,
          l.courtCodes || '', l.practicingCourts || '', l.primaryCourt || ''
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

  return tx(lawyersList);
}

/**
 * Start the live file watcher
 */
function startLiveWatcher() {
  const courtsDataPath = path.join(__dirname, 'indianCourtsData.js');
  const lawyersDataPath = path.join(__dirname, 'lawyersData.js');
  const courtsDatasetPath = path.join(__dirname, '..', '..', 'datasets', 'courts_dataset.json');
  const lawyersDatasetPath = path.join(__dirname, '..', '..', 'datasets', 'lawyers_dataset.json');

  // 1. Watch server/services/indianCourtsData.js
  if (fs.existsSync(courtsDataPath)) {
    try {
      fs.watch(courtsDataPath, (eventType) => {
        if (eventType === 'change') {
          debounce('watch_indianCourtsData', 400, () => {
            try {
              delete require.cache[require.resolve('./indianCourtsData')];
              const { INDIAN_COURTS } = require('./indianCourtsData');
              if (Array.isArray(INDIAN_COURTS) && INDIAN_COURTS.length > 0) {
                const res = syncCourtsToDB(INDIAN_COURTS);
                syncCourtsDataset(db);
                console.log(`🔄 [Auto-Watcher] indianCourtsData.js modified -> Automatically saved to database! (Updated: ${res.updated}, Inserted: ${res.inserted})`);
              }
            } catch (err) {
              console.warn('⚠️ [Auto-Watcher] Error syncing indianCourtsData:', err.message);
            }
          });
        }
      });
    } catch (wErr) {}
  }

  // 2. Watch server/services/lawyersData.js
  if (fs.existsSync(lawyersDataPath)) {
    try {
      fs.watch(lawyersDataPath, (eventType) => {
        if (eventType === 'change') {
          debounce('watch_lawyersData', 400, () => {
            try {
              delete require.cache[require.resolve('./lawyersData')];
              const { INDIAN_LAWYERS } = require('./lawyersData');
              if (Array.isArray(INDIAN_LAWYERS) && INDIAN_LAWYERS.length > 0) {
                const res = syncLawyersToDB(INDIAN_LAWYERS);
                syncLawyersDataset(db);
                console.log(`🔄 [Auto-Watcher] lawyersData.js modified -> Automatically saved to database! (Updated: ${res.updated}, Inserted: ${res.inserted})`);
              }
            } catch (err) {
              console.warn('⚠️ [Auto-Watcher] Error syncing lawyersData:', err.message);
            }
          });
        }
      });
    } catch (wErr) {}
  }

  // 3. Watch datasets/courts_dataset.json (if developer edits the dataset directly)
  if (fs.existsSync(courtsDatasetPath)) {
    try {
      fs.watch(courtsDatasetPath, (eventType) => {
        if (eventType === 'change') {
          debounce('watch_courtsDataset', 500, () => {
            if (isInternalSyncing) return;
            try {
              const raw = fs.readFileSync(courtsDatasetPath, 'utf8');
              const items = JSON.parse(raw);
              if (Array.isArray(items) && items.length > 0) {
                const res = syncCourtsToDB(items);
                console.log(`🔄 [Auto-Watcher] datasets/courts_dataset.json modified -> Automatically saved to legalai.db! (Updated: ${res.updated}, Inserted: ${res.inserted})`);
              }
            } catch (e) {}
          });
        }
      });
    } catch (wErr) {}
  }

  // 4. Watch datasets/lawyers_dataset.json (if developer edits the dataset directly)
  if (fs.existsSync(lawyersDatasetPath)) {
    try {
      fs.watch(lawyersDatasetPath, (eventType) => {
        if (eventType === 'change') {
          debounce('watch_lawyersDataset', 500, () => {
            if (isInternalSyncing) return;
            try {
              const raw = fs.readFileSync(lawyersDatasetPath, 'utf8');
              const items = JSON.parse(raw);
              if (Array.isArray(items) && items.length > 0) {
                const res = syncLawyersToDB(items);
                console.log(`🔄 [Auto-Watcher] datasets/lawyers_dataset.json modified -> Automatically saved to legalai.db! (Updated: ${res.updated}, Inserted: ${res.inserted})`);
              }
            } catch (e) {}
          });
        }
      });
    } catch (wErr) {}
  }

  console.log('👀 [Auto-Watcher] Active: Real-time database synchronizer listening for court and lawyer changes.');
}

module.exports = {
  startLiveWatcher,
  syncCourtsToDB,
  syncLawyersToDB
};


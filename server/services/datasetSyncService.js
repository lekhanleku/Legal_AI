/**
 * datasetSyncService.js
 * Automatically synchronizes court and lawyer records from the SQLite database
 * into the dedicated dataset files in `datasets/` and `ml/dataset/`.
 */

const fs = require('fs');
const path = require('path');

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'number') return val;
      const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${str}"`;
    });
    csvLines.push(values.join(','));
  }

  return csvLines.join('\n');
}

function safeWriteFile(filePath, content) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'EPERM') {
        try {
          const tmp = filePath + '.tmp';
          fs.writeFileSync(tmp, content, 'utf8');
          fs.copyFileSync(tmp, filePath);
          fs.unlinkSync(tmp);
          return true;
        } catch (e2) {}
      }
    }
  }
  return false;
}

function getDirectories() {
  const dirs = [
    path.join(__dirname, '..', '..', 'datasets'),
    path.join(__dirname, '..', '..', 'ml', 'dataset')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {}
    }
  });

  return dirs;
}

/**
 * Synchronize Courts dataset files
 */
function syncCourtsDataset(dbInstance) {
  try {
    const db = dbInstance || require('../db');
    const courts = db.prepare(`
      SELECT 
        id, name, code, jurisdiction, level, circuit, 
        city, state, address, zipCode, phone, website, 
        clerkHours, filingSystem, chiefJudge, divisions, 
        overview, badge, latitude, longitude, mapUrl, mapEmbedUrl, isAvailable
      FROM courts
      ORDER BY 
        CASE level
          WHEN 'Supreme' THEN 1
          WHEN 'High Court' THEN 2
          WHEN 'Appellate Tribunal' THEN 3
          WHEN 'Tribunal' THEN 4
          WHEN 'District' THEN 5
          WHEN 'Subordinate' THEN 6
          ELSE 7
        END,
        state ASC, city ASC, name ASC
    `).all();

    const courtsJSON = JSON.stringify(courts, null, 2);
    const courtsCSV = toCSV(courts);
    const dirs = getDirectories();

    dirs.forEach(dir => {
      safeWriteFile(path.join(dir, 'courts_dataset.json'), courtsJSON);
      safeWriteFile(path.join(dir, 'courts_dataset.csv'), courtsCSV);
    });

    return { success: true, count: courts.length };
  } catch (err) {
    console.error('Error synchronizing courts dataset:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Synchronize Lawyers dataset files
 */
function syncLawyersDataset(dbInstance) {
  try {
    const db = dbInstance || require('../db');
    const lawyers = db.prepare(`
      SELECT 
        id, name, title, specialty, barNumber, experienceYears, 
        education, firmName, city, state, hourlyRate, rating, 
        reviewCount, languages, bio, casesWon, successRate, 
        phone, email, avatarUrl, courtCodes, practicingCourts, primaryCourt, isAvailable
      FROM lawyers
      ORDER BY specialty ASC, experienceYears DESC, name ASC
    `).all();

    const lawyersJSON = JSON.stringify(lawyers, null, 2);
    const lawyersCSV = toCSV(lawyers);
    const dirs = getDirectories();

    dirs.forEach(dir => {
      safeWriteFile(path.join(dir, 'lawyers_dataset.json'), lawyersJSON);
      safeWriteFile(path.join(dir, 'lawyers_dataset.csv'), lawyersCSV);
    });

    return { success: true, count: lawyers.length };
  } catch (err) {
    console.error('Error synchronizing lawyers dataset:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Synchronize all datasets (Courts & Lawyers)
 */
function syncAllDatasets(dbInstance) {
  const c = syncCourtsDataset(dbInstance);
  const l = syncLawyersDataset(dbInstance);
  return { courts: c, lawyers: l };
}

module.exports = {
  syncCourtsDataset,
  syncLawyersDataset,
  syncAllDatasets
};

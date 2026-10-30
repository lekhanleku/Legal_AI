/**
 * build_datasets.js
 * Generates verified, standalone dataset files for Indian Courts and Lawyers.
 * Exports both JSON and CSV datasets with complete, accurate attributes.
 */

const fs = require('fs');
const path = require('path');
const db = require('../server/db');

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

// 1. Fetch Courts
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

// 2. Fetch Lawyers
const lawyers = db.prepare(`
  SELECT 
    id, name, title, specialty, barNumber, experienceYears, 
    education, firmName, city, state, hourlyRate, rating, 
    reviewCount, languages, bio, casesWon, successRate, 
    phone, email, avatarUrl, courtCodes, practicingCourts, primaryCourt, isAvailable
  FROM lawyers
  ORDER BY specialty ASC, experienceYears DESC, name ASC
`).all();

console.log(`Extracted ${courts.length} courts and ${lawyers.length} lawyers from the database.`);

// Destination directories
const dirs = [
  path.join(__dirname, '..', 'datasets'),
  path.join(__dirname, '..', 'ml', 'dataset')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// CSV and JSON contents
const courtsJSON = JSON.stringify(courts, null, 2);
const courtsCSV = toCSV(courts);

const lawyersJSON = JSON.stringify(lawyers, null, 2);
const lawyersCSV = toCSV(lawyers);

// Write to each directory
dirs.forEach(dir => {
  fs.writeFileSync(path.join(dir, 'courts_dataset.json'), courtsJSON, 'utf8');
  fs.writeFileSync(path.join(dir, 'courts_dataset.csv'), courtsCSV, 'utf8');
  fs.writeFileSync(path.join(dir, 'lawyers_dataset.json'), lawyersJSON, 'utf8');
  fs.writeFileSync(path.join(dir, 'lawyers_dataset.csv'), lawyersCSV, 'utf8');
  console.log(`Saved datasets in: ${dir}`);
});

console.log('Dataset generation completed successfully!');


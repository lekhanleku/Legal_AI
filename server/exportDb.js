const db = require('./db');
const fs = require('fs');
const path = require('path');

const dump = {};
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

for (const t of tables) {
  dump[t.name] = db.prepare(`SELECT * FROM ${t.name}`).all();
}

const outputPath = path.join(__dirname, 'database_export.json');
fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2), 'utf8');

// Also create an SQL script dump
let sqlDump = '-- LegalAI SQLite Database Export\n-- Generated on ' + new Date().toISOString() + '\n\n';

for (const t of tables) {
  const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(t.name);
  if (schema && schema.sql) {
    sqlDump += `${schema.sql};\n\n`;
  }
  const rows = dump[t.name];
  if (rows && rows.length > 0) {
    for (const row of rows) {
      const keys = Object.keys(row);
      const values = keys.map(k => {
        const val = row[k];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      sqlDump += `INSERT INTO ${t.name} (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
    }
    sqlDump += '\n';
  }
}

const sqlOutputPath = path.join(__dirname, 'database_dump.sql');
fs.writeFileSync(sqlOutputPath, sqlDump, 'utf8');

console.log('Database successfully exported to:');
console.log('1. JSON format:', outputPath);
console.log('2. SQL format:', sqlOutputPath);


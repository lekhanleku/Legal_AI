/**
 * LegalAI - Deep Scan Diagnostic & Audit Engine
 * Performs comprehensive analysis across frontend, backend, database, security, and routing.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');

const report = {
  sqlInjectionRisks: [],
  unmatchedApiEndpoints: [],
  missingDomElements: [],
  unprotectedSensitiveRoutes: [],
  databaseIntegrityIssues: [],
  hardcodedHostnames: [],
  brokenFileLinks: [],
  emojiMatches: [],
  targetBlankMatches: []
};

// -------------------------------------------------------------
// Helper: File Scanner
// -------------------------------------------------------------
function scanDirectory(dir, extensions, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.venv', 'dist'].includes(entry.name)) {
        scanDirectory(fullPath, extensions, callback);
      }
    } else if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
      callback(fullPath);
    }
  }
}

// -------------------------------------------------------------
// 1. SQL Injection / String Concatenation in Queries
// -------------------------------------------------------------
scanDirectory(serverDir, ['.js'], (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check for template literals or concatenation inside db.prepare / db.exec
    if (/db\.(prepare|exec)\s*\(\s*`[^`]*\$\{/i.test(line) ||
        /db\.(prepare|exec)\s*\(\s*["'][^"']*\s*\+/i.test(line)) {
      report.sqlInjectionRisks.push({
        file: path.relative(rootDir, filePath),
        line: idx + 1,
        code: line.trim()
      });
    }
  });
});

// -------------------------------------------------------------
// 2. Extract Backend Express Endpoints
// -------------------------------------------------------------
const backendRoutes = []; // { method, fullPath, file, isProtected, role }

// Read server.js for mounted route prefixes
const serverJs = fs.readFileSync(path.join(serverDir, 'server.js'), 'utf8');
const mountRegex = /app\.use\(\s*['"]([^'"]+)['"]\s*,\s*require\(\s*['"]\.\/routes\/([^'"]+)['"]\s*\)\s*\)/g;
const mounts = {};
let m;
while ((m = mountRegex.exec(serverJs)) !== null) {
  mounts[m[2].replace('.js', '')] = m[1];
}

// Read each route file
scanDirectory(path.join(serverDir, 'routes'), ['.js'], (routeFile) => {
  const routeBaseName = path.basename(routeFile, '.js');
  const mountPrefix = mounts[routeBaseName] || '';
  const content = fs.readFileSync(routeFile, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Match router.get('/path', ...), router.post(...)
    const match = /router\.(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/i.exec(line);
    if (match) {
      const method = match[1].toUpperCase();
      let subPath = match[2];
      if (subPath === '/') subPath = '';
      const fullPath = (mountPrefix + subPath).replace(/\/+/g, '/');

      // Check protection on this line or nearby
      const hasAuth = line.includes('authenticateToken') ||
                      line.includes('requireAdmin') ||
                      line.includes('verifyToken');
      const roleMatch = /authorizeRole\(['"]([^'"]+)['"]\)/.exec(line);
      const role = roleMatch ? roleMatch[1] : (line.includes('requireAdmin') ? 'admin' : (hasAuth ? 'authenticated' : 'public'));

      backendRoutes.push({
        method,
        path: fullPath,
        file: path.relative(rootDir, routeFile),
        line: idx + 1,
        role
      });
    }
  });
});

// Also check directly mounted endpoints in server.js
const serverLines = serverJs.split('\n');
serverLines.forEach((line, idx) => {
  const directMatch = /app\.(get|post|put|delete)\(\s*['"]([^'"]+)['"]/i.exec(line);
  if (directMatch) {
    backendRoutes.push({
      method: directMatch[1].toUpperCase(),
      path: directMatch[2],
      file: 'server/server.js',
      line: idx + 1,
      role: 'public'
    });
  }
});

// -------------------------------------------------------------
// 3. Extract Frontend fetch() Calls & Check for Unmatched Routes
// -------------------------------------------------------------
const frontendFiles = [
  'script.js', 'login.js', 'lawyers.js', 'user.js', 'lawyer.js', 'admin.js', 'indianCourts.js'
];

frontendFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Match fetch(`${API_BASE_URL}/...`) or fetch(`/api/...`) or fetch(`${SERVER_ORIGIN}/api/...`)
    const fetchMatch = /fetch\(\s*[`"']([^`"']+)`["']/i.exec(line);
    if (fetchMatch) {
      let rawUrl = fetchMatch[1];
      // Normalize variable placeholders:
      // ${API_BASE_URL} or ${SERVER_ORIGIN}/api or /api
      let cleanUrl = rawUrl
        .replace(/\$\{(?:API_BASE_URL|SERVER_ORIGIN)\}/g, '/api')
        .replace(/\$\{baseUrl\}/g, '/api')
        .replace(/^https?:\/\/[^/]+/g, '');

      if (!cleanUrl.startsWith('/api') && cleanUrl.startsWith('/')) {
        cleanUrl = '/api' + cleanUrl;
      }

      // If URL has template variables like ${id}, replace with param wildcard
      const normalizedPath = cleanUrl.replace(/\$\{[^}]+\}/g, ':param').split('?')[0];

      // Infer method from same line or next few lines
      let method = 'GET';
      const surrounding = lines.slice(idx, idx + 6).join(' ');
      const methodMatch = /method:\s*['"](GET|POST|PUT|DELETE|PATCH)['"]/i.exec(surrounding);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      }

      // Now check if this endpoint exists in backendRoutes
      if (normalizedPath.startsWith('/api')) {
        const matched = backendRoutes.some((br) => {
          if (br.method !== method) return false;
          // Compare route path with params regex
          const regexStr = '^' + br.path.replace(/:[a-zA-Z0-9_]+/g, '[^/]+') + '$';
          const rx = new RegExp(regexStr);
          return rx.test(normalizedPath);
        });

        if (!matched) {
          report.unmatchedApiEndpoints.push({
            frontendFile: file,
            line: idx + 1,
            method,
            endpoint: normalizedPath,
            rawCode: line.trim()
          });
        }
      }
    }
  });
});

// -------------------------------------------------------------
// 4. Missing DOM Elements in Frontend JS
// -------------------------------------------------------------
const htmlJsPairs = [
  { html: 'index.html', js: 'script.js' },
  { html: 'login.html', js: 'login.js' },
  { html: 'lawyers.html', js: 'lawyers.js' },
  { html: 'user.html', js: 'user.js' },
  { html: 'lawyer.html', js: 'lawyer.js' },
  { html: 'admin.html', js: 'admin.js' }
];

htmlJsPairs.forEach(({ html, js }) => {
  const htmlPath = path.join(rootDir, html);
  const jsPath = path.join(rootDir, js);
  if (!fs.existsSync(htmlPath) || !fs.existsSync(jsPath)) return;

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // Collect all IDs defined in HTML
  const definedIds = new Set();
  const idRegex = /id=["']([^"']+)["']/g;
  let match;
  while ((match = idRegex.exec(htmlContent)) !== null) {
    definedIds.add(match[1]);
  }

  // Find all document.getElementById calls in JS
  const getByIdRegex = /document\.getElementById\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = getByIdRegex.exec(jsContent)) !== null) {
    const soughtId = match[1];
    // Dynamic / template IDs or modal IDs can be ignored if they are created dynamically
    if (!definedIds.has(soughtId)) {
      // Find line number
      const pos = match.index;
      const lineNum = jsContent.substring(0, pos).split('\n').length;
      report.missingDomElements.push({
        htmlFile: html,
        jsFile: js,
        line: lineNum,
        elementId: soughtId
      });
    }
  }
});

// -------------------------------------------------------------
// 5. Database Integrity Checks (via SQLite)
// -------------------------------------------------------------
try {
  const Database = require(path.join(serverDir, 'node_modules', 'better-sqlite3'));
  const dbPath = path.join(serverDir, 'legalai.db');
  if (fs.existsSync(dbPath)) {
    const db = new Database(dbPath, { readonly: true });
    
    // Check foreign keys status
    const fkStatus = db.prepare('PRAGMA foreign_keys').get();
    if (!fkStatus || fkStatus.foreign_keys === 0) {
      report.databaseIntegrityIssues.push({
        issue: 'PRAGMA foreign_keys is OFF by default in this connection',
        severity: 'MEDIUM'
      });
    }

    // Check tables existence
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
    report.tablesFound = tables;

    // Check orphaned consultations
    if (tables.includes('consultations') && tables.includes('users')) {
      const orphanedConsults = db.prepare(`
        SELECT COUNT(*) as count FROM consultations 
        WHERE userId NOT IN (SELECT id FROM users)
      `).get();
      if (orphanedConsults.count > 0) {
        report.databaseIntegrityIssues.push({
          issue: `Found ${orphanedConsults.count} orphaned consultations with non-existent userId`,
          severity: 'HIGH'
        });
      }
    }

    // Check orphaned advocate accounts
    if (tables.includes('advocate_accounts') && tables.includes('lawyers')) {
      const orphanedAdv = db.prepare(`
        SELECT COUNT(*) as count FROM advocate_accounts 
        WHERE lawyerId NOT IN (SELECT id FROM lawyers)
      `).get();
      if (orphanedAdv.count > 0) {
        report.databaseIntegrityIssues.push({
          issue: `Found ${orphanedAdv.count} advocate accounts linked to missing lawyer IDs`,
          severity: 'HIGH'
        });
      }
    }

    // Check orphaned cases
    if (tables.includes('cases') && tables.includes('lawyers')) {
      const orphanedCases = db.prepare(`
        SELECT COUNT(*) as count FROM cases 
        WHERE lawyerId IS NOT NULL AND lawyerId NOT IN (SELECT id FROM lawyers)
      `).get();
      if (orphanedCases.count > 0) {
        report.databaseIntegrityIssues.push({
          issue: `Found ${orphanedCases.count} litigation cases linked to missing lawyer IDs`,
          severity: 'HIGH'
        });
      }
    }

    // Check schema integrity
    const integrity = db.prepare('PRAGMA integrity_check').get();
    if (integrity.integrity_check !== 'ok') {
      report.databaseIntegrityIssues.push({
        issue: `PRAGMA integrity_check reported: ${integrity.integrity_check}`,
        severity: 'CRITICAL'
      });
    }
  }
} catch (e) {
  report.databaseIntegrityIssues.push({
    issue: `Failed to inspect SQLite database: ${e.message}`,
    severity: 'HIGH'
  });
}

// -------------------------------------------------------------
// 6. Hardcoded Hostnames & Localhost Leaks
// -------------------------------------------------------------
scanDirectory(rootDir, ['.js', '.html'], (filePath) => {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('scripts') || relPath.startsWith('server\\node_modules')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/http:\/\/localhost:(?:3000|5000|8000|8080)/i.test(line) && !line.includes('window.location.hostname')) {
      // Check if it's a fallback or hardcoded
      if (!line.includes('||') && !line.includes('//')) {
        report.hardcodedHostnames.push({
          file: relPath,
          line: idx + 1,
          code: line.trim()
        });
      }
    }
  });
});

// -------------------------------------------------------------
// 7. Check Emojis & target="_blank"
// -------------------------------------------------------------
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
scanDirectory(rootDir, ['.js', '.html'], (filePath) => {
  const relPath = path.relative(rootDir, filePath);
  if (relPath.startsWith('scripts') || relPath.startsWith('.venv') || relPath.startsWith('server\\node_modules')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      report.emojiMatches.push({
        file: relPath,
        line: idx + 1,
        snippet: line.trim().substring(0, 60)
      });
    }
    if (/target\s*=\s*["']_blank["']/i.test(line)) {
      report.targetBlankMatches.push({
        file: relPath,
        line: idx + 1,
        snippet: line.trim().substring(0, 80)
      });
    }
  });
});

// -------------------------------------------------------------
// Output Report
// -------------------------------------------------------------
fs.writeFileSync(path.join(rootDir, 'scripts', 'scan_report.json'), JSON.stringify(report, null, 2));
console.log('=== AUDIT SCAN COMPLETE ===');
console.log(`SQL Injection Risks: ${report.sqlInjectionRisks.length}`);
console.log(`Unmatched API Endpoints: ${report.unmatchedApiEndpoints.length}`);
console.log(`Missing DOM Elements: ${report.missingDomElements.length}`);
console.log(`Database Integrity Issues: ${report.databaseIntegrityIssues.length}`);
console.log(`Hardcoded Hostnames: ${report.hardcodedHostnames.length}`);
console.log(`Emoji Occurrences: ${report.emojiMatches.length}`);
console.log(`target="_blank" Occurrences: ${report.targetBlankMatches.length}`);

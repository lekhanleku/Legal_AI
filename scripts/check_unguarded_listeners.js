const fs = require('fs');

const pairs = [
  { html: 'index.html', js: 'script.js' },
  { html: 'lawyers.html', js: 'lawyers.js' },
  { html: 'user.html', js: 'user.js' },
  { html: 'lawyer.html', js: 'lawyer.js' },
  { html: 'admin.html', js: 'admin.js' },
  { html: 'login.html', js: 'login.js' }
];

pairs.forEach(({ html, js }) => {
  const htmlContent = fs.readFileSync(html, 'utf8');
  const jsContent = fs.readFileSync(js, 'utf8');
  const lines = jsContent.split('\n');

  const definedIds = new Set();
  let m;
  const idRegex = /id=["']([^"']+)["']/g;
  while ((m = idRegex.exec(htmlContent)) !== null) definedIds.add(m[1]);

  // Find all id definitions: const varName = document.getElementById('id')
  const varToId = {};
  const defRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*document\.getElementById\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = defRegex.exec(jsContent)) !== null) {
    varToId[m[1]] = m[2];
  }

  lines.forEach((line, idx) => {
    // Check for varName.addEventListener(...) without optional chaining ?.
    const listenerMatch = /([a-zA-Z0-9_$]+)\.addEventListener\(/g;
    while ((m = listenerMatch.exec(line)) !== null) {
      const varName = m[1];
      if (['window', 'document', 'document.body'].includes(varName)) continue;
      const targetId = varToId[varName];
      if (targetId && !definedIds.has(targetId)) {
        // Check if there is an if guard above it
        const precedingLines = lines.slice(Math.max(0, idx - 5), idx).join('\n');
        if (!precedingLines.includes(`if (${varName})`) && !precedingLines.includes(`if (!${varName})`)) {
          console.log(`[POTENTIAL RUNTIME ERROR] ${js}:${idx + 1} -> Calling .addEventListener on null '${varName}' (ID: '${targetId}' missing in ${html})`);
        }
      }
    }
  });
});

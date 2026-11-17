const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const lines = css.split('\n');
const whiteTextRules = [];
let currentSelector = '';

lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (trimmed.endsWith('{') && !trimmed.startsWith('@')) {
    currentSelector = trimmed.replace('{', '').trim();
  }
  if (trimmed.includes('color:') && (
    trimmed.includes('rgba(255, 255, 255') ||
    trimmed.includes('rgba(255,255,255') ||
    trimmed.includes('#ffffff') ||
    trimmed.includes('#fff;') ||
    trimmed.includes('#e2e8f0') ||
    trimmed.includes('#cbd5e1') ||
    trimmed.includes('#f8fafc')
  )) {
    whiteTextRules.push({
      line: idx + 1,
      selector: currentSelector,
      rule: trimmed
    });
  }
});

console.log('Total rules with hardcoded white/light text:', whiteTextRules.length);
whiteTextRules.slice(0, 50).forEach(r => {
  console.log(`L${r.line} [${r.selector}] => ${r.rule}`);
});

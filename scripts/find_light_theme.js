const fs = require('fs');
const content = fs.readFileSync('style.css', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('data-theme') && l.includes('light')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

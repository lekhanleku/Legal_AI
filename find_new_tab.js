const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const blankMatches = (content.match(/target=["']_blank["']/gi) || []).length;
  const winOpenMatches = (content.match(/window\.open\s*\(/g) || []).length;
  if (blankMatches > 0 || winOpenMatches > 0) {
    console.log(`${file}: ${blankMatches} target="_blank", ${winOpenMatches} window.open`);
  }
});

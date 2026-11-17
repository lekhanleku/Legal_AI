const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all section and div tags with id or class
const regex = /<(section|div|nav|header|footer|aside)\s+([^>]+)>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const tag = match[1];
  const attrs = match[2];
  const idMatch = attrs.match(/id="([^"]+)"/);
  const classMatch = attrs.match(/class="([^"]+)"/);
  if (idMatch || classMatch) {
    const id = idMatch ? `#${idMatch[1]}` : '';
    const cls = classMatch ? `.${classMatch[1].replace(/\s+/g, '.')}` : '';
    console.log(`${tag} ${id} ${cls}`);
  }
}

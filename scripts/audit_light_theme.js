const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

// Find all classes in index.html
const htmlClassRegex = /class="([^"]+)"/g;
const htmlClasses = new Set();
let match;
while ((match = htmlClassRegex.exec(html)) !== null) {
  match[1].split(/\s+/).forEach(c => c && htmlClasses.add(c));
}

// Find all classes under [data-theme="light"] in style.css
const lightSection = css.substring(css.indexOf('[data-theme="light"]'));
const cssClassRegex = /\[data-theme="light"\]\s+\.([a-zA-Z0-9_-]+)/g;
const cssLightClasses = new Set();
while ((match = cssClassRegex.exec(lightSection)) !== null) {
  cssLightClasses.add(match[1]);
}

console.log('Total classes in index.html:', htmlClasses.size);
console.log('Total classes with [data-theme="light"]:', cssLightClasses.size);

// Check which css light classes do NOT exist in index.html (possible typos like nav-dropdown vs nav-dropdown-menu)
cssLightClasses.forEach(c => {
  if (!htmlClasses.has(c)) {
    console.log('CSS light class not in index.html:', c);
  }
});

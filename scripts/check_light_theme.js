const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const classes = [
  'articles-modal', 'articles-modal-header', 'articles-modal-title', 'articles-modal-sub',
  'articles-refresh-btn', 'articles-close-btn', 'articles-search-box', 'articles-pill',
  'articles-body', 'article-card', 'article-card-title', 'article-card-excerpt',
  'articles-modal-footer', 'article-reader-modal', 'reader-topbar', 'reader-title',
  'reader-summary-box', 'reader-body', 'reader-section-heading', 'reader-meta-item',
  'hero-ai-search', 'hero-ai-input-wrap', 'hero-ai-input', 'hero-ai-chip', 'hero-stats',
  'advocate-card', 'portal-card', 'admin-table', 'login-card'
];

classes.forEach(cls => {
  const hasLightRule = css.includes('[data-theme="light"]') && (css.includes('.' + cls));
  const specific = css.includes(`[data-theme="light"] .${cls}`);
  console.log(`${cls}: ${specific ? 'EXPLICIT LIGHT RULE' : 'NO EXPLICIT LIGHT RULE'}`);
});

/* LegalAI MCA Final Project — Presentation Generator
   Run: node scripts/generate_ppt.js
   Output: LegalAI_Presentation.pptx (project root)
*/

const PptxGenJS = require('C:/Users/lenovo/AppData/Roaming/npm/node_modules/pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)

// ── THEME COLORS ──────────────────────────────────────────────
const GOLD   = 'B8956A';
const DARK   = '0D0D0D';
const DARK2  = '1A1A1A';
const WHITE  = 'F0EDE8';
const LIGHT  = 'D4BFA0';
const GRAY   = '8B9099';
const ACCENT = '8B6914';

// ── HELPERS ───────────────────────────────────────────────────
function slide(fn) {
  const s = pptx.addSlide();
  fn(s);
  return s;
}

function bg(s, fill = DARK) {
  s.background = { fill };
}

function title(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.4, y: opts.y ?? 0.25,
    w: opts.w ?? 12.5, h: opts.h ?? 0.9,
    fontSize: opts.fs ?? 32,
    bold: true,
    color: opts.color ?? GOLD,
    fontFace: 'Calibri',
    align: opts.align ?? 'left',
    ...opts.extra,
  });
}

function sub(s, text, opts = {}) {
  s.addText(text, {
    x: opts.x ?? 0.4, y: opts.y ?? 1.15,
    w: opts.w ?? 12.5, h: opts.h ?? 0.4,
    fontSize: opts.fs ?? 14,
    color: opts.color ?? LIGHT,
    fontFace: 'Calibri',
    align: opts.align ?? 'left',
    ...opts.extra,
  });
}

function dividerLine(s, y = 1.0) {
  s.addShape(pptx.ShapeType.rect, {
    x: 0.4, y, w: 12.5, h: 0.025,
    fill: { color: GOLD, transparency: 30 },
    line: { type: 'none' },
  });
}

function bullet(s, items, opts = {}) {
  const rows = items.map(item => {
    if (typeof item === 'string') return { text: item, options: { bullet: { type: 'bullet' }, indentLevel: 0 } };
    return item;
  });
  s.addText(rows, {
    x: opts.x ?? 0.5, y: opts.y ?? 1.5,
    w: opts.w ?? 12.0, h: opts.h ?? 5.5,
    fontSize: opts.fs ?? 15,
    color: opts.color ?? WHITE,
    fontFace: 'Calibri',
    valign: 'top',
    lineSpacingMultiple: 1.4,
    paraSpaceBefore: 6,
    ...opts.extra,
  });
}

function card(s, x, y, w, h, fillColor = DARK2, borderColor = GOLD) {
  s.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: fillColor },
    line: { color: borderColor, width: 1.2, transparency: 40 },
    shadow: { type: 'outer', color: '000000', blur: 8, offset: 3, angle: 45, transparency: 70 },
  });
}

function badge(s, text, x, y, w = 2.2, h = 0.35) {
  s.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: GOLD, transparency: 15 },
    line: { type: 'none' },
    rectRadius: 0.08,
  });
  s.addText(text, {
    x, y, w, h,
    fontSize: 10, bold: true, color: DARK, fontFace: 'Calibri',
    align: 'center', valign: 'middle',
  });
}

// ══════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE SLIDE
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  // Gold accent bar left
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  // Subtle top right corner accent
  s.addShape(pptx.ShapeType.rect, { x: 11.5, y: 0, w: 1.83, h: 0.08, fill: { color: GOLD, transparency: 50 } });

  s.addText('LegalAI', {
    x: 0.5, y: 0.9, w: 12.5, h: 1.4,
    fontSize: 72, bold: true, color: GOLD, fontFace: 'Calibri', align: 'left',
  });
  s.addText('Indian Judicial Network Platform', {
    x: 0.5, y: 2.1, w: 12.0, h: 0.65,
    fontSize: 26, color: WHITE, fontFace: 'Calibri', align: 'left',
  });
  s.addText('Statutory legal research · Verified Bar Council advocates · 100+ court directories unified across India', {
    x: 0.5, y: 2.75, w: 11.5, h: 0.5,
    fontSize: 14, color: LIGHT, fontFace: 'Calibri', align: 'left', italic: true,
  });

  dividerLine(s, 3.4);

  s.addText([
    { text: 'MCA Final Year Project  |  ', options: { color: GRAY } },
    { text: 'Full-Stack Web Application', options: { color: LIGHT, bold: true } },
  ], { x: 0.5, y: 3.6, w: 9, h: 0.4, fontSize: 14, fontFace: 'Calibri' });

  s.addText([
    { text: 'Presented by: ', options: { color: GRAY } },
    { text: 'Bruce Mathew', options: { color: GOLD, bold: true } },
  ], { x: 0.5, y: 4.1, w: 9, h: 0.4, fontSize: 14, fontFace: 'Calibri' });

  s.addText('November 2026', { x: 0.5, y: 4.6, w: 6, h: 0.35, fontSize: 12, color: GRAY, fontFace: 'Calibri' });

  // Tech stack tags bottom right
  ['Node.js', 'Express', 'SQLite', 'JWT Auth', 'RAG / AI'].forEach((tag, i) => {
    badge(s, tag, 8.3 + (i % 3) * 1.65, 5.5 + Math.floor(i / 3) * 0.55, 1.5, 0.38);
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 2 — TABLE OF CONTENTS
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  title(s, 'Presentation Outline');
  dividerLine(s, 1.1);

  const sections = [
    ['01', 'Problem Statement & Motivation'],
    ['02', 'Project Objectives'],
    ['03', 'System Architecture & Tech Stack'],
    ['04', 'Key Modules & Features'],
    ['05', 'AI & RAG Legal Research Engine'],
    ['06', 'Database Design & Security'],
    ['07', 'UI/UX & Multilingual Support'],
    ['08', 'Testing & Verification'],
    ['09', 'Demo Screenshots'],
    ['10', 'Future Scope & Conclusion'],
  ];

  sections.forEach(([num, label], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const cx = col === 0 ? 0.5 : 6.9;
    const cy = 1.4 + row * 1.0;

    s.addShape(pptx.ShapeType.rect, {
      x: cx, y: cy, w: 5.9, h: 0.72,
      fill: { color: DARK2 },
      line: { color: GOLD, width: 1, transparency: 40 },
    });
    s.addText(num, { x: cx + 0.1, y: cy + 0.1, w: 0.65, h: 0.52, fontSize: 22, bold: true, color: GOLD, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    s.addText(label, { x: cx + 0.85, y: cy + 0.1, w: 4.9, h: 0.52, fontSize: 14, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 3 — PROBLEM STATEMENT
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '01  PROBLEM STATEMENT', 0.4, 0.2, 3.5);
  title(s, 'The Legal Access Gap in India', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // Pain point cards
  const problems = [
    ['Information Fragmentation', 'Court data, advocate profiles, case laws, and statutes are scattered across dozens of unconnected government portals with no unified interface.'],
    ['Language Barrier', 'Legal documents are predominantly in English while 90%+ of India\'s population speaks regional languages, creating a comprehension gap.'],
    ['Advocate Discovery', 'Citizens have no reliable, verified way to find and contact qualified Bar Council-registered lawyers by jurisdiction or specialisation.'],
    ['No AI Legal Guidance', 'Existing legal portals provide raw data with zero intelligent interpretation, leaving laypersons unable to understand their rights or options.'],
  ];

  problems.forEach(([heading, desc], i) => {
    const cx = i % 2 === 0 ? 0.4 : 6.85;
    const cy = 1.3 + Math.floor(i / 2) * 2.65;
    card(s, cx, cy, 6.0, 2.4);
    s.addText(heading, { x: cx + 0.2, y: cy + 0.18, w: 5.6, h: 0.42, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
    s.addText(desc, { x: cx + 0.2, y: cy + 0.6, w: 5.6, h: 1.6, fontSize: 12.5, color: LIGHT, fontFace: 'Calibri', valign: 'top', lineSpacingMultiple: 1.3 });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 4 — OBJECTIVES
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '02  OBJECTIVES', 0.4, 0.2, 2.5);
  title(s, 'Project Objectives', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  bullet(s, [
    { text: 'Build a unified legal intelligence platform combining court directories, advocate profiles, case law, and live legal news.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Implement an AI-powered RAG (Retrieval-Augmented Generation) legal research assistant for citizens and advocates.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Provide real-time multilingual translation of legal content across 8 Indian languages (Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, Gujarati).', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Create a three-role secure authentication system: Citizens, Verified Advocates, and Admin with JWT-based access control.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Integrate 104 verified Indian courts with GPS coordinates, e-filing portal links, and Chief Justice data.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Enable consultation booking between citizens and Bar Council-verified advocates with real-time docket management.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Deliver live legal news aggregation from RSS feeds (Live Law, ETV Bharat) with AI summarisation and category filtering.', options: { bullet: { type: 'bullet' }, color: WHITE } },
    { text: 'Ensure WCAG accessibility, dark/light mode, and responsive design across all device sizes.', options: { bullet: { type: 'bullet' }, color: WHITE } },
  ], { y: 1.3, fs: 14, h: 5.8 });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 5 — SYSTEM ARCHITECTURE
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '03  ARCHITECTURE', 0.4, 0.2, 2.8);
  title(s, 'System Architecture & Tech Stack', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // Architecture boxes
  const layers = [
    { label: 'CLIENT LAYER', color: DARK2, items: ['HTML5 / CSS3 / Vanilla JS', 'Responsive UI + Dark/Light Mode', 'Multilingual (8 languages)'] },
    { label: 'SERVER LAYER', color: '141414', items: ['Node.js + Express.js', 'REST API endpoints', 'JWT Authentication Middleware'] },
    { label: 'DATA LAYER', color: DARK2, items: ['SQLite (via better-sqlite3)', 'Court & Advocate Data (104 courts, 37 advocates)', 'Statute Repository (37 statutes)'] },
    { label: 'AI / EXTERNAL', color: '141414', items: ['Gemini API (RAG legal search)', 'RSS News Aggregator (Live Law, ETV)', 'Google Translate API (8 languages)'] },
  ];

  layers.forEach((layer, i) => {
    const cx = 0.4 + i * 3.25;
    card(s, cx, 1.3, 3.0, 5.7, layer.color);
    s.addShape(pptx.ShapeType.rect, { x: cx, y: 1.3, w: 3.0, h: 0.5, fill: { color: GOLD, transparency: 10 }, line: { type: 'none' } });
    s.addText(layer.label, { x: cx, y: 1.3, w: 3.0, h: 0.5, fontSize: 10, bold: true, color: DARK, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    layer.items.forEach((item, j) => {
      s.addText(item, { x: cx + 0.15, y: 2.0 + j * 0.75, w: 2.7, h: 0.65, fontSize: 12, color: LIGHT, fontFace: 'Calibri', valign: 'middle', lineSpacingMultiple: 1.2 });
    });
    // Arrows between boxes
    if (i < 3) {
      s.addShape(pptx.ShapeType.rightArrow, {
        x: cx + 3.02, y: 3.95, w: 0.2, h: 0.35,
        fill: { color: GOLD, transparency: 30 }, line: { type: 'none' },
      });
    }
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 6 — KEY MODULES
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '04  MODULES', 0.4, 0.2, 2.2);
  title(s, 'Key Modules & Features', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  const modules = [
    ['Advocate Directory', '37 Bar Council-verified advocates\nFilter by specialisation, district, language\nDirect consultation booking'],
    ['Courts Directory', '104 courts across all Indian jurisdictions\nGPS maps, e-filing portals, Chief Justice data\nFilter: Supreme, High, District, Tribunal, JMFC'],
    ['AI Legal Research', 'RAG-powered search using Gemini API\nRetrieves statutes, case law, court rules\nSuggests best lawyer and court for the query'],
    ['Legal News & Articles', 'Live RSS feeds (Live Law, ETV Bharat)\nCategory filter + multilingual reader\nAI-generated executive summaries & takeaways'],
    ['Consultation Booking', 'Citizen books, advocate confirms/declines\nFull docket management dashboard\nSecure JWT-protected API for all operations'],
    ['Admin Console', 'Full platform audit and user management\n360-degree client and advocate dossiers\nPlatform statistics and account oversight'],
  ];

  modules.forEach(([title_, content], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 0.4 + col * 4.3;
    const cy = 1.3 + row * 2.8;
    card(s, cx, cy, 4.05, 2.55);
    s.addText(title_, { x: cx + 0.15, y: cy + 0.12, w: 3.75, h: 0.45, fontSize: 14, bold: true, color: GOLD, fontFace: 'Calibri' });
    s.addText(content, { x: cx + 0.15, y: cy + 0.6, w: 3.75, h: 1.75, fontSize: 12, color: LIGHT, fontFace: 'Calibri', valign: 'top', lineSpacingMultiple: 1.35 });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 7 — AI & RAG ENGINE
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '05  AI & RAG ENGINE', 0.4, 0.2, 3.0);
  title(s, 'AI-Powered Legal Research (RAG)', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // Flow diagram — left side
  const steps = [
    ['User Query', 'Citizen types a legal question in natural language (any language)'],
    ['Retrieval', 'System retrieves relevant statutes, case laws, court jurisdiction rules from local SQLite knowledge base'],
    ['Augmentation', 'Gemini API receives retrieved context + user query to generate a grounded, citation-backed legal answer'],
    ['Response', 'Answer displayed with best lawyer recommendation and suggested court jurisdiction for the case'],
  ];

  steps.forEach(([step, desc], i) => {
    const cy = 1.35 + i * 1.4;
    s.addShape(pptx.ShapeType.rect, { x: 0.4, y: cy, w: 1.4, h: 1.1, fill: { color: GOLD, transparency: 10 }, line: { type: 'none' } });
    s.addText(step, { x: 0.4, y: cy, w: 1.4, h: 1.1, fontSize: 12, bold: true, color: DARK, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    s.addText(desc, { x: 2.05, y: cy + 0.1, w: 5.0, h: 0.9, fontSize: 12.5, color: LIGHT, fontFace: 'Calibri', valign: 'middle', lineSpacingMultiple: 1.25 });
    if (i < 3) {
      s.addShape(pptx.ShapeType.rect, { x: 0.9, y: cy + 1.12, w: 0.5, h: 0.25, fill: { color: GOLD, transparency: 40 }, line: { type: 'none' } });
    }
  });

  // Right panel
  card(s, 7.4, 1.3, 5.5, 5.8);
  s.addText('RAG Architecture Components', { x: 7.6, y: 1.45, w: 5.1, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
  const components = [
    'Knowledge Base: 37 Indian statutes + 104 court jurisdiction rules stored in SQLite',
    'Embedding & Retrieval: Keyword + semantic retrieval of relevant legal sections',
    'LLM: Google Gemini API with legal system prompt and retrieved context',
    'Lawyer Matcher: AI suggests top-matched verified advocate by specialisation',
    'Court Suggester: Recommends correct jurisdictional court for the dispute',
    'Multilingual Output: Response translated to user-selected language in real-time',
  ];
  components.forEach((c, i) => {
    s.addText('• ' + c, { x: 7.6, y: 2.1 + i * 0.78, w: 5.1, h: 0.68, fontSize: 12, color: LIGHT, fontFace: 'Calibri', valign: 'middle', lineSpacingMultiple: 1.2 });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 8 — DATABASE & SECURITY
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '06  DATABASE & SECURITY', 0.4, 0.2, 3.5);
  title(s, 'Database Design & Security Architecture', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // DB Tables
  card(s, 0.4, 1.3, 5.9, 5.8);
  s.addText('SQLite Schema (key tables)', { x: 0.6, y: 1.45, w: 5.5, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
  const tables = [
    ['users', 'id, name, email, password_hash, role, created_at'],
    ['lawyers', 'id, name, bar_no, specialisation, court_affiliation, state'],
    ['courts', 'id, name, jurisdiction, state, lat, lng, efiling_url'],
    ['consultations', 'id, user_id, lawyer_id, status, booked_at, notes'],
    ['statutes', 'id, title, act_number, year, sections (JSON)'],
    ['cases', 'id, user_id, case_no, court, next_hearing, status'],
  ];
  tables.forEach(([table, cols], i) => {
    s.addText(table, { x: 0.6, y: 2.1 + i * 0.8, w: 1.8, h: 0.65, fontSize: 12, bold: true, color: GOLD, fontFace: 'Calibri', valign: 'middle' });
    s.addText(cols, { x: 2.5, y: 2.1 + i * 0.8, w: 3.6, h: 0.65, fontSize: 11, color: LIGHT, fontFace: 'Calibri', valign: 'middle', lineSpacingMultiple: 1.2 });
  });

  // Security
  card(s, 6.7, 1.3, 6.2, 5.8);
  s.addText('Security Architecture', { x: 6.9, y: 1.45, w: 5.8, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
  const secItems = [
    ['JWT Auth', 'Signed tokens with role claims (user/lawyer/admin). Tokens expire after 7 days with refresh logic.'],
    ['Role Separation', '3 strict role levels. Client tokens blocked from /api/admin and /api/lawyer endpoints with 403 Forbidden.'],
    ['Password Hashing', 'bcrypt with salt rounds = 12. Plaintext passwords never stored or logged.'],
    ['SQL Injection', 'All queries use parameterised statements via better-sqlite3 prepared statements.'],
    ['CORS & Helmet', 'Express Helmet for HTTP security headers. CORS restricted to localhost origin in development.'],
  ];
  secItems.forEach(([heading, desc], i) => {
    s.addText(heading, { x: 6.9, y: 2.1 + i * 1.0, w: 5.8, h: 0.38, fontSize: 13, bold: true, color: LIGHT, fontFace: 'Calibri' });
    s.addText(desc, { x: 6.9, y: 2.5 + i * 1.0, w: 5.8, h: 0.52, fontSize: 11.5, color: GRAY, fontFace: 'Calibri', lineSpacingMultiple: 1.2 });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 9 — UI/UX & MULTILINGUAL
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '07  UI/UX & MULTILINGUAL', 0.4, 0.2, 3.8);
  title(s, 'UI/UX Design & Multilingual Support', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // Left — UI features
  card(s, 0.4, 1.3, 6.0, 5.8);
  s.addText('Design System', { x: 0.6, y: 1.45, w: 5.6, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
  const uiFeatures = [
    'Dark / Light theme toggle with CSS variables throughout',
    'Gold (#B8956A) accent palette — legal authority aesthetic',
    'Fully responsive: mobile, tablet, desktop breakpoints',
    'Smooth modal overlays for Courts, News, AI Search',
    'CSS animations: card hover, parallax hero, fade-in sections',
    'Accessible: ARIA labels, focus management, keyboard navigation',
    'Sticky navigation with scroll-aware transparency effect',
    'Admin Console with full audit logs and dossier view',
  ];
  uiFeatures.forEach((f, i) => {
    s.addText('• ' + f, { x: 0.6, y: 2.1 + i * 0.63, w: 5.6, h: 0.55, fontSize: 12, color: LIGHT, fontFace: 'Calibri', valign: 'middle' });
  });

  // Right — Languages
  card(s, 6.8, 1.3, 6.1, 5.8);
  s.addText('Multilingual Support', { x: 7.0, y: 1.45, w: 5.7, h: 0.5, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri' });
  const langs = [
    ['English', '(Default)'],
    ['Hindi', 'हिन्दी'],
    ['Kannada', 'ಕನ್ನಡ'],
    ['Tamil', 'தமிழ்'],
    ['Telugu', 'తెలుగు'],
    ['Bengali', 'বাংলা'],
    ['Marathi', 'मराठी'],
    ['Gujarati', 'ગુજરાતી'],
  ];
  langs.forEach(([lang, script], i) => {
    s.addText(lang, { x: 7.0, y: 2.1 + i * 0.62, w: 2.2, h: 0.52, fontSize: 13, bold: true, color: LIGHT, fontFace: 'Calibri', valign: 'middle' });
    s.addText(script, { x: 9.3, y: 2.1 + i * 0.62, w: 3.3, h: 0.52, fontSize: 13, color: GOLD, fontFace: 'Calibri', valign: 'middle' });
  });
  s.addText('Powered by Google Translate API — full article reader, news modal, and AI search responses translated in real-time.', {
    x: 7.0, y: 7.0, w: 5.7, h: 0.5, fontSize: 10.5, color: GRAY, fontFace: 'Calibri', italic: true, valign: 'middle',
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 10 — TESTING
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '08  TESTING', 0.4, 0.2, 2.2);
  title(s, 'Testing & System Verification', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  // Pass count highlight
  card(s, 0.4, 1.3, 4.0, 2.2, DARK2);
  s.addText('35', { x: 0.4, y: 1.3, w: 4.0, h: 1.3, fontSize: 72, bold: true, color: GOLD, fontFace: 'Calibri', align: 'center', valign: 'middle' });
  s.addText('TESTS PASSED  |  0 FAILED', { x: 0.4, y: 2.6, w: 4.0, h: 0.55, fontSize: 13, bold: true, color: WHITE, fontFace: 'Calibri', align: 'center' });

  card(s, 4.7, 1.3, 8.2, 2.2, DARK2);
  s.addText('In-process full-system verification via scripts/test_in_process.js — no mocking, real SQLite database, real JWT tokens, real API endpoints.', {
    x: 4.9, y: 1.4, w: 7.8, h: 1.9, fontSize: 13, color: LIGHT, fontFace: 'Calibri', valign: 'middle', lineSpacingMultiple: 1.4,
  });

  // Test categories
  const testGroups = [
    ['Authentication (8 tests)', 'Client, Advocate, Admin login; JWT issuance; role redirect to user.html / lawyer.html / admin.html'],
    ['Authorization (3 tests)', 'Client token blocked from /api/admin (403) and /api/lawyer (403); cross-role isolation'],
    ['Lawyer & Courts Data (4 tests)', 'Full 37-advocate roster; complete court metadata for all 104 courts; dataset sync'],
    ['Consultation Lifecycle (5 tests)', 'Booking creation (201); docket retrieval; advocate confirmation; client consultation view'],
    ['Client Portal (3 tests)', 'Profile retrieval; active litigation dockets; booking history'],
    ['Admin Functions (5 tests)', 'All client accounts; advocate accounts; full consultation audit; 360-degree dossier; statistics'],
    ['Platform Integration (7 tests)', 'Live news service (12 articles); statutes sync (37); advocate-court affiliation; cleanup'],
  ];

  testGroups.forEach(([group, detail], i) => {
    const cy = 3.75 + i * 0.52;
    s.addText('PASS  ' + group, { x: 0.4, y: cy, w: 5.5, h: 0.44, fontSize: 12, bold: true, color: GOLD, fontFace: 'Calibri', valign: 'middle' });
    s.addText(detail, { x: 6.0, y: cy, w: 7.3, h: 0.44, fontSize: 11.5, color: LIGHT, fontFace: 'Calibri', valign: 'middle' });
    s.addShape(pptx.ShapeType.line, { x: 0.4, y: cy + 0.46, w: 12.5, h: 0, line: { color: GOLD, width: 0.5, transparency: 70 } });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 11 — DEMO / SCREENSHOTS (text representation)
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '09  PLATFORM SCREENS', 0.4, 0.2, 3.5);
  title(s, 'Key Platform Screens & Interfaces', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  const screens = [
    ['Homepage / Hero', 'Animated gradient hero with live legal statistics counter (courts, advocates, statutes). AI search bar with Gemini integration.'],
    ['Advocates Directory', 'lawyers.html — 37 Bar Council profiles with filter by specialisation, district, bar number. Click for full profile modal.'],
    ['Courts Modal', 'Full-screen overlay with 104 verified Indian courts. Filter by jurisdiction type (Supreme, High, District, Tribunal, JMFC) and state.'],
    ['Legal News & Articles', 'Live RSS-fed modal grid with category pills. Opens article reader with AI-generated takeaways, executive summary, checklist.'],
    ['AI Legal Search', 'RAG drawer with real-time legal analysis, statute citations, lawyer suggestion, and court jurisdiction recommendation.'],
    ['Consultation Booking', 'Citizen selects advocate, picks date/time, writes case description. Advocate receives and confirms from their portal.'],
  ];

  screens.forEach(([title_, desc], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = col === 0 ? 0.4 : 6.85;
    const cy = 1.3 + row * 2.0;
    card(s, cx, cy, 6.0, 1.75);
    s.addShape(pptx.ShapeType.rect, { x: cx, y: cy, w: 0.08, h: 1.75, fill: { color: GOLD }, line: { type: 'none' } });
    s.addText(title_, { x: cx + 0.25, y: cy + 0.1, w: 5.65, h: 0.42, fontSize: 14, bold: true, color: GOLD, fontFace: 'Calibri' });
    s.addText(desc, { x: cx + 0.25, y: cy + 0.55, w: 5.65, h: 1.05, fontSize: 12, color: LIGHT, fontFace: 'Calibri', valign: 'top', lineSpacingMultiple: 1.3 });
  });

  s.addText('Live demo at: http://localhost:5000/index.html', {
    x: 0.4, y: 7.1, w: 12.5, h: 0.3, fontSize: 11, color: GRAY, fontFace: 'Courier New', align: 'center',
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 12 — FUTURE SCOPE
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  badge(s, '10  FUTURE SCOPE', 0.4, 0.2, 3.0);
  title(s, 'Future Scope & Enhancements', { y: 0.6, fs: 28 });
  dividerLine(s, 1.1);

  const future = [
    ['Mobile App', 'Native Android & iOS application with offline statute storage and push notifications for case hearing dates.'],
    ['Real-Time Chat', 'WebSocket-based citizen-to-advocate live chat with encrypted message storage and read receipts.'],
    ['E-Filing Integration', 'Direct petition and document e-filing to court portals via official API integrations with eCourts services.'],
    ['Blockchain Credentials', 'Immutable Bar Council certificate verification using blockchain smart contracts for advocate credentials.'],
    ['Predictive Analytics', 'Machine learning models to predict case outcomes based on historical judgments and jurisdiction patterns.'],
    ['Voice Interface', 'Multilingual voice-based legal query input using Google Speech-to-Text for rural and low-literacy users.'],
  ];

  future.forEach(([title_, desc], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = col === 0 ? 0.4 : 6.85;
    const cy = 1.3 + row * 2.0;
    card(s, cx, cy, 6.0, 1.75);
    s.addText(title_, { x: cx + 0.2, y: cy + 0.1, w: 5.7, h: 0.42, fontSize: 14, bold: true, color: GOLD, fontFace: 'Calibri' });
    s.addText(desc, { x: cx + 0.2, y: cy + 0.55, w: 5.7, h: 1.05, fontSize: 12.5, color: LIGHT, fontFace: 'Calibri', valign: 'top', lineSpacingMultiple: 1.3 });
  });
});

// ══════════════════════════════════════════════════════════════
// SLIDE 13 — CONCLUSION
// ══════════════════════════════════════════════════════════════
slide(s => {
  bg(s, DARK);
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: GOLD } });
  s.addShape(pptx.ShapeType.rect, { x: 11.5, y: 0, w: 1.83, h: 7.5, fill: { color: DARK2 } });

  title(s, 'Conclusion', { y: 0.6, fs: 32 });
  dividerLine(s, 1.1);

  s.addText(
    'LegalAI bridges the critical gap between India\'s complex judicial ecosystem and its 1.4 billion citizens by delivering a unified, intelligent, and multilingual legal platform. By combining verified court and advocate data, an AI-powered RAG research assistant, real-time legal news, and a secure three-role system, the platform democratises access to legal knowledge and professional guidance.',
    { x: 0.5, y: 1.3, w: 10.6, h: 1.6, fontSize: 14.5, color: LIGHT, fontFace: 'Calibri', valign: 'top', lineSpacingMultiple: 1.5 }
  );

  const achievements = [
    '104 verified Indian courts with GPS, e-filing, Chief Justice data',
    '37 Bar Council-verified advocates across all major practice areas',
    '37 Indian statutes fully indexed in the AI knowledge base',
    '8-language real-time multilingual translation support',
    '35/35 automated system tests passing — full platform coverage',
    'Three-role JWT authentication with strict API-level access control',
    'Live legal news aggregation from RSS feeds with AI summaries',
  ];

  achievements.forEach((a, i) => {
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.1 + i * 0.54, w: 0.28, h: 0.28, fill: { color: GOLD }, line: { type: 'none' } });
    s.addText(a, { x: 0.9, y: 3.08 + i * 0.54, w: 10.1, h: 0.42, fontSize: 13, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });

  dividerLine(s, 7.0);
  s.addText('Thank You  |  Questions?', { x: 0.5, y: 7.05, w: 10.6, h: 0.38, fontSize: 15, bold: true, color: GOLD, fontFace: 'Calibri', align: 'center' });
});

// ── SAVE ──────────────────────────────────────────────────────
const outPath = path.join(__dirname, '..', 'LegalAI_Presentation.pptx');
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log('Saved:', outPath);
}).catch(err => {
  console.error('Error:', err.message);
});

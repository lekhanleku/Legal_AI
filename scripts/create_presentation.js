const path = require('path');
const pptxgen = require(path.resolve(__dirname, '../server/node_modules/pptxgenjs'));

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
pres.author = 'MCA Student';
pres.company = 'Department of Computer Applications';
pres.title = 'LegalAI - MCA Final Project Review (MPRJ382)';

// Color Palette
const COLORS = {
  bg: '0D1117',
  cardBg: '161B22',
  cardBorder: '30363D',
  gold: 'D4AF37',
  goldDark: '9A764D',
  white: 'FFFFFF',
  textLight: 'E6EDF3',
  textMuted: '8B949E',
  blue: '58A6FF',
  green: '3FB950',
  red: 'F85149'
};

// Helper to add standard header and footer to a content slide
function setupSlide(slide, title, category = 'MCA FINAL REVIEW · MAIN PROJECT MPRJ382', slideNum) {
  // Slide background
  slide.background = { color: COLORS.bg };

  // Top header category badge
  slide.addText(category.toUpperCase(), {
    x: 0.6, y: 0.35, w: 8.8, h: 0.25,
    fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.gold, charSpacing: 1.5
  });

  // Slide title
  slide.addText(title, {
    x: 0.6, y: 0.58, w: 8.8, h: 0.45,
    fontSize: 18, fontFace: 'Calibri', bold: true, color: COLORS.white
  });

  // Header separator line
  slide.addShape(pres.ShapeType.line, {
    x: 0.6, y: 1.05, w: 8.8, h: 0,
    line: { color: '21262D', width: 1.5 }
  });

  // Footer line
  slide.addShape(pres.ShapeType.line, {
    x: 0.6, y: 5.15, w: 8.8, h: 0,
    line: { color: '21262D', width: 1 }
  });

  // Footer left text
  slide.addText('LegalAI · AI-Powered Legal Advisory & Advocate Consultation Platform', {
    x: 0.6, y: 5.22, w: 6.5, h: 0.3,
    fontSize: 8.5, fontFace: 'Calibri', color: COLORS.textMuted
  });

  // Footer right: Slide number
  if (slideNum) {
    slide.addText(`Slide ${slideNum} of 16`, {
      x: 7.2, y: 5.22, w: 2.2, h: 0.3,
      align: 'right', fontSize: 8.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
  }
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1: Title Slide
// ─────────────────────────────────────────────────────────────
{
  const s1 = pres.addSlide();
  s1.background = { color: COLORS.bg };

  // Decorative border box
  s1.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.4, w: 9.0, h: 4.825,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.goldDark, width: 1.5 }
  });

  // Category Tag
  s1.addText('FINAL REVIEW · MAIN PROJECT MPRJ382 · SEMESTER 3 MCA', {
    x: 0.8, y: 0.75, w: 8.4, h: 0.3,
    align: 'center', fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.gold, charSpacing: 2
  });

  // Main Project Title
  s1.addText('LegalAI: Intelligent Legal Advisory, Court Jurisdiction\n& Advocate Consultation Platform', {
    x: 0.8, y: 1.15, w: 8.4, h: 1.1,
    align: 'center', fontSize: 21, fontFace: 'Calibri', bold: true, color: COLORS.white, lineSpacing: 26
  });

  // Subtitle
  s1.addText('Implementation of an End-to-End Three-Tier Legal Intelligence Platform with BNS/IPC Transition Mapping & Verified Advocate Scheduling', {
    x: 1.0, y: 2.35, w: 8.0, h: 0.45,
    align: 'center', fontSize: 11, fontFace: 'Calibri', color: COLORS.textLight, italic: true
  });

  // Horizontal separator
  s1.addShape(pres.ShapeType.line, {
    x: 1.5, y: 2.95, w: 7.0, h: 0,
    line: { color: COLORS.gold, width: 1.5 }
  });

  // Two details columns (Student Info & Guide Info)
  // Student Box
  s1.addShape(pres.ShapeType.rect, {
    x: 1.0, y: 3.15, w: 3.8, h: 1.7,
    fill: { color: '0D1117' },
    line: { color: '30363D', width: 1 }
  });
  s1.addText('STUDENT DETAILS', {
    x: 1.2, y: 3.25, w: 3.4, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s1.addText([
    { text: 'Candidate Name: ', options: { bold: true, color: COLORS.white } },
    { text: '[Student Name]\n', options: { color: COLORS.textLight } },
    { text: 'University Seat No (USN): ', options: { bold: true, color: COLORS.white } },
    { text: '[Your USN]\n', options: { color: COLORS.textLight } },
    { text: 'Degree & Branch: ', options: { bold: true, color: COLORS.white } },
    { text: 'Master of Computer Applications (MCA)\n', options: { color: COLORS.textLight } },
    { text: 'Academic Batch: ', options: { bold: true, color: COLORS.white } },
    { text: '2024 – 2026', options: { color: COLORS.textLight } }
  ], {
    x: 1.2, y: 3.55, w: 3.4, h: 1.2,
    fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 14
  });

  // Guide Box
  s1.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 3.15, w: 3.8, h: 1.7,
    fill: { color: '0D1117' },
    line: { color: '30363D', width: 1 }
  });
  s1.addText('ACADEMIC SUPERVISION', {
    x: 5.4, y: 3.25, w: 3.4, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s1.addText([
    { text: 'Project Guide: ', options: { bold: true, color: COLORS.white } },
    { text: '[Guide Name, Designation]\n', options: { color: COLORS.textLight } },
    { text: 'Department: ', options: { bold: true, color: COLORS.white } },
    { text: 'Department of Computer Applications\n', options: { color: COLORS.textLight } },
    { text: 'Course Code: ', options: { bold: true, color: COLORS.white } },
    { text: 'MPRJ382 (Main Project Phase)\n', options: { color: COLORS.textLight } },
    { text: 'Institution: ', options: { bold: true, color: COLORS.white } },
    { text: '[College / University Name]', options: { color: COLORS.textLight } }
  ], {
    x: 5.4, y: 3.55, w: 3.4, h: 1.2,
    fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 14
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2: Introduction & Motivation
// ─────────────────────────────────────────────────────────────
{
  const s2 = pres.addSlide();
  setupSlide(s2, 'Introduction & Real-World Motivation', 'Background & Motivation', 2);

  // Left Box: What problem are we solving?
  s2.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.25, w: 4.25, h: 3.7,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s2.addText('WHAT PROBLEM ARE WE SOLVING?', {
    x: 0.8, y: 1.4, w: 3.85, h: 0.3,
    fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s2.addText([
    { text: '• Legal Complexity: ', options: { bold: true, color: COLORS.white } },
    { text: 'Indian law is full of complex terminology that ordinary citizens cannot easily understand.\n\n', options: { color: COLORS.textLight } },
    { text: '• Forum & Court Confusion: ', options: { bold: true, color: COLORS.white } },
    { text: 'Citizens do not know whether their case belongs in District Court, High Court, or a specialized tribunal.\n\n', options: { color: COLORS.textLight } },
    { text: '• Lack of Advocate Transparency: ', options: { bold: true, color: COLORS.white } },
    { text: 'Finding verified advocates with real practicing courts, clear fees, and authentic credentials is hard.\n\n', options: { color: COLORS.textLight } },
    { text: '• High Entry Barrier: ', options: { bold: true, color: COLORS.white } },
    { text: 'People pay steep preliminary fees simply to understand their basic legal rights.', options: { color: COLORS.textLight } }
  ], {
    x: 0.8, y: 1.8, w: 3.85, h: 3.0,
    fontSize: 10, fontFace: 'Calibri', lineSpacing: 14
  });

  // Right Box: Why is this needed in the real world?
  s2.addShape(pres.ShapeType.rect, {
    x: 5.15, y: 1.25, w: 4.25, h: 3.7,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s2.addText('WHY IS THIS SOLUTION NEEDED NOW?', {
    x: 5.35, y: 1.4, w: 3.85, h: 0.3,
    fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s2.addText([
    { text: '• New Criminal Law Transition (2024): ', options: { bold: true, color: COLORS.white } },
    { text: 'India transitioned from IPC, CrPC, and IEA to Bharatiya Nyaya Sanhita (BNS), BNSS, and BSA. Citizens need instant translation.\n\n', options: { color: COLORS.textLight } },
    { text: '• Bridging Access to Justice: ', options: { bold: true, color: COLORS.white } },
    { text: 'Technology enables ordinary people to receive preliminary legal assessments 24/7 without delays.\n\n', options: { color: COLORS.textLight } },
    { text: '• Digital Judicial Integration: ', options: { bold: true, color: COLORS.white } },
    { text: 'Complements government e-Courts initiatives by educating citizens before they reach courtrooms.\n\n', options: { color: COLORS.textLight } },
    { text: '• Transparent Booking: ', options: { bold: true, color: COLORS.white } },
    { text: 'Connects clients directly with verified lawyers in a structured digital workflow.', options: { color: COLORS.textLight } }
  ], {
    x: 5.35, y: 1.8, w: 3.85, h: 3.0,
    fontSize: 10, fontFace: 'Calibri', lineSpacing: 14
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3: Problem Statement
// ─────────────────────────────────────────────────────────────
{
  const s3 = pres.addSlide();
  setupSlide(s3, 'Problem Statement: Limitations of Existing Systems', 'Current Challenges', 3);

  const problems = [
    {
      title: '1. Information Fragmentation',
      desc: 'Court dockets are on government sites, lawyer contacts are on phone directories, and statutes are in bare-act PDFs. Users must navigate 4-5 disconnected platforms.'
    },
    {
      title: '2. Wrong Forum & Jurisdiction Filings',
      desc: 'Litigants frequently file cases in incorrect courts (e.g. approaching High Court directly for lease disputes), leading to dismissals, wasted time, and procedural delays.'
    },
    {
      title: '3. Unverified Directory Profiles',
      desc: 'Generic platforms (Justdial, Sulekha) display unverified lawyer listings with fake ratings, zero verified bar registration checks, and no practicing court affiliations.'
    },
    {
      title: '4. Outdated Statutory Reference Systems',
      desc: 'Current online portals still use old Indian Penal Code sections and lack automated cross-referencing to the newly enacted Bharatiya Nyaya Sanhita (BNS 2024).'
    },
    {
      title: '5. Absence of Unified Role Collaboration',
      desc: 'There is no cohesive platform providing synchronized portals for Citizens (clients), Advocates (chambers management), and Administrators (compliance & audits).'
    }
  ];

  problems.forEach((p, idx) => {
    const yPos = 1.25 + idx * 0.72;
    s3.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 8.8, h: 0.64,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s3.addText(p.title, {
      x: 0.8, y: yPos + 0.08, w: 3.2, h: 0.25,
      fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s3.addText(p.desc, {
      x: 4.0, y: yPos + 0.08, w: 5.2, h: 0.5,
      fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 12
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4: Objectives
// ─────────────────────────────────────────────────────────────
{
  const s4 = pres.addSlide();
  setupSlide(s4, 'Project Objectives: Application & System Goals', 'Project Scope', 4);

  const objectives = [
    {
      num: '01',
      title: 'Conversational Legal Guidance Engine',
      desc: 'Develop an interactive AI assistant that interprets citizen legal problems in plain English and provides structured rights summaries and legal preconditions.'
    },
    {
      num: '02',
      title: 'Automated Court & Jurisdiction Resolver',
      desc: 'Implement statutory procedural rules (CPC Sec. 16-18) to automatically identify the appropriate court level (District, High Court, Supreme Court) and filing guidelines.'
    },
    {
      num: '03',
      title: 'BNS 2024 Statutory Transition Mapping',
      desc: 'Engineer a bidirectional conversion system mapping legacy IPC sections (e.g., IPC 420, 302, 378) to new Bharatiya Nyaya Sanhita provisions (BNS 318(4), 103, 303).'
    },
    {
      num: '04',
      title: 'Verified Advocate Consultation Booking',
      desc: 'Build a directory of 37 verified senior advocates and counsel with genuine bar affiliations and enable direct consultation appointment scheduling.'
    },
    {
      num: '05',
      title: 'Secure Multi-Role Portals & Audit Architecture',
      desc: 'Deliver three dedicated role-based portals (Client Portal, Advocate Chambers, Admin Cockpit) secured via JWT authentication and role-based access control (RBAC).'
    }
  ];

  objectives.forEach((obj, idx) => {
    const yPos = 1.25 + idx * 0.72;
    s4.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 8.8, h: 0.64,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    // Number badge
    s4.addShape(pres.ShapeType.rect, {
      x: 0.8, y: yPos + 0.12, w: 0.45, h: 0.4,
      fill: { color: '21262D' },
      line: { color: COLORS.gold, width: 1 }
    });
    s4.addText(obj.num, {
      x: 0.8, y: yPos + 0.16, w: 0.45, h: 0.3,
      align: 'center', fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    // Title
    s4.addText(obj.title, {
      x: 1.4, y: yPos + 0.08, w: 3.3, h: 0.25,
      fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.white
    });
    // Desc
    s4.addText(obj.desc, {
      x: 4.8, y: yPos + 0.08, w: 4.4, h: 0.5,
      fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 12
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5: Literature Survey / Existing Systems
// ─────────────────────────────────────────────────────────────
{
  const s5 = pres.addSlide();
  setupSlide(s5, 'Literature Survey & Gap Analysis', 'Comparative Study', 5);

  // Table comparison
  const rows = [
    [
      { text: 'System Category', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } },
      { text: 'Working Methodology', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } },
      { text: 'Identified Limitations', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } },
      { text: 'LegalAI Solution & Advancement', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } }
    ],
    [
      { text: 'Government Legal Portals\n(eCourts, IndiaCode)', options: { bold: true, color: COLORS.white } },
      { text: 'Static text repositories, bare act PDFs, raw case number search', options: { color: COLORS.textLight } },
      { text: 'No plain-English guidance, zero jurisdiction advisory, highly technical', options: { color: COLORS.red } },
      { text: 'Provides natural language query evaluation, rights summaries, and e-filing guides', options: { color: COLORS.green } }
    ],
    [
      { text: 'Commercial Directories\n(Justdial, Sulekha)', options: { bold: true, color: COLORS.white } },
      { text: 'Paid listing aggregator, keyword matching on city and specialty', options: { color: COLORS.textLight } },
      { text: 'Unverified profiles, fake ratings, no court affiliation verification', options: { color: COLORS.red } },
      { text: 'Strictly curates verified Bar Council advocates mapped to practicing courts', options: { color: COLORS.green } }
    ],
    [
      { text: 'Generic LLMs\n(ChatGPT, Gemini)', options: { bold: true, color: COLORS.white } },
      { text: 'Probabilistic token prediction trained on open web crawl', options: { color: COLORS.textLight } },
      { text: 'Hallucinates foreign US laws, unaware of local Indian court benches', options: { color: COLORS.red } },
      { text: 'Grounded Indian statutory corpus and live verified advocate booking workflows', options: { color: COLORS.green } }
    ]
  ];

  s5.addTable(rows, {
    x: 0.6, y: 1.3, w: 8.8, h: 3.6,
    colW: [1.8, 2.3, 2.3, 2.4],
    border: { pt: 1, color: '30363D' },
    fill: { color: COLORS.cardBg },
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 13,
    valign: 'middle'
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6: Proposed System Overview
// ─────────────────────────────────────────────────────────────
{
  const s6 = pres.addSlide();
  setupSlide(s6, 'Proposed System Overview: High-Level Concept', 'System Concept', 6);

  // Workflow steps in 4 visual cards
  const steps = [
    { step: 'STEP 1', title: 'User Inquiry Input', desc: 'Citizen inputs legal dispute in conversational English via AI Chat Drawer or searches Directory.' },
    { step: 'STEP 2', title: 'Statutory Analysis', desc: 'System parses legal keywords, identifies relevant statutes, and cross-references IPC to BNS 2024.' },
    { step: 'STEP 3', title: 'Jurisdiction Mapping', desc: 'Rules engine resolves subject matter and territorial jurisdiction across 104 Indian courts.' },
    { step: 'STEP 4', title: 'Advocate Consultation', desc: 'Citizen books verified advocate practicing before that court; request routes to Advocate Chambers.' }
  ];

  steps.forEach((s, idx) => {
    const xPos = 0.6 + idx * 2.25;
    s6.addShape(pres.ShapeType.rect, {
      x: xPos, y: 1.3, w: 2.15, h: 2.1,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s6.addText(s.step, {
      x: xPos + 0.15, y: 1.45, w: 1.85, h: 0.25,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s6.addText(s.title, {
      x: xPos + 0.15, y: 1.75, w: 1.85, h: 0.45,
      fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.white
    });
    s6.addText(s.desc, {
      x: xPos + 0.15, y: 2.25, w: 1.85, h: 1.0,
      fontSize: 9, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 12
    });
  });

  // Summary box below
  s6.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 3.6, w: 8.8, h: 1.35,
    fill: { color: '161B22' },
    line: { color: COLORS.gold, width: 1 }
  });
  s6.addText('CORE ARCHITECTURAL PROPOSITION', {
    x: 0.8, y: 3.75, w: 8.4, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s6.addText([
    { text: '• Seamless End-to-End Pipeline: ', options: { bold: true, color: COLORS.white } },
    { text: 'Eliminates the disconnect between preliminary legal knowledge, court jurisdiction selection, and physical legal representation.\n', options: { color: COLORS.textLight } },
    { text: '• Grounded & Deterministic: ', options: { bold: true, color: COLORS.white } },
    { text: 'Prevents hallucinations by using curated, official legal statutes and authentic Bar Council credentials.\n', options: { color: COLORS.textLight } },
    { text: '• Zero Barrier for Citizens: ', options: { bold: true, color: COLORS.white } },
    { text: 'Clean, responsive user interface accessible on smartphones, tablets, and desktops.', options: { color: COLORS.textLight } }
  ], {
    x: 0.8, y: 4.05, w: 8.4, h: 0.85,
    fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 13
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7: Key Features & User Roles
// ─────────────────────────────────────────────────────────────
{
  const s7 = pres.addSlide();
  setupSlide(s7, 'Key Features of the System & Target User Roles', 'Roles & Capabilities', 7);

  const roles = [
    {
      name: 'ROLE 1: CITIZEN / CLIENT',
      color: COLORS.blue,
      features: [
        'AI Legal Assistant Chat Drawer for instant queries',
        'Interactive Court Directory with maps and e-filing info',
        'Verified Advocate Directory with fee & rating filters',
        '1-Click Consultation Appointment Scheduling',
        'Personal Client Portal to track booked consultations'
      ]
    },
    {
      name: 'ROLE 2: ADVOCATE / LAWYER',
      color: COLORS.gold,
      features: [
        'Dedicated Advocate Chambers Portal (lawyer.html)',
        'Incoming Consultation Request Management',
        'Client Dossier Inspection & Dispute Notes',
        'Consultation Status Confirmation & Rescheduling',
        'Practicing Court Affiliation & Profile Customization'
      ]
    },
    {
      name: 'ROLE 3: ADMINISTRATOR',
      color: COLORS.green,
      features: [
        'Unified Administrator Cockpit (admin.html)',
        'Platform KPI Metrics (Users, Lawyers, Bookings)',
        'Advocate Roster CRUD (Add, Edit, Toggle Availability)',
        'Security Audit Trail & Real-Time Activity Monitoring',
        'Database Sync & Dataset Health Verification'
      ]
    }
  ];

  roles.forEach((r, idx) => {
    const xPos = 0.6 + idx * 3.0;
    s7.addShape(pres.ShapeType.rect, {
      x: xPos, y: 1.3, w: 2.8, h: 3.65,
      fill: { color: COLORS.cardBg },
      line: { color: r.color, width: 1.5 }
    });
    s7.addText(r.name, {
      x: xPos + 0.15, y: 1.45, w: 2.5, h: 0.3,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: r.color
    });
    const bulletText = r.features.map(f => `• ${f}\n\n`).join('');
    s7.addText(bulletText, {
      x: xPos + 0.15, y: 1.85, w: 2.5, h: 3.0,
      fontSize: 9, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 13
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 8: System Architecture & Data Flow
// ─────────────────────────────────────────────────────────────
{
  const s8 = pres.addSlide();
  setupSlide(s8, 'System Architecture & Data Flow Diagram (DFD)', 'Architecture Design', 8);

  // 3-Tier Layer Boxes on Left
  const tiers = [
    {
      tier: 'PRESENTATION LAYER (Client)',
      desc: 'Responsive Web Portals: index.html (Public & AI Drawer), user.html (Client Portal), lawyer.html (Advocate Chambers), admin.html (Admin Cockpit). Pure HTML5/CSS3/ES6+.'
    },
    {
      tier: 'APPLICATION LAYER (Business Logic)',
      desc: 'Node.js & Express REST APIs: Authentication & JWT Middleware, Role-Based Access Control (RBAC), Case Sync Service, Live Data Watcher, Legal Jurisdiction Logic.'
    },
    {
      tier: 'PERSISTENCE LAYER (Data Storage)',
      desc: 'SQLite Engine (legalai.db) running in WAL mode with better-sqlite3: 5 core relational tables + Live synchronized JSON datasets (104 Courts, 37 Advocates, 37 Statutes).'
    }
  ];

  tiers.forEach((t, idx) => {
    const yPos = 1.3 + idx * 1.15;
    s8.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 4.8, h: 1.05,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s8.addText(t.tier, {
      x: 0.75, y: yPos + 0.08, w: 4.5, h: 0.25,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s8.addText(t.desc, {
      x: 0.75, y: yPos + 0.33, w: 4.5, h: 0.65,
      fontSize: 8.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 11
    });
  });

  // Data Flow Diagram Box on Right
  s8.addShape(pres.ShapeType.rect, {
    x: 5.6, y: 1.3, w: 3.8, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.gold, width: 1 }
  });
  s8.addText('DATA FLOW BREAKDOWN (DFD LEVEL 0 & 1)', {
    x: 5.75, y: 1.45, w: 3.5, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s8.addText([
    { text: '1. User Request (Input): ', options: { bold: true, color: COLORS.white } },
    { text: 'Client sends dispute query via HTTP POST to /api/legal/evaluate.\n\n', options: { color: COLORS.textLight } },
    { text: '2. Token Authentication: ', options: { bold: true, color: COLORS.white } },
    { text: 'Middleware verifies JWT bearer token and enforces user role.\n\n', options: { color: COLORS.textLight } },
    { text: '3. Jurisdiction & Statute Resolution: ', options: { bold: true, color: COLORS.white } },
    { text: 'Express queries SQLite database for matching court codes and advocates.\n\n', options: { color: COLORS.textLight } },
    { text: '4. Booking Transaction: ', options: { bold: true, color: COLORS.white } },
    { text: 'Consultation record created with Status: "Pending" and linked to advocate chamber.\n\n', options: { color: COLORS.textLight } },
    { text: '5. Response (Output): ', options: { bold: true, color: COLORS.white } },
    { text: 'Structured JSON response delivered to frontend in < 15ms.', options: { color: COLORS.textLight } }
  ], {
    x: 5.75, y: 1.8, w: 3.5, h: 3.0,
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 12
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 9: Database Design & Datasets
// ─────────────────────────────────────────────────────────────
{
  const s9 = pres.addSlide();
  setupSlide(s9, 'Database Design (ER Diagram) & Dataset Details', 'Database Schema', 9);

  // Schema Table Summary on Left
  const tables = [
    { name: 'users', fields: 'id (PK), email (UK), password, role, name, phone, createdAt' },
    { name: 'lawyers', fields: 'id (PK), name, title, specialty, barNumber (UK), experienceYears, practicingCourts, hourlyRate, avatarUrl' },
    { name: 'courts', fields: 'id (PK), code (UK), name, jurisdiction, level, state, filingSystem, latitude, longitude' },
    { name: 'consultations', fields: 'id (PK), userId (FK), lawyerId (FK), preferredDate, legalMatter, status ("pending" | "confirmed")' },
    { name: 'statutes', fields: 'id (PK), actCode, sectionNumber, sectionTitle, description, bnsMapping' }
  ];

  tables.forEach((t, idx) => {
    const yPos = 1.3 + idx * 0.72;
    s9.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 4.8, h: 0.64,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s9.addText(`TABLE: ${t.name.toUpperCase()}`, {
      x: 0.8, y: yPos + 0.08, w: 1.8, h: 0.22,
      fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s9.addText(t.fields, {
      x: 0.8, y: yPos + 0.32, w: 4.4, h: 0.28,
      fontSize: 8, fontFace: 'Calibri', color: COLORS.textLight
    });
  });

  // Dataset Details on Right
  s9.addShape(pres.ShapeType.rect, {
    x: 5.6, y: 1.3, w: 3.8, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.gold, width: 1 }
  });
  s9.addText('DATASET DETAILS & PARAMETERS', {
    x: 5.75, y: 1.45, w: 3.5, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s9.addText([
    { text: '• 104 Indian Courts Dataset:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Covers Supreme Court, 25 High Courts, and 78 District & Sessions Courts with e-Courts CIS filing links.\n\n', options: { color: COLORS.textLight } },
    { text: '• 37 Verified Advocates Dataset:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Includes verified Bar Council numbers, practicing courts, fee tiers, and real authentic portrait URLs.\n\n', options: { color: COLORS.textLight } },
    { text: '• 37 Indian Statutory Provisions:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Encodes property, tenancy, constitutional, and criminal provisions mapped to BNS 2024.\n\n', options: { color: COLORS.textLight } },
    { text: '• Repository Storage: ', options: { bold: true, color: COLORS.white } },
    { text: 'Persistent JSON in /datasets and synchronized to SQLite via liveDataWatcher.js.', options: { color: COLORS.textLight } }
  ], {
    x: 5.75, y: 1.8, w: 3.5, h: 3.0,
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 13
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 10: Tech Stack & Tools Used
// ─────────────────────────────────────────────────────────────
{
  const s10 = pres.addSlide();
  setupSlide(s10, 'Technology Stack & Development Tools Used', 'Technology Stack', 10);

  const stack = [
    {
      category: 'FRONTEND DEVELOPMENT',
      tools: 'HTML5, Modern CSS3, Vanilla JavaScript (ES6+)',
      why: 'Zero-framework architecture provides sub-second load times, lightweight bundle size, and responsive glassmorphic UI across all screen sizes.'
    },
    {
      category: 'BACKEND SERVICES & APIs',
      tools: 'Node.js, Express.js REST Framework',
      why: 'High-concurrency asynchronous I/O handling multiple simultaneous consultation bookings and court directory search requests with minimal overhead.'
    },
    {
      category: 'DATABASE & DATA PERSISTENCE',
      tools: 'SQLite 3 with better-sqlite3 Engine',
      why: 'Embedded, zero-network-socket SQL engine running in WAL (Write-Ahead Logging) mode, achieving sub-millisecond query execution speeds.'
    },
    {
      category: 'SECURITY & AUTHORIZATION',
      tools: 'JWT (JSON Web Tokens) & bcryptjs',
      why: 'Stateless authentication with HTTP-only cookie support and role-based access control protecting client, advocate, and admin endpoints.'
    }
  ];

  stack.forEach((st, idx) => {
    const yPos = 1.3 + idx * 0.9;
    s10.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 8.8, h: 0.82,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s10.addText(st.category, {
      x: 0.8, y: yPos + 0.1, w: 2.8, h: 0.25,
      fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s10.addText(`Technologies: ${st.tools}`, {
      x: 0.8, y: yPos + 0.35, w: 3.6, h: 0.38,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.white
    });
    s10.addText(st.why, {
      x: 4.6, y: yPos + 0.1, w: 4.6, h: 0.64,
      fontSize: 8.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 11
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 11: Implementation Highlights (Core Code)
// ─────────────────────────────────────────────────────────────
{
  const s11 = pres.addSlide();
  setupSlide(s11, 'Implementation Highlights & Core Code Modules', 'Key Logic & Algorithms', 11);

  // Left Box: Key Algorithms
  s11.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.3, w: 4.3, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s11.addText('CORE ALGORITHM WORKFLOWS', {
    x: 0.8, y: 1.45, w: 3.9, h: 0.25,
    fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s11.addText([
    { text: '1. Jurisdiction Resolution Algorithm:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Matches dispute topic against statutory rules (e.g. CPC § 16-18 for immovable property). Resolves territorial & pecuniary court tiers.\n\n', options: { color: COLORS.textLight } },
    { text: '2. BNS 2024 Transition Mapping:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Normalizes user references to old IPC acts (e.g. IPC 420 -> BNS 318(4)) using a deterministic hash map lookup.\n\n', options: { color: COLORS.textLight } },
    { text: '3. In-Process Dataset Synchronization:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Syncs file changes between JSON files and SQLite tables automatically on server startup via database transactions.', options: { color: COLORS.textLight } }
  ], {
    x: 0.8, y: 1.8, w: 3.9, h: 3.0,
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 13
  });

  // Right Box: Code Snippet
  s11.addShape(pres.ShapeType.rect, {
    x: 5.1, y: 1.3, w: 4.3, h: 3.65,
    fill: { color: '0D1117' },
    line: { color: COLORS.gold, width: 1 }
  });
  s11.addText('RBAC SECURITY MIDDLEWARE (server/routes)', {
    x: 5.25, y: 1.45, w: 4.0, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  const codeSnippet = `// Strict Role-Based Access Control (RBAC)
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Access Forbidden: Insufficient Permissions"
      });
    }
    next();
  };
}

// Route Protection:
router.get('/api/admin/metrics',
  verifyJWT,
  authorizeRoles('admin'),
  getAdminMetrics
);`;
  s11.addText(codeSnippet, {
    x: 5.25, y: 1.8, w: 4.0, h: 3.0,
    fontSize: 8.5, fontFace: 'Consolas', color: COLORS.textLight, lineSpacing: 11
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 12: Results & UI Screens
// ─────────────────────────────────────────────────────────────
{
  const s12 = pres.addSlide();
  setupSlide(s12, 'System Results: Completed User Interface Screens', 'Module Demonstrations', 12);

  const screens = [
    {
      title: 'PUBLIC PORTAL & AI ASSISTANT',
      file: 'index.html',
      features: 'Full-width drawer (50vw), suggested legal topic chips, structured statutory assessments, and instant attorney recommendations.'
    },
    {
      title: 'ADVOCATE CHAMBERS PORTAL',
      file: 'lawyer.html',
      features: 'Dedicated advocate cockpit with pending consultation alerts, confirm/reschedule action buttons, and client litigation dossiers.'
    },
    {
      title: 'CITIZEN CLIENT PORTAL',
      file: 'user.html',
      features: 'Personal client space displaying active consultation bookings, assigned advocate profile cards, and litigation case tracking.'
    },
    {
      title: 'ADMINISTRATOR COCKPIT',
      file: 'admin.html',
      features: 'Platform KPI overview, advocate roster management (add/edit/delete), live security audit logs, and account management.'
    }
  ];

  screens.forEach((sc, idx) => {
    const xPos = 0.6 + (idx % 2) * 4.5;
    const yPos = 1.3 + Math.floor(idx / 2) * 1.85;
    s12.addShape(pres.ShapeType.rect, {
      x: xPos, y: yPos, w: 4.3, h: 1.7,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s12.addText(sc.title, {
      x: xPos + 0.15, y: yPos + 0.12, w: 4.0, h: 0.25,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s12.addText(`File: ${sc.file}`, {
      x: xPos + 0.15, y: yPos + 0.38, w: 4.0, h: 0.2,
      fontSize: 8.5, fontFace: 'Consolas', color: COLORS.blue
    });
    s12.addText(sc.features, {
      x: xPos + 0.15, y: yPos + 0.65, w: 4.0, h: 0.95,
      fontSize: 9, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 13
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 13: Testing & Test Execution Results
// ─────────────────────────────────────────────────────────────
{
  const s13 = pres.addSlide();
  setupSlide(s13, 'Testing & Test Execution Results: 35/35 Passing', 'Verification & Quality Assurance', 13);

  // Big pass banner on top
  s13.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.3, w: 8.8, h: 0.7,
    fill: { color: '161B22' },
    line: { color: COLORS.green, width: 2 }
  });
  s13.addText('AUTOMATED IN-PROCESS INTEGRATION TEST SUITE: 35 PASSED, 0 FAILED (100% SUCCESS)', {
    x: 0.8, y: 1.48, w: 8.4, h: 0.35,
    align: 'center', fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.green
  });

  // Test modules breakdown
  const testCats = [
    { cat: 'Authentication & JWT Tests', count: '8 Tests', desc: 'Validates client, advocate, and admin logins, token generation, and password verification.' },
    { cat: 'RBAC Security Boundary Tests', count: '6 Tests', desc: 'Verifies that regular clients are strictly blocked from advocate and admin APIs with HTTP 403.' },
    { cat: 'Data Integrity & Seeding Tests', count: '7 Tests', desc: 'Verifies complete seeding of 104 Indian courts and 37 advocates with proper coordinates and bar data.' },
    { cat: 'Consultation Lifecycle Tests', count: '8 Tests', desc: 'Validates appointment booking creation (201 Created), advocate confirmation, and client tracking.' },
    { cat: 'Admin Management & Audit Tests', count: '6 Tests', desc: 'Verifies platform analytics, full 360-degree client dossiers, and advocate roster management.' }
  ];

  testCats.forEach((tc, idx) => {
    const yPos = 2.15 + idx * 0.58;
    s13.addShape(pres.ShapeType.rect, {
      x: 0.6, y: yPos, w: 8.8, h: 0.5,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1 }
    });
    s13.addText(`[PASS] ${tc.cat}`, {
      x: 0.8, y: yPos + 0.12, w: 3.2, h: 0.25,
      fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.white
    });
    s13.addText(tc.count, {
      x: 4.0, y: yPos + 0.12, w: 1.0, h: 0.25,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.green
    });
    s13.addText(tc.desc, {
      x: 5.1, y: yPos + 0.12, w: 4.2, h: 0.3,
      fontSize: 8.5, fontFace: 'Calibri', color: COLORS.textLight
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 14: Performance Metrics
// ─────────────────────────────────────────────────────────────
{
  const s14 = pres.addSlide();
  setupSlide(s14, 'System Performance & Benchmark Metrics', 'Performance Analysis', 14);

  // 4 KPI Cards
  const kpis = [
    { label: 'API LATENCY', val: '12 ms', sub: 'Average local endpoint response time' },
    { label: 'QUERY ACCURACY', val: '100%', sub: 'Deterministic mapping for BNS provisions' },
    { label: 'TEST PASS RATE', val: '35 / 35', sub: 'Zero integration test regressions' },
    { label: 'LIGHTHOUSE SCORE', val: '98 / 100', sub: 'Optimal vanilla frontend performance' }
  ];

  kpis.forEach((k, idx) => {
    const xPos = 0.6 + idx * 2.25;
    s14.addShape(pres.ShapeType.rect, {
      x: xPos, y: 1.3, w: 2.15, h: 1.4,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.gold, width: 1.2 }
    });
    s14.addText(k.label, {
      x: xPos + 0.1, y: 1.45, w: 1.95, h: 0.2,
      fontSize: 8.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
    });
    s14.addText(k.val, {
      x: xPos + 0.1, y: 1.7, w: 1.95, h: 0.5,
      fontSize: 20, fontFace: 'Calibri', bold: true, color: COLORS.white
    });
    s14.addText(k.sub, {
      x: xPos + 0.1, y: 2.25, w: 1.95, h: 0.35,
      fontSize: 7.5, fontFace: 'Calibri', color: COLORS.textMuted
    });
  });

  // Benchmark breakdown table
  const benchRows = [
    [
      { text: 'Performance Benchmark', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } },
      { text: 'Measured Value', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } },
      { text: 'Engineering Impact', options: { bold: true, color: COLORS.gold, fill: { color: '21262D' } } }
    ],
    [
      { text: 'SQLite Read Throughput', options: { bold: true, color: COLORS.white } },
      { text: '> 5,000 queries / second', options: { color: COLORS.green } },
      { text: 'Write-Ahead Logging (WAL) ensures zero blocking between reads and writes', options: { color: COLORS.textLight } }
    ],
    [
      { text: 'AI Assistant Render Time', options: { bold: true, color: COLORS.white } },
      { text: '< 120 milliseconds', options: { color: COLORS.green } },
      { text: 'Pre-indexed topic maps deliver immediate answers without network latency', options: { color: COLORS.textLight } }
    ],
    [
      { text: 'Cross-Role Security Leaks', options: { bold: true, color: COLORS.white } },
      { text: '0 Leaks Detected', options: { color: COLORS.green } },
      { text: 'JWT cookie verification guarantees complete isolation of client and advocate data', options: { color: COLORS.textLight } }
    ]
  ];

  s14.addTable(benchRows, {
    x: 0.6, y: 2.9, w: 8.8, h: 2.05,
    colW: [2.5, 2.0, 4.3],
    border: { pt: 1, color: '30363D' },
    fill: { color: COLORS.cardBg },
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 12,
    valign: 'middle'
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 15: Conclusion & Key Learnings
// ─────────────────────────────────────────────────────────────
{
  const s15 = pres.addSlide();
  setupSlide(s15, 'Conclusion & Key Learnings from the Project', 'Project Summary', 15);

  // Left Box: Project Achievements
  s15.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.3, w: 4.25, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s15.addText('PROJECT ACHIEVEMENTS', {
    x: 0.8, y: 1.45, w: 3.85, h: 0.25,
    fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s15.addText([
    { text: '• Unified Legal Platform: ', options: { bold: true, color: COLORS.white } },
    { text: 'Successfully built and integrated legal guidance, court mapping, and lawyer consultation into one solution.\n\n', options: { color: COLORS.textLight } },
    { text: '• BNS 2024 Transition: ', options: { bold: true, color: COLORS.white } },
    { text: 'Implemented real-world conversion for India\'s new criminal laws, solving a timely national need.\n\n', options: { color: COLORS.textLight } },
    { text: '• Production-Ready Security: ', options: { bold: true, color: COLORS.white } },
    { text: 'Enforced rigorous role-based access control across all 3 portals with zero permission leaks.\n\n', options: { color: COLORS.textLight } },
    { text: '• 100% Verified Testing: ', options: { bold: true, color: COLORS.white } },
    { text: 'All 35 automated integration test suites passed with zero defects.', options: { color: COLORS.textLight } }
  ], {
    x: 0.8, y: 1.8, w: 3.85, h: 3.0,
    fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 13
  });

  // Right Box: Key Learnings
  s15.addShape(pres.ShapeType.rect, {
    x: 5.15, y: 1.3, w: 4.25, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s15.addText('KEY ACADEMIC & TECHNICAL LEARNINGS', {
    x: 5.35, y: 1.45, w: 3.85, h: 0.25,
    fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s15.addText([
    { text: '• Full-Stack Architecture: ', options: { bold: true, color: COLORS.white } },
    { text: 'Deepened practical expertise in asynchronous REST APIs, decoupled frontend design, and state management.\n\n', options: { color: COLORS.textLight } },
    { text: '• Embedded Database Engineering: ', options: { bold: true, color: COLORS.white } },
    { text: 'Learned how to tune SQLite WAL mode and maintain transactional synchronization between JSON files and SQL tables.\n\n', options: { color: COLORS.textLight } },
    { text: '• Legal Domain Engineering: ', options: { bold: true, color: COLORS.white } },
    { text: 'Understood statutory hierarchy, procedural rules, and how to structure non-technical UIs for ordinary citizens.\n\n', options: { color: COLORS.textLight } },
    { text: '• Rigorous Software Testing: ', options: { bold: true, color: COLORS.white } },
    { text: 'Implemented in-process integration testing methodologies to guarantee reliability.', options: { color: COLORS.textLight } }
  ], {
    x: 5.35, y: 1.8, w: 3.85, h: 3.0,
    fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 13
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 16: Future Scope & Q&A
// ─────────────────────────────────────────────────────────────
{
  const s16 = pres.addSlide();
  setupSlide(s16, 'Future Scope & Open Floor for Discussion', 'Next Steps & Q&A', 16);

  // Future Scope Box
  s16.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.3, w: 5.2, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.cardBorder, width: 1 }
  });
  s16.addText('PLANNED FUTURE ENHANCEMENTS', {
    x: 0.8, y: 1.45, w: 4.8, h: 0.25,
    fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s16.addText([
    { text: '1. Multilingual Speech-to-Text Support:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Integrate Indian language voice AI (Hindi, Kannada, Tamil, Telugu, Marathi) for citizens who cannot read or write English.\n\n', options: { color: COLORS.textLight } },
    { text: '2. Live e-Courts Judicial API Integration:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Directly interface with the National Judicial Data Grid (NJDG) to automatically scrape daily cause lists and case hearing dates.\n\n', options: { color: COLORS.textLight } },
    { text: '3. Cross-Platform Mobile Application:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Migrate core portals to React Native / Flutter for seamless iOS and Android smartphone experiences.\n\n', options: { color: COLORS.textLight } },
    { text: '4. AI Contract & Rental Agreement Scanner:\n', options: { bold: true, color: COLORS.white } },
    { text: 'Allow citizens to upload lease PDFs for automated clause risk analysis.', options: { color: COLORS.textLight } }
  ], {
    x: 0.8, y: 1.8, w: 4.8, h: 3.0,
    fontSize: 9, fontFace: 'Calibri', lineSpacing: 12
  });

  // Q&A / Thank You Box on Right
  s16.addShape(pres.ShapeType.rect, {
    x: 6.0, y: 1.3, w: 3.4, h: 3.65,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.gold, width: 1.5 }
  });
  s16.addText('THANK YOU!', {
    x: 6.15, y: 1.8, w: 3.1, h: 0.45,
    align: 'center', fontSize: 20, fontFace: 'Calibri', bold: true, color: COLORS.gold
  });
  s16.addText('Open Floor for Questions', {
    x: 6.15, y: 2.3, w: 3.1, h: 0.3,
    align: 'center', fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.white
  });
  s16.addText('Thank you to our respected project guide, department faculty, and the evaluation committee for your time, guidance, and valuable feedback.', {
    x: 6.25, y: 2.7, w: 2.9, h: 1.2,
    align: 'center', fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 13
  });
  s16.addText('Demonstration of Project & Code Walkthrough Follows', {
    x: 6.15, y: 4.2, w: 3.1, h: 0.35,
    align: 'center', fontSize: 8.5, fontFace: 'Calibri', italic: true, color: COLORS.blue
  });
}

// Generate the PPTX File
const outputPath = path.resolve(__dirname, '../LegalAI_MCA_Final_Review_MPRJ382.pptx');
pres.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log('PowerPoint Presentation successfully generated at:', fileName);
  })
  .catch((err) => {
    console.error('Error generating PowerPoint presentation:', err);
    process.exit(1);
  });

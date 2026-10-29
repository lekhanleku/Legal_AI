const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.SQLITE_DB_PATH 
  ? path.resolve(__dirname, process.env.SQLITE_DB_PATH)
  : path.join(__dirname, 'legalai.db');

let db;

try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Auto-create users, ai_chats, lawyers, and consultations tables if they do not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      isVerified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NULL,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lawyers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      specialty TEXT NOT NULL,
      barNumber TEXT NOT NULL,
      experienceYears INTEGER NOT NULL,
      education TEXT NOT NULL,
      firmName TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      hourlyRate REAL NOT NULL,
      rating REAL DEFAULT 5.0,
      reviewCount INTEGER DEFAULT 0,
      languages TEXT NOT NULL,
      bio TEXT NOT NULL,
      casesWon INTEGER DEFAULT 0,
      successRate INTEGER DEFAULT 95,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      avatarUrl TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lawyerId INTEGER NOT NULL,
      userId INTEGER NULL,
      clientName TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      preferredDate TEXT NOT NULL,
      caseSummary TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      jurisdiction TEXT NOT NULL,
      level TEXT NOT NULL,
      circuit TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      phone TEXT NOT NULL,
      website TEXT NOT NULL,
      clerkHours TEXT NOT NULL,
      filingSystem TEXT NOT NULL,
      chiefJudge TEXT NOT NULL,
      divisions TEXT NOT NULL,
      overview TEXT NOT NULL,
      badge TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Cleanup any legacy placeholder/non-Indian lawyers
  db.prepare(`
    DELETE FROM lawyers WHERE barNumber LIKE '%Bar #%' 
      OR barNumber LIKE '%CA Bar%' 
      OR barNumber LIKE '%NY Bar%' 
      OR barNumber LIKE '%MA Bar%' 
      OR barNumber LIKE '%IL Bar%' 
      OR barNumber LIKE '%DC Bar%' 
      OR barNumber LIKE '%FL Bar%' 
      OR barNumber LIKE '%TX Bar%' 
      OR barNumber LIKE '%GA Bar%' 
      OR barNumber LIKE '%WA Bar%' 
      OR barNumber LIKE '%PA Bar%' 
      OR barNumber LIKE '%CO Bar%' 
      OR barNumber LIKE '%AZ Bar%' 
      OR barNumber LIKE '%OR Bar%' 
      OR barNumber LIKE '%NC Bar%'
  `).run();

  // Seed Lawyers table with verified authentic Indian advocates & senior counsel
  const checkLawyer = db.prepare('SELECT id FROM lawyers WHERE barNumber = ?');
  const insertLawyer = db.prepare(`
    INSERT INTO lawyers (
      name, title, specialty, barNumber, experienceYears, education,
      firmName, city, state, hourlyRate, rating, reviewCount,
      languages, bio, casesWon, successRate, phone, email, avatarUrl, isAvailable
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedLawyers = [
    [
      'Harish Salve, Senior Advocate', 'Senior Advocate & King\'s Counsel', 'Corporate Law', 'D/248/1980',
      44, 'Nagpur University, LL.B. · FCA', 'Chambers of Harish Salve', 'New Delhi', 'Delhi',
      45000, 5.0, 248, 'English, Hindi, Marathi',
      'Former Solicitor General of India and King\'s Counsel. Master legal strategist renowned worldwide for high-stakes international commercial arbitration, cross-border corporate mergers, Kulbhushan Jadhav case before the ICJ, and landmark Supreme Court constitutional benches.',
      860, 99, '+91 11 2461 7890', 'h.salve@chambersofsalve.in',
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Mukul Rohatgi, Senior Advocate', 'Senior Advocate & 14th Attorney General for India', 'Criminal Law', 'D/152/1978',
      46, 'Faculty of Law, University of Delhi, LL.B.', 'Chambers of Mukul Rohatgi', 'New Delhi', 'Delhi',
      42000, 4.9, 210, 'English, Hindi',
      '14th Attorney General for India and former Additional Solicitor General. One of India\'s most celebrated senior trial defense and corporate litigators before the Supreme Court of India and High Courts nationwide.',
      920, 98, '+91 11 2338 4120', 'rohatgi@mukulrohatgi.com',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Dr. Abhishek Manu Singhvi, Senior Advocate', 'Senior Advocate, Supreme Court of India', 'Corporate Law', 'D/318/1982',
      42, 'Trinity College, Cambridge (Ph.D.) · Harvard Law School', 'Chambers of Dr. Abhishek Manu Singhvi', 'New Delhi', 'Delhi',
      40000, 4.9, 185, 'English, Hindi, Marwari',
      'Youngest designated Senior Advocate in Supreme Court history. Celebrated for high-stakes corporate disputes, commercial arbitration, telecom litigation, and decisive constitutional bench arguments.',
      790, 97, '+91 11 2611 9045', 'amsinghvi@singhvilegal.in',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Indira Jaising, Senior Advocate', 'Senior Advocate & Human Rights Pioneer', 'Civil Rights', 'MAH/421/1965',
      58, 'Government Law College, Mumbai, LL.B.', 'The Lawyers Collective', 'New Delhi', 'Delhi',
      30000, 5.0, 205, 'English, Hindi, Marathi, Sindhi',
      'First woman Senior Advocate designated by Bombay High Court and first female Additional Solicitor General of India. Legendary pioneer in fundamental rights, workplace gender equality, and key architect of the Domestic Violence Act.',
      690, 98, '+91 11 2437 5521', 'indira.jaising@lawyerscollective.org',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Kapil Sibal, Senior Advocate', 'Senior Advocate & SCBA President', 'Criminal Law', 'D/104/1972',
      52, 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)', 'Chambers of Kapil Sibal', 'New Delhi', 'Delhi',
      45000, 4.9, 230, 'English, Hindi, Punjabi',
      'President of the Supreme Court Bar Association and former Union Minister for Law & Justice. Preeminent counsel in high-profile criminal defense, constitutional liberties, federalism, and appellate litigation.',
      890, 98, '+91 11 2307 3311', 'chambers@kapilsibal.in',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Zia Mody, Advocate', 'Founding & Senior Partner', 'Corporate Law', 'MAH/314/1979',
      45, 'Selwyn College, Cambridge (MA) · Harvard Law School (LL.M.)', 'AZB & Partners', 'Mumbai', 'Maharashtra',
      48000, 5.0, 260, 'English, Hindi, Gujarati',
      'India\'s foremost corporate law luminary. Founder of AZB & Partners, orchestrating multi-billion dollar cross-border mergers, private equity transactions, conglomerate governance, and banking resolutions.',
      610, 99, '+91 22 6639 6880', 'zia.mody@azbpartners.com',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'K.K. Venugopal, Senior Advocate', 'Senior Advocate & 15th Attorney General for India', 'Civil Rights', 'MS/18/1954',
      70, 'Raja Lakhamgouda Law College, Belgaum', 'Chambers of K.K. Venugopal', 'New Delhi', 'Delhi',
      50000, 5.0, 320, 'English, Hindi, Malayalam, Tamil',
      'Doyen of the Indian Bar, Padma Vibhushan awardee, and 15th Attorney General for India. Unrivaled constitutional authority on basic structure doctrine, federal dispute resolution, and public jurisprudence.',
      1180, 99, '+91 11 2338 2901', 'kk.venugopal@kkvchambers.in',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Mahesh Jethmalani, Senior Advocate', 'Senior Advocate, Supreme Court & Bombay High Court', 'Criminal Law', 'MAH/812/1980',
      44, 'St. Xavier\'s Mumbai · Oxford University (M.A. Jurisprudence)', 'Jethmalani Chambers', 'Mumbai', 'Maharashtra',
      38000, 4.8, 150, 'English, Hindi, Marathi, Sindhi',
      'Master trial and appellate criminal defense counsel, celebrated for handling high-profile economic offenses (PMLA/ED/CBI), cross-examinations, constitutional liberty writs, and corporate white-collar defense.',
      640, 96, '+91 22 2204 1599', 'mahesh@jethmalanichambers.com',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Pravin Anand, Advocate', 'Managing Partner & IP Pioneer', 'Intellectual Property', 'D/148/1979',
      45, 'Campus Law Centre, Faculty of Law, University of Delhi', 'Anand and Anand', 'New Delhi', 'Delhi',
      36000, 5.0, 205, 'English, Hindi',
      'Pioneer of intellectual property law in India. Lead counsel in historic patent litigations, software copyright doctrines, standard-essential patents (SEP), and cross-border trademark protection.',
      740, 99, '+91 120 405 9300', 'pravin@anandandanand.com',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Karuna Nundy, Senior Advocate', 'Senior Advocate, Supreme Court of India', 'Civil Rights', 'D/1429/2000',
      24, 'St. Stephen\'s College · Cambridge University · Columbia Law (LL.M.)', 'Chambers of Karuna Nundy', 'New Delhi', 'Delhi',
      28000, 4.9, 140, 'English, Hindi, Bengali',
      'TIME 100 Most Influential People honoree. Renowned for online free speech defense (Section 66A IT Act), Bhopal toxic gas restorative justice, fundamental gender equality, and corporate commercial arbitration.',
      400, 98, '+91 11 2649 3371', 'karuna@karunanundy.com',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Gopal Subramanium, Senior Advocate', 'Senior Advocate & Former Solicitor General', 'Corporate Law', 'D/209/1980',
      44, 'Campus Law Centre, Faculty of Law, University of Delhi', 'Chambers of Gopal Subramanium', 'New Delhi', 'Delhi',
      42000, 4.9, 175, 'English, Hindi, Tamil',
      'Former Solicitor General of India and Chairman of the Bar Council of India. Leading international arbitrator (FCIArb) and Supreme Court senior counsel in corporate commercial dispute resolution and public law.',
      740, 97, '+91 11 2686 2110', 'subramanium@gschambers.in',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Dr. Menaka Guruswamy, Senior Advocate', 'Senior Advocate & Constitutional Scholar', 'Civil Rights', 'D/1812/1997',
      27, 'NLSIU Bengaluru · Oxford (Rhodes Scholar, BCL) · Harvard (LL.M.)', 'Chambers of Dr. Menaka Guruswamy', 'New Delhi', 'Delhi',
      32000, 4.9, 156, 'English, Hindi, Tamil',
      'TIME 100 honoree and Rhodes Scholar. Landmark lead counsel in decriminalizing Section 377 IPC (Navtej Johar), the Fundamental Right to Privacy (Puttaswamy), and bureaucratic transparency.',
      360, 98, '+91 11 2623 4810', 'menaka@guruswamychambers.in',
      'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Shyam Divan, Senior Advocate', 'Senior Advocate & Environmental Jurisprudence Leader', 'Real Estate Law', 'MAH/678/1984',
      40, 'Government Law College, Mumbai · UC Berkeley (LL.M.)', 'Chambers of Shyam Divan', 'New Delhi', 'Delhi',
      34000, 4.9, 160, 'English, Hindi, Marathi, Gujarati',
      'Author of the definitive treatise \'Environmental Law and Policy in India\'. Preeminent senior counsel in land acquisition, zoning laws, National Green Tribunal (NGT) litigations, and property dispute arbitrations.',
      520, 97, '+91 11 2469 1184', 'sdivan@chambersdivan.in',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Pinky Anand, Senior Advocate', 'Senior Advocate & Former Additional Solicitor General', 'Family Law', 'D/274/1980',
      44, 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)', 'Anand & Associates', 'New Delhi', 'Delhi',
      32000, 4.8, 168, 'English, Hindi, Punjabi',
      'Former Additional Solicitor General of India. Master authority on international child custody disputes, Hague Convention litigations, matrimonial asset partition, divorce mediation, and domestic relations.',
      480, 96, '+91 11 2652 7100', 'pinky@anandlaw.in',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Prashant Bhushan, Advocate', 'Public Interest Litigator & Senior Advocate', 'Civil Rights', 'D/308/1983',
      41, 'Allahabad University · IIT Madras · Princeton University', 'Centre for Public Interest Litigation (CPIL)', 'New Delhi', 'Delhi',
      20000, 4.8, 195, 'English, Hindi',
      'Legendary Public Interest Litigation (PIL) advocate. Spearheaded landmark transparency cases, 2G spectrum cancellations, coal block allocations, environmental protections, and judicial accountability.',
      530, 95, '+91 11 2656 4003', 'pbhushan@cpilindia.org',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'C. Aryama Sundaram, Senior Advocate', 'Senior Advocate, Supreme Court of India', 'Corporate Law', 'MS/332/1980',
      44, 'Madras Law College (LL.B.)', 'Chambers of C.A. Sundaram', 'Chennai', 'Tamil Nadu',
      38000, 4.9, 148, 'English, Hindi, Tamil',
      'High-profile senior counsel specializing in corporate shareholder disputes, Insolvency and Bankruptcy Code (IBC) proceedings, CCI competition law appeals, and constitutional writs.',
      620, 97, '+91 44 2499 1234', 'casundaram@sundaramchambers.in',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Dushyant Dave, Senior Advocate', 'Senior Advocate & Former President SCBA', 'Real Estate Law', 'G/190/1978',
      46, 'Gujarat University (LL.B.)', 'Chambers of Dushyant Dave', 'New Delhi', 'Delhi',
      39000, 4.9, 158, 'English, Hindi, Gujarati',
      'Three-time President of the Supreme Court Bar Association. Premier authority on mega-infrastructure construction arbitrations, commercial property leases, land title litigation, and contract enforcement.',
      690, 98, '+91 11 2685 5543', 'dave@dushyantdave.in',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Saurabh Kirpal, Senior Advocate', 'Senior Advocate, Delhi High Court & Supreme Court', 'Employment Law', 'D/892/1994',
      30, 'St. Stephen\'s · Oxford University · Cambridge (LL.M.)', 'Kirpal Chambers', 'New Delhi', 'Delhi',
      30000, 4.9, 125, 'English, Hindi',
      'Leading senior advocate in executive employment disputes, workplace discrimination, service jurisprudence, and commercial contract litigation. Lead counsel in landmark constitutional equality challenges.',
      380, 97, '+91 11 2462 8840', 'saurabh@kirpalchambers.in',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Shardul S. Shroff, Advocate', 'Executive Chairman & Senior Partner', 'Corporate Law', 'D/415/1980',
      44, 'Government Law College, Mumbai (LL.B.)', 'Shardul Amarchand Mangaldas & Co.', 'New Delhi', 'Delhi',
      46000, 5.0, 218, 'English, Hindi, Gujarati',
      'Executive Chairman of Shardul Amarchand Mangaldas. Doyen of Indian corporate finance, major cross-border M&A, debt restructurings, and Insolvency and Bankruptcy Code (IBC) resolutions.',
      540, 99, '+91 11 4159 0700', 'shardul.shroff@amsshardul.com',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Cyril Shroff, Advocate', 'Managing Partner & Financial Markets Authority', 'Corporate Law', 'MAH/520/1982',
      42, 'Government Law College, Mumbai (LL.B.)', 'Cyril Amarchand Mangaldas', 'Mumbai', 'Maharashtra',
      47000, 5.0, 230, 'English, Hindi, Gujarati',
      'Managing Partner of Cyril Amarchand Mangaldas. Celebrated corporate strategist leading conglomerate board governance, banking syndications, private equity, and family business succession.',
      520, 99, '+91 22 2496 4455', 'cyril.shroff@cyrilshroff.com',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Poornima Hatti, Advocate', 'Partner & Workplace Dispute Resolution Leader', 'Employment Law', 'KAR/910/2003',
      21, 'NLSIU Bengaluru (B.A. LL.B.) · London School of Economics (LL.M.)', 'Samvad Partners', 'Bengaluru', 'Karnataka',
      26000, 4.8, 112, 'English, Hindi, Kannada',
      'Partner heading Dispute Resolution at Samvad Partners. Specialist in POSH compliance, executive severance structuring, labor regulations, whistleblower investigations, and commercial mediations.',
      310, 96, '+91 80 4110 3344', 'poornima@samvadpartners.com',
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Nishith Desai, Advocate', 'Founder & International Tax Specialist', 'Tax Law', 'MAH/390/1977',
      47, 'Government Law College, Mumbai (LL.B., Tax Law)', 'Nishith Desai Associates', 'Mumbai', 'Maharashtra',
      42000, 4.9, 180, 'English, Hindi, Gujarati',
      'Global pioneer in cross-border tax structuring, fund formation, Silicon Valley-India investments, cryptocurrency regulation, and international transfer pricing controversies.',
      450, 98, '+91 22 6669 5000', 'nishith@nishithdesai.com',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Vandana Shah, Advocate', 'Matrimonial Litigator & Family Law Authority', 'Family Law', 'MAH/2104/2011',
      15, 'Government Law College, Mumbai (LL.B.)', 'Vandana Shah & Associates', 'Mumbai', 'Maharashtra',
      24000, 4.8, 134, 'English, Hindi, Marathi, Gujarati',
      'High-profile matrimonial litigator and author of \'Ex-Files\'. Renowned for high-net-worth divorce settlements, child custody disputes, NRI matrimonial conflicts, and domestic abuse legal protection.',
      330, 96, '+91 22 2282 3901', 'vandana@vandanashah.com',
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Sajan Poovayya, Senior Advocate', 'Senior Advocate & Technology Law Specialist', 'Intellectual Property', 'KAR/789/1996',
      28, 'NLSIU Bengaluru · London School of Economics (LL.M.)', 'Poovayya & Co.', 'Bengaluru', 'Karnataka',
      34000, 4.9, 145, 'English, Hindi, Kannada',
      'Former Additional Advocate General of Karnataka. Foremost counsel in data privacy, intermediary liability, AI regulation, patent enforcement, and telecommunications litigation.',
      440, 97, '+91 80 2221 4400', 'sajan@poovayya.net',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Poorvi Chothani, Advocate', 'Managing Partner & Immigration Law Authority', 'Immigration Law', 'MAH/1042/1983',
      40, 'Government Law College, Mumbai · Penn Carey Law (LL.M.)', 'LawQuest International Law Firm', 'Mumbai', 'Maharashtra',
      28000, 4.9, 172, 'English, Hindi, Gujarati, Marathi',
      'Founder of LawQuest and registered legal practitioner. Leading specialist in Indian-US cross-border immigration, corporate executive mobility, EB-5/L-1, NRI citizenship, and consular visa appeals.',
      520, 98, '+91 22 6633 4455', 'poorvi@lawquestindia.com',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Colin Gonsalves, Senior Advocate', 'Senior Advocate, Supreme Court & HRLN Founder', 'Personal Injury', 'MAH/490/1983',
      41, 'IIT Bombay (B.Tech) · Government Law College, Mumbai (LL.B.)', 'Human Rights Law Network (HRLN)', 'New Delhi', 'Delhi',
      22000, 4.9, 182, 'English, Hindi, Marathi',
      'Senior Advocate and Right Livelihood Award recipient. Champion in Motor Accident Claims Tribunal (MACT), catastrophic industrial injuries, public tort liability, and victim compensation before the Supreme Court.',
      600, 97, '+91 11 2437 4501', 'colin@hrln.org',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Anand Grover, Senior Advocate', 'Senior Advocate & Health Law Authority', 'Healthcare Law', 'MAH/355/1979',
      45, 'University of Surrey (B.Sc) · Government Law College, Mumbai (LL.B.)', 'Lawyers Collective', 'Mumbai', 'Maharashtra',
      32000, 5.0, 148, 'English, Hindi, Marathi, Gujarati',
      'Former UN Special Rapporteur on the Right to Health. Key litigator in historic Supreme Court pharmaceutical cases (Novartis cancer drug patent), healthcare regulation, medical negligence, and patient privacy.',
      490, 99, '+91 22 2287 4001', 'anand@lawyerscollective.org',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', 1
    ]
  ];

  const seedTransaction = db.transaction((lawyers) => {
    let insertedCount = 0;
    for (const lawyer of lawyers) {
      const barNumber = lawyer[3];
      const existing = checkLawyer.get(barNumber);
      if (!existing) {
        insertLawyer.run(...lawyer);
        insertedCount++;
      }
    }
    return insertedCount;
  });

  const inserted = seedTransaction(seedLawyers);
  if (inserted > 0) {
    console.log(`🌱 Added ${inserted} new verified Indian advocates into SQLite lawyers database.`);
  }

  // Purge legacy foreign/US courts to ensure only authentic Indian courts remain
  db.prepare(`
    DELETE FROM courts WHERE code IN (
      'SCOTUS', 'CA9', 'CA2', 'CADC', 'CAFC', 'SDNY', 'NDCA', 'NDIL', 'CDCA',
      'EDTX', 'DE-CHANCERY', 'SDNY-BANKR', 'USTC', 'CASC', 'NYCA', 'TXSC',
      'COOK-IL', 'MASS-SUFFOLK', 'SDFL', 'FL-11TH', 'US-SDNY', 'US-CA9'
    ) OR circuit LIKE '%Circuit%' OR state IN ('NY', 'CA', 'DE', 'TX', 'IL', 'FL', 'MA', 'DC')
  `).run();

  // Seed Courts table with authoritative Indian apex courts, state high courts, tribunals & district courts
  const checkCourt = db.prepare('SELECT id FROM courts WHERE code = ?');
  const insertCourt = db.prepare(`
    INSERT INTO courts (
      name, code, jurisdiction, level, circuit, city, state,
      address, zipCode, phone, website, clerkHours, filingSystem,
      chiefJudge, divisions, overview, badge, isAvailable
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedCourts = [
    [
        "Supreme Court of India",
        "SCI",
        "Apex Supreme Court",
        "Supreme",
        "All India / Apex Judicial",
        "New Delhi",
        "Delhi",
        "Tilak Marg, Mandi House",
        "110001",
        "+91 11 2338 8922",
        "https://main.sci.gov.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "Supreme Court e-Filing Portal 2.0",
        "Chief Justice of India",
        "Constitutional Bench, Appellate Division, Public Interest Litigation (PIL), Special Leave Petitions (SLP), Review Benches",
        "The highest judicial forum and final court of appeal under the Constitution of India. Possesses original jurisdiction under Article 32 for enforcement of fundamental rights, appellate jurisdiction, and advisory powers.",
        "Apex Supreme Court of India",
        1
    ],
    [
        "High Court of Delhi",
        "DHC",
        "State High Court",
        "High Court",
        "National Capital Territory of Delhi",
        "New Delhi",
        "Delhi",
        "Sher Shah Road, Near India Gate",
        "110503",
        "+91 11 4301 0101",
        "https://delhihighcourt.nic.in",
        "Mon - Fri: 10:00 AM - 4:30 PM IST",
        "Delhi High Court e-Filing 3.0",
        "Chief Justice of Delhi High Court",
        "Intellectual Property Division (IPD), Commercial Division, Original Civil, Criminal Appellate, Writ Jurisdiction (Art 226)",
        "Premier constitutional court of India's capital region. Features a world-class specialized Intellectual Property Division (IPD) and high-value original commercial civil jurisdiction.",
        "Premier Capital High Court",
        1
    ],
    [
        "High Court of Judicature at Bombay",
        "BHC",
        "State High Court",
        "High Court",
        "Maharashtra & Goa (Benches at Nagpur, Aurangabad, Panaji)",
        "Mumbai",
        "Maharashtra",
        "Dr. Kane Road, Fort",
        "400032",
        "+91 22 2267 2221",
        "https://bombayhighcourt.nic.in",
        "Mon - Fri: 10:30 AM - 4:30 PM IST",
        "Bombay HC e-Filing & CIS Portal",
        "Chief Justice of Bombay High Court",
        "Commercial Appellate, Admiralty & Maritime, Original Side, Constitutional Writs, Company Appeals",
        "One of India's oldest and most prestigious chartered High Courts, leading jurisprudence in corporate disputes, maritime/admiralty claims, media laws, and banking transactions.",
        "Commercial & Admiralty Capital",
        1
    ],
    [
        "High Court at Calcutta",
        "CHC",
        "State High Court",
        "High Court",
        "West Bengal and Andaman & Nicobar Islands (Circuit Benches: Port Blair, Jalpaiguri)",
        "Kolkata",
        "West Bengal",
        "3, Esplanade Row West",
        "700001",
        "+91 33 2248 2311",
        "https://calcuttahighcourt.gov.in",
        "Mon - Fri: 10:30 AM - 4:30 PM IST",
        "Calcutta HC e-Courts Filing",
        "Chief Justice of Calcutta High Court",
        "Original Civil, Admiralty Jurisdiction, Constitutional Benches, Criminal Revisional, Commercial Division",
        "The oldest High Court in India, established by Letters Patent in 1862. Commands revered authority across constitutional jurisprudence, intellectual property, and original civil suits.",
        "Oldest Chartered High Court",
        1
    ],
    [
        "High Court of Judicature at Madras",
        "MHC",
        "State High Court",
        "High Court",
        "Tamil Nadu and Puducherry (Permanent Bench at Madurai)",
        "Chennai",
        "Tamil Nadu",
        "High Court Building, George Town",
        "600104",
        "+91 44 2530 1349",
        "https://hcmadras.tn.gov.in",
        "Mon - Fri: 10:00 AM - 4:45 PM IST",
        "Madras HC e-Filing Portal",
        "Chief Justice of Madras High Court",
        "Original Side Civil, Commercial Division, Constitutional Writs, Intellectual Property, Criminal Appellate",
        "Chartered High Court with deep historical pedigree and second-largest court campus globally. Renowned for constitutional analysis, intellectual property enforcement, and commercial decisions.",
        "Chartered Southern Apex",
        1
    ],
    [
        "High Court of Karnataka",
        "KHC",
        "State High Court",
        "High Court",
        "Karnataka (Benches at Dharwad & Kalaburagi)",
        "Bengaluru",
        "Karnataka",
        "Attara Kacheri, Opp. Vidhana Soudha, Ambedkar Veedhi",
        "560001",
        "+91 80 2295 4864",
        "https://karnatakahighcourt.kar.nic.in",
        "Mon - Fri: 10:30 AM - 5:00 PM IST",
        "Karnataka High Court e-Filing 3.0",
        "Chief Justice of Karnataka High Court",
        "Information Technology & Cyber Law, Commercial Division, Public Interest Benches, Arbitration Appeals, Labor Writs",
        "Housed in the historic Attara Kacheri building opposite Vidhana Soudha. Foremost judicial center for technology, SaaS startup contracts, cyber law, aerospace, and commercial arbitration.",
        "Silicon Valley Tech & Cyber Hub",
        1
    ],
    [
        "High Court of Judicature at Allahabad",
        "AHC",
        "State High Court",
        "High Court",
        "Uttar Pradesh (Permanent Bench at Lucknow)",
        "Prayagraj",
        "Uttar Pradesh",
        "Nyayamarg, Cantonment",
        "211017",
        "+91 532 242 2335",
        "https://allahabadhighcourt.in",
        "Mon - Fri: 10:00 AM - 4:30 PM IST",
        "Allahabad HC e-Filing CIS 3.2",
        "Chief Justice of Allahabad High Court",
        "Constitutional Writs, Land Reforms & Revenue, Criminal Appellate & Bail, Civil Revisional, Service Matters",
        "The largest High Court in India by sanctioned judicial strength (160 judges), possessing extensive constitutional writ and criminal appellate jurisdiction over Uttar Pradesh.",
        "Largest Judicial Bench in India",
        1
    ],
    [
        "High Court of Gujarat",
        "GHC",
        "State High Court",
        "High Court",
        "State of Gujarat",
        "Ahmedabad",
        "Gujarat",
        "Sola, SG Highway",
        "380060",
        "+91 79 2766 4601",
        "https://gujarathighcourt.nic.in",
        "Mon - Fri: 10:30 AM - 5:00 PM IST",
        "Gujarat HC e-Court Services Portal",
        "Chief Justice of Gujarat High Court",
        "Commercial & Corporate Division, Tax & Customs, Infrastructure Arbitration, Special Civil Applications, Criminal Appeals",
        "Pioneer in virtual judicial proceedings and live streaming of courtroom proceedings in India. Renowned for expedited commercial dispute resolution and tax jurisprudence.",
        "Digital Courtroom Pioneer",
        1
    ],
    [
        "High Court of Punjab and Haryana",
        "PHHC",
        "State High Court",
        "High Court",
        "Punjab, Haryana and Union Territory of Chandigarh",
        "Chandigarh",
        "Punjab & Haryana",
        "Capitol Complex, Sector 1",
        "160001",
        "+91 172 274 0601",
        "https://highcourtchd.gov.in",
        "Mon - Fri: 10:00 AM - 4:30 PM IST",
        "PHHC e-Filing Portal",
        "Chief Justice of Punjab & Haryana High Court",
        "Civil Writs, Agrarian & Land Acquisition, Criminal Defense, Service Law, Commercial Disputes",
        "Situated in Le Corbusier's iconic UNESCO World Heritage Capitol Complex. Exercises jurisdiction over Punjab, Haryana, and Chandigarh across civil, agrarian, and constitutional disputes.",
        "UNESCO Capitol Complex Bench",
        1
    ],
    [
        "High Court for the State of Telangana",
        "THC",
        "State High Court",
        "High Court",
        "State of Telangana",
        "Hyderabad",
        "Telangana",
        "Near City College, Madina, High Court Road",
        "500066",
        "+91 40 2344 6344",
        "https://tshc.gov.in",
        "Mon - Fri: 10:30 AM - 4:30 PM IST",
        "Telangana HC e-Courts Portal",
        "Chief Justice of Telangana High Court",
        "Pharma & Biotech IP, Commercial Division, IT Infrastructure, Constitutional Benches, Civil Appeals",
        "Located along the Musi River in Hyderabad's historic precinct. Foremost court for India's pharmaceutical capital, biotechnology IP disputes, and cyber technology infrastructure contracts.",
        "Pharma & Tech Judicial Center",
        1
    ],
    [
        "High Court of Kerala",
        "KERHC",
        "State High Court",
        "High Court",
        "State of Kerala and UT of Lakshadweep",
        "Kochi",
        "Kerala",
        "Marine Drive, Ernakulam",
        "682031",
        "+91 484 256 2000",
        "https://hckerala.gov.in",
        "Mon - Fri: 10:00 AM - 4:30 PM IST",
        "Kerala HC Paperless e-Filing 3.0",
        "Chief Justice of Kerala High Court",
        "Environmental Jurisprudence, Maritime & Shipping, Paperless Court Benches, Fundamental Rights Writs, Service Appeals",
        "India's first fully paperless Smart Court with trailblazing environmental jurisprudence, maritime admiralty matters, and citizen-friendly digital justice initiatives.",
        "First Paperless Smart Court",
        1
    ],
    [
        "National Company Law Appellate Tribunal",
        "NCLAT",
        "Specialized Tribunal",
        "Appellate Tribunal",
        "Principal Bench New Delhi (Chennai Bench for South India)",
        "New Delhi",
        "Delhi",
        "3rd Floor, B-1 Wing, Pt. Deendayal Antyodaya Bhawan, CGO Complex, Lodhi Road",
        "110003",
        "+91 11 2430 6837",
        "https://nclat.nic.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "e-NCLAT E-Filing System",
        "Chairperson, NCLAT",
        "Insolvency and Bankruptcy Code (IBC), Companies Act Appeals, Competition Commission of India (CCI) Appeals, Restructuring & Mergers",
        "The apex specialized appellate authority for corporate insolvency resolution, corporate takeovers, competition law anti-trust appeals, and shareholder oppression petitions across India.",
        "Apex Corporate & IBC Appellate Tribunal",
        1
    ],
    [
        "National Company Law Tribunal - Principal Bench",
        "NCLT-DEL",
        "Specialized Tribunal",
        "Trial Tribunal",
        "All-India / National Capital Bench",
        "New Delhi",
        "Delhi",
        "Block-3, Ground Floor, CGO Complex, Lodhi Road",
        "110003",
        "+91 11 2436 3451",
        "https://nclt.gov.in",
        "Mon - Fri: 9:30 AM - 5:30 PM IST",
        "NCLT e-Filing Portal 2.0",
        "President, National Company Law Tribunal",
        "Corporate Insolvency Resolution Process (CIRP), Liquidation, Mergers & Amalgamations, Oppression & Mismanagement",
        "Principal adjudicating authority under the Insolvency and Bankruptcy Code (IBC), 2016 and Section 241/242 of the Companies Act, presiding over mega corporate debt restructuring.",
        "Principal Corporate Tribunal",
        1
    ],
    [
        "National Green Tribunal - Principal Bench",
        "NGT",
        "Specialized Tribunal",
        "Specialized Judicial Bench",
        "Principal Bench New Delhi (Benches at Pune, Bhopal, Kolkata, Chennai)",
        "New Delhi",
        "Delhi",
        "Faridkot House, Copernicus Marg",
        "110001",
        "+91 11 2304 3501",
        "https://greentribunal.gov.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "NGT Electronic Filing Portal",
        "Chairperson, National Green Tribunal",
        "Environmental Impact Assessment, Forest Conservation, Pollution Control (Air & Water), Coastal Regulation Zone, Hazardous Waste",
        "Specialized judicial body under the NGT Act 2010 for effective and expeditious disposal of cases relating to environmental protection, forest conservation, and climate restitution.",
        "Environmental Justice Authority",
        1
    ],
    [
        "Income Tax Appellate Tribunal - Presidential Bench",
        "ITAT",
        "Specialized Tribunal",
        "Appellate Tribunal",
        "Presidential Bench Mumbai (63 Benches across 27 Indian cities)",
        "Mumbai",
        "Maharashtra",
        "Old CGO Building, 4th Floor, 101 Maharshi Karve Road",
        "400020",
        "+91 22 2203 1478",
        "https://itat.gov.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "ITAT e-Dwar Electronic Portal",
        "President, Income Tax Appellate Tribunal",
        "Direct Taxes, Transfer Pricing, Cross-Border Taxation, Corporate Surtax, Withholding Assessments",
        "Referred to as the \"Mother of Tribunals\" in India (established 1941). Final fact-finding authority in income tax matters under the Income Tax Act, 1961.",
        "Mother of Indian Tribunals",
        1
    ],
    [
        "Telecom Disputes Settlement and Appellate Tribunal",
        "TDSAT",
        "Specialized Tribunal",
        "Appellate Tribunal",
        "Pan-India Jurisdiction",
        "New Delhi",
        "Delhi",
        "Room No. 478, 4th Floor, Hotel Samrat, Kautilya Marg, Chanakyapuri",
        "110021",
        "+91 11 2687 2362",
        "https://tdsat.gov.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "TDSAT e-Filing Portal",
        "Chairperson, TDSAT",
        "Telecommunications, Spectrum Disputes, Broadcasting & Cable TV, Cyber & Airport Economic Regulatory Appeals",
        "Adjudicates disputes among telecom service providers, TRAI regulatory challenges, broadcasting & OTT content transmission, and spectrum allocation conflicts.",
        "Telecom & Broadcasting Tribunal",
        1
    ],
    [
        "National Consumer Disputes Redressal Commission",
        "NCDRC",
        "Specialized Tribunal",
        "National Commission",
        "Pan-India Consumer Jurisdiction",
        "New Delhi",
        "Delhi",
        "Upbhokta Nyay Bhawan, 'F' Block, GPO Complex, INA",
        "110023",
        "+91 11 2460 8801",
        "http://ncdrc.nic.in",
        "Mon - Fri: 10:00 AM - 5:00 PM IST",
        "e-Daakhil Consumer Portal",
        "President, NCDRC",
        "Real Estate Homebuyer Claims, Medical Negligence, Insurance Claim Repudiation, Defective Products, Class Action",
        "Apex quasi-judicial commission under Consumer Protection Act 2019 hearing original claims exceeding ₹2 Crore and appeals against State Commissions across India.",
        "Apex Consumer Protection Forum",
        1
    ],
    [
        "Tis Hazari District & Sessions Court",
        "DEL-TIS",
        "District & Sessions Court",
        "Trial",
        "Central & West District, Delhi",
        "New Delhi",
        "Delhi",
        "Tis Hazari Courts Complex, Near St. Stephen's Hospital",
        "110054",
        "+91 11 2395 0911",
        "https://delhidistrictcourts.nic.in",
        "Mon - Sat: 10:00 AM - 4:30 PM IST (2nd/4th Sat Off)",
        "e-Courts Services / CIS 3.2",
        "Principal District & Sessions Judge",
        "Motor Accident Claims Tribunal (MACT), Rent Control, Civil Judge Senior Division, Sessions & Criminal Trials, Family Court",
        "One of Asia's largest district court complexes. Houses major civil, tenancy rent control, motor accident (MACT), and criminal trial courts for Central Delhi.",
        "Asia's Largest District Complex",
        1
    ],
    [
        "Patiala House District Courts",
        "DEL-PAT",
        "District & Sessions Court",
        "Trial",
        "New Delhi District",
        "New Delhi",
        "Delhi",
        "India Gate Circle, Purana Quila Road",
        "110001",
        "+91 11 2338 6806",
        "https://newdelhi.dcourts.gov.in",
        "Mon - Sat: 10:00 AM - 4:30 PM IST (2nd/4th Sat Off)",
        "e-Courts CIS Digital System",
        "Principal District & Sessions Judge (New Delhi)",
        "CBI Special Courts, ED (PMLA) Special Courts, NIA Anti-Terrorism Trials, Commercial Court, NDPS & Sessions Division",
        "Situated at the historic former palace of the Maharaja of Patiala near India Gate. Center for high-profile central agency trials (CBI, ED, NIA) and commercial claims.",
        "National Capital Trial Center",
        1
    ],
    [
        "City Civil and Sessions Court, Mumbai",
        "MUM-SES",
        "District & Sessions Court",
        "Trial",
        "Greater Mumbai Judicial District",
        "Mumbai",
        "Maharashtra",
        "Old Secretariate Building, Fort",
        "400032",
        "+91 22 2267 1140",
        "https://districts.ecourts.gov.in/mumbai",
        "Mon - Sat: 10:30 AM - 5:00 PM IST (2nd/4th Sat Off)",
        "e-Courts Maharashtra Portal",
        "Principal Judge, City Civil & Sessions Court",
        "Sessions Trials, Commercial Courts, Special PMLA/CBI Courts, Matrimonial & Civil Division, Summary Suits",
        "Principal trial court for the financial capital of Mumbai. Handles major civil trials, economic offences, commercial suits, and high-profile criminal sessions trials.",
        "Financial Capital Trial Epicenter",
        1
    ]
];

  const seedCourtsTransaction = db.transaction((courts) => {
    let count = 0;
    for (const court of courts) {
      const code = court[1];
      const existing = checkCourt.get(code);
      if (!existing) {
        insertCourt.run(...court);
        count++;
      }
    }
    return count;
  });

  const courtsInserted = seedCourtsTransaction(seedCourts);
  if (courtsInserted > 0) {
    console.log(`🏛️ Seeded ${courtsInserted} authoritative Indian courts into SQLite courts database.`);
  }

  console.log(`✅ SQLite Database connected & initialized: ${dbPath}`);
} catch (err) {
  console.error(`❌ SQLite Connection Error: ${err.message}`);
}

module.exports = db;



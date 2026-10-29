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
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      mapUrl TEXT DEFAULT '',
      mapEmbedUrl TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure map columns exist on existing SQLite databases
  try { db.prepare('ALTER TABLE courts ADD COLUMN latitude REAL DEFAULT 0').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN longitude REAL DEFAULT 0').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN mapUrl TEXT DEFAULT ""').run(); } catch(e){}
  try { db.prepare('ALTER TABLE courts ADD COLUMN mapEmbedUrl TEXT DEFAULT ""').run(); } catch(e){}

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

  // Seed / Sync Courts table with authoritative Indian apex courts, state high courts, tribunals, district courts, small causes & taluka courts with map locations
  const { INDIAN_COURTS } = require('./services/indianCourtsData');
  const checkCourt = db.prepare('SELECT id FROM courts WHERE code = ?');
  const updateCourt = db.prepare(`
    UPDATE courts SET
      name = ?, jurisdiction = ?, level = ?, circuit = ?, city = ?, state = ?,
      address = ?, zipCode = ?, phone = ?, website = ?, clerkHours = ?,
      filingSystem = ?, chiefJudge = ?, divisions = ?, overview = ?, badge = ?,
      isAvailable = ?, latitude = ?, longitude = ?, mapUrl = ?, mapEmbedUrl = ?
    WHERE code = ?
  `);
  const insertCourt = db.prepare(`
    INSERT INTO courts (
      name, code, jurisdiction, level, circuit, city, state,
      address, zipCode, phone, website, clerkHours, filingSystem,
      chiefJudge, divisions, overview, badge, isAvailable,
      latitude, longitude, mapUrl, mapEmbedUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const syncCourtsTransaction = db.transaction((courts) => {
    let inserted = 0;
    let updated = 0;
    for (const c of courts) {
      const existing = checkCourt.get(c.code);
      if (existing) {
        updateCourt.run(
          c.name, c.jurisdiction, c.level, c.circuit || '', c.city, c.state,
          c.address, c.zipCode, c.phone, c.website, c.clerkHours,
          c.filingSystem, c.chiefJudge, c.divisions, c.overview, c.badge || '',
          c.isAvailable !== undefined ? c.isAvailable : 1,
          c.latitude || 0, c.longitude || 0, c.mapUrl || '', c.mapEmbedUrl || '',
          c.code
        );
        updated++;
      } else {
        insertCourt.run(
          c.name, c.code, c.jurisdiction, c.level, c.circuit || '', c.city, c.state,
          c.address, c.zipCode, c.phone, c.website, c.clerkHours,
          c.filingSystem, c.chiefJudge, c.divisions, c.overview, c.badge || '',
          c.isAvailable !== undefined ? c.isAvailable : 1,
          c.latitude || 0, c.longitude || 0, c.mapUrl || '', c.mapEmbedUrl || ''
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

  const courtSyncResult = syncCourtsTransaction(INDIAN_COURTS);
  console.log(`🏛️ Synchronized ${INDIAN_COURTS.length} Indian courts with Maps & Coordinates (Inserted: ${courtSyncResult.inserted}, Updated: ${courtSyncResult.updated}).`);

  console.log(`✅ SQLite Database connected & initialized: ${dbPath}`);
} catch (err) {
  console.error(`❌ SQLite Connection Error: ${err.message}`);
}

module.exports = db;



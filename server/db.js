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

  // Seed Lawyers table with verified attorneys
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
      'Sarah Jenkins, Esq.', 'Senior Partner', 'Corporate Law', 'NY Bar #5492810',
      16, 'Harvard Law School, J.D.', 'Jenkins & Associates PC', 'New York', 'NY',
      350, 4.9, 128, 'English, French',
      'Specializing in corporate governance, startup funding, contracts, and cross-border mergers with over 16 years of legal excellence.',
      420, 98, '(212) 555-0192', 's.jenkins@jenkinslaw.com',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Marcus Vance, J.D.', 'Managing Attorney', 'Criminal Law', 'CA Bar #284719',
      14, 'Stanford Law School, J.D.', 'Vance Legal Group', 'San Francisco', 'CA',
      320, 4.9, 94, 'English, Spanish',
      'Veteran criminal defense attorney dedicated to constitutional rights defense, white-collar litigation, and state & federal trial defense.',
      310, 96, '(415) 555-0148', 'marcus@vancelaw.com',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Elena Rostova, LL.M.', 'Lead Patent Counsel', 'Intellectual Property', 'MA Bar #618294',
      11, 'Columbia Law School, J.D.', 'Rostova IP Law', 'Boston', 'MA',
      380, 5.0, 82, 'English, Russian, German',
      'Expert in technology patents, software copyrighting, trademark defense, and AI IP licensing for global enterprises and biotech firms.',
      245, 99, '(617) 555-0177', 'elena@rostova-ip.com',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'David Chen, Esq.', 'Family & Mediation Specialist', 'Family Law', 'IL Bar #492815',
      12, 'Northwestern Pritzker Law, J.D.', 'Chen & Partners', 'Chicago', 'IL',
      290, 4.8, 115, 'English, Mandarin',
      'Compassionate advocate for high-asset divorce, child custody disputes, prenuptial agreements, and family mediation proceedings.',
      380, 94, '(312) 555-0133', 'dchen@chenfamilylaw.com',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Amara Okafor, J.D.', 'Principal Attorney', 'Employment Law', 'DC Bar #382910',
      15, 'Georgetown Law, J.D.', 'Okafor Labor Law', 'Washington', 'DC',
      340, 4.9, 106, 'English, Igbo',
      'Fierce protector of employee rights, specializing in wrongful termination, whistleblower claims, discrimination, and executive contracts.',
      390, 97, '(202) 555-0165', 'amara@okaforlaborlaw.com',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Carlos Gutierrez, Esq.', 'Senior Immigration Counsel', 'Immigration Law', 'FL Bar #739201',
      13, 'University of Miami Law, J.D.', 'Gutierrez Law Firm', 'Miami', 'FL',
      275, 4.9, 140, 'English, Spanish, Portuguese',
      'Extensive record assisting families and corporations with investor visas, green cards, deportation defense, and naturalization.',
      510, 98, '(305) 555-0129', 'c.gutierrez@glawmiami.com',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Rachel Sterling, Esq.', 'Zoning & Development Partner', 'Real Estate Law', 'TX Bar #849201',
      18, 'University of Texas Law, J.D.', 'Sterling Real Estate Law', 'Austin', 'TX',
      360, 4.8, 78, 'English',
      'Representing real estate developers, commercial landlords, and buyers in zoning disputes, acquisitions, and title litigation.',
      290, 95, '(512) 555-0182', 'rachel@sterlingre-law.com',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Jonathan Hayes, J.D.', 'Senior Litigator', 'Civil Rights', 'GA Bar #194820',
      10, 'Vanderbilt Law School, J.D.', 'Hayes Civil Rights Group', 'Atlanta', 'GA',
      310, 4.9, 92, 'English',
      'Dedicated trial lawyer handling police misconduct, 1983 civil rights claims, first amendment litigation, and complex personal injury cases.',
      330, 96, '(404) 555-0114', 'jhayes@hayesinjury.com',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Maya Lin, J.D.', 'Principal IP & AI Strategist', 'Intellectual Property', 'CA Bar #341908',
      13, 'Stanford Law School, J.D.', 'Lin Technology Law Group', 'Palo Alto', 'CA',
      395, 4.9, 87, 'English, Mandarin',
      'Pioneering intellectual property counsel advising generative AI founders, semiconductor developers, and tech giants on global patent portfolios and licensing.',
      210, 98, '(650) 555-0188', 'maya@lintechlaw.com',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Alexander Wright, Esq.', 'Senior M&A & Securities Counsel', 'Corporate Law', 'NY Bar #4829103',
      19, 'Columbia Law School, J.D.', 'Wright, Sterling & Cole LLP', 'New York', 'NY',
      425, 5.0, 152, 'English',
      'Two decades orchestrating multi-billion dollar mergers, private equity acquisitions, SEC compliance, and corporate restructurings for Fortune 500 enterprises.',
      480, 99, '(212) 555-0144', 'awright@wrightlaw.com',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Priya Sharma, LL.M.', 'Director of Business Immigration', 'Immigration Law', 'WA Bar #59281',
      12, 'UC Berkeley School of Law, LL.M.', 'Sharma Global Immigration PC', 'Seattle', 'WA',
      285, 4.9, 168, 'English, Hindi, Punjabi',
      'Specializing in H-1B, L-1, O-1 extraordinary ability visas, and corporate cross-border immigration pathways for top tech engineers and global executives.',
      580, 97, '(206) 555-0162', 'priya@sharmaimmigration.com',
      'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Robert "Bob" Callahan, Esq.', 'Lead Trial Defense Attorney', 'Criminal Law', 'MA Bar #519284',
      22, 'Boston College Law, J.D.', 'Callahan Criminal Trial Group', 'Boston', 'MA',
      340, 4.8, 210, 'English, Irish',
      'Former assistant district attorney now providing aggressive criminal defense for DUI, vehicular homicide, narcotics conspiracy, and white-collar fraud charges.',
      610, 95, '(617) 555-0193', 'bcallahan@callahandefense.com',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Nadia Al-Mansoor, J.D.', 'International Dispute & Human Rights Counsel', 'Civil Rights', 'DC Bar #472910',
      14, 'Yale Law School, J.D.', 'Al-Mansoor International Law', 'Washington', 'DC',
      365, 5.0, 79, 'English, Arabic, French',
      'Advocate in federal appeals, international human rights litigation, diplomatic immunity disputes, and constitutional protection before supreme tribunals.',
      195, 98, '(202) 555-0181', 'nadia@almansoorlaw.com',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Liam O\'Connor, Esq.', 'Catastrophic Injury Trial Specialist', 'Personal Injury', 'PA Bar #382914',
      17, 'Univ of Pennsylvania Carey Law, J.D.', 'O\'Connor Injury Law Associates', 'Philadelphia', 'PA',
      325, 4.9, 230, 'English',
      'Recovered over $140M for clients suffering catastrophic vehicular accidents, construction injuries, defective medical devices, and industrial negligence.',
      520, 97, '(215) 555-0174', 'liam@oconnorinjury.com',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Victoria Sterling, J.D.', 'Senior Matrimonial & Private Wealth Partner', 'Family Law', 'CA Bar #298412',
      16, 'UCLA School of Law, J.D.', 'Sterling Wealth & Family Legal PC', 'Los Angeles', 'CA',
      385, 4.9, 112, 'English, Spanish',
      'Trusted advisor to entertainment figures and high-net-worth families for contested custody, post-nuptial structuring, and generational wealth transitions.',
      340, 96, '(310) 555-0155', 'vsterling@sterlingfamilylaw.com',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Derrick Washington, Esq.', 'Managing Civil Rights Trial Lawyer', 'Civil Rights', 'IL Bar #628194',
      15, 'University of Chicago Law, J.D.', 'Washington Civil Justice Clinic', 'Chicago', 'IL',
      315, 4.9, 135, 'English',
      'Tenacious litigator holding law enforcement and state institutions accountable for wrongful convictions, section 1983 violations, and prison abuse.',
      380, 96, '(312) 555-0199', 'derrick@washingtonjustice.com',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Camila Santos, LL.M.', 'Commercial Real Estate & Finance Partner', 'Real Estate Law', 'TX Bar #918230',
      13, 'SMU Dedman School of Law, LL.M.', 'Santos Commercial Property Law', 'Dallas', 'TX',
      330, 4.8, 96, 'English, Portuguese, Spanish',
      'Directing multi-site land acquisitions, commercial leases, industrial warehousing permits, and real estate syndicated funding transactions.',
      270, 95, '(214) 555-0128', 'camila@santospropertylaw.com',
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Dr. Ethan Vance, J.D., M.D.', 'Healthcare Regulatory & Malpractice Specialist', 'Healthcare Law', 'TX Bar #781920',
      18, 'Harvard Law School, J.D. / Johns Hopkins, M.D.', 'Vance Medico-Legal Solutions', 'Houston', 'TX',
      440, 5.0, 64, 'English',
      'Dual-certified physician-attorney bridging medicine and jurisprudence in complex clinical trials, medical negligence, FDA compliance, and hospital liability.',
      310, 99, '(713) 555-0185', 'dr.vance@vancemedlaw.com',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Chloe Bennett, Esq.', 'Workplace Equity & Executive Relations Counsel', 'Employment Law', 'CO Bar #419280',
      11, 'University of Colorado Law, J.D.', 'Bennett Workplace Counsel', 'Denver', 'CO',
      295, 4.9, 118, 'English',
      'Championing fair wage structures, gender pay equity, remote work non-competes, and whistleblower safety across Colorado technology ecosystems.',
      290, 97, '(303) 555-0147', 'chloe@bennettworkplacelaw.com',
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Gabriel Moreno, J.D.', 'Managing Federal Defense Litigator', 'Criminal Law', 'AZ Bar #318290',
      15, 'Arizona State University, J.D.', 'Moreno Federal Defense Group', 'Phoenix', 'AZ',
      310, 4.8, 142, 'English, Spanish',
      'Focused on federal border litigation, constitutional search-and-seizure suppression hearings, racketeering defenses, and grand jury investigations.',
      420, 95, '(602) 555-0138', 'gabriel@morenodefense.com',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Zoe K. Mitchell, Esq.', 'Cybersecurity & Data Privacy Officer', 'Intellectual Property', 'CA Bar #391820',
      10, 'NYU School of Law, J.D.', 'Mitchell Cyber & Privacy Law', 'San Jose', 'CA',
      370, 4.9, 73, 'English, Korean',
      'Specializing in CCPA/GDPR compliance, ransomware emergency response, cloud privacy breaches, and cross-border data transfer litigation.',
      160, 98, '(408) 555-0179', 'zoe@mitchellcyberlaw.com',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Anthony Russo, Esq.', 'Commercial Litigator & Antitrust Counsel', 'Corporate Law', 'GA Bar #618293',
      17, 'Emory University School of Law, J.D.', 'Russo Commercial Law Partners', 'Atlanta', 'GA',
      345, 4.9, 104, 'English, Italian',
      'Proven trial veteran handling shareholder derivative lawsuits, trade secret misappropriation, breach of fiduciary duty, and corporate antitrust disputes.',
      390, 97, '(404) 555-0167', 'arusso@russocommercial.com',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Aisha Bello, J.D.', 'Lead Environmental & Renewable Energy Counsel', 'Real Estate Law', 'OR Bar #482910',
      12, 'Lewis & Clark Law School, J.D.', 'Bello Clean Energy Law', 'Portland', 'OR',
      315, 5.0, 88, 'English, Yoruba',
      'Guiding solar, wind, and municipal infrastructure projects through Clean Water Act permitting, NEPA reviews, and environmental justice disputes.',
      210, 98, '(503) 555-0122', 'aisha@bellocleanenergy.com',
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=400&q=80', 1
    ],
    [
      'Benjamin Hayes, Esq.', 'Tax Controversy & Corporate Structuring Partner', 'Tax Law', 'NC Bar #519280',
      16, 'Duke University School of Law, J.D.', 'Hayes Tax & Wealth Advisory', 'Charlotte', 'NC',
      360, 4.9, 125, 'English',
      'Expert defense before IRS audits, US Tax Court appeals, international offshore compliance, and executive deferred compensation structuring.',
      340, 97, '(704) 555-0158', 'bhayes@hayestaxlaw.com',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 1
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
    console.log(`🌱 Added ${inserted} new verified attorneys into SQLite lawyers database.`);
  }

  // Seed Courts table with authoritative federal, state, and specialized courts
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
      'Supreme Court of the United States',
      'SCOTUS',
      'Federal Supreme',
      'Supreme',
      'Federal / Nationwide',
      'Washington',
      'DC',
      '1 First Street NE',
      '20543',
      '(202) 479-3000',
      'https://www.supremecourt.gov',
      'Mon - Fri: 9:00 AM - 5:00 PM EST',
      'Supreme Court E-Filing System',
      'Chief Justice John G. Roberts, Jr.',
      'Constitutional Law, Federal Questions, Writs of Certiorari, Original Jurisdiction',
      'The highest federal judicial body in the United States. Leads the federal judiciary with ultimate appellate jurisdiction over all constitutional controversies.',
      'Highest Federal Court',
      1
    ],
    [
      'U.S. Court of Appeals for the Ninth Circuit',
      'CA9',
      'Federal Appellate',
      'Appellate',
      '9th Circuit (AK, AZ, CA, HI, ID, MT, NV, OR, WA)',
      'San Francisco',
      'CA',
      '95 7th Street, James R. Browning Courthouse',
      '94103',
      '(415) 355-8000',
      'https://www.ca9.uscourts.gov',
      'Mon - Fri: 8:30 AM - 5:00 PM PST',
      'CM/ECF / PACER',
      'Chief Judge Mary H. Murguia',
      'Federal Civil, Criminal, Administrative Agency Decisions, Immigration Appeals',
      'The largest federal appellate circuit in the nation, hearing appeals from federal district courts across 9 Western states and territories.',
      'Largest Appellate Circuit',
      1
    ],
    [
      'U.S. Court of Appeals for the Second Circuit',
      'CA2',
      'Federal Appellate',
      'Appellate',
      '2nd Circuit (NY, CT, VT)',
      'New York',
      'NY',
      '40 Foley Square, Thurgood Marshall Courthouse',
      '10007',
      '(212) 857-8500',
      'https://www.ca2.uscourts.gov',
      'Mon - Fri: 8:30 AM - 5:00 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Debra Ann Livingston',
      'Securities Law, Corporate Mergers, White-Collar Appeals, International Arbitration',
      'Pivotal federal appellate bench setting groundbreaking legal precedents in securities fraud, banking regulation, copyright, and international finance.',
      'Financial Jurisprudence Hub',
      1
    ],
    [
      'U.S. Court of Appeals for the D.C. Circuit',
      'CADC',
      'Federal Appellate',
      'Appellate',
      'District of Columbia Circuit',
      'Washington',
      'DC',
      '333 Constitution Avenue NW, E. Barrett Prettyman Courthouse',
      '20001',
      '(202) 216-7000',
      'https://www.cadc.uscourts.gov',
      'Mon - Fri: 9:00 AM - 4:00 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Sri Srinivasan',
      'Administrative Agency Regulations, Executive Powers, Constitutional Challenges',
      'Often regarded as America\'s second-highest court, reviewing administrative agency rulemaking, SEC, EPA, FCC, and federal government directives.',
      'Premier Regulatory Circuit',
      1
    ],
    [
      'U.S. Court of Appeals for the Federal Circuit',
      'CAFC',
      'Federal Appellate',
      'Appellate',
      'Nationwide Specialized Circuit',
      'Washington',
      'DC',
      '717 Madison Place NW, Howard T. Markey National Courts Building',
      '20439',
      '(202) 275-8000',
      'https://www.cafc.uscourts.gov',
      'Mon - Fri: 8:30 AM - 4:30 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Kimberly A. Moore',
      'Patent Appeals, Trademarks, International Trade, Federal Contracts, Veterans Claims',
      'Unique nationwide jurisdiction over patent litigation appeals from all U.S. district courts, the USPTO, and the Court of Federal Claims.',
      'National Patent Authority',
      1
    ],
    [
      'U.S. District Court - Southern District of New York',
      'SDNY',
      'Federal District',
      'Trial',
      '2nd Circuit',
      'New York',
      'NY',
      '500 Pearl Street, Daniel Patrick Moynihan Courthouse',
      '10007',
      '(212) 805-0136',
      'https://www.nysd.uscourts.gov',
      'Mon - Fri: 8:30 AM - 5:00 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Laura Taylor Swain',
      'Civil Trial, Criminal, Complex Securities, Corporate Fraud, Admiralty',
      'The preeminent federal trial court known as the "Mother Court", adjudicating high-profile Wall Street financial crimes, international arbitration, and civil disputes.',
      'Mother Court of America',
      1
    ],
    [
      'U.S. District Court - Northern District of California',
      'NDCA',
      'Federal District',
      'Trial',
      '9th Circuit',
      'San Francisco',
      'CA',
      '450 Golden Gate Avenue, Phillip Burton Federal Building',
      '94102',
      '(415) 522-2000',
      'https://www.cand.uscourts.gov',
      'Mon - Fri: 9:00 AM - 4:00 PM PST',
      'CM/ECF / PACER',
      'Chief Judge Richard Seeborg',
      'Technology Antitrust, AI Copyright, Semiconductor Patents, Privacy Actions',
      'Trial epicenter for Silicon Valley tech litigation, presiding over multi-district class actions, privacy violations, and landmark software patents.',
      'Silicon Valley Tech Center',
      1
    ],
    [
      'U.S. District Court - Northern District of Illinois',
      'NDIL',
      'Federal District',
      'Trial',
      '7th Circuit',
      'Chicago',
      'IL',
      '219 South Dearborn Street, Everett McKinley Dirksen Courthouse',
      '60604',
      '(312) 435-5670',
      'https://www.ilnd.uscourts.gov',
      'Mon - Fri: 8:30 AM - 5:00 PM CST',
      'CM/ECF / PACER',
      'Chief Judge Virginia M. Kendall',
      'Commercial Disputes, Commodity Futures, Civil Rights, Federal Crimes',
      'Leading Midwestern federal district with extensive jurisprudence in financial derivatives, corporate restructuring, and civil rights litigation.',
      'Midwest Commercial Trial Center',
      1
    ],
    [
      'U.S. District Court - Central District of California',
      'CDCA',
      'Federal District',
      'Trial',
      '9th Circuit',
      'Los Angeles',
      'CA',
      '350 West 1st Street, First Street U.S. Courthouse',
      '90012',
      '(213) 894-1565',
      'https://www.cacd.uscourts.gov',
      'Mon - Fri: 8:30 AM - 4:30 PM PST',
      'CM/ECF / PACER',
      'Chief Judge Dolly M. Gee',
      'Entertainment & Media, Trademark, Class Action, Intellectual Property',
      'The most populous federal trial district in the United States, commanding premier dockets in entertainment contracts, trademark infringement, and cross-border trade.',
      'Entertainment & Media Hub',
      1
    ],
    [
      'U.S. District Court - Eastern District of Texas',
      'EDTX',
      'Federal District',
      'Trial',
      '5th Circuit',
      'Tyler',
      'TX',
      '211 West Ferguson Street, William M. Steger Courthouse',
      '75702',
      '(903) 590-1000',
      'https://www.txed.uscourts.gov',
      'Mon - Fri: 8:00 AM - 5:00 PM CST',
      'CM/ECF / PACER',
      'Chief Judge Rodney Gilstrap',
      'Patent Infringement, High-Tech Jury Trials, Energy Commercial Litigation',
      'Renowned nationwide for specialized patent jury trials, procedural speed, and high-stakes intellectual property dispute resolutions.',
      'Patent Trial Epicenter',
      1
    ],
    [
      'Delaware Court of Chancery',
      'DE-CHANCERY',
      'Specialized Court',
      'Specialized Equity',
      'State of Delaware',
      'Wilmington',
      'DE',
      '500 North King Street, Leonard L. Williams Justice Center',
      '19801',
      '(302) 255-0544',
      'https://courts.delaware.gov/chancery',
      'Mon - Fri: 8:30 AM - 5:00 PM EST',
      'File & ServeXpress',
      'Chancellor Kathaleen St. J. McCormick',
      'Corporate Governance, Mergers & Acquisitions, Fiduciary Duty Disputes, Trusts',
      'The world\'s most influential corporate law court. Decides major corporate takeover disputes, shareholder class actions, and management battles without a jury.',
      'World Corporate Law Capital',
      1
    ],
    [
      'U.S. Bankruptcy Court - Southern District of New York',
      'SDNY-BANKR',
      'Bankruptcy Court',
      'Specialized Trial',
      '2nd Circuit',
      'New York',
      'NY',
      'One Bowling Green, Alexander Hamilton U.S. Custom House',
      '10004',
      '(212) 668-2870',
      'https://www.nysb.uscourts.gov',
      'Mon - Fri: 8:30 AM - 5:00 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Martin Glenn',
      'Chapter 11 Megacap Restructuring, Cross-Border Insolvency (Chapter 15)',
      'The international venue of choice for massive Chapter 11 corporate reorganizations, multinational debtor proceedings, and creditor syndicates.',
      'Premier Insolvency Court',
      1
    ],
    [
      'United States Tax Court',
      'USTC',
      'Specialized Court',
      'Specialized Trial',
      'Nationwide Federal Court',
      'Washington',
      'DC',
      '400 Second Street NW',
      '20217',
      '(202) 521-0700',
      'https://www.ustaxcourt.gov',
      'Mon - Fri: 8:00 AM - 4:30 PM EST',
      'DAWSON E-Filing Portal',
      'Chief Judge Kathleen Kerrigan',
      'IRS Deficiency Redetermination, Partnership Audits, Whistleblower Awards',
      'National trial forum where individuals and corporate entities can contest proposed federal income tax deficiencies prior to paying disputed amounts.',
      'Pre-Payment Tax Forum',
      1
    ],
    [
      'Supreme Court of California',
      'CASC',
      'State Supreme',
      'Supreme',
      'State of California',
      'San Francisco',
      'CA',
      '350 McAllister Street, Earl Warren Building',
      '94102',
      '(415) 865-7000',
      'https://supreme.courts.ca.gov',
      'Mon - Fri: 9:00 AM - 5:00 PM PST',
      'TrueFiling California',
      'Chief Justice Patricia Guerrero',
      'State Constitutional Law, Consumer Protection, Civil Rights, Employment Standards',
      'The highest state judicial body in California, setting progressive precedents in tort liability, digital privacy, labor classifications, and environmental protection.',
      'Highest State Tribunal',
      1
    ],
    [
      'New York Court of Appeals',
      'NYCA',
      'State Supreme',
      'Supreme',
      'State of New York',
      'Albany',
      'NY',
      '20 Eagle Street',
      '12207',
      '(518) 455-7700',
      'https://www.nycourts.gov/ctapps',
      'Mon - Fri: 9:00 AM - 5:00 PM EST',
      'Court-PASS E-Filing',
      'Chief Judge Rowan D. Wilson',
      'Commercial Law, Contract Interpretation, State Constitutional Appeals',
      'New York\'s court of last resort, venerated worldwide for foundational common-law contract precedents and commercial law doctrines.',
      'Historic Common Law Court',
      1
    ],
    [
      'Supreme Court of Texas',
      'TXSC',
      'State Supreme',
      'Supreme',
      'State of Texas',
      'Austin',
      'TX',
      '201 West 14th Street, Supreme Court Building',
      '78701',
      '(512) 463-1312',
      'https://www.txcourts.gov/supreme',
      'Mon - Fri: 8:00 AM - 5:00 PM CST',
      'eFileTexas',
      'Chief Justice Nathan L. Hecht',
      'Civil Law, Energy & Mineral Rights, Property Protections, Tort Reform',
      'Court of ultimate civil appellate jurisdiction in Texas, renowned for definitive opinions in oil, gas, renewable energy, and commercial contracts.',
      'Energy & Commercial Authority',
      1
    ],
    [
      'Cook County Circuit Court',
      'COOK-IL',
      'County & Circuit Court',
      'Trial',
      'Cook County Judicial Circuit',
      'Chicago',
      'IL',
      '50 West Washington Street, Richard J. Daley Center',
      '60602',
      '(312) 603-5030',
      'https://www.cookcountycourt.org',
      'Mon - Fri: 8:30 AM - 4:30 PM CST',
      'eFileIL / Odyssey',
      'Chief Judge Timothy C. Evans',
      'Commercial Division, Law Division, Chancery, Domestic Relations, Criminal',
      'One of the largest unified court systems in the world, processing over 1 million civil and criminal proceedings annually across Cook County.',
      'Unified Trial System',
      1
    ],
    [
      'Massachusetts Superior Court - Suffolk County',
      'MASS-SUFFOLK',
      'County & Circuit Court',
      'Trial',
      'Suffolk County Judicial District',
      'Boston',
      'MA',
      '3 Pemberton Square, Suffolk County Courthouse',
      '02108',
      '(617) 788-8175',
      'https://www.mass.gov/orgs/superior-court',
      'Mon - Fri: 8:30 AM - 4:30 PM EST',
      'eFileMA / Odyssey',
      'Chief Justice Michael D. Ricciuti',
      'Business Litigation Session (BLS), Major Civil, Complex Torts, Criminal',
      'Home to the celebrated Business Litigation Session (BLS), handling complex commercial, venture capital, pharmaceutical, and technology disputes.',
      'Business Litigation Session',
      1
    ],
    [
      'U.S. District Court - Southern District of Florida',
      'SDFL',
      'Federal District',
      'Trial',
      '11th Circuit',
      'Miami',
      'FL',
      '400 North Miami Avenue, Wilkie D. Ferguson, Jr. U.S. Courthouse',
      '33128',
      '(305) 523-5100',
      'https://www.flsd.uscourts.gov',
      'Mon - Fri: 8:30 AM - 4:30 PM EST',
      'CM/ECF / PACER',
      'Chief Judge Cecilia M. Altonaga',
      'Maritime & Admiralty, Cross-Border Commercial, Healthcare Fraud, Narcotics',
      'Crucial international trial venue resolving major maritime commerce, multinational banking disputes, and federal white-collar trials.',
      'Maritime & Cross-Border Hub',
      1
    ],
    [
      'Florida 11th Judicial Circuit Court',
      'FL-11TH',
      'County & Circuit Court',
      'Trial',
      '11th Judicial Circuit of Florida',
      'Miami',
      'FL',
      '73 West Flagler Street, Miami-Dade County Courthouse',
      '33130',
      '(305) 275-1155',
      'https://www.jud11.flcourts.org',
      'Mon - Fri: 9:00 AM - 4:00 PM EST',
      'Florida Courts E-Filing Portal',
      'Chief Judge Nushin G. Sayfie',
      'Complex Business Litigation (CBL), Civil, Probate, Real Estate, Criminal',
      'The largest trial court in Florida, featuring an elite Complex Business Litigation division resolving high-value international and real estate actions.',
      'Complex Business Section',
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
    console.log(`🏛️ Seeded ${courtsInserted} authoritative courts into SQLite courts database.`);
  }


  console.log(`✅ SQLite Database connected & initialized: ${dbPath}`);
} catch (err) {
  console.error(`❌ SQLite Connection Error: ${err.message}`);
}

module.exports = db;



const bcrypt = require('bcryptjs');

/**
 * Case templates and generators tailored to Indian legal specialties, courts, and acts.
 */
const SPECIALTY_CASE_TEMPLATES = {
  'Corporate Law': [
    {
      casePrefix: 'COMP.APP.(AT)',
      titleTemplate: '{client} vs. {opposing} & Ors.',
      courtFallback: 'NCLAT New Delhi',
      courtCodeFallback: 'NCLAT',
      bench: 'Principal Bench — Hon\'ble Chairperson Bench',
      acts: 'Companies Act 2013 Sec 241-242, 244 (Oppression & Mismanagement)',
      stages: ['Arguments on Maintainability & Interim Relief', 'Hearing on Forensic Audit Report', 'Final Hearing on Restitution'],
      disputeValues: ['₹48.5 Crores', '₹112 Crores', '₹65 Crores Shareholding', '₹85 Crores Control Dispute'],
      summary: 'Company appeal challenging oppression of minority shareholders, unauthorized dilution of equity, and diversion of corporate assets.'
    },
    {
      casePrefix: 'ARB.O.P.',
      titleTemplate: '{client} Pvt Ltd vs. {opposing} Infrastructure Ltd',
      courtFallback: 'High Court Commercial Division',
      courtCodeFallback: 'DHC',
      bench: 'Commercial Division — Courtroom 14',
      acts: 'Arbitration & Conciliation Act 1996 Sec 34 & 9 (Interim Protection)',
      stages: ['Hearing on Interim Stay of Award', 'Final Arguments on Patent Illegality', 'Enforcement Proceedings'],
      disputeValues: ['₹78 Crores Arbitral Award', '₹140 Crores EPC Contract', '₹32 Crores Disputed Invoices'],
      summary: 'Section 34 petition seeking to set aside domestic arbitral award on grounds of violation of public policy of India and contractual misconstruction.'
    },
    {
      casePrefix: 'IB(IBC)',
      titleTemplate: 'State Bank Consortium vs. {opposing} Steels & Alloys Ltd',
      courtFallback: 'NCLT Principal Bench',
      courtCodeFallback: 'NCLT-DEL',
      bench: 'Division Bench — Courtroom 2',
      acts: 'Insolvency and Bankruptcy Code (IBC) 2016 Sec 7, 30(6) & 31',
      stages: ['Arguments on Approval of Resolution Plan', 'Adjudication of Operational Creditor Claims', 'Admission of Corporate Insolvency'],
      disputeValues: ['₹210 Crores Admitted Debt', '₹95 Crores CIRP Value'],
      summary: 'Corporate Insolvency Resolution Process (CIRP) representation on behalf of financial creditors for approval of the committee of creditors resolution plan.'
    },
    {
      casePrefix: 'W.P.(C)',
      titleTemplate: '{client} Energy Corp vs. Competition Commission of India & Anr.',
      courtFallback: 'Supreme Court of India',
      courtCodeFallback: 'SCI',
      bench: 'Courtroom 3 — Hon\'ble Chief Justice Bench',
      acts: 'Competition Act 2002 Sec 3, 4 & 53T; Constitution of India Art 136',
      stages: ['Notice on Special Leave Petition', 'Arguments on Abuse of Dominant Position Finding', 'Final Disposal'],
      disputeValues: ['₹18.5 Crores Penalty Stay', 'Regulatory Clearance'],
      summary: 'Special leave appeal challenging CCI order imposing turnover penalty for alleged cartelization and vertical restraint.'
    }
  ],

  'Criminal Law': [
    {
      casePrefix: 'BAIL APPLN.',
      titleTemplate: '{client} vs. State (Govt of NCT) & Anr.',
      courtFallback: 'High Court Criminal Appellate Division',
      courtCodeFallback: 'DHC',
      bench: 'Single Judge Criminal Bench — Courtroom 7',
      acts: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 Sec 482 / CrPC 438 (Anticipatory Bail), BNS Sec 318(4) [Cheating]',
      stages: ['Arguments on Pre-Arrest Protection', 'Inspection of Case Diary & Status Report', 'Confirmation of Interim Bail'],
      disputeValues: ['Personal Liberty & Pre-Arrest Protection', 'Statutory Bail Relief'],
      summary: 'Anticipatory bail petition in a commercial-criminal crossover complaint alleging misrepresentation in investment contracts without criminal intent.'
    },
    {
      casePrefix: 'SLP (Crl)',
      titleTemplate: '{client} vs. Directorate of Enforcement (ED)',
      courtFallback: 'Supreme Court of India',
      courtCodeFallback: 'SCI',
      bench: 'Courtroom 2 — Senior Judge Bench',
      acts: 'Prevention of Money Laundering Act (PMLA) 2002 Sec 3, 4 & 45; Constitution of India Art 21',
      stages: ['Bench Admission Hearing', 'Arguments on Section 45 Twin Conditions & Strict Compliance', 'Final Judgment Reserved'],
      disputeValues: ['Constitutional Bail Relief', 'De-freezing of Bank Accounts'],
      summary: 'Criminal appeal contesting protracted pre-trial incarceration and challenging ECIR proceedings under the rigorous twin conditions of PMLA.'
    },
    {
      casePrefix: 'CRL.M.C.',
      titleTemplate: '{client} & Ors. vs. State & {opposing}',
      courtFallback: 'High Court of Judicature',
      courtCodeFallback: 'BHC',
      bench: 'Criminal Division — Courtroom 11',
      acts: 'BNSS 2023 Sec 528 / CrPC 482 (Inherent Powers of High Court), BNS Sec 61(2) [Conspiracy]',
      stages: ['Arguments on FIR Quashing', 'Verification of Settlement Terms', 'Final Quashing Order'],
      disputeValues: ['Quashing of Criminal Proceedings', 'Compounding of Offences'],
      summary: 'Petition under inherent powers for quashing of criminal complaint arising out of a purely civil contractual dispute without mens rea.'
    },
    {
      casePrefix: 'SESSIONS CASE',
      titleTemplate: 'State vs. {client} & Anr.',
      courtFallback: 'Principal District & Sessions Court',
      courtCodeFallback: 'DEL-TIS',
      bench: 'Special Sessions Courtroom 4',
      acts: 'BNS 2023 Sec 103(1) / IPC 302, Bharatiya Sakshya Adhiniyam 2023 Sec 27',
      stages: ['Cross Examination of Forensic Ballistics Expert (PW-12)', 'Section 313 Examination of Accused', 'Defense Final Arguments'],
      disputeValues: ['Trial Acquittal Defense', 'Rebuttal of Circumstantial Evidence'],
      summary: 'Lead defense counsel in sessions trial challenging circumstantial chain of custody, uncorroborated recovery memos, and forensic discrepancies.'
    }
  ],

  'Civil Rights': [
    {
      casePrefix: 'W.P.(C)',
      titleTemplate: '{client} Collective vs. Union of India & Ors.',
      courtFallback: 'Supreme Court of India',
      courtCodeFallback: 'SCI',
      bench: 'Courtroom 1 — Hon\'ble Chief Justice Bench',
      acts: 'Constitution of India Art 32, 14, 19(1)(a) & 21 (Fundamental Rights Enforcement)',
      stages: ['Preliminary Hearing & Issuance of Notice', 'Filing of Counter Affidavit by Union', 'Constitution Bench Reference'],
      disputeValues: ['Constitutional Liberty & Public Interest', 'Statutory Guidelines Issuance'],
      summary: 'Public Interest Litigation (PIL) challenging discriminatory digital surveillance protocols and demanding statutory procedural safeguards.'
    },
    {
      casePrefix: 'W.P.(C)',
      titleTemplate: '{client} vs. State Public Service Commission & Anr.',
      courtFallback: 'High Court of Judicature',
      courtCodeFallback: 'CALHC',
      bench: 'Constitutional Writ Division — Bench 3',
      acts: 'Constitution of India Art 226, 14 & 16 (Equality of Opportunity in Public Employment)',
      stages: ['Arguments on Arbitrary Disqualification', 'Production of Normalized Merit Records', 'Final Judgment on Re-evaluation'],
      disputeValues: ['Public Employment Right', 'Merit List Correction'],
      summary: 'Writ of mandamus seeking quashing of arbitrary normalization formula applied to reserved category candidates in state judicial service examinations.'
    },
    {
      casePrefix: 'SLP(C)',
      titleTemplate: '{client} Foundation vs. Ministry of Environment & Forests',
      courtFallback: 'Supreme Court of India',
      courtCodeFallback: 'SCI',
      bench: 'Green Bench — Courtroom 6',
      acts: 'Environment Protection Act 1986, Public Trust Doctrine, Art 21 & 48A',
      stages: ['Review of Expert Committee Report', 'Directions on Coastal Zone Management', 'Final Orders on Afforestation'],
      disputeValues: ['Ecological Protection & Injunction', 'Public Trust Compliance'],
      summary: 'Appeal challenging environmental clearance granted to a heavy industrial manufacturing cluster within an ecologically fragile coastal buffer zone.'
    }
  ],

  'Intellectual Property': [
    {
      casePrefix: 'CS(COMM)',
      titleTemplate: '{client} Innovations Inc. vs. {opposing} Pharma Ltd',
      courtFallback: 'Delhi High Court Intellectual Property Division',
      courtCodeFallback: 'DHC',
      bench: 'IPR Division — Courtroom 21',
      acts: 'Patents Act 1970 Sec 48, 108 & 114; Commercial Courts Act 2015',
      stages: ['Hearing on Interim Injunction (Order 39 Rules 1 & 2 CPC)', 'Inspection of Scientific Claim Construction', 'Trial Framing of Issues'],
      disputeValues: ['₹84 Crores Disputed Patent Royalty', '₹12 Crores Damages Claim'],
      summary: 'Patent infringement suit asserting compound formulation monopoly against generic pharmaceutical manufacturer violating Section 48 rights.'
    },
    {
      casePrefix: 'COMM.TM',
      titleTemplate: '{client} Lifestyle Brands vs. {opposing} Enterprises',
      courtFallback: 'High Court Commercial Division',
      courtCodeFallback: 'BHC',
      bench: 'Commercial Division — Courtroom 9',
      acts: 'Trade Marks Act 1999 Sec 29, 134 & 135 (Infringement & Passing Off)',
      stages: ['Compliance of Ex-Parte Ad-Interim Injunction', 'Local Commissioner Seizure Report Hearing', 'Summary Judgment Application'],
      disputeValues: ['Brand Value Protection', '₹15 Lakhs Rendered Accounts'],
      summary: 'Trademark counterfeiting and passing off suit restraining sale of deceptive identical brand packaging across national retail e-commerce channels.'
    },
    {
      casePrefix: 'CS(OS)',
      titleTemplate: '{client} Software Labs vs. Ex-Founders & {opposing} AI Ltd',
      courtFallback: 'High Court Commercial Division',
      courtCodeFallback: 'DHC',
      bench: 'IPR Division — Courtroom 18',
      acts: 'Copyright Act 1957 Sec 51 & 55, Information Technology Act 2000 Sec 43',
      stages: ['Forensic Image Inspection of Code Repositories', 'Arguments on Trade Secret Misappropriation', 'Mediation Referral Session'],
      disputeValues: ['₹28 Crores Software IP Valuation', 'Source Code Injunction'],
      summary: 'Copyright infringement and trade secret misappropriation suit against departing executive engineers copying proprietary algorithm repositories.'
    }
  ],

  'Real Estate Law': [
    {
      casePrefix: 'RERA/APP',
      titleTemplate: '{client} Buyers Welfare Association vs. {opposing} Developers Ltd',
      courtFallback: 'Real Estate Appellate Tribunal',
      courtCodeFallback: 'BHC',
      bench: 'Appellate Tribunal — Courtroom 1',
      acts: 'Real Estate (Regulation and Development) Act (RERA) 2016 Sec 18, 19(4) & 43(5)',
      stages: ['Execution of Recovery Warrants', 'Bank Account Attachment Hearing', 'Final Refund & Interest Decree'],
      disputeValues: ['₹24.8 Crores Principal Refund + 10.75% Interest', 'Delivery of Occupancy Certificate'],
      summary: 'Appellate RERA proceedings for delayed handover of 140 luxury residential units exceeding statutory completion deadlines by four years.'
    },
    {
      casePrefix: 'O.S.',
      titleTemplate: '{client} Logistics Hub vs. {opposing} Land Syndicate',
      courtFallback: 'Civil Court Senior Division',
      courtCodeFallback: 'HAR-GUR-DC',
      bench: 'Commercial Civil Court — Courtroom 5',
      acts: 'Specific Relief Act 1963 Sec 10, 16(c) & 20; Transfer of Property Act 1882 Sec 53A',
      stages: ['Framing of Additional Issues on Readiness & Willingness', 'Ex-parte Injunction Hearing', 'Final Arguments on Title Deed'],
      disputeValues: ['₹38 Crores Industrial Parcel', 'Decree for Specific Performance'],
      summary: 'Suit for specific performance of registered agreement to sell for 22 acres of prime logistics corridor land following unlawful unilateral cancellation.'
    }
  ],

  'Family Law': [
    {
      casePrefix: 'HMA',
      titleTemplate: '{client} vs. {opposing}',
      courtFallback: 'Principal Family Court',
      courtCodeFallback: 'DEL-SAK-DC',
      bench: 'Principal Judge Bench — Courtroom 2',
      acts: 'Hindu Marriage Act 1955 Sec 13(1)(ia), 24 & 26 (Custody & Maintenance); Guardians and Wards Act',
      stages: ['Mediation Report Review', 'Interim Maintenance Determination', 'Final Arguments on Child Custody'],
      disputeValues: ['Child Custody & International Passport Retention', '₹2.5 Lakhs/mo Maintenance'],
      summary: 'Complex matrimonial litigation involving contested permanent custody of minor child and interim financial maintenance in a cross-border residency setting.'
    },
    {
      casePrefix: 'F.C.O.S.',
      titleTemplate: '{client} & Ors. vs. {opposing} & Ors.',
      courtFallback: 'District Court Senior Division',
      courtCodeFallback: 'MUM-SES',
      bench: 'Senior Civil Division — Courtroom 8',
      acts: 'Hindu Succession (Amendment) Act 2005 Sec 6; Code of Civil Procedure Order 20 Rule 18',
      stages: ['Commissioner Report on Metes and Bounds Partition', 'Preliminary Decree Hearing', 'Final Decree for Partition'],
      disputeValues: ['₹62 Crores Ancestral Estate', 'Coparcenary Equal Share'],
      summary: 'Ancestral coparcenary partition suit asserting equal statutory daughter coparcenary rights under the landmark Vineeta Sharma precedent.'
    }
  ],

  'Tax Law': [
    {
      casePrefix: 'ITA',
      titleTemplate: '{client} Tech Solutions Ltd vs. DCIT (Large Taxpayer Unit)',
      courtFallback: 'Income Tax Appellate Tribunal (ITAT)',
      courtCodeFallback: 'ITAT',
      bench: 'Special Bench — Courtroom 1',
      acts: 'Income Tax Act 1961 Sec 92CA, 143(3), 147 & 254 (Transfer Pricing)',
      stages: ['Arguments on Comparable Selection (CUP Method)', 'Stay of Outstanding Demand', 'Final Judgment Reserved'],
      disputeValues: ['₹62.4 Crores Assessment Stay', 'Arm\'s Length Margin Deletion'],
      summary: 'ITAT appeal challenging arbitrary transfer pricing adjustment and disallowance of brand royalties paid to offshore parent corporation.'
    },
    {
      casePrefix: 'W.P.(C)',
      titleTemplate: '{client} Petrochem vs. Commissioner of CGST & Central Excise',
      courtFallback: 'High Court Tax Division',
      courtCodeFallback: 'AHC',
      bench: 'Tax Division Bench — Courtroom 4',
      acts: 'Central Goods and Services Tax Act 2017 Sec 16(4), 17(5) & 73; Constitution of India Art 300A',
      stages: ['Hearing on Interim Protection against Coercive Recovery', 'Notice on Input Tax Credit Blockage', 'Final Arguments'],
      disputeValues: ['₹16.7 Crores Input Tax Credit Stay', 'De-freezing of Electronic Credit Ledger'],
      summary: 'Constitutional writ challenging unconstitutional retrospective denial of input tax credit (ITC) due to third-party vendor GSTR-3B default.'
    }
  ],

  'Employment Law': [
    {
      casePrefix: 'ID',
      titleTemplate: '{client} Employees Union vs. {opposing} Aviation Ltd',
      courtFallback: 'Central Government Industrial Tribunal (CGIT)',
      courtCodeFallback: 'DEL-TIS',
      bench: 'CGIT Presiding Officer Bench',
      acts: 'Industrial Disputes Act 1947 Sec 10, 25F & 33C(2); Payment of Gratuity Act 1972',
      stages: ['Rejoinder on Illegal Retrenchment Claims', 'Evidence of Union Representatives', 'Final Award Arguments'],
      disputeValues: ['Reinstatement with 100% Back Wages', '₹8.4 Crores Severance Dispute'],
      summary: 'Industrial adjudication challenging mass employee termination disguised as voluntary retirement without statutory notice under Section 25F.'
    }
  ]
};

const CLIENT_NAMES = [
  'Vikram Malhotra', 'Sunita Singhania', 'Rajesh K. Mehta', 'Pooja Narang',
  'Arun K. Verma', 'Radhika Deshmukh', 'Gaurav Chopra', 'Meenakshi Sundaram',
  'Siddharth Mittal', 'Ananya Sengupta', 'Deepak R. Nair', 'Priyanka Ghosh',
  'TechCorp India Pvt Ltd', 'Bharat Logistics Consortium', 'Zenith Biopharma',
  'Solaris CleanTech Ltd', 'Kalyani Automotive Infra', 'Matrix Media Networks'
];

const OPPOSING_PARTIES = [
  'Union of India & Anr.', 'State of Maharashtra', 'State (Govt of NCT of Delhi)',
  'Directorate of Enforcement (ED)', 'Competition Commission of India',
  'Apex Infrastructure Consortium', 'Global Matrix Logistics Ltd', 'Nova Star Holdings Inc.',
  'Reliance Infrastructure Ltd', 'Tata Motors Finance', 'Registrar of Companies',
  'Commissioner of Central GST', 'Securities and Exchange Board of India (SEBI)'
];

/**
 * Generate 3-5 authentic, realistic cases tailored to a specific lawyer's specialty, courts, and credentials.
 */
function generateCasesForLawyer(lawyer, year = 2026) {
  const spec = lawyer.specialty || 'Corporate Law';
  const templates = SPECIALTY_CASE_TEMPLATES[spec] || SPECIALTY_CASE_TEMPLATES['Corporate Law'];
  const lawyerId = lawyer.id;
  const primaryCourt = lawyer.primaryCourt || 'Supreme Court of India';
  const courtCode = (lawyer.courtCodes || 'SCI').split(',')[0].trim() || 'SCI';
  const firmName = lawyer.firmName || 'Chambers of Advocate';

  const cases = [];
  const caseCount = Math.min(templates.length, 4);

  // Hearing dates spread across the next 3 weeks
  const today = new Date();
  const dateOffsets = [4, 8, 14, 21, 28];

  for (let i = 0; i < caseCount; i++) {
    const tmpl = templates[i % templates.length];
    const client = CLIENT_NAMES[(lawyerId * 3 + i) % CLIENT_NAMES.length];
    const opposing = OPPOSING_PARTIES[(lawyerId * 5 + i * 2) % OPPOSING_PARTIES.length];
    const dVal = tmpl.disputeValues[i % tmpl.disputeValues.length];
    const stage = tmpl.stages[i % tmpl.stages.length];

    const hDate = new Date(today);
    hDate.setDate(today.getDate() + dateOffsets[i]);
    const hearingDateStr = hDate.toISOString().split('T')[0];

    const numSuffix = 100 + (lawyerId * 17 + i * 29) % 899;
    const caseNum = `${tmpl.casePrefix} ${numSuffix}/${year}`;
    const caseTitle = tmpl.titleTemplate.replace('{client}', client).replace('{opposing}', opposing);

    // Status variation (Active Hearing, Pending Arguments, Disposed / Won)
    let status = 'Active Hearing';
    if (i === 1) status = 'Pending Hearing';
    if (i === 2 && caseCount >= 3) status = 'Under Investigation';
    if (i === 3) status = 'Disposed / Favorable';

    const clientEmail = client.toLowerCase().replace(/[^a-z]/g, '.') + '@clientlegal.in';
    const clientPhone = '+91 ' + (9800000000 + (lawyerId * 98765 + i * 4321) % 99999999);

    cases.push({
      caseNumber: caseNum,
      title: caseTitle,
      lawyerId: lawyerId,
      clientName: client,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      opposingParty: opposing,
      opposingCounsel: `Chambers of ${OPPOSING_PARTIES[(i + 3) % OPPOSING_PARTIES.length].split(' ')[0]} Counsel`,
      courtCode: tmpl.courtCodeFallback || courtCode,
      courtName: primaryCourt || tmpl.courtFallback,
      bench: tmpl.bench,
      practiceArea: spec,
      relevantActs: tmpl.acts,
      nextHearingDate: hearingDateStr,
      hearingTime: (10 + (i % 4)) + ':30 AM IST',
      stage: stage,
      status: status,
      disputeValue: dVal,
      caseSummary: tmpl.summary,
      lawyerNotes: `Counsel ${lawyer.name} briefed. Lead brief prepared with senior juniors. Key precedence and statutory notifications indexed.`,
      filingDate: `2025-${String(10 + (i % 3)).padStart(2, '0')}-15`
    });
  }

  return cases;
}

/**
 * Main synchronizer to ensure:
 * 1. `cases` table exists
 * 2. `lawyerId` column exists on `users` table
 * 3. User account exists for each lawyer in `lawyers` table
 * 4. Cases exist for all 54 lawyers
 * 5. Consultations exist for all lawyers
 */
function syncLawyerCasesAndAccounts(db) {
  try {
    // 1. Create cases table if not exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caseNumber TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        lawyerId INTEGER NOT NULL,
        clientName TEXT NOT NULL,
        clientEmail TEXT NOT NULL,
        clientPhone TEXT NOT NULL,
        opposingParty TEXT NOT NULL,
        opposingCounsel TEXT DEFAULT '',
        courtCode TEXT NOT NULL,
        courtName TEXT NOT NULL,
        bench TEXT NOT NULL,
        practiceArea TEXT NOT NULL,
        relevantActs TEXT NOT NULL,
        nextHearingDate TEXT NOT NULL,
        hearingTime TEXT DEFAULT '10:30 AM IST',
        stage TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active Hearing',
        disputeValue TEXT DEFAULT '',
        caseSummary TEXT NOT NULL,
        lawyerNotes TEXT DEFAULT '',
        filingDate TEXT DEFAULT CURRENT_TIMESTAMP,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_cases_lawyer ON cases(lawyerId);
      CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
      CREATE INDEX IF NOT EXISTS idx_cases_court ON cases(courtCode);
    `);

    // Ensure notifications table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lawyerId INTEGER NOT NULL,
        consultationId INTEGER NULL,
        type TEXT DEFAULT 'booking',
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        clientName TEXT NOT NULL,
        clientEmail TEXT NOT NULL,
        clientPhone TEXT NOT NULL,
        preferredDate TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_lawyer ON notifications(lawyerId);
      CREATE INDEX IF NOT EXISTS idx_notifications_isRead ON notifications(isRead);
    `);

    // 2. Ensure lawyerId column exists on users table
    try {
      db.prepare('ALTER TABLE users ADD COLUMN lawyerId INTEGER NULL').run();
    } catch (_) {}

    // 3. Fetch all lawyers
    const lawyers = db.prepare('SELECT * FROM lawyers').all();
    if (!lawyers || lawyers.length === 0) return;

    const findUserByEmail = db.prepare('SELECT id, lawyerId, role FROM users WHERE LOWER(email) = LOWER(?)');
    const insertLawyerUser = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, isVerified, lawyerId)
      VALUES (?, ?, ?, ?, 'lawyer', 1, ?)
    `);
    const updateLawyerUser = db.prepare(`
      UPDATE users SET role = 'lawyer', lawyerId = ?, name = ? WHERE id = ?
    `);

    const checkCaseByNum = db.prepare('SELECT id FROM cases WHERE caseNumber = ?');
    const insertCaseStmt = db.prepare(`
      INSERT INTO cases (
        caseNumber, title, lawyerId, clientName, clientEmail, clientPhone,
        opposingParty, opposingCounsel, courtCode, courtName, bench,
        practiceArea, relevantActs, nextHearingDate, hearingTime, stage,
        status, disputeValue, caseSummary, lawyerNotes, filingDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const countCasesForLawyer = db.prepare('SELECT count(*) as c FROM cases WHERE lawyerId = ?');
    const countConsultsForLawyer = db.prepare('SELECT count(*) as c FROM consultations WHERE lawyerId = ?');
    const insertConsultStmt = db.prepare(`
      INSERT INTO consultations (lawyerId, userId, clientName, clientEmail, clientPhone, preferredDate, caseSummary, status)
      VALUES (?, NULL, ?, ?, ?, ?, ?, ?)
    `);

    // Standard hash for 'lawyer1234'
    const defaultPasswordHash = bcrypt.hashSync('lawyer1234', 8);

    let usersCreated = 0;
    let casesCreated = 0;
    let consultsCreated = 0;

    for (const lawyer of lawyers) {
      const email = lawyer.email.toLowerCase().trim();
      let user = findUserByEmail.get(email);

      if (!user) {
        insertLawyerUser.run(
          lawyer.name,
          email,
          defaultPasswordHash,
          lawyer.phone || '+91 98765 43210',
          lawyer.id
        );
        usersCreated++;
      } else if (user.role !== 'lawyer' || user.lawyerId !== lawyer.id) {
        updateLawyerUser.run(lawyer.id, lawyer.name, user.id);
      }

      // Check cases for this lawyer
      const existingCasesCount = countCasesForLawyer.get(lawyer.id).c;
      if (existingCasesCount === 0) {
        const generatedCases = generateCasesForLawyer(lawyer);
        for (const cs of generatedCases) {
          if (!checkCaseByNum.get(cs.caseNumber)) {
            insertCaseStmt.run(
              cs.caseNumber, cs.title, cs.lawyerId, cs.clientName, cs.clientEmail, cs.clientPhone,
              cs.opposingParty, cs.opposingCounsel, cs.courtCode, cs.courtName, cs.bench,
              cs.practiceArea, cs.relevantActs, cs.nextHearingDate, cs.hearingTime, cs.stage,
              cs.status, cs.disputeValue, cs.caseSummary, cs.lawyerNotes, cs.filingDate
            );
            casesCreated++;
          }
        }
      }

      // Check consultations for this lawyer
      const existingConsults = countConsultsForLawyer.get(lawyer.id).c;
      if (existingConsults === 0) {
        const d1 = new Date(); d1.setDate(d1.getDate() + 3);
        const d2 = new Date(); d2.setDate(d2.getDate() + 7);
        const res1 = insertConsultStmt.run(
          lawyer.id,
          'Aarav Deshmukh',
          'aarav.deshmukh@gmail.com',
          '+91 98201 54321',
          d1.toISOString().split('T')[0] + ' 11:30 AM',
          `Legal consultation inquiry regarding ${lawyer.specialty} dispute before ${lawyer.primaryCourt || 'High Court'}.`,
          'confirmed'
        );
        const res2 = insertConsultStmt.run(
          lawyer.id,
          'Meera Subramanian',
          'meera.sub@outlook.com',
          '+91 98450 67890',
          d2.toISOString().split('T')[0] + ' 03:00 PM',
          `Urgent legal advisory on contract drafting and statutory compliance review.`,
          'pending'
        );
        consultsCreated += 2;

        // Seed notifications for these bookings
        try {
          const notifInsert = db.prepare(`
            INSERT INTO notifications (
              lawyerId, consultationId, type, title, message,
              clientName, clientEmail, clientPhone, preferredDate, isRead
            ) VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?, ?)
          `);
          notifInsert.run(
            lawyer.id,
            res1.lastInsertRowid,
            'New Consultation Booking: Aarav Deshmukh',
            `Client Aarav Deshmukh has booked a consultation for ${d1.toISOString().split('T')[0]} 11:30 AM. Legal Matter: ${lawyer.specialty} proceedings.`,
            'Aarav Deshmukh',
            'aarav.deshmukh@gmail.com',
            '+91 98201 54321',
            d1.toISOString().split('T')[0] + ' 11:30 AM',
            0
          );
          notifInsert.run(
            lawyer.id,
            res2.lastInsertRowid,
            'New Consultation Booking: Meera Subramanian',
            `Client Meera Subramanian has booked a consultation for ${d2.toISOString().split('T')[0]} 03:00 PM. Legal Matter: Urgent contract drafting review.`,
            'Meera Subramanian',
            'meera.sub@outlook.com',
            '+91 98450 67890',
            d2.toISOString().split('T')[0] + ' 03:00 PM',
            0
          );
        } catch (_) {}
      }
    }

    // Ensure all existing consultations have matching notifications
    const unnotified = db.prepare(`
      SELECT c.id, c.lawyerId, c.clientName, c.clientEmail, c.clientPhone, c.preferredDate, c.caseSummary
      FROM consultations c
      LEFT JOIN notifications n ON n.consultationId = c.id
      WHERE n.id IS NULL
    `).all();
    if (unnotified.length > 0) {
      const notifInsert = db.prepare(`
        INSERT INTO notifications (
          lawyerId, consultationId, type, title, message,
          clientName, clientEmail, clientPhone, preferredDate, isRead
        ) VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?, 0)
      `);
      for (const u of unnotified) {
        notifInsert.run(
          u.lawyerId,
          u.id,
          `New Consultation Booking: ${u.clientName}`,
          `Client ${u.clientName} has scheduled a consultation for ${u.preferredDate}. Summary: ${u.caseSummary}`,
          u.clientName,
          u.clientEmail,
          u.clientPhone,
          u.preferredDate
        );
      }
    }

    console.log(` Lawyer Cases & Accounts Synced for all ${lawyers.length} lawyers:`);
    console.log(`   - Lawyer User Accounts: +${usersCreated} initialized`);
    console.log(`   - Court Cases & Dockets: +${casesCreated} seeded`);
    console.log(`   - Client Consultations: +${consultsCreated} seeded`);
  } catch (err) {
    console.error(' Error syncing lawyer cases and accounts:', err.message);
  }
}

module.exports = {
  syncLawyerCasesAndAccounts,
  generateCasesForLawyer
};


/**
 * LegalAI Intelligence Service
 * AI-Based Legal Assistant with RAG, Intent Detection & Multi-Turn Context.
 */

const fs = require('fs');
const path = require('path');

// ── 1. PRESERVED LEGAL DOMAINS CATALOG ──
const LEGAL_DOMAINS = [
  {
    id: 'tenant',
    name: 'Landlord & Tenant Law',
    specialty: 'Real Estate Law',
    courtCode: 'DEL-TIS',
    courtGuidance: 'Residential lease breaches, rent control actions under state tenancy laws, and security deposit disputes proceed before the Rent Controller / Civil Judge at District Courts such as Tis Hazari Courts.',
    keywords: ['landlord', 'tenant', 'rent', 'lease', 'eviction', 'deposit', 'security deposit', 'apartment', 'housing', 'sublet', 'habitability', 'mold', 'property', 'real estate', 'flat', 'premises'],
    rights: [
      'Right to the warranty of habitability (safe, clean, functional living conditions)',
      'Protection against retaliatory eviction or constructive eviction',
      'Statutory limits on security deposit deductions and strict return deadlines (commonly 14–30 days)',
      'Requirement of formal written notice prior to entering or termination of tenancy'
    ],
    actions: [
      'Document all communications in writing (certified mail or email with delivery receipts)',
      'Photograph and video the exact condition of the premises with date/time stamps',
      'Send a formal demand letter citing local housing code and state deposit statutes',
      'Refrain from self-help withholding of rent without statutory escrow compliance'
    ],
    documents: ['Lease agreement & addendums', 'Move-in/move-out inspection checklist', 'Bank statements & rent receipts', 'Written repair requests & notices'],
    attorneyRole: 'Tenant Rights & Real Estate Attorney'
  },
  {
    id: 'criminal',
    name: 'Criminal Defense & Rights',
    specialty: 'Criminal Law',
    courtCode: 'DEL-PAT',
    courtGuidance: 'Offences under Bharatiya Nyaya Sanhita (BNS) / IPC, bail applications, and criminal trials proceed before the Chief Metropolitan Magistrate or District & Sessions Courts like Patiala House Courts.',
    keywords: ['criminal', 'crime', 'penal', 'defense', 'arrest', 'police', 'cop', 'jail', 'bail', 'charge', 'felony', 'misdemeanor', 'warrant', 'investigation', 'interrogation', 'dui', 'miranda', 'officer', 'custody', 'bns', 'bnss', 'fir', 'anticipatory bail'],
    rights: [
      'Constitutional right against self-incrimination under Article 20(3) of the Indian Constitution',
      'Right to legal representation and consultation with an advocate under Article 22(1)',
      'Protection against arbitrary arrest and mandatory production before a Magistrate within 24 hours',
      'Right to fair and public trial, bail consideration under statutory provisions, and copy of FIR'
    ],
    actions: [
      'Invoke your constitutional right to legal counsel before answering custodial questions',
      'Demand immediate production before a Judicial Magistrate within 24 hours of arrest',
      'Do not sign blank papers or involuntary statements without your advocate present',
      'Contact a criminal defense advocate immediately to move for regular or anticipatory bail'
    ],
    documents: ['First Information Report (FIR) copy', 'Arrest memo & remand order', 'Seizure memo & panchnama', 'Names and contacts of witnesses'],
    attorneyRole: 'Criminal Defense Specialist'
  },
  {
    id: 'corporate',
    name: 'Corporate, Business & Startup Law',
    specialty: 'Corporate Law',
    courtCode: 'NCLAT',
    courtGuidance: 'Corporate insolvency resolution, shareholder oppression & mismanagement, mergers, and corporate restructuring disputes proceed before the NCLT with appellate review before NCLAT.',
    keywords: ['corporate', 'company', 'business', 'startup', 'llc', 'corporation', 'incorporate', 'partnership', 'equity', 'shares', 'founder', 'investor', 's-corp', 'c-corp', 'venture', 'bylaws', 'operating agreement', 'merger', 'acquisition', 'nclt', 'nclat', 'ibc', 'insolvency', 'director'],
    rights: [
      'Limited personal liability shielding owners from enterprise obligations',
      'Ownership governance determined by operating agreements and corporate bylaws',
      'Fiduciary duties owed by directors, managers, and controlling members',
      'Statutory inspection rights of books, records, and financial statements'
    ],
    actions: [
      'Select the appropriate entity structure (Private Limited Company, LLP, or Partnership)',
      'Draft a comprehensive Shareholders Agreement (SHA) establishing vesting, voting, and drag/tag-along terms',
      'Maintain strict separation between corporate and personal finances to prevent piercing corporate veil',
      'File for trademark protection and execute Intellectual Property Assignment Agreements'
    ],
    documents: ['Articles of Association (AOA) & MOA', 'Shareholders Agreement (SHA) / LLP Agreement', 'Certificate of Incorporation & PAN/TAN', 'Cap table & share subscription certificates'],
    attorneyRole: 'Corporate & Venture Counsel'
  },
  {
    id: 'family',
    name: 'Family & Domestic Relations Law',
    specialty: 'Family Law',
    courtCode: 'MUM-SES',
    courtGuidance: 'Matrimonial disputes, divorce proceedings under personal/Special Marriage laws, and child custody under the Guardians and Wards Act proceed before the Family Courts and City Civil Court.',
    keywords: ['family', 'matrimonial', 'divorce', 'custody', 'child support', 'alimony', 'spousal support', 'visitation', 'prenup', 'prenuptial', 'separation', 'paternity', 'guardian', 'parenting plan', 'marriage', 'maintenance', 'domestic violence', 'pwdva', 'husband', 'wife', 'spouse'],
    rights: [
      'Right to maintenance and permanent alimony under Section 24/25 of HMA or Section 125 CrPC / BNSS',
      'Determination of child custody evaluated under the paramount consideration of the child\'s welfare',
      'Protection orders and residence orders under Protection of Women from Domestic Violence Act (PWDVA)',
      'Equal right to stridhan and partition of ancestral coparcenary properties'
    ],
    actions: [
      'Compile complete financial disclosures including income tax returns, salary slips, and assets',
      'Maintain an objective journal documenting communications, shared expenses, and child schooling',
      'Explore court-annexed mediation for amicable settlement of custody and matrimonial differences',
      'Consult with an experienced family advocate before executing mutual consent divorce terms'
    ],
    documents: ['Marriage certificate & photographs', 'Past 3 years of income tax returns & bank statements', 'Asset disclosure statements and property deeds', 'Children’s medical and educational records'],
    attorneyRole: 'Family Law & Custody Attorney'
  },
  {
    id: 'employment',
    name: 'Employment & Workplace Rights',
    specialty: 'Employment Law',
    courtCode: 'KHC',
    courtGuidance: 'Workplace disputes, industrial retrenchments, gratuity claims, and employment writ appeals proceed before the Industrial Tribunal / Labour Court and the High Court.',
    keywords: ['employment', 'workplace', 'job', 'employee', 'labor', 'labour', 'fired', 'wrongful termination', 'wage', 'overtime', 'harassment', 'discrimination', 'severance', 'non-compete', 'whistleblower', 'retaliation', 'boss', 'employer', 'fmla', 'eeoc', 'posh', 'salary'],
    rights: [
      'Protection against sexual harassment in workplace under PoSH Act, 2013 with mandatory ICC inquiry',
      'Right to statutory gratuity after 5 years, provident fund (EPF), and notice pay upon termination',
      'Protection against unreasonable non-compete covenants under Section 27 of the Indian Contract Act',
      'Statutory right to full and final settlement computation within prescribed timelines'
    ],
    actions: [
      'Preserve appointment letter, employee handbook, compensation annexures, and email notices',
      'Document dated incidents of adverse treatment, unpaid salary, or arbitrary termination',
      'Submit written grievance to Internal Complaints Committee (ICC) or HR department',
      'Consult employment advocate before signing release of claims or broad separation waivers'
    ],
    documents: ['Employment agreement & offer letter', 'Appraisal records and email correspondence', 'Salary slips and Form 16 / PF statements', 'Formal termination or show-cause notice'],
    attorneyRole: 'Labor & Employment Rights Attorney'
  },
  {
    id: 'contracts',
    name: 'Contracts & Dispute Resolution',
    specialty: 'Corporate Law',
    courtCode: 'DHC',
    courtGuidance: 'Commercial disputes, contractual breaches, and arbitration enforcement petitions proceed before the Commercial Division of the High Court or Commercial District Courts.',
    keywords: ['contract', 'agreement', 'breach', 'sue', 'lawsuit', 'damages', 'clause', 'signed', 'vendor', 'refund', 'payment dispute', 'settlement', 'invoice', 'unpaid', 'arbitration', 'specific performance', 'recovery', 'money recovery', 'cheque bounce', 'section 138'],
    rights: [
      'Entitlement to expectation damages and compensation for breach under Section 73 of Indian Contract Act',
      'Right to invoke arbitration clause under Section 9 (interim relief) or Section 11 of Arbitration Act',
      'Remedies of specific performance or perpetual injunction under Specific Relief Act',
      'Statutory pre-institution mediation mechanism under the Commercial Courts Act, 2015'
    ],
    actions: [
      'Review contract for dispute resolution, jurisdiction, force majeure, and cure period provisions',
      'Issue a formal legal notice of default specifying breaches and demanding immediate cure',
      'Compile certified bank records, ledger extracts, invoices, and delivery acknowledgment proofs',
      'Initiate pre-institution commercial mediation or invoke arbitration as stipulated'
    ],
    documents: ['Executed contract, amendments, and purchase orders', 'Proof of delivery, milestones, or service completion', 'Legal demand notice and postal tracking receipts', 'Statement of accounts and computed interest claims'],
    attorneyRole: 'Civil Litigation & Commercial Contracts Attorney'
  },
  {
    id: 'civilrights',
    name: 'Civil Rights & Constitutional Protections',
    specialty: 'Civil Rights',
    courtCode: 'SCI',
    courtGuidance: 'Writs for enforcement of Fundamental Rights under Part III of the Constitution are directly maintainable before the Supreme Court of India under Article 32 or High Courts under Article 226.',
    keywords: ['civil rights', 'constitutional', 'fundamental rights', 'writ', 'petition', 'mandamus', 'habeas corpus', 'discrimination', 'free speech', 'first amendment', 'police brutality', 'excessive force', 'protest', 'equal protection', 'due process', 'voting', 'search and seizure', 'article 21', 'article 32', 'article 226', 'article 14'],
    rights: [
      'Right to petition Supreme Court directly under Article 32 (Heart and Soul of the Constitution)',
      'Article 14 right to equality before law and equal protection of laws against arbitrariness',
      'Article 19 fundamental freedoms of speech, expression, assembly, and trade',
      'Article 21 guarantee of life, personal liberty, privacy, and dignified living'
    ],
    actions: [
      'Document civil rights violation with timestamped records, badge numbers, or official orders',
      'File formal administrative complaint with State or National Human Rights Commission (NHRC)',
      'File Writ Petition under Article 226 (High Court) or Article 32 (Supreme Court) seeking mandamus or habeas corpus',
      'Engage experienced constitutional senior counsel for fundamental rights enforcement'
    ],
    documents: ['Impugned government order or notification', 'Witness affidavits and audiovisual recordings', 'Official correspondence and representation letters', 'Certified medical or forensic examination records'],
    attorneyRole: 'Constitutional & Civil Rights Litigator'
  },
  {
    id: 'ip',
    name: 'Intellectual Property & Technology Law',
    specialty: 'Intellectual Property',
    courtCode: 'DHC',
    courtGuidance: 'Patent, trademark, copyright, and trade secret infringement suits proceed before the specialized Intellectual Property Division (IPD) of High Courts like the High Court of Delhi.',
    keywords: ['ip', 'intellectual property', 'trademark', 'copyright', 'patent', 'trade secret', 'ip infringement', 'counterfeit', 'plagiarism', 'brand protection', 'licensing', 'software license'],
    rights: [
      'Exclusive statutory right to commercial use and license registered trademarks, patents, and copyrighted works',
      'Right to obtain ex parte ad-interim injunctions and search/seizure orders (Anton Piller orders)',
      'Remedies of rendition of accounts, statutory damages, and destruction of infringing goods',
      'Criminal remedies under Section 103/104 of Trade Marks Act and Section 63 of Copyright Act'
    ],
    actions: [
      'Conduct a thorough IP clearance search across official registries before commercial launch',
      'Serve Cease & Desist legal notice specifying registered registrations and infringing acts',
      'File commercial suit before the Intellectual Property Division of the competent High Court',
      'Seek appointment of Local Commissioner to seal infringing goods at manufacturer premises'
    ],
    documents: ['Trademark / Patent / Copyright registration certificates', 'Specimens of original and infringing products/logos', 'Proof of prior commercial use and turnover figures', 'Notarized invoices of infringing purchases'],
    attorneyRole: 'Intellectual Property Trial Attorney'
  },
  {
    id: 'immigration',
    name: 'Immigration & Naturalization Law',
    specialty: 'Immigration Law',
    courtCode: 'DHC',
    courtGuidance: 'Foreigners Act matters, visa challenges, OCI card issues, and deportation orders are challenged via Writ Petitions before the High Court of Delhi or Supreme Court of India.',
    keywords: ['visa', 'green card', 'citizenship', 'naturalization', 'daca', 'asylum', 'deportation', 'removal', 'immigration', 'uscis', 'ice', 'h1b', 'overstay', 'sponsor', 'oci', 'frro', 'passport'],
    rights: [
      'Article 21 protection of life and personal liberty available to citizens and foreigners alike',
      'Procedural fairness and natural justice prior to cancellation of OCI cards or deportation',
      'Statutory rights under Citizenship Act, 1955 and Passport Act, 1967',
      'Judicial review of arbitrary visa refusals or impounding of travel documents'
    ],
    actions: [
      'Maintain copies of FRRO registration, visas, passport stamps, and residential permits',
      'Submit formal representation to Ministry of Home Affairs / FRRO before legal deadlines',
      'File Writ Petition before High Court seeking urgent stay against coercive exit or deportation notices',
      'Retain immigration counsel well-versed in High Court constitutional writ jurisdiction'
    ],
    documents: ['Passports, current/expired Indian visas, or OCI card', 'FRRO registration certificates and extension requests', 'Impugned exit permit or cancellation order', 'Proof of familial ties, employment, or marital status in India'],
    attorneyRole: 'Immigration & Deportation Defense Attorney'
  },
  {
    id: 'tax',
    name: 'Tax Law & IRS Controversies',
    specialty: 'Tax Law',
    courtCode: 'ITAT',
    courtGuidance: 'Appeals against income tax assessments and cross-border transfer pricing additions proceed before the Income Tax Appellate Tribunal (ITAT), followed by High Court on substantial questions of law.',
    keywords: ['tax', 'income tax', 'taxation', 'gst', 'irs', 'audit', 'tax evasion', 'back taxes', 'tax court', 'lien', 'levy', '1099', 'deduction', 'payroll tax', 'unfiled', 'itat', 'assessment'],
    rights: [
      'Taxpayer Charter: Right to fair, courteous, and reasonable treatment by Income Tax Department',
      'Right to statutory appeal before Commissioner of Income Tax (Appeals) and ITAT',
      'Stay of demand upon payment of 20% disputed tax pending disposal of appeal',
      'High Court appeal under Section 260A on substantial questions of law'
    ],
    actions: [
      'File timely appeal before CIT(Appeals) / Faceless Appeals within 30 days of assessment order',
      'Apply for stay of disputed tax demand before the Assessing Officer or Tribunal',
      'Compile comprehensive paper book containing audited financial statements, ledger accounts, and citations',
      'Engage experienced Tax Advocate or Chartered Accountant to argue before ITAT benches'
    ],
    documents: ['Notice under Section 148 / 143(2) and Assessment Order', 'Demand notice under Section 156 and computation sheet', 'Filed Income Tax Returns (ITR-V) and audited balance sheets', 'Grounds of Appeal and Statement of Facts'],
    attorneyRole: 'Tax Controversy & Defense Attorney'
  }
];

// ── 2. STATUTORY KNOWLEDGE BASE & RAG CORPUS ──
let LEGAL_CORPUS = [];

function initLegalCorpus() {
  if (LEGAL_CORPUS.length > 0) return;

  const corpusMap = new Map();

  const c2Path = path.join(__dirname, '..', '..', 'ml', 'data', 'legal_corpus_v2.json');
  const c1Path = path.join(__dirname, '..', '..', 'ml', 'data', 'legal_corpus.json');

  if (fs.existsSync(c2Path)) {
    try {
      const c2 = JSON.parse(fs.readFileSync(c2Path, 'utf8'));
      if (Array.isArray(c2)) c2.forEach(item => corpusMap.set(item.id, item));
    } catch (e) {}
  }
  if (fs.existsSync(c1Path)) {
    try {
      const c1 = JSON.parse(fs.readFileSync(c1Path, 'utf8'));
      if (Array.isArray(c1)) c1.forEach(item => {
        if (!corpusMap.has(item.id)) corpusMap.set(item.id, item);
      });
    } catch (e) {}
  }

  // Supplementary Indian Statutory Corpus (guarantees coverage of major core codes)
  const supplementaryStatutes = [
    {
      id: 'statute_contract_elements_10',
      domain: 'Contracts Law',
      citation: 'Indian Contract Act, 1872 § 10',
      section: 'Section 10',
      title: 'Essential Elements of a Valid Contract',
      text: 'Under Section 10 of the Indian Contract Act, 1872, all agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not expressly declared to be void. The essential ingredients are: (1) Offer and acceptance, (2) Intention to create legal relationship, (3) Lawful consideration, (4) Capacity to contract (majority and sound mind), (5) Free consent (untainted by coercion, undue influence, fraud, misrepresentation, or mistake), and (6) Lawful object.',
      preconditions: [
        'Free consent under Sections 13–19 without coercion or fraud',
        'Competent parties of age of majority and sound mind under Section 11',
        'Lawful consideration and object not opposed to public policy under Section 23',
        'Certainty of terms and consensus ad idem'
      ],
      exceptions: [
        'Agreements entered into by minors are void ab initio (Mohori Bibee v. Dharmodas Ghose)',
        'Agreements in restraint of trade (§ 27) or marriage (§ 26) are void by statute'
      ],
      key_elements: [
        'Consensus ad idem (meeting of the minds)',
        'Enforceable by law under Section 2(h)',
        'Breach entitles injured party to damages under Section 73'
      ],
      action_checklist: [
        'Ensure written execution with clear clauses for payment, breach, and dispute resolution',
        'Verify legal capacity and signing authority of contracting signatories'
      ]
    },
    {
      id: 'statute_contract_noncompete_27',
      domain: 'Employment Law',
      citation: 'Indian Contract Act, 1872 § 27',
      section: 'Section 27',
      title: 'Restraint of Trade & Non-Compete Enforceability',
      text: 'Under Section 27 of the Indian Contract Act, 1872, every agreement by which anyone is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. Indian courts strictly hold that post-employment non-compete clauses are void and unenforceable, as an individual cannot be restricted from earning a livelihood (Niranjan Shankar Golikari v. Century Spg. & Mfg. Co.; Percept D\'Mark v. Zaheer Khan). Only negative covenants operating during the active term of employment are valid.',
      preconditions: [
        'Agreement restraining lawful employment or profession',
        'Clause operating post-termination of employment is void per se'
      ],
      exceptions: [
        'Sale of goodwill: Exception to § 27 allows reasonable geographical/time limits upon sale of business goodwill',
        'Non-disclosure and non-solicitation of clients/employees during and post-employment can be protected'
      ],
      key_elements: [
        'Post-employment non-compete covenants are void under Indian law',
        'Confidentiality and trade secrets remain protectable through injunctions',
        'Reasonableness test applies only to sale of goodwill'
      ],
      action_checklist: [
        'Distinguish between non-compete (void post-exit) and non-disclosure of trade secrets (enforceable)',
        'Respond to employer legal notices citing Section 27 and landmark Supreme Court rulings'
      ]
    },
    {
      id: 'statute_ni_138_cheque',
      domain: 'Corporate & Banking Law',
      citation: 'Negotiable Instruments Act, 1881 § 138',
      section: 'Section 138',
      title: 'Dishonour of Cheque for Insufficiency of Funds',
      text: 'Section 138 of the Negotiable Instruments Act, 1881 criminalizes the dishonour of cheques drawn for the discharge of any debt or other liability due to insufficiency of funds or exceeding arrangements. Statutory requirements: (1) Cheque presented within 3 months of date of issuance, (2) Cheque returned unpaid by bank, (3) Demand notice issued in writing within 30 days of receiving memo of dishonour, (4) Drawer fails to make payment within 15 days of notice receipt, (5) Complaint filed before Judicial Magistrate within 30 days thereafter.',
      preconditions: [
        'Cheque issued for legally enforceable debt or liability',
        'Statutory legal demand notice issued within 30 days of memo of return',
        '15 days cure period lapsed without payment by drawer',
        'Criminal complaint filed within 1 month before JMFC / MM'
      ],
      exceptions: [
        'Cheques given purely as security or advance without existing debt do not attract § 138',
        'Disputes regarding signature forgery or lost cheque'
      ],
      key_elements: [
        'Punishment: Imprisonment up to 2 years, or fine up to twice the cheque amount, or both',
        'Presumption under Section 139 operates in favor of the holder until rebutted',
        'Compoundable offence under Section 147'
      ],
      action_checklist: [
        'Serve statutory demand notice by Registered Post AD / Speed Post within 30 days of return memo',
        'File complaint under Section 142 before the competent Metropolitan Magistrate / JMFC where drawee bank is located'
      ]
    },
    {
      id: 'statute_const_21_liberty',
      domain: 'Civil Rights',
      citation: 'Constitution of India, Article 21',
      section: 'Article 21',
      title: 'Protection of Life, Personal Liberty & Privacy',
      text: 'Article 21 of the Constitution of India guarantees that no person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has expanded Article 21 to encompass substantive due process, the right to dignity (Maneka Gandhi v. UOI), right to privacy (K.S. Puttaswamy v. UOI), right to speedy trial, right against arbitrary detention, and right to free legal aid for undertrials.',
      preconditions: [
        'State action impinging on individual life, bodily liberty, or privacy',
        'Procedure depriving liberty must be just, fair, and reasonable, not arbitrary'
      ],
      exceptions: [
        'Lawful detention authorized by valid statutory penal provisions meeting procedural safeguards',
        'Reasonable restrictions in public interest satisfying proportionality test'
      ],
      key_elements: [
        'Fundamental right available to citizens and non-citizens alike',
        'Enforceable directly through writ petitions under Article 32 (Supreme Court) or Article 226 (High Courts)'
      ],
      action_checklist: [
        'File Habeas Corpus or Mandamus writ petition if detained arbitrarily or denied basic procedural rights',
        'Seek urgent interim bail or release through High Court supervisory powers'
      ]
    },
    {
      id: 'statute_hma_13b_mutual_divorce',
      domain: 'Family Law',
      citation: 'Hindu Marriage Act, 1955 § 13B',
      section: 'Section 13B',
      title: 'Divorce by Mutual Consent & Statutory Cooling Period',
      text: 'Section 13B of the Hindu Marriage Act, 1955 allows spouses to petition the Family Court for dissolution of marriage by mutual consent on the grounds that they have been living separately for a period of one year or more, have not been able to live together, and have mutually agreed that the marriage should be dissolved. On motion made by both parties not earlier than 6 months and not later than 18 months (Second Motion), the court grants a decree of divorce. The 6-month cooling period can be waived by the court in genuine cases of irretrievable breakdown (Amardeep Singh v. Harveen Kaur).',
      preconditions: [
        'Living separately for a continuous period of at least one year',
        'Mutual consent on settlement of permanent alimony, stridhan, and child custody',
        'Filing of Joint First Motion petition before Family Court',
        'Second Motion moved between 6 and 18 months'
      ],
      exceptions: [
        'Either party may unilaterally withdraw consent prior to the passing of the final decree',
        'Court can waive the 6-month statutory waiting period if parties have settled all issues'
      ],
      key_elements: [
        'Dissolution without alleging fault or cruelty',
        'Comprehensive Memorandum of Understanding (MoU) required covering all property and maintenance claims'
      ],
      action_checklist: [
        'Draft and sign a comprehensive MoU resolving custody, maintenance, and return of stridhan',
        'File Joint Petition under Section 13B(1) before the Family Court having territorial jurisdiction'
      ]
    },
    {
      id: 'statute_commercial_12a_mediation',
      domain: 'Contracts Law',
      citation: 'Commercial Courts Act, 2015 § 12A',
      section: 'Section 12A',
      title: 'Pre-Institution Mediation in Commercial Suits',
      text: 'Section 12A of the Commercial Courts Act, 2015 mandates that a suit which does not contemplate any urgent interim relief under the Act shall not be instituted unless the plaintiff exhausts the remedy of pre-institution mediation in accordance with the rules. The Supreme Court in Patil Automation Pvt. Ltd. v. Rakheja Engineers held that Section 12A is mandatory, and any commercial suit filed without exhausting pre-institution mediation (where no urgent relief is sought) is liable to be rejected under Order VII Rule 11 CPC.',
      preconditions: [
        'Commercial dispute of specified value (above Rs. 3 Lakhs)',
        'Mandatory application to District Legal Services Authority (DLSA) for mediation',
        'Completion within 3 months (extendable by 2 months with consent)'
      ],
      exceptions: [
        'Suits where plaintiff explicitly seeks and demonstrates genuine urgent interim relief (e.g. freezing injunction, ex parte stay)',
        'Non-commercial ordinary civil suits'
      ],
      key_elements: [
        'Mandatory statutory prerequisite; failure leads to rejection of plaint',
        'Mediated settlement agreement has the same status as an arbitral award under Section 30 Arbitration Act'
      ],
      action_checklist: [
        'File application for pre-institution mediation with DLSA before filing commercial plaint',
        'If urgent ex parte injunction is required, plead specific facts justifying urgency to bypass § 12A'
      ]
    }
  ];

  supplementaryStatutes.forEach(s => corpusMap.set(s.id, s));
  LEGAL_CORPUS = Array.from(corpusMap.values());
}

initLegalCorpus();

// ── 3. INTENT CLASSIFICATION ENGINE ──
function classifyIntent(prompt, history = []) {
  const clean = (prompt || '').trim().toLowerCase();

  // 1. Greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help me', 'namaste'];
  if (greetings.some(g => clean === g || clean.startsWith(g + ' ') || clean.endsWith(' ' + g)) && clean.length < 40) {
    return { type: 'GREETING' };
  }

  // 2. Lawyer Intent (Explicitly asking to find, recommend, hire, or suggest an advocate/attorney)
  const lawyerPatterns = [
    /\b(find|recommend|suggest|need|hire|get|look(?:ing)? for|connect(?: me)? with|book|consult(?:ation)?|assign)\b.*\b(lawyers?|advocates?|attorneys?|counsels?|counselors?|solicitors?|barristers?|specialists?)\b/i,
    /\b(who can represent me|who is the best (lawyer|advocate)|lawyers? for|advocates? for|attorneys? for)\b/i,
    /\b(top|best|experienced|verified)\s+(lawyers?|advocates?|attorneys?)\b/i,
    /\b(lawyers?|advocates?|attorneys?)\s+(associated with|in|near|for|practicing)\b/i,
    /\b(contact|talk to|speak with|reach out to)\s+(a|an)?\s*(lawyer|advocate|attorney|counsel)\b/i,
    /\b(recommend|suggest)\s+someone\s+to\s+represent\b/i
  ];
  const isLawyerQuery = lawyerPatterns.some(p => p.test(clean));

  // 3. Court Intent (Explicitly asking about court jurisdiction, venue, or where to file)
  const courtPatterns = [
    /\b(which court|what court|where (to|do I|should I|can I) file|which bench|competent court|jurisdictional forum|filing venue)\b/i,
    /\b(find|recommend|suggest|show)\b.*\b(courts?|tribunals?|benches)\b/i,
    /\b(court jurisdiction|jurisdiction of .* court|powers of .* court)\b/i,
    /\b(tell me about|info on|overview of|details of)\b.*\b(court|tribunal|bench|nclat|nclt|itat|scch|jmfc)\b/i,
    /\b(is (the|this) case filed in|where is the petition filed|jurisdiction over this)\b/i,
    /\b(which magistrate|which sessions court|which high court|supreme court jurisdiction)\b/i
  ];
  const isCourtQuery = courtPatterns.some(p => p.test(clean));

  // 4. Follow-up detection
  const hasHistory = Array.isArray(history) && history.length > 0;
  const followUpSignals = [
    /\b(what about that|what about this|can you explain that|explain that more|elaborate on that|more details on this|what are the exceptions|what are the documents|what documents do i need|what is the penalty|what is the punishment|how long does that take|can i appeal this|who should i contact for that|which court does this go to|how do i file it|how do i apply for this)\b/i,
    /^(what about|and what about|how about|is that|can that|why is that|what documents|what exceptions|what penalty|who can i hire|which lawyer for this|which court for this)\b/i
  ];
  const isFollowUp = hasHistory && (
    followUpSignals.some(pattern => pattern.test(clean)) ||
    (/\b(that|this|it|the same|above|mentioned)\b/i.test(clean) && clean.split(/\s+/).length <= 12)
  );

  if (isLawyerQuery && isCourtQuery) {
    return { type: 'MIXED_LAWYER_COURT', isFollowUp };
  }
  if (isLawyerQuery) {
    return { type: 'LAWYER_QUERY', isFollowUp };
  }
  if (isCourtQuery) {
    return { type: 'COURT_QUERY', isFollowUp };
  }
  if (isFollowUp) {
    return { type: 'FOLLOW_UP' };
  }

  return { type: 'LEGAL_QUESTION' };
}

// ── 4. RAG KNOWLEDGE RETRIEVAL ──
const STOPWORDS = new Set([
  'what', 'when', 'where', 'which', 'explain', 'tell', 'about', 'under', 'with', 'from',
  'have', 'does', 'this', 'that', 'make', 'made', 'some', 'home', 'take', 'need', 'like',
  'good', 'best', 'more', 'also', 'than', 'into', 'only', 'other', 'very', 'just', 'give',
  'there', 'their', 'could', 'would', 'should', 'here', 'them', 'these', 'those', 'they'
]);

function retrieveLegalSources(query, topK = 3) {
  initLegalCorpus();
  const clean = (query || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS.has(w));
  if (tokens.length === 0) return [];

  const scored = [];

  for (const item of LEGAL_CORPUS) {
    let score = 0;
    const title = (item.title || '').toLowerCase();
    const citation = (item.citation || '').toLowerCase();
    const text = (item.text || '').toLowerCase();
    const sec = (item.section || '').toLowerCase();
    const domain = (item.domain || '').toLowerCase();

    for (const token of tokens) {
      if (citation.includes(token)) score += 12;
      else if (sec.includes(token)) score += 10;
      else if (title.includes(token)) score += 8;
      else if (domain.includes(token)) score += 5;
      else if (text.includes(token)) score += 2;
    }

    // Exact phrase match bonus
    if (citation.includes(clean) || title.includes(clean)) score += 25;
    if (text.includes(clean)) score += 15;

    // Strict threshold: score >= 8 ensures substantive keyword match
    if (score >= 8) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.item);
}

// ── 5. FOLLOW-UP CONTEXT RESOLVER ──
function resolveFollowUpContext(prompt, history) {
  if (!Array.isArray(history) || history.length === 0) return { augmentedPrompt: prompt, previousTopic: null };

  let previousUserPrompt = '';
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'user') {
      previousUserPrompt = history[i].content || history[i].message || '';
      break;
    }
  }

  const cleanPrev = previousUserPrompt.replace(/^(what is|can you explain|explain|tell me about|how does|what are the)\s+/i, '').trim();
  const augmentedPrompt = cleanPrev ? (prompt + ' regarding ' + cleanPrev) : prompt;
  return { augmentedPrompt, previousTopic: cleanPrev };
}

// ── 6. GROUNDED ANSWER SYNTHESIS ──
function synthesizeLegalAnswer(query, retrievedItem, domain, userName) {
  const userGreeting = userName ? `Hello ${userName}, regarding ` : `Regarding `;

  if (!retrievedItem && !domain) {
    return {
      category: 'Unverified Legal Query',
      isUnavailable: true,
      text: `${userGreeting}your inquiry:\n\n### ℹ️ Legal Information Notice\nI am specialized in statutory provisions, procedural codes, and verified court practice. I do not have verified statutory or precedent records concerning **"${query}"** in my legal knowledge base.\n\nTo prevent generating ungrounded or speculative legal information, I only provide verified analyses grounded in enacted codes (such as BNS 2023, BNSS 2023, CPC 1908, Indian Contract Act 1872, or Constitution of India) and verified case law.\n\nIf you have a question regarding criminal defense, landlord-tenant disputes, contracts, corporate law, matrimonial disputes, or civil rights, please specify the relevant statute or legal issue.`
    };
  }

  const item = retrievedItem;
  const cat = item ? (item.domain || item.act_name || 'Statutory Law') : (domain ? domain.name : 'Legal Intelligence');
  const citation = item ? (item.citation || item.title) : (domain ? domain.name : 'Applicable Statute');
  const mainRule = item ? item.text : (domain ? `Governed by applicable provisions of ${domain.name}.` : '');

  // Preconditions
  let precondHTML = '';
  const preconds = item?.preconditions || domain?.rights || [];
  if (preconds && preconds.length > 0) {
    precondHTML = `\n\n### ⚖️ Essential Legal Preconditions & Statutory Requirements\n` + preconds.map(p => `* **${p.split(':')[0] || 'Condition'}:** ${p}`).join('\n');
  }

  // Exceptions
  let exceptionsHTML = '';
  const exceptions = item?.exceptions || [];
  if (exceptions && exceptions.length > 0) {
    exceptionsHTML = `\n\n### ⚠️ Statutory Exceptions, Provisos & Defenses\n` + exceptions.map(e => `* **Exception:** ${e}`).join('\n');
  }

  // Action Steps
  let actionsHTML = '';
  const actions = item?.action_checklist || domain?.actions || [];
  if (actions && actions.length > 0) {
    actionsHTML = `\n\n### 📋 Immediate Practical Next Steps\n` + actions.map((a, i) => `${i + 1}. **${a.split(':')[0] || 'Step ' + (i + 1)}**: ${a}`).join('\n');
  }

  // Supersedes / Transition Notice if present
  let transitionHTML = '';
  if (item?.supersedes) {
    const s = item.supersedes;
    transitionHTML = `\n\n> 🔄 **Statutory Code Transition:** ${s.old_act} ${s.old_section} was superseded on ${item.effective_date || '1 July 2024'} by **${item.citation}**. ${s.transition_note || ''}`;
  }

  const text = `${userGreeting}**${citation}**:\n\n### 🔍 Direct Legal Answer & Statutory Principle\n${mainRule}${transitionHTML}${precondHTML}${exceptionsHTML}${actionsHTML}\n\n> ⚠️ *Disclaimer: Information provided by LegalAI Assistant is for educational and guidance purposes only and does not constitute formal attorney-client representation. Consult a licensed advocate before initiating formal legal proceedings.*`;

  return {
    category: cat,
    text,
    retrievedSources: item ? [{ citation: item.citation, title: item.title, section: item.section }] : []
  };
}

// ── 7. MATCHING LAWYERS & COURTS ON INTENT ──
function getBestLawyerAndCourt(domain, cleanPrompt = '') {
  let suggestedLawyer = null;
  let suggestedCourt = null;

  try {
    const Lawyer = require('../models/Lawyer');
    const Court = require('../models/Court');
    const { getJurisdictionRule } = require('./jurisdictionRules');

    const promptLower = (cleanPrompt || '').toLowerCase();

    // Priority extraction of specialty from prompt text
    let targetSpecialty = 'Corporate Law';
    if (promptLower.includes('criminal') || promptLower.includes('bail') || promptLower.includes('fir') || promptLower.includes('arrest')) {
      targetSpecialty = 'Criminal Law';
    } else if (promptLower.includes('property') || promptLower.includes('real estate') || promptLower.includes('tenant') || promptLower.includes('landlord')) {
      targetSpecialty = 'Real Estate Law';
    } else if (promptLower.includes('family') || promptLower.includes('divorce') || promptLower.includes('custody') || promptLower.includes('matrimonial')) {
      targetSpecialty = 'Family Law';
    } else if (promptLower.includes('employment') || promptLower.includes('labor') || promptLower.includes('labour') || promptLower.includes('termination')) {
      targetSpecialty = 'Employment Law';
    } else if (promptLower.includes('tax') || promptLower.includes('gst') || promptLower.includes('itat')) {
      targetSpecialty = 'Tax Law';
    } else if (promptLower.includes('trademark') || promptLower.includes('patent') || promptLower.includes('copyright') || promptLower.includes('ip')) {
      targetSpecialty = 'Intellectual Property';
    } else if (promptLower.includes('civil rights') || promptLower.includes('constitutional') || promptLower.includes('writ')) {
      targetSpecialty = 'Civil Rights';
    } else if (domain) {
      targetSpecialty = typeof domain === 'string' ? domain : (domain.specialty || 'Corporate Law');
    }

    let targetCourt = null;
    const allCourts = Court.findAll();

    if (promptLower) {
      targetCourt = allCourts.find(c => 
        (c.code && promptLower.includes(c.code.toLowerCase())) ||
        (c.name && promptLower.includes(c.name.toLowerCase()))
      );

      if (!targetCourt) {
        const STOPWORDS_COURT = ['court', 'courts', 'district', 'sessions', 'city', 'state', 'high', 'subordinate', 'small', 'causes', 'jmfc', 'complex', 'and', 'the', 'of', '&'];
        targetCourt = allCourts.find(c => {
          if (!c.name) return false;
          const words = c.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS_COURT.includes(w));
          if (words.length === 0) return false;
          return words.every(w => promptLower.includes(w));
        });
      }

      if (!targetCourt) {
        targetCourt = allCourts.find(c =>
          c.city && promptLower.includes(c.city.toLowerCase()) && c.jurisdiction === 'District & Sessions Court'
        );
      }
    }

    if (!targetCourt) {
      const targetCourtCode = domain ? domain.courtCode : 'DHC';
      targetCourt = Court.findByCode(targetCourtCode) || Court.findByCode('SCI') || allCourts[0];
    }

    if (targetCourt) {
      const suggestionResult = Court.getSuggestedLawyers(targetCourt.code, targetSpecialty);
      const jurRule = suggestionResult.jurisdictionRule;

      if (suggestionResult.suggestedLawyers && suggestionResult.suggestedLawyers.length > 0) {
        const topLawyer = suggestionResult.suggestedLawyers[0];
        suggestedLawyer = {
          id: topLawyer.id,
          name: topLawyer.name,
          title: topLawyer.title,
          specialty: topLawyer.specialty,
          barNumber: topLawyer.barNumber,
          experienceYears: topLawyer.experienceYears,
          firmName: topLawyer.firmName,
          city: topLawyer.city,
          state: topLawyer.state,
          hourlyRate: topLawyer.hourlyRate,
          rating: topLawyer.rating,
          reviewCount: topLawyer.reviewCount,
          avatarUrl: topLawyer.avatarUrl,
          casesWon: topLawyer.casesWon,
          successRate: topLawyer.successRate,
          matchReason: `Associated with ${targetCourt.name} specializing in ${topLawyer.specialty} (${topLawyer.experienceYears}+ yrs, ${topLawyer.successRate}% win rate). Rule: ${jurRule.title} under ${jurRule.governingActs}.`
        };
      }

      suggestedCourt = {
        id: targetCourt.id,
        code: targetCourt.code,
        name: targetCourt.name,
        jurisdiction: targetCourt.jurisdiction,
        level: targetCourt.level,
        city: targetCourt.city,
        state: targetCourt.state,
        address: targetCourt.address,
        filingSystem: targetCourt.filingSystem,
        website: targetCourt.website,
        overview: targetCourt.overview,
        jurisdictionGuidance: jurRule ? `${jurRule.ruleSummary} (${jurRule.governingActs})` : (domain ? domain.courtGuidance : targetCourt.overview)
      };
    }
  } catch (err) {
    console.error('Error fetching lawyer/court match:', err);
  }

  return { suggestedLawyer, suggestedCourt };
}

function matchesKeyword(cleanText, kw) {
  const lowerKw = kw.toLowerCase();
  if (lowerKw.includes(' ')) {
    return (' ' + cleanText + ' ').includes(' ' + lowerKw + ' ');
  }
  const words = cleanText.toLowerCase().split(/[^a-z0-9]+/);
  return words.includes(lowerKw);
}

function identifyLegalCategory(text) {
  const clean = (text || '').toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const domain of LEGAL_DOMAINS) {
    let score = 0;
    for (const kw of domain.keywords) {
      if (matchesKeyword(clean, kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = domain;
    }
  }

  return maxScore > 0 ? bestMatch : null;
}

function handleConversational(prompt, userName) {
  const clean = prompt.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help', 'namaste'];
  
  const isGreeting = greetings.some(g => clean === g || clean.startsWith(g + ' ') || clean.endsWith(' ' + g));
  
  if (isGreeting && clean.length < 35) {
    const greetingName = userName ? `, ${userName}` : '';
    return {
      category: 'General Assistant',
      isGreeting: true,
      text: `Hello${greetingName}! I am your **LegalAI Intelligent Assistant**, engineered to provide immediate legal clarity, procedural direction, and statutory research.\n\n### How I Can Assist You:\n* **Legal Questions & Statutes:** Clarify provisions under Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), Indian Contract Act, CPC, and Constitution of India.\n* **Rights & Deadlines:** Identify critical legal protections, notice requirements, and statutory limitation periods.\n* **Actionable Next Steps:** Practical procedural checklists and evidentiary preservation.\n* **Lawyer & Court Discovery:** When requested, suggest verified advocates and competent court venues for your specific dispute.\n\n*What legal question or matter would you like to examine today?*`
    };
  }
  return null;
}

// ── 8. MAIN PROCESS LEGAL QUERY FUNCTION ──
/**
 * Main AI Assistant processor function
 * @param {object} params { prompt, user, history }
 * @returns {Promise<object>}
 */
async function processLegalQuery({ prompt, user = null, history = [] }) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Valid prompt text is required.');
  }

  const cleanPrompt = prompt.trim();
  const userName = user?.name || null;

  // 1. Check for quick conversational greetings
  const conversational = handleConversational(cleanPrompt, userName);
  if (conversational) {
    return {
      text: conversational.text,
      category: conversational.category,
      suggestedLawyer: null,
      suggestedCourt: null,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Intent Detection
  const intent = classifyIntent(cleanPrompt, history);

  // 3. Follow-up Context Resolution if referential
  let queryForSearch = cleanPrompt;
  let previousTopicNote = '';
  if (intent.type === 'FOLLOW_UP' || intent.isFollowUp) {
    const resolved = resolveFollowUpContext(cleanPrompt, history);
    queryForSearch = resolved.augmentedPrompt;
    if (resolved.previousTopic) {
      previousTopicNote = `*(Continuing context: ${resolved.previousTopic})*\n\n`;
    }
  }

  // 4. Retrieve Grounded Legal Sources from Corpus
  const retrievedSources = retrieveLegalSources(queryForSearch, 2);
  const topSource = retrievedSources[0] || null;
  const domain = identifyLegalCategory(queryForSearch) || (topSource ? identifyLegalCategory(topSource.domain || '') : null);

  // 5. Branch based on Intent:
  // A) LAWYER QUERY ONLY (User explicitly asked to find/recommend a lawyer)
  if (intent.type === 'LAWYER_QUERY') {
    const { suggestedLawyer } = getBestLawyerAndCourt(domain, cleanPrompt);
    const lawyerInfo = suggestedLawyer
      ? `### 👨‍⚖️ Recommended Verified Advocate\nBased on your requirement in **${suggestedLawyer.specialty}**, we recommend consulting **${suggestedLawyer.name}** (${suggestedLawyer.title}).\n\n* **Bar Registration:** ${suggestedLawyer.barNumber}\n* **Chambers:** ${suggestedLawyer.firmName} (${suggestedLawyer.city}, ${suggestedLawyer.state})\n* **Experience:** ${suggestedLawyer.experienceYears}+ years with a verified ${suggestedLawyer.successRate}% courtroom win rate.\n* **Match Justification:** ${suggestedLawyer.matchReason}\n\nYou can book a direct consultation or view full bar credentials using the card below.`
      : `### 👨‍⚖️ Advocate Directory Guidance\nWe recommend engaging a verified advocate specializing in **${domain ? domain.specialty : 'this practice area'}**. You can browse all verified bar council advocates on our dedicated Find Lawyers page.`;

    return {
      text: lawyerInfo,
      category: domain ? domain.name : 'Advocate Recommendation',
      suggestedLawyer,
      suggestedCourt: null, // DO NOT return court when only lawyer was asked
      retrievedSources: [],
      timestamp: new Date().toISOString()
    };
  }

  // B) COURT QUERY ONLY (User explicitly asked which court / where to file)
  if (intent.type === 'COURT_QUERY') {
    const { suggestedCourt } = getBestLawyerAndCourt(domain, cleanPrompt);
    const courtInfo = suggestedCourt
      ? `### 🏛️ Competent Court & Jurisdictional Venue\nFor matters involving **${domain ? domain.name : 'this dispute'}**, the competent judicial forum is **${suggestedCourt.name}**.\n\n* **Court Level:** ${suggestedCourt.level || suggestedCourt.jurisdiction}\n* **Territorial Forum:** ${suggestedCourt.city}, ${suggestedCourt.state}\n* **Statutory Guidance:** ${suggestedCourt.jurisdictionGuidance}\n* **E-Filing Portal:** ${suggestedCourt.filingSystem || 'State e-Courts portal'}\n\nYou can inspect court profile, map coordinates, and e-filing details using the court card below.`
      : `### 🏛️ Jurisdictional Guidance\nJurisdiction is governed by territorial situs and pecuniary limits under the Code of Civil Procedure, 1908 or Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023. You can explore all 97 courts across India in our Courts Directory.`;

    return {
      text: courtInfo,
      category: domain ? domain.name : 'Judicial Jurisdiction',
      suggestedLawyer: null, // DO NOT return lawyer when only court was asked
      suggestedCourt,
      retrievedSources: [],
      timestamp: new Date().toISOString()
    };
  }

  // C) MIXED QUERY (User explicitly asked for BOTH lawyer and court)
  if (intent.type === 'MIXED_LAWYER_COURT') {
    const { suggestedLawyer, suggestedCourt } = getBestLawyerAndCourt(domain, cleanPrompt);
    const mixedInfo = `### ⚖️ Recommended Counsel & Competent Court Venue\n\n* **Recommended Advocate:** ${suggestedLawyer ? suggestedLawyer.name + ' (' + suggestedLawyer.specialty + ')' : 'Specialist counsel in ' + (domain ? domain.specialty : 'this field')}\n* **Competent Court:** ${suggestedCourt ? suggestedCourt.name + ' (' + suggestedCourt.jurisdiction + ')' : 'District & Sessions Court'}\n\nReview the interactive cards below for consultation booking and court details.`;

    return {
      text: mixedInfo,
      category: domain ? domain.name : 'Legal & Judicial Match',
      suggestedLawyer,
      suggestedCourt,
      retrievedSources: [],
      timestamp: new Date().toISOString()
    };
  }

  // D) GENERAL LEGAL QUESTION OR FOLLOW-UP (The core user request)
  // MUST answer the actual question using the knowledge base.
  // MUST NOT automatically display lawyer or court cards!
  const answer = synthesizeLegalAnswer(cleanPrompt, topSource, domain, userName);
  const finalText = previousTopicNote + answer.text;

  return {
    text: finalText,
    category: answer.category,
    suggestedLawyer: null, // Crucial: No automatic lawyer card!
    suggestedCourt: null,  // Crucial: No automatic court card!
    retrievedSources: answer.retrievedSources || [],
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processLegalQuery,
  identifyLegalCategory,
  LEGAL_DOMAINS,
  getBestLawyerAndCourt
};

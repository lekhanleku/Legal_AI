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
    },
    {
      id: 'statute_bns_103_murder',
      domain: 'Criminal Law',
      citation: 'Bharatiya Nyaya Sanhita, 2023 § 103 (formerly Indian Penal Code, 1860 § 302)',
      section: 'Section 103',
      title: 'Punishment for Murder & Intentional Homicide',
      text: 'Section 103 of the Bharatiya Nyaya Sanhita, 2023 prescribes punishment for murder (previously Section 302 of the Indian Penal Code). Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Sub-section (2) provides that when a group of five or more persons acting in concert commits murder on grounds of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
      preconditions: [
        'Act committed with the intention of causing death under Section 101 BNS',
        'Act done with intention of causing such bodily injury as offender knows is likely to cause death',
        'Bodily injury intended to be inflicted is sufficient in the ordinary course of nature to cause death',
        'Act is so imminently dangerous that it must in all probability cause death'
      ],
      exceptions: [
        'Grave and sudden provocation depriving power of self-control without premeditation',
        'Right of private defence exercised in good faith without exceeding legal limits',
        'Lawful act by public servant acting for advancement of public justice',
        'Sudden fight in the heat of passion upon a sudden quarrel without premeditation'
      ],
      key_elements: [
        'Cognizable, non-bailable, and triable exclusively by Court of Session',
        'Trial requires rigorous proof beyond reasonable doubt',
        'Forensic autopsy, ballistic evidence, and eyewitness corroboration essential'
      ],
      action_checklist: [
        'Engage senior criminal defense counsel immediately upon arrest or arraignment',
        'Secure certified copies of FIR, inquest report, post-mortem report, and seizure memos',
        'Move for bail before the Sessions Court or High Court under BNSS § 483 (formerly CrPC § 439)'
      ]
    },
    {
      id: 'statute_bns_69_false_promise_marriage',
      domain: 'Criminal Law',
      citation: 'Bharatiya Nyaya Sanhita, 2023 § 69',
      section: 'Section 69',
      title: 'Sexual Intercourse by Employing Deceitful Means or False Promise of Marriage',
      text: 'Section 69 of the Bharatiya Nyaya Sanhita, 2023 introduces a distinct statutory offence punishing sexual intercourse by deceitful means. Whoever, by deceitful means or making by promise to marry to a woman without any intention of fulfilling the same, and has sexual intercourse with her, such sexual intercourse not amounting to the offence of rape, shall be punished with imprisonment of either description for a term which may extend to ten years and shall also be liable to fine. Deceitful means include false promise of employment or promotion, inducement, or marrying after suppressing one\'s identity.',
      preconditions: [
        'Sexual intercourse took place between accused and complainant',
        'Accused employed deceitful means, including false promise to marry made without any intention to fulfill it from inception',
        'Complainant consented solely under the influence of the deceit or false inducement',
        'Offence does not satisfy the criteria of non-consensual rape under Section 63 BNS'
      ],
      exceptions: [
        'Genuine consensual relationship with mutual intention to marry where marriage subsequently could not take place due to subsequent unavoidable circumstances or family opposition (Pradeep Kumar v. State of Bihar)',
        'Absence of fraudulent intention at the inception of the relationship'
      ],
      key_elements: [
        'Punishment: Imprisonment up to 10 years and fine',
        'Requires proof that the promise was fraudulent from the very beginning, not a mere breach of promise',
        'Cognizable and non-bailable trial'
      ],
      action_checklist: [
        'Preserve electronic communications (WhatsApp chats, call logs, emails) showing genuine relationship history',
        'File for anticipatory bail under Section 482 BNSS before the Sessions Court or High Court',
        'If false or vindictive, petition High Court under Section 528 BNSS (formerly Section 482 CrPC) for quashing'
      ]
    },
    {
      id: 'statute_bns_85_cruelty_498a',
      domain: 'Criminal & Matrimonial Law',
      citation: 'Bharatiya Nyaya Sanhita, 2023 §§ 85, 86 (formerly Indian Penal Code, 1860 § 498A)',
      section: 'Section 85',
      title: 'Husband or Relative of Husband Subjecting Woman to Cruelty',
      text: 'Sections 85 and 86 of the Bharatiya Nyaya Sanhita, 2023 criminalize cruelty against a married woman by her husband or relatives of the husband (previously Section 498A of the IPC). Cruelty is defined under Section 86 as: (a) Any wilful conduct of such nature as is likely to drive the woman to commit suicide or cause grave injury or danger to life, limb or health (mental or physical); or (b) Harassment of the woman where such harassment is with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security.',
      preconditions: [
        'Complainant is legally married to the accused or relative of the husband',
        'Complainant subjected to wilful cruelty, physical injury, mental torture, or unlawful dowry demands',
        'Direct connection between harassment and coercion for property or dowry'
      ],
      exceptions: [
        'General, omnibus, or vague allegations against distant in-laws without specific overt acts are quashable (Preeti Gupta v. State of Jharkhand; Kahkashan Kausar v. State of Bihar)',
        'Ordinary marital friction, wear and tear of married life does not constitute cruelty'
      ],
      key_elements: [
        'Punishment: Imprisonment up to 3 years and fine',
        'Arrest subject to strict compliance with Section 35 BNSS and Arnesh Kumar guidelines',
        'Mediation before Crime Against Women (CAW) Cell / Mahila Police Station prior to formal FIR'
      ],
      action_checklist: [
        'Attend conciliation / counselling sessions before the CAW Cell with supporting documents',
        'If FIR is registered, seek anticipatory bail under BNSS § 482 for accused family members',
        'Explore comprehensive mutual settlement through court-annexed mediation'
      ]
    },
    {
      id: 'statute_bnss_173_fir',
      domain: 'Criminal Procedure',
      citation: 'Bharatiya Nagarik Suraksha Sanhita, 2023 § 173 (formerly Code of Criminal Procedure, 1973 § 154)',
      section: 'Section 173',
      title: 'Registration of First Information Report (FIR) & Zero FIR',
      text: 'Section 173 of the Bharatiya Nagarik Suraksha Sanhita, 2023 governs the registration of First Information Reports (FIRs) relating to cognizable offences. Key statutory reforms: (1) Mandatory registration of FIR irrespective of the area where the crime was committed (Zero FIR), transferrable to the territorial police station within 15 days; (2) Information may be given electronically (e-FIR), signed within 3 days; (3) For offences punishable with 3 to 7 years, preliminary enquiry may be conducted within 14 days with prior permission of Deputy Superintendent of Police before registering FIR; (4) Remedy for refusal to register FIR lies before the Superintendent of Police under § 173(4), followed by application to the Magistrate under § 175(3).',
      preconditions: [
        'Information disclosed relates to the commission of a cognizable offence (Lalita Kumari v. Govt. of UP)',
        'Information reduced to writing and read over to the informant',
        'Copy of FIR must be furnished to informant immediately free of cost'
      ],
      exceptions: [
        'Preliminary enquiry permissible within 14 days for offences punishable between 3 and 7 years to ascertain if a cognizable offence is disclosed',
        'Non-cognizable offences recorded in Non-Cognizable Report (NCR) under Section 174 BNSS without automatic police investigation'
      ],
      key_elements: [
        'Zero FIR mechanism ensures immediate protection of victims without jurisdictional delay',
        'Remedy on police refusal: Written complaint to SP / DCP (§ 173(4)), then application to Judicial Magistrate (§ 175(3))',
        'Mandatory supply of free copy of FIR to victim / complainant'
      ],
      action_checklist: [
        'File written complaint at the local police station or through the official State Police e-FIR portal',
        'Demand acknowledgment stamp and zero-cost certified copy of the registered FIR',
        'If police refuse, send complaint by registered post to Superintendent of Police under § 173(4) BNSS'
      ]
    },
    {
      id: 'statute_bnss_35_arrest_guidelines',
      domain: 'Criminal Procedure',
      citation: 'Bharatiya Nagarik Suraksha Sanhita, 2023 § 35 (formerly Code of Criminal Procedure, 1973 § 41A)',
      section: 'Section 35',
      title: 'Arrest Safeguards, Notice of Appearance & Arnesh Kumar Protections',
      text: 'Section 35 of the Bharatiya Nagarik Suraksha Sanhita, 2023 establishes mandatory procedural safeguards governing police arrest powers. For offences punishable with imprisonment up to 7 years, police officer shall not arrest automatically unless specific necessity criteria are met (preventing committing further offences, proper investigation, tampering with evidence, or threatening witnesses). In all other cases, police must issue a formal Notice of Appearance requiring the person to appear before the investigating officer. Arrest without satisfying statutory necessity criteria subjects the officer to departmental action and contempt of court (Arnesh Kumar v. State of Bihar).',
      preconditions: [
        'Offence punishable with imprisonment for a term which may be less than 7 years or extend to 7 years',
        'Police officer must record reasons in writing justifying whether arrest is necessary or not',
        'Formal written Notice of Appearance served upon accused specifying date and venue'
      ],
      exceptions: [
        'Offences punishable with imprisonment exceeding 7 years or death / life imprisonment allow direct arrest on reasonable suspicion',
        'Arrest permissible if accused fails to comply with terms of notice of appearance or refuses to identify themselves'
      ],
      key_elements: [
        'Notice of appearance replaces routine arrest for minor and intermediate offences',
        'Magistrate must verify reasons recorded by police before authorizing police or judicial remand',
        'Arrest memo must be attested by at least one respectable member of the locality or family member'
      ],
      action_checklist: [
        'Upon receipt of Section 35 notice, attend investigation with written acknowledgment of compliance',
        'Do not evade or refuse to join investigation, which would create grounds for custodial arrest',
        'Carry advocate during interrogation under Section 38 BNSS / Article 22(1) safeguards'
      ]
    },
    {
      id: 'statute_bsa_61_electronic_evidence',
      domain: 'Evidence & Cyber Law',
      citation: 'Bharatiya Sakshya Adhiniyam, 2023 §§ 61, 63 (formerly Indian Evidence Act, 1872 § 65B)',
      section: 'Section 61',
      title: 'Admissibility of Electronic Records & Mandatory Certificate Requirement',
      text: 'Section 61 and 63 of the Bharatiya Sakshya Adhiniyam, 2023 govern the admissibility of electronic records in judicial proceedings (previously Section 65B of the Indian Evidence Act). An electronic record (emails, WhatsApp messages, server logs, CCTV footage, SMS, audio recordings) is deemed to be a document and is admissible in evidence without further proof or production of the original device, provided it is accompanied by a Certificate signed by a person in official management or lawful control of the device / computer system. The Supreme Court in Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal affirmed that production of a valid certificate is a mandatory condition precedent for admissibility of secondary electronic records.',
      preconditions: [
        'Computer output produced during regular lawful use of computer / device',
        'Device was operating properly or non-operation did not affect record accuracy',
        'Mandatory Certificate under Section 63 signed by authorized person or forensic expert specifying device particulars'
      ],
      exceptions: [
        'Original electronic device itself produced in court (e.g. actual phone, server drive) does not require a secondary certificate',
        'Party unable to procure certificate despite best efforts can apply to court under CPC / BNSS for witness summons'
      ],
      key_elements: [
        'Printouts and digital copies are inadmissible in criminal or civil trial without Section 63 Certificate',
        'Certificate must identify the electronic record, describe device, and state particulars of lawful operation',
        'Applies strictly to all computer printouts, hard disc images, and digital call detail records (CDRs)'
      ],
      action_checklist: [
        'Draft and notarize Section 63 BSA Certificate simultaneously when filing electronic records in court',
        'Preserve hash values (SHA-256) and complete metadata of digital files to defeat tampering allegations',
        'Engage certified forensic examiner under Section 39 BSA if digital authenticity is challenged'
      ]
    },
    {
      id: 'statute_rera_18_delay_possession',
      domain: 'Real Estate & Property Law',
      citation: 'Real Estate (Regulation and Development) Act, 2016 (RERA) § 18',
      section: 'Section 18',
      title: 'Builder Delay in Handing Over Possession & Buyer Refund Rights',
      text: 'Section 18 of the Real Estate (Regulation and Development) Act, 2016 (RERA) provides statutory remedies to homebuyers when a promoter fails to complete or give possession of an apartment, plot or building in accordance with the terms of the agreement for sale. Homebuyer has two distinct statutory options: (1) Withdraw from the project: Promoter is liable to return the entire amount received along with interest at prescribed rates (State SBI MCLR + 2%) and compensation; or (2) Remain in the project: Promoter is liable to pay interest for every month of delay until the handing over of possession. The Supreme Court in Imperia Structures Ltd. v. Anil Patni held that RERA remedies are in addition to consumer forum remedies.',
      preconditions: [
        'Promoter failed to hand over physical possession by date stipulated in registered Builder-Buyer Agreement',
        'Homebuyer has complied with payment schedule or demonstrated valid cause for withholding',
        'Project registered under State RERA Authority'
      ],
      exceptions: [
        'Force majeure delays strictly limited to war, flood, drought, fire, cyclone, or earthquake affecting development',
        'Delays caused by homebuyer\'s persistent default in payment milestones after valid demand notices'
      ],
      key_elements: [
        'Promoter must refund entire principal amount plus statutory interest within 60 days of order',
        'Homebuyer can choose between full refund with interest OR monthly delay compensation till possession',
        'Recovery certificate issued by RERA executed as arrears of land revenue through District Collector'
      ],
      action_checklist: [
        'Collate Builder-Buyer Agreement, payment receipts, demand notices, and occupancy certificate status',
        'File complaint in Form M before the Adjudicating Officer / RERA Authority of the concerned state',
        'Demand refund with interest or monthly interest compensation under Section 18 RERA'
      ]
    },
    {
      id: 'statute_pwdva_12_domestic_violence',
      domain: 'Family & Matrimonial Law',
      citation: 'Protection of Women from Domestic Violence Act, 2005 (PWDVA) §§ 12, 17, 18, 19, 20',
      section: 'Section 12',
      title: 'Application for Reliefs Against Domestic Violence & Right to Shared Household',
      text: 'Section 12 of the Protection of Women from Domestic Violence Act, 2005 (PWDVA) enables an aggrieved woman or Protection Officer to present an application to the Magistrate seeking one or more statutory reliefs. Crucial reliefs: (1) Right to reside in a shared household under Section 17, regardless of whether she has any legal title; (2) Protection orders under Section 18 restraining domestic violence or entry into workplace; (3) Residence orders under Section 19 preventing dispossession or directing husband to secure alternate accommodation; (4) Monetary relief and monthly maintenance under Section 20 for expenses and loss of earnings; (5) Custody orders under Section 21; (6) Compensation orders under Section 22 for emotional distress and physical torture.',
      preconditions: [
        'Aggrieved person is or has been in a domestic relationship with respondent living together in shared household',
        'Respondent subjected aggrieved person to domestic violence (physical, verbal, emotional, economic, or sexual abuse)',
        'Domestic Incident Report (DIR) prepared by Protection Officer or Service Provider considered by Magistrate'
      ],
      exceptions: [
        'Right to shared household does not authorize harassing elderly parents where woman never lived in joint domestic relationship (Satish Chander Ahuja v. Sneha Ahuja)',
        'Frivolous complaints without domestic relationship are dismissed'
      ],
      key_elements: [
        'Magistrate must fix first hearing within 3 days and endeavor to dispose within 60 days',
        'Ex parte interim orders can be granted under Section 23 upon affidavit',
        'Breach of protection order is a cognizable and non-bailable criminal offence under Section 31'
      ],
      action_checklist: [
        'File complaint before the Metropolitan Magistrate / Judicial Magistrate First Class having jurisdiction',
        'Seek urgent ex parte protection order (§ 18) and interim residence order (§ 19) to prevent lockout',
        'Submit detailed affidavit of assets and liabilities under Rajnesh v. Neha guidelines for interim maintenance'
      ]
    },
    {
      id: 'statute_hsa_6_daughter_coparcenary',
      domain: 'Property & Family Law',
      citation: 'Hindu Succession Act, 1956 § 6 (as amended by 2005 Amendment Act)',
      section: 'Section 6',
      title: 'Equal Coparcenary Rights of Daughters in Ancestral Joint Hindu Property',
      text: 'Section 6 of the Hindu Succession Act, 1956 (substituted by Act 39 of 2005) confers equal coparcenary rights on daughters by birth in Joint Hindu Mitakshara coparcenary property. The daughter of a coparcener shall by birth become a coparcener in her own right in the same manner as the son, have the same rights in the coparcenary property as she would have had if she had been a son, and be subject to the same liabilities. In landmark judgment Vineeta Sharma v. Rakesh Sharma (2020) 9 SCC 1, a three-judge bench of the Supreme Court held that the coparcenary rights of daughters are by birth and operate retroactively, irrespective of whether the father was alive on the date of amendment (9 September 2005).',
      preconditions: [
        'Parties are governed by Hindu Mitakshara coparcenary law',
        'Property in question is ancestral coparcenary property inherited through male lineage',
        'Daughter is alive at the time of claiming partition or succession opens'
      ],
      exceptions: [
        'Registered partition or partition effected by decree of court prior to 20 December 2004 remains undisturbed',
        'Self-acquired property of father is governed by Section 8 (general succession) or testamentary will, not coparcenary'
      ],
      key_elements: [
        'Daughters have equal birthright, equal share, and can initiate partition suit during father\'s lifetime',
        'Daughter\'s children also inherit her coparcenary share upon her death',
        'Any oral partition or unregistered family arrangement after 20 December 2004 is legally ineffective against daughter\'s share'
      ],
      action_checklist: [
        'Obtain certified revenue records, Jamabandi / RTC, mutation registers, and genealogical tree (pedigree)',
        'Issue formal legal notice demanding partition and demarcation of metes and bounds',
        'File civil suit for partition and separate possession before the Civil Court having territorial jurisdiction'
      ]
    },
    {
      id: 'statute_consumer_protection_35',
      domain: 'Consumer Protection Law',
      citation: 'Consumer Protection Act, 2019 §§ 35, 47, 58, 82',
      section: 'Section 35',
      title: 'Manner of Making Consumer Complaint & Pecuniary Jurisdiction',
      text: 'Section 35 of the Consumer Protection Act, 2019 enables any consumer, registered consumer association, or Central Government to file a complaint regarding unfair trade practices, defect in goods, deficiency in service, misleading advertisements, or product liability. Pecuniary limits (notified 2021): District Commission (DCDRC) up to Rs. 50 Lakhs; State Commission (SCDRC) above Rs. 50 Lakhs up to Rs. 2 Crores; National Commission (NCDRC) exceeding Rs. 2 Crores. Consumers can file complaints online via the e-Daakhil portal from anywhere in India.',
      preconditions: [
        'Complainant purchased goods or hired services for consideration for personal use (not for commercial resale)',
        'Defect in goods, deficiency in service, overcharging, or unfair trade practice established',
        'Complaint filed within statutory limitation period of 2 years from date on which cause of action arose (§ 69)'
      ],
      exceptions: [
        'Goods or services availed for commercial purpose or resale are outside consumer commission jurisdiction',
        'Delay beyond 2 years can only be condoned upon showing sufficient and compelling cause'
      ],
      key_elements: [
        'Direct filing from home via National Consumer E-Filing System (edaakhil.nic.in)',
        'Product liability action against manufacturer, service provider, or seller for harm caused by defective product (§ 84-86)',
        'Power to award compensation, replacement, full refund with interest, and punitive damages'
      ],
      action_checklist: [
        'Send formal written grievance or legal notice to manufacturer / seller providing 15 days to rectify defect',
        'File digital complaint on edaakhil.nic.in with tax invoice, warranty card, photos, and communication proofs',
        'Pay nominal statutory court fee online based on claim valuation'
      ]
    },
    {
      id: 'statute_it_66d_cyber_fraud',
      domain: 'Cyber & Technology Law',
      citation: 'Information Technology Act, 2000 § 66D & BNS, 2023 § 318(4)',
      section: 'Section 66D',
      title: 'Punishment for Cheating by Personation Using Computer Resource & Cyber Fraud Remedies',
      text: 'Section 66D of the Information Technology Act, 2000 punishes cheating by personation by using computer resources or communication devices. Whoever, by means of any communication device or computer resource, cheats by personating, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees. For financial cyber fraud (UPI fraud, phishing, OTP scams, fake investments), victims are entitled to immediate transaction freezing under RBI guidelines and reporting through the National Cyber Crime Reporting Portal.',
      preconditions: [
        'Cheating committed using internet, smartphone, computer, email, UPI, or banking app',
        'Fraudulent deception or impersonation induced transfer of money or sensitive credentials',
        'Immediate reporting within golden hours (2 to 4 hours) crucial to freeze defrauded amounts'
      ],
      exceptions: [
        'Pure civil commercial dispute regarding service quality without cyber deception',
        'Involuntary negligence without violation of statutory IT provisions'
      ],
      key_elements: [
        'Cognizable and bailable offence under IT Act; joined with Section 318(4) BNS (non-bailable) for large frauds',
        'Emergency Citizen Financial Cyber Fraud Reporting System operates 24x7 via National Helpline 1930',
        'Under RBI Circular on Customer Liability, zero liability applies if fraud reported within 3 working days'
      ],
      action_checklist: [
        'Immediately call 1930 (National Cyber Crime Helpline) to freeze fraudulent transaction in transit',
        'Lodge formal cyber complaint at cybercrime.gov.in and download copy of Complaint Acknowledgment Number',
        'Submit written dispute letter to bank within 72 hours citing RBI Zero Liability circular to reverse charges'
      ]
    },
    {
      id: 'statute_posh_act_2013',
      domain: 'Employment & Workplace Law',
      citation: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 §§ 4, 9, 11, 13',
      section: 'Section 9',
      title: 'Complaint of Sexual Harassment at Workplace & Internal Committee (IC) Inquiry',
      text: 'The PoSH Act, 2013 provides statutory protection against sexual harassment to women at all workplaces in India. Every employer employing 10 or more workers is legally mandated to constitute an Internal Committee (IC) headed by a senior woman employee with an external NGO member. An aggrieved woman may make a written complaint to the IC within 3 months of the incident. The IC must conduct inquiry following principles of natural justice within 90 days and submit an inquiry report within 10 days thereafter. The employer must act on recommendations within 60 days.',
      preconditions: [
        'Aggrieved woman employed, visiting, or intern at workplace (organized or unorganized)',
        'Act complained of falls within statutory definition of sexual harassment (physical, verbal, or visual advances, hostile work environment)',
        'Complaint filed in writing within 3 months (extendable by 3 months with recorded reasons)'
      ],
      exceptions: [
        'Malicious or false complaint: If IC concludes complaint was false with malicious intent, action may be recommended against complainant (§ 14)',
        'Pure workplace performance review or managerial feedback without sexual undertones'
      ],
      key_elements: [
        'Interim relief during inquiry: Transfer of complainant or respondent, up to 3 months paid leave (§ 12)',
        'Strict confidentiality mandate (§ 16) with heavy penalty on employer / members for leaking identities',
        'Right to appeal against IC findings before Appellate Authority / Industrial Tribunal within 90 days (§ 18)'
      ],
      action_checklist: [
        'Submit 6 copies of written complaint along with supporting documents and names of witnesses to the IC',
        'Apply for interim protection (restraint against reporting hierarchy or interim leave) under Section 12',
        'If employer fails to constitute IC, file grievance with District Officer (Deputy Commissioner / DM)'
      ]
    },
    {
      id: 'statute_gratuity_act_4',
      domain: 'Employment Law',
      citation: 'Payment of Gratuity Act, 1972 § 4',
      section: 'Section 4',
      title: 'Statutory Eligibility for Gratuity & Calculation Formula',
      text: 'Section 4 of the Payment of Gratuity Act, 1972 provides that gratuity shall be payable to an employee on the termination of his employment after he has rendered continuous service for not less than five years: (a) On his superannuation; (b) On his retirement or resignation; or (c) On his death or disablement due to accident or disease (5-year condition waived in case of death or disablement). Gratuity is calculated at the rate of 15 days\' wages based on the rate of wages last drawn for every completed year of service: [Last Drawn Salary (Basic + DA) × 15 × Years of Service] ÷ 26.',
      preconditions: [
        'Establishment employs 10 or more persons on any day in preceding 12 months',
        'Continuous service of minimum 5 years (rendered 240 days in a year for 5 consecutive years)',
        'Termination by resignation, superannuation, retirement, or retrenchment'
      ],
      exceptions: [
        'Forfeiture: Gratuity can only be forfeited to the extent of damage caused by employee\'s riotous or disorderly conduct, or termination for moral turpitude (§ 4(6))',
        'Establishments employing fewer than 10 workers outside statutory coverage'
      ],
      key_elements: [
        'Maximum statutory tax-free gratuity ceiling is Rs. 20 Lakhs',
        'Employer must determine and disburse gratuity within 30 days from date it becomes payable',
        'If not paid within 30 days, employer must pay simple interest (currently 10% p.a.) (§ 7(3A))'
      ],
      action_checklist: [
        'Submit formal written application in Form I to employer requesting payment of gratuity upon exit',
        'If employer delays or refuses, file application in Form N before the Controlling Authority under Gratuity Act',
        'Controlling Authority issues recovery certificate to Collector with 10% compound interest'
      ]
    },
    {
      id: 'statute_rti_6_7_application',
      domain: 'Administrative & Constitutional Law',
      citation: 'Right to Information Act, 2005 §§ 6, 7, 19',
      section: 'Section 6',
      title: 'Filing Application for Information & Statutory Timelines',
      text: 'Sections 6 and 7 of the Right to Information Act, 2005 empower citizens to secure access to information under the control of public authorities in order to promote transparency and accountability. An applicant makes a request in writing or electronically specifying particulars of information sought accompanied by fee (Rs. 10). The Public Information Officer (PIO) must provide information or reject within 30 days. Where information concerns the life or liberty of a person, it must be provided within 48 hours. If refused or delayed, applicant can file First Appeal within 30 days to the First Appellate Authority (FAA), and Second Appeal to the Central/State Information Commission (CIC/SIC) within 90 days.',
      preconditions: [
        'Applicant is a citizen of India',
        'Requested institution is a "Public Authority" established under Constitution or statutory law (§ 2(h))',
        'Information exists in material record form (emails, documents, memos, orders, samples)'
      ],
      exceptions: [
        'Section 8 exemptions: Information prejudicing sovereignty of India, national security, cabinet papers, trade secrets, judicial contempt, and personal information with no public interest',
        'Exempted intelligence and security agencies under Second Schedule (§ 24) except for corruption/human rights violations'
      ],
      key_elements: [
        'Applicant is not required to give any reason for requesting the information (§ 6(2))',
        '48-hour emergency statutory deadline when life or personal liberty is at stake',
        'Penalty of Rs. 250 per day (up to Rs. 25,000) on PIO for unjustified refusal or delay (§ 20)'
      ],
      action_checklist: [
        'Draft concise RTI questions seeking specific existing files/orders, and file at rtionline.gov.in or by Speed Post',
        'If no response within 30 days, file First Appeal under Section 19(1) to the designated First Appellate Authority',
        'If still unresolved, file Second Appeal before the Central or State Information Commission under Section 19(3)'
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
  'there', 'their', 'could', 'would', 'should', 'here', 'them', 'these', 'those', 'they',
  'cookies', 'cookie', 'bake', 'recipe', 'food', 'weather', 'cricket', 'song', 'movie'
]);

// Direct statutory topic and alias mapping for guaranteed 100% precision
const TOPIC_ALIASES = [
  { match: /\b(anticipatory\s+bail|482\s*bnss|438\s*crpc|pre-arrest\s+bail)\b/i, id: 'bnss_480_482_bail' },
  { match: /\b(cheating|420\s*ipc|318\s*\(?4\)?\s*bns|dishonestly\s+inducing)\b/i, id: 'bns_318_4_cheating' },
  { match: /\b(murder|302\s*ipc|103\s*bns|intentional\s+homicide)\b/i, id: 'statute_bns_103_murder' },
  { match: /\b(false\s+promise\s+of\s+marriage|deceitful\s+means|69\s*bns)\b/i, id: 'statute_bns_69_false_promise_marriage' },
  { match: /\b(498a|cruelty\s+by\s+husband|dowry\s+harassment|85\s*bns|86\s*bns)\b/i, id: 'statute_bns_85_cruelty_498a' },
  { match: /\b(first\s+information\s+report|fir|zero\s+fir|173\s*bnss|154\s*crpc)\b/i, id: 'statute_bnss_173_fir' },
  { match: /\b(arnesh\s+kumar|notice\s+of\s+appearance|35\s*bnss|41a\s*crpc|arrest\s+guidelines)\b/i, id: 'statute_bnss_35_arrest_guidelines' },
  { match: /\b(electronic\s+records?|electronic\s+evidence|65b\s+certificate|61\s*bsa|63\s*bsa|arjun\s+panditrao)\b/i, id: 'statute_bsa_61_electronic_evidence' },
  { match: /\b(cheque\s+bounce|138\s*ni|dishonour\s+of\s+cheque|bounced\s+cheque)\b/i, id: 'statute_ni_138_cheque' },
  { match: /\b(rera|builder\s+delay|delayed\s+possession|flat\s+delay|18\s*rera)\b/i, id: 'statute_rera_18_delay_possession' },
  { match: /\b(domestic\s+violence|pwdva|shared\s+household|protection\s+order|12\s*pwdva)\b/i, id: 'statute_pwdva_12_domestic_violence' },
  { match: /\b(daughter.*coparcenary|coparcener|ancestral\s+property|vineeta\s+sharma|6\s*hsa)\b/i, id: 'statute_hsa_6_daughter_coparcenary' },
  { match: /\b(consumer\s+complaint|consumer\s+court|defective\s+(product|goods)|edaakhil|35\s*consumer)\b/i, id: 'statute_consumer_protection_35' },
  { match: /\b(cyber\s+fraud|cyber\s+crime|1930|online\s+scam|phishing|66d\s*it)\b/i, id: 'statute_it_66d_cyber_fraud' },
  { match: /\b(posh|sexual\s+harassment\s+at\s+workplace|internal\s+committee|ic\s+inquiry)\b/i, id: 'statute_posh_act_2013' },
  { match: /\b(gratuity|payment\s+of\s+gratuity|5\s+years\s+(service|employment))\b/i, id: 'statute_gratuity_act_4' },
  { match: /\b(rti|right\s+to\s+information|public\s+information\s+officer|pio)\b/i, id: 'statute_rti_6_7_application' },
  { match: /\b(mutual\s+consent\s+divorce|mutual\s+divorce|13b\s*hma|cooling\s+period)\b/i, id: 'statute_hma_13b_mutual_divorce' },
  { match: /\b(non-compete|non\s+compete|restraint\s+of\s+trade|27\s*contract)\b/i, id: 'statute_contract_noncompete_27' },
  { match: /\b(elements\s+of\s+a?\s*valid\s+contract|valid\s+contract|10\s*contract)\b/i, id: 'statute_contract_elements_10' },
  { match: /\b(pre-institution\s+mediation|commercial\s+courts?\s+act|12a\s*commercial)\b/i, id: 'statute_commercial_12a_mediation' },
  { match: /\b(article\s+21|right\s+to\s+privacy|personal\s+liberty|maneka\s+gandhi|puttaswamy)\b/i, id: 'statute_const_21_liberty' }
];

function retrieveLegalSources(query, topK = 3) {
  initLegalCorpus();
  const rawQuery = (query || '').trim();
  const clean = rawQuery.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS.has(w));
  if (tokens.length === 0) return [];

  // Check direct high-accuracy topic aliases first
  for (const alias of TOPIC_ALIASES) {
    if (alias.match.test(rawQuery)) {
      const directItem = LEGAL_CORPUS.find(item => item.id === alias.id);
      if (directItem) {
        return [directItem];
      }
    }
  }

  // Extract section numbers if present (e.g., "420", "302", "138", "482")
  const sectionNumbers = (clean.match(/\b\d+[a-z]?\b/g) || []);

  const scored = [];

  for (const item of LEGAL_CORPUS) {
    let score = 0;
    const title = (item.title || '').toLowerCase();
    const citation = (item.citation || '').toLowerCase();
    const text = (item.text || '').toLowerCase();
    const sec = (item.section || '').toLowerCase();
    const domain = (item.domain || '').toLowerCase();

    // Section number bonus
    for (const sNum of sectionNumbers) {
      if (sec.includes(sNum) || citation.includes(sNum)) {
        score += 40;
      }
    }

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

    // Strict threshold: score >= 12 ensures substantive legal relevance
    if (score >= 12) {
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

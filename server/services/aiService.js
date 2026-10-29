/**
 * LegalAI Intelligence Service
 * Specialized legal reasoning, issue spotting, and procedural advisory engine.
 */

const LEGAL_DOMAINS = [
  {
    id: 'tenant',
    name: 'Landlord & Tenant Law',
    specialty: 'Real Estate Law',
    courtCode: 'DEL-TIS',
    courtGuidance: 'Residential lease breaches, rent control actions under state tenancy laws, and security deposit disputes proceed before the Rent Controller / Civil Judge at District Courts such as Tis Hazari Courts.',
    keywords: ['landlord', 'tenant', 'rent', 'lease', 'eviction', 'deposit', 'security deposit', 'apartment', 'housing', 'sublet', 'habitability', 'mold'],
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
    keywords: ['arrest', 'police', 'cop', 'jail', 'bail', 'charge', 'felony', 'misdemeanor', 'warrant', 'investigation', 'interrogation', 'dui', 'miranda', 'officer', 'custody'],
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
    keywords: ['llc', 'corporation', 'incorporate', 'partnership', 'equity', 'shares', 'founder', 'investor', 's-corp', 'c-corp', 'venture', 'bylaws', 'operating agreement', 'merger', 'acquisition'],
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
    keywords: ['divorce', 'custody', 'child support', 'alimony', 'spousal support', 'visitation', 'prenup', 'prenuptial', 'separation', 'paternity', 'guardian', 'parenting plan', 'marriage'],
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
    keywords: ['fired', 'wrongful termination', 'wage', 'overtime', 'harassment', 'discrimination', 'severance', 'non-compete', 'whistleblower', 'retaliation', 'boss', 'employer', 'fmla', 'eeoc'],
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
    keywords: ['contract', 'agreement', 'breach', 'sue', 'lawsuit', 'damages', 'clause', 'signed', 'vendor', 'refund', 'payment dispute', 'settlement', 'invoice', 'unpaid'],
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
    keywords: ['civil rights', 'discrimination', 'free speech', 'first amendment', 'police brutality', 'excessive force', 'protest', 'equal protection', 'due process', 'voting', 'search and seizure'],
    rights: [
      'Right to petition Supreme Court directly under Article 32 (Heart and Soul of the Constitution)',
      'Article 14 right to equality before law and equal protection of laws against arbitrariness',
      'Article 19 fundamental freedoms of speech, expression, assembly, and trade',
      'Article 21 guarantee of life, personal liberty, privacy, and dignified living'
    ],
    actions: [
      'Immediately preserve video recordings, news reports, and official orders under challenge',
      'Obtain certified copies of impugned government notifications, circulars, or actions',
      'Approach the High Court under Article 226 or Supreme Court under Article 32 via Writ Petition',
      'Retain designated Senior Advocate experienced in constitutional benches'
    ],
    documents: ['Impugned government order or notification', 'Evidence of fundamental rights violation', 'Affidavit in support of Writ Petition', 'Previous representations made to public authorities'],
    attorneyRole: 'Civil Rights & Constitutional Law Attorney'
  },
  {
    id: 'injury',
    name: 'Personal Injury & Torts',
    specialty: 'Personal Injury',
    courtCode: 'DEL-TIS',
    courtGuidance: 'Motor vehicle accident claims, third-party liability, and personal negligence compensation petitions are adjudicated by the Motor Accident Claims Tribunal (MACT) at District Courts.',
    keywords: ['accident', 'car crash', 'slip and fall', 'injury', 'medical malpractice', 'insurance', 'hospital', 'negligence', 'whiplash', 'doctor error', 'concussion', 'hit and run'],
    rights: [
      'Statutory compensation for vehicular injuries and third-party loss under Motor Vehicles Act',
      'No-fault liability and enhanced structured formula compensation for permanent disability',
      'Right to reimbursement of medical expenditures, future loss of income, and pain & suffering',
      'Consumer commission remedies for gross medical negligence by healthcare providers'
    ],
    actions: [
      'Ensure prompt medical treatment and obtain Detailed Accident Report (DAR) from investigating police',
      'Collect all original hospital bills, pharmacy receipts, and diagnostic radiology scans',
      'File claim petition before the Motor Accident Claims Tribunal (MACT) having territorial jurisdiction',
      'Avoid signing premature settlement discharges with insurance surveyors without legal counsel'
    ],
    documents: ['First Information Report (FIR) and Police DAR report', 'Hospital discharge summary and medical test results', 'Original medical invoices and pharmacy bills', 'Proof of income (ITR, salary slips) to establish earnings loss'],
    attorneyRole: 'Personal Injury & Trial Attorney'
  },
  {
    id: 'ip',
    name: 'Intellectual Property & Tech Law',
    specialty: 'Intellectual Property',
    courtCode: 'DHC',
    courtGuidance: 'Patent, trademark, and copyright infringement actions are heard before the specialized Intellectual Property Division (IPD) of the High Court of Delhi.',
    keywords: ['patent', 'trademark', 'copyright', 'intellectual property', 'trade secret', 'software', 'infringement', 'dmca', 'brand', 'logo', 'licensing', 'counterfeit', 'ai model'],
    rights: [
      'Exclusive statutory monopoly over registered trademarks, patents, and copyright works',
      'Right to seek ex-parte ad-interim injunctions and appointment of Local Commissioners for search & seizure',
      'Remedies of Anton Piller orders, John Doe (Ashok Kumar) injunctions against anonymous infringers',
      'Rendition of accounts, punitive damages, and destruction of infringing counterfeit inventory'
    ],
    actions: [
      'Verify trademark registration certificate and legal proceeding certificate (LPC)',
      'Conduct trap purchases and preserve counterfeit specimens with notarized purchase invoices',
      'Issue Cease & Desist legal notice or file immediate commercial IP suit with injunction application',
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
    keywords: ['visa', 'green card', 'citizenship', 'naturalization', 'daca', 'asylum', 'deportation', 'removal', 'immigration', 'uscis', 'ice', 'h1b', 'overstay', 'sponsor'],
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
    keywords: ['tax', 'irs', 'audit', 'tax evasion', 'back taxes', 'tax court', 'lien', 'levy', '1099', 'deduction', 'payroll tax', 'unfiled'],
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

/**
 * Identify the best matching legal category based on keyword density
 */
function identifyLegalCategory(text) {
  const clean = text.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const domain of LEGAL_DOMAINS) {
    let score = 0;
    for (const kw of domain.keywords) {
      if (clean.includes(kw)) {
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

/**
 * Handle conversational greetings or basic inquiries
 */
function handleConversational(prompt, userName) {
  const clean = prompt.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do', 'help'];
  
  const isGreeting = greetings.some(g => clean === g || clean.startsWith(g + ' ') || clean.endsWith(' ' + g));
  
  if (isGreeting && clean.length < 35) {
    const greetingName = userName ? `, ${userName}` : '';
    return {
      category: 'General Assistant',
      isGreeting: true,
      text: `Hello${greetingName}! I am your **LegalAI Intelligent Assistant**, engineered to provide immediate legal clarity, procedural direction, and attorney matching.\n\n### How I Can Assist You:\n* **Issue Spotting:** Break down disputes in Employment, Criminal Defense, Landlord-Tenant, Corporate, Family, and Civil Rights.\n* **Rights & Statutes:** Identify critical legal protections and statutory deadlines.\n* **Actionable Checklists:** Specific immediate steps and evidence to preserve.\n* **Lawyer Matching:** Guide you to the right attorney specialty for a formal consultation.\n\n*What legal matter or question would you like to examine today?*`
    };
  }
  return null;
}

/**
 * Generate a specialized legal analysis response
 */
function synthesizeLegalInsight(prompt, domain, userName) {
  const userGreeting = userName ? `Hello ${userName}, based on your inquiry regarding ` : `Based on your inquiry regarding `;
  
  if (!domain) {
    return {
      category: 'General Legal Advisory',
      text: `${userGreeting}this legal situation:\n\n### 🔍 Initial Assessment & Issue Spotting\nYour situation touches upon general civil and administrative legal principles. Because legal outcomes are highly fact-dependent and subject to jurisdiction-specific statutes, establishing the factual timeline is your primary objective.\n\n### ⚖️ Universal Legal Protections\n* **Due Process:** Any formal adverse legal action typically requires formal written notice and an opportunity to respond.\n* **Statute of Limitations:** All claims have strict time limits. Delaying action can permanently forfeit your right to relief.\n* **Duty to Mitigate:** In financial or contract disputes, parties are expected to take reasonable steps to minimize escalating damages.\n\n### 📋 Immediate Actionable Recommendations\n1. **Establish a Chronological Record:** Write down a detailed, dated sequence of all events, communications, and promises made.\n2. **Preserve All Written Evidence:** Back up emails, text messages, receipts, and contracts in a secure offsite location.\n3. **Avoid Speculative Statements:** Do not make written admissions or discuss case merits on social media.\n4. **Consult a Verified Attorney:** Schedule a confidential case evaluation through the LegalAI network.\n\n### 👨‍⚖️ Recommended Next Step\nWe recommend booking a **Free Consultation** with our specialized attorneys to review the specific facts of your matter.\n\n> ⚠️ *Disclaimer: LegalAI Assistant provides informational analysis and legal information, not formal attorney-client representation. For binding legal advice tailored to your state and jurisdiction, always consult a licensed attorney.*`
    };
  }

  const rightsList = domain.rights.map(r => `* ${r}`).join('\n');
  const actionsList = domain.actions.map((a, i) => `${i + 1}. **${a.split(':')[0] || a.slice(0, 30)}**: ${a}`).join('\n');
  const docsList = domain.documents.map(d => `* ${d}`).join('\n');

  const text = `${userGreeting}**${domain.name}**, here is an executive legal assessment and strategic checklist:\n\n### 🔍 Legal Analysis & Key Issues\nYour situation involves core provisions of **${domain.name}**. In these matters, courts and tribunals scrutinize documentation, compliance with notice rules, and procedural timelines above all else.\n\n### ⚖️ Key Rights & Statutory Principles\n${rightsList}\n\n### 📋 Immediate Action Steps\n${actionsList}\n\n### 📁 Critical Evidence & Documents to Preserve\n${docsList}\n\n### 👨‍⚖️ Recommended Attorney Specialty\nFor formal representation and strategic negotiation in this matter, we recommend consulting with a **LegalAI ${domain.attorneyRole}**.\n\n> ⚠️ *Disclaimer: Information provided by LegalAI Assistant is for educational and guidance purposes only and does not create an attorney-client relationship. Laws vary by state and municipality. Consult a licensed attorney before taking legal action.*`;

  return {
    category: domain.name,
    text
  };
}

/**
 * Optional external LLM query handler (OpenAI / Gemini) if API keys are configured
 */
async function queryExternalLLM(prompt, domain, userName) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are the Lead Legal Intelligence Assistant for LegalAI, a premier legal consultation platform. 
Provide structured, highly professional legal analysis. Address the client respectfully (Client name: ${userName || 'Client'}).
Format your answer with clear markdown headers:
### 🔍 Legal Analysis & Key Issues
### ⚖️ Applicable Rights & Legal Principles
### 📋 Immediate Practical Next Steps
### 📁 Documents & Evidence to Preserve
### 👨‍⚖️ Recommended Legal Specialty
Always conclude with a concise legal disclaimer stating this is educational information, not formal attorney-client representation.`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 800
        }),
        signal: AbortSignal.timeout(6000) // 6 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return {
            category: domain ? domain.name : 'AI Legal Intelligence',
            text: content
          };
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ External LLM call skipped or timed out, falling back to built-in legal engine:', err.message);
  }
  return null;
}

/**
 * Find best matching verified attorney and competent court recommendation
 */
function getBestLawyerAndCourt(domain, cleanPrompt) {
  let suggestedLawyer = null;
  let suggestedCourt = null;

  try {
    const Lawyer = require('../models/Lawyer');
    const Court = require('../models/Court');

    const targetSpecialty = domain ? domain.specialty : 'Corporate Law';
    const lawyers = Lawyer.findAll({ specialty: targetSpecialty, limit: 1 });
    const lawyerRow = (lawyers && lawyers.length > 0) ? lawyers[0] : (Lawyer.findAll({ limit: 1 })[0] || null);

    if (lawyerRow) {
      suggestedLawyer = {
        id: lawyerRow.id,
        name: lawyerRow.name,
        title: lawyerRow.title,
        specialty: lawyerRow.specialty,
        barNumber: lawyerRow.barNumber,
        experienceYears: lawyerRow.experienceYears,
        firmName: lawyerRow.firmName,
        city: lawyerRow.city,
        state: lawyerRow.state,
        hourlyRate: lawyerRow.hourlyRate,
        rating: lawyerRow.rating,
        reviewCount: lawyerRow.reviewCount,
        avatarUrl: lawyerRow.avatarUrl,
        casesWon: lawyerRow.casesWon,
        successRate: lawyerRow.successRate,
        matchReason: `Top-rated specialist in ${lawyerRow.specialty} with ${lawyerRow.experienceYears} years of experience and ${lawyerRow.successRate}% case success rate.`
      };
    }

    const targetCourtCode = domain ? domain.courtCode : 'DHC';
    let courtRow = Court.findByCode(targetCourtCode);
    if (!courtRow) {
      courtRow = Court.findByCode('DHC') || Court.findByCode('SCI') || Court.findAll({ limit: 1 })[0];
    }

    if (courtRow) {
      suggestedCourt = {
        id: courtRow.id,
        code: courtRow.code,
        name: courtRow.name,
        jurisdiction: courtRow.jurisdiction,
        level: courtRow.level,
        city: courtRow.city,
        state: courtRow.state,
        address: courtRow.address,
        filingSystem: courtRow.filingSystem,
        website: courtRow.website,
        overview: courtRow.overview,
        jurisdictionGuidance: domain ? domain.courtGuidance : 'This court maintains general civil and federal question jurisdiction.'
      };
    }
  } catch (err) {
    console.error('Error fetching lawyer/court match:', err);
  }

  return { suggestedLawyer, suggestedCourt };
}

/**
 * Query the Python Machine Learning (Classifier) and Advanced Adaptive RAG Microservice
 */
async function queryMLAndRAGService(prompt) {
  const adaptiveUrl = process.env.ML_ADAPTIVE_URL || 'http://127.0.0.1:8000/api/rag/adaptive';
  const legacyUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/api/rag/query';

  // 1. Try modern Adaptive RAG pipeline
  try {
    const response = await fetch(adaptiveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: prompt, top_k: 3 }),
      signal: AbortSignal.timeout(6000)
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Attempt fallback to legacy query endpoint if adaptive is unavailable
    try {
      const fallbackResponse = await fetch(legacyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt, top_k: 3 }),
        signal: AbortSignal.timeout(3000)
      });
      if (fallbackResponse.ok) {
        return await fallbackResponse.json();
      }
    } catch (fallbackErr) {
      console.warn('ℹ️ Python ML/RAG microservice unavailable, using internal legal reasoning engine fallback:', fallbackErr.message);
    }
  }
  return null;
}

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

  // 2. Query Machine Learning (Classifier) & Adaptive RAG Engine
  const mlRagResult = await queryMLAndRAGService(cleanPrompt);
  if (mlRagResult && mlRagResult.success) {
    const Lawyer = require('../models/Lawyer');
    const Court = require('../models/Court');
    const targetSpecialty = mlRagResult.suggested_specialty || 'Corporate Law';
    const lawyers = Lawyer.findAll({ specialty: targetSpecialty, limit: 1 });
    const lawyerRow = (lawyers && lawyers.length > 0) ? lawyers[0] : (Lawyer.findAll({ limit: 1 })[0] || null);

    let courtRow = Court.findByCode(mlRagResult.suggested_court?.code || 'DHC');
    if (!courtRow) courtRow = Court.findByCode('DHC') || Court.findByCode('SCI') || Court.findAll({ limit: 1 })[0];

    const mlSuggestedLawyer = lawyerRow ? {
      id: lawyerRow.id,
      name: lawyerRow.name,
      title: lawyerRow.title,
      specialty: lawyerRow.specialty,
      barNumber: lawyerRow.barNumber,
      experienceYears: lawyerRow.experienceYears,
      firmName: lawyerRow.firmName,
      city: lawyerRow.city,
      state: lawyerRow.state,
      hourlyRate: lawyerRow.hourlyRate,
      rating: lawyerRow.rating,
      reviewCount: lawyerRow.reviewCount,
      avatarUrl: lawyerRow.avatarUrl,
      casesWon: lawyerRow.casesWon,
      successRate: lawyerRow.successRate,
      matchReason: `ML Specialist Match: ${lawyerRow.specialty} (${mlRagResult.confidence_percent} ML model confidence).`
    } : null;

    const mlSuggestedCourt = courtRow ? {
      id: courtRow.id,
      code: courtRow.code,
      name: courtRow.name,
      jurisdiction: courtRow.jurisdiction,
      level: courtRow.level,
      city: courtRow.city,
      state: courtRow.state,
      address: courtRow.address,
      filingSystem: courtRow.filingSystem,
      website: courtRow.website,
      overview: courtRow.overview,
      jurisdictionGuidance: `Identified by ML & RAG Engine for ${mlRagResult.category} proceedings.`
    } : null;

    return {
      text: mlRagResult.grounded_answer,
      category: mlRagResult.category,
      mlConfidence: mlRagResult.confidence,
      mlConfidencePercent: mlRagResult.confidence_percent,
      retrievedSources: mlRagResult.retrieved_sources || [],
      modelInfo: mlRagResult.model_info || null,
      routing: mlRagResult.routing || null,
      temporalValidity: mlRagResult.temporal_validity || null,
      jurisdictionProfile: mlRagResult.jurisdiction_profile || null,
      knowledgeGraphChecklists: mlRagResult.knowledge_graph_checklists || null,
      claimAttributions: mlRagResult.claim_attributions || null,
      calibratedJudgeEvaluation: mlRagResult.calibrated_judge_evaluation || null,
      laypersonView: mlRagResult.layperson_view || null,
      suggestedLawyer: mlSuggestedLawyer,
      suggestedCourt: mlSuggestedCourt,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Heuristic / Rule-based Fallback when ML service is offline
  const domain = identifyLegalCategory(cleanPrompt);
  const { suggestedLawyer, suggestedCourt } = getBestLawyerAndCourt(domain, cleanPrompt);

  const localResult = synthesizeLegalInsight(cleanPrompt, domain, userName);
  return {
    text: localResult.text,
    category: localResult.category,
    suggestedLawyer,
    suggestedCourt,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processLegalQuery,
  identifyLegalCategory,
  LEGAL_DOMAINS,
  getBestLawyerAndCourt
};

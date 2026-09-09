/**
 * LegalAI Intelligence Service
 * Specialized legal reasoning, issue spotting, and procedural advisory engine.
 */

const LEGAL_DOMAINS = [
  {
    id: 'tenant',
    name: 'Landlord & Tenant Law',
    specialty: 'Real Estate Law',
    courtCode: 'COOK-IL',
    courtGuidance: 'Residential lease breaches, habitability actions, and security deposit disputes under $10,000 proceed in the County Municipal / Small Claims Housing Division with expedited mediation protocols.',
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
    courtCode: 'MASS-SUFFOLK',
    courtGuidance: 'State misdemeanor and felony prosecutions originate in the County Superior Court Criminal Division. Federal offenses proceed in the U.S. District Court.',
    keywords: ['arrest', 'police', 'cop', 'jail', 'bail', 'charge', 'felony', 'misdemeanor', 'warrant', 'investigation', 'interrogation', 'dui', 'miranda', 'officer', 'custody'],
    rights: [
      '5th Amendment right to remain silent — you are never required to answer investigatory questions',
      '6th Amendment right to legal counsel prior to and during any interrogation',
      '4th Amendment protection against unreasonable searches without a valid signed warrant or established exception',
      'Right to a speedy, public trial and prompt arraignment (typically within 48–72 hours)'
    ],
    actions: [
      'Politely invoke your right to remain silent: "I am exercising my right to remain silent and want an attorney"',
      'Do not consent to warrantless searches of your person, vehicle, phone, or residence',
      'Never resist physically; remember names, badge numbers, and patrol vehicle identifiers',
      'Contact a criminal defense attorney or public defender immediately before discussing facts with anyone'
    ],
    documents: ['Citation or charging documents', 'Bail bond paperwork', 'Property seizure receipts', 'Names and contacts of eyewitnesses'],
    attorneyRole: 'Criminal Defense Specialist'
  },
  {
    id: 'corporate',
    name: 'Corporate, Business & Startup Law',
    specialty: 'Corporate Law',
    courtCode: 'DE-CHANCERY',
    courtGuidance: 'Corporate governance controversies, shareholder derivative suits, and equity disputes proceed in the Delaware Court of Chancery. Commercial disputes proceed in State Commercial or Federal District Court.',
    keywords: ['llc', 'corporation', 'incorporate', 'partnership', 'equity', 'shares', 'founder', 'investor', 's-corp', 'c-corp', 'venture', 'bylaws', 'operating agreement', 'merger', 'acquisition'],
    rights: [
      'Limited personal liability shielding owners from enterprise obligations',
      'Ownership governance determined by operating agreements and corporate bylaws',
      'Fiduciary duties owed by directors, managers, and controlling members',
      'Statutory inspection rights of books, records, and financial statements'
    ],
    actions: [
      'Select the appropriate entity structure (LLC for pass-through flexibility, C-Corp for institutional venture capital)',
      'Draft a comprehensive Operating Agreement / Bylaws establishing vesting, voting, and dissolution terms',
      'Maintain strict separation between corporate and personal finances to prevent piercing the corporate veil',
      'File for trademark protection and execute Proprietary Information & Inventions Agreements (PIIA)'
    ],
    documents: ['Articles of Organization / Incorporation', 'Operating Agreement or Bylaws', 'EIN confirmation from IRS', 'Cap table & stock purchase agreements'],
    attorneyRole: 'Corporate & Venture Counsel'
  },
  {
    id: 'family',
    name: 'Family & Domestic Relations Law',
    specialty: 'Family Law',
    courtCode: 'FL-11TH',
    courtGuidance: 'Marital dissolution, child custody, spousal support (alimony), and parenting plans fall under the exclusive subject-matter jurisdiction of the County Circuit Court (Family Division).',
    keywords: ['divorce', 'custody', 'child support', 'alimony', 'spousal support', 'visitation', 'prenup', 'prenuptial', 'separation', 'paternity', 'guardian', 'parenting plan', 'marriage'],
    rights: [
      'Equitable distribution or community property division of marital assets and liabilities',
      'Determination of child custody evaluated under the paramount standard of "best interests of the child"',
      'Statutory child support formulas based on parental income ratios and overnight timeshares',
      'Right to petition for protective orders in instances of domestic harassment or danger'
    ],
    actions: [
      'Compile complete financial disclosures including tax returns, retirement assets, and bank accounts',
      'Maintain an objective parenting journal detailing timeshare custody schedules and parental contributions',
      'Avoid hostile social media posts or text exchanges that can be introduced as evidence in court',
      'Consult with a certified family law attorney before signing informal custody or separation agreements'
    ],
    documents: ['Marriage certificate', 'Past 3 years of state and federal tax returns', 'Bank, investment, and mortgage records', 'Children’s medical, school, and schedule logs'],
    attorneyRole: 'Family Law & Custody Attorney'
  },
  {
    id: 'employment',
    name: 'Employment & Workplace Rights',
    specialty: 'Employment Law',
    courtCode: 'NDIL',
    courtGuidance: 'Federal Title VII discrimination, ADA, and FLSA wage-and-hour lawsuits proceed in the U.S. District Court following mandatory EEOC administrative processing. State wage claims can be heard in State Circuit Court.',
    keywords: ['fired', 'wrongful termination', 'wage', 'overtime', 'harassment', 'discrimination', 'severance', 'non-compete', 'whistleblower', 'retaliation', 'boss', 'employer', 'fmla', 'eeoc'],
    rights: [
      'Protection against unlawful discrimination based on race, sex, age, disability, religion, or pregnancy (Title VII / ADA / ADEA)',
      'Right to timely payment of earned wages, statutory overtime, and mandated meal/rest breaks',
      'Whistleblower protection against retaliation for reporting workplace safety or legal violations',
      'Statutory right to review personnel files and receive an itemized wage stub'
    ],
    actions: [
      'Preserve personnel records, performance reviews, offer letters, and termination notices',
      'Document dated incidents of adverse treatment, derogatory remarks, or wage discrepancies',
      'File an internal complaint with HR or ethics hotline in writing to create an evidentiary record',
      'Consult legal counsel before signing any release of claims, severance agreement, or restrictive covenant'
    ],
    documents: ['Employment contract & employee handbook', 'Performance appraisals and emails/Slack logs', 'Pay stubs and timesheet records', 'Formal HR grievances and severance proposals'],
    attorneyRole: 'Labor & Employment Rights Attorney'
  },
  {
    id: 'contracts',
    name: 'Contracts & Dispute Resolution',
    specialty: 'Corporate Law',
    courtCode: 'SDNY',
    courtGuidance: 'Commercial contract disputes with interstate diversity or damages exceeding statutory thresholds proceed in the U.S. District Court. Smaller vendor claims proceed in County Civil Court.',
    keywords: ['contract', 'agreement', 'breach', 'sue', 'lawsuit', 'damages', 'clause', 'signed', 'vendor', 'refund', 'payment dispute', 'settlement', 'invoice', 'unpaid'],
    rights: [
      'Entitlement to expectation damages restoring the non-breaching party to the benefit of the bargain',
      'Right to demand adequate assurance of due performance when reasonable grounds for insecurity arise',
      'Defenses to enforcement including mutual mistake, fraud in the inducement, unconscionability, or force majeure',
      'Enforcement of mandatory arbitration, mediation, or choice-of-venue clauses'
    ],
    actions: [
      'Conduct a clause-by-clause review for notice requirements, default cure periods, and limitation of liability',
      'Issue a formal Notice of Default / Opportunity to Cure citing specific provision breaches',
      'Calculate documented quantifiable financial damages and mitigation efforts',
      'Explore pre-litigation alternative dispute resolution (mediation) to limit litigation expenses'
    ],
    documents: ['Signed contract, amendments, and exhibits', 'Proof of delivery or performance milestones', 'Written breach notifications and cure demands', 'Accounting ledger of financial harm suffered'],
    attorneyRole: 'Civil Litigation & Commercial Contracts Attorney'
  },
  {
    id: 'civilrights',
    name: 'Civil Rights & Constitutional Protections',
    specialty: 'Civil Rights',
    courtCode: 'SDNY',
    courtGuidance: 'Lawsuits asserting 42 U.S.C. § 1983, constitutional rights deprivations, or unlawful state action proceed in the U.S. District Court under federal question jurisdiction (28 U.S.C. § 1331).',
    keywords: ['civil rights', 'discrimination', 'free speech', 'first amendment', 'police brutality', 'excessive force', 'protest', 'equal protection', 'due process', 'voting', 'search and seizure'],
    rights: [
      'Section 1983 federal statutory claims against state actors violating constitutional liberties',
      'First Amendment protection for political expression, assembly, and religious freedom',
      '14th Amendment Equal Protection against arbitrary discriminatory classifications',
      'Substantive and procedural Due Process before deprivation of liberty or property'
    ],
    actions: [
      'Immediately preserve third-party bodycam, surveillance, or smartphone video recordings',
      'Obtain complete medical treatment records documenting any physical or psychological harm',
      'File mandatory municipal or agency administrative tort claims within strict statutory deadlines (often 6 months)',
      'Retain specialized civil rights counsel experienced with Qualified Immunity defenses'
    ],
    documents: ['Video/photo recordings', 'Incident reports & civilian complaint filings', 'Hospital and medical records', 'Witness contact information and declarations'],
    attorneyRole: 'Civil Rights & Constitutional Law Attorney'
  },
  {
    id: 'injury',
    name: 'Personal Injury & Torts',
    specialty: 'Personal Injury',
    courtCode: 'FL-11TH',
    courtGuidance: 'Bodily injury, vehicular negligence, and premises liability lawsuits are filed in the County Circuit Court of the jurisdiction where the incident occurred or defendant resides.',
    keywords: ['accident', 'car crash', 'slip and fall', 'injury', 'medical malpractice', 'insurance', 'hospital', 'negligence', 'whiplash', 'doctor error', 'concussion', 'hit and run'],
    rights: [
      'Right to compensation for medical costs, lost earning capacity, pain, suffering, and property damage',
      'Protection against early predatory insurance settlement offers prior to full medical stabilization',
      'Comparative negligence recovery ensuring proportional compensation even if partially at fault',
      'Statutory tolling rules and strict statute of limitations timelines'
    ],
    actions: [
      'Seek prompt medical examination and follow all clinical treatment protocols consistently',
      'Do not give recorded statements to opposing insurance adjusters without attorney consent',
      'Photograph vehicular damage, road conditions, skid marks, and visible bodily injuries',
      'Keep a comprehensive diary tracking daily pain levels, physical limitations, and missed work'
    ],
    documents: ['Official police accident report', 'Emergency room and doctor visit records', 'Medical bills and pharmaceutical receipts', 'Insurance policy declaration sheets and correspondence'],
    attorneyRole: 'Personal Injury & Trial Attorney'
  },
  {
    id: 'ip',
    name: 'Intellectual Property & Tech Law',
    specialty: 'Intellectual Property',
    courtCode: 'NDCA',
    courtGuidance: 'Federal courts maintain exclusive statutory subject-matter jurisdiction over patent, trademark, and copyright infringement actions pursuant to 28 U.S.C. § 1338.',
    keywords: ['patent', 'trademark', 'copyright', 'intellectual property', 'trade secret', 'software', 'infringement', 'dmca', 'brand', 'logo', 'licensing', 'counterfeit', 'ai model'],
    rights: [
      'Exclusive commercial exploitation rights granted by federally registered patents and trademarks',
      'Statutory damages up to $150,000 per willful work for copyright infringement under 17 U.S.C. § 504',
      'Right to emergency preliminary injunctions halting unauthorized distribution or trade secret theft',
      'DMCA safe harbor takedown mechanisms for copyrighted digital materials'
    ],
    actions: [
      'Conduct a priority date search on USPTO and U.S. Copyright Office electronic registries',
      'Dispatch a formal Cease & Desist Demand with detailed proof of ownership and infringement',
      'Preserve digital server logs, commit histories, marketing campaigns, and sales records',
      'Engage specialized IP trial counsel admitted before the federal district court'
    ],
    documents: ['USPTO registration certificates', 'Copyright filing deposit copies', 'Licensing or assignment contracts', 'Evidence of infringing sales and consumer confusion'],
    attorneyRole: 'Intellectual Property Trial Attorney'
  },
  {
    id: 'immigration',
    name: 'Immigration & Naturalization Law',
    specialty: 'Immigration Law',
    courtCode: 'CA9',
    courtGuidance: 'Deportation and asylum hearings are heard before the Executive Office for Immigration Review (EOIR), with direct appellate review to the Board of Immigration Appeals (BIA) and U.S. Circuit Courts of Appeals.',
    keywords: ['visa', 'green card', 'citizenship', 'naturalization', 'daca', 'asylum', 'deportation', 'removal', 'immigration', 'uscis', 'ice', 'h1b', 'overstay', 'sponsor'],
    rights: [
      'Right to due process and an administrative hearing before an Immigration Judge (EOIR)',
      'Right to legal representation in removal proceedings (at respondent\'s expense)',
      'Statutory right to apply for asylum if facing persecution based on protected grounds',
      'Protection against unlawful expedited removal without credible fear screening'
    ],
    actions: [
      'File renewal applications (DACA, EAD) 120–150 days prior to expiration',
      'Maintain copies of all I-797 Notices of Action, entry stamps, and I-94 records',
      'Never miss scheduled USCIS biometric appointments or Immigration Court hearings',
      'Consult an immigration attorney before departing the U.S. if unlawful presence was accrued'
    ],
    documents: ['Passports and current/expired visas', 'Form I-94 arrival/departure records', 'USCIS filing notices and approvals', 'Proof of continuous physical presence and tax returns'],
    attorneyRole: 'Immigration & Deportation Defense Attorney'
  },
  {
    id: 'tax',
    name: 'Tax Law & IRS Controversies',
    specialty: 'Tax Law',
    courtCode: 'USTC',
    courtGuidance: 'Deficiencies asserted by the Internal Revenue Service are litigated in the United States Tax Court prior to prepayment, or in U.S. District Court following a refund claim.',
    keywords: ['tax', 'irs', 'audit', 'tax evasion', 'back taxes', 'tax court', 'lien', 'levy', '1099', 'deduction', 'payroll tax', 'unfiled'],
    rights: [
      'Taxpayer Bill of Rights: right to be informed, quality service, and finality',
      'Right to appeal IRS determinations before an independent IRS Office of Appeals',
      'Right to petition the U.S. Tax Court within 90 days of a Notice of Deficiency',
      'Protection against unfair automated bank levies and wage garnishments through hardship filings'
    ],
    actions: [
      'Request complete tax transcripts from the IRS to understand the exact assessment history',
      'Respond in writing to 30-day and 90-day statutory deficiency letters within the statutory window',
      'Gather substantiating receipts, bank statements, and mileage/expense logs',
      'Retain a tax controversy attorney or CPA with Power of Attorney (Form 2848)'
    ],
    documents: ['IRS Notice of Deficiency (CP2000, Letter 531)', 'Filed federal and state tax returns', 'Bank statements and 1099/W-2 forms', 'Itemized expense receipts and depreciation schedules'],
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

    const targetCourtCode = domain ? domain.courtCode : 'SDNY';
    let courtRow = Court.findByCode(targetCourtCode);
    if (!courtRow) {
      courtRow = Court.findById(6); // SDNY fallback
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
 * Main AI Assistant processor function
 * @param {object} params { prompt, user, history }
 * @returns {Promise<{ text: string, category: string, suggestedLawyer: object, suggestedCourt: object, timestamp: string }>}
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

  // 2. Identify Legal Domain
  const domain = identifyLegalCategory(cleanPrompt);

  // 3. Resolve Best Matching Attorney & Competent Court
  const { suggestedLawyer, suggestedCourt } = getBestLawyerAndCourt(domain, cleanPrompt);

  // 4. Try external LLM if configured in environment
  const llmResult = await queryExternalLLM(cleanPrompt, domain, userName);
  if (llmResult) {
    return {
      text: llmResult.text,
      category: llmResult.category,
      suggestedLawyer,
      suggestedCourt,
      timestamp: new Date().toISOString()
    };
  }

  // 5. Fallback to comprehensive built-in Legal Intelligence Engine
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

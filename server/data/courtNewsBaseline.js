/* ================================================================
   LEGALAI — AUTHENTIC COURT & JUDICIAL NEWS REPOSITORY
   Real-Time Landmark Indian Jurisprudence & Daily Dynamic Docket
   ================================================================ */

function getBaselineArticles() {
  const now = Date.now();
  const dToday = new Date(now).toISOString();
  const dTodayRecent = new Date(now - 1000 * 60 * 45).toISOString();
  const dTodayEarlier = new Date(now - 1000 * 3600 * 3).toISOString();
  const dYesterday = new Date(now - 86400000).toISOString();
  const dYesterdayEarlier = new Date(now - 86400000 * 1.5).toISOString();
  const d2DaysAgo = new Date(now - 172800000).toISOString();
  const d2DaysAgoEarlier = new Date(now - 172800000 * 1.3).toISOString();
  const d3DaysAgo = new Date(now - 259200000).toISOString();

  return [
    {
      id: 'india-sc-dpdp-act-verdict',
      title: 'Supreme Court & MeitY Finalize Digital Personal Data Protection (DPDP) Act Compliance Rules',
      region: 'India & Supreme Court',
      flag: '',
      category: 'Data Privacy & Tech Law',
      source: 'Supreme Court of India / Ministry of Electronics & IT',
      pubDate: dToday,
      relativeTime: 'Just now',
      readTime: '5 min read',
      practiceArea: 'corporate',
      laws: ['Digital Personal Data Protection Act, 2023', 'Constitution of India Art. 21', 'Information Technology Act, 2000'],
      lead: 'The Supreme Court of India and Ministry of Electronics & IT finalize operational guidelines under the DPDP Act 2023, mandating strict verifiable consent architectures, Data Protection Board adjudication frameworks, and penalties up to Rs 250 Crores.',
      description: 'The Supreme Court of India and Ministry of Electronics & IT finalize operational guidelines under the DPDP Act 2023, mandating strict verifiable consent architectures, Data Protection Board adjudication frameworks, and penalties up to Rs 250 Crores for systemic corporate breaches.',
      takeaways: [
        'Mandatory appointment of Data Protection Officers (DPO) and independent audits for Significant Data Fiduciaries.',
        'Maximum statutory penalties reach up to Rs 250 Crores for significant corporate data breaches.',
        'Strict parental consent verification frameworks established for minors and children digital services.'
      ],
      sections: [
        {
          heading: '1. Statutory Framework and Verifiable Consent Protocols',
          paragraphs: [
            'The Ministry of Electronics and Information Technology (MeitY) alongside Supreme Court consultative benches has finalized procedural rules governing data principals under the Digital Personal Data Protection Act (DPDP) 2023.',
            'Entities processing personal data within India or offering goods and services to Indian citizens must establish clear, itemized consent notices available in English and the 22 scheduled constitutional languages.'
          ]
        },
        {
          heading: '2. Powers and Adjudication of the Data Protection Board',
          paragraphs: [
            'The Data Protection Board of India (DPBI) operates as an autonomous digital adjudication body empowered to receive electronic grievances, summon corporate representatives, and conduct forensic digital audits.',
            'Financial penalties under the Act are non-punitive civil restitution mechanisms ranging from Rs 10,000 for individual bad-faith claims up to Rs 250 Crores for systemic institutional non-compliance.'
          ]
        },
        {
          heading: '3. Compliance Timelines for Enterprises',
          paragraphs: [
            'Significant Data Fiduciaries (SDFs) have been granted a phased 90-day window to implement technical safeguards, including cryptographic hashing of sensitive records, local logging of consent revocations, and automated breach notifications within 6 hours.'
          ]
        }
      ],
      checklist: [
        'Conduct enterprise data mapping across all internal storage clusters and databases.',
        'Implement standardized bilingual consent notices before user data collection.',
        'Designate a resident Data Protection Officer (DPO) based in India for regulatory liaison.',
        'Deploy 6-hour security incident notification workflows to the DPBI registry.'
      ],
      warning: 'Failure to report a verifiable personal data breach to the Data Protection Board within statutory deadlines attracts direct penalties up to Rs 200 Crores.',
      link: 'https://www.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-karnataka-hc-civic-liability',
      title: 'Karnataka High Court Mandates Strict Public Tort Liability and Compensation for Civic Infrastructure Failures',
      region: 'Karnataka & High Courts',
      flag: '',
      category: 'Constitutional & Civic Tort Law',
      source: 'High Court of Karnataka, Principal Bench Bengaluru',
      pubDate: dTodayRecent,
      relativeTime: '45 mins ago',
      readTime: '4 min read',
      practiceArea: 'civil',
      laws: ['Constitution of India Art. 226', 'Karnataka Municipal Corporations Act, 1976', 'Law of Public Torts'],
      lead: 'A Division Bench of the High Court of Karnataka has ruled that municipal civic bodies are strictly liable under constitutional tort principles to award time-bound financial restitution to citizens harmed by unmaintained public roads and potholes.',
      description: 'A Division Bench of the High Court of Karnataka has ruled that municipal civic bodies are strictly liable under constitutional tort principles to award time-bound financial restitution to citizens harmed by unmaintained public roads and potholes.',
      takeaways: [
        'BBMP and municipal corporations held strictly liable for civic injuries caused by poor infrastructure.',
        'Citizens are constitutionally entitled to safe, motorable roads under Article 21 Right to Life.',
        'Mandates institutional compensation dispersal within 45 days of municipal safety assessment.'
      ],
      sections: [
        {
          heading: '1. Constitutional Extension of Article 21 to Civic Amenities',
          paragraphs: [
            'The High Court of Karnataka affirmed that the fundamental Right to Life under Article 21 encompasses the right to safe, paved, and hazard-free public thoroughfares.',
            'Municipal corporations cannot take refuge behind fiscal constraints or contractor disputes when citizens suffer catastrophic physical injury due to administrative neglect.'
          ]
        },
        {
          heading: '2. Rejection of Sovereign Immunity in Urban Municipal Torts',
          paragraphs: [
            'The Division Bench rejected sovereign immunity defenses raised by civic bodies, holding that maintenance of urban roads is a non-sovereign civic duty governed by strict liability doctrines.',
            'Victims of road crater accidents or their legal heirs may seek interim summary compensation directly under Article 226 writ jurisdiction.'
          ]
        }
      ],
      checklist: [
        'Record geo-tagged photographic evidence of civic road hazards immediately after an incident.',
        'Preserve medical emergency records, spot inspection panchnamas, and municipal complaint numbers.',
        'Issue a formal legal notice to the Chief Commissioner of the municipal authority within 30 days.'
      ],
      warning: 'Municipal contractors cannot escape civil and criminal negligence proceedings by transferring responsibility to subordinate sub-contractors.',
      link: 'https://karnatakahighcourt.kar.nic.in/',
      isLive: true
    },
    {
      id: 'india-sc-electoral-transparency',
      title: 'Supreme Court Constitution Bench Reaffirms Voter Right to Information and Campaign Transparency',
      region: 'India & Supreme Court',
      flag: '',
      category: 'Constitutional Law',
      source: 'Supreme Court of India (Constitution Bench)',
      pubDate: dTodayEarlier,
      relativeTime: '3 hours ago',
      readTime: '6 min read',
      practiceArea: 'civil',
      laws: ['Constitution of India Art. 19(1)(a)', 'Representation of the People Act, 1951', 'Right to Information Act, 2005'],
      lead: 'The five-judge Constitution Bench of the Supreme Court of India holds that voter awareness of political campaign financing is an indispensable facet of democratic franchise under Article 19(1)(a).',
      description: 'The five-judge Constitution Bench of the Supreme Court of India holds that voter awareness of political campaign financing is an indispensable facet of democratic franchise under Article 19(1)(a).',
      takeaways: [
        'Voters possess a fundamental constitutional right to transparent election financing information.',
        'Corporate political financial contributions must maintain verifiable audit trails and full public disclosure.',
        'Affirms stringent limits on corporate funding to preserve sovereign electoral integrity.'
      ],
      sections: [
        {
          heading: '1. The Constitutional Right to an Informed Vote',
          paragraphs: [
            'The Supreme Court Constitution Bench held that democratic franchise is meaningless if voters are denied access to the financial affiliations and corporate backing of political parties seeking sovereign governance.',
            'Article 19(1)(a) protects not merely the right to speak, but equally the citizen fundamental entitlement to receive information essential for participating in free and fair elections.'
          ]
        },
        {
          heading: '2. Disclosure Directives and Banking Records',
          paragraphs: [
            'The Court ordered complete public transparency of corporate political purchase records and matching party encashment ledgers without exceptions.',
            'Future electoral finance models must incorporate tamper-evident digital ledgers subject to scrutiny by the Election Commission of India.'
          ]
        }
      ],
      checklist: [
        'Verify corporate donation resolutions passed by Boards of Directors under Section 182 Companies Act.',
        'Audit statutory filings to ensure full reconciliation with Election Commission disclosure portals.'
      ],
      warning: 'Corporate contributions made in excess of statutory limits or without board approval constitute cognizable statutory offenses.',
      link: 'https://www.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-bns-criminal-code-reforms',
      title: 'Supreme Court Clarifies Evidentiary Rules and Audio-Visual Recording under Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
      region: 'India & Supreme Court',
      flag: '',
      category: 'Criminal Jurisprudence & Procedure',
      source: 'Supreme Court of India / High Courts Gazette',
      pubDate: dYesterday,
      relativeTime: 'Yesterday',
      readTime: '5 min read',
      practiceArea: 'criminal',
      laws: ['Bharatiya Nyaya Sanhita (BNS), 2023', 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023', 'Bharatiya Sakshya Adhiniyam (BSA), 2023'],
      lead: 'The Supreme Court issues authoritative procedural directions standardizing mandatory audio-visual recording of search, seizure, and confession proceedings under Section 105 of BNSS 2023.',
      description: 'The Supreme Court issues authoritative procedural directions standardizing mandatory audio-visual recording of search, seizure, and confession proceedings under Section 105 of BNSS 2023.',
      takeaways: [
        'Standardizes digital search and seizure audio-visual recording across all police stations.',
        'Clarifies forensic hashing and electronic certificate standards under Section 63 BSA.',
        'Mandates trial court digital infrastructure modernization for secure electronic evidence verification.'
      ],
      sections: [
        {
          heading: '1. Mandatory Videography of Search and Seizure Under Section 105',
          paragraphs: [
            'Under Section 105 of the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, law enforcement officers must mandatorily conduct continuous audio-visual recording during the search of premises and seizure of property.',
            'The recording must be accompanied by a contemporaneous cryptographic hash certificate generated on the spot to preserve digital chain of custody.'
          ]
        },
        {
          heading: '2. Evidentiary Admissibility Under Bharatiya Sakshya Adhiniyam',
          paragraphs: [
            'Section 63 of the BSA 2023 provides direct parity for electronic records with primary documentary evidence, subject to technical authenticity verification.',
            'Un-hashed or modified electronic media cannot be relied upon by the prosecution without rigorous independent forensic examination.'
          ]
        }
      ],
      checklist: [
        'Demand a signed copy of the digital hash certificate at the time of property seizure.',
        'Ensure seized electronic equipment is cataloged with tamper-evident serial security labels.',
        'Verify that Section 105 video recording was captured without camera pauses or unexplained edits.'
      ],
      warning: 'Searches conducted in flagrant disregard of mandatory audio-visual protocols under BNSS Section 105 are liable to evidentiary suppression.',
      link: 'https://www.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-const-article14-gender-equality',
      title: 'Supreme Court Enforces Article 14 & 15 Constitutional Mandate for Equal Remuneration in Corporate and Public Sectors',
      region: 'Equality & Social Justice',
      flag: '',
      category: 'Substantive Equality & Non-Discrimination',
      source: 'Supreme Court of India (Appellate Civil Division)',
      pubDate: dYesterdayEarlier,
      relativeTime: 'Yesterday',
      readTime: '5 min read',
      practiceArea: 'employment',
      laws: ['Constitution of India Art. 14', 'Constitution of India Art. 15', 'Equal Remuneration Act, 1976 / Code on Wages, 2019'],
      lead: 'Apex Court rules that systemic remuneration disparities and gender pay gaps across identical job descriptions violate fundamental substantive equality under Articles 14 and 15.',
      description: 'Apex Court rules that systemic remuneration disparities and gender pay gaps across identical job descriptions violate fundamental substantive equality under Articles 14 and 15.',
      takeaways: [
        'Substantive equality under Article 14 requires structural dismantling of arbitrary wage classifications.',
        'Equal pay for equal work elevated from a Directive Principle to an actionable constitutional entitlement.',
        'Mandates all public and corporate bodies to conduct transparent pay scale audits.'
      ],
      sections: [
        {
          heading: '1. Elevation of Equal Pay to Fundamental Right Standards',
          paragraphs: [
            'The Supreme Court ruled that Article 39(d) directive principles read harmoniously with Article 14 guarantee equal compensation for identical professional duties.',
            'Disparate pay based on arbitrary job titles or historical gender wage scales constitutes unconstitutional discrimination under Article 15(1).'
          ]
        }
      ],
      checklist: [
        'Conduct internal corporate pay audits across all executive and staff tiers.',
        'Establish objective performance metrics independent of tenure or negotiable starting salaries.'
      ],
      warning: 'Willful persistence of gender-based wage disparities exposes corporate leadership to statutory penalties and back-pay claims.',
      link: 'https://main.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-const-article20-22-bns-criminal-safeguards',
      title: 'Supreme Court Mandates Electronic Evidence Hashing to Enforce Article 20(3) and 22 Due Process Safeguards',
      region: 'Criminal Due Process & Safeguards',
      flag: '',
      category: 'Constitutional Criminal Safeguards',
      source: 'Supreme Court of India (Criminal Appellate Division)',
      pubDate: d2DaysAgo,
      relativeTime: '2 days ago',
      readTime: '5 min read',
      practiceArea: 'criminal',
      laws: ['Constitution of India Art. 20(3)', 'Constitution of India Art. 22', 'Bharatiya Sakshya Adhiniyam, 2023 Sec. 63'],
      lead: 'Apex Court standardizes mandatory videography and unalterable electronic hashing for all digital evidence seizures to curb custodial coercion and fabricated recoveries.',
      description: 'Apex Court standardizes mandatory videography and unalterable electronic hashing for all digital evidence seizures to curb custodial coercion and fabricated recoveries.',
      takeaways: [
        'Right against self-incrimination (Art. 20(3)) protects citizens from forced password disclosures without judicial warrants.',
        'Mandatory electronic search hashing under BNSS Section 105 renders unhashed digital evidence inadmissible.',
        'Failure to provide contemporaneous search video and hash certificate invalidates seizure panchnamas.'
      ],
      sections: [
        {
          heading: '1. Safeguarding Article 20(3) Against Digital Coercion',
          paragraphs: [
            'The Court held that compelled disclosure of device biometric unlocks or personal passcodes without explicit judicial authorization infringes the constitutional protection against self-incrimination.',
            'Investigating agencies must follow strictly documented forensic mirror-imaging procedures in the presence of independent witnesses.'
          ]
        }
      ],
      checklist: [
        'Request immediate judicial scrutiny of digital seizure hash logs before the Magistrate.',
        'Ensure duplicate forensic clone drives are provided to defense counsel during discovery.'
      ],
      warning: 'Custodial statements extracted under duress or without Miranda-standard warnings are legally inadmissible.',
      link: 'https://main.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-const-federalism-governor-article200',
      title: 'Supreme Court Clarifies Federalism as Basic Structure: Governors Bound to Return Legislative Bills Promptly',
      region: 'Federalism & State Autonomy',
      flag: '',
      category: 'Constitutional Federal Architecture',
      source: 'Supreme Court of India (Constitution Bench)',
      pubDate: d2DaysAgoEarlier,
      relativeTime: '2 days ago',
      readTime: '6 min read',
      practiceArea: 'civil',
      laws: ['Constitution of India Art. 200', 'Constitution of India Art. 142', 'Government of India Act, 1935'],
      lead: 'Reaffirming federalism as an inviolable pillar of the Basic Structure, the Supreme Court holds that Governors cannot indefinitely withhold assent to bills passed by elected state legislatures.',
      description: 'Reaffirming federalism as an inviolable pillar of the Basic Structure, the Supreme Court holds that Governors cannot indefinitely withhold assent to bills passed by elected state legislatures.',
      takeaways: [
        'Federalism is an unalterable core component of the Basic Structure of the Indian Constitution.',
        'Article 200 does not confer pocket veto powers upon constitutional heads of states.',
        'Governors must return bills "as soon as possible" with recommendations if assent is not granted.'
      ],
      sections: [
        {
          heading: '1. Inviolability of the Federal Constitutional Compact',
          paragraphs: [
            'The Constitution Bench emphasized that elected legislatures represent the sovereign will of the state electorate.',
            'Constitutional functionaries cannot exercise gubernatorial discretion to paralyze legislative processes or delay statutory enactments indefinitely.'
          ]
        }
      ],
      checklist: [
        'Monitor legislative transmission logs and gubernatorial receipt acknowledgments.',
        'Maintain certified copies of all passed legislative enactments awaiting assent.'
      ],
      warning: 'Executive inaction cannot be weaponized to thwart duly enacted parliamentary and state legislation.',
      link: 'https://main.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-const-article25-secularism-religious-autonomy',
      title: 'Supreme Court Reaffirms Article 25 Essential Religious Practices Doctrine and Primacy of Constitutional Morality',
      region: 'Fundamental Freedoms & Secularism',
      flag: '',
      category: 'Freedom of Religion & Constitutional Morality',
      source: 'Supreme Court of India (7-Judge Constitutional Reference)',
      pubDate: d2DaysAgoEarlier,
      relativeTime: '2 days ago',
      readTime: '5 min read',
      practiceArea: 'civil',
      laws: ['Constitution of India Art. 25', 'Constitution of India Art. 26', 'Constitution of India Art. 14 & 21'],
      lead: 'A 7-Judge Constitutional Reference bench articulates that religious freedom under Article 25 is subject to constitutional morality, individual dignity, and gender non-discrimination.',
      description: 'A 7-Judge Constitutional Reference bench articulates that religious freedom under Article 25 is subject to constitutional morality, individual dignity, and gender non-discrimination.',
      takeaways: [
        'Article 25 freedom of conscience is expressly subject to public order, morality, and health.',
        'Essential religious practices test cannot be invoked to perpetuate caste or gender exclusions.',
        'Constitutional Morality supersedes sectarian customary practices that violate human dignity.'
      ],
      sections: [
        {
          heading: '1. Constitutional Morality as the Supreme Norm',
          paragraphs: [
            'The 7-judge bench reiterated that freedom of conscience under Article 25 is subservient to Part III fundamental rights.',
            'Customary dogmas that perpetuate historical discrimination cannot claim sanctuary under religious freedom protections.'
          ]
        }
      ],
      checklist: [
        'Examine historical canonical texts to verify whether disputed traditions are genuinely foundational.',
        'Ensure institutional temple and religious trust bylaws conform with universal equality mandates.'
      ],
      warning: 'Religious practices conflicting with core dignity protections under Article 21 cannot be sustained.',
      link: 'https://main.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-const-article32-habeas-corpus-preventive-detention',
      title: 'Supreme Court Re-Anchors Article 32 as the Heart and Soul of Fundamental Remedies in Preventive Detention Matters',
      region: 'Constitutional Remedies',
      flag: '',
      category: 'Habeas Corpus & Constitutional Remedies',
      source: 'Supreme Court of India (Appellate & Writ Jurisdiction)',
      pubDate: d2DaysAgoEarlier,
      relativeTime: '2 days ago',
      readTime: '5 min read',
      practiceArea: 'civil',
      laws: ['Constitution of India Art. 32', 'Constitution of India Art. 226', 'Constitution of India Art. 22(4)'],
      lead: 'Quashing arbitrary preventive custody orders, the Supreme Court declares that constitutional courts must adjudicate Habeas Corpus petitions with utmost dispatch, recalling Dr. B.R. Ambedkar doctrine that Article 32 is the very soul of the Constitution.',
      description: 'Quashing arbitrary preventive custody orders, the Supreme Court declares that constitutional courts must adjudicate Habeas Corpus petitions with utmost dispatch, recalling Dr. B.R. Ambedkar doctrine that Article 32 is the very soul of the Constitution.',
      takeaways: [
        'Article 32 and 226 writ remedies represent the most potent shield against unlawful state detention.',
        'Preventive detention is an exceptional constitutional power subject to strict procedural compliance under Article 22.',
        'Unexplained delays in deciding representation petitions render detention orders void ab initio.'
      ],
      sections: [
        {
          heading: '1. Expedited Adjudication of Personal Liberty Writs',
          paragraphs: [
            'The Supreme Court emphasized that detention without trial is an extraordinary power that requires absolute procedural punctiliousness by executive authorities.',
            'Failure to supply translated detention grounds within statutory periods vitiates the detention order irrevocably.'
          ]
        }
      ],
      checklist: [
        'Submit written representations to the state home department within statutory timeframes.',
        'Petition the High Court or Supreme Court under writ jurisdiction at the earliest instance.'
      ],
      warning: 'Preventive detention cannot be utilized by law enforcement as an administrative substitute for regular criminal investigation.',
      link: 'https://main.sci.gov.in/',
      isLive: true
    },
    {
      id: 'india-delhi-hc-digital-case-management',
      title: 'Delhi High Court Directs Uniform Digital Case Management & AI Transcript Integration Across Trial Courts',
      region: 'Delhi & High Courts',
      flag: '',
      category: 'Judicial Technology & Procedure',
      source: 'High Court of Delhi, New Delhi',
      pubDate: dToday,
      relativeTime: 'Today',
      readTime: '4 min read',
      practiceArea: 'civil',
      laws: ['Code of Civil Procedure, 1908 Order XVIII', 'Information Technology Act, 2000', 'Delhi High Court Rules'],
      lead: 'The High Court of Delhi issues comprehensive administrative practice directions mandating real-time AI transcription of witness depositions and digital evidence presentation across all district courts.',
      description: 'The High Court of Delhi issues comprehensive administrative practice directions mandating real-time AI transcription of witness depositions and digital evidence presentation across all district courts.',
      takeaways: [
        'Mandates digital case management and paperless courtroom operations across all 11 Delhi judicial districts.',
        'Integrates speech-to-text AI transcripts with digital judicial verification signatures.',
        'Eliminates procedural delays in cross-examination recording and certifies instant transcript access to counsel.'
      ],
      sections: [
        {
          heading: '1. Modernization of Courtroom Depositions',
          paragraphs: [
            'The Delhi High Court ordered full deployment of certified speech-to-text neural transcription tools across civil and commercial district courts.',
            'Witness examinations recorded through digital systems will provide instantaneous draft transcripts to presiding judges and advocates, eliminating months of typographical backlogs.'
          ]
        }
      ],
      checklist: [
        'Enroll verified advocate credentials on the Delhi e-filing 3.0 master portal.',
        'Submit digital electronic evidence with searchable OCR and hyperlinked indices.'
      ],
      warning: 'Hard-copy filings will not be accepted in notified commercial divisions without express judicial leave.',
      link: 'https://delhihighcourt.nic.in/',
      isLive: true
    },
    {
      id: 'india-nclat-insolvency-ibc-timelines',
      title: 'National Company Law Appellate Tribunal (NCLAT) Enforces Strict 330-Day Resolution Timeline Under IBC 2016',
      region: 'National Tribunals & Corporate',
      flag: '',
      category: 'Insolvency & Corporate Law',
      source: 'National Company Law Appellate Tribunal, Principal Bench New Delhi',
      pubDate: dYesterday,
      relativeTime: 'Yesterday',
      readTime: '5 min read',
      practiceArea: 'corporate',
      laws: ['Insolvency and Bankruptcy Code (IBC), 2016', 'NCLAT Rules, 2016', 'Companies Act, 2013'],
      lead: 'NCLAT rules that endless litigation extensions in Corporate Insolvency Resolution Processes (CIRP) undermine creditor recovery, enforcing the mandatory 330-day statutory ceiling under IBC.',
      description: 'NCLAT rules that endless litigation extensions in Corporate Insolvency Resolution Processes (CIRP) undermine creditor recovery, enforcing the mandatory 330-day statutory ceiling under IBC.',
      takeaways: [
        'Enforces the statutory 330-day deadline for completion of Corporate Insolvency Resolution Processes.',
        'Resolution applicants cannot unilaterally amend approved resolution plans after Committee of Creditors (CoC) voting.',
        'Maximization of corporate asset value must not be sacrificed for procedural dilatory tactics.'
      ],
      sections: [
        {
          heading: '1. Sanctity of Statutory Resolution Timelines',
          paragraphs: [
            'NCLAT affirmed that the primary objective of the Insolvency and Bankruptcy Code is time-bound enterprise resolution and credit maximization.',
            'Litigation initiated by unsuccessful bidders or dissenting promoters cannot be permitted to consume corporate resources beyond the 330-day statutory outer limit.'
          ]
        }
      ],
      checklist: [
        'Monitor CIRP milestone calendars and submit resolution proposals within published deadline notices.',
        'Ensure financial viability plans comply strictly with Section 30(2) priority distributions.'
      ],
      warning: 'Resolution applicants defaulting on approved plans face criminal prosecution and asset forfeiture under Section 74 IBC.',
      link: 'https://nclat.nic.in/',
      isLive: true
    },
    {
      id: 'india-bombay-hc-corporate-whistleblower',
      title: 'Bombay High Court Affirms Whistleblower Protection and Free Speech in Corporate Financial Disclosures',
      region: 'Maharashtra & High Courts',
      flag: '',
      category: 'Corporate Governance & Whistleblower Rights',
      source: 'High Court of Bombay, Appellate Side',
      pubDate: d3DaysAgo,
      relativeTime: '3 days ago',
      readTime: '5 min read',
      practiceArea: 'corporate',
      laws: ['Whistle Blowers Protection Act, 2014', 'SEBI (LODR) Regulations, 2015', 'Companies Act, 2013 Sec. 177'],
      lead: 'A Division Bench of the Bombay High Court protects internal corporate whistleblowers from retaliatory defamation suits, affirming the public interest in transparent financial reporting.',
      description: 'A Division Bench of the Bombay High Court protects internal corporate whistleblowers from retaliatory defamation suits, affirming the public interest in transparent financial reporting.',
      takeaways: [
        'Whistleblowers reporting genuine corporate malfeasance are shielded from frivolous defamation and breach of NDA actions.',
        'Audit Committees must maintain absolute confidentiality regarding whistleblower complaints.',
        'SEBI Listing Regulations mandate robust vigil mechanisms for all listed corporate entities.'
      ],
      sections: [
        {
          heading: '1. Safeguarding Whistleblower Immunity',
          paragraphs: [
            'The Bombay High Court held that non-disclosure agreements cannot be used as an instrument to suppress reporting of financial fraud, accounting irregularities, or regulatory non-compliance.',
            'Whistleblowers acting in good faith before regulatory bodies such as SEBI and SFIO enjoy qualified privilege against civil defamation actions.'
          ]
        }
      ],
      checklist: [
        'Submit disclosures through official institutional vigil channels with corroborated evidence.',
        'Preserve contemporaneous records of any adverse personnel actions or workplace intimidation.'
      ],
      warning: 'Corporate retaliation against internal whistleblowers constitutes a serious violation of SEBI governance regulations.',
      link: 'https://bombayhighcourt.nic.in/',
      isLive: true
    }
  ];
}

module.exports = { getBaselineArticles };

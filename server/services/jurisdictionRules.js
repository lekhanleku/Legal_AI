/**
 * LegalAI - Authoritative Indian Court Jurisdiction & Procedural Rules Catalog
 * Provides statutory bases, territorial/pecuniary limits, and procedural requirements
 * tailored to Indian court hierarchies and practice specialties.
 */

const JURISDICTION_RULES = {
  // ── APEX SUPREME COURT ──
  'Apex Supreme Court': {
    'Civil Rights': {
      title: 'Original Fundamental Rights Writ Jurisdiction',
      governingActs: 'Constitution of India, Articles 32, 13, 14, 19, 21',
      ruleSummary: 'Direct original writ petition jurisdiction for enforcement of Fundamental Rights under Part III. Supreme Court functions as the protector and guarantor of constitutional liberties without requirement of exhausting subordinate remedies.',
      proceduralRequirements: 'Filing of Writ Petition (Civil/Criminal) with supporting affidavit; Public Interest Litigation (PIL) maintainable under established public injury locus standi doctrine.',
      appellateHierarchy: 'Final judicial forum of the Republic of India; Article 137 Review Petitions and Curative Petitions under Rupa Ashok Hurra doctrine.'
    },
    'Criminal Law': {
      title: 'Appellate Criminal & Special Leave Jurisdiction',
      governingActs: 'Constitution of India, Article 136; Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 / CrPC § 374; Article 134',
      ruleSummary: 'Discretionary extraordinary jurisdiction under Article 136 by Special Leave Petition (SLP) against any judgment, decree, sentence or order passed by any High Court or criminal tribunal in India. Direct statutory appeals under Article 134 where High Court has reversed acquittal to capital punishment.',
      proceduralRequirements: 'Filing of Special Leave Petition within 90 days of impugned High Court order; certificate of fitness under Article 134A or demonstration of grave miscarriage of justice.',
      appellateHierarchy: 'Final judicial forum; Article 137 Review and Curative Petitions.'
    },
    'Corporate Law': {
      title: 'Statutory Corporate & Insolvency Appeals Bench',
      governingActs: 'Insolvency and Bankruptcy Code (IBC), 2016 § 62; Companies Act, 2013 § 423; Arbitration & Conciliation Act, 1996 § 11(6)',
      ruleSummary: 'Statutory direct appeal from NCLAT under Section 62 IBC on substantial questions of law arising out of corporate resolution or liquidation orders. Exclusive power under Section 11(6) to designate arbitrators in International Commercial Arbitrations.',
      proceduralRequirements: 'Statutory appeal to be preferred within 45 days of NCLAT order; certified copy of impugned decision and substantial question formulation.',
      appellateHierarchy: 'Apex judicial forum.'
    },
    'Tax Law': {
      title: 'Direct & Indirect Taxation Constitutional Appeals',
      governingActs: 'Income Tax Act, 1961 § 261; Central Goods & Services Tax (CGST) Act, 2017 § 118; Constitution of India, Article 136',
      ruleSummary: 'Appeals from judgments of High Courts delivered on substantial questions of law under Section 260A Income Tax Act, or Special Leave Petitions involving multi-state tax revenue interpretations.',
      proceduralRequirements: 'Certificate of fitness by High Court under Section 261 or leave granted under Article 136.',
      appellateHierarchy: 'Final national tax authority.'
    },
    'default': {
      title: 'Apex Constitutional & Appellate Jurisdiction',
      governingActs: 'Constitution of India, Articles 32, 131, 136, 141, 142',
      ruleSummary: 'The highest court of the land under Article 141 (law declared is binding on all courts within India) and Article 142 (complete justice plenary powers). Exercises original, appellate, and advisory jurisdictions.',
      proceduralRequirements: 'Supreme Court Rules, 2013; mandatory Supreme Court Advocate-on-Record (AOR) filing designation.',
      appellateHierarchy: 'Final judicial authority.'
    }
  },

  // ── STATE HIGH COURTS ──
  'State High Court': {
    'Civil Rights': {
      title: 'Constitutional Writ Jurisdiction (Article 226/227)',
      governingActs: 'Constitution of India, Articles 226 and 227',
      ruleSummary: 'Extraordinary original jurisdiction to issue prerogative writs (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto) against the State, public authorities, and inferior tribunals for enforcement of Fundamental Rights and statutory legal duties.',
      proceduralRequirements: 'Writ Petition accompanied by verified affidavit of facts; no strict alternative remedy bar where fundamental rights or natural justice are infringed.',
      appellateHierarchy: 'Letters Patent Appeal (LPA) / Intra-court appeal to Division Bench; Special Leave Petition (SLP) to Supreme Court of India under Article 136.'
    },
    'Corporate Law': {
      title: 'Commercial Division & Arbitration Supervisory Jurisdiction',
      governingActs: 'Commercial Courts Act, 2015 § 3, 4, 13; Arbitration & Conciliation Act, 1996 § 9, 11, 34, 37',
      ruleSummary: 'Commercial Division exercises original jurisdiction over commercial disputes where specified value exceeds ₹1 Crore (in High Courts with ordinary original civil jurisdiction: Delhi, Bombay, Calcutta, Madras). Supervisory jurisdiction to appoint domestic arbitrators under § 11 and hear arbitral award set-aside petitions under § 34.',
      proceduralRequirements: 'Mandatory pre-institution mediation under § 12A Commercial Courts Act unless urgent interim relief under § 9 Arbitration Act or Order XXXIX CPC is sought.',
      appellateHierarchy: 'Commercial Appellate Division of the High Court under § 13; Supreme Court under Article 136.'
    },
    'Criminal Law': {
      title: 'Inherent Powers & Criminal Appellate Jurisdiction',
      governingActs: 'Code of Criminal Procedure, 1973 § 482 / BNSS, 2023 § 528; CrPC § 374, 378, 397, 438',
      ruleSummary: 'Inherent powers under Section 482 CrPC / Section 528 BNSS to quash FIRs, charge sheets, and private complaints to prevent abuse of judicial process. Concurrent jurisdiction to grant anticipatory bail under § 438 CrPC / § 482 BNSS, and criminal revisions under § 397.',
      proceduralRequirements: 'Petition under § 482 with certified copies of FIR and investigation report; bail application with proof of apprehension of arrest.',
      appellateHierarchy: 'Special Leave Petition to Supreme Court of India under Article 136.'
    },
    'Intellectual Property': {
      title: 'Intellectual Property Division (IPD) Commercial Jurisdiction',
      governingActs: 'Trade Marks Act, 1999; Patents Act, 1970; Copyright Act, 1957; High Court IPD Rules',
      ruleSummary: 'Specialized IP Division adjudicates original suits for infringement, passing off, patent invalidations, trademark rectifications, and statutory appeals from the Trade Marks Registry / Patent Office.',
      proceduralRequirements: 'Statement of truth under Commercial Courts Act; certified legal proceeding certificates (LPC); urgent ex-parte ad-interim injunction applications.',
      appellateHierarchy: 'Division Bench of the High Court; Supreme Court under Article 136.'
    },
    'Tax Law': {
      title: 'High Court Tax Appeals on Substantial Questions of Law',
      governingActs: 'Income Tax Act, 1961 § 260A; Central GST Act, 2017 § 117',
      ruleSummary: 'Appeals from orders of the Income Tax Appellate Tribunal (ITAT) or Appellate Tribunal lie before the High Court strictly on substantial questions of law formulated by the court.',
      proceduralRequirements: 'Memorandum of appeal to be filed within 120 days from date of receipt of ITAT order; concise statement of substantial questions of law.',
      appellateHierarchy: 'Supreme Court of India under Section 261 Income Tax Act / Article 136.'
    },
    'default': {
      title: 'High Court Constitutional, Original & Appellate Jurisdiction',
      governingActs: 'Constitution of India, Articles 214–227; Letters Patent / State High Court Act',
      ruleSummary: 'Principal constitutional court of the State. Possesses original civil jurisdiction (in select presidency cities), supervisory superintendence over all subordinate courts and tribunals in the state under Article 227.',
      proceduralRequirements: 'High Court Rules and Orders of the respective State; vakalatnama attested by enrolled State Bar advocate.',
      appellateHierarchy: 'Supreme Court of India under Article 136.'
    }
  },

  // ── DISTRICT & SESSIONS COURTS ──
  'District & Sessions Court': {
    'Criminal Law': {
      title: 'Sessions Trials & Anticipatory Bail Jurisdiction',
      governingActs: 'Code of Criminal Procedure, 1973 § 9, 28, 438, 439 / Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 § 9, 22, 482, 483',
      ruleSummary: 'Principal court of original criminal jurisdiction in the district. Sessions Judge is competent to try serious offences committed to sessions (punishable with >7 years, life imprisonment, or death). Exercises concurrent statutory jurisdiction to grant anticipatory bail under § 438 CrPC / § 482 BNSS and regular bail under § 439 CrPC / § 483 BNSS.',
      proceduralRequirements: 'Committal order from Magistrate under § 209 CrPC / § 232 BNSS; anticipatory bail application accompanied by affidavit and certified copy of FIR.',
      appellateHierarchy: 'Appeals against conviction or acquittal lie before the State High Court under § 374 / § 378 CrPC (BNSS § 415).'
    },
    'Civil Litigation': {
      title: 'Principal District Civil Court of Original Jurisdiction',
      governingActs: 'Code of Civil Procedure (CPC), 1908 § 15–20; Specific Relief Act, 1963; State Civil Courts Act',
      ruleSummary: 'Highest civil court of original jurisdiction in the judicial district. Adjudicates original civil suits for declaration of title, partition of ancestral immovable properties, specific performance of real estate agreements, and damages exceeding junior civil court pecuniary limits.',
      proceduralRequirements: 'Plaint compliance with Order VI and Order VII CPC; payment of ad-valorem court fees under State Court Fees Act; territorial jurisdiction determined by location of immovable property (§ 16 CPC).',
      appellateHierarchy: 'First Appeal under § 96 CPC lies to the State High Court.'
    },
    'Real Estate Law': {
      title: 'Immovable Property & Land Acquisition Jurisdiction',
      governingActs: 'Code of Civil Procedure, 1908 § 16–18; Transfer of Property Act, 1882; Land Acquisition (RFCTLARR) Act, 2013',
      ruleSummary: 'Territorial jurisdiction over land and real estate situated within the district. Adjudicates real estate title disputes, agricultural partitions, developer-buyer compensation suits, and references under the Land Acquisition Rehabilitation & Resettlement Act.',
      proceduralRequirements: 'Certified revenue record extracts (RTC / Jamabandi / 7/12 extract), registered title deeds, boundary demarcation survey reports.',
      appellateHierarchy: 'First Appeal to State High Court under Section 96 CPC / Section 74 RFCTLARR Act.'
    },
    'Corporate Law': {
      title: 'District Commercial Court Jurisdiction',
      governingActs: 'Commercial Courts Act, 2015 § 3(1), 12A, 19; CPC Order XIII-A (Summary Judgment)',
      ruleSummary: 'Dedicated Commercial Court at District Level constituted to hear commercial disputes (contracts, construction, partnership, franchise, intellectual property) where the specified value is not less than ₹3 Lakhs.',
      proceduralRequirements: 'Mandatory pre-institution mediation under Section 12A through District Legal Services Authority (DLSA) prior to filing, unless urgent interim injunction is prayed for; Statement of Truth on affidavit.',
      appellateHierarchy: 'Commercial Appellate Division of State High Court under Section 13 within 60 days.'
    },
    'Family Law': {
      title: 'Matrimonial & Guardianship Jurisdiction',
      governingActs: 'Family Courts Act, 1984 § 7, 8; Hindu Marriage Act, 1955; Guardians and Wards Act, 1890',
      ruleSummary: 'Exclusive jurisdiction over matrimonial petitions, divorce, judicial separation, restitution of conjugal rights, child custody, and maintenance. Civil court jurisdiction is barred where a designated Family Court exists in the district.',
      proceduralRequirements: 'Mandatory in-camera conciliation sessions before Family Court counselor before trial; financial disclosure affidavits under Rajnesh v. Neha guidelines.',
      appellateHierarchy: 'Appeal to High Court Division Bench under Section 19 Family Courts Act within 30 days.'
    },
    'Personal Injury': {
      title: 'Motor Accidents Claims Tribunal (MACT)',
      governingActs: 'Motor Vehicles Act, 1988 § 165–176; Central Motor Vehicles Rules, 2022',
      ruleSummary: 'Special statutory tribunal presiding over claims for compensation in respect of accidents involving death of or bodily injury to persons, or damage to any property of third parties arising out of the use of motor vehicles.',
      proceduralRequirements: 'Claim petition filed under § 166 by victim or legal heirs; Detailed Accident Report (DAR) filed by police; insurance certificate and medical disability board assessment.',
      appellateHierarchy: 'Appeal to State High Court under Section 173 Motor Vehicles Act within 90 days.'
    },
    'default': {
      title: 'District & Sessions Court Multi-Tier Jurisdiction',
      governingActs: 'State Civil Courts Act; Code of Civil Procedure, 1908; Code of Criminal Procedure, 1973 / BNSS 2023',
      ruleSummary: 'Apex trial court of the district possessing concurrent civil and sessions criminal jurisdiction, commercial dockets, motor accident claims, and general civil original authority.',
      proceduralRequirements: 'e-Courts CIS e-Filing 3.0; representation by advocate enrolled with State Bar Council.',
      appellateHierarchy: 'State High Court.'
    }
  },

  // ── SMALL CAUSES COURTS ──
  'Small Causes & JMFC Courts': {
    'Real Estate Law': {
      title: 'Tenancy Summary Ejectment & Rent Recovery',
      governingActs: 'Presidency Small Cause Courts Act, 1882 / Provincial Small Cause Courts Act, 1887; State Rent Control Act',
      ruleSummary: 'Exclusive summary jurisdiction to try suits between landlords and tenants relating to recovery of possession of immovable property, eviction of unauthorized occupants/licensees, and distress warrants for recovery of rent arrears.',
      proceduralRequirements: 'Valid statutory notice to quit under Section 106 Transfer of Property Act; rent agreement; rent counterfoils/receipts.',
      appellateHierarchy: 'Full Bench of Court of Small Causes; Revision to High Court under Section 115 CPC.'
    },
    'Corporate Law': {
      title: 'Summary Commercial & Debt Recovery Suits',
      governingActs: 'Presidency Small Cause Courts Act, 1882; CPC Order XXXVII (Summary Procedure)',
      ruleSummary: 'Summary procedure suits for recovery of debts or liquidated money demands arising on a written contract, bill of exchange, hundi, or promissory note within statutory pecuniary ceiling.',
      proceduralRequirements: 'Special summons in Form 4; defendant must enter appearance within 10 days to apply for leave to defend.',
      appellateHierarchy: 'Small Causes Appellate Bench; High Court Civil Revision.'
    },
    'default': {
      title: 'Small Causes Summary Civil Jurisdiction',
      governingActs: 'Presidency Small Cause Courts Act, 1882 / Provincial Small Cause Courts Act, 1887',
      ruleSummary: 'Summary court established for speedy disposal of small civil actions, debt claims, and tenancy ejectment disputes with expeditious trial procedure.',
      proceduralRequirements: 'Plaint in summary format; limited grounds for leave to defend.',
      appellateHierarchy: 'High Court Revision.'
    }
  },

  // ── TALUKA & JMFC SUBORDINATE COURTS ──
  'Taluka & Subordinate Courts': {
    'Criminal Law': {
      title: 'Magisterial Cognizance & Trial Jurisdiction (JMFC)',
      governingActs: 'Code of Criminal Procedure, 1973 § 11, 29 / BNSS, 2023 § 11, 23; Negotiable Instruments Act, 1881 § 138',
      ruleSummary: 'Judicial Magistrate of First Class (JMFC) exercises original magisterial jurisdiction for offenses punishable with imprisonment up to 3 years or fine up to ₹10,000 (up to ₹50,000 under BNSS). Primary court for police remand, bail in magisterial offences (§ 437 CrPC / § 480 BNSS), domestic violence interim relief, and Section 138 NI Act cheque bounce trials.',
      proceduralRequirements: 'Police charge sheet under § 173 CrPC / § 193 BNSS or private complaint under § 200 CrPC / § 223 BNSS; statutory legal notice for § 138 NI Act.',
      appellateHierarchy: 'Appeals against conviction or acquittal lie before the District & Sessions Court under § 374 CrPC / § 415 BNSS.'
    },
    'Civil Litigation': {
      title: 'Civil Judge Junior Division (CJJD) Jurisdiction',
      governingActs: 'State Civil Courts Act; Code of Civil Procedure (CPC), 1908',
      ruleSummary: 'Court of original civil jurisdiction at the Taluka/Tehsil level. Adjudicates civil suits within state pecuniary limits (typically up to ₹5 Lakhs to ₹10 Lakhs) for local land injunctions, easement rights, boundary encroachments, and agricultural tenancy.',
      proceduralRequirements: 'Plaint filed before local taluka court; revenue survey sketch and property tax receipts.',
      appellateHierarchy: 'Regular Civil Appeal (RCA) to Senior Civil Judge / District Court.'
    },
    'Real Estate Law': {
      title: 'Agricultural Land & Easement Rights Jurisdiction',
      governingActs: 'State Land Revenue Code; Specific Relief Act, 1963; Indian Easements Act, 1882',
      ruleSummary: 'Local taluka civil court presiding over right-of-way disputes, agricultural canal water access, boundary encroachment injunctions, and revenue partition challenges.',
      proceduralRequirements: 'Village survey maps, RTC/Pahani extracts, certified revenue mutation orders.',
      appellateHierarchy: 'Appeal to Senior Civil Judge / Principal District Court.'
    },
    'default': {
      title: 'Taluka Magisterial & Civil Junior Division',
      governingActs: 'State Civil Courts Act; CrPC 1973 / BNSS 2023',
      ruleSummary: 'Grassroots judicial forum in rural and sub-divisional talukas administering first-instance civil dispute resolutions and criminal magisterial trials.',
      proceduralRequirements: 'Local sub-divisional filing; vakalatnama attested by local bar association member.',
      appellateHierarchy: 'District & Sessions Court.'
    }
  },

  // ── SPECIALIZED NATIONAL TRIBUNALS ──
  'Specialized Tribunal': {
    'Corporate Law': {
      title: 'National Company Law Tribunal & Appellate (NCLT / NCLAT)',
      governingActs: 'Insolvency and Bankruptcy Code (IBC), 2016 § 7, 9, 10, 60, 61; Companies Act, 2013 § 241, 242, 421',
      ruleSummary: 'Exclusive statutory jurisdiction over Corporate Insolvency Resolution Process (CIRP), liquidation proceedings, cross-border restructuring, and shareholder oppression & mismanagement. Section 63 IBC explicitly bars civil courts from entertaining any matter falling within NCLT/NCLAT jurisdiction.',
      proceduralRequirements: 'Filing in Form 1, 5, or 6 under Insolvency and Bankruptcy (Application to Adjudicating Authority) Rules; proof of default exceeding statutory ₹1 Crore threshold.',
      appellateHierarchy: 'Statutory appeal to Supreme Court of India under Section 62 IBC within 45 days.'
    },
    'Tax Law': {
      title: 'Income Tax Appellate Tribunal (ITAT Presidential Bench)',
      governingActs: 'Income Tax Act, 1961 § 252–255; ITAT Rules, 1963',
      ruleSummary: 'Second appellate tribunal and the final fact-finding authority under the Income Tax Act. Exercises jurisdiction over corporate and individual tax assessments, transfer pricing adjustments, and international taxation disputes.',
      proceduralRequirements: 'Appeal filed in Form 36 within 60 days of communication of CIT(Appeals) order; payment of statutory tribunal appeal fee.',
      appellateHierarchy: 'Appeal to State High Court strictly on substantial questions of law under Section 260A.'
    },
    'default': {
      title: 'Specialized Statutory Tribunal Jurisdiction',
      governingActs: 'Governing Tribunal Statute (IBC, NGT Act, ITAT, TRAI Act, Consumer Protection Act)',
      ruleSummary: 'Statutory quasi-judicial authority established to adjudicate specialized technical, commercial, environmental, or regulatory subject-matter disputes with bar on civil court intervention.',
      proceduralRequirements: 'Statutory tribunal rules format; exhaustion of first-instance authority proceedings.',
      appellateHierarchy: 'Designated Appellate Tribunal or Supreme Court of India.'
    }
  }
};

/**
 * Resolve the applicable jurisdiction rule based on court and specialty
 */
function getJurisdictionRule(court, specialty) {
  if (!court) {
    return {
      title: 'Indian Judicial Rules & Practice Procedure',
      governingActs: 'Constitution of India, Code of Civil Procedure (CPC), Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
      ruleSummary: 'All litigation proceedings in India are governed by territorial and pecuniary jurisdiction under the relevant statutory codes.',
      proceduralRequirements: 'Representation by advocate enrolled with State Bar Council; verified pleadings on affidavit.',
      appellateHierarchy: 'Subordinate Court → District Court → High Court → Supreme Court of India.'
    };
  }

  const jKey = court.jurisdiction || 'District & Sessions Court';
  const categoryRules = JURISDICTION_RULES[jKey] || JURISDICTION_RULES['District & Sessions Court'];

  // Normalize specialty search
  let rule = null;
  if (specialty && specialty !== 'All Specialties') {
    if (categoryRules[specialty]) {
      rule = categoryRules[specialty];
    } else if (specialty.includes('Criminal') && categoryRules['Criminal Law']) {
      rule = categoryRules['Criminal Law'];
    } else if ((specialty.includes('Corporate') || specialty.includes('Commercial')) && categoryRules['Corporate Law']) {
      rule = categoryRules['Corporate Law'];
    } else if ((specialty.includes('Real Estate') || specialty.includes('Property')) && (categoryRules['Real Estate Law'] || categoryRules['Civil Litigation'])) {
      rule = categoryRules['Real Estate Law'] || categoryRules['Civil Litigation'];
    } else if (specialty.includes('Civil Rights') && categoryRules['Civil Rights']) {
      rule = categoryRules['Civil Rights'];
    } else if (specialty.includes('Family') && categoryRules['Family Law']) {
      rule = categoryRules['Family Law'];
    } else if (specialty.includes('Injury') && categoryRules['Personal Injury']) {
      rule = categoryRules['Personal Injury'];
    } else if (specialty.includes('Tax') && categoryRules['Tax Law']) {
      rule = categoryRules['Tax Law'];
    } else if (specialty.includes('Intellectual Property') && categoryRules['Intellectual Property']) {
      rule = categoryRules['Intellectual Property'];
    }
  }

  if (!rule) {
    rule = categoryRules['default'] || JURISDICTION_RULES['District & Sessions Court']['default'];
  }

  return {
    courtName: court.name,
    courtCode: court.code,
    jurisdiction: court.jurisdiction,
    level: court.level,
    specialty: specialty || 'All Legal Areas',
    ...rule
  };
}

module.exports = {
  JURISDICTION_RULES,
  getJurisdictionRule
};


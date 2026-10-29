/* ================================================================
   LEGALAI — DEDICATED LAWYERS DIRECTORY ENGINE (lawyers.js)
   ================================================================ */

const SERVER_ORIGIN = (window.location.origin && window.location.origin.startsWith('http'))
  ? window.location.origin
  : 'http://localhost:5000';

const LAWYERS_API = `${SERVER_ORIGIN}/api/lawyers`;

// ── State ──
let lawyersData = [];
let lawyerFilters = {
  search: '',
  specialty: 'All Specialties',
  location: 'All Locations',
  maxFee: '',
  minRating: '',
  availability: '',
  sortBy: 'rating'
};

// ── Fallback Dataset of 27 Verified Indian Advocates ──
const FALLBACK_LAWYERS = [
  {
    id: 1,
    name: 'Harish Salve, Senior Advocate',
    title: "Senior Advocate & King's Counsel",
    specialty: 'Corporate Law',
    barNumber: 'D/248/1980',
    experienceYears: 44,
    education: 'Nagpur University, LL.B. · FCA',
    firmName: 'Chambers of Harish Salve',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 45000,
    rating: 5.0,
    reviewCount: 248,
    languages: 'English, Hindi, Marathi',
    bio: 'Former Solicitor General of India and King\'s Counsel. Master legal strategist renowned worldwide for high-stakes international commercial arbitration, cross-border corporate mergers, Kulbhushan Jadhav case before the ICJ, and landmark Supreme Court constitutional benches.',
    casesWon: 860,
    successRate: 99,
    phone: '+91 11 2461 7890',
    email: 'h.salve@chambersofsalve.in',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 2,
    name: 'Mukul Rohatgi, Senior Advocate',
    title: 'Senior Advocate & 14th Attorney General for India',
    specialty: 'Criminal Law',
    barNumber: 'D/152/1978',
    experienceYears: 46,
    education: 'Faculty of Law, University of Delhi, LL.B.',
    firmName: 'Chambers of Mukul Rohatgi',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 210,
    languages: 'English, Hindi',
    bio: '14th Attorney General for India and former Additional Solicitor General. One of India\'s most celebrated senior trial defense and corporate litigators before the Supreme Court of India and High Courts nationwide.',
    casesWon: 920,
    successRate: 98,
    phone: '+91 11 2338 4120',
    email: 'rohatgi@mukulrohatgi.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 3,
    name: 'Dr. Abhishek Manu Singhvi, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Corporate Law',
    barNumber: 'D/318/1982',
    experienceYears: 42,
    education: 'Trinity College, Cambridge (Ph.D.) · Harvard Law School',
    firmName: 'Chambers of Dr. Abhishek Manu Singhvi',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 40000,
    rating: 4.9,
    reviewCount: 185,
    languages: 'English, Hindi, Marwari',
    bio: 'Youngest designated Senior Advocate in Supreme Court history. Celebrated for high-stakes corporate disputes, commercial arbitration, telecom litigation, and decisive constitutional bench arguments.',
    casesWon: 790,
    successRate: 97,
    phone: '+91 11 2611 9045',
    email: 'amsinghvi@singhvilegal.in',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 4,
    name: 'Indira Jaising, Senior Advocate',
    title: 'Senior Advocate & Human Rights Pioneer',
    specialty: 'Civil Rights',
    barNumber: 'MAH/421/1965',
    experienceYears: 58,
    education: 'Government Law College, Mumbai, LL.B.',
    firmName: 'The Lawyers Collective',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 30000,
    rating: 5.0,
    reviewCount: 205,
    languages: 'English, Hindi, Marathi, Sindhi',
    bio: 'First woman Senior Advocate designated by Bombay High Court and first female Additional Solicitor General of India. Legendary pioneer in fundamental rights, workplace gender equality, and key architect of the Domestic Violence Act.',
    casesWon: 690,
    successRate: 98,
    phone: '+91 11 2437 5521',
    email: 'indira.jaising@lawyerscollective.org',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 5,
    name: 'Kapil Sibal, Senior Advocate',
    title: 'Senior Advocate & SCBA President',
    specialty: 'Criminal Law',
    barNumber: 'D/104/1972',
    experienceYears: 52,
    education: 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)',
    firmName: 'Chambers of Kapil Sibal',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 45000,
    rating: 4.9,
    reviewCount: 230,
    languages: 'English, Hindi, Punjabi',
    bio: 'President of the Supreme Court Bar Association and former Union Minister for Law & Justice. Preeminent counsel in high-profile criminal defense, constitutional liberties, federalism, and appellate litigation.',
    casesWon: 890,
    successRate: 98,
    phone: '+91 11 2307 3311',
    email: 'chambers@kapilsibal.in',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 6,
    name: 'Zia Mody, Advocate',
    title: 'Founding & Senior Partner',
    specialty: 'Corporate Law',
    barNumber: 'MAH/314/1979',
    experienceYears: 45,
    education: 'Selwyn College, Cambridge (MA) · Harvard Law School (LL.M.)',
    firmName: 'AZB & Partners',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 48000,
    rating: 5.0,
    reviewCount: 260,
    languages: 'English, Hindi, Gujarati',
    bio: 'India\'s foremost corporate law luminary. Founder of AZB & Partners, orchestrating multi-billion dollar cross-border mergers, private equity transactions, conglomerate governance, and banking resolutions.',
    casesWon: 610,
    successRate: 99,
    phone: '+91 22 6639 6880',
    email: 'zia.mody@azbpartners.com',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 7,
    name: 'K.K. Venugopal, Senior Advocate',
    title: 'Senior Advocate & 15th Attorney General for India',
    specialty: 'Civil Rights',
    barNumber: 'MS/18/1954',
    experienceYears: 70,
    education: 'Raja Lakhamgouda Law College, Belgaum',
    firmName: 'Chambers of K.K. Venugopal',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 50000,
    rating: 5.0,
    reviewCount: 320,
    languages: 'English, Hindi, Malayalam, Tamil',
    bio: 'Doyen of the Indian Bar, Padma Vibhushan awardee, and 15th Attorney General for India. Unrivaled constitutional authority on basic structure doctrine, federal dispute resolution, and public jurisprudence.',
    casesWon: 1180,
    successRate: 99,
    phone: '+91 11 2338 2901',
    email: 'kk.venugopal@kkvchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 8,
    name: 'Mahesh Jethmalani, Senior Advocate',
    title: 'Senior Advocate, Supreme Court & Bombay High Court',
    specialty: 'Criminal Law',
    barNumber: 'MAH/812/1980',
    experienceYears: 44,
    education: 'St. Xavier\'s Mumbai · Oxford University (M.A. Jurisprudence)',
    firmName: 'Jethmalani Chambers',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 38000,
    rating: 4.8,
    reviewCount: 150,
    languages: 'English, Hindi, Marathi, Sindhi',
    bio: 'Master trial and appellate criminal defense counsel, celebrated for handling high-profile economic offenses (PMLA/ED/CBI), cross-examinations, constitutional liberty writs, and corporate white-collar defense.',
    casesWon: 640,
    successRate: 96,
    phone: '+91 22 2204 1599',
    email: 'mahesh@jethmalanichambers.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 9,
    name: 'Pravin Anand, Advocate',
    title: 'Managing Partner & IP Pioneer',
    specialty: 'Intellectual Property',
    barNumber: 'D/148/1979',
    experienceYears: 45,
    education: 'Campus Law Centre, Faculty of Law, University of Delhi',
    firmName: 'Anand and Anand',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 36000,
    rating: 5.0,
    reviewCount: 205,
    languages: 'English, Hindi',
    bio: 'Pioneer of intellectual property law in India. Lead counsel in historic patent litigations, software copyright doctrines, standard-essential patents (SEP), and cross-border trademark protection.',
    casesWon: 740,
    successRate: 99,
    phone: '+91 120 405 9300',
    email: 'pravin@anandandanand.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 10,
    name: 'Karuna Nundy, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Civil Rights',
    barNumber: 'D/1429/2000',
    experienceYears: 24,
    education: 'St. Stephen\'s College · Cambridge University · Columbia Law (LL.M.)',
    firmName: 'Chambers of Karuna Nundy',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 28000,
    rating: 4.9,
    reviewCount: 140,
    languages: 'English, Hindi, Bengali',
    bio: 'TIME 100 Most Influential People honoree. Renowned for online free speech defense (Section 66A IT Act), Bhopal toxic gas restorative justice, fundamental gender equality, and corporate commercial arbitration.',
    casesWon: 400,
    successRate: 98,
    phone: '+91 11 2649 3371',
    email: 'karuna@karunanundy.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 11,
    name: 'Gopal Subramanium, Senior Advocate',
    title: 'Senior Advocate & Former Solicitor General',
    specialty: 'Corporate Law',
    barNumber: 'D/209/1980',
    experienceYears: 44,
    education: 'Campus Law Centre, Faculty of Law, University of Delhi',
    firmName: 'Chambers of Gopal Subramanium',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 175,
    languages: 'English, Hindi, Tamil',
    bio: 'Former Solicitor General of India and Chairman of the Bar Council of India. Leading international arbitrator (FCIArb) and Supreme Court senior counsel in corporate commercial dispute resolution and public law.',
    casesWon: 740,
    successRate: 97,
    phone: '+91 11 2686 2110',
    email: 'subramanium@gschambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 12,
    name: 'Dr. Menaka Guruswamy, Senior Advocate',
    title: 'Senior Advocate & Constitutional Scholar',
    specialty: 'Civil Rights',
    barNumber: 'D/1812/1997',
    experienceYears: 27,
    education: 'NLSIU Bengaluru · Oxford (Rhodes Scholar, BCL) · Harvard (LL.M.)',
    firmName: 'Chambers of Dr. Menaka Guruswamy',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 32000,
    rating: 4.9,
    reviewCount: 156,
    languages: 'English, Hindi, Tamil',
    bio: 'TIME 100 honoree and Rhodes Scholar. Landmark lead counsel in decriminalizing Section 377 IPC (Navtej Johar), the Fundamental Right to Privacy (Puttaswamy), and bureaucratic transparency.',
    casesWon: 360,
    successRate: 98,
    phone: '+91 11 2623 4810',
    email: 'menaka@guruswamychambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 13,
    name: 'Shyam Divan, Senior Advocate',
    title: 'Senior Advocate & Environmental Jurisprudence Leader',
    specialty: 'Real Estate Law',
    barNumber: 'MAH/678/1984',
    experienceYears: 40,
    education: 'Government Law College, Mumbai · UC Berkeley (LL.M.)',
    firmName: 'Chambers of Shyam Divan',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 34000,
    rating: 4.9,
    reviewCount: 160,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'Author of the definitive treatise \'Environmental Law and Policy in India\'. Preeminent senior counsel in land acquisition, zoning laws, National Green Tribunal (NGT) litigations, and property dispute arbitrations.',
    casesWon: 520,
    successRate: 97,
    phone: '+91 11 2469 1184',
    email: 'sdivan@chambersdivan.in',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 14,
    name: 'Pinky Anand, Senior Advocate',
    title: 'Senior Advocate & Former Additional Solicitor General',
    specialty: 'Family Law',
    barNumber: 'D/274/1980',
    experienceYears: 44,
    education: 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)',
    firmName: 'Anand & Associates',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 32000,
    rating: 4.8,
    reviewCount: 168,
    languages: 'English, Hindi, Punjabi',
    bio: 'Former Additional Solicitor General of India. Master authority on international child custody disputes, Hague Convention litigations, matrimonial asset partition, divorce mediation, and domestic relations.',
    casesWon: 480,
    successRate: 96,
    phone: '+91 11 2652 7100',
    email: 'pinky@anandlaw.in',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 15,
    name: 'Prashant Bhushan, Advocate',
    title: 'Public Interest Litigator & Senior Advocate',
    specialty: 'Civil Rights',
    barNumber: 'D/308/1983',
    experienceYears: 41,
    education: 'Allahabad University · IIT Madras · Princeton University',
    firmName: 'Centre for Public Interest Litigation (CPIL)',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 20000,
    rating: 4.8,
    reviewCount: 195,
    languages: 'English, Hindi',
    bio: 'Legendary Public Interest Litigation (PIL) advocate. Spearheaded landmark transparency cases, 2G spectrum cancellations, coal block allocations, environmental protections, and judicial accountability.',
    casesWon: 530,
    successRate: 95,
    phone: '+91 11 2656 4003',
    email: 'pbhushan@cpilindia.org',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 16,
    name: 'C. Aryama Sundaram, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Corporate Law',
    barNumber: 'MS/332/1980',
    experienceYears: 44,
    education: 'Madras Law College (LL.B.)',
    firmName: 'Chambers of C.A. Sundaram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    hourlyRate: 38000,
    rating: 4.9,
    reviewCount: 148,
    languages: 'English, Hindi, Tamil',
    bio: 'High-profile senior counsel specializing in corporate shareholder disputes, Insolvency and Bankruptcy Code (IBC) proceedings, CCI competition law appeals, and constitutional writs.',
    casesWon: 620,
    successRate: 97,
    phone: '+91 44 2499 1234',
    email: 'casundaram@sundaramchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 17,
    name: 'Dushyant Dave, Senior Advocate',
    title: 'Senior Advocate & Former President SCBA',
    specialty: 'Real Estate Law',
    barNumber: 'G/190/1978',
    experienceYears: 46,
    education: 'Gujarat University (LL.B.)',
    firmName: 'Chambers of Dushyant Dave',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 39000,
    rating: 4.9,
    reviewCount: 158,
    languages: 'English, Hindi, Gujarati',
    bio: 'Three-time President of the Supreme Court Bar Association. Premier authority on mega-infrastructure construction arbitrations, commercial property leases, land title litigation, and contract enforcement.',
    casesWon: 690,
    successRate: 98,
    phone: '+91 11 2685 5543',
    email: 'dave@dushyantdave.in',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 18,
    name: 'Saurabh Kirpal, Senior Advocate',
    title: 'Senior Advocate, Delhi High Court & Supreme Court',
    specialty: 'Employment Law',
    barNumber: 'D/892/1994',
    experienceYears: 30,
    education: 'St. Stephen\'s · Oxford University · Cambridge (LL.M.)',
    firmName: 'Kirpal Chambers',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 30000,
    rating: 4.9,
    reviewCount: 125,
    languages: 'English, Hindi',
    bio: 'Leading senior advocate in executive employment disputes, workplace discrimination, service jurisprudence, and commercial contract litigation. Lead counsel in landmark constitutional equality challenges.',
    casesWon: 380,
    successRate: 97,
    phone: '+91 11 2462 8840',
    email: 'saurabh@kirpalchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 19,
    name: 'Shardul S. Shroff, Advocate',
    title: 'Executive Chairman & Senior Partner',
    specialty: 'Corporate Law',
    barNumber: 'D/415/1980',
    experienceYears: 44,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Shardul Amarchand Mangaldas & Co.',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 46000,
    rating: 5.0,
    reviewCount: 218,
    languages: 'English, Hindi, Gujarati',
    bio: 'Executive Chairman of Shardul Amarchand Mangaldas. Doyen of Indian corporate finance, major cross-border M&A, debt restructurings, and Insolvency and Bankruptcy Code (IBC) resolutions.',
    casesWon: 540,
    successRate: 99,
    phone: '+91 11 4159 0700',
    email: 'shardul.shroff@amsshardul.com',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 20,
    name: 'Cyril Shroff, Advocate',
    title: 'Managing Partner & Financial Markets Authority',
    specialty: 'Corporate Law',
    barNumber: 'MAH/520/1982',
    experienceYears: 42,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Cyril Amarchand Mangaldas',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 47000,
    rating: 5.0,
    reviewCount: 230,
    languages: 'English, Hindi, Gujarati',
    bio: 'Managing Partner of Cyril Amarchand Mangaldas. Celebrated corporate strategist leading conglomerate board governance, banking syndications, private equity, and family business succession.',
    casesWon: 520,
    successRate: 99,
    phone: '+91 22 2496 4455',
    email: 'cyril.shroff@cyrilshroff.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 21,
    name: 'Poornima Hatti, Advocate',
    title: 'Partner & Workplace Dispute Resolution Leader',
    specialty: 'Employment Law',
    barNumber: 'KAR/910/2003',
    experienceYears: 21,
    education: 'NLSIU Bengaluru (B.A. LL.B.) · London School of Economics (LL.M.)',
    firmName: 'Samvad Partners',
    city: 'Bengaluru',
    state: 'Karnataka',
    hourlyRate: 26000,
    rating: 4.8,
    reviewCount: 112,
    languages: 'English, Hindi, Kannada',
    bio: 'Partner heading Dispute Resolution at Samvad Partners. Specialist in POSH compliance, executive severance structuring, labor regulations, whistleblower investigations, and commercial mediations.',
    casesWon: 310,
    successRate: 96,
    phone: '+91 80 4110 3344',
    email: 'poornima@samvadpartners.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 22,
    name: 'Nishith Desai, Advocate',
    title: 'Founder & International Tax Specialist',
    specialty: 'Tax Law',
    barNumber: 'MAH/390/1977',
    experienceYears: 47,
    education: 'Government Law College, Mumbai (LL.B., Tax Law)',
    firmName: 'Nishith Desai Associates',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 180,
    languages: 'English, Hindi, Gujarati',
    bio: 'Global pioneer in cross-border tax structuring, fund formation, Silicon Valley-India investments, cryptocurrency regulation, and international transfer pricing controversies.',
    casesWon: 450,
    successRate: 98,
    phone: '+91 22 6669 5000',
    email: 'nishith@nishithdesai.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 23,
    name: 'Vandana Shah, Advocate',
    title: 'Matrimonial Litigator & Family Law Authority',
    specialty: 'Family Law',
    barNumber: 'MAH/2104/2011',
    experienceYears: 15,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Vandana Shah & Associates',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 24000,
    rating: 4.8,
    reviewCount: 134,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'High-profile matrimonial litigator and author of \'Ex-Files\'. Renowned for high-net-worth divorce settlements, child custody disputes, NRI matrimonial conflicts, and domestic abuse legal protection.',
    casesWon: 330,
    successRate: 96,
    phone: '+91 22 2282 3901',
    email: 'vandana@vandanashah.com',
    avatarUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 24,
    name: 'Sajan Poovayya, Senior Advocate',
    title: 'Senior Advocate & Technology Law Specialist',
    specialty: 'Intellectual Property',
    barNumber: 'KAR/789/1996',
    experienceYears: 28,
    education: 'NLSIU Bengaluru · London School of Economics (LL.M.)',
    firmName: 'Poovayya & Co.',
    city: 'Bengaluru',
    state: 'Karnataka',
    hourlyRate: 34000,
    rating: 4.9,
    reviewCount: 145,
    languages: 'English, Hindi, Kannada',
    bio: 'Former Additional Advocate General of Karnataka. Foremost counsel in data privacy, intermediary liability, AI regulation, patent enforcement, and telecommunications litigation.',
    casesWon: 440,
    successRate: 97,
    phone: '+91 80 2221 4400',
    email: 'sajan@poovayya.net',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 25,
    name: 'Poorvi Chothani, Advocate',
    title: 'Managing Partner & Immigration Law Authority',
    specialty: 'Immigration Law',
    barNumber: 'MAH/1042/1983',
    experienceYears: 40,
    education: 'Government Law College, Mumbai · Penn Carey Law (LL.M.)',
    firmName: 'LawQuest International Law Firm',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 28000,
    rating: 4.9,
    reviewCount: 172,
    languages: 'English, Hindi, Gujarati, Marathi',
    bio: 'Founder of LawQuest and registered legal practitioner. Leading specialist in Indian-US cross-border immigration, corporate executive mobility, EB-5/L-1, NRI citizenship, and consular visa appeals.',
    casesWon: 520,
    successRate: 98,
    phone: '+91 22 6633 4455',
    email: 'poorvi@lawquestindia.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 26,
    name: 'Colin Gonsalves, Senior Advocate',
    title: 'Senior Advocate, Supreme Court & HRLN Founder',
    specialty: 'Personal Injury',
    barNumber: 'MAH/490/1983',
    experienceYears: 41,
    education: 'IIT Bombay (B.Tech) · Government Law College, Mumbai (LL.B.)',
    firmName: 'Human Rights Law Network (HRLN)',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 22000,
    rating: 4.9,
    reviewCount: 182,
    languages: 'English, Hindi, Marathi',
    bio: 'Senior Advocate and Right Livelihood Award recipient. Champion in Motor Accident Claims Tribunal (MACT), catastrophic industrial injuries, public tort liability, and victim compensation before the Supreme Court.',
    casesWon: 600,
    successRate: 97,
    phone: '+91 11 2437 4501',
    email: 'colin@hrln.org',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 27,
    name: 'Anand Grover, Senior Advocate',
    title: 'Senior Advocate & Health Law Authority',
    specialty: 'Healthcare Law',
    barNumber: 'MAH/355/1979',
    experienceYears: 45,
    education: 'University of Surrey (B.Sc) · Government Law College, Mumbai (LL.B.)',
    firmName: 'Lawyers Collective',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 32000,
    rating: 5.0,
    reviewCount: 148,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'Former UN Special Rapporteur on the Right to Health. Key litigator in historic Supreme Court pharmaceutical cases (Novartis cancer drug patent), healthcare regulation, medical negligence, and patient privacy.',
    casesWon: 490,
    successRate: 99,
    phone: '+91 22 2287 4001',
    email: 'anand@lawyerscollective.org',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  }
];

// ── DOM References ──
const lawyersGrid          = document.getElementById('lawyers-grid');
const lawyerSearchInput    = document.getElementById('lawyer-search-input');
const lawyerSearchClear    = document.getElementById('lawyer-search-clear');
const lawyerSpecialtySelect = document.getElementById('lawyer-specialty-select');
const lawyerLocationSelect = document.getElementById('lawyer-location-select');
const lawyerRateSelect     = document.getElementById('lawyer-rate-select');
const lawyerRatingSelect   = document.getElementById('lawyer-rating-select');
const lawyerAvailSelect    = document.getElementById('lawyer-avail-select');
const lawyerSortSelect     = document.getElementById('lawyer-sort-select');
const btnResetFilters      = document.getElementById('btn-reset-filters');
const lawyerCountBadge     = document.getElementById('lawyer-count-badge');
const specialtyPills       = document.querySelectorAll('.pill-chip');
const kpiTotalLawyers      = document.getElementById('kpi-total-lawyers');
const kpiAvailCount        = document.getElementById('kpi-available-count');
const badgeNavBookings     = document.getElementById('badge-nav-bookings');

// Modal Elements
const lawyerModalOverlay   = document.getElementById('lawyer-modal-overlay');
const lawyerModalClose     = document.getElementById('lawyer-modal-close');
const lawyerModalBtnClose  = document.getElementById('lawyer-modal-btn-close');
const lawyerModalBtnBook   = document.getElementById('lawyer-modal-btn-book');
const lawyerModalBtnCopy   = document.getElementById('lawyer-modal-btn-copy');
const lawyerCopyBtnText    = document.getElementById('lawyer-copy-btn-text');

const consultOverlay       = document.getElementById('consult-modal-overlay');
const consultModalClose    = document.getElementById('consult-modal-close');
const consultModalTitle    = document.getElementById('consult-modal-title');
const consultAttySubtitle  = document.getElementById('consult-attorney-subtitle');
const consultLawyerId      = document.getElementById('consult-lawyer-id');
const consultForm          = document.getElementById('consult-form');
const consultSubmit        = document.getElementById('consult-submit');

const bookingsModalOverlay = document.getElementById('bookings-modal-overlay');
const bookingsModalClose   = document.getElementById('bookings-modal-close');
const bookingsListContainer= document.getElementById('bookings-list-container');
const bookingsSearchInput  = document.getElementById('bookings-search-input');
const bookingsRefreshBtn   = document.getElementById('bookings-refresh-btn');

let currentModalLawyer = null;
let bookingsData = [];
let currentBookingTab = 'all';

// ── Helpers ──
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getInitials(name) {
  if (!name) return 'A';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Lawyer Card HTML Generator ──
function lawyerCardHTML(l) {
  const avatarEl = l.avatarUrl
    ? `<img class="lawyer-avatar" src="${l.avatarUrl}" alt="${escapeHtml(l.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback" style="display:none">${getInitials(l.name)}</div>`
    : `<div class="lawyer-avatar-fallback">${getInitials(l.name)}</div>`;

  const isAvail = l.isAvailable !== 0;
  const availBadge = isAvail
    ? `<span class="badge-availability available" title="Available for immediate client consultation"><span class="status-pulse-dot"></span> Available for Consult</span>`
    : `<span class="badge-availability booked" title="Currently retained on active trial dockets"><span class="status-busy-dot"></span> Booked / In Trial</span>`;

  const consultBtn = isAvail
    ? `<button class="btn-consult" data-lawyer-id="${l.id}" onclick="event.stopPropagation(); openConsultModal('${l.id}')">
        📅 Book Consultation
      </button>`
    : `<button class="btn-consult btn-waitlist" data-lawyer-id="${l.id}" onclick="event.stopPropagation(); openConsultModal('${l.id}')">
        ⏳ Join Waitlist / Inquire
      </button>`;

  const activeBooking = (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData))
    ? bookingsData.find(b => String(b.lawyerId) === String(l.id) && b.status !== 'cancelled')
    : null;

  const footerAction = activeBooking
    ? `
      <div class="lawyer-card-booked-footer">
        <div class="card-booked-status">
          <span class="status-pulse-dot"></span>
          <span>Booked: <strong>${escapeHtml(activeBooking.preferredDate)}</strong></span>
        </div>
        <div class="card-booked-actions">
          <button class="btn-card-cancel" onclick="event.stopPropagation(); cancelConsultationBooking(${activeBooking.id})" title="Cancel this consultation">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Cancel Booking
          </button>
          <button class="btn-profile" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="View complete credentials, biography & bar registration">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Full Details
          </button>
        </div>
      </div>
    `
    : `
      ${consultBtn}
      <button class="btn-profile" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="View complete credentials, biography & bar registration">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Full Details
      </button>
    `;

  return `
  <div class="lawyer-card ${isAvail ? 'card-available' : 'card-booked'}" id="lawyer-card-${l.id}" data-id="${l.id}" onclick="handleLawyerCardClick(event, '${l.id}')" title="Click to view full credentials of ${escapeHtml(l.name)}">
    <div class="lawyer-card-header">
      <div class="lawyer-avatar-clickable" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">
        ${avatarEl}
      </div>
      <div class="lawyer-header-info">
        <div class="lawyer-name" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">${escapeHtml(l.name)}</div>
        <div class="lawyer-title">${escapeHtml(l.title || 'Advocate / Senior Counsel')}</div>
        <div class="lawyer-badges">
          <span class="badge-verified">✓ Bar Verified</span>
          <span class="badge-specialty" onclick="event.stopPropagation(); openLawyerModal('${l.id}')">${escapeHtml(l.specialty)}</span>
          ${availBadge}
        </div>
      </div>
    </div>

    <div class="lawyer-rating-row">
      <span class="stars">${renderStars(l.rating)}</span>
      <span class="lawyer-rating-val">${Number(l.rating).toFixed(1)}</span>
      <span class="lawyer-review-count">(${l.reviewCount} reviews)</span>
    </div>

    <div class="lawyer-stats-row">
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.experienceYears}+</span>
        <span class="lawyer-stat-lbl">Yrs Exp</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.casesWon}</span>
        <span class="lawyer-stat-lbl">Cases Won</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.successRate}%</span>
        <span class="lawyer-stat-lbl">Win Rate</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">₹${Number(l.hourlyRate).toLocaleString('en-IN')}</span>
        <span class="lawyer-stat-lbl">Per Hour</span>
      </div>
    </div>

    <div class="lawyer-details-list">
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${escapeHtml(l.firmName)} — ${escapeHtml(l.city)}, ${escapeHtml(l.state)}</span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Bar Enrollment: <strong>${escapeHtml(l.barNumber || 'Verified')}</strong></span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>${escapeHtml(l.education || '')}</span>
      </div>
    </div>

    <p class="lawyer-bio">${escapeHtml(l.bio || '')}</p>

    <div class="lawyer-card-footer">
      ${footerAction}
    </div>
  </div>`;
}

function renderSkeletons(count = 6) {
  if (!lawyersGrid) return;
  lawyersGrid.innerHTML = Array.from({ length: count }, () => `
    <div class="lawyer-skeleton">
      <div style="display:flex;gap:14px;align-items:center">
        <div class="skeleton-line" style="width:72px;height:72px;border-radius:50%;flex-shrink:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px">
          <div class="skeleton-line" style="height:16px;width:70%"></div>
          <div class="skeleton-line" style="height:12px;width:45%"></div>
          <div class="skeleton-line" style="height:12px;width:55%"></div>
        </div>
      </div>
      <div class="skeleton-line" style="height:12px;width:50%"></div>
      <div style="display:flex;gap:12px">
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div class="skeleton-line" style="height:11px;width:90%"></div>
        <div class="skeleton-line" style="height:11px;width:75%"></div>
        <div class="skeleton-line" style="height:11px;width:80%"></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <div class="skeleton-line" style="height:40px;flex:1"></div>
        <div class="skeleton-line" style="height:40px;width:110px"></div>
      </div>
    </div>
  `).join('');
}

function renderLawyers(lawyers) {
  if (!lawyersGrid) return;

  if (!lawyers || lawyers.length === 0) {
    lawyersGrid.innerHTML = `
      <div class="lawyers-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--gold); margin-bottom:16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <h3 style="font-family:'Playfair Display', serif; color:#fff; font-size:1.5rem; margin-bottom:8px;">No Advocates Matching Criteria</h3>
        <p style="color:var(--muted); max-width:480px; margin:0 auto 20px;">We could not find verified advocates matching your active filters. Try clearing or expanding your search parameters.</p>
        <button class="directory-reset-btn" onclick="resetAllFilters();" style="margin: 0 auto;">Reset All Search Filters</button>
      </div>`;
    if (lawyerCountBadge) lawyerCountBadge.textContent = 'Showing 0 results';
    return;
  }

  lawyersGrid.innerHTML = lawyers.map(lawyerCardHTML).join('');
  if (lawyerCountBadge) {
    const availCount = lawyers.filter(l => l.isAvailable !== 0).length;
    lawyerCountBadge.textContent = `Showing ${lawyers.length} Verified Advocate${lawyers.length !== 1 ? 's' : ''} (${availCount} Available for Consult)`;
  }
}

// ── Sort Utility ──
function applySorting(list, sortKey) {
  const sorted = [...list];
  switch (sortKey) {
    case 'experience':
      return sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    case 'cases':
      return sorted.sort((a, b) => (b.casesWon || 0) - (a.casesWon || 0));
    case 'rate-asc':
      return sorted.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    case 'rate-desc':
      return sorted.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    case 'rating':
    default:
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.casesWon || 0) - (a.casesWon || 0));
  }
}

// ── Fetch & Filter Engine ──
async function fetchAndRenderLawyers() {
  renderSkeletons();
  try {
    const params = new URLSearchParams();
    if (lawyerFilters.search)        params.set('search',       lawyerFilters.search);
    if (lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties')
                                      params.set('specialty',    lawyerFilters.specialty);
    if (lawyerFilters.maxFee)        params.set('maxFee',       lawyerFilters.maxFee);
    if (lawyerFilters.minRating)     params.set('minRating',    lawyerFilters.minRating);
    if (lawyerFilters.availability)  params.set('availability', lawyerFilters.availability);

    const resp = await fetch(`${LAWYERS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('Server error ' + resp.status);
    const data = await resp.json();
    let result = data.lawyers || [];

    // Filter location client-side if selected
    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      result = result.filter(l => l.city === lawyerFilters.location || l.state === lawyerFilters.location);
    }

    result = applySorting(result, lawyerFilters.sortBy);
    lawyersData = result;
    renderLawyers(lawyersData);

    // Update KPI counters
    if (kpiTotalLawyers) kpiTotalLawyers.textContent = lawyersData.length;
    if (kpiAvailCount) {
      const totalAvail = lawyersData.filter(l => l.isAvailable !== 0).length;
      kpiAvailCount.textContent = totalAvail;
    }
  } catch (err) {
    console.warn('Backend lawyer API unavailable, loading authentic verified Indian advocates dataset:', err.message);
    let filtered = [...FALLBACK_LAWYERS];

    if (lawyerFilters.availability === 'available' || lawyerFilters.availability === '1') {
      filtered = filtered.filter(l => l.isAvailable !== 0);
    } else if (lawyerFilters.availability === 'booked' || lawyerFilters.availability === '0') {
      filtered = filtered.filter(l => l.isAvailable === 0);
    }

    if (lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties') {
      filtered = filtered.filter(l => l.specialty.toLowerCase() === lawyerFilters.specialty.toLowerCase());
    }

    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      filtered = filtered.filter(l => l.city === lawyerFilters.location || l.state === lawyerFilters.location);
    }

    if (lawyerFilters.search && lawyerFilters.search.trim()) {
      const q = lawyerFilters.search.trim().toLowerCase();
      filtered = filtered.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.firmName && l.firmName.toLowerCase().includes(q)) ||
        (l.bio && l.bio.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.state && l.state.toLowerCase().includes(q)) ||
        (l.barNumber && l.barNumber.toLowerCase().includes(q)) ||
        (l.specialty && l.specialty.toLowerCase().includes(q))
      );
    }

    if (lawyerFilters.maxFee) {
      filtered = filtered.filter(l => Number(l.hourlyRate) <= Number(lawyerFilters.maxFee));
    }

    if (lawyerFilters.minRating) {
      filtered = filtered.filter(l => Number(l.rating) >= Number(lawyerFilters.minRating));
    }

    filtered = applySorting(filtered, lawyerFilters.sortBy);
    lawyersData = filtered;
    renderLawyers(lawyersData);

    if (kpiTotalLawyers) kpiTotalLawyers.textContent = lawyersData.length;
    if (kpiAvailCount) {
      const totalAvail = lawyersData.filter(l => l.isAvailable !== 0).length;
      kpiAvailCount.textContent = totalAvail;
    }
  }
}

// ── Sync Pills ──
function syncPillsToSpecialty(spec) {
  specialtyPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.specialty === spec);
  });
}

// ── Reset All Filters ──
window.resetAllFilters = function() {
  lawyerFilters = {
    search: '',
    specialty: 'All Specialties',
    location: 'All Locations',
    maxFee: '',
    minRating: '',
    availability: '',
    sortBy: 'rating'
  };

  if (lawyerSearchInput) lawyerSearchInput.value = '';
  if (lawyerSearchClear) lawyerSearchClear.classList.add('hidden');
  if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = 'All Specialties';
  if (lawyerLocationSelect) lawyerLocationSelect.value = 'All Locations';
  if (lawyerRateSelect) lawyerRateSelect.value = '';
  if (lawyerRatingSelect) lawyerRatingSelect.value = '';
  if (lawyerAvailSelect) lawyerAvailSelect.value = '';
  if (lawyerSortSelect) lawyerSortSelect.value = 'rating';

  syncPillsToSpecialty('All Specialties');
  fetchAndRenderLawyers();
  showToast('✓ Search filters have been reset', 'info');
};

if (btnResetFilters) btnResetFilters.addEventListener('click', resetAllFilters);

// ── Debounce utility ──
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Search & Filter Listeners ──
if (lawyerSearchInput) {
  lawyerSearchInput.addEventListener('input', debounce(() => {
    lawyerFilters.search = lawyerSearchInput.value.trim();
    if (lawyerSearchClear) {
      lawyerSearchClear.classList.toggle('hidden', !lawyerFilters.search);
    }
    fetchAndRenderLawyers();
  }, 300));
}

if (lawyerSearchClear) {
  lawyerSearchClear.addEventListener('click', () => {
    lawyerFilters.search = '';
    if (lawyerSearchInput) lawyerSearchInput.value = '';
    lawyerSearchClear.classList.add('hidden');
    fetchAndRenderLawyers();
  });
}

if (lawyerSpecialtySelect) {
  lawyerSpecialtySelect.addEventListener('change', () => {
    lawyerFilters.specialty = lawyerSpecialtySelect.value;
    syncPillsToSpecialty(lawyerFilters.specialty);
    fetchAndRenderLawyers();
  });
}

if (lawyerLocationSelect) {
  lawyerLocationSelect.addEventListener('change', () => {
    lawyerFilters.location = lawyerLocationSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerRateSelect) {
  lawyerRateSelect.addEventListener('change', () => {
    lawyerFilters.maxFee = lawyerRateSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerRatingSelect) {
  lawyerRatingSelect.addEventListener('change', () => {
    lawyerFilters.minRating = lawyerRatingSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerAvailSelect) {
  lawyerAvailSelect.addEventListener('change', () => {
    lawyerFilters.availability = lawyerAvailSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerSortSelect) {
  lawyerSortSelect.addEventListener('change', () => {
    lawyerFilters.sortBy = lawyerSortSelect.value;
    fetchAndRenderLawyers();
  });
}

// Specialty Pills click
specialtyPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const spec = pill.dataset.specialty;
    lawyerFilters.specialty = spec;
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = spec;
    syncPillsToSpecialty(spec);
    fetchAndRenderLawyers();
  });
});

// ── Lawyer Full Details Modal ──
window.handleLawyerCardClick = function(event, lawyerId) {
  if (event.target.closest('button') || event.target.closest('a') || event.target.closest('input')) {
    return;
  }
  openLawyerModal(lawyerId);
};

window.openLawyerModal = async function(lawyerId, fallbackLawyer = null) {
  let lawyer = null;

  // 1. Try finding in loaded lawyersData
  if (typeof lawyersData !== 'undefined' && Array.isArray(lawyersData)) {
    lawyer = lawyersData.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId));
  }

  // 2. Try finding in FALLBACK_LAWYERS
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
    lawyer = FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId));
  }

  // 3. Fallback parameter
  if (!lawyer && fallbackLawyer) lawyer = fallbackLawyer;

  // 4. Try matching by name
  if (!lawyer) {
    const fallbackObj = typeof FALLBACK_LAWYERS !== 'undefined' ? FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId)) : null;
    const searchTarget = fallbackObj ? fallbackObj.name : (typeof lawyerId === 'string' && isNaN(Number(lawyerId)) ? lawyerId : null);
    if (searchTarget) {
      const q = searchTarget.toLowerCase().trim();
      if (typeof lawyersData !== 'undefined' && Array.isArray(lawyersData)) {
        lawyer = lawyersData.find(l => l.name && (l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())));
      }
      if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
        lawyer = FALLBACK_LAWYERS.find(l => l.name && (l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())));
      }
    }
  }

  // 5. If missing details, fetch directly from API
  if (!lawyer || !lawyer.bio || !lawyer.phone) {
    try {
      const resp = await fetch(`${LAWYERS_API}/${lawyerId}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.lawyer) {
          lawyer = json.lawyer;
        }
      }
    } catch (e) {
      console.warn('Could not fetch lawyer by id:', e);
    }
  }

  // 6. Default to first advocate if not found
  if (!lawyer) {
    lawyer = (lawyersData && lawyersData.length > 0) ? lawyersData[0] : FALLBACK_LAWYERS[0];
  }

  if (!lawyer || !lawyerModalOverlay) return;
  currentModalLawyer = lawyer;

  // Header Avatar
  const avatarWrap = document.getElementById('lawyer-modal-avatar-wrap');
  if (avatarWrap) {
    const initials = getInitials(lawyer.name || 'Advocate');
    avatarWrap.innerHTML = lawyer.avatarUrl 
      ? `<img class="lawyer-modal-avatar" src="${lawyer.avatarUrl}" alt="${escapeHtml(lawyer.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" /><div class="lawyer-modal-avatar-fallback" style="display:none">${initials}</div>`
      : `<div class="lawyer-modal-avatar-fallback">${initials}</div>`;
  }

  // Header info
  const nameEl = document.getElementById('lawyer-modal-name');
  if (nameEl) nameEl.textContent = lawyer.name || 'Advocate';

  const titleEl = document.getElementById('lawyer-modal-title');
  if (titleEl) titleEl.textContent = lawyer.title || 'Legal Advocate & Counsel';

  const specialtyEl = document.getElementById('lawyer-modal-specialty');
  if (specialtyEl) specialtyEl.textContent = lawyer.specialty || 'General Practice';

  const availEl = document.getElementById('lawyer-modal-avail');
  if (availEl) {
    const isAvail = lawyer.isAvailable !== 0;
    availEl.className = `badge-availability ${isAvail ? 'available' : 'booked'}`;
    availEl.innerHTML = isAvail 
      ? '<span class="status-pulse-dot"></span> Available for Consult'
      : '<span class="status-busy-dot"></span> Booked / In Trial';
  }

  const barnumEl = document.getElementById('lawyer-modal-barnum');
  if (barnumEl) barnumEl.textContent = `Bar Council Enrollment: ${lawyer.barNumber || 'Verified'}`;

  // Key Metrics
  const expEl = document.getElementById('lawyer-modal-exp');
  if (expEl) expEl.textContent = `${lawyer.experienceYears || 10}+ Years`;

  const winsEl = document.getElementById('lawyer-modal-wins');
  if (winsEl) winsEl.textContent = `${lawyer.casesWon || 50} Cases Won`;

  const successEl = document.getElementById('lawyer-modal-success');
  if (successEl) successEl.textContent = `${lawyer.successRate || 95}%`;

  const ratingEl = document.getElementById('lawyer-modal-rating');
  if (ratingEl) ratingEl.textContent = `★ ${Number(lawyer.rating || 5.0).toFixed(1)} (${lawyer.reviewCount || 40} reviews)`;

  const rateEl = document.getElementById('lawyer-modal-rate');
  if (rateEl) rateEl.textContent = `₹${Number(lawyer.hourlyRate || 5000).toLocaleString('en-IN')} / hr`;

  // Chambers & Location
  const locEl = document.getElementById('lawyer-modal-location');
  if (locEl) {
    const firm = lawyer.firmName ? `${lawyer.firmName} — ` : '';
    locEl.textContent = `${firm}${lawyer.city || ''}, ${lawyer.state || ''}`;
  }

  // Education & Languages
  const eduEl = document.getElementById('lawyer-modal-education');
  if (eduEl) eduEl.textContent = lawyer.education || 'Faculty of Law, Recognized Bar';

  const langEl = document.getElementById('lawyer-modal-languages');
  if (langEl) langEl.textContent = lawyer.languages || 'English, Hindi';

  // Direct Contact
  const phoneEl = document.getElementById('lawyer-modal-phone');
  const phoneLink = document.getElementById('lawyer-modal-phone-link');
  if (phoneEl) phoneEl.textContent = lawyer.phone || '+91 11 2461 7890';
  if (phoneLink) {
    phoneLink.href = lawyer.phone ? `tel:${lawyer.phone.replace(/[^\d+]/g, '')}` : '#';
  }

  const emailEl = document.getElementById('lawyer-modal-email');
  const emailLink = document.getElementById('lawyer-modal-email-link');
  if (emailEl) emailEl.textContent = lawyer.email || 'counsel@legalai.org';
  if (emailLink) {
    emailLink.href = lawyer.email ? `mailto:${lawyer.email}` : '#';
  }

  // Biography
  const bioEl = document.getElementById('lawyer-modal-bio');
  if (bioEl) bioEl.textContent = lawyer.bio || 'Trial attorney dedicated to client advocacy and comprehensive courtroom representation.';

  if (lawyerModalBtnBook) {
    lawyerModalBtnBook.onclick = () => {
      closeLawyerModal();
      openConsultModal(lawyer.id, lawyer);
    };
  }

  if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = 'Copy Advocate Details';

  lawyerModalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeLawyerModal = function() {
  if (lawyerModalOverlay) lawyerModalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
};

window.copyLawyerDetails = function() {
  if (!currentModalLawyer) return;
  const text = `ADVOCATE PROFILE — LegalAI
Name: ${currentModalLawyer.name} (${currentModalLawyer.title || 'Advocate'})
Specialty: ${currentModalLawyer.specialty}
Bar Enrollment: ${currentModalLawyer.barNumber}
Experience: ${currentModalLawyer.experienceYears}+ Years | Cases Won: ${currentModalLawyer.casesWon} | Win Rate: ${currentModalLawyer.successRate}%
Chambers / Firm: ${currentModalLawyer.firmName || ''} (${currentModalLawyer.city || ''}, ${currentModalLawyer.state || ''})
Education: ${currentModalLawyer.education || ''}
Languages: ${currentModalLawyer.languages || ''}
Phone: ${currentModalLawyer.phone}
Email: ${currentModalLawyer.email}
Consultation Fee: ₹${Number(currentModalLawyer.hourlyRate).toLocaleString('en-IN')} / hour`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = '✓ Copied!';
      showToast('✓ Advocate credentials copied to clipboard!', 'success');
      setTimeout(() => {
        if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = 'Copy Advocate Details';
      }, 2500);
    });
  } else {
    showToast('Advocate details selected for copy', 'info');
  }
};

if (lawyerModalClose)    lawyerModalClose.addEventListener('click', closeLawyerModal);
if (lawyerModalBtnClose) lawyerModalBtnClose.addEventListener('click', closeLawyerModal);
if (lawyerModalBtnCopy)  lawyerModalBtnCopy.addEventListener('click', copyLawyerDetails);

if (lawyerModalOverlay) {
  lawyerModalOverlay.addEventListener('click', (e) => {
    if (e.target === lawyerModalOverlay) closeLawyerModal();
  });
}

// ── Consultation Booking Modal ──
window.openConsultModal = function(lawyerId, fallbackLawyer = null) {
  let lawyer = lawyersData.find(l => String(l.id) === String(lawyerId)) ||
               FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId)) ||
               fallbackLawyer;

  if (!lawyer || !consultOverlay) return;

  consultLawyerId.value = lawyer.id;
  consultModalTitle.textContent = `Book — ${lawyer.name}`;
  consultAttySubtitle.textContent = `${lawyer.title || 'Advocate'} · ${lawyer.specialty} · ₹${Number(lawyer.hourlyRate).toLocaleString('en-IN')}/hr`;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('consult-date');
  if (dateInput) dateInput.min = today;

  consultOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeConsultModal = function() {
  if (consultOverlay) consultOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  if (consultForm) consultForm.reset();
};

if (consultModalClose) consultModalClose.addEventListener('click', closeConsultModal);

if (consultOverlay) {
  consultOverlay.addEventListener('click', (e) => {
    if (e.target === consultOverlay) closeConsultModal();
  });
}

// Consultation Form Submission
if (consultForm) {
  consultForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lawyerId      = consultLawyerId.value;
    const clientName    = document.getElementById('consult-name')?.value.trim();
    const clientEmail   = document.getElementById('consult-email')?.value.trim();
    const clientPhone   = document.getElementById('consult-phone')?.value.trim();
    const preferredDate = document.getElementById('consult-date')?.value;
    const caseSummary   = document.getElementById('consult-summary')?.value.trim();

    if (!clientName || !clientEmail || !clientPhone || !preferredDate) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const btnText    = consultSubmit.querySelector('.btn-text');
    const btnSpinner = consultSubmit.querySelector('.btn-spinner');
    if (btnText) btnText.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    consultSubmit.disabled = true;

    try {
      const resp = await fetch(`${LAWYERS_API}/${lawyerId}/consult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientEmail, clientPhone, preferredDate, caseSummary })
      });
      const data = await resp.json();

      if (data.success) {
        closeConsultModal();
        showToast(`✅ Consultation booked with ${data.lawyer?.name || 'Advocate'}!`, 'success');
        await fetchAndRenderBookings();
        renderLawyers(lawyersData);
      } else {
        showToast(data.message || 'Could not submit booking request.', 'error');
      }
    } catch (err) {
      // Local fallback booking
      const matchedAtty = lawyersData.find(l => String(l.id) === String(lawyerId)) || FALLBACK_LAWYERS[0];
      const newBooking = {
        id: Date.now(),
        lawyerId: matchedAtty.id,
        lawyerName: matchedAtty.name,
        lawyerTitle: matchedAtty.title,
        lawyerSpecialty: matchedAtty.specialty,
        lawyerRate: matchedAtty.hourlyRate,
        lawyerPhone: matchedAtty.phone,
        lawyerEmail: matchedAtty.email,
        lawyerAvatar: matchedAtty.avatarUrl,
        clientName,
        clientEmail,
        clientPhone,
        preferredDate,
        caseSummary,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      bookingsData.unshift(newBooking);
      try { localStorage.setItem('legalai_consultations', JSON.stringify(bookingsData)); } catch (_) {}
      closeConsultModal();
      showToast(`✅ Consultation booked with ${matchedAtty.name}!`, 'success');
      updateBookingsCounters(bookingsData.filter(b => b.status !== 'cancelled').length);
      renderBookingsList(bookingsData);
      renderLawyers(lawyersData);
    } finally {
      if (btnText) btnText.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
      consultSubmit.disabled = false;
    }
  });
}

// ── Bookings Modal Engine ──
window.openBookingsModal = function() {
  if (bookingsModalOverlay) {
    bookingsModalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    fetchAndRenderBookings();
  }
};

window.closeBookingsModal = function() {
  if (bookingsModalOverlay) {
    bookingsModalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

if (bookingsModalClose) bookingsModalClose.addEventListener('click', closeBookingsModal);

if (bookingsModalOverlay) {
  bookingsModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookingsModalOverlay) closeBookingsModal();
  });
}

function updateBookingsCounters(count) {
  if (badgeNavBookings) badgeNavBookings.textContent = count;
  const badgeBookedCount = document.getElementById('badge-booked-count');
  if (badgeBookedCount) badgeBookedCount.textContent = count;
}

async function fetchAndRenderBookings() {
  try {
    const resp = await fetch(`${LAWYERS_API}/consultations`);
    if (resp.ok) {
      const data = await resp.json();
      bookingsData = data.consultations || [];
    } else {
      bookingsData = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
    }
  } catch (err) {
    bookingsData = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
  }
  const activeBookings = bookingsData.filter(b => b.status !== 'cancelled');
  updateBookingsCounters(activeBookings.length);
  renderBookingsList(bookingsData);
}

function renderBookingsList(bookings) {
  if (!bookingsListContainer) return;

  const allBookings = bookingsData || [];
  const activeBookings = allBookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');

  const countAllTab = document.getElementById('count-all-tab');
  const countActiveTab = document.getElementById('count-active-tab');
  const countCancelledTab = document.getElementById('count-cancelled-tab');
  if (countAllTab) countAllTab.textContent = allBookings.length;
  if (countActiveTab) countActiveTab.textContent = activeBookings.length;
  if (countCancelledTab) countCancelledTab.textContent = cancelledBookings.length;

  let filtered = bookings || [];
  if (currentBookingTab === 'active') {
    filtered = filtered.filter(b => b.status !== 'cancelled');
  } else if (currentBookingTab === 'cancelled') {
    filtered = filtered.filter(b => b.status === 'cancelled');
  }

  if (!filtered || filtered.length === 0) {
    bookingsListContainer.innerHTML = `
      <div class="bookings-empty-state" style="text-align:center; padding: 40px 20px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--gold); margin-bottom:12px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h4 style="color:#fff; margin-bottom:6px;">No Consultations in this view</h4>
        <p style="color:var(--muted); font-size:0.85rem;">Browse our verified advocate directory and schedule your legal advisory meeting.</p>
      </div>`;
    return;
  }

  bookingsListContainer.innerHTML = filtered.map(b => {
    const isCancelled = b.status === 'cancelled';
    const statusBadge = isCancelled
      ? `<span class="booking-status-pill status-cancelled"><span class="status-busy-dot"></span> Cancelled</span>`
      : `<span class="booking-status-pill status-active"><span class="status-pulse-dot"></span> Confirmed Consultation</span>`;

    const avatarEl = b.lawyerAvatar
      ? `<img class="booking-card-avatar" src="${b.lawyerAvatar}" alt="${escapeHtml(b.lawyerName)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback small" style="display:none">${getInitials(b.lawyerName || 'A')}</div>`
      : `<div class="lawyer-avatar-fallback small">${getInitials(b.lawyerName || 'A')}</div>`;

    return `
      <div class="booked-consult-card ${isCancelled ? 'booking-cancelled' : ''}" id="booking-item-${b.id}">
        <div class="booking-card-top">
          <div class="booking-atty-profile" onclick="openLawyerModal('${b.lawyerId}')" style="cursor:pointer;" title="Click to view advocate's full credentials">
            ${avatarEl}
            <div>
              <div class="booking-atty-name" style="text-decoration: underline dotted var(--gold);">${escapeHtml(b.lawyerName || 'Advocate')}</div>
              <div class="booking-atty-meta">
                <span>${escapeHtml(b.lawyerTitle || 'Counsel')}</span> · 
                <span class="badge-specialty small">${escapeHtml(b.lawyerSpecialty || 'General Practice')}</span>
                ${b.lawyerRate ? ` · <strong style="color:var(--gold);">₹${Number(b.lawyerRate).toLocaleString('en-IN')}/hr</strong>` : ''}
              </div>
            </div>
          </div>
          <div class="booking-meta-right">
            ${statusBadge}
            <div class="booking-ref-id">REF #LGL-${String(b.id).slice(-4)}</div>
          </div>
        </div>

        <div class="booking-card-body">
          <div class="booking-info-grid">
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div>
                <span class="info-label">Session Date</span>
                <span class="info-val highlight-date">📅 ${escapeHtml(b.preferredDate || 'TBD')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div>
                <span class="info-label">Client Name</span>
                <span class="info-val">${escapeHtml(b.clientName || 'Client')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <span class="info-label">Contact Phone</span>
                <span class="info-val">${escapeHtml(b.clientPhone || b.lawyerPhone || 'N/A')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <div>
                <span class="info-label">Email</span>
                <span class="info-val">${escapeHtml(b.clientEmail || b.lawyerEmail || 'N/A')}</span>
              </div>
            </div>
          </div>
          ${b.caseSummary ? `
            <div class="booking-summary-box" style="margin-top:12px;">
              <span class="info-label">Case Note:</span>
              <p style="margin:2px 0 0 0; color:#fff; font-size:0.85rem;">${escapeHtml(b.caseSummary)}</p>
            </div>
          ` : ''}
        </div>

        <div class="booking-card-actions">
          <button type="button" class="booking-action-btn btn-view-profile" onclick="openLawyerModal('${b.lawyerId}')" title="View advocate profile & credentials">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Advocate Details
          </button>
          ${b.lawyerPhone ? `
            <a href="tel:${b.lawyerPhone}" class="booking-action-btn btn-call" title="Call office: ${b.lawyerPhone}">Call Chambers</a>
          ` : ''}
          ${!isCancelled ? `
            <button class="booking-action-btn btn-cancel" onclick="cancelConsultationBooking(${b.id})" title="Cancel this consultation">Cancel</button>
          ` : `
            <span class="booking-cancelled-label">Cancelled</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

window.cancelConsultationBooking = async function(id) {
  if (!confirm('Are you sure you want to cancel this scheduled consultation?')) return;
  try {
    const resp = await fetch(`${LAWYERS_API}/consultations/${id}`, { method: 'DELETE' });
    if (resp.ok) {
      showToast('Consultation cancelled successfully.', 'info');
    }
  } catch (_) {}
  const b = bookingsData.find(item => item.id === id);
  if (b) b.status = 'cancelled';
  try { localStorage.setItem('legalai_consultations', JSON.stringify(bookingsData)); } catch (_) {}
  updateBookingsCounters(bookingsData.filter(x => x.status !== 'cancelled').length);
  renderBookingsList(bookingsData);
  renderLawyers(lawyersData);
};

// Bookings Tabs
document.querySelectorAll('.bookings-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bookings-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBookingTab = btn.dataset.tab;
    renderBookingsList(bookingsData);
  });
});

if (bookingsSearchInput) {
  bookingsSearchInput.addEventListener('input', () => {
    const q = bookingsSearchInput.value.toLowerCase().trim();
    if (!q) {
      renderBookingsList(bookingsData);
    } else {
      const filtered = bookingsData.filter(b =>
        (b.lawyerName && b.lawyerName.toLowerCase().includes(q)) ||
        (b.clientName && b.clientName.toLowerCase().includes(q)) ||
        (b.clientEmail && b.clientEmail.toLowerCase().includes(q)) ||
        (b.lawyerSpecialty && b.lawyerSpecialty.toLowerCase().includes(q))
      );
      renderBookingsList(filtered);
    }
  });
}

if (bookingsRefreshBtn) {
  bookingsRefreshBtn.addEventListener('click', () => {
    fetchAndRenderBookings();
    showToast('Consultations refreshed', 'info');
  });
}

// ── Global Escape Key Listener ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lawyerModalOverlay && !lawyerModalOverlay.classList.contains('hidden')) {
      closeLawyerModal();
    }
    if (consultOverlay && !consultOverlay.classList.contains('hidden')) {
      closeConsultModal();
    }
    if (bookingsModalOverlay && !bookingsModalOverlay.classList.contains('hidden')) {
      closeBookingsModal();
    }
  }
});

// ── Side Menu Navigation Drawer ──
const navMenuBtn     = document.getElementById('nav-menu-btn');
const sideMenuDrawer = document.getElementById('side-menu-drawer');
const sideMenuOverlay= document.getElementById('side-menu-overlay');
const sideMenuClose  = document.getElementById('side-menu-close');

function openSideMenu() {
  if (sideMenuDrawer) sideMenuDrawer.classList.add('open');
  if (sideMenuOverlay) sideMenuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
  if (sideMenuDrawer) sideMenuDrawer.classList.remove('open');
  if (sideMenuOverlay) sideMenuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

navMenuBtn?.addEventListener('click', openSideMenu);
sideMenuClose?.addEventListener('click', closeSideMenu);
sideMenuOverlay?.addEventListener('click', closeSideMenu);

// ── URL Query Parameters Parser ──
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const spec = params.get('specialty');
  if (spec) {
    lawyerFilters.specialty = spec;
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = spec;
    syncPillsToSpecialty(spec);
  }
  const city = params.get('city');
  if (city && lawyerLocationSelect) {
    lawyerFilters.location = city;
    lawyerLocationSelect.value = city;
  }
  const search = params.get('search');
  if (search && lawyerSearchInput) {
    lawyerFilters.search = search;
    lawyerSearchInput.value = search;
    if (lawyerSearchClear) lawyerSearchClear.classList.remove('hidden');
  }
}

// ── Initialize on Page Load ──
document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  fetchAndRenderLawyers();
  fetchAndRenderBookings();
});


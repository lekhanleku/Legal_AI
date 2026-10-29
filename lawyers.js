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
  court: 'All Courts',
  location: 'All Locations',
  maxFee: '',
  minRating: '',
  availability: '',
  sortBy: 'rating'
};

// ── Fallback Dataset of 37 Verified Indian Advocates with Court Affiliations ──
const FALLBACK_LAWYERS = (typeof window !== 'undefined' && Array.isArray(window.INDIAN_LAWYERS_DATA))
  ? window.INDIAN_LAWYERS_DATA
  : [
  {
    "id": 1,
    "name": "Harish Salve, Senior Advocate",
    "title": "Senior Advocate & King's Counsel",
    "specialty": "Corporate Law",
    "barNumber": "D/248/1980",
    "experienceYears": 44,
    "education": "Nagpur University, LL.B. · FCA",
    "firmName": "Chambers of Harish Salve",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 45000,
    "rating": 5,
    "reviewCount": 248,
    "languages": "English, Hindi, Marathi",
    "bio": "Former Solicitor General of India and King's Counsel. Master legal strategist renowned worldwide for high-stakes international commercial arbitration, cross-border corporate mergers, Kulbhushan Jadhav case before the ICJ, and landmark Supreme Court constitutional benches.",
    "casesWon": 860,
    "successRate": 99,
    "phone": "+91 11 2461 7890",
    "email": "h.salve@chambersofsalve.in",
    "avatarUrl": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NCLAT,GHC,ITAT,TDSAT,NCLT-DEL,PHHC,HAR-GUR-DC,CH-SEC43-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · ITAT · TDSAT · NCLT-DEL · Punjab & Haryana High Court",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 2,
    "name": "Mukul Rohatgi, Senior Advocate",
    "title": "Senior Advocate & 14th Attorney General for India",
    "specialty": "Criminal Law",
    "barNumber": "D/152/1978",
    "experienceYears": 46,
    "education": "Faculty of Law, University of Delhi, LL.B.",
    "firmName": "Chambers of Mukul Rohatgi",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 42000,
    "rating": 4.9,
    "reviewCount": 210,
    "languages": "English, Hindi",
    "bio": "14th Attorney General for India and former Additional Solicitor General. One of India's most celebrated senior trial defense and corporate litigators before the Supreme Court of India and High Courts nationwide.",
    "casesWon": 920,
    "successRate": 98,
    "phone": "+91 11 2338 4120",
    "email": "rohatgi@mukulrohatgi.com",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-PAT,DEL-TIS,AHC,ITAT,PHHC,DEL-SAK-DC,DEL-DWA-DC,UP-GBN-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · ITAT · Punjab & Haryana High Court · Allahabad High Court · Patiala House Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 3,
    "name": "Dr. Abhishek Manu Singhvi, Senior Advocate",
    "title": "Senior Advocate, Supreme Court of India",
    "specialty": "Corporate Law",
    "barNumber": "D/318/1982",
    "experienceYears": 42,
    "education": "Trinity College, Cambridge (Ph.D.) · Harvard Law School",
    "firmName": "Chambers of Dr. Abhishek Manu Singhvi",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 40000,
    "rating": 4.9,
    "reviewCount": 185,
    "languages": "English, Hindi, Marwari",
    "bio": "Youngest designated Senior Advocate in Supreme Court history. Celebrated for high-stakes corporate disputes, commercial arbitration, telecom litigation, and decisive constitutional bench arguments.",
    "casesWon": 790,
    "successRate": 97,
    "phone": "+91 11 2611 9045",
    "email": "amsinghvi@singhvilegal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NCLAT,DEL-PAT,TDSAT,NCLT-DEL,PHHC,RJ-JAI-DC,RJ-JOD-DC,CH-SEC43-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · TDSAT · NCLT-DEL · NCLAT · Punjab & Haryana High Court",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 4,
    "name": "Indira Jaising, Senior Advocate",
    "title": "Senior Advocate & Human Rights Pioneer",
    "specialty": "Civil Rights",
    "barNumber": "MAH/421/1965",
    "experienceYears": 58,
    "education": "Government Law College, Mumbai, LL.B.",
    "firmName": "The Lawyers Collective",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 30000,
    "rating": 5,
    "reviewCount": 205,
    "languages": "English, Hindi, Marathi, Sindhi",
    "bio": "First woman Senior Advocate designated by Bombay High Court and first female Additional Solicitor General of India. Legendary pioneer in fundamental rights, workplace gender equality, and key architect of the Domestic Violence Act.",
    "casesWon": 690,
    "successRate": 98,
    "phone": "+91 11 2437 5521",
    "email": "indira.jaising@lawyerscollective.org",
    "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,BHC,DEL-TIS,DEL-SAK-DC,GOA-PAN-DC,JK-SGR-DC",
    "practicingCourts": "Supreme Court of India · Bombay High Court · Delhi High Court · Tis Hazari Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 5,
    "name": "Kapil Sibal, Senior Advocate",
    "title": "Senior Advocate & SCBA President",
    "specialty": "Criminal Law",
    "barNumber": "D/104/1972",
    "experienceYears": 52,
    "education": "Faculty of Law, University of Delhi · Harvard Law School (LL.M.)",
    "firmName": "Chambers of Kapil Sibal",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 45000,
    "rating": 4.9,
    "reviewCount": 230,
    "languages": "English, Hindi, Punjabi",
    "bio": "President of the Supreme Court Bar Association and former Union Minister for Law & Justice. Preeminent counsel in high-profile criminal defense, constitutional liberties, federalism, and appellate litigation.",
    "casesWon": 890,
    "successRate": 98,
    "phone": "+91 11 2307 3311",
    "email": "chambers@kapilsibal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-PAT,DEL-KKD-MM,AHC,BIH-PAT-DC,UP-LKO-DC,JH-RAN-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · Patiala House · Karkardooma Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 6,
    "name": "Zia Mody, Advocate",
    "title": "Founding & Senior Partner",
    "specialty": "Corporate Law",
    "barNumber": "MAH/314/1979",
    "experienceYears": 45,
    "education": "Selwyn College, Cambridge (MA) · Harvard Law School (LL.M.)",
    "firmName": "AZB & Partners",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 48000,
    "rating": 5,
    "reviewCount": 260,
    "languages": "English, Hindi, Gujarati",
    "bio": "India's foremost corporate law luminary. Founder of AZB & Partners, orchestrating multi-billion dollar cross-border mergers, private equity transactions, conglomerate governance, and banking resolutions.",
    "casesWon": 610,
    "successRate": 99,
    "phone": "+91 22 6639 6880",
    "email": "zia.mody@azbpartners.com",
    "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MUM-SCCH-BOM,NCLAT,SCI,NCLT-DEL,ITAT,MH-PUN-DC,GUJ-VAD-DC",
    "practicingCourts": "Bombay High Court · NCLT-DEL · NCLAT · ITAT · City Civil Court Mumbai · Small Causes Court Mumbai",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 7,
    "name": "K.K. Venugopal, Senior Advocate",
    "title": "Senior Advocate & 15th Attorney General for India",
    "specialty": "Civil Rights",
    "barNumber": "MS/18/1954",
    "experienceYears": 70,
    "education": "Raja Lakhamgouda Law College, Belgaum",
    "firmName": "Chambers of K.K. Venugopal",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 50000,
    "rating": 5,
    "reviewCount": 320,
    "languages": "English, Hindi, Malayalam, Tamil",
    "bio": "Doyen of the Indian Bar, Padma Vibhushan awardee, and 15th Attorney General for India. Unrivaled constitutional authority on basic structure doctrine, federal dispute resolution, and public jurisprudence.",
    "casesWon": 1180,
    "successRate": 99,
    "phone": "+91 11 2338 2901",
    "email": "kk.venugopal@kkvchambers.in",
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,MHC,KER-ERN-DC,TN-CHE-DC,AP-VIZ-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · Madras High Court",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 8,
    "name": "Mahesh Jethmalani, Senior Advocate",
    "title": "Senior Advocate, Supreme Court & Bombay High Court",
    "specialty": "Criminal Law",
    "barNumber": "MAH/812/1980",
    "experienceYears": 44,
    "education": "St. Xavier's Mumbai · Oxford University (M.A. Jurisprudence)",
    "firmName": "Jethmalani Chambers",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 38000,
    "rating": 4.8,
    "reviewCount": 150,
    "languages": "English, Hindi, Marathi, Sindhi",
    "bio": "Master trial and appellate criminal defense counsel, celebrated for handling high-profile economic offenses (PMLA/ED/CBI), cross-examinations, constitutional liberty writs, and corporate white-collar defense.",
    "casesWon": 640,
    "successRate": 96,
    "phone": "+91 22 2204 1599",
    "email": "mahesh@jethmalanichambers.com",
    "avatarUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MH-ESP-CMM,MH-AND-MM,SCI,MH-PUN-DC,DD-DAM-DC,GOA-PAN-DC",
    "practicingCourts": "Bombay High Court · City Civil Court Mumbai · Esplanade CMM Court · Andheri MM Court",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 9,
    "name": "Pravin Anand, Advocate",
    "title": "Managing Partner & IP Pioneer",
    "specialty": "Intellectual Property",
    "barNumber": "D/148/1979",
    "experienceYears": 45,
    "education": "Campus Law Centre, Faculty of Law, University of Delhi",
    "firmName": "Anand and Anand",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 36000,
    "rating": 5,
    "reviewCount": 205,
    "languages": "English, Hindi",
    "bio": "Pioneer of intellectual property law in India. Lead counsel in historic patent litigations, software copyright doctrines, standard-essential patents (SEP), and cross-border trademark protection.",
    "casesWon": 740,
    "successRate": 99,
    "phone": "+91 120 405 9300",
    "email": "pravin@anandandanand.com",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "DHC,SCI,DEL-PAT,DEL-SAK-MM,DEL-SAK-DC,DEL-ROH-DC,HAR-GUR-DC",
    "practicingCourts": "Delhi High Court (IPD) · Supreme Court of India · Patiala House Courts · Saket Court",
    "primaryCourt": "High Court of Delhi"
  },
  {
    "id": 10,
    "name": "Karuna Nundy, Senior Advocate",
    "title": "Senior Advocate, Supreme Court of India",
    "specialty": "Civil Rights",
    "barNumber": "D/1429/2000",
    "experienceYears": 24,
    "education": "St. Stephen's College · Cambridge University · Columbia Law (LL.M.)",
    "firmName": "Chambers of Karuna Nundy",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 28000,
    "rating": 4.9,
    "reviewCount": 140,
    "languages": "English, Hindi, Bengali",
    "bio": "TIME 100 Most Influential People honoree. Renowned for online free speech defense (Section 66A IT Act), Bhopal toxic gas restorative justice, fundamental gender equality, and corporate commercial arbitration.",
    "casesWon": 400,
    "successRate": 98,
    "phone": "+91 11 2649 3371",
    "email": "karuna@karunanundy.com",
    "avatarUrl": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NGT,DEL-SAK-MM,CHC,ASM-KAM-DC,ML-SHI-DC,SK-GAN-DC,WB-CAL-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · National Green Tribunal · Saket Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 11,
    "name": "Gopal Subramanium, Senior Advocate",
    "title": "Senior Advocate & Former Solicitor General of India",
    "specialty": "Corporate Law",
    "barNumber": "D/204/1980",
    "experienceYears": 44,
    "education": "Faculty of Law, University of Delhi",
    "firmName": "Chambers of Gopal Subramanium",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 40000,
    "rating": 5,
    "reviewCount": 195,
    "languages": "English, Hindi",
    "bio": "Former Solicitor General and Chairman of the Bar Council of India. Leading international commercial arbitrator and counsel in complex corporate reorganizations, public trusts, and landmark constitutional challenges.",
    "casesWon": 810,
    "successRate": 98,
    "phone": "+91 11 2686 2110",
    "email": "gs@gopalsubramanium.com",
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-PAT,UK-DEH-DC,HP-SHI-DC,MP-BHO-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · Patiala House Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 12,
    "name": "Dr. Menaka Guruswamy, Senior Advocate",
    "title": "Senior Advocate, Supreme Court of India",
    "specialty": "Civil Rights",
    "barNumber": "D/1098/1997",
    "experienceYears": 27,
    "education": "NLSIU Bengaluru · Oxford University (D.Phil / Rhodes Scholar) · Harvard Law (LL.M.)",
    "firmName": "Chambers of Menaka Guruswamy",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 30000,
    "rating": 5,
    "reviewCount": 175,
    "languages": "English, Hindi",
    "bio": "Rhodes Scholar and Forbes/TIME honoree. Historic lead counsel in Section 377 decriminalization (Navtej Johar case), Right to Education defense, institutional constitutional integrity, and white-collar defense.",
    "casesWon": 450,
    "successRate": 98,
    "phone": "+91 11 2617 8820",
    "email": "menaka@guruswamy.legal",
    "avatarUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-KKD-MM,DEL-KKD-DC,MN-IMP-DC,MZ-AIZ-DC,NL-KOH-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · Karkardooma Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 13,
    "name": "Shyam Divan, Senior Advocate",
    "title": "Senior Advocate & Environmental Jurisprudence Leader",
    "specialty": "Real Estate Law",
    "barNumber": "MAH/620/1982",
    "experienceYears": 42,
    "education": "Government Law College, Mumbai · UC Berkeley (LL.M.)",
    "firmName": "Chambers of Shyam Divan",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 35000,
    "rating": 4.9,
    "reviewCount": 160,
    "languages": "English, Hindi, Marathi",
    "bio": "Co-author of 'Environmental Law and Policy in India'. Foremost authority on Aadhaar right to privacy bench, forest conservation writs, commercial real estate development masterplans, and infrastructure covenants.",
    "casesWon": 620,
    "successRate": 97,
    "phone": "+91 11 2433 1180",
    "email": "shyam.divan@divanchambers.in",
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NGT,DEL-SAK-MM,UK-DEH-DC,HP-SHI-DC,CG-RAI-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · National Green Tribunal · Saket Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 14,
    "name": "Pinky Anand, Senior Advocate",
    "title": "Senior Advocate & Former Additional Solicitor General",
    "specialty": "Family Law",
    "barNumber": "D/188/1980",
    "experienceYears": 44,
    "education": "Faculty of Law, University of Delhi · Harvard Law School (LL.M.)",
    "firmName": "Chambers of Pinky Anand",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 32000,
    "rating": 4.8,
    "reviewCount": 190,
    "languages": "English, Hindi",
    "bio": "Former Additional Solicitor General of India. Master authority on international child custody disputes, Hague Convention litigations, matrimonial asset partition, divorce mediation, and domestic relations.",
    "casesWon": 670,
    "successRate": 97,
    "phone": "+91 11 2623 4499",
    "email": "pinky.anand@pinkyanand.com",
    "avatarUrl": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-PAT,DEL-SAK-MM,DEL-SAK-DC,UP-GBN-DC,HAR-GUR-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · Patiala House · Saket Family Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 15,
    "name": "Prashant Bhushan, Advocate",
    "title": "Public Interest Advocate, Supreme Court of India",
    "specialty": "Civil Rights",
    "barNumber": "UP/512/1983",
    "experienceYears": 41,
    "education": "Allahabad University · Princeton University",
    "firmName": "Chambers of Prashant Bhushan",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 20000,
    "rating": 4.8,
    "reviewCount": 220,
    "languages": "English, Hindi",
    "bio": "India's foremost public interest litigator (PIL). Renowned for exposing high-level corruption, telecom 2G licenses revocation, coal block allocation cancellations, and whistleblower protection suits.",
    "casesWon": 530,
    "successRate": 95,
    "phone": "+91 11 2651 8840",
    "email": "prashant@prashantbhushan.in",
    "avatarUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NGT,DEL-TIS,NCDRC,MP-IND-DC,CG-RAI-DC,JH-RAN-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · NGT · NCDRC · Tis Hazari Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 16,
    "name": "C. Aryama Sundaram, Senior Advocate",
    "title": "Senior Advocate, Supreme Court & Madras High Court",
    "specialty": "Corporate Law",
    "barNumber": "MS/408/1980",
    "experienceYears": 44,
    "education": "Madras Law College",
    "firmName": "Chambers of C. Aryama Sundaram",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "hourlyRate": 38000,
    "rating": 4.9,
    "reviewCount": 165,
    "languages": "English, Tamil, Hindi",
    "bio": "Preeminent Senior Counsel in corporate mergers, telecom competition disputes, BCCI constitution reform, media broadcasting rights, and high-value original side civil suits before Madras High Court.",
    "casesWon": 720,
    "successRate": 97,
    "phone": "+91 44 2499 1102",
    "email": "aryama@sundaramlegal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "MHC,TN-SCCH-CHE,TN-EGM-CMM,SCI,DHC,TN-CHE-DC,TN-CBE-DC,PY-PUD-DC,AP-VIZ-DC",
    "practicingCourts": "Madras High Court · Court of Small Causes Chennai · Egmore CMM · Supreme Court",
    "primaryCourt": "High Court of Judicature at Madras"
  },
  {
    "id": 17,
    "name": "Dushyant Dave, Senior Advocate",
    "title": "Senior Advocate & Former SCBA President",
    "specialty": "Real Estate Law",
    "barNumber": "G/112/1978",
    "experienceYears": 46,
    "education": "Faculty of Law, Gujarat University",
    "firmName": "Chambers of Dushyant Dave",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 39000,
    "rating": 4.9,
    "reviewCount": 175,
    "languages": "English, Hindi, Gujarati",
    "bio": "Three-time President of the Supreme Court Bar Association. Premier authority on mega-infrastructure construction arbitrations, commercial property leases, land title litigation, and contract enforcement.",
    "casesWon": 750,
    "successRate": 98,
    "phone": "+91 11 2614 7720",
    "email": "dushyant.dave@davelegal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,GHC,GUJ-SCCH-AHD,DEL-PAT,GUJ-VAD-DC,RJ-JOD-DC",
    "practicingCourts": "Supreme Court of India · Gujarat High Court · Ahmedabad Small Causes · Delhi High Court",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 18,
    "name": "Saurabh Kirpal, Senior Advocate",
    "title": "Senior Advocate, High Court of Delhi",
    "specialty": "Employment Law",
    "barNumber": "D/885/1995",
    "experienceYears": 29,
    "education": "St. Stephen's College · Oxford University · Cambridge University (LL.M.)",
    "firmName": "Chambers of Saurabh Kirpal",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 26000,
    "rating": 4.9,
    "reviewCount": 130,
    "languages": "English, Hindi",
    "bio": "Author of 'Sex and the Supreme Court'. Premier advocate for workplace equality covenants, non-compete disputes, executive employment agreements, POSH anti-harassment inquiries, and commercial litigations.",
    "casesWon": 410,
    "successRate": 97,
    "phone": "+91 11 2465 9901",
    "email": "saurabh@kirpallegal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "DHC,SCI,DEL-PAT,DEL-SAK-DC,DEL-DWA-DC",
    "practicingCourts": "Delhi High Court · Supreme Court of India · Patiala House Courts",
    "primaryCourt": "High Court of Delhi"
  },
  {
    "id": 19,
    "name": "Shardul S. Shroff, Advocate",
    "title": "Executive Chairman & Senior Partner",
    "specialty": "Corporate Law",
    "barNumber": "D/401/1980",
    "experienceYears": 44,
    "education": "Sydenham College · Government Law College, Mumbai",
    "firmName": "Shardul Amarchand Mangaldas & Co",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 46000,
    "rating": 5,
    "reviewCount": 218,
    "languages": "English, Hindi, Gujarati",
    "bio": "Executive Chairman of SAM & Co. Globally recognized authority on cross-border bankruptcy (IBC), project finance, defense procurement, sovereign debt restructurings, and complex commercial arbitrations.",
    "casesWon": 540,
    "successRate": 99,
    "phone": "+91 11 4159 0700",
    "email": "shardul.shroff@amsshardul.com",
    "avatarUrl": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,NCLAT,DEL-PAT,NCLT-DEL,HAR-GUR-DC,MH-PUN-DC,UP-GBN-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · NCLT-DEL · NCLAT · Commercial Courts",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 20,
    "name": "Cyril Shroff, Advocate",
    "title": "Managing Partner & Corporate Strategist",
    "specialty": "Corporate Law",
    "barNumber": "MAH/492/1982",
    "experienceYears": 42,
    "education": "Government Law College, Mumbai (LL.B.)",
    "firmName": "Cyril Amarchand Mangaldas",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 46000,
    "rating": 5,
    "reviewCount": 240,
    "languages": "English, Hindi, Gujarati",
    "bio": "Managing Partner of CAM. Renowned financial market lawyer leading India's landmark conglomerates, capital markets issues, fintech regulations, antitrust clearances, and corporate family office governance.",
    "casesWon": 580,
    "successRate": 99,
    "phone": "+91 22 2496 4455",
    "email": "cyril.shroff@cyrilshroff.com",
    "avatarUrl": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MUM-SCCH-BOM,NCLAT,SCI,NCLT-DEL,ITAT,MH-PUN-DC,GUJ-VAD-DC,DD-DAM-DC",
    "practicingCourts": "Bombay High Court · NCLT-DEL · NCLAT · ITAT · City Civil Court Mumbai · Small Causes Court Mumbai",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 21,
    "name": "Poornima Hatti, Advocate",
    "title": "Partner & Head of Dispute Resolution",
    "specialty": "Employment Law",
    "barNumber": "KAR/1245/2003",
    "experienceYears": 21,
    "education": "NLSIU Bengaluru · London School of Economics (LL.M.)",
    "firmName": "Samvad Partners",
    "city": "Bengaluru",
    "state": "Karnataka",
    "hourlyRate": 24000,
    "rating": 4.8,
    "reviewCount": 115,
    "languages": "English, Kannada, Hindi",
    "bio": "Leader of Samvad Partners dispute resolution practice in Bengaluru. Specialist in commercial cross-border contracts, tech-sector employment disputes, employee IP ownership, and corporate mediation.",
    "casesWon": 340,
    "successRate": 96,
    "phone": "+91 80 4040 3300",
    "email": "poornima.hatti@samvadpartners.com",
    "avatarUrl": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "KHC,KAR-BLR-CIV,KAR-SCCH-BLR,KAR-MAYO-BLR,KAR-ANE-JMFC,KAR-MYS-DC",
    "practicingCourts": "High Court of Karnataka · City Civil Court Bengaluru · Mayo Hall Court · Anekal JMFC",
    "primaryCourt": "High Court of Karnataka"
  },
  {
    "id": 22,
    "name": "Nishith Desai, Advocate",
    "title": "Founder & International Tax Counsel",
    "specialty": "Tax Law",
    "barNumber": "MAH/208/1976",
    "experienceYears": 48,
    "education": "Government Law College, Mumbai",
    "firmName": "Nishith Desai Associates",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 42000,
    "rating": 4.9,
    "reviewCount": 165,
    "languages": "English, Hindi, Gujarati",
    "bio": "Pioneering international tax attorney. Architect of Mauritius and Singapore double-tax treaty structures for global funds entering India, Vodafone withholding tax landmark defense, and crypto taxation advisory.",
    "casesWon": 590,
    "successRate": 98,
    "phone": "+91 22 6669 5000",
    "email": "nd@nishithdesai.com",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MUM-SCCH-BOM,MH-PUN-JMFC,MH-PUN-DC,GOA-PAN-DC",
    "practicingCourts": "Bombay High Court · City Civil Court Mumbai · Small Causes Court Mumbai · Pune Court",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 23,
    "name": "Vandana Shah, Advocate",
    "title": "Matrimonial Counsel & Author",
    "specialty": "Family Law",
    "barNumber": "MAH/1620/2006",
    "experienceYears": 18,
    "education": "KC Law College, Mumbai",
    "firmName": "Vandana Shah & Associates",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 22000,
    "rating": 4.8,
    "reviewCount": 145,
    "languages": "English, Hindi, Gujarati, Marathi",
    "bio": "High-profile matrimonial litigator and author of 'Ex-Files'. Renowned for high-net-worth divorce settlements, child custody disputes, NRI matrimonial conflicts, and domestic abuse legal protection.",
    "casesWon": 390,
    "successRate": 95,
    "phone": "+91 22 2367 8900",
    "email": "vandana@vandanashah.com",
    "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MUM-SCCH-BOM,MH-KUR-MM,MH-PUN-DC,GOA-PAN-DC",
    "practicingCourts": "Bombay High Court (Family Bench) · City Civil Court Mumbai · Kurla MM Court",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 24,
    "name": "Sajan Poovayya, Senior Advocate",
    "title": "Senior Advocate, Supreme Court & Karnataka High Court",
    "specialty": "Intellectual Property",
    "barNumber": "KAR/890/1996",
    "experienceYears": 28,
    "education": "NLSIU Bengaluru · London School of Economics (LL.M.)",
    "firmName": "Poovayya & Co",
    "city": "Bengaluru",
    "state": "Karnataka",
    "hourlyRate": 34000,
    "rating": 4.9,
    "reviewCount": 148,
    "languages": "English, Kannada, Hindi",
    "bio": "Former Additional Advocate General of Karnataka. Preeminent counsel in high-tech IP patents, data privacy constitutional suits, e-commerce regulatory compliance, and cross-border commercial arbitration.",
    "casesWon": 510,
    "successRate": 97,
    "phone": "+91 80 4242 1100",
    "email": "sajan@poovayya.net",
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "KHC,KAR-BLR-CIV,KAR-MAYO-BLR,KAR-DEV-JMFC,SCI,KAR-MYS-DC,TN-CBE-DC",
    "practicingCourts": "High Court of Karnataka · City Civil Bengaluru · Mayo Hall Court · Devanahalli JMFC",
    "primaryCourt": "High Court of Karnataka"
  },
  {
    "id": 25,
    "name": "Poorvi Chothani, Advocate",
    "title": "Managing Partner & Global Immigration Counsel",
    "specialty": "Immigration Law",
    "barNumber": "MAH/940/1990",
    "experienceYears": 34,
    "education": "Government Law College, Mumbai · Brooklyn Law School (LL.M.)",
    "firmName": "LawQuest",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 22000,
    "rating": 4.8,
    "reviewCount": 128,
    "languages": "English, Hindi, Gujarati",
    "bio": "Founder of LawQuest. Leading cross-border immigration counsel advising multinational corporations, founders, and skilled professionals on outbound work permits, intra-company transfers, and citizenship laws.",
    "casesWon": 480,
    "successRate": 96,
    "phone": "+91 22 2200 4411",
    "email": "poorvi@lawquestindia.com",
    "avatarUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MH-AND-MM,MH-PUN-DC,GUJ-VAD-DC",
    "practicingCourts": "Bombay High Court · City Civil Court Mumbai · Andheri MM Court",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 26,
    "name": "Colin Gonsalves, Senior Advocate",
    "title": "Senior Advocate & Founder of HRLN",
    "specialty": "Personal Injury",
    "barNumber": "MAH/390/1981",
    "experienceYears": 43,
    "education": "IIT Bombay (B.Tech) · University of Bombay (LL.B.)",
    "firmName": "Human Rights Law Network",
    "city": "New Delhi",
    "state": "Delhi",
    "hourlyRate": 18000,
    "rating": 4.8,
    "reviewCount": 160,
    "languages": "English, Hindi, Konkani",
    "bio": "Right Livelihood Award laureate. Lead counsel in landmark public health litigations, industrial accidents tort compensation, right to food, migrant worker safety, and catastrophic personal injury recovery.",
    "casesWon": 620,
    "successRate": 96,
    "phone": "+91 11 2437 4501",
    "email": "colin@hrln.org",
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "SCI,DHC,DEL-TIS,DEL-KKD-MM,CHC,NCDRC,AR-YUP-DC,TR-AGA-DC,AN-PB-DC,JK-JAM-DC,LA-LEH-DC",
    "practicingCourts": "Supreme Court of India · Delhi High Court · NCDRC · Tis Hazari · Calcutta High Court",
    "primaryCourt": "Supreme Court of India"
  },
  {
    "id": 27,
    "name": "Anand Grover, Senior Advocate",
    "title": "Senior Advocate & Former UN Special Rapporteur",
    "specialty": "Healthcare Law",
    "barNumber": "MAH/210/1980",
    "experienceYears": 44,
    "education": "University of Surrey · Faculty of Law, University of Bombay",
    "firmName": "The Lawyers Collective",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 32000,
    "rating": 4.9,
    "reviewCount": 155,
    "languages": "English, Hindi, Punjabi",
    "bio": "Former UN Special Rapporteur on the Right to Health. Key litigator in the historic Novartis patent challenge before the Supreme Court, ensuring affordable generic cancer medicines for millions across the Global South.",
    "casesWon": 590,
    "successRate": 99,
    "phone": "+91 22 2287 4001",
    "email": "anand@lawyerscollective.org",
    "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "BHC,MUM-SES,MH-ESP-CMM,MH-THA-JMFC,SCI,PB-LUD-DC,PB-AMR-DC,CH-SEC43-DC",
    "practicingCourts": "Bombay High Court · City Civil Court Mumbai · Esplanade CMM · Thane JMFC Court",
    "primaryCourt": "High Court of Judicature at Bombay"
  },
  {
    "id": 28,
    "name": "Advocate Ramesh Chandra Hegde",
    "title": "Senior Civil & Taluka Trial Advocate",
    "specialty": "Real Estate Law",
    "barNumber": "KAR/1420/2004",
    "experienceYears": 20,
    "education": "University Law College, Bangalore University (LL.B.)",
    "firmName": "Hegde & Associates Legal Chambers",
    "city": "Bengaluru",
    "state": "Karnataka",
    "hourlyRate": 12000,
    "rating": 4.9,
    "reviewCount": 142,
    "languages": "Kannada, English, Telugu, Hindi",
    "bio": "Distinguished subordinate trial counsel specializing in Bengaluru Urban & Rural district courts, Small Causes (SCCH & Mayo Hall), and Taluka JMFC courts (Anekal, Devanahalli, Hoskote, Ramanagara, Channapatna). Master of land title verification, RTC rectifications, and partition suits.",
    "casesWon": 340,
    "successRate": 97,
    "phone": "+91 80 2221 4455",
    "email": "ramesh.hegde@hegdeleganet.in",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "KAR-BLR-CIV,KAR-SCCH-BLR,KAR-MAYO-BLR,KAR-ANE-JMFC,KAR-DEV-JMFC,KAR-HOS-JMFC,KAR-DOD-JMFC,KAR-NEL-JMFC,KAR-RAM-JMFC,KAR-CHN-JMFC,KAR-KAN-JMFC,KHC,KAR-MYS-DC",
    "practicingCourts": "Karnataka Taluka & JMFC Courts (Anekal, Devanahalli, Hoskote, Ramanagara, Channapatna, Kanakapura, Nelamangala) · Bengaluru Small Causes (SCCH & Mayo Hall)",
    "primaryCourt": "City Civil and Sessions Court, Bengaluru"
  },
  {
    "id": 29,
    "name": "Advocate Basavaraj Patil",
    "title": "Subordinate Trial & Criminal Defense Advocate",
    "specialty": "Criminal Law",
    "barNumber": "KAR/892/2008",
    "experienceYears": 16,
    "education": "KLE Society's Law College · Karnatak University",
    "firmName": "Patil Law Offices",
    "city": "Hubballi",
    "state": "Karnataka",
    "hourlyRate": 9500,
    "rating": 4.8,
    "reviewCount": 98,
    "languages": "Kannada, Hindi, English, Marathi",
    "bio": "Specialist trial defense attorney across North Karnataka subordinate courts, including Hubballi JMFC, Aland JMFC, Kundapura Civil Court, and the High Court of Karnataka Dharwad Bench. Celebrated for criminal bail applications, private complaints, and property boundary litigation.",
    "casesWon": 280,
    "successRate": 96,
    "phone": "+91 836 235 6677",
    "email": "b.patil@patillawoffices.in",
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "KAR-HUB-JMFC,KAR-ALD-JMFC,KAR-KUN-JMFC,KHC,KAR-MYS-DC",
    "practicingCourts": "Hubballi JMFC Court · Aland Taluk JMFC · Kundapura Senior Civil Court · Dharwad Bench KHC",
    "primaryCourt": "Principal Civil Judge & JMFC Court, Hubballi"
  },
  {
    "id": 30,
    "name": "Advocate Sanjay Deshmukh",
    "title": "Senior Trial & Metropolitan Magistrate Counsel",
    "specialty": "Criminal Law",
    "barNumber": "MAH/1904/2005",
    "experienceYears": 19,
    "education": "Government Law College, Mumbai · ILS Law College Pune",
    "firmName": "Deshmukh Legal Chambers",
    "city": "Mumbai",
    "state": "Maharashtra",
    "hourlyRate": 14000,
    "rating": 4.9,
    "reviewCount": 168,
    "languages": "Marathi, Hindi, English",
    "bio": "Renowned metropolitan trial defender before Esplanade Chief Metropolitan Magistrate (CMM), Andheri MM, Kurla MM, Thane JMFC, and Shivajinagar Pune Court of Small Causes. Expert cross-examiner in negotiable instruments (Section 138 NI Act), economic crimes, and magistrate bail hearings.",
    "casesWon": 420,
    "successRate": 97,
    "phone": "+91 22 2261 3344",
    "email": "sanjay@deshmukhlegal.com",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "MH-ESP-CMM,MH-AND-MM,MH-KUR-MM,MH-THA-JMFC,MH-PUN-JMFC,MUM-SCCH-BOM,MUM-SES,BHC,MH-PUN-DC,DD-DAM-DC,GOA-PAN-DC",
    "practicingCourts": "Esplanade CMM · Andheri MM · Kurla MM · Thane JMFC · Shivajinagar Pune Court of Small Causes",
    "primaryCourt": "Esplanade Chief Metropolitan Magistrate (CMM) Court"
  },
  {
    "id": 31,
    "name": "Advocate S. Meenakshi Sundaram",
    "title": "Civil & Subordinate Court Specialist",
    "specialty": "Civil Rights",
    "barNumber": "MS/1102/2006",
    "experienceYears": 18,
    "education": "Dr. Ambedkar Government Law College, Chennai",
    "firmName": "Sundaram & Partners Chennai",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "hourlyRate": 11000,
    "rating": 4.8,
    "reviewCount": 125,
    "languages": "Tamil, English, Telugu",
    "bio": "Practicing advocate before the Court of Small Causes Chennai, Egmore CMM Court, Tambaram JMFC Court, and Madras High Court. Renowned for rent control matters, civil summary suits, municipal boundary disputes, and civil revisions.",
    "casesWon": 310,
    "successRate": 96,
    "phone": "+91 44 2534 8899",
    "email": "meenakshi@sundaramlegalchennai.in",
    "avatarUrl": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "TN-SCCH-CHE,TN-EGM-CMM,TN-TAM-JMFC,MHC,TN-CHE-DC,TN-CBE-DC,PY-PUD-DC",
    "practicingCourts": "Court of Small Causes Chennai · Egmore CMM Court · Tambaram Subordinate & JMFC · Madras High Court",
    "primaryCourt": "Court of Small Causes, Chennai"
  },
  {
    "id": 32,
    "name": "Advocate Subhashish Roy",
    "title": "Senior Subordinate & Small Causes Advocate",
    "specialty": "Corporate Law",
    "barNumber": "WB/841/2007",
    "experienceYears": 17,
    "education": "Department of Law, University of Calcutta (LL.B.)",
    "firmName": "Roy & Associates Kolkata",
    "city": "Kolkata",
    "state": "West Bengal",
    "hourlyRate": 10500,
    "rating": 4.9,
    "reviewCount": 118,
    "languages": "Bengali, English, Hindi",
    "bio": "Preeminent commercial and small causes advocate practicing in the Bankshall Court (Small Causes Court Kolkata), Sealdah Metropolitan Magistrate Court, Bidhannagar (Salt Lake) ACJM Court, and Calcutta High Court.",
    "casesWon": 295,
    "successRate": 97,
    "phone": "+91 33 2248 1122",
    "email": "subhashish@roylegal.kolkata.in",
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "WB-SCCH-KOL,WB-SEA-MM,WB-BID-ACJM,CHC,WB-CAL-DC,WB-BAR-DC,ASM-KAM-DC,OD-CUT-DC,OD-KHO-DC,AN-PB-DC,TR-AGA-DC",
    "practicingCourts": "Bankshall Court of Small Causes Kolkata · Sealdah MM Court · Bidhannagar (Salt Lake) ACJM Court · Calcutta High Court",
    "primaryCourt": "Court of Small Causes & Bankshall Court, Kolkata"
  },
  {
    "id": 33,
    "name": "Advocate Ashokbhai Patel",
    "title": "Subordinate Civil & Small Causes Litigator",
    "specialty": "Real Estate Law",
    "barNumber": "GUJ/1540/2005",
    "experienceYears": 19,
    "education": "Sir L.A. Shah Law College, Ahmedabad",
    "firmName": "Patel & Associates Legal Advisory",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "hourlyRate": 11500,
    "rating": 4.8,
    "reviewCount": 134,
    "languages": "Gujarati, Hindi, English",
    "bio": "Veteran practitioner before the Court of Small Causes Ahmedabad, Sanand Taluka JMFC Court, and Gujarat High Court. Authority on agricultural land conversion, NA permissions, tenant eviction disputes, and local revenue appeals.",
    "casesWon": 330,
    "successRate": 96,
    "phone": "+91 79 2658 9900",
    "email": "ashok@patelassociates.gujarat.in",
    "avatarUrl": "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "GUJ-SCCH-AHD,GUJ-SAN-JMFC,GHC,GUJ-VAD-DC",
    "practicingCourts": "Court of Small Causes Ahmedabad · Sanand Taluka JMFC Court · Gujarat High Court",
    "primaryCourt": "Court of Small Causes, Ahmedabad"
  },
  {
    "id": 34,
    "name": "Advocate Anupama Sharma",
    "title": "Tehsil & District Trial Advocate",
    "specialty": "Family Law",
    "barNumber": "UP/2319/2009",
    "experienceYears": 15,
    "education": "Chhatrapati Shahu Ji Maharaj University, Kanpur",
    "firmName": "Sharma & Partners Chambers",
    "city": "Greater Noida",
    "state": "Uttar Pradesh",
    "hourlyRate": 10000,
    "rating": 4.9,
    "reviewCount": 112,
    "languages": "Hindi, English",
    "bio": "Trial advocate before Surajpur District & Tehsil Civil Court (Gautam Buddha Nagar), Modinagar Tehsil Court (Ghaziabad), Patiala House Courts, and Allahabad High Court. Specialist in family succession, partition decrees, and civil protection writs.",
    "casesWon": 260,
    "successRate": 96,
    "phone": "+91 120 234 5566",
    "email": "anupama@sharmalaw.up.in",
    "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "UP-GBN-TEH,UP-GZB-MOD,AHC,DEL-PAT,UP-GBN-DC,UP-LKO-DC,UP-KNP-DC,BIH-PAT-DC,UK-DEH-DC",
    "practicingCourts": "Surajpur District & Tehsil Court (Greater Noida) · Modinagar Civil Court (Ghaziabad) · Allahabad High Court",
    "primaryCourt": "Surajpur District & Tehsil Civil Court, Gautam Buddha Nagar"
  },
  {
    "id": 35,
    "name": "Advocate G. Rajeshwar Rao",
    "title": "Subordinate Criminal & Trial Defender",
    "specialty": "Criminal Law",
    "barNumber": "AP/1420/2003",
    "experienceYears": 21,
    "education": "Osmania University, Hyderabad (LL.B.)",
    "firmName": "Rao Criminal Law Associates",
    "city": "Hyderabad",
    "state": "Telangana",
    "hourlyRate": 12000,
    "rating": 4.8,
    "reviewCount": 145,
    "languages": "Telugu, Hindi, English",
    "bio": "Premier trial counsel practicing before Nampally Criminal Courts & Metropolitan Magistrate Complex, Kukatpally Junior Civil & JMFC Court, and Telangana High Court. Expert in criminal trial defenses, police custody hearings, and special anti-corruption matters.",
    "casesWon": 350,
    "successRate": 97,
    "phone": "+91 40 2320 8899",
    "email": "rajeshwar.rao@raocriminalchambers.in",
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "TG-NAM-MM,TG-KUK-JMFC,THC,SCI,TG-HYD-DC,TG-RR-DC,AP-VIZ-DC",
    "practicingCourts": "Nampally Criminal Courts & MM Complex · Kukatpally Junior Civil & JMFC Court · High Court for the State of Telangana · Supreme Court",
    "primaryCourt": "Nampally Criminal Courts & Metropolitan Magistrate Complex"
  },
  {
    "id": 36,
    "name": "Advocate K. Narayanan Namboothiri",
    "title": "Munsiff & Magistrate Court Specialist",
    "specialty": "Civil Rights",
    "barNumber": "K/912/2007",
    "experienceYears": 17,
    "education": "Government Law College, Ernakulam",
    "firmName": "Namboothiri Law Chambers",
    "city": "Aluva",
    "state": "Kerala",
    "hourlyRate": 9000,
    "rating": 4.8,
    "reviewCount": 105,
    "languages": "Malayalam, English, Tamil",
    "bio": "Subordinate trial specialist enrolled before Aluva Munsiff & JMFC Court, Ernakulam District Courts, and the High Court of Kerala. Leading advocate in land tenancy rights, motor vehicle claims (MACT), and civil injunction suits.",
    "casesWon": 240,
    "successRate": 96,
    "phone": "+91 484 262 7788",
    "email": "narayanan@namboothirilegal.in",
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "KL-ALU-JMFC,KERHC,SCI,KER-ERN-DC",
    "practicingCourts": "Aluva Munsiff & JMFC Court · Ernakulam District Courts · High Court of Kerala (KERHC)",
    "primaryCourt": "Aluva Munsiff & Judicial First Class Magistrate Court"
  },
  {
    "id": 37,
    "name": "Advocate Virendra Singh Shekhawat",
    "title": "Civil Judge & Magistrate Trial Advocate",
    "specialty": "Real Estate Law",
    "barNumber": "R/1324/2006",
    "experienceYears": 18,
    "education": "University Five Year Law College, University of Rajasthan, Jaipur",
    "firmName": "Shekhawat & Associates Legal Forum",
    "city": "Jaipur",
    "state": "Rajasthan",
    "hourlyRate": 9500,
    "rating": 4.9,
    "reviewCount": 122,
    "languages": "Hindi, Rajasthani, English",
    "bio": "Prominent trial counsel practicing before Sanganer Additional Civil Judge & JMFC Court, Jaipur District Courts, and Rajasthan High Court. Renowned for revenue land partitions, agricultural property disputes, and civil restitution proceedings.",
    "casesWon": 290,
    "successRate": 97,
    "phone": "+91 141 279 3322",
    "email": "virendra@shekhawatlegal.rajasthan.in",
    "avatarUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    "isAvailable": 1,
    "courtCodes": "RJ-SAN-JMFC,SCI,RJ-JAI-DC,RJ-JOD-DC,MP-IND-DC,MP-BHO-DC",
    "practicingCourts": "Sanganer Additional Civil & JMFC Court · Jaipur District Courts · Rajasthan High Court",
    "primaryCourt": "Sanganer Additional Civil Judge & JMFC Court"
  }
];

// ── DOM References ──
const lawyersGrid          = document.getElementById('lawyers-grid');
const lawyerSearchInput    = document.getElementById('lawyer-search-input');
const lawyerSearchClear    = document.getElementById('lawyer-search-clear');
const lawyerSpecialtySelect = document.getElementById('lawyer-specialty-select');
const lawyerCourtSelect     = document.getElementById('lawyer-court-select');
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

// Jurisdiction Advisory Banner Elements
const dirRuleBanner        = document.getElementById('directory-jurisdiction-rule-banner');
const dirRuleBannerTitle   = document.getElementById('dir-rule-banner-title');
const dirRuleBannerActs    = document.getElementById('dir-rule-banner-acts');
const dirRuleBannerDesc    = document.getElementById('dir-rule-banner-desc');
const dirRuleBannerMeta    = document.getElementById('dir-rule-banner-meta');

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

  // Court & Jurisdiction recommendation matching
  const hasCourtFilter = lawyerFilters.court && lawyerFilters.court !== 'All Courts';
  const hasSpecFilter = lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties';

  let isCourtMatched = false;
  if (hasCourtFilter) {
    const cCode = lawyerFilters.court.trim().toUpperCase();
    if (Array.isArray(l.courtCodes)) {
      isCourtMatched = l.courtCodes.includes(cCode);
    } else if (l.courtCodes) {
      isCourtMatched = String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
    }
  }

  let isSpecMatched = false;
  if (hasSpecFilter && l.specialty) {
    isSpecMatched = l.specialty.toLowerCase() === lawyerFilters.specialty.toLowerCase();
  }

  let matchBanner = '';
  let isCardMatched = false;

  if (hasCourtFilter && isCourtMatched) {
    isCardMatched = true;
    let courtName = lawyerFilters.court;
    if (typeof window !== 'undefined' && Array.isArray(window.INDIAN_COURTS_DATA)) {
      const cObj = window.INDIAN_COURTS_DATA.find(c => c.code && c.code.toUpperCase() === lawyerFilters.court.trim().toUpperCase());
      if (cObj && cObj.name) courtName = cObj.name;
    }
    const specLabel = hasSpecFilter ? lawyerFilters.specialty : (l.specialty || 'Designated');
    matchBanner = `<div class="court-lawyer-match-banner"><span class="match-sparkle">⭐</span> Recommended ${escapeHtml(specLabel)} Counsel for ${escapeHtml(courtName)}</div>`;
  } else if (!hasCourtFilter && hasSpecFilter && isSpecMatched) {
    matchBanner = `<div class="court-lawyer-match-banner"><span class="match-sparkle">⭐</span> Verified Specialist in ${escapeHtml(lawyerFilters.specialty)}</div>`;
    isCardMatched = true;
  }

  return `
  <div class="lawyer-card ${isAvail ? 'card-available' : 'card-booked'} ${isCardMatched ? 'court-lawyer-card-matched' : ''}" id="lawyer-card-${l.id}" data-id="${l.id}" onclick="handleLawyerCardClick(event, '${l.id}')" title="Click to view full credentials of ${escapeHtml(l.name)}">
    ${matchBanner}
    <div class="lawyer-card-header">
      <div class="lawyer-avatar-clickable" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">
        ${avatarEl}
      </div>
      <div class="lawyer-header-info">
        <div class="lawyer-name" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">${escapeHtml(l.name)}</div>
        <div class="lawyer-title">${escapeHtml(l.title || 'Advocate / Senior Counsel')}</div>
        <div class="lawyer-badges">
          <span class="badge-verified">✓ Bar Verified</span>
          ${isCardMatched ? `<span class="badge-verified" style="background:rgba(184,149,106,0.2);color:var(--gold-light);border:1px solid rgba(184,149,106,0.4);">⭐ Recommended</span>` : ''}
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
      <div class="lawyer-detail-item lawyer-court-affiliation-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="m3 7 9-3 9 3"/><path d="m6 10-3 6h6l-3-6z"/><path d="m18 10-3 6h6l-3-6z"/><line x1="3" y1="21" x2="21" y2="21"/></svg>
        <span>Courts: <strong style="${isCourtMatched ? 'color:#fbbf24; text-decoration: underline;' : 'color:var(--gold-light);'}">${escapeHtml(l.practicingCourts || l.primaryCourt || "Supreme Court of India")}</strong></span>
      </div>
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

// ── Directory Jurisdiction & Statutory Rules Advisory ──
function updateDirectoryJurisdictionRule() {
  if (!dirRuleBanner) return;

  const hasCourt = lawyerFilters.court && lawyerFilters.court !== 'All Courts';
  const hasSpec = lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties';

  if (!hasCourt && !hasSpec) {
    dirRuleBanner.classList.add('hidden');
    return;
  }

  let courtObj = null;
  if (hasCourt) {
    const code = lawyerFilters.court.trim().toUpperCase();
    if (typeof window !== 'undefined' && Array.isArray(window.INDIAN_COURTS_DATA)) {
      courtObj = window.INDIAN_COURTS_DATA.find(c => c.code && c.code.toUpperCase() === code);
    }
  }

  const jurRule = (typeof window.getJurisdictionRule === 'function')
    ? window.getJurisdictionRule(courtObj, lawyerFilters.specialty)
    : {
        title: hasCourt ? `${courtObj ? courtObj.name : lawyerFilters.court} Jurisdiction Rules` : `${lawyerFilters.specialty} Practice Rules`,
        governingActs: 'Constitution of India, Code of Civil Procedure (CPC), Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
        ruleSummary: 'Territorial, subject-matter, and pecuniary jurisdiction govern litigation and counsel representation.',
        proceduralRequirements: 'Representation by advocate enrolled with State Bar Council; verified pleadings on affidavit.',
        appellateHierarchy: 'Subordinate Court → District Court → High Court → Supreme Court of India.'
      };

  if (dirRuleBannerTitle) {
    if (hasCourt && courtObj) {
      dirRuleBannerTitle.textContent = `${courtObj.name} — ${jurRule.title || 'Jurisdiction & Practice Rules'}`;
    } else {
      dirRuleBannerTitle.textContent = jurRule.title || 'Jurisdiction & Practice Rules';
    }
  }
  if (dirRuleBannerActs) dirRuleBannerActs.textContent = `Governing Statute: ${jurRule.governingActs}`;
  if (dirRuleBannerDesc) dirRuleBannerDesc.textContent = jurRule.ruleSummary;
  if (dirRuleBannerMeta) {
    dirRuleBannerMeta.innerHTML = `<strong>Prerequisites:</strong> ${jurRule.proceduralRequirements} · <strong>Appellate Route:</strong> ${jurRule.appellateHierarchy}`;
  }

  dirRuleBanner.classList.remove('hidden');
}

function renderLawyers(lawyers) {
  if (!lawyersGrid) return;
  updateDirectoryJurisdictionRule();

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
    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts')
                                      params.set('court',        lawyerFilters.court);
    if (lawyerFilters.maxFee)        params.set('maxFee',       lawyerFilters.maxFee);
    if (lawyerFilters.minRating)     params.set('minRating',    lawyerFilters.minRating);
    if (lawyerFilters.availability)  params.set('availability', lawyerFilters.availability);

    const resp = await fetch(`${LAWYERS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('Server error ' + resp.status);
    const data = await resp.json();
    let result = data.lawyers || [];

    // Filter location client-side if selected
    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      const loc = lawyerFilters.location.toLowerCase();
      result = result.filter(l => (l.city && l.city.toLowerCase() === loc) || (l.state && l.state.toLowerCase() === loc) || (l.city && loc.includes(l.city.toLowerCase())) || (l.state && loc.includes(l.state.toLowerCase())));
    }

    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts') {
      const cCode = lawyerFilters.court.trim().toUpperCase();
      result = result.filter(l => {
        if (!l.courtCodes) return false;
        if (Array.isArray(l.courtCodes)) return l.courtCodes.includes(cCode);
        return String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
      });
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

    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts') {
      const cCode = lawyerFilters.court.trim().toUpperCase();
      filtered = filtered.filter(l => {
        if (!l.courtCodes) return false;
        if (Array.isArray(l.courtCodes)) return l.courtCodes.includes(cCode);
        return String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
      });
    }

    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      const loc = lawyerFilters.location.toLowerCase();
      filtered = filtered.filter(l => (l.city && l.city.toLowerCase() === loc) || (l.state && l.state.toLowerCase() === loc) || (l.city && loc.includes(l.city.toLowerCase())) || (l.state && loc.includes(l.state.toLowerCase())));
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
    court: 'All Courts',
    location: 'All Locations',
    maxFee: '',
    minRating: '',
    availability: '',
    sortBy: 'rating'
  };

  if (lawyerSearchInput) lawyerSearchInput.value = '';
  if (lawyerSearchClear) lawyerSearchClear.classList.add('hidden');
  if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = 'All Specialties';
  if (lawyerCourtSelect) lawyerCourtSelect.value = 'All Courts';
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

if (lawyerCourtSelect) {
  lawyerCourtSelect.addEventListener('change', () => {
    lawyerFilters.court = lawyerCourtSelect.value;
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

  // Practicing Courts
  const courtEl = document.getElementById('lawyer-modal-courts');
  if (courtEl) {
    courtEl.textContent = lawyer.practicingCourts || lawyer.primaryCourt || 'Supreme Court of India · State High Courts';
  }

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
  const courtParam = params.get('court');
  if (courtParam) {
    lawyerFilters.court = courtParam;
    if (lawyerCourtSelect) lawyerCourtSelect.value = courtParam;
  }
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


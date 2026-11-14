-- ==============================================================================
-- LegalAI — Authoritative Relational Database Schema
-- Database Engine: SQLite 3 with Write-Ahead Logging (WAL)
-- File Path: server/legalai.db
-- ==============================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores client accounts, authentication credentials, and user role metadata
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,                     -- Bcrypt hashed credential
  role TEXT DEFAULT 'user',                   -- 'user' | 'admin' | 'lawyer'
  isVerified INTEGER DEFAULT 0,               -- 0: Unverified | 1: Verified
  lawyerId INTEGER NULL,                      -- Foreign Key -> lawyers(id) for advocate accounts
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for instant authentication queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- ------------------------------------------------------------------------------
-- 2. AI_CHATS TABLE
-- Stores multi-turn conversation history, legal query prompts & AI responses
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NULL,                        -- Nullable for guest/unauthenticated sessions
  role TEXT NOT NULL,                         -- 'user' | 'assistant'
  message TEXT NOT NULL,                      -- Raw question or grounded legal assessment
  category TEXT NULL,                         -- Detected legal domain / statutory category
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for rapid multi-turn context retrieval
CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON ai_chats(userId, id DESC);


-- ------------------------------------------------------------------------------
-- 3. LAWYERS TABLE
-- Directory of verified Indian Advocates, Senior Counsel, and Legal Partners
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lawyers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                         -- Full name & professional designation
  title TEXT NOT NULL,                        -- Senior Advocate, Partner, King's Counsel
  specialty TEXT NOT NULL,                    -- Criminal Law, Corporate Law, Real Estate, etc.
  barNumber TEXT NOT NULL,                    -- Official Bar Council Registration (e.g. D/248/1980)
  experienceYears INTEGER NOT NULL,           -- Cumulative years of bar courtroom practice
  education TEXT NOT NULL,                    -- Law school, LL.B., LL.M., B.C.L. credentials
  firmName TEXT NOT NULL,                     -- Legal chambers or law firm name
  city TEXT NOT NULL,                         -- Practice seat (e.g. New Delhi, Mumbai, Bengaluru)
  state TEXT NOT NULL,                        -- Indian State / Union Territory
  hourlyRate REAL NOT NULL,                   -- Fee schedule in INR (₹)
  rating REAL DEFAULT 5.0,                    -- Client review score (1.0 to 5.0)
  reviewCount INTEGER DEFAULT 0,              -- Total verified client reviews
  languages TEXT NOT NULL,                    -- Languages spoken (e.g. English, Hindi, Kannada)
  bio TEXT NOT NULL,                          -- Courtroom background & representative matters
  casesWon INTEGER DEFAULT 0,                 -- Total recorded favorable judgments
  successRate INTEGER DEFAULT 95,             -- Verified win rate percentage
  phone TEXT NOT NULL,                        -- Chambers telephone
  email TEXT NOT NULL,                        -- Contact email address
  avatarUrl TEXT DEFAULT '',                  -- Advocate portrait URL
  isAvailable INTEGER DEFAULT 1,              -- 1: Available for booking | 0: Unavailable
  courtCodes TEXT DEFAULT '',                 -- Comma-separated practicing court codes (e.g. SCI,DHC)
  practicingCourts TEXT DEFAULT '',           -- Human-readable courts (e.g. Supreme Court · High Court)
  primaryCourt TEXT DEFAULT '',               -- Main venue of active daily practice
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lawyer search & specialty filtering
CREATE INDEX IF NOT EXISTS idx_lawyers_specialty ON lawyers(specialty);
CREATE INDEX IF NOT EXISTS idx_lawyers_city ON lawyers(city);
CREATE INDEX IF NOT EXISTS idx_lawyers_bar ON lawyers(barNumber);


-- ------------------------------------------------------------------------------
-- 4. COURTS TABLE
-- Comprehensive directory of Apex, High, Tribunal, District, & JMFC Courts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                         -- Full official court title
  code TEXT NOT NULL UNIQUE,                  -- Unique judicial code (e.g. SCI, DHC, NCLAT, BHC)
  jurisdiction TEXT NOT NULL,                 -- Apex Court, State High Court, District Court, etc.
  level TEXT NOT NULL,                        -- Supreme, High Court, Appellate Tribunal, District, Subordinate
  circuit TEXT DEFAULT '',                    -- Territorial territorial jurisdiction / appellate bench
  city TEXT NOT NULL,                         -- City / District headquarters
  state TEXT NOT NULL,                        -- State or Union Territory
  address TEXT NOT NULL,                      -- Physical street address of court complex
  zipCode TEXT NOT NULL,                      -- Postal PIN code
  phone TEXT NOT NULL,                        -- Registrar / Registry contact phone
  website TEXT NOT NULL,                      -- Official government e-Courts web portal
  clerkHours TEXT NOT NULL,                   -- Registry filing counter office hours
  filingSystem TEXT NOT NULL,                 -- e-Filing software (e-Courts Services, CIS 3.2, etc.)
  chiefJudge TEXT NOT NULL,                   -- Chief Justice / Principal District Judge presiding
  divisions TEXT NOT NULL,                    -- Judicial dockets (Civil, Criminal, Commercial, Writs)
  overview TEXT NOT NULL,                     -- Statutory jurisdiction, powers, & constitutional scope
  badge TEXT DEFAULT '',                      -- Visual directory badge / jurisdictional label
  isAvailable INTEGER DEFAULT 1,              -- Directory listing visibility status
  latitude REAL DEFAULT 0,                    -- Pinpoint GPS decimal latitude
  longitude REAL DEFAULT 0,                   -- Pinpoint GPS decimal longitude
  mapUrl TEXT DEFAULT '',                     -- Direct Google Maps navigation URL
  mapEmbedUrl TEXT DEFAULT '',                -- Google Maps live iframe embed URL
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for court jurisdiction, location, and code lookups
CREATE INDEX IF NOT EXISTS idx_courts_code ON courts(code);
CREATE INDEX IF NOT EXISTS idx_courts_jurisdiction ON courts(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_courts_state ON courts(state);
CREATE INDEX IF NOT EXISTS idx_courts_city ON courts(city);


-- ------------------------------------------------------------------------------
-- 5. CONSULTATIONS TABLE
-- Client consultation bookings, appointments & status tracking with advocates
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lawyerId INTEGER NOT NULL,                  -- Foreign Key -> lawyers(id)
  userId INTEGER NULL,                        -- Foreign Key -> users(id), nullable for guests
  clientName TEXT NOT NULL,                   -- Client full name
  clientEmail TEXT NOT NULL,                  -- Client email address
  clientPhone TEXT NOT NULL,                  -- Client contact phone number
  preferredDate TEXT NOT NULL,                -- Scheduled date/time of consultation
  caseSummary TEXT NOT NULL,                  -- Description of legal matter or dispute
  status TEXT DEFAULT 'pending',              -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for client consultation inquiries
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer ON consultations(lawyerId);
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(userId);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);


-- ------------------------------------------------------------------------------
-- 6. CASES TABLE
-- Litigation dockets, court hearing cause lists, and case brief dossiers for advocates
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caseNumber TEXT NOT NULL UNIQUE,            -- e.g. 'COMP.APP.(AT) 542/2026', 'CRL.A. 204/2026'
  title TEXT NOT NULL,                        -- Case title e.g. 'Priya Sharma vs. State of Maharashtra & Anr.'
  lawyerId INTEGER NOT NULL,                  -- Foreign Key -> lawyers(id)
  clientName TEXT NOT NULL,                   -- Client full name
  clientEmail TEXT NOT NULL,                  -- Client email address
  clientPhone TEXT NOT NULL,                  -- Client contact phone number
  opposingParty TEXT NOT NULL,                -- Opposing litigant, corporate entity, or state agency
  opposingCounsel TEXT DEFAULT '',            -- Opposing advocate or chambers
  courtCode TEXT NOT NULL,                    -- Judicial code (e.g. SCI, DHC, NCLAT, BHC)
  courtName TEXT NOT NULL,                    -- Full name of presiding court
  bench TEXT NOT NULL,                        -- Presiding bench / courtroom designation
  practiceArea TEXT NOT NULL,                 -- Corporate, Criminal, Civil Rights, IPR, etc.
  relevantActs TEXT NOT NULL,                 -- Governing statutory acts and sections
  nextHearingDate TEXT NOT NULL,              -- Next listed hearing date (YYYY-MM-DD)
  hearingTime TEXT DEFAULT '10:30 AM IST',    -- Scheduled court listing time
  stage TEXT NOT NULL,                        -- Proceedings stage (Arguments, Evidence, Final Hearing)
  status TEXT DEFAULT 'Active Hearing',       -- 'Active Hearing' | 'Pending Hearing' | 'Under Investigation' | 'Disposed / Favorable' | 'Appeal Review'
  disputeValue TEXT DEFAULT '',               -- Claim value or statutory relief
  caseSummary TEXT NOT NULL,                  -- Factual matrix and legal dispute brief
  lawyerNotes TEXT DEFAULT '',                -- Chambers notes, court orders, and counsel instructions
  filingDate TEXT DEFAULT CURRENT_TIMESTAMP,  -- Original case registration date
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
);

-- Indexes for lawyer caseload, hearing schedule, and status queries
CREATE INDEX IF NOT EXISTS idx_cases_lawyer ON cases(lawyerId);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_court ON cases(courtCode);
CREATE INDEX IF NOT EXISTS idx_cases_hearing ON cases(nextHearingDate);


-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS TABLE
-- Real-time alerts for advocates on client consultation bookings & case updates
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lawyerId INTEGER NOT NULL,                  -- Foreign Key -> lawyers(id)
  consultationId INTEGER NULL,                -- Foreign Key -> consultations(id)
  type TEXT DEFAULT 'booking',                -- 'booking' | 'hearing_alert' | 'case_update'
  title TEXT NOT NULL,                        -- Alert header e.g. 'New Consultation Booking: Client Name'
  message TEXT NOT NULL,                      -- Full notification message & appointment details
  clientName TEXT NOT NULL,                   -- Client name
  clientEmail TEXT NOT NULL,                  -- Client email
  clientPhone TEXT NOT NULL,                  -- Client phone
  preferredDate TEXT NOT NULL,                -- Scheduled date/time of consultation
  isRead INTEGER DEFAULT 0,                   -- 0: Unread | 1: Read
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE CASCADE
);

-- Indexes for rapid advocate notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_lawyer ON notifications(lawyerId);
CREATE INDEX IF NOT EXISTS idx_notifications_isRead ON notifications(isRead);


-- ------------------------------------------------------------------------------
-- 8. STATUTES TABLE
-- Structured legal corpus storing statutory articles, preconditions & exceptions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS statutes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  docKey TEXT NOT NULL UNIQUE,                -- Canonical document key (e.g. bns_318_4_cheating)
  actCode TEXT DEFAULT '',                    -- Short statutory identifier (e.g. BNS_2023)
  actName TEXT DEFAULT '',                    -- Full statutory Act title
  domain TEXT NOT NULL,                       -- Legal practice domain (e.g. Criminal Law)
  jurisdiction TEXT DEFAULT 'India',          -- Jurisdiction (India, USA - New York, Netherlands)
  language TEXT DEFAULT 'en',                 -- Language code ('en', 'nl', 'hi')
  section TEXT DEFAULT '',                    -- Section / Article number
  title TEXT NOT NULL,                        -- Provision title
  citation TEXT NOT NULL,                     -- Formal legal citation
  effectiveDate TEXT DEFAULT NULL,            -- Enforcement start date (YYYY-MM-DD)
  repealDate TEXT DEFAULT NULL,               -- Repeal date if superseded (YYYY-MM-DD)
  status TEXT DEFAULT 'IN_FORCE',             -- 'IN_FORCE' | 'REPEALED' | 'IN_FORCE_AMENDED'
  text TEXT NOT NULL,                         -- Authoritative statutory explanation & rule text
  structureJson TEXT DEFAULT '{}',            -- Hierarchical parsing (chapter, rule, provisos)
  preconditionsJson TEXT DEFAULT '[]',        -- Statutory 'only if' preconditions JSON array
  exceptionsJson TEXT DEFAULT '[]',           -- Attached statutory exceptions/provisos JSON
  crossReferencesJson TEXT DEFAULT '[]',      -- Linked statutory cross-references JSON
  keyElementsJson TEXT DEFAULT '[]',          -- Essential ingredients & penalties JSON
  actionChecklistJson TEXT DEFAULT '[]',      -- Actionable next steps JSON
  supersedesJson TEXT DEFAULT 'null',         -- Superseded legacy code reference JSON
  supersededByJson TEXT DEFAULT 'null',       -- Superseding new code reference JSON
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_statutes_docKey ON statutes(docKey);
CREATE INDEX IF NOT EXISTS idx_statutes_domain ON statutes(domain);
CREATE INDEX IF NOT EXISTS idx_statutes_jurisdiction ON statutes(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_statutes_status ON statutes(status);


-- ------------------------------------------------------------------------------
-- 9. STATUTE_VERSIONS TABLE
-- Temporal statutory crosswalk registry (IPC -> BNS, CrPC -> BNSS, IEA -> BSA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS statute_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transitionKey TEXT NOT NULL UNIQUE,         -- e.g. 'IPC_420', 'CRPC_438'
  oldAct TEXT NOT NULL,                       -- Repealed / previous statutory Act
  oldSection TEXT NOT NULL,                   -- Legacy section identifier
  title TEXT NOT NULL,                        -- Offence / provision title
  newAct TEXT NOT NULL,                       -- Current governing statutory Act
  newSection TEXT NOT NULL,                   -- New section identifier
  effectiveDate TEXT NOT NULL,                -- Transition effective date (e.g. 2024-07-01)
  status TEXT DEFAULT 'REPEALED_SUPERSEDED',  -- Lifecycle status
  jurisdiction TEXT DEFAULT 'India',          -- Jurisdiction scope
  punishment TEXT DEFAULT '',                 -- Prescribed punishment / sanction
  proceduralCode TEXT DEFAULT '',             -- Governing procedural statute
  notes TEXT DEFAULT '',                      -- Savings clause & transition notes
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_statute_versions_key ON statute_versions(transitionKey);


-- ------------------------------------------------------------------------------
-- 10. RAG_QUERY_LOGS TABLE
-- Telemetry log for RAG routing, retrieval citations, latency & user feedback
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rag_query_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NULL,                        -- Foreign Key -> users(id) if logged in
  engine TEXT DEFAULT 'node-rag',             -- 'node-rag' | 'python-adaptive-rag'
  query TEXT NOT NULL,                        -- User legal question
  category TEXT DEFAULT '',                   -- Predicted practice domain
  confidence REAL DEFAULT 0.0,                -- Classification confidence
  route TEXT DEFAULT 'RETRIEVE',              -- 'DIRECT' | 'RETRIEVE' | 'RETRIEVE_MORE'
  complexityScore REAL DEFAULT 0.0,           -- Query complexity score [0, 1]
  jurisdiction TEXT DEFAULT 'India',          -- Detected jurisdiction
  retrievedDocKeysJson TEXT DEFAULT '[]',     -- Retrieved statute docKeys JSON
  attributionPrecision REAL NULL,             -- Claim-level attribution precision
  judgeScore REAL NULL,                       -- Calibrated composite judge rating (1-5)
  latencyMs REAL DEFAULT 0.0,                 -- End-to-end processing latency in ms
  userRating INTEGER NULL,                    -- End-user satisfaction rating (1-5)
  userFeedback TEXT DEFAULT '',               -- Optional qualitative user feedback
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_rag_logs_user ON rag_query_logs(userId);
CREATE INDEX IF NOT EXISTS idx_rag_logs_category ON rag_query_logs(category);


-- ------------------------------------------------------------------------------
-- 11. RAG_EVALUATIONS TABLE
-- Persisted evaluation benchmark runs & inter-rater agreement metrics
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rag_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  benchmarkName TEXT NOT NULL,                -- Benchmark suite identifier
  evaluatorType TEXT NOT NULL,                -- 'calibrated-judge' | 'blinded-expert' | 'system-baseline'
  krippendorffAlpha REAL DEFAULT 0.0,         -- Multi-rater agreement (alpha)
  spearmanRho REAL DEFAULT 0.0,               -- Correlation between LLM judge & humans
  faithfulness REAL DEFAULT 0.0,              -- Faithfulness score [0, 1]
  citationPrecision REAL DEFAULT 0.0,         -- Citation precision [0, 1]
  preconditionCompleteness REAL DEFAULT 0.0,  -- Precondition completeness [0, 1]
  expertRating REAL DEFAULT 0.0,              -- Mean 5-point Likert rating
  metricsJson TEXT DEFAULT '{}',              -- Detailed comparative metrics payload
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);





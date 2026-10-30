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

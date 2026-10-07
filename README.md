# LegalAI — Justice Powered by Intelligence

An executive legal intelligence and judicial directory platform combining artificial intelligence, statutory citation attribution, and case consultation management.

---

## 🏛️ System Features

1. **AI Legal Assistant & Research Lab**:
   - Continuous HyPA Adaptive Retrieval router ($C \in [0, 1]$).
   - Multi-jurisdictional statutory index (including 2024 Bharatiya Nyaya Sanhita - BNS).
   - ALCE claim-level NLI citation attribution engine with faithfulness metrics.
   - 8-tab RAG Research Lab console (`RAG Research Lab`).

2. **Executive Directory & Case Portals**:
   - **Verified Attorney Directory**: Filtered by practice domain, hourly rate, and state bar certification.
   - **Judicial Courts Directory**: Federal appellate, federal district, state supreme, and specialized trial venues.
   - **Client Case Portal (`user.html`)**: Manage consultations, track case action checklists, review AI research history, and manage profile security.
   - **Master Admin Command Suite (`admin.html`)**: Role-based account control, consultation status management, live attorney & court venue directory CRUD operations, and AI microservice health telemetry.

3. **Neat Navigation**:
   - Streamlined, non-wrapping menu bar with structured dropdown menus:
     - `Find Counsel ▾` (Attorneys & Courts)
     - `Intelligence ▾` (AI Assistant, RAG Lab, Statutory Articles, World Legal News)
     - `Portals ▾` (Client Portal, Admin Command Suite)
     - `User Badge ▾` (Quick access to bookings, settings, and sign out)

---

## 🚀 Quick Start

### 1. Master One-Click Launcher (Windows)
Double-click `run.bat` or run:
```bat
run.bat
```
*Automatically installs npm dependencies, starts the Python Adaptive RAG service on port `8000`, launches the Node.js server on port `5000`, and opens `http://localhost:5000` in your browser.*

### 2. Manual Startup
**Backend API & Web Server (Node.js)**:
```bash
cd server
npm install
node server.js
```
*Server runs on `http://localhost:5000`.*

**Adaptive RAG & ML Microservice (Python)**:
```bash
cd ml
python app.py
```
*Microservice runs on `http://localhost:8000`.*

---

## 👥 Default Demo Credentials

- **Master Administrator**:
  - Email: `admin@legalai.com`
  - Password: `admin1234`
  - Access: `http://localhost:5000/admin.html`
- **Demo Client**:
  - Email: `demouser@legalai.com`
  - Password: `demo1234`
  - Access: `http://localhost:5000/user.html`

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphic dark theme), ES6 JavaScript.
- **Backend**: Node.js, Express, SQLite (via `better-sqlite3` with WAL mode), JWT authentication.
- **AI / ML Microservice**: Python, FastAPI, Uvicorn, FAISS vector index, scikit-learn, Sentence-Transformers.

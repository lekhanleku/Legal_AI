# -*- coding: utf-8 -*-
"""
Builds LegalAI Simple Software Design Specification (SDS) with Flowchart
Generates LegalAI_Simple_SDS.html and compiles to LegalAI_Simple_SDS.pdf via Edge.
"""

import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_HTML = os.path.join(BASE_DIR, "LegalAI_Simple_SDS.html")
OUTPUT_PDF = os.path.join(BASE_DIR, "LegalAI_Simple_SDS.pdf")

html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LegalAI — Simple Software Design Specification (SDS)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
    @bottom-left {
      content: "LegalAI — Simple SDS & System Flowchart";
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
  }

  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body {
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 9.5pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .header {
    background: linear-gradient(135deg, #0f2744 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .header h1 {
    margin: 0 0 4px 0;
    font-size: 18pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }
  .header p {
    margin: 0;
    font-size: 9.5pt;
    color: #93c5fd;
  }

  h2 {
    font-size: 12pt;
    color: #0f2744;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  p { margin: 0 0 8px 0; }

  .grid-4 {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
  }
  .card {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 10px;
  }
  .card-title {
    font-weight: 700;
    font-size: 9pt;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .card-desc {
    font-size: 8pt;
    color: #475569;
    line-height: 1.35;
  }
  .card.blue { border-top: 3px solid #2563eb; }
  .card.green { border-top: 3px solid #10b981; }
  .card.purple { border-top: 3px solid #8b5cf6; }
  .card.amber { border-top: 3px solid #f59e0b; }

  .diagram-box {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    margin: 12px 0;
  }

  .step-list {
    margin: 0 0 12px 0;
    padding: 0;
    list-style: none;
  }
  .step-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
  }
  .step-num {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
    font-size: 8pt;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-content { flex: 1; font-size: 8.8pt; }
  .step-title { font-weight: 700; color: #0f172a; margin-bottom: 2px; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    margin: 8px 0;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 9px;
    text-align: left;
  }
  th { background: #0f2744; color: #ffffff; font-weight: 600; }
  tr:nth-child(even) td { background: #f8fafc; }

  .page-break { page-break-before: always; }

  .callout {
    background: #eff6ff;
    border-left: 3.5px solid #2563eb;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    font-size: 8.5pt;
    margin: 10px 0;
  }
  .callout-title { font-weight: 700; color: #1e3a8a; margin-bottom: 2px; }
</style>
</head>
<body>

<!-- PAGE 1 -->
<div class="header">
  <h1>LegalAI — Simple Software Design Specification (SDS)</h1>
  <p>Justice Powered by Intelligence · Complete High-Level Architecture & Process Flowchart</p>
</div>

<h2>1. What is LegalAI in Simple Terms?</h2>
<p>
<strong>LegalAI</strong> is a web platform that gives citizens instant, reliable legal advice, translates complex statutes into clear checklists, and connects users directly with verified lawyers and courts. It is designed to be 100% accurate by checking real laws, knowing about the new 2024 Indian criminal law reforms (BNS/BNSS), and verifying every citation before answering.
</p>

<h2>2. The 4 Main Building Blocks</h2>
<div class="grid-4">
  <div class="card blue">
    <div class="card-title" style="color: #1e40af;">💻 1. Frontend</div>
    <div class="card-desc">
      <strong>User Interface:</strong>
      Clean web app (HTML/CSS/JS) with Public Portal, AI Chat, Lawyer Directory, Court Venue Finder, Client Portal, and Admin Suite.
    </div>
  </div>
  <div class="card green">
    <div class="card-title" style="color: #065f46;">⚙️ 2. Backend Gateway</div>
    <div class="card-desc">
      <strong>Node.js (Port 5000):</strong>
      Handles logins, manages consultation bookings, stores chats, and connects to the AI brain with a 5-sec safety backup net.
    </div>
  </div>
  <div class="card purple">
    <div class="card-title" style="color: #5b21b6;">🧠 3. AI Brain (ML)</div>
    <div class="card-desc">
      <strong>Python FastAPI (Port 8000):</strong>
      Adaptive RAG engine. Classifies queries, searches actual laws (BM25 + FAISS), and double-checks facts to prevent hallucinations.
    </div>
  </div>
  <div class="card amber">
    <div class="card-title" style="color: #92400e;">🗄️ 4. Database</div>
    <div class="card-desc">
      <strong>SQLite WAL (legalai.db):</strong>
      Stores user accounts, verified Indian advocate profiles, courts, consultation appointments, and chat histories safely.
    </div>
  </div>
</div>

<h2>3. Simple System Flowchart</h2>
<div class="diagram-box">
  <svg width="670" height="340" viewBox="0 0 670 340" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <!-- Background Frame -->
    <rect x="5" y="5" width="660" height="330" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>

    <!-- 1. User Inbound Box -->
    <rect x="20" y="20" width="140" height="50" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="90" y="42" fill="#1e3a8a" font-family="'Inter', sans-serif" font-size="9" font-weight="700" text-anchor="middle">👤 USER</text>
    <text x="90" y="57" fill="#3b82f6" font-family="'Inter', sans-serif" font-size="8" text-anchor="middle">Types Legal Question</text>

    <!-- Arrow User -> Web -->
    <line x1="160" y1="45" x2="195" y2="45" stroke="#2563eb" stroke-width="2"/>
    <polygon points="195,45 187,40 187,50" fill="#2563eb"/>

    <!-- 2. Frontend Web App -->
    <rect x="195" y="20" width="160" height="50" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="2"/>
    <text x="275" y="42" fill="#065f46" font-family="'Inter', sans-serif" font-size="9" font-weight="700" text-anchor="middle">🖥️ FRONTEND WEB APP</text>
    <text x="275" y="57" fill="#059669" font-family="'Inter', sans-serif" font-size="8" text-anchor="middle">index.html / script.js</text>

    <!-- Arrow Web -> Server -->
    <line x1="355" y1="45" x2="390" y2="45" stroke="#10b981" stroke-width="2"/>
    <polygon points="390,45 382,40 382,50" fill="#10b981"/>

    <!-- 3. Backend Gateway -->
    <rect x="390" y="20" width="180" height="50" rx="6" fill="#0f2744" stroke="#1e3a8a" stroke-width="2"/>
    <text x="480" y="42" fill="#ffffff" font-family="'Inter', sans-serif" font-size="9" font-weight="700" text-anchor="middle">⚙️ BACKEND GATEWAY</text>
    <text x="480" y="57" fill="#93c5fd" font-family="'Inter', sans-serif" font-size="8" text-anchor="middle">Node.js Server (Port 5000)</text>

    <!-- Split Arrow from Backend -->
    <path d="M 480 70 L 480 95 L 340 95 L 340 115" fill="none" stroke="#8b5cf6" stroke-width="2"/>
    <polygon points="340,115 336,107 344,107" fill="#8b5cf6"/>
    <text x="390" y="90" fill="#6d28d9" font-size="7.5" font-weight="600">Online: Send to AI Brain</text>

    <!-- Fallback line -->
    <path d="M 480 70 L 480 95 L 565 95 L 565 115" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3"/>
    <polygon points="565,115 561,107 569,107" fill="#f59e0b"/>
    <text x="575" y="90" fill="#b45309" font-size="7.5" font-weight="600">If AI Offline</text>

    <!-- Fallback Box -->
    <rect x="500" y="115" width="135" height="50" rx="5" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="567" y="136" fill="#92400e" font-family="'Inter', sans-serif" font-size="8" font-weight="700" text-anchor="middle">🛡️ BACKUP ENGINE</text>
    <text x="567" y="150" fill="#78350f" font-family="'Inter', sans-serif" font-size="7.5" text-anchor="middle">Local Heuristic Rules</text>

    <!-- 4. AI Brain Big Subgraph Container -->
    <rect x="20" y="115" width="460" height="125" rx="6" fill="#faf5ff" stroke="#8b5cf6" stroke-width="1.5"/>
    <text x="35" y="132" fill="#5b21b6" font-family="'Inter', sans-serif" font-size="8.5" font-weight="800">🧠 AI BRAIN PIPELINE (Python FastAPI - Port 8000)</text>

    <!-- Sub-step 1 -->
    <rect x="30" y="142" width="95" height="42" rx="4" fill="#ffffff" stroke="#a855f7"/>
    <text x="77" y="159" fill="#6b21a8" font-size="7.5" font-weight="700" text-anchor="middle">Step 1: Domain</text>
    <text x="77" y="172" fill="#64748b" font-size="7" text-anchor="middle">Criminal, Tenant, etc.</text>

    <line x1="125" y1="163" x2="140" y2="163" stroke="#a855f7" stroke-width="1.5"/>
    <polygon points="140,163 134,160 134,166" fill="#a855f7"/>

    <!-- Sub-step 2 -->
    <rect x="140" y="142" width="100" height="42" rx="4" fill="#ffffff" stroke="#a855f7"/>
    <text x="190" y="159" fill="#6b21a8" font-size="7.5" font-weight="700" text-anchor="middle">Step 2: Smart Router</text>
    <text x="190" y="172" fill="#64748b" font-size="7" text-anchor="middle">Direct vs Deep Search</text>

    <line x1="240" y1="163" x2="255" y2="163" stroke="#a855f7" stroke-width="1.5"/>
    <polygon points="255,163 249,160 249,166" fill="#a855f7"/>

    <!-- Sub-step 3 -->
    <rect x="255" y="142" width="105" height="42" rx="4" fill="#ffffff" stroke="#a855f7"/>
    <text x="307" y="159" fill="#6b21a8" font-size="7.5" font-weight="700" text-anchor="middle">Step 3: New 2024 Law</text>
    <text x="307" y="172" fill="#64748b" font-size="7" text-anchor="middle">IPC ➔ BNS, CrPC➔BNSS</text>

    <line x1="360" y1="163" x2="375" y2="163" stroke="#a855f7" stroke-width="1.5"/>
    <polygon points="375,163 369,160 369,166" fill="#a855f7"/>

    <!-- Sub-step 4 -->
    <rect x="375" y="142" width="95" height="42" rx="4" fill="#ffffff" stroke="#a855f7"/>
    <text x="422" y="159" fill="#6b21a8" font-size="7.5" font-weight="700" text-anchor="middle">Step 4: Search Law</text>
    <text x="422" y="172" fill="#64748b" font-size="7" text-anchor="middle">Dense FAISS + BM25</text>

    <!-- Sub-step 5 (Bottom) -->
    <rect x="140" y="193" width="220" height="38" rx="4" fill="#fdf4ff" stroke="#d946ef"/>
    <text x="250" y="209" fill="#86198f" font-size="7.5" font-weight="700" text-anchor="middle">Step 5: ALCE Fact & Citation Check</text>
    <text x="250" y="221" fill="#701a75" font-size="7" text-anchor="middle">Verifies citations and removes fake hallucinated rules</text>

    <line x1="422" y1="184" x2="422" y2="212" stroke="#a855f7" stroke-width="1.5"/>
    <line x1="422" y1="212" x2="360" y2="212" stroke="#a855f7" stroke-width="1.5"/>
    <polygon points="360,212 366,209 366,215" fill="#a855f7"/>

    <!-- Output Arrow from AI / Fallback to Final Output -->
    <path d="M 250 231 L 250 260 L 335 260" fill="none" stroke="#059669" stroke-width="2"/>
    <polygon points="335,260 327,256 327,264" fill="#059669"/>

    <path d="M 565 165 L 565 260 L 335 260" fill="none" stroke="#f59e0b" stroke-width="1.5"/>

    <!-- 5. Final Result Box -->
    <rect x="340" y="245" width="230" height="75" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="2"/>
    <text x="455" y="265" fill="#065f46" font-family="'Inter', sans-serif" font-size="9" font-weight="700" text-anchor="middle">📋 4. GROUNDED LEGAL ADVICE</text>
    <text x="455" y="280" fill="#047857" font-size="7.5" text-anchor="middle">✔ Accurate Rights & Legal Principles</text>
    <text x="455" y="293" fill="#047857" font-size="7.5" text-anchor="middle">✔ Step-by-Step Action Checklist</text>
    <text x="455" y="306" fill="#047857" font-size="7.5" text-anchor="middle">✔ Matched Advocate & District Court Venue</text>

    <!-- Save to Database -->
    <path d="M 250 260 L 160 260 L 160 280" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3"/>
    <polygon points="160,280 156,274 164,274" fill="#3b82f6"/>
    <rect x="90" y="280" width="140" height="36" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="160" y="296" fill="#1e3a8a" font-size="7.5" font-weight="700" text-anchor="middle">🗄️ SAVE TO DATABASE</text>
    <text x="160" y="308" fill="#2563eb" font-size="7" text-anchor="middle">SQLite WAL (Users, Chats)</text>
  </svg>
</div>

<!-- PAGE 2 -->
<div class="page-break"></div>

<h2>4. How a Question Travels: Step-by-Step</h2>
<ul class="step-list">
  <li class="step-item">
    <div class="step-num">1</div>
    <div class="step-content">
      <div class="step-title">User Enters a Question on the Website</div>
      The citizen visits LegalAI and types their legal problem (e.g., <em>"My landlord kept my deposit and refused to return it"</em> or <em>"Police filed a 420 case on me"</em>).
    </div>
  </li>
  <li class="step-item">
    <div class="step-num">2</div>
    <div class="step-content">
      <div class="step-title">Backend Gateway Coordinates the Request</div>
      The Node.js server receives the message. If the user is logged in, it pulls their user profile. It sends the message to the Python AI service. If the Python AI service is offline, it instantly uses the built-in backup legal rules engine so the user never gets an error screen.
    </div>
  </li>
  <li class="step-item">
    <div class="step-num">3</div>
    <div class="step-content">
      <div class="step-title">AI Brain Finds the Legal Category & Evaluates Complexity</div>
      The AI classifier labels the domain (e.g., <em>Tenant Law</em> or <em>Criminal Law</em>) with calibrated percentage confidence. The smart router calculates whether it's a simple definition (answered directly) or a complex case requiring deep legal book search.
    </div>
  </li>
  <li class="step-item">
    <div class="step-num">4</div>
    <div class="step-content">
      <div class="step-title">2024 New Law Verification (IPC ➔ BNS)</div>
      The AI checks if the query involves Indian criminal law. If the user asks about <em>"Section 420"</em> (cheating), the system automatically updates it to the new <strong>Bharatiya Nyaya Sanhita (BNS) Section 318(4)</strong> which became effective on July 1, 2024.
    </div>
  </li>
  <li class="step-item">
    <div class="step-num">5</div>
    <div class="step-content">
      <div class="step-title">Hybrid Search & Anti-Hallucination Verification</div>
      It searches actual legal statutes using both keyword search (BM25) and semantic vector search (FAISS). Then, the ALCE verification engine double-checks every sentence to make sure every cited legal section is 100% real and supported by law.
    </div>
  </li>
  <li class="step-item">
    <div class="step-num">6</div>
    <div class="step-content">
      <div class="step-title">Clear Advice + Checklist + Lawyer & Court Matching</div>
      The user receives:
      (a) Plain-English legal rights,
      (b) Step-by-step action checklist (e.g. send 14-day written notice),
      (c) Verified lawyer suggestion (with experience & hourly rate), and
      (d) The exact court venue (e.g., Tis Hazari District Court or High Court).
    </div>
  </li>
</ul>

<h2>5. Five Smart Features Made Simple</h2>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Feature Name</th>
      <th style="width: 25%;">What Problem It Solves</th>
      <th>How It Works in LegalAI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Smart Router (HyPA)</strong></td>
      <td>Stops AI from getting confused on simple questions.</td>
      <td>If someone asks <em>"What is a plaintiff?"</em>, it answers directly. If someone asks a complex multi-condition question, it retrieves deep legal text.</td>
    </tr>
    <tr>
      <td><strong>2. 2024 Law Transition</strong></td>
      <td>Many AIs still quote the old 1860 IPC laws that India replaced in 2024.</td>
      <td>Automatically maps old codes to new laws: IPC 420 ➔ BNS § 318(4), IPC 302 ➔ BNS § 103(1), CrPC 438 ➔ BNSS § 482.</td>
    </tr>
    <tr>
      <td><strong>3. Fact Checker (ALCE)</strong></td>
      <td>Prevents AI hallucinations and fake legal citations.</td>
      <td>Splits the answer into single sentences and verifies each one against actual statutes before showing it to the user.</td>
    </tr>
    <tr>
      <td><strong>4. Layperson Translator</strong></td>
      <td>People don't speak Latin legal maxims; they speak everyday language.</td>
      <td>Translates informal complaints (<em>"he took my money"</em>) into actionable legal remedies with a clear to-do checklist.</td>
    </tr>
    <tr>
      <td><strong>5. Dual-Path Safety Net</strong></td>
      <td>Websites crash when AI microservices reboot.</td>
      <td>If the Python AI service takes more than 5 seconds or restarts, the Node.js backend seamlessly answers with built-in statutory rules.</td>
    </tr>
  </tbody>
</table>

<h2>6. Database Tables & Key Web Portals</h2>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Portal / Table</th>
      <th style="width: 20%;">Access URL / File</th>
      <th>Who Uses It & What They Can Do</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Public Portal</strong></td>
      <td><code>http://localhost:5000/</code></td>
      <td>Anyone: Ask the AI legal assistant, search vetted lawyers, find courts, read legal news, explore RAG Lab.</td>
    </tr>
    <tr>
      <td><strong>Client Case Portal</strong></td>
      <td><code>http://localhost:5000/user.html</code></td>
      <td>Logged-in clients: View booked consultations, cancel appointments, view case checklists, review chat history.</td>
    </tr>
    <tr>
      <td><strong>Admin Command Suite</strong></td>
      <td><code>http://localhost:5000/admin.html</code></td>
      <td>Admin: View platform stats, manage users, add/edit lawyers and courts, approve consultations, check AI health.</td>
    </tr>
    <tr>
      <td><strong>SQLite Tables</strong></td>
      <td><code>server/legalai.db</code></td>
      <td>5 tables: <code>users</code>, <code>ai_chats</code>, <code>lawyers</code>, <code>consultations</code>, <code>courts</code> (WAL mode).</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">🚀 How to Run the Platform (Windows One-Click)</div>
  Simply double-click <code>run.bat</code>. It installs dependencies, starts the Python AI microservice (Port 8000), starts the Node.js server (Port 5000), and opens <code>http://localhost:5000</code> in your browser.
</div>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Generated HTML: {OUTPUT_HTML}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

print(f"Rendering Simple PDF via Edge ({edge_path})...")
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={OUTPUT_PDF}",
    "--no-pdf-header-footer",
    OUTPUT_HTML
]

res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0 and os.path.exists(OUTPUT_PDF):
    print(f"SUCCESS: Rendered Simple PDF at {OUTPUT_PDF}")
    print(f"Size: {os.path.getsize(OUTPUT_PDF):,} bytes")
else:
    print(f"Failed with code {res.returncode}")
    print(res.stderr)

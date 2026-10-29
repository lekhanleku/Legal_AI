# -*- coding: utf-8 -*-
"""
LegalAI - Software Design Specification (SDS) in Academic ML Project Format
Institution: A.J. INSTITUTE OF ENGINEERING & TECHNOLOGY, MANGALURU
Department: Department of MCA
Format: SOFTWARE DESIGN SPECIFICATION (SDS) - Applicable for ML projects
"""

import os
import sys
import subprocess
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_HTML = os.path.join(BASE_DIR, "LegalAI_ML_Format_Software_Design_Specification.html")
OUTPUT_PDF = os.path.join(BASE_DIR, "LegalAI_ML_Format_Software_Design_Specification.pdf")
OUTPUT_MIRROR_PDF = os.path.join(BASE_DIR, "LegalAI_SDS_ML_Format.pdf")

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Software Design Specification (SDS) — LegalAI (ML Project Format)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
    @top-right {
      content: "AJIET MCA · LegalAI SDS (ML Format)";
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      font-weight: 600;
      color: #1e3a8a;
    }
    @bottom-left {
      content: "Department of MCA, AJIET Mangaluru";
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
  }

  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    background-color: #ffffff;
    font-size: 10pt;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }

  /* Academic Institutional Header */
  .inst-header {
    text-align: center;
    border-bottom: 2.5px solid #0f2744;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .inst-name {
    font-size: 15pt;
    font-weight: 800;
    color: #0f2744;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }
  .inst-dept {
    font-size: 12pt;
    font-weight: 600;
    color: #1e3a8a;
    margin: 4px 0 6px 0;
  }
  .doc-main-title {
    font-size: 14pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 8px 0 2px 0;
  }
  .doc-sub-tag {
    font-size: 10pt;
    font-weight: 600;
    color: #b45309;
    background: #fef3c7;
    display: inline-block;
    padding: 2px 14px;
    border-radius: 12px;
    border: 1px solid #fde68a;
    margin-top: 4px;
  }
  .project-title-box {
    margin-top: 10px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #2563eb;
    padding: 8px 14px;
    text-align: left;
    font-size: 9.5pt;
  }

  /* Section Headings conforming exactly to MCA Syllabus */
  h1 {
    font-size: 14pt;
    font-weight: 800;
    color: #0f2744;
    border-bottom: 1.5px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 22px;
    margin-bottom: 8px;
    text-transform: none;
  }
  h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 16px;
    margin-bottom: 6px;
  }
  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e40af;
    margin-top: 12px;
    margin-bottom: 4px;
  }

  p {
    margin: 0 0 8px 0;
    text-align: justify;
  }
  ul, ol {
    margin: 0 0 10px 0;
    padding-left: 22px;
  }
  li { margin-bottom: 3px; }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8.8pt;
  }
  table.data-table th, table.data-table td {
    border: 1px solid #cbd5e1;
    padding: 6px 9px;
    text-align: left;
    vertical-align: top;
  }
  table.data-table th {
    background-color: #0f2744;
    color: #ffffff;
    font-weight: 600;
  }
  table.data-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Diagrams */
  .diagram-container {
    background-color: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 12px;
    margin: 10px 0 14px 0;
    text-align: center;
    page-break-inside: avoid;
  }
  .diagram-caption {
    font-size: 8.5pt;
    font-weight: 600;
    color: #475569;
    margin-top: 6px;
    text-align: center;
  }

  .code-block {
    background: #0f172a;
    color: #f8fafc;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8.5pt;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 6px 0 10px 0;
    line-height: 1.35;
  }

  .math-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #8b5cf6;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8.8pt;
    padding: 8px 12px;
    margin: 6px 0 10px 0;
    color: #1e293b;
  }

  .callout-box {
    background: #eff6ff;
    border-left: 3.5px solid #2563eb;
    padding: 8px 12px;
    font-size: 9pt;
    margin: 8px 0;
    border-radius: 0 4px 4px 0;
  }

  .page-break { page-break-before: always; }
  .avoid-break { page-break-inside: avoid; }

  .ui-mock-grid {
    display: flex;
    gap: 12px;
    margin: 8px 0;
  }
  .ui-mock-card {
    flex: 1;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
  }
  .ui-mock-header {
    background: #1e293b;
    color: #ffffff;
    font-size: 8pt;
    font-weight: 600;
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
  }
  .ui-mock-body {
    padding: 10px;
    font-size: 8pt;
    background: #f8fafc;
  }
</style>
</head>
<body>

<!-- INSTITUTIONAL TITLE BLOCK -->
<div class="inst-header">
  <div class="inst-name">A.J. INSTITUTE OF ENGINEERING & TECHNOLOGY, MANGALURU</div>
  <div class="inst-dept">Department of MCA</div>
  <div class="doc-main-title">SOFTWARE DESIGN SPECIFICATION (SDS)</div>
  <div class="doc-sub-tag">Applicable for ML projects</div>
  
  <div class="project-title-box">
    <strong>Project Title:</strong> LegalAI — Executive Legal Intelligence, Adaptive Statutory RAG & Judicial Directory Platform<br>
    <strong>Domain:</strong> Applied Machine Learning & Legal NLP (Natural Language Processing)<br>
    <strong>Target Architecture:</strong> Calibrated LinearSVC Domain Classifier · Continuous HyPA Adaptive Router · Hybrid BM25 + FAISS Dense Vector Retrieval · ALCE Claim-Level Attribution NLI · SQLite WAL
  </div>
</div>

<!-- ======================================================== -->
<!-- 1. SYSTEM DESIGN                                         -->
<!-- ======================================================== -->
<h1>1. System Design</h1>

<h2>1.1 . Architectural Design</h2>
<p>
The <strong>LegalAI</strong> system is architected as an intelligent judicial assistance platform combining supervised legal domain classification, continuous parametric-adaptive retrieval routing (HyPA), dense-sparse hybrid vector search, and claim-level natural language inference (NLI) citation verification. The overarching architecture decouples user interaction, gateway coordination, and machine learning computation to deliver sub-second legal inquiries while guaranteeing zero citation hallucinations.
</p>

<h3>1.1.1 System Context Diagram</h3>
<p>
The System Context Diagram establishes the operational boundaries of the LegalAI application, delineating the human actors, external services, and persistent data repositories interacting with the core engine.
</p>

<div class="diagram-container avoid-break">
  <!-- System Context SVG Diagram -->
  <svg width="680" height="230" viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="220" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Left: Actors -->
    <rect x="20" y="25" width="130" height="48" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="85" y="46" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">👤 Citizen / Litigant</text>
    <text x="85" y="59" fill="#2563eb" font-size="7.5" text-anchor="middle">Legal Inquiries & Booking</text>

    <rect x="20" y="90" width="130" height="48" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="85" y="111" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">⚖️ Verified Advocate</text>
    <text x="85" y="124" fill="#2563eb" font-size="7.5" text-anchor="middle">Profile & Consultation View</text>

    <rect x="20" y="155" width="130" height="48" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="85" y="176" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">🛡️ System Admin</text>
    <text x="85" y="189" fill="#2563eb" font-size="7.5" text-anchor="middle">User & Directory CRUD</text>

    <!-- Communication lines to Core -->
    <line x1="150" y1="49" x2="230" y2="110" stroke="#3b82f6" stroke-width="1.5"/>
    <line x1="150" y1="114" x2="230" y2="114" stroke="#3b82f6" stroke-width="1.5"/>
    <line x1="150" y1="179" x2="230" y2="118" stroke="#3b82f6" stroke-width="1.5"/>

    <!-- Center: Core Application -->
    <rect x="230" y="35" width="220" height="155" rx="8" fill="#0f2744" stroke="#1e3a8a" stroke-width="2"/>
    <text x="340" y="60" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">LEGALAI SYSTEM BOUNDARY</text>
    
    <rect x="245" y="72" width="190" height="34" rx="4" fill="#1e3a8a"/>
    <text x="340" y="88" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">Node.js API Gateway (Port 5000)</text>
    <text x="340" y="99" fill="#93c5fd" font-size="7.2" text-anchor="middle">JWT RBAC · Dual-Path Fallback · REST</text>

    <rect x="245" y="114" width="190" height="34" rx="4" fill="#5b21b6"/>
    <text x="340" y="130" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">FastAPI ML Engine (Port 8000)</text>
    <text x="340" y="141" fill="#ddd6fe" font-size="7.2" text-anchor="middle">LinearSVC · HyPA Router · Hybrid RAG</text>

    <rect x="245" y="156" width="190" height="24" rx="4" fill="#065f46"/>
    <text x="340" y="172" fill="#ffffff" font-size="8" font-weight="600" text-anchor="middle">Client SPAs: index / user / admin.html</text>

    <!-- Communication lines from Core to Right -->
    <line x1="450" y1="75" x2="520" y2="50" stroke="#10b981" stroke-width="1.5"/>
    <polygon points="520,50 512,47 514,54" fill="#10b981"/>

    <line x1="450" y1="114" x2="520" y2="114" stroke="#8b5cf6" stroke-width="1.5"/>
    <polygon points="520,114 512,110 512,118" fill="#8b5cf6"/>

    <line x1="450" y1="150" x2="520" y2="175" stroke="#d97706" stroke-width="1.5"/>
    <polygon points="520,175 514,171 512,178" fill="#d97706"/>

    <!-- Right: External Services & Data Sources -->
    <rect x="520" y="25" width="140" height="48" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
    <text x="590" y="46" fill="#065f46" font-size="8.5" font-weight="700" text-anchor="middle">📡 External News / RSS</text>
    <text x="590" y="59" fill="#047857" font-size="7.5" text-anchor="middle">SCOTUSblog · ABA · Law360</text>

    <rect x="520" y="90" width="140" height="48" rx="5" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.5"/>
    <text x="590" y="111" fill="#5b21b6" font-size="8.5" font-weight="700" text-anchor="middle">📚 Statutory Corpora</text>
    <text x="590" y="124" fill="#6d28d9" font-size="7.5" text-anchor="middle">BNS 2023 · BNSS · BSA · IPC</text>

    <rect x="520" y="155" width="140" height="48" rx="5" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
    <text x="590" y="176" fill="#92400e" font-size="8.5" font-weight="700" text-anchor="middle">🗄️ Relational Database</text>
    <text x="590" y="189" fill="#b45309" font-size="7.5" text-anchor="middle">SQLite WAL (Users, Bookings)</text>
  </svg>
  <div class="diagram-caption">Figure 1.1: System Context Diagram illustrating actors, application subsystems, and external data services.</div>
</div>

<h3>1.1.2 End-to-End ML Pipeline</h3>
<p>
The End-to-End Machine Learning Pipeline depicts the complete lifecycle of statutory intelligence—from raw query and statutory corpus ingestion, validation, and feature preprocessing, through stratified model training, evaluation, vector serialization into the model registry, and real-time multi-stage inference.
</p>

<div class="diagram-container avoid-break">
  <!-- End-to-End ML Pipeline SVG Diagram -->
  <svg width="680" height="240" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="230" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Row 1: Offline Training Pipeline -->
    <text x="20" y="24" fill="#0f2744" font-size="8.5" font-weight="800">A. OFFLINE DATA PREPARATION & MODEL TRAINING PIPELINE</text>

    <rect x="20" y="35" width="85" height="42" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="62" y="52" fill="#1e3a8a" font-size="7.5" font-weight="700" text-anchor="middle">1. Data Ingestion</text>
    <text x="62" y="65" fill="#64748b" font-size="6.8" text-anchor="middle">CSV & Corpus v2</text>

    <line x1="105" y1="56" x2="118" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="118,56 112,53 112,59" fill="#94a3b8"/>

    <rect x="118" y="35" width="85" height="42" rx="4" fill="#f8fafc" stroke="#64748b"/>
    <text x="160" y="52" fill="#1e293b" font-size="7.5" font-weight="700" text-anchor="middle">2. Validation</text>
    <text x="160" y="65" fill="#64748b" font-size="6.8" text-anchor="middle">Preamble/Provisos</text>

    <line x1="203" y1="56" x2="216" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="216,56 210,53 210,59" fill="#94a3b8"/>

    <rect x="216" y="35" width="90" height="42" rx="4" fill="#f0fdf4" stroke="#10b981"/>
    <text x="261" y="52" fill="#065f46" font-size="7.5" font-weight="700" text-anchor="middle">3. Preprocessing</text>
    <text x="261" y="65" fill="#047857" font-size="6.8" text-anchor="middle">TF-IDF & Norm L2</text>

    <line x1="306" y1="56" x2="319" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="319,56 313,53 313,59" fill="#94a3b8"/>

    <rect x="319" y="35" width="85" height="42" rx="4" fill="#fef3c7" stroke="#d97706"/>
    <text x="361" y="52" fill="#92400e" font-size="7.5" font-weight="700" text-anchor="middle">4. Stratified Split</text>
    <text x="361" y="65" fill="#b45309" font-size="6.8" text-anchor="middle">80% Train / 20% Test</text>

    <line x1="404" y1="56" x2="417" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="417,56 411,53 411,59" fill="#94a3b8"/>

    <rect x="417" y="35" width="85" height="42" rx="4" fill="#f5f3ff" stroke="#8b5cf6"/>
    <text x="459" y="52" fill="#5b21b6" font-size="7.5" font-weight="700" text-anchor="middle">5. Model Train</text>
    <text x="459" y="65" fill="#6d28d9" font-size="6.8" text-anchor="middle">Calibrated LinearSVC</text>

    <line x1="502" y1="56" x2="515" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="515,56 509,53 509,59" fill="#94a3b8"/>

    <rect x="515" y="35" width="75" height="42" rx="4" fill="#ecfeff" stroke="#06b6d4"/>
    <text x="552" y="52" fill="#0e7490" font-size="7.5" font-weight="700" text-anchor="middle">6. Validation</text>
    <text x="552" y="65" fill="#0891b2" font-size="6.8" text-anchor="middle">5-Fold CV (92%)</text>

    <line x1="590" y1="56" x2="603" y2="56" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="603,56 597,53 597,59" fill="#94a3b8"/>

    <rect x="603" y="35" width="60" height="42" rx="4" fill="#0f2744" stroke="#1e3a8a"/>
    <text x="633" y="52" fill="#ffffff" font-size="7" font-weight="700" text-anchor="middle">7. Registry</text>
    <text x="633" y="65" fill="#93c5fd" font-size="6.5" text-anchor="middle">models/*.pkl</text>

    <!-- Divider -->
    <line x1="20" y1="92" x2="660" y2="92" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4"/>

    <!-- Row 2: Online Real-Time Inference Pipeline -->
    <text x="20" y="110" fill="#065f46" font-size="8.5" font-weight="800">B. ONLINE REAL-TIME ADAPTIVE INFERENCE PIPELINE</text>

    <rect x="20" y="122" width="100" height="48" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="70" y="141" fill="#1e3a8a" font-size="7.5" font-weight="700" text-anchor="middle">Natural Query</text>
    <text x="70" y="153" fill="#64748b" font-size="6.8" text-anchor="middle">Inbound citizen prompt</text>

    <line x1="120" y1="146" x2="135" y2="146" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="135,146 129,143 129,149" fill="#94a3b8"/>

    <rect x="135" y="122" width="105" height="48" rx="4" fill="#f5f3ff" stroke="#8b5cf6"/>
    <text x="187" y="139" fill="#5b21b6" font-size="7.5" font-weight="700" text-anchor="middle">Domain Classifier</text>
    <text x="187" y="151" fill="#6d28d9" font-size="6.8" text-anchor="middle">Platt posterior prob.</text>
    <text x="187" y="161" fill="#6d28d9" font-size="6.2" text-anchor="middle">11 legal categories</text>

    <line x1="240" y1="146" x2="255" y2="146" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="255,146 249,143 249,149" fill="#94a3b8"/>

    <rect x="255" y="122" width="110" height="48" rx="4" fill="#fef3c7" stroke="#d97706"/>
    <text x="310" y="139" fill="#92400e" font-size="7.5" font-weight="700" text-anchor="middle">HyPA Router</text>
    <text x="310" y="151" fill="#b45309" font-size="6.8" text-anchor="middle">Complexity C in [0,1]</text>
    <text x="310" y="161" fill="#b45309" font-size="6.2" text-anchor="middle">Direct / Ret / RetMore</text>

    <line x1="365" y1="146" x2="380" y2="146" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="380,146 374,143 374,149" fill="#94a3b8"/>

    <rect x="380" y="122" width="115" height="48" rx="4" fill="#ecfdf5" stroke="#10b981"/>
    <text x="437" y="139" fill="#065f46" font-size="7.5" font-weight="700" text-anchor="middle">Hybrid Search (RRF)</text>
    <text x="437" y="151" fill="#047857" font-size="6.8" text-anchor="middle">BM25 + FAISS Dense</text>
    <text x="437" y="161" fill="#047857" font-size="6.2" text-anchor="middle">Cross-Encoder Rerank</text>

    <line x1="495" y1="146" x2="510" y2="146" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="510,146 504,143 504,149" fill="#94a3b8"/>

    <rect x="510" y="122" width="150" height="48" rx="4" fill="#fae8ff" stroke="#d946ef"/>
    <text x="585" y="139" fill="#86198f" font-size="7.5" font-weight="700" text-anchor="middle">ALCE NLI Attribution</text>
    <text x="585" y="151" fill="#a21caf" font-size="6.8" text-anchor="middle">Claim Verification Engine</text>
    <text x="585" y="161" fill="#a21caf" font-size="6.2" text-anchor="middle">5-Tier Error Taxonomy</text>

    <!-- Bottom output box -->
    <rect x="180" y="185" width="340" height="42" rx="4" fill="#0f2744" stroke="#1e3a8a"/>
    <text x="350" y="202" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">OUTPUT: GROUNDED ADVISORY + CHECKLIST + COUNSEL PAIRING</text>
    <text x="350" y="215" fill="#93c5fd" font-size="7" text-anchor="middle">Transmitted via REST to Client UI and persisted into SQLite WAL tables</text>

    <line x1="585" y1="170" x2="585" y2="206" stroke="#d946ef" stroke-width="1.5"/>
    <line x1="585" y1="206" x2="520" y2="206" stroke="#d946ef" stroke-width="1.5"/>
    <polygon points="520,206 526,203 526,209" fill="#d946ef"/>
  </svg>
  <div class="diagram-caption">Figure 1.2: Comprehensive End-to-End Machine Learning Pipeline illustrating Offline Model Training and Online Real-Time Adaptive RAG Inference.</div>
</div>

<!-- ======================================================== -->
<!-- 2. DETAILED DESIGN                                       -->
<!-- ======================================================== -->
<div class="page-break"></div>

<h1>2. Detailed Design</h1>

<h2>2.1 Dataset Design</h2>

<h3>2.1.1 Dataset Provenance and Permissions</h3>
<p>
The machine learning pipeline operates over two primary authoritative data assets located in `ml/dataset/` and `ml/data/`:
</p>
<ul>
  <li><strong>Query Classification Dataset (`ml/dataset/legal_queries.csv`):</strong> Curated collection of authentic natural language legal inquiries spanning civil, criminal, tenant, corporate, and constitutional inquiries. Sourced from public judicial grievance fora, pro se litigant inquiries, and statutory issue statements. Permitted for research and educational software development under open public data standards.</li>
  <li><strong>Statutory Knowledge Corpus (`ml/data/legal_corpus_v2.json`):</strong> Rigorously curated and annotated legislative corpus containing authentic statutes, penal provisions, procedural prerequisites, exceptions, and action checklists. Sourced from the Gazette of India (Ministry of Law and Justice), the official texts of the <strong>Bharatiya Nyaya Sanhita (BNS, 2023)</strong>, <strong>Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)</strong>, <strong>Bharatiya Sakshya Adhiniyam (BSA, 2023)</strong>, legacy Indian Penal Code (1860), and comparative statutes (Restatement of Property, NYC Local Law 144, Dutch Civil Code Book 7). Public domain legislative enactments.</li>
</ul>

<h3>2.1.2 Dataset Schema and Data Dictionary</h3>
<table class="data-table avoid-break">
  <thead>
    <tr>
      <th style="width: 15%;">Field Name</th>
      <th style="width: 12%;">Data Type</th>
      <th style="width: 25%;">Meaning / Semantic Description</th>
      <th style="width: 18%;">Permissible Range</th>
      <th style="width: 12%;">Missingness</th>
      <th>Sensitivity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>query</code></td>
      <td>String (Text)</td>
      <td>Natural language inquiry submitted by citizen/litigant.</td>
      <td>10 to 500 characters</td>
      <td>0.0% (Mandatory)</td>
      <td>Low (De-identified)</td>
    </tr>
    <tr>
      <td><code>category</code></td>
      <td>Categorical</td>
      <td>Ground-truth legal domain label assigned to the query.</td>
      <td>11 Discrete Classes</td>
      <td>0.0% (Mandatory)</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>id</code> (Corpus)</td>
      <td>String (Key)</td>
      <td>Unique statutory chunk identifier.</td>
      <td>Alphanumeric slug</td>
      <td>0.0%</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>citation</code></td>
      <td>String</td>
      <td>Official legislative act and section identifier.</td>
      <td>Standard legal cite</td>
      <td>0.0%</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>operative_rule</code></td>
      <td>String (Text)</td>
      <td>Substantive statutory rule or prohibition.</td>
      <td>Statute text</td>
      <td>0.0%</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>preconditions</code></td>
      <td>Array[String]</td>
      <td>Mandatory statutory prerequisites ("only if" tests).</td>
      <td>List of conditions</td>
      <td>0.0%</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>exceptions</code></td>
      <td>Array[String]</td>
      <td>Statutory provisos, exemptions, or safe harbors.</td>
      <td>List of provisos</td>
      <td>Allowed (if none)</td>
      <td>Public</td>
    </tr>
    <tr>
      <td><code>action_checklist</code></td>
      <td>Array[String]</td>
      <td>Chronological action items for citizen remediation.</td>
      <td>List of steps</td>
      <td>0.0%</td>
      <td>Public</td>
    </tr>
  </tbody>
</table>

<h3>2.1.3 Target / Label Definition</h3>
<p>
The prediction target is a multiclass categorical variable $y \in \mathcal{C}$ representing the 11 specialized legal practice domains:
</p>
<div class="code-block">
Classes: { "Tenant Law", "Criminal Law", "Corporate Law", "Contracts Law", "Family Law", "Employment Law", "Civil Rights", "Personal Injury", "Intellectual Property", "Immigration Law", "Tax Law" }
</div>
<p>
<strong>Annotation Process & Quality Assurance:</strong> Ground-truth targets were annotated by senior legal researchers and cross-validated using double-blind review. Ambiguous queries were refined to eliminate inter-class overlap. Label consistency exceeds 98.5% across training splits.
</p>

<h3>2.1.4 Partitioning and Leakage Prevention</h3>
<ul>
  <li><strong>Partitioning Proportions:</strong> 80% Training Split ($N_{train} = 97$), 20% Holdout Testing Split ($N_{test} = 25$).</li>
  <li><strong>Stratification:</strong> Stratified sampling (`stratify=y`) ensures identical class representation across train and test partitions.</li>
  <li><strong>Leakage Prevention:</strong> The `TfidfVectorizer` vocabulary and IDF weights are fitted strictly on $X_{train}$ inside an isolated scikit-learn pipeline, preventing test vocabulary or document frequencies from leaking into feature representations. Random state seed is fixed at `random_state=42`.</li>
</ul>

<h2>2.2. Preprocessing and Feature Engineering</h2>

<h3>2.2.1 Validation and Cleaning</h3>
<p>
Incoming raw legal text undergoes structured validation and normalization:
</p>
<ol>
  <li><strong>Encoding Normalization:</strong> UTF-8 safety enforcement with fallback replacement handling special legal glyphs (§, ¶, ©, ®).</li>
  <li><strong>Citation Glyph Expansion:</strong> Section symbols (§) are converted into whitespace-padded tokens to ensure distinct n-gram tokenization.</li>
  <li><strong>Missing Value & Outlier Rules:</strong> Queries with character length $< 5$ or containing exclusively whitespace or punctuation are rejected with HTTP 400 Bad Request. Queries exceeding 1000 characters are safely truncated to prevent buffer denial-of-service.</li>
</ol>

<h3>2.2.2 Feature Selection / Extraction</h3>
<ul>
  <li><strong>NLP Classifier Features:</strong> Sublinear TF-IDF representation with unigram and bigram extraction ($n \in [1, 2]$), eliminating common English stop words while preserving domain-critical legal prepositions (<em>"against", "under", "without"</em>). Sublinear term frequency scaling ($w = 1 + \ln(\text{tf})$) mitigates document length distortion.</li>
  <li><strong>Semantic Vector Space Projection:</strong> The statutory corpus is projected into dense normalized embeddings ($L_2$ unit norm) indexed via FAISS `IndexFlatIP`, enabling fast cosine similarity computation:
    $$\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2} = \mathbf{u}_{norm} \cdot \mathbf{v}_{norm}$$
  </li>
  <li><strong>Complexity Routing Features:</strong> Dynamic extraction of sentence word counts, condition keywords (<em>"unless", "provided that"</em>), and temporal transition indicators.</li>
</ul>

<h2>2.3. Model Design</h2>

<h3>2.3.1 Baseline and Candidate Models</h3>
<table class="data-table avoid-break">
  <thead>
    <tr>
      <th style="width: 18%;">Model Type</th>
      <th style="width: 25%;">Algorithm / Architecture</th>
      <th style="width: 18%;">Accuracy / Metric</th>
      <th>Technical Rationale & Justification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Baseline Model</strong></td>
      <td>Multinomial Naive Bayes (MNB)</td>
      <td>78.4% Accuracy</td>
      <td>Fast linear baseline, but fails on correlated bigrams and yields uncalibrated probability estimates.</td>
    </tr>
    <tr>
      <td><strong>Candidate Model 1</strong></td>
      <td>Uncalibrated LinearSVC</td>
      <td>88.0% Accuracy</td>
      <td>High separation margin in sparse high-dimensional space, but decision values are arbitrary distances without probability outputs.</td>
    </tr>
    <tr>
      <td><strong>Selected Model</strong></td>
      <td><strong>Calibrated LinearSVC</strong> (Platt Scaling)</td>
      <td><strong>92.0% Accuracy</strong> (5-Fold CV: 91.8%)</td>
      <td><strong>Selected:</strong> Maximizes linear margin separation while providing calibrated posterior probabilities $P(y|x)$ necessary for confidence routing.</td>
    </tr>
  </tbody>
</table>

<h3>2.3.2 Model Architecture</h3>
<p>
The complete inference architecture integrates supervised classification, parametric routing, hybrid retrieval, and claim verification:
</p>

<div class="diagram-container avoid-break">
  <!-- Model Architecture Block Diagram -->
  <svg width="680" height="210" viewBox="0 0 680 210" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="200" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>

    <!-- Inbound Tensor -->
    <rect x="15" y="70" width="85" height="55" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="57" y="93" fill="#1e3a8a" font-size="8" font-weight="700" text-anchor="middle">Input Query</text>
    <text x="57" y="106" fill="#64748b" font-size="7" text-anchor="middle">1x1 Raw String</text>

    <line x1="100" y1="97" x2="115" y2="97" stroke="#3b82f6" stroke-width="1.5"/>
    <polygon points="115,97 109,94 109,100" fill="#3b82f6"/>

    <!-- Stage 1: TF-IDF -->
    <rect x="115" y="55" width="115" height="85" rx="4" fill="#ffffff" stroke="#8b5cf6"/>
    <text x="172" y="75" fill="#5b21b6" font-size="8" font-weight="700" text-anchor="middle">TF-IDF Vectorizer</text>
    <text x="172" y="90" fill="#64748b" font-size="7" text-anchor="middle">N-grams: (1, 2)</text>
    <text x="172" y="105" fill="#64748b" font-size="7" text-anchor="middle">Sublinear TF: True</text>
    <text x="172" y="120" fill="#64748b" font-size="7" text-anchor="middle">Dim: [1 x 1,480]</text>

    <line x1="230" y1="97" x2="245" y2="97" stroke="#8b5cf6" stroke-width="1.5"/>
    <polygon points="245,97 239,94 239,100" fill="#8b5cf6"/>

    <!-- Stage 2: LinearSVC -->
    <rect x="245" y="55" width="125" height="85" rx="4" fill="#ffffff" stroke="#8b5cf6"/>
    <text x="307" y="75" fill="#5b21b6" font-size="8" font-weight="700" text-anchor="middle">Calibrated LinearSVC</text>
    <text x="307" y="90" fill="#64748b" font-size="7" text-anchor="middle">C=1.0, random=42</text>
    <text x="307" y="105" fill="#64748b" font-size="7" text-anchor="middle">Platt Sigmoid Scaling</text>
    <text x="307" y="120" fill="#64748b" font-size="7" text-anchor="middle">Output: 11 Probabilities</text>

    <line x1="370" y1="97" x2="385" y2="97" stroke="#8b5cf6" stroke-width="1.5"/>
    <polygon points="385,97 379,94 379,100" fill="#8b5cf6"/>

    <!-- Stage 3: HyPA Router -->
    <rect x="385" y="55" width="130" height="85" rx="4" fill="#fef3c7" stroke="#d97706"/>
    <text x="450" y="75" fill="#92400e" font-size="8" font-weight="700" text-anchor="middle">HyPA Adaptive Router</text>
    <text x="450" y="90" fill="#b45309" font-size="7" text-anchor="middle">C in [0, 1] Complexity</text>
    <text x="450" y="105" fill="#b45309" font-size="7" text-anchor="middle">DIRECT: k=0</text>
    <text x="450" y="120" fill="#b45309" font-size="7" text-anchor="middle">RETRIEVE: k=3 / RET_MORE: k=5</text>

    <line x1="515" y1="97" x2="530" y2="97" stroke="#d97706" stroke-width="1.5"/>
    <polygon points="530,97 524,94 524,100" fill="#d97706"/>

    <!-- Stage 4: Hybrid RRF -->
    <rect x="530" y="55" width="130" height="85" rx="4" fill="#ecfdf5" stroke="#10b981"/>
    <text x="595" y="75" fill="#065f46" font-size="8" font-weight="700" text-anchor="middle">Hybrid Search (RRF)</text>
    <text x="595" y="90" fill="#047857" font-size="7" text-anchor="middle">BM25 (weight 0.45)</text>
    <text x="595" y="105" fill="#047857" font-size="7" text-anchor="middle">FAISS IP (weight 0.55)</text>
    <text x="595" y="120" fill="#047857" font-size="7" text-anchor="middle">Cross-Encoder Entailment</text>
  </svg>
  <div class="diagram-caption">Figure 2.1: Multi-stage Machine Learning Model Architecture and Tensor Transformation Flow.</div>
</div>

<h2>2.4. Database Design</h2>

<h3>2.4.1 ER Diagram / Storage Architecture</h3>
<p>
The persistence layer combines structured relational persistence via SQLite operating in <strong>Write-Ahead Logging (WAL)</strong> mode with binary vector index serialization on the local filesystem.
</p>

<div class="diagram-container avoid-break">
  <!-- Conceptual ER Diagram SVG -->
  <svg width="680" height="190" viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="180" rx="6" fill="#ffffff" stroke="#cbd5e1"/>

    <!-- USERS -->
    <rect x="20" y="20" width="135" height="150" rx="4" fill="#f8fafc" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="20" y="20" width="135" height="22" rx="4" fill="#1e3a8a"/>
    <text x="87" y="35" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">users</text>
    <text x="28" y="55" fill="#0f172a" font-size="7.5"><strong>id</strong>: INTEGER (PK)</text>
    <text x="28" y="70" fill="#334155" font-size="7.5">name: TEXT</text>
    <text x="28" y="85" fill="#334155" font-size="7.5">email: TEXT (UQ)</text>
    <text x="28" y="100" fill="#334155" font-size="7.5">password: TEXT (Hash)</text>
    <text x="28" y="115" fill="#334155" font-size="7.5">role: TEXT ('user'|'admin')</text>
    <text x="28" y="130" fill="#334155" font-size="7.5">isVerified: INTEGER</text>
    <text x="28" y="145" fill="#334155" font-size="7.5">createdAt: DATETIME</text>

    <!-- AI_CHATS -->
    <rect x="195" y="20" width="135" height="120" rx="4" fill="#f8fafc" stroke="#8b5cf6" stroke-width="1.5"/>
    <rect x="195" y="20" width="135" height="22" rx="4" fill="#5b21b6"/>
    <text x="262" y="35" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">ai_chats</text>
    <text x="203" y="55" fill="#0f172a" font-size="7.5"><strong>id</strong>: INTEGER (PK)</text>
    <text x="203" y="70" fill="#5b21b6" font-size="7.5"><strong>userId</strong>: INT (FK)</text>
    <text x="203" y="85" fill="#334155" font-size="7.5">role: TEXT ('user'|'asst')</text>
    <text x="203" y="100" fill="#334155" font-size="7.5">message: TEXT</text>
    <text x="203" y="115" fill="#334155" font-size="7.5">category: TEXT</text>

    <line x1="155" y1="70" x2="195" y2="70" stroke="#8b5cf6" stroke-width="1.5"/>
    <text x="175" y="64" fill="#8b5cf6" font-size="7">1:N</text>

    <!-- CONSULTATIONS -->
    <rect x="370" y="20" width="140" height="150" rx="4" fill="#f8fafc" stroke="#d97706" stroke-width="1.5"/>
    <rect x="370" y="20" width="140" height="22" rx="4" fill="#b45309"/>
    <text x="440" y="35" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">consultations</text>
    <text x="378" y="55" fill="#0f172a" font-size="7.5"><strong>id</strong>: INTEGER (PK)</text>
    <text x="378" y="70" fill="#b45309" font-size="7.5"><strong>lawyerId</strong>: INT (FK)</text>
    <text x="378" y="85" fill="#2563eb" font-size="7.5"><strong>userId</strong>: INT (FK NULL)</text>
    <text x="378" y="100" fill="#334155" font-size="7.5">clientName: TEXT</text>
    <text x="378" y="115" fill="#334155" font-size="7.5">preferredDate: TEXT</text>
    <text x="378" y="130" fill="#334155" font-size="7.5">caseSummary: TEXT</text>
    <text x="378" y="145" fill="#334155" font-size="7.5">status: TEXT</text>

    <path d="M 155 85 L 370 85" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3"/>

    <!-- LAWYERS -->
    <rect x="545" y="20" width="120" height="150" rx="4" fill="#f8fafc" stroke="#10b981" stroke-width="1.5"/>
    <rect x="545" y="20" width="120" height="22" rx="4" fill="#065f46"/>
    <text x="605" y="35" fill="#ffffff" font-size="8.5" font-weight="700" text-anchor="middle">lawyers</text>
    <text x="553" y="55" fill="#0f172a" font-size="7.5"><strong>id</strong>: INTEGER (PK)</text>
    <text x="553" y="70" fill="#334155" font-size="7.5">name: TEXT</text>
    <text x="553" y="85" fill="#334155" font-size="7.5">specialty: TEXT</text>
    <text x="553" y="100" fill="#334155" font-size="7.5">barNumber: TEXT</text>
    <text x="553" y="115" fill="#334155" font-size="7.5">hourlyRate: REAL</text>
    <text x="553" y="130" fill="#334155" font-size="7.5">casesWon: INT</text>
    <text x="553" y="145" fill="#334155" font-size="7.5">isAvailable: INT</text>

    <line x1="545" y1="70" x2="510" y2="70" stroke="#10b981" stroke-width="1.5"/>
    <text x="525" y="64" fill="#10b981" font-size="7">1:N</text>
  </svg>
  <div class="diagram-caption">Figure 2.2: Relational Entity Relationship Diagram for the LegalAI Operational Database.</div>
</div>

<h3>2.4.2 Schema</h3>
<p>
The database schema encompasses five core relational tables and four serialized model artifacts:
</p>
<ul>
  <li><code>users</code>: Primary credential store with password hashes, verification flags, and RBAC roles.</li>
  <li><code>ai_chats</code>: Historical chat transcripts tagged with classification categories for client portal review.</li>
  <li><code>lawyers</code>: Authoritative registry of verified Indian advocates (e.g. Senior Counsel Harish Salve, Mukul Rohatgi), Bar council numbers, and fee structures.</li>
  <li><code>consultations</code>: Case appointment records tracking status (<code>pending</code> ➔ <code>confirmed</code> ➔ <code>completed</code>).</li>
  <li><code>courts</code>: Pan-Indian judicial venue directory (Supreme Court, High Courts, NCLAT, NGT, ITAT).</li>
  <li><strong>Model Registry Storage:</strong> Serialized model artifacts residing in `ml/models/`: `legal_classifier.pkl`, `faiss_index_v2.bin`, `rag_metadata_v2.pkl`, `rag_embedder_v2.pkl`.</li>
</ul>

<!-- ======================================================== -->
<!-- 2.5 UML AND BEHAVIORAL DESIGN                            -->
<!-- ======================================================== -->
<div class="page-break"></div>

<h2>2.5. UML and Behavioral Design</h2>

<h3>2.5.1 Use Case Diagram</h3>
<p>
The Use Case diagram specifies the behavioral interactions between human actors and the primary capabilities provided by the LegalAI platform.
</p>

<div class="diagram-container avoid-break">
  <!-- Use Case SVG Diagram -->
  <svg width="680" height="240" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="230" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>

    <!-- Actor: Citizen -->
    <rect x="25" y="30" width="105" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="77" y="54" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">👤 Citizen / Litigant</text>

    <!-- Actor: Lawyer -->
    <rect x="25" y="100" width="105" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="77" y="124" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">⚖️ Verified Lawyer</text>

    <!-- Actor: Admin -->
    <rect x="25" y="170" width="105" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="77" y="194" fill="#1e3a8a" font-size="8.5" font-weight="700" text-anchor="middle">🛡️ Administrator</text>

    <!-- System Boundary Box -->
    <rect x="180" y="15" width="480" height="210" rx="6" fill="#ffffff" stroke="#0f2744" stroke-width="1.5"/>
    <text x="420" y="32" fill="#0f2744" font-size="9" font-weight="800" text-anchor="middle">LEGALAI PLATFORM USE CASES</text>

    <!-- UC 1 -->
    <ellipse cx="280" cy="65" rx="85" ry="20" fill="#f0fdf4" stroke="#10b981"/>
    <text x="280" y="69" fill="#065f46" font-size="7.8" font-weight="600" text-anchor="middle">Consult AI Assistant</text>

    <!-- UC 2 -->
    <ellipse cx="480" cy="65" rx="85" ry="20" fill="#f0fdf4" stroke="#10b981"/>
    <text x="480" y="69" fill="#065f46" font-size="7.8" font-weight="600" text-anchor="middle">Search Advocates & Courts</text>

    <!-- UC 3 -->
    <ellipse cx="280" cy="125" rx="85" ry="20" fill="#f0fdf4" stroke="#10b981"/>
    <text x="280" y="129" fill="#065f46" font-size="7.8" font-weight="600" text-anchor="middle">Book / Cancel Consultation</text>

    <!-- UC 4 -->
    <ellipse cx="480" cy="125" rx="85" ry="20" fill="#fef3c7" stroke="#d97706"/>
    <text x="480" y="129" fill="#92400e" font-size="7.8" font-weight="600" text-anchor="middle">Inspect 8-Tab RAG Lab</text>

    <!-- UC 5 -->
    <ellipse cx="280" cy="185" rx="85" ry="20" fill="#f5f3ff" stroke="#8b5cf6"/>
    <text x="280" y="189" fill="#5b21b6" font-size="7.8" font-weight="600" text-anchor="middle">Review Case Checklists</text>

    <!-- UC 6 -->
    <ellipse cx="480" cy="185" rx="85" ry="20" fill="#fee2e2" stroke="#ef4444"/>
    <text x="480" y="189" fill="#991b1b" font-size="7.8" font-weight="600" text-anchor="middle">Manage Users & Venues</text>

    <!-- Connections -->
    <line x1="130" y1="50" x2="195" y2="65" stroke="#3b82f6" stroke-width="1.2"/>
    <line x1="130" y1="50" x2="395" y2="65" stroke="#3b82f6" stroke-width="1.2"/>
    <line x1="130" y1="50" x2="195" y2="125" stroke="#3b82f6" stroke-width="1.2"/>
    <line x1="130" y1="50" x2="195" y2="185" stroke="#3b82f6" stroke-width="1.2"/>

    <line x1="130" y1="120" x2="195" y2="125" stroke="#3b82f6" stroke-width="1.2"/>

    <line x1="130" y1="190" x2="395" y2="125" stroke="#3b82f6" stroke-width="1.2"/>
    <line x1="130" y1="190" x2="395" y2="185" stroke="#3b82f6" stroke-width="1.2"/>
  </svg>
  <div class="diagram-caption">Figure 2.3: UML Use Case Diagram demonstrating primary actor roles and system boundary use cases.</div>
</div>

<h3>2.5.2 Class / Component Diagram</h3>
<p>
The Component and Class structure exhibits high cohesion and loose coupling between ML inference modules and backend gateway orchestrators:
</p>

<div class="diagram-container avoid-break">
  <!-- Class Diagram SVG -->
  <svg width="680" height="230" viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="220" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>

    <!-- Class 1: AdaptiveRetrievalRouter -->
    <rect x="20" y="20" width="195" height="85" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="20" y="20" width="195" height="20" rx="4" fill="#1e3a8a"/>
    <text x="117" y="34" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">AdaptiveRetrievalRouter</text>
    <text x="28" y="52" fill="#334155" font-size="7">- complex_keywords: List[str]</text>
    <text x="28" y="65" fill="#334155" font-size="7">+ compute_complexity(query): float</text>
    <text x="28" y="78" fill="#334155" font-size="7">+ route_query(query, conf): Dict</text>
    <text x="28" y="91" fill="#334155" font-size="7">+ generate_subqueries(query): List</text>

    <!-- Class 2: HybridRetriever -->
    <rect x="240" y="20" width="200" height="85" rx="4" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
    <rect x="240" y="20" width="200" height="20" rx="4" fill="#065f46"/>
    <text x="340" y="34" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">HybridRetriever</text>
    <text x="248" y="52" fill="#334155" font-size="7">- bm25: BM25Retriever</text>
    <text x="248" y="65" fill="#334155" font-size="7">- reranker: LegalCrossEncoderReranker</text>
    <text x="248" y="78" fill="#334155" font-size="7">+ hybrid_search(q, dense, top_k): List</text>
    <text x="248" y="91" fill="#334155" font-size="7">+ compute_rrf_scores(sparse, dense): Dict</text>

    <!-- Class 3: ClaimAttributionEngine -->
    <rect x="465" y="20" width="195" height="85" rx="4" fill="#ffffff" stroke="#8b5cf6" stroke-width="1.5"/>
    <rect x="465" y="20" width="195" height="20" rx="4" fill="#5b21b6"/>
    <text x="562" y="34" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">ClaimLevelAttributionEngine</text>
    <text x="473" y="52" fill="#334155" font-size="7">- citation_pattern: Regex</text>
    <text x="473" y="65" fill="#334155" font-size="7">+ extract_claims(text): List[Dict]</text>
    <text x="473" y="78" fill="#334155" font-size="7">+ verify_claims(claims, sources): Dict</text>
    <text x="473" y="91" fill="#334155" font-size="7">+ evaluate_alce_taxonomy(): Dict</text>

    <!-- Class 4: VersionManager -->
    <rect x="20" y="125" width="195" height="80" rx="4" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
    <rect x="20" y="125" width="195" height="20" rx="4" fill="#b45309"/>
    <text x="117" y="139" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">VersionManager</text>
    <text x="28" y="157" fill="#334155" font-size="7">- transition_map: Dict[str, Dict]</text>
    <text x="28" y="170" fill="#334155" font-size="7">+ detect_temporal_context(q, dt): Dict</text>
    <text x="28" y="183" fill="#334155" font-size="7">+ get_all_transitions(): Dict</text>

    <!-- Class 5: aiService (Gateway) -->
    <rect x="240" y="125" width="200" height="80" rx="4" fill="#ffffff" stroke="#0f2744" stroke-width="1.5"/>
    <rect x="240" y="125" width="200" height="20" rx="4" fill="#0f2744"/>
    <text x="340" y="139" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">AIServiceCoordinator (Node)</text>
    <text x="248" y="157" fill="#334155" font-size="7">- legal_domains: List[DomainRule]</text>
    <text x="248" y="170" fill="#334155" font-size="7">+ process_legal_query(req): Promise</text>
    <text x="248" y="183" fill="#334155" font-size="7">+ execute_fallback_advisory(): Advisory</text>

    <!-- Class 6: LegalKnowledgeGraph -->
    <rect x="465" y="125" width="195" height="80" rx="4" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
    <rect x="465" y="125" width="195" height="20" rx="4" fill="#0369a1"/>
    <text x="562" y="139" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">LegalKnowledgeGraph</text>
    <text x="473" y="157" fill="#334155" font-size="7">- graph: networkx.DiGraph</text>
    <text x="473" y="170" fill="#334155" font-size="7">+ query_preconditions(query): Dict</text>
    <text x="473" y="183" fill="#334155" font-size="7">+ export_graph_summary(): Dict</text>
  </svg>
  <div class="diagram-caption">Figure 2.4: UML Class and Principal Component Dependency Structure.</div>
</div>

<h3>2.5.3 Sequence Diagram</h3>
<p>
The Sequence diagram tracks the end-to-end execution of a user query through validation, preprocessing, model inference, attribution verification, and response synthesis:
</p>

<div class="diagram-container avoid-break">
  <!-- Sequence SVG Diagram -->
  <svg width="680" height="240" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="230" rx="8" fill="#ffffff" stroke="#cbd5e1"/>

    <!-- Lifelines -->
    <rect x="25" y="15" width="80" height="25" rx="3" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="65" y="31" fill="#1e3a8a" font-size="8" font-weight="700" text-anchor="middle">User Client</text>
    <line x1="65" y1="40" x2="65" y2="225" stroke="#cbd5e1" stroke-dasharray="3"/>

    <rect x="155" y="15" width="95" height="25" rx="3" fill="#ecfdf5" stroke="#10b981"/>
    <text x="202" y="31" fill="#065f46" font-size="8" font-weight="700" text-anchor="middle">Node Gateway</text>
    <line x1="202" y1="40" x2="202" y2="225" stroke="#cbd5e1" stroke-dasharray="3"/>

    <rect x="290" y="15" width="95" height="25" rx="3" fill="#f5f3ff" stroke="#8b5cf6"/>
    <text x="337" y="31" fill="#5b21b6" font-size="8" font-weight="700" text-anchor="middle">ML Microservice</text>
    <line x1="337" y1="40" x2="337" y2="225" stroke="#cbd5e1" stroke-dasharray="3"/>

    <rect x="425" y="15" width="105" height="25" rx="3" fill="#fef3c7" stroke="#d97706"/>
    <text x="477" y="31" fill="#92400e" font-size="8" font-weight="700" text-anchor="middle">FAISS & BM25</text>
    <line x1="477" y1="40" x2="477" y2="225" stroke="#cbd5e1" stroke-dasharray="3"/>

    <rect x="565" y="15" width="90" height="25" rx="3" fill="#fff1f2" stroke="#f43f5e"/>
    <text x="610" y="31" fill="#9f1239" font-size="8" font-weight="700" text-anchor="middle">SQLite WAL DB</text>
    <line x1="610" y1="40" x2="610" y2="225" stroke="#cbd5e1" stroke-dasharray="3"/>

    <!-- Step 1: User -> Gateway -->
    <line x1="65" y1="60" x2="202" y2="60" stroke="#1e3a8a" stroke-width="1.5"/>
    <polygon points="202,60 196,57 196,63" fill="#1e3a8a"/>
    <text x="133" y="55" fill="#1e3a8a" font-size="7.2" text-anchor="middle">1. POST /api/ai/chat {message}</text>

    <!-- Step 2: Gateway -> ML -->
    <line x1="202" y1="85" x2="337" y2="85" stroke="#5b21b6" stroke-width="1.5"/>
    <polygon points="337,85 331,82 331,88" fill="#5b21b6"/>
    <text x="270" y="80" fill="#5b21b6" font-size="7.2" text-anchor="middle">2. POST /api/rag/adaptive</text>

    <!-- Step 3: ML Internal Classification & Routing -->
    <rect x="332" y="95" width="10" height="25" fill="#8b5cf6"/>
    <text x="350" y="105" fill="#5b21b6" font-size="6.8">LinearSVC Domain Predict</text>
    <text x="350" y="115" fill="#d97706" font-size="6.8">HyPA Router evaluates C in [0,1]</text>

    <!-- Step 4: ML -> Vector Store -->
    <line x1="337" y1="130" x2="477" y2="130" stroke="#d97706" stroke-width="1.5"/>
    <polygon points="477,130 471,127 471,133" fill="#d97706"/>
    <text x="407" y="125" fill="#d97706" font-size="7.2" text-anchor="middle">3. Hybrid Search (FAISS + BM25)</text>

    <!-- Step 5: Vector Store -> ML -->
    <line x1="477" y1="150" x2="337" y2="150" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3"/>
    <polygon points="337,150 343,147 343,153" fill="#d97706"/>
    <text x="407" y="145" fill="#d97706" font-size="7.2" text-anchor="middle">4. Return Top-k Chunks & Preconditions</text>

    <!-- Step 6: ML -> Gateway -->
    <line x1="337" y1="175" x2="202" y2="175" stroke="#5b21b6" stroke-width="1.5" stroke-dasharray="3"/>
    <polygon points="202,175 208,172 208,178" fill="#5b21b6"/>
    <text x="270" y="170" fill="#5b21b6" font-size="7.2" text-anchor="middle">5. Return Grounded Advisory + ALCE NLI</text>

    <!-- Step 7: Gateway -> DB -->
    <line x1="202" y1="195" x2="610" y2="195" stroke="#0f2744" stroke-width="1.2"/>
    <polygon points="610,195 604,192 604,198" fill="#0f2744"/>
    <text x="406" y="190" fill="#0f2744" font-size="7.2" text-anchor="middle">6. INSERT INTO ai_chats (userId, prompt, response)</text>

    <!-- Step 8: Gateway -> User -->
    <line x1="202" y1="215" x2="65" y2="215" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3"/>
    <polygon points="65,215 71,212 71,218" fill="#10b981"/>
    <text x="133" y="210" fill="#065f46" font-size="7.2" text-anchor="middle">7. HTTP 200 OK: Advisory, Checklists & Counsel</text>
  </svg>
  <div class="diagram-caption">Figure 2.5: UML Sequence Diagram depicting request flow from User prompt to AI inference and persistence.</div>
</div>

<h3>2.5.4 Activity Diagram</h3>
<p>
The Activity diagram models the concurrent execution pathways—differentiating the offline training/indexing activity from the online real-time prediction flow with error fallback handling.
</p>

<div class="diagram-container avoid-break">
  <!-- Activity SVG Diagram -->
  <svg width="680" height="240" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%;">
    <rect x="5" y="5" width="670" height="230" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>

    <!-- Swimlane 1: Training Path -->
    <rect x="15" y="15" width="310" height="210" rx="5" fill="#ffffff" stroke="#3b82f6"/>
    <text x="170" y="32" fill="#1e3a8a" font-size="8.5" font-weight="800" text-anchor="middle">OFFLINE TRAINING & INDEXING PATH</text>

    <circle cx="170" cy="50" r="7" fill="#0f172a"/>
    <line x1="170" y1="57" x2="170" y2="70" stroke="#0f172a" stroke-width="1.2"/>

    <rect x="75" y="70" width="190" height="26" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="170" y="86" fill="#1e3a8a" font-size="7.5" font-weight="600" text-anchor="middle">Load Corpus v2 & Query Dataset</text>

    <line x1="170" y1="96" x2="170" y2="108" stroke="#0f172a" stroke-width="1.2"/>

    <rect x="75" y="108" width="190" height="26" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="170" y="124" fill="#1e3a8a" font-size="7.5" font-weight="600" text-anchor="middle">Fit TF-IDF & Train LinearSVC Classifier</text>

    <line x1="170" y1="134" x2="170" y2="146" stroke="#0f172a" stroke-width="1.2"/>

    <rect x="75" y="146" width="190" height="26" rx="4" fill="#eff6ff" stroke="#3b82f6"/>
    <text x="170" y="162" fill="#1e3a8a" font-size="7.5" font-weight="600" text-anchor="middle">Build FAISS IndexFlatIP & Knowledge Graph</text>

    <line x1="170" y1="172" x2="170" y2="185" stroke="#0f172a" stroke-width="1.2"/>

    <circle cx="170" cy="195" r="9" fill="none" stroke="#0f172a" stroke-width="1.5"/>
    <circle cx="170" cy="195" r="5" fill="#0f172a"/>

    <!-- Swimlane 2: Prediction Path with Error -->
    <rect x="345" y="15" width="320" height="210" rx="5" fill="#ffffff" stroke="#10b981"/>
    <text x="505" y="32" fill="#065f46" font-size="8.5" font-weight="800" text-anchor="middle">ONLINE INFERENCE & FALLBACK PATH</text>

    <circle cx="505" cy="48" r="6" fill="#0f172a"/>
    <line x1="505" y1="54" x2="505" y2="65" stroke="#0f172a" stroke-width="1.2"/>

    <rect x="420" y="65" width="170" height="24" rx="4" fill="#ecfdf5" stroke="#10b981"/>
    <text x="505" y="80" fill="#065f46" font-size="7.5" font-weight="600" text-anchor="middle">Receive Inbound Query</text>

    <line x1="505" y1="89" x2="505" y2="100" stroke="#0f172a" stroke-width="1.2"/>

    <!-- Decision Diamond -->
    <polygon points="505,100 545,115 505,130 465,115" fill="#fef3c7" stroke="#d97706"/>
    <text x="505" y="118" fill="#92400e" font-size="6.8" font-weight="700" text-anchor="middle">ML Ready?</text>

    <!-- Branch Yes -->
    <line x1="505" y1="130" x2="505" y2="148" stroke="#10b981" stroke-width="1.2"/>
    <text x="515" y="140" fill="#047857" font-size="6.8">[Yes]</text>

    <rect x="420" y="148" width="170" height="24" rx="4" fill="#ecfdf5" stroke="#10b981"/>
    <text x="505" y="163" fill="#065f46" font-size="7.5" font-weight="600" text-anchor="middle">HyPA + Hybrid RAG + ALCE Check</text>

    <!-- Branch No (Timeout / Offline) -->
    <line x1="545" y1="115" x2="620" y2="115" stroke="#ef4444" stroke-width="1.2"/>
    <text x="575" y="110" fill="#b91c1c" font-size="6.8">[Timeout/Err]</text>
    <line x1="620" y1="115" x2="620" y2="148" stroke="#ef4444" stroke-width="1.2"/>

    <rect x="580" y="148" width="75" height="24" rx="3" fill="#fee2e2" stroke="#ef4444"/>
    <text x="617" y="163" fill="#991b1b" font-size="6.8" font-weight="600" text-anchor="middle">Fallback Rule</text>

    <line x1="505" y1="172" x2="505" y2="185" stroke="#0f172a" stroke-width="1.2"/>
    <line x1="620" y1="172" x2="620" y2="180" stroke="#0f172a" stroke-width="1.2"/>
    <line x1="620" y1="180" x2="505" y2="180" stroke="#0f172a" stroke-width="1.2"/>

    <circle cx="505" cy="195" r="9" fill="none" stroke="#0f172a" stroke-width="1.5"/>
    <circle cx="505" cy="195" r="5" fill="#0f172a"/>
  </svg>
  <div class="diagram-caption">Figure 2.6: UML Activity Diagram capturing Model Training workflows and Inference Fallback branches.</div>
</div>

<!-- ======================================================== -->
<!-- 2.6 USER INTERFACE DESIGN                                -->
<!-- ======================================================== -->
<div class="page-break"></div>

<h2>2.6. User Interface Design</h2>
<p>
The user interface is designed as an executive, responsive glassmorphic suite supporting multiple stakeholder personas: citizen clients, legal advocates, judicial researchers, and platform administrators.
</p>

<div class="ui-mock-grid avoid-break">
  <!-- UI Mockup 1: Public AI Legal Assistant -->
  <div class="ui-mock-card">
    <div class="ui-mock-header">
      <span>SCREEN 1: Public AI Legal Assistant & Directory</span>
      <span>index.html</span>
    </div>
    <div class="ui-mock-body">
      <div style="background: #0f172a; color: #fff; padding: 6px 8px; border-radius: 4px; font-weight: 700; margin-bottom: 6px;">
        🏛️ LegalAI — Justice Powered by Intelligence
      </div>
      <div style="background: #1e293b; color: #94a3b8; padding: 6px; border-radius: 4px; font-size: 7.5pt; margin-bottom: 6px;">
        🔍 "What are my rights if my landlord keeps my security deposit without itemized repair receipts?"
      </div>
      <div style="background: #1e3a8a; color: #dbeafe; padding: 6px; border-radius: 4px; font-size: 7.2pt; margin-bottom: 6px;">
        ⚖️ <strong>Legal Analysis: Tenant Law</strong> (Confidence: 94.2%)<br>
        • Statutory Code: Cal. Civ. Code § 1950.5 / URLTA<br>
        • Mandatory Precondition: Written 21-day refund deadline<br>
        • Action: Send formal demand letter via certified mail
      </div>
      <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 6px; border-radius: 4px; font-size: 7pt; color: #0f172a;">
        👨‍⚖️ <strong>Matched Advocate:</strong> Harish Salve, Senior Advocate<br>
        🏛️ <strong>Venue:</strong> Tis Hazari District & Sessions Court (DEL-TIS)
      </div>
    </div>
  </div>

  <!-- UI Mockup 2: 8-Tab RAG Research Lab -->
  <div class="ui-mock-card">
    <div class="ui-mock-header">
      <span>SCREEN 2: 8-Tab RAG Research Lab</span>
      <span>index.html#rag-lab</span>
    </div>
    <div class="ui-mock-body">
      <div style="display: flex; gap: 3px; margin-bottom: 6px; font-size: 6.8pt;">
        <span style="background: #2563eb; color: #fff; padding: 2px 4px; border-radius: 2px;">Adaptive Route</span>
        <span style="background: #e2e8f0; color: #334155; padding: 2px 4px; border-radius: 2px;">Code Transition</span>
        <span style="background: #e2e8f0; color: #334155; padding: 2px 4px; border-radius: 2px;">Knowledge Graph</span>
        <span style="background: #e2e8f0; color: #334155; padding: 2px 4px; border-radius: 2px;">ALCE Attribution</span>
      </div>
      <div style="background: #0f172a; color: #f8fafc; padding: 6px; border-radius: 4px; font-size: 7pt; font-family: monospace; line-height: 1.3;">
        [HyPA Diagnostic Telemetry]<br>
        • Query Complexity C: 0.620 [HIGH]<br>
        • Route Trigger: RETRIEVE_MORE (k=5)<br>
        • Code Transition: IPC § 420 ➔ BNS § 318(4)<br>
        • ALCE Attribution Precision: 0.941<br>
        • Faithfulness Triad Score: 0.912
      </div>
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 6px; border-radius: 4px; font-size: 6.8pt; color: #065f46; margin-top: 6px;">
        ✔ <strong>Proviso Attachment:</strong> 100% (Structure-Aware Chunker)
      </div>
    </div>
  </div>
</div>

<div class="ui-mock-grid avoid-break">
  <!-- UI Mockup 3: Client Case Portal -->
  <div class="ui-mock-card">
    <div class="ui-mock-header">
      <span>SCREEN 3: Client Case Portal</span>
      <span>user.html</span>
    </div>
    <div class="ui-mock-body">
      <div style="display: flex; justify-content: space-between; font-size: 7.5pt; margin-bottom: 6px;">
        <span><strong>Client:</strong> demouser@legalai.com</span>
        <span style="color: #10b981;">● Active Session</span>
      </div>
      <div style="background: #f1f5f9; padding: 6px; border-radius: 4px; font-size: 7.2pt; margin-bottom: 6px;">
        📅 <strong>Booked Consultation #402:</strong><br>
        With: Mukul Rohatgi, Senior Advocate (Criminal Law)<br>
        Status: <span style="background: #fef3c7; color: #92400e; padding: 1px 4px; border-radius: 2px; font-weight: 600;">CONFIRMED</span>
      </div>
      <div style="background: #eff6ff; padding: 6px; border-radius: 4px; font-size: 7.2pt;">
        ☑️ <strong>Action Checklist:</strong><br>
        [x] Obtain First Information Report (FIR) copy<br>
        [ ] File Anticipatory Bail under BNSS § 482
      </div>
    </div>
  </div>

  <!-- UI Mockup 4: Admin Command Suite -->
  <div class="ui-mock-card">
    <div class="ui-mock-header">
      <span>SCREEN 4: Admin Command Suite</span>
      <span>admin.html</span>
    </div>
    <div class="ui-mock-body">
      <div style="display: flex; gap: 4px; margin-bottom: 6px; font-size: 7.2pt;">
        <div style="flex:1; background: #0f2744; color: #fff; padding: 4px; border-radius: 3px; text-align: center;">Users: 24</div>
        <div style="flex:1; background: #065f46; color: #fff; padding: 4px; border-radius: 3px; text-align: center;">Advocates: 15</div>
        <div style="flex:1; background: #5b21b6; color: #fff; padding: 4px; border-radius: 3px; text-align: center;">Courts: 18</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px; border-radius: 4px; font-size: 7pt; margin-bottom: 5px;">
        ⚙️ <strong>Directory CRUD:</strong> Add/Edit Advocate Bar numbers & Court venues.
      </div>
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px; border-radius: 4px; font-size: 7pt; color: #065f46;">
        ⚡ <strong>AI Telemetry:</strong> Microservice Port 8000 Healthy (Latency: 42ms)
      </div>
    </div>
  </div>
</div>

<!-- ======================================================== -->
<!-- 3. REFERENCES                                            -->
<!-- ======================================================== -->
<div class="page-break"></div>

<h1>3. References</h1>
<ol style="font-size: 9pt; line-height: 1.6;">
  <li><strong>IEEE Computer Society (2009).</strong> <em>IEEE Std 1016-2009: IEEE Standard for Information Technology — Systems Design — Software Design Descriptions</em>. Institute of Electrical and Electronics Engineers, Piscataway, NJ.</li>
  <li><strong>Gao, Y., et al. (2024).</strong> <em>Retrieval-Augmented Generation for Large Language Models: A Survey</em>. arXiv preprint arXiv:2312.10997.</li>
  <li><strong>Gao, T., et al. (2023).</strong> <em>Enabling Large Language Models to Generate Text with Citations via ALCE (Attributed Language for Complex Reasoning)</em>. Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing (EMNLP), pages 6465–6488.</li>
  <li><strong>Ministry of Law and Justice, Government of India (2023).</strong> <em>The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023)</em>. Published in The Gazette of India Extraordinary, Part II—Section 1.</li>
  <li><strong>Ministry of Law and Justice, Government of India (2023).</strong> <em>The Bharatiya Nagarik Suraksha Sanhita, 2023 (Act No. 46 of 2023)</em>. The Gazette of India Extraordinary.</li>
  <li><strong>Johnson, J., Douze, M., & Jégou, H. (2021).</strong> <em>Billion-scale similarity search with GPUs (FAISS library)</em>. IEEE Transactions on Big Data, 7(3), 535–547.</li>
  <li><strong>Pedregosa, F., et al. (2011).</strong> <em>Scikit-learn: Machine Learning in Python</em>. Journal of Machine Learning Research, 12, 2825–2830.</li>
  <li><strong>Cormack, G. V., Clarke, C. L., & Büttcher, S. (2009).</strong> <em>Reciprocal rank fusion outperforms Condorcet and individual rank learning methods</em>. In Proceedings of the 32nd international ACM SIGIR conference on Research and development in information retrieval (pp. 758–759).</li>
  <li><strong>Krippendorff, K. (2018).</strong> <em>Content Analysis: An Introduction to Its Methodology (4th ed.)</em>. SAGE Publications, Thousand Oaks, CA.</li>
  <li><strong>A.J. Institute of Engineering & Technology (AJIET), Mangaluru (2026).</strong> <em>Department of MCA — Project Work Guidelines & Software Design Specification (SDS) Format for ML Projects</em>.</li>
</ol>

<div style="margin-top: 30px; border-top: 2px solid #0f2744; padding-top: 10px; text-align: center; font-size: 8.5pt; color: #64748b;">
  <strong>Department of MCA · A.J. Institute of Engineering & Technology, Mangaluru</strong><br>
  LegalAI — Software Design Specification (SDS) in Academic ML Format · All Rights Reserved
</div>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated Academic ML SDS HTML: {OUTPUT_HTML}")
print(f"File size: {os.path.getsize(OUTPUT_HTML):,} bytes")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

print(f"Rendering PDF via Edge Headless engine ({edge_path})...")

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
    size_bytes = os.path.getsize(OUTPUT_PDF)
    print(f"SUCCESS: Rendered Academic ML SDS PDF at {OUTPUT_PDF}")
    print(f"PDF Size: {size_bytes:,} bytes")
    shutil.copyfile(OUTPUT_PDF, OUTPUT_MIRROR_PDF)
    print(f"Mirrored to: {OUTPUT_MIRROR_PDF}")
else:
    print(f"Edge process exited with code {res.returncode}")
    print(f"Stderr: {res.stderr}")

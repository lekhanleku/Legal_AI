import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_element(name):
    return OxmlElement(name)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='CCCCCC')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'<w:top w:val="{kwargs.get("top", {}).get("val", "single")}" w:sz="{kwargs.get("top", {}).get("sz", "4")}" w:space="0" w:color="{kwargs.get("top", {}).get("color", "D1D5DB")}"/>\n'
        f'<w:left w:val="{kwargs.get("left", {}).get("val", "none")}" w:sz="0" w:space="0" w:color="auto"/>\n'
        f'<w:bottom w:val="{kwargs.get("bottom", {}).get("val", "single")}" w:sz="{kwargs.get("bottom", {}).get("sz", "4")}" w:space="0" w:color="{kwargs.get("bottom", {}).get("color", "D1D5DB")}"/>\n'
        f'<w:right w:val="{kwargs.get("right", {}).get("val", "none")}" w:sz="0" w:space="0" w:color="auto"/>\n'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)

def generate_srs():
    doc = docx.Document()
    
    # Page Setup - 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_font = normal_style.font
    normal_font.name = 'Times New Roman'
    normal_font.size = Pt(11)
    normal_font.color.rgb = RGBColor(0x1F, 0x29, 0x37) # Dark slate/gray
    
    # Helper functions for formatted text
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(18)
        run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(18)
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.color.rgb = RGBColor(0x11, 0x18, 0x27)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11.5)
        run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
        return p

    def add_body_p(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        return p

    def add_bullet(lead_bold, text_rest=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        run1 = p.add_run(lead_bold)
        run1.bold = True
        run1.font.name = 'Times New Roman'
        run1.font.size = Pt(11)
        if text_rest:
            run2 = p.add_run(text_rest)
            run2.font.name = 'Times New Roman'
            run2.font.size = Pt(11)
        return p

    # -------------------------------------------------------------
    # DOCUMENT HEADER / TITLE
    # -------------------------------------------------------------
    add_title("LegalAI: Intelligent Legal Consultation & RAG Advisory Platform")
    add_subtitle("Software Requirements Specification (SRS)")

    # -------------------------------------------------------------
    # 1. INTRODUCTION
    # -------------------------------------------------------------
    add_h1("1. Introduction")
    
    add_h2("1.1 Purpose")
    add_body_p(
        "The purpose of the LegalAI: Intelligent Legal Consultation & RAG Advisory Platform is to provide an "
        "academic and enterprise AI-based legal screening and advisory platform that analyzes natural language "
        "legal inquiries using machine learning models and provides an explainable classification and statutory "
        "retrieval result. The system uses a Supervised Machine Learning classifier (TF-IDF Vectorizer coupled with a "
        "Calibrated Linear Support Vector Classifier - LinearSVC) to predict legal domains (e.g., Landlord & Tenant Law, "
        "Criminal Defense, Corporate Law, Family Law, Employment Law, Civil Rights, Personal Injury, Intellectual Property) "
        "and utilizes feature extraction and class calibration techniques to compute domain prediction probabilities."
    )
    add_body_p(
        "Furthermore, the system incorporates a dense Retrieval-Augmented Generation (RAG) vector index utilizing "
        "FAISS (Facebook AI Similarity Search) and Sentence Transformers (all-MiniLM-L6-v2) to semantically match and "
        "retrieve statutory law chunks, constitutional rights, and procedural action items directly relevant to the user's issue. "
        "The system allows users to register, securely submit legal queries, perform AI-based legal assessments, view prediction "
        "probabilities, access retrieved statutory authorities, browse matched specialist attorneys, and locate jurisdictionally "
        "competent courts. Administrators can monitor system activity, dataset statistics, user consultations, and overall model performance."
    )

    add_h2("1.2 Intended Audience")
    add_body_p("The intended audience includes:")
    add_bullet("Academic project evaluators and viva examiners", " – reviewing software engineering and machine learning rigor.")
    add_bullet("Legal technology practitioners and counselors", " – evaluating automated statutory triage and advisory workflows.")
    add_bullet("Clients and Citizens (End-Users)", " – seeking initial procedural guidance, rights analysis, and specialist lawyer referrals.")
    add_bullet("Practicing Attorneys and Legal Specialists", " – seeking verified platform visibility and relevant client case intake.")
    add_bullet("Machine learning engineers", " – inspecting the NLP classification pipeline, calibration curves, and FAISS vector index.")
    add_bullet("Software developers", " – maintaining the full-stack Node.js/Express, Python/FastAPI, and SQLite architecture.")
    add_bullet("Researchers and academic guides", " – exploring legal informatics and Retrieval-Augmented Generation systems.")

    add_h2("1.3 Scope")
    add_body_p("The system is a full-stack web application supporting three primary user roles:")
    add_bullet("Admin", " – manages legal directories, courts, articles, user accounts, and monitors ML evaluation metrics.")
    add_bullet("Client (End-User)", " – submits legal queries, receives ML-classified guidance, reviews citations, matches lawyers, and saves chat history.")
    add_bullet("Lawyer (Legal Specialist)", " – verified legal practitioner profile exhibiting bar credentials, specialty, rates, and contact details.")
    add_body_p(
        "The system provides user authentication, role-based access, client query intake and validation, text preprocessing "
        "(n-gram extraction, sublinear TF-IDF), Calibrated LinearSVC classification, prediction probability estimation, "
        "FAISS dense vector semantic retrieval, statutory citation and rights extraction, intelligent lawyer recommendations, "
        "competent court routing, consultation history tracking, legal article knowledge repository, dataset management, and audit logging. "
        "The system explicitly provides legal informational guidance and screening and does not claim to replace formal licensed legal counsel or establish an attorney-client relationship."
    )

    add_h2("1.4 References")
    add_bullet("Project specification: ", "LegalAI Intelligent Legal Consultation, Case Assessment & RAG Platform.")
    add_bullet("Scikit-learn documentation: ", "Supervised Learning, TfidfVectorizer, LinearSVC, and CalibratedClassifierCV.")
    add_bullet("FAISS documentation: ", "Facebook AI Similarity Search - Dense Vector Clustering and IndexFlatIP cosine similarity.")
    add_bullet("Sentence-Transformers documentation: ", "all-MiniLM-L6-v2 deep sentence embeddings.")
    add_bullet("Node.js & Express.js documentation: ", "RESTful API design and middleware pipelines.")
    add_bullet("FastAPI documentation: ", "High-performance Python asynchronous API microservices.")
    add_bullet("SQLite & better-sqlite3 documentation: ", "Embedded ACID-compliant relational database.")
    add_bullet("Chart.js / Front-End Web Standards: ", "HTML5, CSS3, ES6+ Javascript, and interactive UI charts.")

    # -------------------------------------------------------------
    # 2. OVERALL DESCRIPTION
    # -------------------------------------------------------------
    add_h1("2. Overall Description")

    add_h2("2.1 Product Perspective")
    add_body_p(
        "The system is a full-stack web application using HTML5, CSS3, and JavaScript for the frontend and a "
        "Node.js/Express server paired with a Python FastAPI microservice for the backend. SQLite is used for "
        "persistent structured data storage via better-sqlite3."
    )
    add_body_p(
        "Scikit-learn is used for machine learning. A Calibrated Linear Support Vector Classifier (LinearSVC) with "
        "TF-IDF unigrams and bigrams is used as the primary domain classification model. FAISS (Facebook AI Similarity Search) "
        "paired with SentenceTransformer ('all-MiniLM-L6-v2') dense embeddings is used for Retrieval-Augmented Generation (RAG). "
        "Pandas and NumPy are used for dataset preprocessing, token normalization, and vector matrix operations. Class probabilities "
        "and top-K cosine similarity scores are computed to provide explainable statutory citations and legal rights to the client."
    )
    add_body_p(
        "The frontend communicates with the Node.js backend through HTTP requests and RESTful APIs on port 5000. "
        "The Node.js backend handles authentication, user accounts, lawyer and court directories, chat records, and proxies "
        "inquiries to the Python ML microservice on port 8000. If the Python microservice is offline, an integrated deterministic "
        "legal reasoning engine provides automated fallback to ensure uninterrupted service."
    )

    add_h2("2.2 Product Functions")
    add_body_p("The system shall provide:")
    add_bullet("User authentication and role-based access", " (Admin, Client, and Lawyer).")
    add_bullet("User registration and profile management", " with secure JWT tokens and encrypted credentials.")
    add_bullet("Natural language legal query submission", " with real-time input sanitation and validation.")
    add_bullet("Machine learning-based legal domain classification", " (e.g., Tenant, Criminal, Corporate, Family, Employment, IP).")
    add_bullet("Class probability and confidence score calculation", " via calibrated probability distribution.")
    add_bullet("Semantic statutory retrieval (RAG)", " using FAISS dense vector search over the legal knowledge corpus.")
    add_bullet("Citizen rights and procedural action item generation", " tailored to the specific legal dilemma.")
    add_bullet("Intelligent specialist attorney matching", " connecting clients to top-rated verified practitioners.")
    add_bullet("Jurisdictional court recommendation", " identifying competent district, municipal, or federal courts.")
    add_bullet("Searchable directory of verified attorneys", " with rates, ratings, bar numbers, and success rates.")
    add_bullet("Comprehensive court locator", " with jurisdiction scope, filing system URLs, and address details.")
    add_bullet("Searchable legal article library", " providing deep-dive procedural guides and legal summaries.")
    add_bullet("Consultation history tracking and persistent SQLite chat storage.")
    add_bullet("Automated fallback legal reasoning engine", " guaranteeing 99.9% uptime during service disruptions.")
    add_bullet("Admin dashboard", " for system monitoring, user administration, dataset statistics, and ML evaluation.")

    add_h2("2.3 User Classes and Characteristics")
    add_body_p("Admin:")
    add_body_p(
        "The Admin manages the overall system, directories, and data integrity. The Admin can securely log in, view "
        "registered users and lawyers, add or update court records, publish legal articles, and monitor machine learning "
        "performance metrics such as Accuracy, Precision, Recall, and 5-Fold Cross-Validation scores. The Admin can also view "
        "dataset statistics, inspect system activities, and access audit logs. The Admin does not submit personal legal inquiries."
    )
    add_body_p("Client (End-User):")
    add_body_p(
        "The Client uses the system for legal self-assessment, guidance, and attorney discovery. The Client can securely "
        "log in, manage their profile, submit natural language legal inquiries, and view AI classification results, prediction "
        "confidence percentages, and retrieved statutory sources. The Client can also review recommended actions, explore matched "
        "attorneys, find filing courts, read legal articles, and review past consultation history. Clients cannot access other clients' "
        "conversations, modify system datasets, or view administrative dashboards."
    )
    add_body_p("Lawyer (Specialist):")
    add_body_p(
        "The Lawyer is a verified legal practitioner featured in the platform's professional directory. The profile exhibits "
        "bar admission numbers, practice domains, law firm affiliations, hourly rates, client satisfaction ratings, and case success "
        "rates. Lawyers receive targeted client matches based on the ML domain classification."
    )

    add_h2("2.4 Operating Environment")
    add_bullet("Frontend: ", "HTML5, CSS3 (Modern Glassmorphic Design System), JavaScript (ES6+), FontAwesome Icons")
    add_bullet("Backend: ", "Node.js (v18+), Express.js")
    add_bullet("ML Microservice: ", "Python (v3.10+), FastAPI, Uvicorn")
    add_bullet("Database: ", "SQLite 3 (via better-sqlite3 with Write-Ahead Logging)")
    add_bullet("Machine Learning: ", "Scikit-learn (LinearSVC, CalibratedClassifierCV, TfidfVectorizer), FAISS-CPU")
    add_bullet("NLP & Embeddings: ", "Sentence-Transformers (all-MiniLM-L6-v2), NumPy, Pandas, Joblib")
    add_bullet("Authentication: ", "JSON Web Tokens (JWT) & bcryptjs password encryption")
    add_bullet("Deployment: ", "Windows 10/11, Linux, macOS")

    add_h2("2.5 Design and Implementation Constraints")
    add_bullet("Relational Storage: ", "The system shall use SQLite as the relational database for self-contained, zero-configuration local deployment.")
    add_bullet("Password Hashing: ", "Passwords shall never be stored as plain text and must be encrypted using bcrypt with a minimum of 10 salt rounds.")
    add_bullet("Authentication & Access: ", "All protected routes and REST APIs shall require valid JWT authorization headers.")
    add_bullet("Role-Based Authorization: ", "RBAC shall be enforced on the backend to prevent unauthorized access to administrative or private endpoints.")
    add_bullet("Data Privacy: ", "Clients shall only access their own legal consultation and chat history.")
    add_bullet("Dual-Engine Availability: ", "The Node.js backend must implement an internal rule-based fallback to preserve service if the ML server is unreachable.")
    add_bullet("Legal Ethics Compliance: ", "The system must clearly display non-representation disclaimers to prevent unauthorized practice of law (UPL) liability.")

    add_h2("2.6 Assumptions and Dependencies")
    add_bullet("Runtime Environment: ", "Node.js (>= 18.0) and Python (>= 3.10) with installed dependencies are available on the hosting system.")
    add_bullet("Prepared Legal Dataset: ", "A domain-specific dataset (legal_queries.csv) and statutory corpus (legal_corpus.json) are provided for model training.")
    add_bullet("Pre-Trained Models: ", "The system requires serialized model artifacts (legal_classifier.pkl and faiss_index.bin) generated by train.py for real-time inference.")
    add_bullet("Fallback Readiness: ", "If pre-trained ML models are not compiled or active, the platform gracefully switches to internal legal heuristics.")
    add_bullet("Optional LLM Connectivity: ", "External cloud LLMs (OpenAI-compatible APIs) are optional and require network access; core ML and RAG operate completely offline.")

    # -------------------------------------------------------------
    # 3. SPECIFIC REQUIREMENTS
    # -------------------------------------------------------------
    add_h1("3. Specific Requirements")

    add_h2("3.1 Data Requirements")
    add_body_p("The system shall store and process the following structured information in SQLite:")
    add_bullet("User Account Information: ", "User ID, full name, email address, password hash, role (Client, Lawyer, Admin), and creation timestamp.")
    add_bullet("Lawyer Records: ", "Lawyer ID, name, professional title, specialty, bar registration number, years in practice, firm name, city, state, hourly rate, rating, review count, avatar URL, cases won, and success rate.")
    add_bullet("Court Jurisdiction Data: ", "Court ID, unique court code, name, jurisdiction level, division, address, city, state, electronic filing system, and official website URL.")
    add_bullet("Legal Knowledge Corpus: ", "Statutory ID, statute title, domain category, legal citation, statutory text, key elements, guaranteed rights, and procedural action steps.")
    add_bullet("AI Consultation History: ", "Chat ID, user ID, role (user/assistant), message content, classified domain, ML confidence score, retrieved source citations, and timestamp.")
    add_bullet("Legal Articles & Publications: ", "Article ID, title, domain category, estimated reading time, summary excerpt, detailed markdown content, statutory citations, and author.")
    add_bullet("Model Evaluation Metrics: ", "Model name, test accuracy score, 5-fold cross-validation scores, sample counts, category labels, and classification report parameters.")
    add_bullet("Audit & Activity Logs: ", "Log ID, user ID, IP address, action performed, target resource, status code, and timestamp.")

    add_h2("3.2 Functional Requirements")
    add_bullet("User Authentication (FR-01): ", "Secure user registration, login, and logout with bcrypt password hashing and stateless JWT token issuance.")
    add_bullet("Admin Management (FR-02): ", "Admin can view registered users, lawyers, courts, articles, dataset records, and monitor model accuracy metrics.")
    add_bullet("Client Profile Management (FR-03): ", "Clients can register, manage profile information, review consultation activity, and obtain a unique User ID.")
    add_bullet("Legal Query Submission (FR-04): ", "Clients can input natural language legal problems. The system sanitizes, validates, and routes the query for NLP analysis.")
    add_bullet("ML Domain Classification (FR-05): ", "The system classifies the legal query into appropriate domains (Tenant, Criminal, Corporate, Family, etc.) using the trained LinearSVC model.")
    add_bullet("Calibrated Probability Estimation (FR-06): ", "The system computes calibrated probability percentages representing the model's confidence in the classified domain.")
    add_bullet("RAG Statutory Retrieval (FR-07): ", "The FAISS vector index retrieves top-K statutory provisions, citing legal codes, citizen rights, and recommended evidence checklists.")
    add_bullet("Attorney Specialist Matching (FR-08): ", "The system matches the user with the highest-rated verified attorney specializing in the predicted legal category.")
    add_bullet("Court Jurisdiction Routing (FR-09): ", "The system identifies the court of competent subject-matter and territorial jurisdiction and supplies e-filing portal links.")
    add_bullet("Directory Search & Filtering (FR-10): ", "Users can search and filter the verified lawyer directory and court locator by location, domain, and experience.")
    add_bullet("Legal Knowledge Repository (FR-11): ", "Users can browse and read comprehensive legal articles covering constitutional rights, corporate filings, and tenant protections.")
    add_bullet("Consultation History Tracking (FR-12): ", "Clients can view prior legal consultation transcripts and review previously cited statutory sections.")
    add_bullet("High-Availability Fallback (FR-13): ", "If the Python microservice is unavailable, the backend automatically engages an internal rule-based legal engine.")
    add_bullet("Error Handling & Validation (FR-14): ", "The system validates all inputs, handles invalid queries, and displays user-friendly error messages.")

    add_h2("3.3 Performance and ML Quality Requirements")
    add_bullet("Fast Response: ", "Standard REST API endpoints (authentication, lawyer lookup, articles) shall respond within 300 milliseconds.")
    add_bullet("Prediction Latency: ", "The system shall perform ML domain classification and FAISS vector retrieval, returning full advice within 1.5 seconds.")
    add_bullet("ML Model Standard: ", "The system shall employ a Calibrated LinearSVC pipeline with TF-IDF n-grams (1, 2) achieving ≥ 90% test accuracy.")
    add_bullet("Model Metrics Transparency: ", "The Admin dashboard shall report Accuracy, 5-Fold Cross-Validation, Precision, Recall, and F1-Scores.")
    add_bullet("Consistent Preprocessing: ", "Runtime text normalization, sublinear TF scaling, and vector normalization must strictly match training specifications.")
    add_bullet("Reliable Results: ", "Identical legal inquiries shall produce deterministic and consistent domain classifications and vector retrieval rankings.")
    add_bullet("Legal Screening Disclaimer: ", "All AI-generated recommendations shall explicitly feature a disclaimer stating the output is an informational screening and not formal legal counsel.")

    add_h2("3.4 External Interface Requirements")
    add_bullet("User Interface: ", "The system shall provide a responsive, accessible web interface crafted in HTML5, CSS3, and JavaScript, compatible with modern web browsers.")
    add_bullet("Data Visualization: ", "The interface shall display dynamic visual indicators, confidence gauges, and status badges for classification results.")
    add_bullet("Backend API Interface: ", "Node.js Express endpoints (/api/auth, /api/ai, /api/lawyers, /api/courts, /api/articles) handle structured JSON communication.")
    add_bullet("ML Microservice Interface: ", "Python FastAPI endpoints (/api/ml/predict, /api/rag/query, /api/ml/health) handle NLP inference and vector search.")
    add_bullet("Database Interface: ", "SQLite relational database managed through better-sqlite3 with prepared parameterized queries.")

    add_h2("3.5 Security and Safety Requirements")
    add_bullet("Secure Authentication: ", "The system shall hash passwords using bcrypt with a minimum work factor of 10 rounds.")
    add_bullet("Role-Based Access Control: ", "System endpoints shall be strictly gated according to Admin, Client, and Lawyer roles.")
    add_bullet("Client Privacy & Data Isolation: ", "Clients shall access only their own consultation records, personal queries, and saved history.")
    add_bullet("Input Validation & Sanitation: ", "All user submissions shall be validated against length bounds and injection vectors to prevent XSS and SQL injection attacks.")
    add_bullet("Parameterized Queries: ", "All SQLite operations shall utilize parameterized statements to prevent SQL injection vulnerabilities.")
    add_bullet("Secure Environment Configuration: ", "Cryptographic secrets, JWT tokens, and system ports shall be managed through protected environment variables (.env).")
    add_bullet("Legal Ethics & Safety Disclaimer: ", "The system shall clearly display an ethical disclaimer confirming that AI outputs do not establish an attorney-client relationship.")

    # -------------------------------------------------------------
    # 4. APPENDICES
    # -------------------------------------------------------------
    add_h1("4. Appendices")

    add_h2("4.1 Glossary")
    add_bullet("AI (Artificial Intelligence): ", "Systems programmed to perform tasks typically requiring human intelligence and analytical reasoning.")
    add_bullet("Machine Learning (ML): ", "Computational methods enabling systems to recognize patterns and make decisions from data without explicit manual programming.")
    add_bullet("Natural Language Processing (NLP): ", "A field of AI focused on enabling computers to understand, interpret, and process human language.")
    add_bullet("TF-IDF (Term Frequency-Inverse Document Frequency): ", "A numerical statistic that reflects how important a word or n-gram is to a document in a collection or corpus.")
    add_bullet("LinearSVC: ", "Linear Support Vector Classification, a high-performance supervised learning model well-suited for high-dimensional text classification.")
    add_bullet("Calibrated Classifier: ", "A model wrapper (CalibratedClassifierCV) that maps raw classifier decision functions to well-calibrated posterior probabilities.")
    add_bullet("RAG (Retrieval-Augmented Generation): ", "An architecture that enhances AI responses by retrieving relevant factual documents from a vector knowledge corpus.")
    add_bullet("FAISS (Facebook AI Similarity Search): ", "A high-performance library for efficient similarity search and clustering of dense vector representations.")
    add_bullet("Dense Vector Embeddings: ", "Continuous numerical vector representations of text where semantic similarity corresponds to geometric proximity.")
    add_bullet("Confidence Score: ", "The probability or certainty percentage assigned by the machine learning model to a predicted legal domain.")
    add_bullet("RBAC (Role-Based Access Control): ", "A security mechanism restricting system resource access based on assigned user roles (Admin, Client, Lawyer).")
    add_bullet("JWT (JSON Web Token): ", "A compact, URL-safe means of representing claims securely between two parties for stateless web authentication.")
    add_bullet("UPL (Unauthorized Practice of Law): ", "The prohibited practice of offering formal legal advice or representation without a valid jurisdiction license; mitigated via disclaimer banners.")

    output_path = r"c:\Users\lenovo\OneDrive\Desktop\LegalAI\LegalAI_Software_Requirements_Specification_SRS.docx"
    doc.save(output_path)
    print(f"Successfully generated SRS Word document at: {output_path}")

if __name__ == "__main__":
    generate_srs()

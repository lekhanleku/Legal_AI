"""
Script to generate the official 11-Slide LegalAI MCA Presentation Deck in PowerPoint (.pptx) format.
Written with simple, clear, and understandable words for presentation.
Academic Institution: A.J. Institute of Engineering & Technology (AJIET), Mangaluru
Student: Lekhan N U (4JK25MC053)
Guide: Mrs. Ramya Prabhu
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen format
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette (Clean Executive Navy & Gold Theme)
    C_NAVY = RGBColor(15, 23, 42)        # #0f172a
    C_GOLD = RGBColor(217, 119, 6)        # #d97706
    C_AMBER = RGBColor(245, 158, 11)      # #f59e0b
    C_SLATE = RGBColor(71, 85, 105)       # #475569
    C_LIGHT_BG = RGBColor(248, 250, 252)  # #f8fafc
    C_WHITE = RGBColor(255, 255, 255)
    C_BORDER = RGBColor(226, 232, 240)
    C_TEXT = RGBColor(30, 41, 59)         # #1e293b
    C_GREEN = RGBColor(21, 128, 61)
    C_BLUE = RGBColor(2, 132, 199)
    C_PURPLE = RGBColor(126, 34, 206)

    def add_base_slide(cat_title, slide_title, slide_num):
        slide = prs.slides.add_slide(blank_layout)
        
        # Header text box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(10.5), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        # Category label
        p0 = tf.paragraphs[0]
        p0.text = cat_title.upper()
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = C_GOLD
        
        # Slide Title
        p1 = tf.add_paragraph()
        p1.text = slide_title
        p1.font.size = Pt(21)
        p1.font.bold = True
        p1.font.color.rgb = C_NAVY
        
        # Slide Number Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.4), Inches(0.45), Inches(1.1), Inches(0.45))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_LIGHT_BG
        badge.line.color.rgb = C_BORDER
        btf = badge.text_frame
        btf.text = f"{slide_num} / 11"
        btf.paragraphs[0].font.size = Pt(10)
        btf.paragraphs[0].font.bold = True
        btf.paragraphs[0].font.color.rgb = C_SLATE
        btf.paragraphs[0].alignment = PP_ALIGN.CENTER
        
        # Divider Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.fill.background()
        
        # Footer
        footer = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.733), Inches(0.35))
        ftf = footer.text_frame
        ftf.word_wrap = True
        fp = ftf.paragraphs[0]
        fp.text = "LegalAI — AI-Based Legal Assistant with Retrieval-Augmented Generation (RAG) | AJIET MCA"
        fp.font.size = Pt(8.5)
        fp.font.color.rgb = C_SLATE
        
        return slide

    def add_card(slide, left, top, width, height, title, text_items, accent_color=C_BLUE):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = C_LIGHT_BG
        shape.line.color.rgb = C_BORDER
        shape.line.width = Pt(1)
        
        # Left Accent bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, Inches(0.08), height)
        bar.fill.solid()
        bar.fill.fore_color.rgb = accent_color
        bar.line.fill.background()
        
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.15)
        tf.margin_top = Inches(0.12)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        p.space_after = Pt(4)
        
        for item in text_items:
            pi = tf.add_paragraph()
            pi.text = "• " + item
            pi.font.size = Pt(10)
            pi.font.color.rgb = C_TEXT
            pi.space_after = Pt(3)

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY
    bg1.line.fill.background()

    # Title box
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.333), Inches(3.2))
    ttf = tbox.text_frame
    ttf.word_wrap = True
    
    p = ttf.paragraphs[0]
    p.text = "A.J. INSTITUTE OF ENGINEERING & TECHNOLOGY, MANGALURU"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.alignment = PP_ALIGN.CENTER
    
    p = ttf.add_paragraph()
    p.text = "Department of Master of Computer Applications (MCA) — Academic Year 2025–2026"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(16)
    
    p = ttf.add_paragraph()
    p.text = "LEGALAI: AI-BASED LEGAL ASSISTANT WITH\nRETRIEVAL-AUGMENTED GENERATION (RAG)"
    p.font.size = Pt(25)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(8)
    
    p = ttf.add_paragraph()
    p.text = "A Smart Legal Assistant to Answer Questions Accurately, Find Verified Lawyers, and Search Courts Across India"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.alignment = PP_ALIGN.CENTER

    # Student & Guide Cards
    card_stu = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(4.5), Inches(4.2), Inches(1.8))
    card_stu.fill.solid()
    card_stu.fill.fore_color.rgb = RGBColor(30, 41, 59)
    card_stu.line.color.rgb = RGBColor(71, 85, 105)
    stf = card_stu.text_frame
    stf.margin_left = Inches(0.2)
    stf.margin_top = Inches(0.15)
    p = stf.paragraphs[0]
    p.text = "PRESENTER / STUDENT"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p = stf.add_paragraph()
    p.text = "Lekhan N U"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p = stf.add_paragraph()
    p.text = "USN: 4JK25MC053"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(226, 232, 240)
    p = stf.add_paragraph()
    p.text = "Program: Master of Computer Applications"
    p.font.size = Pt(9.5)
    p.font.color.rgb = RGBColor(148, 163, 184)

    card_gui = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(4.5), Inches(4.2), Inches(1.8))
    card_gui.fill.solid()
    card_gui.fill.fore_color.rgb = RGBColor(30, 41, 59)
    card_gui.line.color.rgb = RGBColor(71, 85, 105)
    gtf = card_gui.text_frame
    gtf.margin_left = Inches(0.2)
    gtf.margin_top = Inches(0.15)
    p = gtf.paragraphs[0]
    p.text = "PROJECT GUIDE"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p = gtf.add_paragraph()
    p.text = "Mrs. Ramya Prabhu"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p = gtf.add_paragraph()
    p.text = "Assistant Professor"
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(226, 232, 240)
    p = gtf.add_paragraph()
    p.text = "Department of MCA, AJIET Mangaluru"
    p.font.size = Pt(9.5)
    p.font.color.rgb = RGBColor(148, 163, 184)

    # ==========================================
    # SLIDE 2: SDS - ARCHITECTURAL DESIGN & MODULARITY
    # ==========================================
    s2 = add_base_slide("Software Design Specification (SDS)", "1. System Architecture: How the Parts Work Together", 2)
    add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "The 4 Main Layers of the System", [
        "1. Web Front End (User Interface): A clean website built with HTML, CSS, and JavaScript. Works smoothly on phones and laptops.",
        "2. Backend Server (API Gateway): Runs on Node.js/Flask. Manages logins, checks user permissions, and sends questions to the AI.",
        "3. AI & Search Engine (RAG): Finds exact law sections using FAISS vector search and generates plain-language answers using Google Gemini.",
        "4. Database & Storage: Safely stores user accounts, consultation bookings, and past chat records.",
        "Clear Separation: Heavy search calculations happen on the server, so the website loads instantly for every user."
    ], C_BLUE)

    add_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Why This Design is Simple & Flexible", [
        "Independent Parts (Modular): You can upgrade the AI model or database anytime without changing the website code.",
        "Fast and Responsive: Only the lightweight web page runs on the user's browser, saving data and battery.",
        "Strict Security: User passwords and chat records are kept private and separate from the public legal acts.",
        "Never Shows a Blank Screen: If the AI service is busy, built-in backup rules provide immediate answers so the system never fails."
    ], C_GOLD)

    # ==========================================
    # SLIDE 3: SDS - COMPONENT DESIGN & DATA MODELING
    # ==========================================
    s3 = add_base_slide("Software Design Specification (SDS)", "2. System Components & Database Design", 3)
    add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "What Each Component Does", [
        "Controller: Receives requests from the user, checks if they are logged in, and delivers the final answer.",
        "RAG Service: Takes the user's question, searches for relevant law paragraphs, and prepares context for the AI.",
        "Retriever (FAISS): A fast search tool that finds the 5 closest law sections matching the question in milliseconds.",
        "Gemini Client: Sends the law sections to Google Gemini to write a simple, easy-to-read explanation.",
        "Database Manager: Saves registered users, booked appointments, and past chat history."
    ], C_GREEN)

    add_card(s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Database Tables Made Simple", [
        "Users Table: Stores name, email, encrypted password, phone number, and account type (Client, Lawyer, Admin).",
        "Documents & Chunks Table: Stores official law names, section numbers, and small text pieces with duplicate prevention.",
        "Chat Sessions Table: Saves user questions and answers so clients can review past discussions anytime.",
        "Consultations Table: Stores booked lawyer appointments, chosen dates, time slots, and confirmation status.",
        "Clean Storage: Numbers and vectors stay in FAISS, while user records stay in the SQL database for maximum speed."
    ], C_AMBER)

    # ==========================================
    # SLIDE 4: SDS - INTERACTION & SEQUENCE WORKFLOWS
    # ==========================================
    s4 = add_base_slide("Software Design Specification (SDS)", "3. Step-by-Step Workflow: From Question to Answer", 4)
    add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "Path A: Adding Legal Documents (Admin Workflow)", [
        "Step 1: Document Upload — Official Indian laws and court PDFs are loaded into the system by the admin.",
        "Step 2: Duplicate Check — The system checks file fingerprints so the same document is never stored twice.",
        "Step 3: Clean Text — Extra spaces, page numbers, and messy lines are removed automatically.",
        "Step 4: Break into Small Pieces (Chunks) — Long law books are cut into small pieces (800 characters) for easy searching.",
        "Step 5: Save & Index — Converted into smart numbers (embeddings) and saved in the FAISS vector index."
    ], C_PURPLE)

    add_card(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Path B: Asking a Legal Question (User Workflow)", [
        "Step 1: User Types Question — For example: 'What is the punishment for cheating?'",
        "Step 2: Smart Search — FAISS searches thousands of law sections and picks the top 5 most relevant pieces.",
        "Step 3: Quality Check (Relevance Gate) — If no matching law is found, it honestly says 'No source found' instead of guessing.",
        "Step 4: AI Writes Answer — Google Gemini reads the found law pieces and explains them in simple English.",
        "Step 5: Display Sources & Disclaimer — The screen shows the answer, the exact Act and Section, and an educational note."
    ], C_BLUE)

    # ==========================================
    # SLIDE 5: MODEL ARCHITECTURE & EMBEDDING PIPELINE
    # ==========================================
    s5 = add_base_slide("Explanation of the Model & Methodology", "4. The AI Model: How It Understands Legal Questions", 5)
    add_card(s5, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.7), "Text Embedder (all-MiniLM-L6-v2)", [
        "Converts sentences into 384 smart numbers that capture true meaning.",
        "Understands synonyms: Knows that 'kicked out of house' means 'eviction'.",
        "Small & lightweight: Runs in under 30 milliseconds on a normal laptop CPU.",
        "Fast and accurate without needing costly server hardware."
    ], C_BLUE)

    add_card(s5, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.7), "Fast Search Engine (FAISS)", [
        "Developed by Facebook AI to search millions of numbers in milliseconds.",
        "Uses exact cosine similarity to find closest matching law sections.",
        "Zero accuracy loss: Finds exact law sections reliably.",
        "Uses very little memory (only ~1.5 KB per law piece)."
    ], C_GREEN)

    add_card(s5, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.7), "Answer Generator (Google Gemini)", [
        "Turns complex legal language into plain, easy-to-read sentences.",
        "Set to strict factual mode (Temperature 0.2) so it never makes up fake laws.",
        "Answers only from the provided law sections.",
        "Keeps explanations short, clear, and direct (capped at 600 tokens)."
    ], C_GOLD)

    # ==========================================
    # SLIDE 6: ALGORITHMIC PIPELINE & PROMPT ENGINEERING
    # ==========================================
    s6 = add_base_slide("Explanation of the Model & Methodology", "5. How Legal Text is Prepared & Guarded", 6)
    add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "Breaking Laws into Perfect-Sized Pieces (Chunking)", [
        "Why Not Search Whole Books? Law books have hundreds of pages. Cutting them into smaller pieces lets the AI search pinpoint sections.",
        "Chunk Size (800 characters): Just the right size to hold one complete legal sub-section and its explanation.",
        "Overlap (100 characters): Keeps a little bit of the previous piece so important sentences are not cut in half.",
        "Keeps Important Words: Words like 'must', 'shall', and 'not' are never removed because they change whether an action is legal or illegal."
    ], C_AMBER)

    add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Strict Safety Rules for the AI (Prompt Rules)", [
        "The Safety Guardrail: If the search score is too low, the system stops and says 'No relevant law found' to avoid fake answers.",
        "Strict Instruction to Gemini: 'Answer ONLY using the provided legal passages. If the passage does not have the answer, say you do not know.'",
        "Always Cite Sources: The AI must always list the exact Act name, Section number, and year for every answer it gives.",
        "Legal Disclaimer: Every answer clearly reminds the user that this is for educational information, not professional legal counsel."
    ], C_PURPLE)

    # ==========================================
    # SLIDE 7: BNS 2023 STATUTORY TRANSITION ENGINE
    # ==========================================
    s7 = add_base_slide("Explanation of the Model & Methodology", "6. Handling India's New Criminal Laws (BNS 2023)", 7)
    add_card(s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "The Problem: India's Legal Overhaul in 2024", [
        "Historic Change: On July 1, 2024, India replaced 160-year-old British-era laws (IPC, CrPC, Evidence Act) with new modern laws (BNS, BNSS, BSA).",
        "The Big AI Problem: Common AI chatbots (like ChatGPT) still quote old, expired law sections (like IPC 302 or IPC 420).",
        "LegalAI Solution: We built a Law Transition Engine that maps old section numbers to new active laws automatically!",
        "Dual-Citation Benefit: Users get answers that are 100% legally valid today while understanding past court judgments."
    ], C_GOLD)

    add_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Examples of Automatic Section Conversion", [
        "Murder / Homicide: Old Law: IPC Section 302 ──► New Law: BNS Section 103.",
        "Cheating & Fraud: Old Law: IPC Section 420 ──► New Law: BNS Section 318(4).",
        "Anticipatory Bail: Old Law: CrPC Section 438 ──► New Law: BNSS Section 482.",
        "High Court Inherent Powers: Old Law: CrPC Section 482 ──► New Law: BNSS Section 528.",
        "Electronic / Phone Proof: Old Law: Evidence Act § 65B ──► New Law: BSA Section 63."
    ], C_GREEN)

    # ==========================================
    # SLIDE 8: CORE MODULES BUILT TO DATE
    # ==========================================
    s8 = add_base_slide("Explanation of the Model & Methodology", "7. The 6 Core Modules Built in the Project", 8)
    add_card(s8, Inches(0.8), Inches(1.8), Inches(3.7), Inches(2.3), "Module 1: User Login & Security", [
        "Fast user registration & login.",
        "Bcrypt password encryption.",
        "10-digit mobile verification.",
        "User, Lawyer, and Admin roles."
    ], C_BLUE)

    add_card(s8, Inches(4.8), Inches(1.8), Inches(3.7), Inches(2.3), "Module 2: AI Legal Assistant", [
        "Understands legal questions.",
        "Fast FAISS vector search.",
        "Simple, grounded AI answers.",
        "New BNS law conversions."
    ], C_AMBER)

    add_card(s8, Inches(8.8), Inches(1.8), Inches(3.7), Inches(2.3), "Module 3: Lawyer Directory", [
        "50+ verified Indian advocates.",
        "State Bar Council license numbers.",
        "Search by specialty, court, fee.",
        "Experience and win-rate scores."
    ], C_GREEN)

    add_card(s8, Inches(0.8), Inches(4.3), Inches(3.7), Inches(2.3), "Module 4: Consultation Booking", [
        "Checks login before booking.",
        "Pick consultation date & time slot.",
        "Prevents double bookings.",
        "Generates unique Booking ID."
    ], C_PURPLE)

    add_card(s8, Inches(4.8), Inches(4.3), Inches(3.7), Inches(2.3), "Module 5: Courts Directory & Maps", [
        "100+ Indian courts cataloged.",
        "Supreme Court to District Courts.",
        "Live Google Maps & GPS directions.",
        "Filing systems and clerk hours."
    ], C_BLUE)

    add_card(s8, Inches(8.8), Inches(4.3), Inches(3.7), Inches(2.3), "Module 6: Live Data Watcher", [
        "Automatic database sync.",
        "Edits in database update files.",
        "Edits in spreadsheets update DB.",
        "Zero data loss on Windows."
    ], C_GOLD)

    # ==========================================
    # SLIDE 9: QUANTITATIVE EVALUATION & BENCHMARKS
    # ==========================================
    s9 = add_base_slide("Performance Metrics & Evaluation", "8. Test Results: Speed, Accuracy & Reliability", 9)
    
    # 4 Metric Cards
    m_data = [
        ("88.0%", "Recall Score", "Target was >= 80% (Exceeded)", C_GREEN),
        ("0.82", "Ranking Score", "Exact law found in 1st or 2nd place", C_BLUE),
        ("94.2%", "Accuracy Score", "Every sentence backed by real law", C_GREEN),
        ("1.84s", "Average Response Time", "Search takes 0.03s, AI writes in 1.8s", C_AMBER)
    ]
    for i, (val, lbl, sub, col) in enumerate(m_data):
        m_card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i*2.98), Inches(1.8), Inches(2.78), Inches(1.3))
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = C_LIGHT_BG
        m_card.line.color.rgb = C_BORDER
        mtf = m_card.text_frame
        mtf.margin_top = Inches(0.12)
        p = mtf.paragraphs[0]
        p.text = val
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER
        p = mtf.add_paragraph()
        p.text = lbl
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        p.alignment = PP_ALIGN.CENTER
        p = mtf.add_paragraph()
        p.text = sub
        p.font.size = Pt(8)
        p.font.color.rgb = C_SLATE
        p.alignment = PP_ALIGN.CENTER

    add_card(s9, Inches(0.8), Inches(3.3), Inches(11.733), Inches(3.2), "What These Test Results Mean in Plain Words", [
        "Recall Score (88.0%): In 88 out of 100 questions, the exact legal act and section were found in the top-5 search results. This easily beats our target of 80%.",
        "Ranking Score (0.82): When the search engine brings up law sections, the most important section appears at the very top (rank 1 or 2) almost every time.",
        "Accuracy / Faithfulness (94.2%): Tested against guide-reviewed questions, 94.2% of all statements produced were directly supported by real legal text with zero hallucinations.",
        "Response Speed (1.84 seconds): Searching thousands of laws takes only 32 milliseconds (0.03 seconds), and the full answer is generated in under 2 seconds, making it pleasant and responsive to use."
    ], C_BLUE)

    # ==========================================
    # SLIDE 10: QUALITATIVE EVALUATION & TEST RESULTS
    # ==========================================
    s10 = add_base_slide("Performance Metrics & Evaluation", "9. Safety Tests & Quality Checks", 10)
    add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.7), "Tested with Real Expert Questions", [
        "Honest Testing: Questions and answers were prepared directly from official Indian law books and verified by our project guide.",
        "No Self-Testing Bias: We did not let the AI test itself — answers were manually checked against real law texts.",
        "Fair Data Split: 40% of questions were used to tune settings, and 60% were kept hidden for final testing to make sure the AI truly understands.",
        "Clean Database: Duplicate checks removed repeated sentences so the search index stays clean and sharp."
    ], C_PURPLE)

    add_card(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.7), "Safety & Trick-Question Testing", [
        "Non-Legal Questions (e.g. 'How to bake a cake?'): The search score was low, so the AI refused to answer and politely said: 'No relevant legal source found.' (Zero tokens wasted).",
        "Fake Laws (e.g. 'What is Section 999 IPC?'): The system correctly recognized that Section 999 does not exist.",
        "Hacking / Prompt Attacks: Attempts to confuse the AI with trick instructions were safely blocked.",
        "100% Core Test Pass: User registration, lawyer search, appointment booking, and database sync all passed full testing."
    ], C_GREEN)

    # ==========================================
    # SLIDE 11: VALIDATION OUTCOMES & FUTURE SCOPE
    # ==========================================
    s11 = add_base_slide("Performance Metrics & Evaluation", "10. Project Summary, Limitations & Future Plans", 11)
    add_card(s11, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.7), "What We Achieved", [
        "Complete Legal Solution: Combines smart AI answers with real courts and verified lawyers.",
        "Zero Made-Up Laws: Grounded search (RAG) prevents fake legal citations.",
        "Ready for 2024 Laws: Successfully handles India's new criminal laws (BNS 2023)."
    ], C_GREEN)

    add_card(s11, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.7), "Current Limitations", [
        "English Only: Currently answers in English; regional Indian languages are not yet supported.",
        "Scanned Documents: Very old court papers that are image-only need text conversion first.",
        "Educational Tool: Gives legal information, but does not replace hiring a human lawyer."
    ], C_AMBER)

    add_card(s11, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.7), "Future Plans", [
        "Voice Support: Ask legal questions by voice in Kannada, Hindi, and Tamil.",
        "Automatic Document Drafting: Automatically create rental agreements, bail petitions, and RTI letters.",
        "Live Case Tracking: Connect with Indian e-Courts to check live court hearing dates."
    ], C_PURPLE)

    # Save Presentation with safe lock handling
    primary_name = "LegalAI_MCA_Presentation.pptx"
    fallback_name = "LegalAI_Presentation.pptx"
    
    try:
        output_pptx = os.path.join(os.getcwd(), primary_name)
        prs.save(output_pptx)
        print(f"SUCCESS: PowerPoint saved to {output_pptx}")
        return output_pptx
    except PermissionError:
        output_pptx = os.path.join(os.getcwd(), fallback_name)
        prs.save(output_pptx)
        print(f"NOTICE: '{primary_name}' is currently open in PowerPoint. Saved updated presentation to {output_pptx}")
        return output_pptx

if __name__ == "__main__":
    create_presentation()

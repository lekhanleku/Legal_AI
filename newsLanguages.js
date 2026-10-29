/* ================================================================
   LEGALAI — MULTILINGUAL INDIAN & GLOBAL LEGAL NEWS ENGINE
   Supports: English (en), Kannada (kn), Hindi (hi), Tamil (ta),
             Telugu (te), Bengali (bn), Marathi (mr), Gujarati (gu)
   ================================================================ */

window.SUPPORTED_NEWS_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧', voiceCode: 'en-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', voiceCode: 'kn-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', voiceCode: 'ta-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', voiceCode: 'te-IN' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳', voiceCode: 'bn-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳', voiceCode: 'mr-IN' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', voiceCode: 'gu-IN' }
];

window.NEWS_UI_STRINGS = {
  en: {
    readIn: 'Read In:',
    tickerLabel: 'LIVE LEGAL WIRE',
    searchPlaceholder: 'Search Indian & world legal news, verdicts, statutes, or tribunals...',
    wireActive: 'Live Legal Wire Active',
    refresh: 'Refresh',
    allRegions: '🌐 All Jurisdictions',
    indiaRegion: '🇮🇳 India & Supreme Court',
    karnatakaRegion: '🏛️ Karnataka & High Courts',
    euRegion: '🇪🇺 European Union',
    intlCourts: '🇺🇳 International Courts',
    ukRegion: '🇬🇧 UK & Commonwealth',
    asiaRegion: '🌏 Asia-Pacific & Trade',
    americasRegion: '🌎 Americas & Rights',
    techRegion: '⚡ Global AI & Finance',
    readDispatch: 'Read Dispatch',
    askAi: 'Ask AI',
    officialSource: 'Official Source ↗',
    topDispatch: '🌟 TOP LEGAL DISPATCH',
    readFull: 'Read Full Legal Analysis',
    analyzeAi: 'Analyze with LegalAI',
    statutesCited: 'Statutes & Treaties Cited:',
    keyTakeaways: 'Key Legal Takeaways',
    backToArticles: 'All Articles',
    listen: 'Listen',
    save: 'Save',
    share: 'Share',
    checklistHeading: 'Actionable Legal Compliance Checklist',
    disclaimerHeading: 'Statutory Disclaimer & Guidance',
    practiceCta: 'Consult an Expert Advocate →',
    aiCta: 'Ask LegalAI Assistant about this Ruling'
  },
  kn: {
    readIn: 'ಭಾಷೆ ಆಯ್ಕೆ (Read In):',
    tickerLabel: 'ನ್ಯಾಯಾಂಗ ನೇರ ವರದಿ (LIVE WIRE)',
    searchPlaceholder: 'ಕಾನೂನು ಸುದ್ದಿ, ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು, ಕಾಯ್ದೆಗಳನ್ನು ಹುಡುಕಿ...',
    wireActive: 'ನ್ಯಾಯಾಂಗ ಲೈವ್ ವರದಿ ಸಕ್ರಿಯ',
    refresh: 'ನವೀಕರಿಸಿ',
    allRegions: '🌐 ಎಲ್ಲ ನ್ಯಾಯಾಂಗ ವಲಯಗಳು',
    indiaRegion: '🇮🇳 ಭಾರತ & ಸುಪ್ರೀಂ ಕೋರ್ಟ್',
    karnatakaRegion: '🏛️ ಕರ್ನಾಟಕ & ಉಚ್ಚ ನ್ಯಾಯಾಲಯಗಳು',
    euRegion: '🇪🇺 ಯುರೋಪಿಯನ್ ಒಕ್ಕೂಟ',
    intlCourts: '🇺🇳 ಅಂತರರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯಗಳು',
    ukRegion: '🇬🇧 ಯುಕೆ & ಕಾಮನ್‌ವೆಲ್ತ್',
    asiaRegion: '🌏 ಏಷ್ಯಾ-ಪೆಸಿಫಿಕ್ & ವಾಣಿಜ್ಯ',
    americasRegion: '🌎 ಅಮೆರಿಕ & ಮೂಲಭೂತ ಹಕ್ಕುಗಳು',
    techRegion: '⚡ ಜಾಗತಿಕ AI & ಹಣಕಾಸು',
    readDispatch: 'ವರದಿ ಓದಿ',
    askAi: 'AI ಗೆ ಕೇಳಿ',
    officialSource: 'ಅಧಿಕೃತ ಮೂಲ ↗',
    topDispatch: '🌟 ಪ್ರಮುಖ ನ್ಯಾಯಾಂಗ ವರದಿ',
    readFull: 'ಪೂರ್ಣ ಕಾನೂನು ವಿಶ್ಲೇಷಣೆ ಓದಿ',
    analyzeAi: 'LegalAI ನೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ',
    statutesCited: 'ಉಲ್ಲೇಖಿಸಲಾದ ಕಾಯ್ದೆಗಳು & ವಿಧಿಗಳು:',
    keyTakeaways: 'ಪ್ರಮುಖ ಕಾನೂನು ಮುಖ್ಯಾಂಶಗಳು',
    backToArticles: 'ಎಲ್ಲ ವರದಿಗಳು',
    listen: 'ಆಲಿಸಿ',
    save: 'ಉಳಿಸಿ',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    checklistHeading: 'ಪ್ರಾಯೋಗಿಕ ಅನುಸರಣಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
    disclaimerHeading: 'ಶಾಸನಬದ್ಧ ಮುನ್ನೆಚ್ಚರಿಕೆ & ಹಕ್ಕುತ್ಯಾಗ',
    practiceCta: 'ತಜ್ಞ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ →',
    aiCta: 'ಈ ತೀರ್ಪಿನ ಬಗ್ಗೆ LegalAI ಸಹಾಯಕನನ್ನು ಕೇಳಿ'
  },
  hi: {
    readIn: 'भाषा चुनें (Read In):',
    tickerLabel: 'लाइव विधिक समाचार (LIVE WIRE)',
    searchPlaceholder: 'विधिक समाचार, सुप्रीम कोर्ट के फैसले, कानून खोजें...',
    wireActive: 'लाइव विधिक समाचार सक्रिय',
    refresh: 'ताज़ा करें',
    allRegions: '🌐 सभी क्षेत्राधिकार',
    indiaRegion: '🇮🇳 भारत एवं सुप्रीम कोर्ट',
    karnatakaRegion: '🏛️ कर्नाटक एवं उच्च न्यायालय',
    euRegion: '🇪🇺 यूरोपीय संघ',
    intlCourts: '🇺🇳 अंतर्राष्ट्रीय न्यायालय',
    ukRegion: '🇬🇧 यूके एवं कॉमनवेल्थ',
    asiaRegion: '🌏 एशिया-प्रशांत एवं व्यापार',
    americasRegion: '🌎 अमेरिका एवं अधिकार',
    techRegion: '⚡ वैश्विक AI एवं वित्त',
    readDispatch: 'रिपोर्ट पढ़ें',
    askAi: 'AI से पूछें',
    officialSource: 'आधिकारिक स्रोत ↗',
    topDispatch: '🌟 प्रमुख विधिक रिपोर्ट',
    readFull: 'संपूर्ण कानूनी विश्लेषण पढ़ें',
    analyzeAi: 'LegalAI से विश्लेषण करें',
    statutesCited: 'संदर्भित कानून एवं धाराएं:',
    keyTakeaways: 'प्रमुख कानूनी निष्कर्ष',
    backToArticles: 'सभी रिपोर्ट',
    listen: 'सुनें',
    save: 'सहेजें',
    share: 'साझा करें',
    checklistHeading: 'व्यावहारिक अनुपालन चेकलिस्ट',
    disclaimerHeading: 'सांविधिक अस्वीकरण एवं चेतावनी',
    practiceCta: 'विशेषज्ञ अधिवक्ता से परामर्श करें →',
    aiCta: 'इस फैसले पर LegalAI से पूछें'
  },
  ta: {
    readIn: 'மொழியைத் தேர்வுசெய்க (Read In):',
    tickerLabel: 'நேரலை சட்டச் செய்திகள் (LIVE WIRE)',
    searchPlaceholder: 'சட்டச் செய்திகள், உச்ச நீதிமன்றத் தீர்ப்புகளைத் தேடுக...',
    wireActive: 'சட்ட நேரலை செயலில் உள்ளது',
    refresh: 'புதுப்பிக்குக',
    allRegions: '🌐 அனைத்து நீதித்துறை பகுதிகள்',
    indiaRegion: '🇮🇳 இந்தியா & உச்ச நீதிமன்றம்',
    karnatakaRegion: '🏛️ கர்நாடகா & உயர் நீதிமன்றங்கள்',
    euRegion: '🇪🇺 ஐரோப்பிய ஒன்றியம்',
    intlCourts: '🇺🇳 சர்வதேச நீதிமன்றங்கள்',
    ukRegion: '🇬🇧 யூகே & காமன்வெல்த்',
    asiaRegion: '🌏 ஆசியா-பசிபிக் & வர்த்தகம்',
    americasRegion: '🌎 அமெரிக்கா & உரிமைகள்',
    techRegion: '⚡ சர்வதேச AI & நிதி',
    readDispatch: 'செய்தியைப் படிக்க',
    askAi: 'AI இடம் கேட்க',
    officialSource: 'அதிகாரப்பூர்வ தளம் ↗',
    topDispatch: '🌟 முக்கிய சட்டச் செய்தி',
    readFull: 'முழு சட்டப் பகுப்பாய்வைப் படிக்க',
    analyzeAi: 'LegalAI உடன் ஆராய்க',
    statutesCited: 'மேற்கோள் காட்டப்பட்ட சட்டங்கள்:',
    keyTakeaways: 'முக்கிய சட்டக் குறிப்புகள்',
    backToArticles: 'அனைத்து செய்திகள்',
    listen: 'கேட்க',
    save: 'சேமிக்க',
    share: 'பகிர்க',
    checklistHeading: 'சட்ட இணக்க சரிபார்ப்புப் பட்டியல்',
    disclaimerHeading: 'சட்டப்பூர்வ மறுப்பு & எச்சரிக்கை',
    practiceCta: 'சட்ட நிபுணரிடம் ஆலோசனை பெற →',
    aiCta: 'இந்தத் தீர்ப்பு குறித்து AI இடம் கேட்க'
  },
  te: {
    readIn: 'భాషను ఎంచుకోండి (Read In):',
    tickerLabel: 'ప్రత్యక్ష న్యాయవార్తలు (LIVE WIRE)',
    searchPlaceholder: 'న్యాయవార్తలు, సుప్రీంకోర్టు తీర్పులను శోధించండి...',
    wireActive: 'లైవ్ వైర్ క్రియాశీలంగా ఉంది',
    refresh: 'తాజాకరించు',
    allRegions: '🌐 అన్ని న్యాయ విభాగాలు',
    indiaRegion: '🇮🇳 భారతదేశం & సుప్రీంకోర్టు',
    karnatakaRegion: '🏛️ కర్ణాటక & హైకోర్టులు',
    euRegion: '🇪🇺 యూరోపియన్ యూనియన్',
    intlCourts: '🇺🇳 అంతర్జాతీయ న్యాయస్థానాలు',
    ukRegion: '🇬🇧 యూకే & కామన్వెల్త్',
    asiaRegion: '🌏 ఆసియా-పసిఫిక్ & వాణిజ్యం',
    americasRegion: '🌎 అమెరికా & హక్కులు',
    techRegion: '⚡ గ్లోబల్ AI & ఫైనాన్స్',
    readDispatch: 'వార్తను చదవండి',
    askAi: 'AI ని అడగండి',
    officialSource: 'అధికారిక మూలం ↗',
    topDispatch: '🌟 ముఖ్యమైన న్యాయ నివేదిక',
    readFull: 'పూర్తి విశ్లేషణను చదవండి',
    analyzeAi: 'LegalAI తో విశ్లేషించండి',
    statutesCited: 'ప్రస్తావించిన చట్టాలు & సెక్షన్లు:',
    keyTakeaways: 'కీలక న్యాయ ముఖ్యాంశాలు',
    backToArticles: 'అన్ని నివేదికలు',
    listen: 'వినండి',
    save: 'భద్రపరచు',
    share: 'భాగస్వామ్యం',
    checklistHeading: 'ఆచరణాత్మక చట్టబద్ధమైన తనిఖీ జాబితా',
    disclaimerHeading: 'చట్టపరమైన నిరాకరణ & హెచ్చరిక',
    practiceCta: 'నిపుణులైన న్యాయవాదిని సంప్రదించండి →',
    aiCta: 'ఈ తీర్పు గురించి LegalAI ని అడగండి'
  },
  bn: {
    readIn: 'ভাষা নির্বাচন করুন (Read In):',
    tickerLabel: 'লাইভ আইনি খবর (LIVE WIRE)',
    searchPlaceholder: 'আইনি খবর, সুপ্রিম কোর্টের রায়, আইন অনুসন্ধান করুন...',
    wireActive: 'লাইভ আইনি পরিষেবা সক্রিয়',
    refresh: 'রিফ্রেশ',
    allRegions: '🌐 সমস্ত বিচারব্যবস্থা',
    indiaRegion: '🇮🇳 ভারত ও সুপ্রিম কোর্ট',
    karnatakaRegion: '🏛️ কর্ণাটক ও হাইকোর্ট',
    euRegion: '🇪🇺 ইউরোপীয় ইউনিয়ন',
    intlCourts: '🇺🇳 আন্তর্জাতিক আদালত',
    ukRegion: '🇬🇧 যুক্তরাজ্য ও কমনওয়েলথ',
    asiaRegion: '🌏 এশিয়া-প্যাসিফিক ও বাণিজ্য',
    americasRegion: '🌎 আমেরিকা ও অধিকার',
    techRegion: '⚡ গ্লোবাল এআই ও অর্থ',
    readDispatch: 'প্রতিবেদন পড়ুন',
    askAi: 'AI কে জিজ্ঞাসা করুন',
    officialSource: 'অফিসিয়াল সূত্র ↗',
    topDispatch: '🌟 প্রধান আইনি খবর',
    readFull: 'সম্পূর্ণ আইনি বিশ্লেষণ পড়ুন',
    analyzeAi: 'LegalAI দিয়ে বিশ্লেষণ করুন',
    statutesCited: 'উল্লেখিত আইন ও বিধিসমূহ:',
    keyTakeaways: 'মূল আইনি দিকসমূহ',
    backToArticles: 'সমস্ত প্রতিবেদন',
    listen: 'শুনুন',
    save: 'সংরক্ষণ',
    share: 'শেয়ার',
    checklistHeading: 'আইনি সম্মতি চেকলিস্ট',
    disclaimerHeading: 'সংবিধিবদ্ধ দাবিত্যাগ ও সতর্কতা',
    practiceCta: 'বিশেষজ্ঞ আইনজীবীর পরামর্শ নিন →',
    aiCta: 'এই রায় সম্পর্কে LegalAI কে জিজ্ঞাসা করুন'
  },
  mr: {
    readIn: 'भाषा निवडा (Read In):',
    tickerLabel: 'थेट कायदेशीर बातम्या (LIVE WIRE)',
    searchPlaceholder: 'कायदेशीर बातम्या, सर्वोच्च न्यायालयाचे निकाल शोधा...',
    wireActive: 'थेट कायदेशीर सेवा सुरू आहे',
    refresh: 'ताजे करा',
    allRegions: '🌐 सर्व अधिकारक्षेत्रे',
    indiaRegion: '🇮🇳 भारत आणि सर्वोच्च न्यायालय',
    karnatakaRegion: '🏛️ कर्नाटक आणि उच्च न्यायालये',
    euRegion: '🇪🇺 युरोपीय संघ',
    intlCourts: '🇺🇳 आंतरराष्ट्रीय न्यायालये',
    ukRegion: '🇬🇧 यूके आणि राष्ट्रकुल',
    asiaRegion: '🌏 आशिया-पॅसिफिक आणि व्यापार',
    americasRegion: '🌎 अमेरिका आणि मानवाधिकार',
    techRegion: '⚡ जागतिक AI आणि वित्त',
    readDispatch: 'वृत्त वाचा',
    askAi: 'AI ला विचारा',
    officialSource: 'अधिकृत स्रोत ↗',
    topDispatch: '🌟 मुख्य कायदेशीर वृत्त',
    readFull: 'संपूर्ण कायदेशीर विश्लेषण वाचा',
    analyzeAi: 'LegalAI द्वारे विश्लेषण करा',
    statutesCited: 'उल्लेखित कायदे आणि कलमे:',
    keyTakeaways: 'महत्त्वाचे कायदेशीर मुद्दे',
    backToArticles: 'सर्व वृत्ते',
    listen: 'ऐका',
    save: 'जतन करा',
    share: 'शेअर करा',
    checklistHeading: 'कायदेशीर अनुपालन तपासणी यादी',
    disclaimerHeading: 'वैधानिक अस्वीकरण आणि इशारा',
    practiceCta: 'तज्ज्ञ वकिलांचा सल्ला घ्या →',
    aiCta: 'या निकालावर LegalAI ला विचारा'
  },
  gu: {
    readIn: 'ભાષા પસંદ કરો (Read In):',
    tickerLabel: 'લાઇવ કાનૂની સમાચાર (LIVE WIRE)',
    searchPlaceholder: 'કાનૂની સમાચાર, સુપ્રીમ કોર્ટના ચુકાદા શોધો...',
    wireActive: 'લાઇવ કાનૂની સેવા સક્રિય',
    refresh: 'તાજું કરો',
    allRegions: '🌐 તમામ અધિકારક્ષેત્રો',
    indiaRegion: '🇮🇳 ભારત અને સુપ્રીમ કોર્ટ',
    karnatakaRegion: '🏛️ કર્ણાટક અને વડી અદાલતો',
    euRegion: '🇪🇺 યુરોપિયન યુનિયન',
    intlCourts: '🇺🇳 આંતરરાષ્ટ્રીય અદાલતો',
    ukRegion: '🇬🇧 યુકે અને કોમનવેલ્થ',
    asiaRegion: '🌏 એશિયા-પેસિફિક અને વેપાર',
    americasRegion: '🌎 અમેરિકા અને અધિકારો',
    techRegion: '⚡ ગ્લોબલ AI અને ફાઇનાન્સ',
    readDispatch: 'અહેવાલ વાંચો',
    askAi: 'AI ને પૂછો',
    officialSource: 'સત્તાવાર સ્રોત ↗',
    topDispatch: '🌟 મુખ્ય કાનૂની અહેવાલ',
    readFull: 'સંપૂર્ણ કાનૂની વિશ્લેષણ વાંચો',
    analyzeAi: 'LegalAI સાથે વિશ્લેષણ કરો',
    statutesCited: 'સંદર્ભિત કાયદા અને કલમો:',
    keyTakeaways: 'મુખ્ય કાનૂની મુદ્દાઓ',
    backToArticles: 'તમામ અહેવાલો',
    listen: 'સાંભળો',
    save: 'સાચવો',
    share: 'શેર કરો',
    checklistHeading: 'કાનૂની પાલન ચેકલિસ્ટ',
    disclaimerHeading: 'વૈધાનિક અસ્વીકરણ અને ચેતવણી',
    practiceCta: 'નિષ્ણાત વકીલની સલાહ લો →',
    aiCta: 'આ ચુકાદા વિશે LegalAI ને પૂછો'
  }
};

// ── Multi-Language Legal Dispatches Dataset ──
window.MULTILINGUAL_LEGAL_ARTICLES = [
  {
    id: 'india-sc-dpdp-act-verdict',
    region: 'India & Supreme Court',
    flag: '🇮🇳',
    category: 'Constitutional & Privacy Law',
    source: 'Supreme Court of India (Constitution Bench)',
    pubDate: new Date().toISOString(),
    relativeTime: 'Today',
    readTime: '5 min read',
    laws: ['DPDP Act 2023', 'Article 21 Constitution of India', 'IT Act 2000 Section 43A'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Affirms DPDP Act Enforcement: Penalties Up to ₹250 Cr for Corporate Data Breaches',
        lead: 'The Supreme Court of India has reaffirmed citizens\' fundamental right to privacy under Article 21, upholding the Data Protection Board of India\'s statutory authority to impose civil penalties reaching ₹250 Crore for corporate data security breaches and non-consensual consumer profiling.',
        takeaways: [
          'Mandatory consumer consent mechanisms must be granular and auditable by the Data Protection Board.',
          'Significant Data Fiduciaries (SDFs) must appoint an India-resident Data Protection Officer (DPO).',
          'Maximum administrative penalties reach ₹250 Crore per incident of critical data breach.'
        ],
        sections: [
          {
            heading: 'Constitutional Affirmation of Informational Privacy',
            paragraphs: [
              'Expanding upon the historic Puttaswamy landmark ruling, the Supreme Court Constitution Bench declared that individual data autonomy is an inseparable component of human dignity protected under Article 21.',
              'The Court made clear that tech giants and corporate entities cannot evade accountability through obscure clickwrap end-user license agreements.'
            ]
          },
          {
            heading: 'Statutory Powers of the Data Protection Board',
            paragraphs: [
              'The Data Protection Board of India has been empowered with civil court powers to summon witnesses, inspect digital databases, and levy remedial penalties.',
              'Data principals maintain the statutory right to grievance redressal, correction, and erasure of outdated personal information.'
            ]
          }
        ],
        checklist: [
          'Conduct comprehensive data discovery audits across customer and employee databases',
          'Deploy verified bilingual consent management platforms for all Indian consumers',
          'Establish 72-hour mandatory breach notification workflows to the Data Protection Board'
        ],
        warning: 'Failure to report a detected personal data breach within prescribed statutory windows can attract independent statutory penalties up to ₹200 Crore.'
      },
      kn: {
        title: 'ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ಜಾರಿ: ಕಾರ್ಪೊರೇಟ್ ಉಲ್ಲಂಘನೆಗಳಿಗೆ ₹250 ಕೋಟಿವರೆಗೆ ದಂಡ ವಿಧಿಸಲು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಮ್ಮತಿ',
        lead: 'ಭಾರತದ ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯವು ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯಡಿ ಪ್ರಜೆಗಳ ಖಾಸಗಿತನದ ಮೂಲಭೂತ ಹಕ್ಕನ್ನು ಪುನರುಚ್ಚರಿಸಿದ್ದು, ಡಿಜಿಟಲ್ ದತ್ತಾಂಶ ಸೋರಿಕೆ ಮತ್ತು ಗ್ರಾಹಕರ ಅನುಮತಿಯಿಲ್ಲದ ಪ್ರೊಫೈಲಿಂಗ್‌ಗೆ ಗರಿಷ್ಠ ₹250 ಕೋಟಿವರೆಗೆ ದಂಡ ವಿಧಿಸುವ ಡಿಪಿಡಿಪಿ ಪ್ರಾಧಿಕಾರದ ಶಾಸನಬದ್ಧ ಅಧಿಕಾರವನ್ನು ಎತ್ತಿಹಿಡಿದಿದೆ.',
        takeaways: [
          'ಗ್ರಾಹಕರ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆಯಿಲ್ಲದೆ ಬಯೋಮೆಟ್ರಿಕ್ ಅಥವಾ ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ ಸಂಗ್ರಹಿಸುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.',
          'ಪ್ರತಿಯೊಂದು ಪ್ರಮುಖ ದತ್ತಾಂಶ ನಿಯಂತ್ರಕ ಸಂಸ್ಥೆಗಳು ಭಾರತದಲ್ಲೇ ಅಧಿಕೃತ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿಯನ್ನು (DPO) ನೇಮಿಸುವುದು ಕಡ್ಡಾಯ.',
          'ಗಂಭೀರ ಸೈಬರ್ ಭದ್ರತಾ ಲೋಪಗಳಿಗೆ ಗರಿಷ್ಠ ₹250 ಕೋಟಿವರೆಗಿನ ಆಡಳಿತಾತ್ಮಕ ದಂಡ ವಿಧಿಸಲು ಕಾನೂನು ಮಾನ್ಯತೆ.'
        ],
        sections: [
          {
            heading: 'ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯಡಿ ಖಾಸಗಿತನದ ರಕ್ಷಣೆ',
            paragraphs: [
              'ಪುಟ್ಟಸ್ವಾಮಿ ತೀರ್ಪಿನ ಆಧಾರದ ಮೇಲೆ, ಭಾರತದ ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯದ ಸಂವಿಧಾನ ಪೀಠವು ಪ್ರತಿಯೊಬ್ಬ ಪ್ರಜೆಯ ಡಿಜಿಟಲ್ ಸ್ವಾಯತ್ತತೆ ಮತ್ತು ದತ್ತಾಂಶ ರಕ್ಷಣೆಯು ಜೀವಿಸುವ ಹಕ್ಕಿನ ಅವಿಭಾಜ್ಯ ಅಂಗವೆಂದು ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.',
              'ಆನ್‌ಲೈನ್ ಇ-ಕಾಮರ್ಸ್, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ವೇದಿಕೆಗಳು ಬಳಕೆದಾರರ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.'
            ]
          },
          {
            heading: 'ಕಾರ್ಪೊರೇಟ್ ಸಂಸ್ಥೆಗಳಿಗೆ ಶಾಸನಬದ್ಧ ಜವಾಬ್ದಾರಿಗಳು',
            paragraphs: [
              'ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಮಂಡಳಿಯು (DPB) ತಕ್ಷಣದ ತನಿಖೆ ನಡೆಸುವ ಅಧಿಕಾರ ಹೊಂದಿದ್ದು, ನಿಯಮ ಉಲ್ಲಂಘಿಸಿದ ಕಂಪನಿಗಳ ವಿರುದ್ಧ ನೋಟಿಸ್ ನೀಡಿ ಶಾಸನಬದ್ಧ ವಿಚಾರಣೆ ಕೈಗೊಳ್ಳಬಹುದಾಗಿದೆ.',
              'ಬಳಕೆದಾರರಿಗೆ ತಮ್ಮ ಹಳೆಯ ದತ್ತಾಂಶವನ್ನು ಡಿಲೀಟ್ ಮಾಡುವ (Right to be Forgotten) ಕಾನೂನಾತ್ಮಕ ಹಕ್ಕು ಒದಗಿಸಲಾಗಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ಕಂಪನಿಯ ದತ್ತಾಂಶ ಸಂಗ್ರಹಣೆ ನೀತಿಗಳನ್ನು ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ 2023 ರ ಮಾನದಂಡಗಳಿಗೆ ಸರಿಹೊಂದಿಸಿ',
          'ಗ್ರಾಹಕರ ಸಮ್ಮತಿ ಪಡೆಯುವ ತಂತ್ರಜ್ಞಾನ ವ್ಯವಸ್ಥೆಗಳನ್ನು (Consent Managers) ಜಾರಿಗೆ ತನ್ನಿ',
          'ಸೈಬರ್ ದಾಳಿ ಮತ್ತು ಡೇಟಾ ಸೋರಿಕೆ ತಡೆಗಟ್ಟಲು ಸುರಕ್ಷತಾ ಲೆಕ್ಕಪರಿಶೋಧನೆ ನಡೆಸಿ'
        ],
        warning: 'ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಪ್ರಾಧಿಕಾರದ ನೋಟಿಸ್‌ಗೆ ವಿಳಂಬ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿದರೆ ಕಂಪನಿಯ ಕಾರ್ಯಾಚರಣೆ ಅಮಾನತು ಮತ್ತು ಗರಿಷ್ಠ ದಂಡ ವಿಧಿಸಲಾಗುವುದು.'
      },
      hi: {
        title: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम: कॉर्पोरेट डेटा उल्लंघनों पर ₹250 करोड़ तक का जुर्माना वैध, सुप्रीम कोर्ट का फैसला',
        lead: 'भारत के सर्वोच्च न्यायालय ने अनुच्छेद 21 के तहत नागरिकों के निजता के मौलिक अधिकार की पुष्टि की है और गंभीर डेटा उल्लंघनों पर कंपनियों पर ₹250 करोड़ तक का जुर्माना लगाने के डेटा संरक्षण बोर्ड के अधिकार को बरकरार रखा है।',
        takeaways: [
          'उपभोक्ताओं की स्पष्ट सहमति के बिना व्यक्तिगत डेटा संग्रह पर पूर्ण प्रतिबंध।',
          'प्रमुख डेटा फिड्युशरी संस्थाओं द्वारा भारत में डेटा संरक्षण अधिकारी (DPO) की नियुक्ति अनिवार्य।',
          'गंभीर डेटा सुरक्षा उल्लंघनों पर ₹250 करोड़ तक के नागरिक जुर्माने का प्रावधान।'
        ],
        sections: [
          {
            heading: 'निजता के अधिकार की संवैधानिक पुष्टि',
            paragraphs: [
              'पुट्टास्वामी फैसले को आगे बढ़ाते हुए संविधान पीठ ने घोषित किया कि व्यक्तिगत डेटा सुरक्षा मानवीय गरिमा और जीवन के अधिकार का अभिन्न अंग है।',
              'न्यायालय ने स्पष्ट किया कि अस्पष्ट शर्तों के आधार पर उपयोगकर्ताओं के डेटा का अनधिकृत व्यापार नहीं किया जा सकता।'
            ]
          }
        ],
        checklist: [
          'अपनी संस्था की डेटा सुरक्षा नीतियों का DPDP अधिनियम 2023 के तहत ऑडिट करें',
          'डेटा सुरक्षा अधिकारी और शिकायत निवारण तंत्र स्थापित करें'
        ],
        warning: 'डेटा उल्लंघन की समय पर सूचना न देने पर ₹200 करोड़ तक का अतिरिक्त जुर्माना लग सकता है।'
      },
      ta: {
        title: 'டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம்: பெருநிறுவன விதிமீறல்களுக்கு ₹250 கோடி வரை அபராதம் செல்லும் - உச்ச நீதிமன்றம்',
        lead: 'இந்திய உச்ச நீதிமன்றம் பிரிவு 21-ன் கீழ் தனிநபர் அந்தரங்க உரிமையை உறுதி செய்துள்ளதுடன், பயனர் தரவு மீறல்களுக்கு ₹250 கோடி வரை அபராதம் விதிக்கும் தரவு பாதுகாப்பு வாரியத்தின் அதிகாரத்தை உறுதி செய்துள்ளது.',
        takeaways: [
          'பயனரின் தெளிவான அனுமதியின்றி தனிப்பட்ட தகவல்களைச் சேகரிக்கத் தடை.',
          'முக்கிய நிறுவனங்கள் இந்தியாவில் தரவு பாதுகாப்பு அதிகாரியை (DPO) நியமிப்பது கட்டாயம்.',
          'கடுமையான விதிமீறல்களுக்கு அதிகபட்சமாக ₹250 கோடி வரை அபராதம் விதிக்கப்படும்.'
        ]
      },
      te: {
        title: 'డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం: నిబంధనల ఉల్లంఘనకు ₹250 కోట్ల వరకు జరిమానా విధింపును సమర్థించిన సుప్రీంకోర్టు',
        lead: 'భారత సుప్రీంకోర్టు ఆర్టికల్ 21 కింద గోప్యతా హక్కును ప్రాథమిక హక్కుగా పునరుద్ఘాటిస్తూ, డేటా భద్రతా ఉల్లంఘనలపై ₹250 కోట్ల వరకు జరిమానా విధించే డేటా ప్రొటెక్షన్ బోర్డు అధికారాలను సమర్థించింది.',
        takeaways: [
          'వినియోగదారుల స్పష్టమైన సమ్మతి లేకుండా డేటా సేకరణ నిషేధించబడింది.',
          'భారత్‌లోనే డేటా ప్రొటెక్షన్ ఆఫీసర్‌ను నియమించడం తప్పనిసరి.'
        ]
      },
      bn: {
        title: 'ডিজিটাল ব্যক্তিগত ডেটা সুরক্ষা আইন: তথ্য ফাঁসের জন্য সংস্থাদের ₹২৫০ কোটি পর্যন্ত জরিমানা বৈধ, সুপ্রিম কোর্টের নির্দেশ',
        lead: 'ভারতের সুপ্রিম কোর্ট সংবিধানের ২১ নম্বর অনুচ্ছেদের আওতায় নাগরিকদের গোপনীয়তার অধিকার পুনর্ব্যক্ত করেছে এবং ডেটা লঙ্ঘনের জন্য ₹২৫০ কোটি পর্যন্ত জরিমানার ক্ষমতা বহাল রেখেছে।',
        takeaways: [
          'সম্মতি ছাড়া ব্যক্তিগত ডেটা সংগ্রহ কঠোরভাবে নিষিদ্ধ।',
          'ভারতে ডেটা সুরক্ষা কর্মকর্তা (DPO) নিয়োগ বাধ্যতামূলক।'
        ]
      },
      mr: {
        title: 'डिजिटल वैयक्तिक डेटा संरक्षण कायदा: कॉर्पोरेट उल्लंघनांवर ₹२५० कोटींपर्यंतचा दंड वैध, सर्वोच्च न्यायालयाचा निर्वाळा',
        lead: 'भारताच्या सर्वोच्च न्यायालयाने कलम २१ अंतर्गत गोपनीयतेच्या मूलभूत हक्काची पुष्टी करत डेटा संरक्षण मंडळाला ₹२५० कोटींपर्यंत दंड ठोठावण्याचे अधिकार बहाल ठेवले आहेत.',
        takeaways: [
          'ग्राहकांच्या स्पष्ट संमतीशिवाय वैयक्तिक डेटा वापरण्यास सक्त मनाई.',
          'भारतात डेटा संरक्षण अधिकारी (DPO) नियुक्त करणे बंधनकारक.'
        ]
      },
      gu: {
        title: 'ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન એક્ટ: ડેટા ઉલ્લંઘન પર કંપનીઓને ₹૨૫૦ કરોડ સુધીનો દંડ માન્ય, સુપ્રીમ કોર્ટનો મહત્વપૂર્ણ ચુકાદો',
        lead: 'ભારતની સર્વોચ્ચ અદાલતે કલમ ૨૧ હેઠળ નાગરિકોના ગોપનીયતાના મૂળભૂત અધિકારને સમર્થન આપીને ગંભીર ડેટા ઉલ્લંઘન પર ₹૨૫૦ કરોડ સુધીનો દંડ ફટકારવાની સત્તાને માન્ય રાખી છે.',
        takeaways: [
          'ગ્રાહકોની પૂર્વ સંમતિ વિના વ્યક્તિગત ડેટા સંગ્રહ પર પ્રતિબંધ.',
          'ભારતમાં જ ડેટા પ્રોટેક્શન ઓફિસર (DPO) ની નિમણૂક ફરજિયાત.'
        ]
      }
    }
  },
  {
    id: 'india-karnataka-hc-civic-liability',
    region: 'Karnataka & High Courts',
    flag: '🏛️',
    category: 'Public Law & Municipal Governance',
    source: 'High Court of Karnataka, Bengaluru Bench',
    pubDate: new Date().toISOString(),
    relativeTime: 'Today',
    readTime: '4 min read',
    laws: ['BBMP Act 2020', 'Article 226 of Constitution of India', 'Motor Vehicles Act 1988'],
    link: 'https://karnatakahiighcourt.kar.nic.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Karnataka High Court Mandates Civic Infrastructure Accountability & Pothole Victim Compensation',
        lead: 'A Division Bench of the High Court of Karnataka has ruled that citizens have a fundamental right to safe, motorable roads under Article 21, directing municipal authorities to establish automated compensation frameworks for pothole-related accidents.',
        takeaways: [
          'Safe civic infrastructure affirmed as a fundamental constitutional right under Article 21.',
          'Municipal engineers face direct contempt proceedings for failing to redress public grievances within 15 days.',
          'Three-year Defect Liability Period made legally binding on all municipal civil contractors.'
        ],
        sections: [
          {
            heading: 'Judicial Enforcement Under Article 226',
            paragraphs: [
              'Hearing public interest litigations on urban road conditions in Bengaluru and statewide municipal corporations, the High Court directed that victims of civic negligence receive immediate interim financial compensation.',
              'The Court directed District Legal Services Authorities (DLSA) to expedite claims filed by affected citizens and their families.'
            ]
          }
        ],
        checklist: [
          'File formal grievance on municipal online grievance redressal portal with geo-tagged images',
          'Preserve medical reports, police GD/FIR entries, and repair estimates for claims'
        ],
        warning: 'Negligent contractor entities face immediate debarment and corporate blacklisting across all state infrastructure works.'
      },
      kn: {
        title: 'ಕರ್ನಾಟಕ ಉಚ್ಚ ನ್ಯಾಯಾಲಯ ಮಹತ್ವದ ತೀರ್ಪು: ರಸ್ತೆ ಸುರಕ್ಷತೆ ಮತ್ತು ಪಾಲಿಕೆ ವೈಫಲ್ಯಕ್ಕೆ ನಾಗರಿಕರಿಗೆ ನೇರ ಪರಿಹಾರ ನೀಡಲು ಬಿಬಿಎಂಪಿಗೆ ಆದೇಶ',
        lead: 'ಬೆಂಗಳೂರು ಹಾಗೂ ಕರ್ನಾಟಕದ ನಗರ ರಸ್ತೆಗಳ ದುರಸ್ತಿ ಮತ್ತು ನಾಗರಿಕರ ಸುರಕ್ಷತೆಯ ಸಾರ್ವಜನಿಕ ಹಿತಾಸಕ್ತಿ ಅರ್ಜಿ ವಿಚಾರಣೆ ನಡೆಸಿದ ಕರ್ನಾಟಕ ಉಚ್ಚ ನ್ಯಾಯಾಲಯದ ವಿಭಾಗೀಯ ಪೀಠವು, ರಸ್ತೆ ಗುಂಡಿಗಳಿಂದಾಗುವ ಅಪಘಾತಗಳಿಗೆ ನಗರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳೇ ನೇರ ಹೊಣೆಗಾರರಾಗಿದ್ದು ಸಂತ್ರಸ್ತರಿಗೆ ವೈಜ್ಞಾನಿಕ ಪರಿಹಾರ ನೀಡಬೇಕೆಂದು ಆದೇಶಿಸಿದೆ.',
        takeaways: [
          'ಸುರಕ್ಷಿತ ಸಾರ್ವಜನಿಕ ರಸ್ತೆಗಳ ಹಕ್ಕು ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯಡಿ ಜೀವಿಸುವ ಹಕ್ಕಿನ ಅವಿಭಾಜ್ಯ ಅಂಗವೆಂದು ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಮಹತ್ವದ ತೀರ್ಪು ನೀಡಿದೆ.',
          'ನಾಗರಿಕ ದೂರುಗಳಿಗೆ 15 ದಿನಗಳಲ್ಲಿ ಸ್ಪಂದಿಸದ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳ ವಿರುದ್ಧ ನ್ಯಾಯಾಂಗ ನಿಂದನೆ (Contempt of Court) ಕ್ರಮದ ಎಚ್ಚರಿಕೆ.',
          'ರಸ್ತೆ ಗುಣಮಟ್ಟ ಲೆಕ್ಕಪರಿಶೋಧನೆ ಮತ್ತು ಕಳಪೆ ಕಾಮಗಾರಿ ನಡೆಸಿದ ಗುತ್ತಿಗೆದಾರರ ಕಪ್ಪುಪಟ್ಟಿ ವಿವರಗಳನ್ನು ಸಾರ್ವಜನಿಕ ಡೊಮೇನ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸುವುದು ಕಡ್ಡಾಯ.'
        ],
        sections: [
          {
            heading: 'ಸಂವಿಧಾನದ 226ನೇ ವಿಧಿಯಡಿ ಉಚ್ಚ ನ್ಯಾಯಾಲಯದ ನಿರ್ದೇಶನ',
            paragraphs: [
              'ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್‌ನ ಮುಖ್ಯ ನ್ಯಾಯಮೂರ್ತಿಗಳ ನೇತೃತ್ವದ ವಿಭಾಗೀಯ ಪೀಠವು, ತೆರಿಗೆ ಪಾವತಿಸುವ ನಾಗರಿಕರಿಗೆ ಸುಗಮ ಮತ್ತು ಸುರಕ್ಷಿತ ರಸ್ತೆ ಒದಗಿಸುವುದು ಮುನಿಸಿಪಲ್ ಸಂಸ್ಥೆಗಳ ಸಂವಿಧಾನಬದ್ಧ ಕರ್ತವ್ಯವಾಗಿದೆ ಎಂದು ಪುನರುಚ್ಚರಿಸಿತು.',
              'ರಸ್ತೆ ಗುಂಡಿಗಳಿಂದ ಪ್ರಾಣ ಕಳೆದುಕೊಂಡ ಅಥವಾ ಗಾಯಗೊಂಡ ಸಂತ್ರಸ್ತರಿಗೆ ಮತ್ತು ಅವರ ಕುಟುಂಬಗಳಿಗೆ ಸೂಕ್ತ ಮಧ್ಯಂತರ ಪರಿಹಾರವನ್ನು ತ್ವರಿತವಾಗಿ ವಿತರಿಸಲು ಕಾಲಮಿತಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.'
            ]
          },
          {
            heading: 'ಗುತ್ತಿಗೆದಾರರ ಹೊಣೆಗಾರಿಕೆ ಮತ್ತು ತಾಂತ್ರಿಕ ಗುಣಮಟ್ಟ',
            paragraphs: [
              'ರಸ್ತೆ ಕಾಮಗಾರಿ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಕನಿಷ್ಠ 3 ವರ್ಷಗಳ ದೋಷ ಹೊಣೆಗಾರಿಕೆ ಅವಧಿ (Defect Liability Period) ಕಡ್ಡಾಯವಾಗಿದ್ದು, ಹಾಳಾದ ರಸ್ತೆಗಳನ್ನು ಗುತ್ತಿಗೆದಾರರೇ ಸ್ವಂತ ವೆಚ್ಚದಲ್ಲಿ ಸರಿಪಡಿಸಬೇಕು ಎಂದು ಪೀಠವು ಸ್ಪಷ್ಟಪಡಿಸಿತು.'
            ]
          }
        ],
        checklist: [
          'ರಸ್ತೆ ಸುರಕ್ಷತಾ ದೂರುಗಳನ್ನು ಪಾಲಿಕೆಯ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ ಮತ್ತು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದಾಖಲಿಸಿ',
          'ಅಪಘಾತ ಸಂಭವಿಸಿದ ಸ್ಥಳದ ಫೋಟೋ, ಎಫ್‌ಐಆರ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಸಂರಕ್ಷಿಸಿ',
          'ಹೈಕೋರ್ಟ್ ಆದೇಶದ ಅನ್ವಯ ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರಕ್ಕೆ (DLSA) ಪರಿಹಾರ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
        ],
        warning: 'ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳು ನ್ಯಾಯಾಲಯದ ಆದೇಶವನ್ನು ಪಾಲಿಸದಿದ್ದಲ್ಲಿ ಸಂಬಂಧಪಟ್ಟ ಮುಖ್ಯ ಎಂಜಿನಿಯರ್‌ಗಳು ವೈಯಕ್ತಿಕ ನ್ಯಾಯಾಂಗ ಹಾಜರಾತಿಗೆ ಒಳಪಡುತ್ತಾರೆ.'
      },
      hi: {
        title: 'कर्नाटक उच्च न्यायालय का बड़ा फैसला: सड़कों की सुरक्षा नागरिकों का मौलिक अधिकार, गड्ढों से हुए हादसों पर मुआवजा अनिवार्य',
        lead: 'कर्नाटक उच्च न्यायालय की खंडपीठ ने अनुच्छेद 21 के तहत सुरक्षित सड़कों को नागरिकों का मौलिक अधिकार बताते हुए नगर निगम को गड्ढों से पीड़ित नागरिकों को मुआवजा देने का आदेश दिया है।',
        takeaways: [
          'सड़क सुरक्षा संविधान के अनुच्छेद 21 के तहत जीवन के अधिकार का अभिन्न हिस्सा घोषित।',
          'नागरिक शिकायतों का 15 दिनों में निवारण न करने पर अधिकारियों के खिलाफ अवमानना कार्रवाई की चेतावनी।'
        ]
      },
      ta: {
        title: 'கர்நாடக உயர் நீதிமன்றம் தீர்ப்பு: பாதுகாப்பான சாலை மக்களின் அடிப்படை உரிமை, விபத்துகளுக்கு இழப்பீடு வழங்க மாநகராட்சிக்கு உத்தரவு',
        lead: 'பிரிவு 21-ன் கீழ் பாதுகாப்பான சாலைகள் பொதுமக்களின் அடிப்படை உரிமை என கர்நாடக உயர் நீதிமன்றம் தீர்ப்பளித்துள்ளதுடன், விபத்துகளுக்கு இழப்பீடு வழங்க உத்தரவிட்டுள்ளது.',
        takeaways: [
          'குடிமக்களின் பாதுகாப்பு அடிப்படை உரிமையென உயர் நீதிமன்றம் உறுதி செய்தது.',
          'குறைகளைத் தீர்க்காத அதிகாரிகள் மீது நீதிமன்ற அவமதிப்பு நடவடிக்கை எடுக்கப்படும்.'
        ]
      },
      te: {
        title: 'కర్ణాటక హైకోర్టు కీలక తీర్పు: రోడ్డు భద్రత పౌరుల ప్రాథమిక హక్కు, ప్రమాద బాధితులకు పరిహారం చెల్లించాలని ఆదేశం',
        lead: 'కర్ణాటక హైకోర్టు రోడ్లపై గుంతల కారణంగా జరిగే ప్రమాదాలకు నగర పాలక సంస్థలదే పూర్తి బాధ్యత అని స్పష్టం చేస్తూ, బాధితులకు తక్షణ పరిహారం చెల్లించాలని ఆదేశించింది.',
        takeaways: [
          'రోడ్డు భద్రత ఆర్టికల్ 21 కింద జీవించే హక్కులో భాగమని కోర్టు స్పష్టం చేసింది.'
        ]
      },
      bn: {
        title: 'কর্ণাটক হাইকোর্টের ঐতিহাসিক রায়: নিরাপদ রাস্তা নাগরিকদের মৌলিক অধিকার, খানাখন্দের দুর্ঘটনায় ক্ষতিপূরণের নির্দেশ',
        lead: 'কর্ণাটক হাইকোর্ট নির্দেশ দিয়েছে যে সংবিধানের ২১ নম্বর অনুচ্ছেদের আওতায় নিরাপদ রাস্তা পাওয়া নাগরিকদের মৌলিক অধিকার, এবং দুর্ঘটনার শিকার ব্যক্তিদের অবিলম্বে ক্ষতিপূরণ দিতে হবে।',
        takeaways: [
          'পৌর কর্তৃপক্ষের অবহেলার জন্য আদালত অবমাননার কঠোর হুঁশিয়ারি।'
        ]
      },
      mr: {
        title: 'कर्नाटक उच्च न्यायालयाचा ऐतिहासिक निकाल: खड्डेमुक्त रस्ते नागरिकांचा मूलभूत हक्क, अपघातातील बळींना भरपाई देण्याचे आदेश',
        lead: 'कर्नाटक उच्च न्यायालयाने कलम २१ अंतर्गत खड्डेमुक्त रस्ते हा नागरिकांचा मूलभूत हक्क असल्याचे स्पष्ट करत महापालिकेला अपघातग्रस्तांना नुकसानभरपाई देण्याचे आदेश दिले आहेत.',
        takeaways: [
          'नागरी निष्काळजीपणावर अधिकाऱ्यांवर न्यायालयाचा अवमान कारवाईचा इशारा.'
        ]
      },
      gu: {
        title: 'કર્ણાટક હાઇકોર્ટનો ચુકાદો: રસ્તાની સુરક્ષા નાગરિકોનો મૂળભૂત અધિકાર, ખાડાથી થતા અકસ્માત પીડિતોને વળતર ચૂકવવા આદેશ',
        lead: 'કર્ણાટક હાઇકોર્ટે કલમ ૨૧ હેઠળ નાગરિકો માટે સલામત રસ્તાઓને મૂળભૂત અધિકાર જાહેર કરીને મહાનગરપાલિકાને અકસ્માત પીડિતોને વળતર ચૂકવવા નિર્દેશ આપ્યો છે.',
        takeaways: [
          'નાગરિક ફરિયાદોનો ૧૫ દિવસમાં ઉકેલ ન લાવનાર અધિકારીઓ સામે કાર્યવાહી.'
        ]
      }
    }
  },
  {
    id: 'india-sc-electoral-transparency',
    region: 'India & Supreme Court',
    flag: '🇮🇳',
    category: 'Constitutional & Election Law',
    source: 'Supreme Court of India (Constitution Bench)',
    pubDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    readTime: '5 min read',
    laws: ['Constitution Article 19(1)(a)', 'Representation of the People Act 1951', 'RTI Act 2005'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court 5-Judge Bench Upholds Electoral Transparency & Voter\'s Right to Information',
        lead: 'A unanimous five-judge Constitution Bench of the Supreme Court has ruled that voters possess an absolute fundamental right under Article 19(1)(a) to know the financial contributors to political parties contesting elections.',
        takeaways: [
          'Anonymous political funding deemed contrary to free and fair democratic elections.',
          'Election Commission mandated to publish verified corporate and individual contribution data.',
          'Reinforces voter empowerment under Article 19(1)(a) and Representation of the People Act.'
        ],
        sections: [
          {
            heading: 'The Constitutional Imperative of Open Democracy',
            paragraphs: [
              'The Chief Justice emphasized that information regarding financial contributions to political parties is essential for voters to exercise their freedom of speech and expression effectively at the ballot box.',
              'The Court held that corporate influence over public policy must be subject to public transparency.'
            ]
          }
        ]
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠ ಮಹತ್ವದ ತೀರ್ಪು: ಮತದಾರರ ಮಾಹಿತಿ ಹಕ್ಕು ಮತ್ತು ಚುನಾವಣಾ ಪಾರದರ್ಶಕತೆ ಮೂಲಭೂತ ಹಕ್ಕೆಂದು ಘೋಷಣೆ',
        lead: 'ಭಾರತದ ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯದ 5 ನ್ಯಾಯಾಧೀಶರ ಸಂವಿಧಾನ ಪೀಠವು, ಪ್ರಜಾಪ್ರಭುತ್ವದಲ್ಲಿ ಪ್ರತಿಯೊಬ್ಬ ಮತದಾರನಿಗೂ ರಾಜಕೀಯ ಪಕ್ಷಗಳ ಆರ್ಥಿಕ ಮೂಲಗಳ ಕುರಿತು ಪೂರ್ಣ ಮಾಹಿತಿ ಪಡೆಯುವ ಹಕ್ಕು ಸಂವಿಧಾನದ 19(1)(a) ವಿಧಿಯಡಿ ಮುಕ್ತ ಅಭಿವ್ಯಕ್ತಿ ಸ್ವಾತಂತ್ರ್ಯದ ಮೂಲಭೂತ ಅಂಗವಾಗಿದೆ ಎಂದು ಸರ್ವಾನುಮತದ ತೀರ್ಪಿತ್ತಿದೆ.',
        takeaways: [
          'ಚುನಾವಣಾ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಅನಾಮಧೇಯ ಕಾರ್ಪೊರೇಟ್ ದೇಣಿಗೆಗಳು ಸಂವಿಧಾನಬದ್ಧ ಸಮಾನತೆಯ ತತ್ವಕ್ಕೆ ವಿರುದ್ಧವಾಗಿವೆ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು.',
          'ರಾಜಕೀಯ ಪಕ್ಷಗಳಿಗೆ ನೀಡಲಾಗುವ ಪ್ರತಿ ದೇಣಿಗೆಯ ವಿವರಗಳನ್ನು ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗವು ಸಾರ್ವಜನಿಕರಿಗೆ ಲಭ್ಯವಾಗುವಂತೆ ಪ್ರಕಟಿಸುವುದು ಕಡ್ಡಾಯ.',
          'ಪ್ರಜಾಪ್ರತಿನಿಧಿ ಕಾಯ್ದೆ 1951ರ ಅಡಿಯಲ್ಲಿ ಮತದಾರರ ಹಕ್ಕುಗಳನ್ನು ಮತ್ತಷ್ಟು ಬಲಪಡಿಸಲಾಗಿದೆ.'
        ],
        sections: [
          {
            heading: 'ಮುಕ್ತ ಪ್ರಜಾಪ್ರಭುತ್ವ ಮತ್ತು ಸಂವಿಧಾನಿಕ ಪಾರದರ್ಶಕತೆ',
            paragraphs: [
              'ಮುಖ್ಯ ನ್ಯಾಯಮೂರ್ತಿಗಳ ನೇತೃತ್ವದ ಪೀಠವು, ಮತ ಚಲಾಯಿಸುವ ಮೊದಲು ಅಭ್ಯರ್ಥಿ ಮತ್ತು ಅವರ ಪಕ್ಷದ ಹಣಕಾಸಿನ ಮೂಲವನ್ನು ತಿಳಿದುಕೊಳ್ಳುವುದು ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನ ಹಕ್ಕು ಎಂದು ಒತ್ತಿಹೇಳಿತು.',
              'ಕಾರ್ಪೊರೇಟ್ ದೇಣಿಗೆಗಳು ಸರ್ಕಾರದ ಸಾರ್ವಜನಿಕ ನೀತಿಗಳನ್ನು ಪ್ರಭಾವಿಸುವುದನ್ನು ತಡೆಯಲು ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ ಅನಿವಾರ್ಯವಾಗಿದೆ.'
            ]
          }
        ]
      },
      hi: {
        title: 'सुप्रीम कोर्ट संविधान पीठ का ऐतिहासिक फैसला: मतदाताओं का सूचना का अधिकार और चुनावी पारदर्शिता मौलिक अधिकार घोषित',
        lead: 'सर्वोच्च न्यायालय की 5 जजों की संविधान पीठ ने सर्वसम्मति से फैसला दिया है कि राजनीतिक दलों को मिलने वाले चंदे की जानकारी पाना अनुच्छेद 19(1)(a) के तहत नागरिकों का मौलिक अधिकार है।',
        takeaways: [
          'अनाम राजनीतिक चंदा निष्पक्ष लोकतांत्रिक चुनाव प्रणाली के विपरीत घोषित।',
          'चुनाव आयोग को राजनीतिक दलों के योगदान के आंकड़े सार्वजनिक करने का निर्देश।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம் அரசியல் சாசன அமர்வு தீர்ப்பு: வாக்காளர்களின் தகவல் அறியும் உரிமை அடிப்படை உரிமை என அறிவிப்பு',
        lead: 'அரசியல் கட்சிகளுக்கு வழங்கப்படும் நிதி விபரங்களை வாக்காளர்கள் அறிந்துகொள்வது பிரிவு 19(1)(a)-ன் கீழ் அடிப்படை உரிமை என உச்ச நீதிமன்றம் தீர்ப்பளித்துள்ளது.',
        takeaways: [
          'பெயர் குறிப்பிடப்படாத அரசியல் நன்கொடைகள் ஜனநாயகத்திற்கு எதிரானது என அறிவிப்பு.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు రాజ్యాంగ ధర్మాసనం సంచలన తీర్పు: ఓటర్లకు సమాచార హక్కు ప్రాథమిక హక్కుగా ప్రకటన',
        lead: 'రాజకీయ పార్టీలకు అందే విరాళాల వివరాలను తెలుసుకునే హక్కు రాజ్యాంగంలోని ఆర్టికల్ 19(1)(a) కింద ఓటర్ల ప్రాథమిక హక్కు అని సుప్రీంకోర్టు స్పష్టం చేసింది.',
        takeaways: [
          'ఎన్నికల నిధులలో పారదర్శకతను కాపాడటం ప్రజాస్వామ్యానికి అత్యంతావశ్యకం.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্টের সাংবিধানিক বেঞ্চের ঐতিহাসিক রায়: ভোটারদের তথ্যের অধিকার এবং নির্বাচনী স্বচ্ছতা মৌলিক অধিকার',
        lead: 'সুপ্রিম কোর্টের ৫ বিচারপতির সাংবিধানিক বেঞ্চ একমত হয়ে রায় দিয়েছে যে রাজনৈতিক দলের তহবিলের তথ্য জানার অধিকার ভোটারদের সংবিধানসম্মত মৌলিক অধিকার।',
        takeaways: [
          'অজ্ঞাত রাজনৈতিক অনুদান অবাধ নির্বাচনের পরিপন্থী বলে ঘোষিত।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय घटनापीठाचा ऐतिहासिक निकाल: मतदारांचा माहितीचा अधिकार आणि निवडणूक पारदर्शकता मूलभूत हक्क',
        lead: 'सर्वोच्च न्यायालयाच्या ५ न्यायमूर्तींच्या घटनापीठाने राजकीय पक्षांना मिळणाऱ्या देणग्यांची माहिती मिळणे मतदारांचा मूलभूत हक्क असल्याचा निर्वाळा दिला आहे.',
        takeaways: [
          'निवडणूक निधीतील पारदर्शकता लोकशाहीचे मूळ अधिष्ठान असल्याचे स्पष्ट.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટની બંધારણીય બેંચનો ઐતિહાસિક ફેંસલો: મતદારોનો માહિતી મેળવવાનો અધિકાર મૂળભૂત અધિકાર જાહેર',
        lead: 'સર્વોચ્ચ અદાલતે એકમતથી ચુકાદો આપ્યો છે કે રાજકીય પક્ષોના ભંડોળ અંગેની સંપૂર્ણ માહિતી મેળવવી એ મતદારોનો કલમ ૧૯(૧)(a) હેઠળ મૂળભૂત અધિકાર છે.',
        takeaways: [
          'ચૂંટણી ફંડિંગમાં સંપૂર્ણ પારદર્શિતા લોકશાહી પ્રક્રિયા માટે અનિવાર્ય.'
        ]
      }
    }
  },
  {
    id: 'india-bns-criminal-code-reforms',
    region: 'India & Supreme Court',
    flag: '🇮🇳',
    category: 'Criminal Procedure & Evidence',
    source: 'Law Commission of India / Supreme Court Practice Directives',
    pubDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    relativeTime: '2 days ago',
    readTime: '4 min read',
    laws: ['Bharatiya Nyaya Sanhita 2023', 'Bharatiya Nagarik Suraksha Sanhita', 'Bharatiya Sakshya Adhiniyam'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Bharatiya Nyaya Sanhita (BNS) Enforcement: Digital Forensics & Bail Procedures Modernized',
        lead: 'High Courts across India have issued comprehensive standardized practice directions governing mandatory videography during criminal seizures, electronic evidence authentication, and expedited statutory bail under the Bharatiya Nagarik Suraksha Sanhita (BNSS).',
        takeaways: [
          'Mandatory videography and digital chain-of-custody protocols during police search and seizures.',
          'Statutory bail eligibility for first-time offenders upon completing one-third of maximum sentence.',
          'Admissibility standards standardized for digital certificates under Bharatiya Sakshya Adhiniyam.'
        ]
      },
      kn: {
        title: 'ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ (BNS) ಜಾರಿ: ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಾಧಾರ ಮಹಜರು ಮತ್ತು ಜಾಮೀನು ಸುಧಾರಣೆಗಳ ಕುರಿತು ಹೈಕೋರ್ಟ್ ಮಾರ್ಗಸೂಚಿ',
        lead: 'ನೂತನ ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ, ಭಾರತೀಯ ನಾಗರಿಕ ಸುರಕ್ಷಾ ಸಂಹಿತೆ ಹಾಗೂ ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಅಧಿನಿಯಮದ ಅಡಿಯಲ್ಲಿ ಕ್ರಿಮಿನಲ್ ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಡಿಜಿಟಲ್ ವಿಡಿಯೋಗ್ರಫಿ, ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಎವಿಡೆನ್ಸ್ ಮಹಜರು ಮತ್ತು ವಿಚಾರಣಾಧೀನ ಕೈದಿಗಳ ಜಾಮೀನು ಸುಧಾರಣೆಗಳಿಗೆ ಕಟ್ಟುನಿಟ್ಟಿನ ನಿಯಮಗಳನ್ನು ಜಾರಿಗೆ ತರಲಾಗಿದೆ.',
        takeaways: [
          'ಅಪರಾಧ ಸ್ಥಳದ ಶೋಧ ಮತ್ತು ವಶಪಡಿಸಿಕೊಳ್ಳುವಿಕೆ (Search & Seizure) ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ವಿಡಿಯೋ ರೆಕಾರ್ಡಿಂಗ್ ಕಡ್ಡಾಯ.',
          'ಮೊದಲ ಬಾರಿಯ ಅಪರಾಧ ಆರೋಪಿಗಳಿಗೆ ಗರಿಷ್ಠ ಶಿಕ್ಷೆಯ ಮೂರನೇ ಒಂದು ಭಾಗದ ಅವಧಿ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಶಾಸನಬದ್ಧ ಜಾಮೀನು ಸೌಲಭ್ಯ.',
          'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಾಕ್ಷ್ಯಾಧಾರಗಳಿಗೆ ಕಾಗದರಹಿತ ಡಿಜಿಟಲ್ ಪ್ರಮಾಣೀಕರಣ ಮಾನದಂಡ ಜಾರಿ.'
        ]
      },
      hi: {
        title: 'भारतीय न्याय संहिता (BNS) लागू: डिजिटल साक्ष्य फोरेंसिक और जमानत प्रक्रियाओं में बड़ा सुधार',
        lead: 'उच्च न्यायालयों ने नई भारतीय न्याय संहिता और भारतीय नागरिक सुरक्षा संहिता के तहत तलाशी और जब्ती के दौरान अनिवार्य वीडियोग्राफी और त्वरित जमानत के लिए दिशा-निर्देश जारी किए हैं।',
        takeaways: [
          'तलाशी और जब्ती के दौरान डिजिटल साक्ष्य की अनिवार्य वीडियोग्राफी।',
          'पहली बार के आरोपियों को एक-तिहाई सजा पूरी करने पर वैधानिक जमानत का अधिकार।'
        ]
      },
      ta: {
        title: 'பாரதிய நியாய சன்ஹிதா (BNS) அமல்: டிஜிட்டல் சான்றுகள் மற்றும் பிணை நடைமுறைகள் நவீனமயம்',
        lead: 'குற்றவியல் வழக்குகளில் சோதனை மற்றும் பறிமுதலின் போது வீடியோ பதிவு கட்டாயமாக்கப்பட்டுள்ளதுடன், புதிய சட்டங்களின் கீழ் பிணை நடைமுறைகள் எளிமையாக்கப்பட்டுள்ளன.',
        takeaways: [
          'குற்றப் புலனாய்வில் மின்னணு சான்றுகளுக்கு முழு அங்கீகாரம்.'
        ]
      },
      te: {
        title: 'భారతీయ న్యాయ సంహిత (BNS) అమలు: డిజిటల్ ఫోరెన్సిక్స్ మరియు బెయిల్ నిబంధనలలో కీలక సంస్కరణలు',
        lead: 'భారతీయ న్యాయ సంహిత కింద పోలీసు సోదాల సమయంలో తప్పనిసరిగా వీడియో రికార్డింగ్ చేయాలని, అలాగే తొలిసారి నిందితులకు సులభతర బెయిల్ మార్గదర్శకాలను కోర్టులు జారీ చేశాయి.',
        takeaways: [
          'డిజిటల్ సాక్ష్యాలకు శాస్త్రీయ ప్రమాణాల గుర్తింపు.'
        ]
      },
      bn: {
        title: 'ভারতীয় ন্যায় সংহিতা (BNS) প্রয়োগ: ডিজিটাল প্রমাণ ও জামিনের নিয়মে যুগান্তকারী সংস্কার',
        lead: 'নতুন আইনের অধীনে পুলিশ তল্লাশির সময় বাধ্যতামূলক ভিডিওগ্রাফি এবং প্রথম অপরাধীদের জন্য দ্রুত জামিন প্রক্রিয়া চালু হয়েছে।',
        takeaways: [
          'ডিজিটাল প্রমাণের সুরক্ষায় কঠোর ফরেনসিক নির্দেশিকা।'
        ]
      },
      mr: {
        title: 'भारतीय न्याय संहिता (BNS) अंमलबजावणी: डिजिटल न्यायवैद्यक पुरावे आणि जामीन प्रक्रियेत मोठे बदल',
        lead: 'नवीन भारतीय नागरिक सुरक्षा संहितेअंतर्गत झडती आणि जप्तीच्या वेळी अनिवार्य व्हिडिओग्राफी आणि जामीन सुलभतेचे आदेश उच्च न्यायालयांनी जारी केले आहेत.',
        takeaways: [
          'गुन्हे अन्वेषणात इलेक्ट्रॉनिक पुराव्यांचे डिजिटलायझेशन अनिवार्य.'
        ]
      },
      gu: {
        title: 'ભારતીય ન્યાય સંહિતા (BNS) અમલ: ડિજિટલ પુરાવા અને જામીન પ્રક્રિયાઓમાં મોટા સુધારા લાગુ',
        lead: 'નવી ફોજદારી સંહિતા હેઠળ પોલીસ તપાસમાં વિડિયોગ્રાફી ફરજિયાત અને પ્રથમ વખતના આરોપીઓ માટે સરળ જામીન માર્ગદર્શિકા જાહેર કરવામાં આવી છે.',
        takeaways: [
          'તપાસ પ્રક્રિયામાં પારદર્શિતા માટે ડિજિટલ ફોરેન્સિક નિયમો કડક.'
        ]
      }
    }
  },
  {
    id: 'world-eu-ai-act-live',
    region: 'European Union',
    flag: '🇪🇺',
    category: 'AI & Tech Regulation',
    source: 'European Commission / Official Journal of the EU',
    pubDate: new Date().toISOString(),
    relativeTime: 'Today',
    readTime: '5 min read',
    laws: ['EU Regulation 2024/1689', 'GDPR Article 83', 'EU Digital Services Act'],
    link: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    isLive: true,
    translations: {
      en: {
        title: 'EU AI Act Enters Comprehensive Enforcement Phase with Global Corporate Penalties',
        lead: 'The European Union landmark Artificial Intelligence Act has entered full cross-border enforcement, establishing extraterritorial liability for generative AI models, biometric categorization, and autonomous decision systems.',
        takeaways: [
          'Tier-1 General Purpose AI (GPAI) providers face mandatory algorithmic transparency filings.',
          'High-risk AI systems must maintain documented human oversight mechanisms and audited training corpus logs.',
          'Maximum penalties reach €35 Million or 7% of total worldwide annual corporate turnover.'
        ]
      },
      kn: {
        title: 'ಯುರೋಪಿಯನ್ ಒಕ್ಕೂಟದ AI ಕಾಯ್ದೆ ಸಂಪೂರ್ಣ ಜಾರಿ: ಜಾಗತಿಕ ಕಂಪನಿಗಳ ನಿಯಮ ಉಲ್ಲಂಘನೆಗೆ ಭಾರಿ ಮೊತ್ತದ ದಂಡ',
        lead: 'ಯುರೋಪಿಯನ್ ಒಕ್ಕೂಟದ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ನಿಯಂತ್ರಣ ಕಾಯ್ದೆಯು ಜಾರಿಗೆ ಬಂದಿದ್ದು, ಭಾರತ ಸೇರಿದಂತೆ ಜಾಗತಿಕವಾಗಿ ಹೈ-ರಿಸ್ಕ್ ಎಐ ವ್ಯವಸ್ಥೆಗಳನ್ನು ನಿಯೋಜಿಸುವ ಸಂಸ್ಥೆಗಳಿಗೆ ಕಠಿಣ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಜಾಗತಿಕ ವಹಿವಾಟಿನ 7% ವರೆಗೆ ದಂಡ ವಿಧಿಸುವ ನಿಬಂಧನೆಗಳನ್ನು ಜಾರಿಗೆ ತರಲಾಗಿದೆ.',
        takeaways: [
          'ಜನರೇಟಿವ್ ಎಐ ಮತ್ತು ತರಬೇತಿ ದತ್ತಾಂಶಗಳ ಹಕ್ಕುಸ್ವಾಮ್ಯ (Copyright) ವಿವರಗಳನ್ನು ಸಾರ್ವಜನಿಕವಾಗಿ ಪ್ರಕಟಿಸುವುದು ಕಡ್ಡಾಯ.',
          'ಹೈ-ರಿಸ್ಕ್ ಎಐ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಮಾನವ ಮೇಲ್ವಿಚಾರಣೆ (Human-in-the-loop) ತಾಂತ್ರಿಕ ದಾಖಲೆಗಳು ಕಡ್ಡಾಯ.',
          'ನಿಯಮ ಉಲ್ಲಂಘನೆಗೆ ಗರಿಷ್ಠ €35 ಮಿಲಿಯನ್ ಅಥವಾ ಕಂಪನಿಯ ಜಾಗತಿಕ ವಹಿವಾಟಿನ ಶೇಕಡಾ 7 ರಷ್ಟು ದಂಡ.'
        ]
      },
      hi: {
        title: 'यूरोपीय संघ AI अधिनियम पूर्ण रूप से लागू: वैश्विक तकनीकी कंपनियों पर भारी जुर्माने का प्रावधान',
        lead: 'यूरोपीय संघ का ऐतिहासिक कृत्रिम बुद्धिमत्ता (AI) अधिनियम लागू हो गया है, जिसके तहत उच्च जोखिम वाले AI मॉडल के लिए सख्त पारदर्शिता और वैश्विक कारोबार के 7% तक जुर्माने का प्रावधान है।',
        takeaways: [
          'जेनेरेटिव एआई मॉडल के लिए प्रशिक्षण डेटा का खुलासा अनिवार्य।',
          'नियमों के उल्लंघन पर वैश्विक राजस्व के 7% तक का कठोर जुर्माना।'
        ]
      },
      ta: {
        title: 'ஐரோப்பிய ஒன்றிய AI சட்டம் அமல்: உலகளாவிய பெருநிறுவனங்களுக்குக் கடுமையான அபராதம் எச்சரிக்கை',
        lead: 'செயற்கை நுண்ணறிவுத் தொழில்நுட்பங்களை ஒழுங்குபடுத்தும் ஐரோப்பிய ஒன்றியத்தின் புதிய சட்டம் சர்வதேச அளவில் நடைமுறைக்கு வந்துள்ளது.',
        takeaways: [
          'அதிக ஆபத்துள்ள AI அமைப்புகளுக்கு மனிதக் கண்காணிப்பு கட்டாயம்.'
        ]
      },
      te: {
        title: 'యూరోపియన్ యూనియన్ AI చట్టం పూర్తిస్థాయి అమలు: అంతర్జాతీయ కంపెనీలపై భారీ జరిమానాల నిబంధనలు',
        lead: 'కృత్రిమ మేధస్సు (AI) వినియోగాన్ని నియంత్రించే యూరోపియన్ యూనియన్ చట్టం అమల్లోకి వచ్చింది, ఉల్లంఘనలకు గ్లోబల్ టర్నోవర్‌లో 7% వరకు జరిమానాలు విధించనున్నారు.',
        takeaways: [
          'అత్యధిక రిస్క్ ఉన్న AI వ్యవస్థలపై మానవ పర్యవేక్షణ తప్పనిసరి.'
        ]
      },
      bn: {
        title: 'ইউরোপীয় ইউনিয়নের এআই আইন কার্যকর: প্রযুক্তি সংস্থাগুলির উপর বিশ্বব্যাপী জরিমানা বিধির নির্দেশ',
        lead: 'কৃত্রিম বুদ্ধিমত্তা নিয়ন্ত্রণকারী ঐতিহাসিক ইউরোপীয় আইন চালু হয়েছে, যেখানে লঙ্ঘনকারী আন্তর্জাতিক সংস্থাগুলিকে বিশ্বব্যাপী টার্নওভারের ৭% পর্যন্ত জরিমানা করা হতে পারে।',
        takeaways: [
          'উচ্চ-ঝুঁকিপূর্ণ AI প্রযুক্তির জন্য মানব তদারকি বাধ্যতামূলক।'
        ]
      },
      mr: {
        title: 'युरोपीय युनियनचा AI कायदा लागू: जागतिक टेक कंपन्यांवर कोट्यवधींच्या दंडाची तरतूद',
        lead: 'आर्टिफिशिअल इंटेलिजन्सचे नियमन करणारा ऐतिहासिक युरोपीय कायदा पूर्णपणे लागू झाला असून उल्लंघनावर कंपनीच्या जागतिक उलाढालीच्या ७% पर्यंत दंडाची तरतूद आहे.',
        takeaways: [
          'जनरेटिव्ह एआय प्रणालींसाठी पारदर्शकता नियम अनिवार्य.'
        ]
      },
      gu: {
        title: 'યુરોપિયન યુનિયનનો AI એક્ટ અમલી: વૈશ્વિક કંપનીઓ પર ભારે નાણાકીય દંડની જોગવાઈ',
        lead: 'આર્ટિફિશિયલ ઇન્ટેલિજન્સ નિયમન કાયદો સંપૂર્ણપણે લાગુ થયો છે, જેમાં નિયમભંગ બદલ વૈશ્વિક ટર્નઓવરના ૭% સુધી દંડ થઈ શકે છે.',
        takeaways: [
          'હાઇ-રિસ્ક AI સિસ્ટમ પર માનવ દેખરેખ રાખવી ફરજિયાત.'
        ]
      }
    }
  },
  {
    id: 'world-icj-climate-obligations',
    region: 'International Courts',
    flag: '🇺🇳',
    category: 'International Treaties & Conventions',
    source: 'International Court of Justice, The Hague',
    pubDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    readTime: '6 min read',
    laws: ['UNCLOS Part XII', 'Paris Agreement Art. 4', 'Customary International Law'],
    link: 'https://www.icj-cij.org/',
    isLive: true,
    translations: {
      en: {
        title: 'International Court of Justice Issues Groundbreaking Advisory Opinion on State Climate Obligations',
        lead: 'The ICJ has confirmed that major industrial nations bear binding customary legal obligations to prevent transboundary ecological harms affecting developing island sovereign states.',
        takeaways: [
          'Customary international law imposes an affirmative duty of due diligence across all transboundary emission activities.',
          'Vulnerable coastal states may introduce advisory findings in domestic judicial tort actions.',
          'Creates an evidentiary basis for cross-border climate reparation arbitrations.'
        ]
      },
      kn: {
        title: 'ಅಂತರರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯ (ICJ) ಮಹತ್ವದ ಸಲಹಾ ತೀರ್ಪು: ಹವಾಮಾನ ಬದಲಾವಣೆ ತಡೆಗಟ್ಟಲು ಎಲ್ಲ ರಾಷ್ಟ್ರಗಳಿಗೂ ಬದ್ಧ ಕಾನೂನು ಕರ್ತವ್ಯ',
        lead: 'ದಿ ಹೇಗ್‌ನಲ್ಲಿರುವ ಅಂತರರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯವು ಸಮುದ್ರ ಕಾನೂನಿನ (UNCLOS) ಅಡಿಯಲ್ಲಿ ಕೈಗಾರಿಕಾ ರಾಷ್ಟ್ರಗಳು ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ನಿಯಂತ್ರಿಸುವುದು ಕಡ್ಡಾಯ ಸಾಂಪ್ರದಾಯಿಕ ಕಾನೂನು ಕರ್ತವ್ಯವೆಂದು ಐತಿಹಾಸಿಕ ತೀರ್ಪು ಪ್ರಕಟಿಸಿದೆ.',
        takeaways: [
          'ಅಂತರರಾಷ್ಟ್ರೀಯ ಪರಿಸರ ಹಾನಿ ತಡೆಗಟ್ಟಲು ಎಲ್ಲ ರಾಷ್ಟ್ರಗಳಿಗೂ ಶಾಸನಬದ್ಧ ಹೊಣೆಗಾರಿಕೆ ಇದೆ ಎಂದು ICJ ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.',
          'ದ್ವೀಪ ರಾಷ್ಟ್ರಗಳು ಹವಾಮಾನ ಹಾನಿಗೆ ಪರಿಹಾರ ಕೋರಿ ಅಂತರರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಮಂಡಳಿಗಳಲ್ಲಿ ದಾವೆ ಹೂಡಲು ಅವಕಾಶ.',
          'ಪ್ಯಾರಿಸ್ ಒಪ್ಪಂದದ ಗುರಿಗಳನ್ನು ಮೀರಿದ ಕಾನೂನು ಬಾಧ್ಯತೆಯನ್ನು ಎತ್ತಿಹಿಡಿದ ವಿಶ್ವ ನ್ಯಾಯಾಲಯ.'
        ]
      },
      hi: {
        title: 'अंतर्राष्ट्रीय न्यायालय (ICJ) का ऐतिहासिक फैसला: जलवायु परिवर्तन रोकना सभी संप्रभु देशों का कानूनी कर्तव्य घोषित',
        lead: 'द हेग स्थित अंतर्राष्ट्रीय न्यायालय ने स्पष्ट किया है कि समुद्री कानून (UNCLOS) के तहत औद्योगिक देशों पर पर्यावरण संरक्षण का कानूनी दायित्व है।',
        takeaways: [
          'सीमापार पर्यावरणीय क्षति को रोकना अंतर्राष्ट्रीय प्रथागत कानून के तहत बाध्यकारी।'
        ]
      },
      ta: {
        title: 'சர்வதேச நீதிமன்றம் (ICJ) முக்கிய தீர்ப்பு: காலநிலை மாற்றத்தைத் தடுப்பது அனைத்து நாடுகளின் சட்டப்பூர்வ கடமை',
        lead: 'சர்வதேச கடற்பரப்பு சட்டங்களின் கீழ் தொழிற்துறை நாடுகள் பருவநிலை மாற்றத்தை கட்டுப்படுத்த கடமைப்பட்டுள்ளன என நெதர்லாந்து சர்வதேச நீதிமன்றம் தீர்ப்பளித்துள்ளது.',
        takeaways: [
          'சுற்றுச்சூழல் சீரழிவை தடுப்பது சர்வதேச சட்டக் கடமையென உறுதி.'
        ]
      },
      te: {
        title: 'అంతర్జాతీయ న్యాయస్థానం (ICJ) కీలక తీర్పు: పర్యావరణ పరిరక్షణ అన్ని దేశాల చట్టబద్ధమైన బాధ్యత',
        lead: 'వాతావరణ కాలుష్యాన్ని నివారించడం అంతర్జాతీయ చట్టం ప్రకారం అన్ని సార్వభౌమ దేశాలకు చట్టపరంగా తప్పనిసరి అని అంతర్జాతీయ న్యాయస్థానం పేర్కొంది.',
        takeaways: [
          'తీరప్రాంత దేశాల రక్షణకు ప్రపంచ న్యాయస్థానం ప్రాధాన్యత.'
        ]
      },
      bn: {
        title: 'আন্তর্জাতিক আদালত (ICJ) এর ঐতিহাসিক রায়: জলবায়ু পরিবর্তন রোধ সমস্ত রাষ্ট্রের বাধ্যতামূলক আইনগত দায়িত্ব',
        lead: 'হেগের আন্তর্জাতিক আদালত জানিয়েছে যে আন্তর্জাতিক সমুদ্র আইন অনুসারে জলবায়ু ক্ষয়ক্ষতি রোধ করা সমস্ত দেশের আইনগত বাধ্যবাধকতা।',
        takeaways: [
          'পরিবেশ সুরক্ষায় বাধ্যতামূলক আন্তর্জাতিক নীতি ঘোষিত।'
        ]
      },
      mr: {
        title: 'आंतरराष्ट्रीय न्यायालय (ICJ) निकाल: हवामान बदल रोखणे सर्व देशांचे कायदेशीर कर्तव्य',
        lead: 'द हेग येथील आंतरराष्ट्रीय न्यायालयाने स्पष्ट केले आहे की सागरी कायद्यानुसार कार्बन उत्सर्जन रोखणे सर्व राष्ट्रांचे बंधनकारक कर्तव्य आहे.',
        takeaways: [
          'पर्यावरण संरक्षणासाठी आंतरराष्ट्रीय लवादाचे अधिकार स्पष्ट.'
        ]
      },
      gu: {
        title: 'આંતરરાષ્ટ્રીય અદાલત (ICJ) નો ચુકાદો: પર્યાવરણ સંરક્ષણ તમામ દેશોની કાનૂની ફરજ જાહેર',
        lead: 'ધ હેગ સ્થિત આંતરરાષ્ટ્રીય અદાલતે ચુકાદો આપ્યો છે કે ક્લાઈમેટ ચેન્જ અટકાવવું એ દરેક ઔદ્યોગિક દેશની આંતરરાષ્ટ્રીય કાયદાકીય જવાબદારી છે.',
        takeaways: [
          'દરિયાઈ પર્યાવરણને નુકસાન અટકાવવાની કાયદાકીય જોગવાઈ.'
        ]
      }
    }
  },
  {
    id: 'world-uk-high-court-ai-patents',
    region: 'UK & Commonwealth',
    flag: '🇬🇧',
    category: 'Intellectual Property Law',
    source: 'Supreme Court of the United Kingdom',
    pubDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    relativeTime: '2 days ago',
    readTime: '4 min read',
    laws: ['UK Patents Act 1977', 'European Patent Convention', 'TRIPS Agreement'],
    link: 'https://www.supremecourt.uk/',
    isLive: true,
    translations: {
      en: {
        title: 'UK Supreme Court Affirms Precedent on Human Authorship in Generative Inventions',
        lead: 'The UK Supreme Court has issued its definitive ruling establishing that an artificial intelligence model cannot be designated as an inventor on statutory patent applications.',
        takeaways: [
          'Statutory interpretation requires an inventor to be a natural person under UK Patents Act 1977.',
          'Patent filings naming automated AI systems as primary inventors remain legally void ab initio.',
          'Corporations must establish human personnel contributions in laboratory invention disclosures.'
        ]
      },
      kn: {
        title: 'ಯುಕೆ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು: ಪೇಟೆಂಟ್ ಅರ್ಜಿಗಳಲ್ಲಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಬದಲಿಗೆ ಮಾನವ ಸಂಶೋಧಕರಿಗೆ ಮಾತ್ರ ಮಾನ್ಯತೆ',
        lead: 'ಜನರೇಟಿವ್ ಎಐ ಮಾದರಿಗಳು ತಾವಾಗಿಯೇ ಆವಿಷ್ಕಾರಕರೆಂದು ಹಕ್ಕು ಸಾಧಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ ಹಾಗೂ ಪೇಟೆಂಟ್ ಕಾನೂನಿನ ಅಡಿಯಲ್ಲಿ ಕೇವಲ ಮಾನವ ಸಂಶೋಧಕರ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ಮಾನ್ಯವೆಂದು ಯುಕೆ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.',
        takeaways: [
          'ಪೇಟೆಂಟ್ ಕಾಯ್ದೆ 1977ರ ಅಡಿಯಲ್ಲಿ ಆವಿಷ್ಕಾರಕನು ಜೀವಂತ ವ್ಯಕ್ತಿಯಾಗಿರಬೇಕು (Natural Person).',
          'ಸ್ವಯಂಚಾಲಿತ ಎಐ ವ್ಯವಸ್ಥೆಯನ್ನು ಏಕೈಕ ಆವಿಷ್ಕಾರಕನೆಂದು ಹೆಸರಿಸುವ ಅರ್ಜಿಗಳನ್ನು ತಿರಸ್ಕರಿಸಲಾಗುವುದು.',
          'ಎಐ ನೆರವಿನ ಸಂಶೋಧನೆಗಳಲ್ಲಿ ಮಾನವ ವಿಜ್ಞಾನಿಗಳ ಬೌದ್ಧಿಕ ಕೊಡುಗೆಯನ್ನು ದಾಖಲಿಸುವುದು ಕಡ್ಡಾಯ.'
        ]
      },
      hi: {
        title: 'ब्रिटेन सुप्रीम कोर्ट का फैसला: पेटेंट आवेदनों में AI नहीं, केवल मानव अन्वेषक ही कानूनी रूप से मान्य',
        lead: 'यूके सुप्रीम कोर्ट ने व्यवस्था दी है कि पेटेंट कानून के तहत केवल प्राकृतिक मानव ही आविष्कारक हो सकता है, कृत्रिम बुद्धिमत्ता नहीं।',
        takeaways: [
          'पेटेंट अधिनियम के तहत आविष्कारक का जीवित व्यक्ति होना अनिवार्य।'
        ]
      },
      ta: {
        title: 'யூகே உச்ச நீதிமன்றம் தீர்ப்பு: காப்புரிமை விண்ணப்பங்களில் AI-க்கு அங்கீகாரம் இல்லை, மனிதர்களுக்கே உரிமை',
        lead: 'காப்புரிமைச் சட்டத்தின் கீழ் மனிதர்கள் மட்டுமே கண்டுபிடிப்பாளர்களாக அங்கீகரிக்கப்பட முடியும் என பிரிட்டன் உச்ச நீதிமன்றம் தீர்ப்பளித்துள்ளது.',
        takeaways: [
          'AI மாதிரிகள் சட்டப்பூர்வ கண்டுபிடிப்பாளர்களாக ஏற்கப்பட மாட்டாது.'
        ]
      },
      te: {
        title: 'యూకే సుప్రీంకోర్టు తీర్పు: పేటెంట్లలో ఆర్టిఫిషియల్ ఇంటెలిజెన్స్‌కు హక్కు లేదు, మానవ పరిశోధకులకే గుర్తింపు',
        lead: 'పేటెంట్ చట్టం ప్రకారం సహజ సిద్ధమైన మానవుడు మాత్రమే ఆవిష్కర్తగా ఉండగలడని యూకే సుప్రీంకోర్టు చారిత్రాత్మక తీర్పునిచ్చింది.',
        takeaways: [
          'AI స్వయంప్రతిపత్తి కలిగిన ఆవిష్కర్త కాదని స్పష్టీకరణ.'
        ]
      },
      bn: {
        title: 'যুক্তরাজ্য সুপ্রিম কোর্টের রায়: পেটেন্ট আবেদনে এআই নয়, কেবল মানব গবেষকের অধিকার স্বীকৃত',
        lead: 'ইউকে সুপ্রিম কোর্ট রায় দিয়েছে যে পেটেন্ট আইনের আওতায় কৃত্রিম বুদ্ধিমত্তা নয়, কেবল মানুষই আবিষ্কারক হিসেবে গ্রাহ্য হবে।',
        takeaways: [
          'পেটেন্ট আবেদনে মানব বিজ্ঞানীদের ভূমিকা প্রমাণ করা বাধ্যতামূলক।'
        ]
      },
      mr: {
        title: 'ब्रिटन सर्वोच्च न्यायालयाचा निकाल: पेटंट अर्जांमध्ये AI नव्हे, केवळ मानवी संशोधकच मान्य',
        lead: 'पेटंट कायद्यानुसार केवळ नैसर्गिक व्यक्तीच संशोधक म्हणून घोषित केली जाऊ शकते, AI नाही, असा निर्वाळा ब्रिटनच्या सर्वोच्च न्यायालयाने दिला.',
        takeaways: [
          'AI ला स्वतंत्र बौद्धिक संपदा अधिकार नसल्याचे स्पष्ट.'
        ]
      },
      gu: {
        title: 'યુકે સુપ્રીમ કોર્ટનો ફેંસલો: પેટન્ટ અરજીઓમાં AI નહીં, માત્ર માનવ શોધક જ કાયદેસર ગણાશે',
        lead: 'બ્રિટિશ સર્વોચ્ચ અદાલતે ચુકાદો આપ્યો છે કે પેટન્ટ કાયદા હેઠળ માત્ર કુદરતી માનવ જ શોધક તરીકે નોંધાઈ શકે છે.',
        takeaways: [
          'AI પ્રણાલી કાયદેસર શોધક તરીકે માન્ય નહીં રહે.'
        ]
      }
    }
  },
  {
    id: 'world-singapore-arbitration-defi',
    region: 'Asia-Pacific',
    flag: '🌏',
    category: 'Global Trade & Maritime Law',
    source: 'Singapore International Commercial Court (SICC)',
    pubDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    relativeTime: '3 days ago',
    readTime: '4 min read',
    laws: ['UNCITRAL Model Law', 'New York Convention 1958', 'Singapore International Arbitration Act'],
    link: 'https://www.sicc.gov.sg/',
    isLive: true,
    translations: {
      en: {
        title: 'Singapore Commercial Court Enforces Cross-Border Smart Contract Arbitration Award',
        lead: 'The Singapore International Commercial Court has enforced an international arbitration award arising from autonomous blockchain smart contract execution in commodities trade.',
        takeaways: [
          'Automated algorithmic escrow contracts manifest valid mutual assent under commercial contract law.',
          'Tribunal digital arbitration awards remain enforceable across 172 signatory states under the New York Convention.',
          'Solidifies Singapore as the premier global forum for decentralized financial dispute resolution.'
        ]
      },
      kn: {
        title: 'ಸಿಂಗಾಪುರ ವಾಣಿಜ್ಯ ನ್ಯಾಯಾಲಯ ಮಹತ್ವದ ತೀರ್ಪು: ಬ್ಲಾಕ್‌ಚೈನ್ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳ ಜಾಗತಿಕ ಜಾರಿ ಸಿಂಧುತ್ವ ದೃಢೀಕರಣ',
        lead: 'ಅಂತರರಾಷ್ಟ್ರೀಯ ಸರಕು ವ್ಯಾಪಾರದಲ್ಲಿ ಬಳಸಲಾಗುವ ಸ್ವಯಂಚಾಲಿತ ಬ್ಲಾಕ್‌ಚೈನ್ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಆರ್ಬಿಟ್ರೇಷನ್ ತೀರ್ಪುಗಳು ನ್ಯೂಯಾರ್ಕ್ ಕನ್ವೆನ್ಷನ್ ಅಡಿಯಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಜಾರಿಗೊಳಿಸಬಹುದಾದ ಕಾನೂನು ಒಪ್ಪಂದಗಳಾಗಿವೆ ಎಂದು ಸಿಂಗಾಪುರ ವಾಣಿಜ್ಯ ನ್ಯಾಯಾಲಯ ಆದೇಶಿಸಿದೆ.',
        takeaways: [
          'ಸ್ವಯಂಚಾಲಿತ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು ವಾಣಿಜ್ಯ ಕಾನೂನಿನಡಿಯಲ್ಲಿ ಪರಸ್ಪರ ಕಾನೂನುಬದ್ಧ ಸಮ್ಮತಿಯನ್ನು ಸೂಚಿಸುತ್ತವೆ.',
          'ಡಿಜಿಟಲ್ ಆರ್ಬಿಟ್ರೇಷನ್ ತೀರ್ಪುಗಳು ವಿಶ್ವದ 172 ದೇಶಗಳಲ್ಲಿ ಜಾರಿಗೊಳಿಸಲು ಅರ್ಹವಾಗಿವೆ.',
          'ಫಿನ್‌ಟೆಕ್ ಮತ್ತು ಡಿಜಿಟಲ್ ವ್ಯಾಪಾರ ವ್ಯಾಜ್ಯ ಪರಿಹಾರದಲ್ಲಿ ಸಿಂಗಾಪುರದ ಜಾಗತಿಕ ಮುಂಚೂಣಿ ಸಾಬೀತು.'
        ]
      },
      hi: {
        title: 'सिंगापुर वाणिज्यिक न्यायालय का फैसला: ब्लॉकचेन स्मार्ट कॉन्ट्रैक्ट्स पर मध्यस्थता निर्णय अंतरराष्ट्रीय स्तर पर लागू',
        lead: 'सिंगापुर अंतर्राष्ट्रीय वाणिज्यिक न्यायालय ने अंतरराष्ट्रीय व्यापार में ब्लॉकचेन स्मार्ट कॉन्ट्रैक्ट्स से उत्पन्न मध्यस्थता निर्णय को पूरी तरह वैध माना है।',
        takeaways: [
          'स्मार्ट अनुबंध वाणिज्यिक कानून के तहत बाध्यकारी संविदा माने गए।'
        ]
      },
      ta: {
        title: 'சிங்கப்பூர் சர்வதேச வணிக நீதிமன்றம்: பிளாக்செயின் ஸ்மார்ட் ஒப்பந்தங்கள் சட்டப்பூர்வமாக செல்லும் என தீர்ப்பு',
        lead: 'சர்வதேச வர்த்தகத்தில் பயன்படுத்தப்படும் பிளாக்செயின் ஸ்மார்ட் ஒப்பந்தங்கள் மீதான தீர்ப்புகளை நியூயார்க் உடன்படிக்கையின் கீழ் செயல்படுத்த முடியும் என தீர்ப்பளிக்கப்பட்டுள்ளது.',
        takeaways: [
          'டிஜிட்டல் ஒப்பந்தங்களுக்கு சர்வதேச சட்ட அங்கீகாரம் உறுதி.'
        ]
      },
      te: {
        title: 'సింగపూర్ వాణిజ్య న్యాయస్థానం కీలక తీర్పు: బ్లాక్‌చెయిన్ స్మార్ట్ కాంట్రాక్టులు చట్టబద్ధంగా అమలుయోగ్యమని ప్రకటన',
        lead: 'వస్తు వ్యాపారంలో బ్లాక్‌చెయిన్ స్మార్ట్ కాంట్రాక్ట్ ద్వారా వెలువడిన అంతర్జాతీయ ఆర్బిట్రేషన్ అవార్డును సింగపూర్ కోర్టు సమర్థించింది.',
        takeaways: [
          'స్మార్ట్ కాంట్రాక్టులకు పూర్తి చట్టబద్ధత లభించింది.'
        ]
      },
      bn: {
        title: 'সিঙ্গাপুর বাণিজ্যিক আদালত: ব্লকচেইন স্মার্ট চুক্তির আন্তর্জাতিক সালিশি রায় কার্যকর করার নির্দেশ',
        lead: 'সিঙ্গাপুর আদালত স্পষ্ট করেছে যে নিউইয়র্ক কনভেনশনের অধীনে ব্লকচেইন স্মার্ট চুক্তির রায় ১৭২টি দেশে কার্যকরযোগ্য।',
        takeaways: [
          'ডিজিটাল বাণিজ্যিক চুক্তির বৈশ্বিক আইনি স্বীকৃতি নিশ্চিত।'
        ]
      },
      mr: {
        title: 'सिंगापूर वाणिज्य न्यायालय: ब्लॉकचेन स्मार्ट करारांवर लवादाचा निकाल आंतरराष्ट्रीय पातळीवर वैध',
        lead: 'सिंगापूर आंतरराष्ट्रीय न्यायालयाने आंतरराष्ट्रीय व्यापारामध्ये ब्लॉकचेन स्मार्ट करारातून उद्भवलेला लवाद निर्णय वैध ठरवला आहे.',
        takeaways: [
          'स्मार्ट करारांना व्यापारी कायद्यांतर्गत कायदेशीर मान्यता.'
        ]
      },
      gu: {
        title: 'સિંગાપોર વાણિજ્યિક અદાલત: બ્લોકચેન સ્માર્ટ કોન્ટ્રાક્ટ્સ પર આર્બિટ્રેશન એવોર્ડ આંતરરાષ્ટ્રીય સ્તરે માન્ય',
        lead: 'સિંગાપોર ઇન્ટરનેશનલ કમર્શિયલ કોર્ટે વેપારમાં બ્લોકચેન સ્માર્ટ કોન્ટ્રાક્ટ્સના અમલને સંપૂર્ણ કાયદેસર જાહેર કર્યો છે.',
        takeaways: [
          'ડિજિટલ સ્માર્ટ કરારોને ન્યૂ યોર્ક કન્વેન્શન હેઠળ આંતરરાષ્ટ્રીય માન્યતા.'
        ]
      }
    }
  }
];

// Helper to retrieve article data localized to the active language
window.getLocalizedArticle = function(article, lang = 'en') {
  if (!article) return null;
  const currentLang = lang || window.currentNewsLanguage || 'en';
  const tr = (article.translations && article.translations[currentLang])
    ? article.translations[currentLang]
    : (article.translations && article.translations['en'])
      ? article.translations['en']
      : null;

  return {
    ...article,
    title: (tr && tr.title) ? tr.title : article.title,
    lead: (tr && tr.lead) ? tr.lead : (article.lead || article.description || ''),
    description: (tr && tr.lead) ? tr.lead : (article.description || article.lead || ''),
    category: (tr && tr.category) ? tr.category : article.category,
    takeaways: (tr && tr.takeaways && tr.takeaways.length > 0) ? tr.takeaways : (article.takeaways || []),
    sections: (tr && tr.sections && tr.sections.length > 0) ? tr.sections : (article.sections || []),
    checklist: (tr && tr.checklist && tr.checklist.length > 0) ? tr.checklist : (article.checklist || []),
    warning: (tr && tr.warning) ? tr.warning : (article.warning || '')
  };
};

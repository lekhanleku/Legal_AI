/* ================================================================
   LEGALAI — MULTILINGUAL INDIAN CONSTITUTIONAL LEGAL NEWS ENGINE
   100% Focused on the Constitution of India & Supreme Court Jurisprudence
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
    tickerLabel: 'CONSTITUTIONAL WIRE',
    searchPlaceholder: 'Search Indian Constitution articles, Supreme Court verdicts, fundamental rights...',
    wireActive: 'Constitutional Wire Active',
    refresh: 'Refresh Dispatches',
    allRegions: '🌐 All Constitutional Domains',
    fundamentalRights: '⚖️ Fundamental Rights (Part III)',
    article21Privacy: '🛡️ Art. 21 & Personal Liberty',
    karnatakaHighCourt: '🏛️ Karnataka & High Courts (Art. 226)',
    basicStructure: '🇮🇳 Basic Structure & Democracy',
    equalityJustice: '👥 Equality & Non-Discrimination (Art. 14-16)',
    federalism: '🤝 Federalism & State Autonomy (Art. 200)',
    constitutionalRemedies: '📜 Constitutional Writs (Art. 32 & 226)',
    readDispatch: 'Read Constitutional Analysis',
    askAi: 'Ask LegalAI',
    officialSource: 'Supreme Court Docket ↗',
    topDispatch: '🌟 LANDMARK CONSTITUTIONAL BENCH RULING',
    readFull: 'Read Full Constitutional Analysis',
    analyzeAi: 'Analyze with LegalAI',
    statutesCited: 'Constitutional Articles & Statutes Cited:',
    keyTakeaways: 'Core Constitutional Takeaways',
    backToArticles: 'All Constitutional Dispatches',
    listen: 'Listen',
    save: 'Save',
    share: 'Share',
    checklistHeading: 'Constitutional Compliance & Legal Checklist',
    disclaimerHeading: 'Constitutional Law Advisory & Precedent Guidance',
    practiceCta: 'Consult an Appellate Advocate →',
    aiCta: 'Ask LegalAI about this Constitutional Verdict'
  },
  kn: {
    readIn: 'ಭಾಷೆ ಆಯ್ಕೆ (Read In):',
    tickerLabel: 'ಸಾಂವಿಧಾನಿಕ ನೇರ ವರದಿ (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'ಭಾರತೀಯ ಸಂವಿಧಾನದ ವಿಧಿಗಳು, ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು, ಮೂಲಭೂತ ಹಕ್ಕುಗಳನ್ನು ಹುಡುಕಿ...',
    wireActive: 'ಸಾಂವಿಧಾನಿಕ ಲೈವ್ ವರದಿ ಸಕ್ರಿಯ',
    refresh: 'ವರದಿಗಳನ್ನು ನವೀಕರಿಸಿ',
    allRegions: '🌐 ಎಲ್ಲ ಸಾಂವಿಧಾನಿಕ ವಲಯಗಳು',
    fundamentalRights: '⚖️ ಮೂಲಭೂತ ಹಕ್ಕುಗಳು (ಭಾಗ 3)',
    article21Privacy: '🛡️ 21ನೇ ವಿಧಿ & ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯ',
    karnatakaHighCourt: '🏛️ ಕರ್ನಾಟಕ & ಉಚ್ಚ ನ್ಯಾಯಾಲಯಗಳು (ವಿಧಿ 226)',
    basicStructure: '🇮🇳 ಮೂಲ ಸಂರಚನೆ & ಪ್ರಜಾಪ್ರಭುತ್ವ',
    equalityJustice: '👥 ಸಮಾನತೆ & ತಾರತಮ್ಯ ವಿರೋಧ (ವಿಧಿ 14-16)',
    federalism: '🤝 ಒಕ್ಕೂಟ ವ್ಯವಸ್ಥೆ & ರಾಜ್ಯಗಳ ಅಧಿಕಾರ (ವಿಧಿ 200)',
    constitutionalRemedies: '📜 ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳು (ವಿಧಿ 32 & 226)',
    readDispatch: 'ಸಾಂವಿಧಾನಿಕ ವಿಶ್ಲೇಷಣೆ ಓದಿ',
    askAi: 'LegalAI ಗೆ ಕೇಳಿ',
    officialSource: 'ಅಧಿಕೃತ ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ದಾಖಲೆ ↗',
    topDispatch: '🌟 ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠದ ಐತಿಹಾಸಿಕ ತೀರ್ಪು',
    readFull: 'ಪೂರ್ಣ ಸಾಂವಿಧಾನಿಕ ವಿಶ್ಲೇಷಣೆ ಓದಿ',
    analyzeAi: 'LegalAI ನೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ',
    statutesCited: 'ಉಲ್ಲೇಖಿಸಲಾದ ಸಂವಿಧಾನದ ವಿಧಿಗಳು & ಕಾಯ್ದೆಗಳು:',
    keyTakeaways: 'ಪ್ರಮುಖ ಸಾಂವಿಧಾನಿಕ ಮುಖ್ಯಾಂಶಗಳು',
    backToArticles: 'ಎಲ್ಲ ಸಾಂವಿಧಾನಿಕ ವರದಿಗಳು',
    listen: 'ಆಲಿಸಿ',
    save: 'ಉಳಿಸಿ',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    checklistHeading: 'ಸಾಂವಿಧಾನಿಕ ಅನುಸರಣಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
    disclaimerHeading: 'ಶಾಸನಬದ್ಧ ಮುನ್ನೆಚ್ಚರಿಕೆ & ಸಾಂವಿಧಾನಿಕ ಮಾರ್ಗದರ್ಶನ',
    practiceCta: 'ಅನುಭವಿ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ →',
    aiCta: 'ಈ ಸಾಂವಿಧಾನಿಕ ತೀರ್ಪಿನ ಬಗ್ಗೆ LegalAI ಸಹಾಯಕನನ್ನು ಕೇಳಿ'
  },
  hi: {
    readIn: 'भाषा चुनें (Read In):',
    tickerLabel: 'संवैधानिक लाइव वायर (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'भारतीय संविधान के अनुच्छेद, सुप्रीम कोर्ट के संवैधानिक फैसले खोजें...',
    wireActive: 'संवैधानिक समाचार सक्रिय',
    refresh: 'ताज़ा करें',
    allRegions: '🌐 सभी संवैधानिक क्षेत्र',
    fundamentalRights: '⚖️ मौलिक अधिकार (भाग 3)',
    article21Privacy: '🛡️ अनु. 21 एवं व्यक्तिगत स्वतंत्रता',
    karnatakaHighCourt: '🏛️ कर्नाटक एवं उच्च न्यायालय (अनु. 226)',
    basicStructure: '🇮🇳 मूल संरचना एवं लोकतंत्र',
    equalityJustice: '👥 समानता एवं गैर-भेदभाव (अनु. 14-16)',
    federalism: '🤝 संघवाद एवं राज्यों के अधिकार (अनु. 200)',
    constitutionalRemedies: '📜 संवैधानिक उपचार (अनु. 32 एवं 226)',
    readDispatch: 'संवैधानिक विश्लेषण पढ़ें',
    askAi: 'LegalAI से पूछें',
    officialSource: 'आधिकारिक सुप्रीम कोर्ट रिकॉर्ड ↗',
    topDispatch: '🌟 सुप्रीम कोर्ट संविधान पीठ का ऐतिहासिक फैसला',
    readFull: 'संपूर्ण संवैधानिक विश्लेषण पढ़ें',
    analyzeAi: 'LegalAI से विश्लेषण करें',
    statutesCited: 'संवैधानिक अनुच्छेद एवं अधिनियम:',
    keyTakeaways: 'प्रमुख संवैधानिक निष्कर्ष',
    backToArticles: 'सभी संवैधानिक रिपोर्ट',
    listen: 'सुनें',
    save: 'सहेजें',
    share: 'साझा करें',
    checklistHeading: 'संवैधानिक अनुपालन चेकलिस्ट',
    disclaimerHeading: 'संवैधानिक सलाह एवं पूर्वोदाहरण मार्गदर्शन',
    practiceCta: 'अधिवक्ता से परामर्श करें →',
    aiCta: 'इस संवैधानिक फैसले पर LegalAI से पूछें'
  },
  ta: {
    readIn: 'மொழியைத் தேர்வுசெய்க (Read In):',
    tickerLabel: 'அரசியலமைப்பு நேரலை (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'இந்திய அரசியலமைப்பு விதிகள், உச்ச நீதிமன்ற தீர்ப்புகளைத் தேடுக...',
    wireActive: 'அரசியலமைப்பு நேரலை செயலில் உள்ளது',
    refresh: 'புதுப்பிக்குக',
    allRegions: '🌐 அனைத்து அரசியலமைப்புப் பிரிவுகள்',
    fundamentalRights: '⚖️ அடிப்படை உரிமைகள் (பகுதி 3)',
    article21Privacy: '🛡️ பிரிவு 21 & தனிநபர் சுதந்திரம்',
    karnatakaHighCourt: '🏛️ கர்நாடகா & உயர் நீதிமன்றங்கள் (பிரிவு 226)',
    basicStructure: '🇮🇳 அடிப்படை கட்டமைப்பு & ஜனநாயகம்',
    equalityJustice: '👥 சமத்துவம் & பாகுபாடின்மை (பிரிவு 14-16)',
    federalism: '🤝 கூட்டாட்சி & மாநில சுயாட்சி (பிரிவு 200)',
    constitutionalRemedies: '📜 அரசியலமைப்புப் பரிகாரங்கள் (பிரிவு 32 & 226)',
    readDispatch: 'அரசியலமைப்புப் பகுப்பாய்வைப் படிக்க',
    askAi: 'LegalAI இடம் கேட்க',
    officialSource: 'அதிகாரப்பூர்வ உச்ச நீதிமன்ற ஆவணம் ↗',
    topDispatch: '🌟 அரசியலமைப்பு அமர்வின் வரலாற்றுத் தீர்ப்பு',
    readFull: 'முழு அரசியலமைப்பு பகுப்பாய்வைப் படிக்க',
    analyzeAi: 'LegalAI உடன் ஆராய்க',
    statutesCited: 'அரசியலமைப்புப் பிரிவுகள் & சட்டங்கள்:',
    keyTakeaways: 'முக்கிய அரசியலமைப்பு அம்சங்கள்',
    backToArticles: 'அனைத்து செய்திகள்',
    listen: 'கேட்க',
    save: 'சேமிக்க',
    share: 'பகிர்க',
    checklistHeading: 'அரசியலமைப்பு இணக்க சரிபார்ப்புப் பட்டியல்',
    disclaimerHeading: 'சட்ட வழிகாட்டல் & எச்சரிக்கை',
    practiceCta: 'வழக்கறிஞரிடம் ஆலோசனை பெற →',
    aiCta: 'இந்தத் தீர்ப்பு குறித்து LegalAI இடம் கேட்க'
  },
  te: {
    readIn: 'భాషను ఎంచుకోండి (Read In):',
    tickerLabel: 'రాజ్యాంగ ప్రత్యక్ష వార్తలు (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'భారత రాజ్యాంగ అధికరణలు, సుప్రీంకోర్టు తీర్పులను శోధించండి...',
    wireActive: 'రాజ్యాంగ వైర్ క్రియాశీలంగా ఉంది',
    refresh: 'తాజాకరించు',
    allRegions: '🌐 అన్ని రాజ్యాంగ విభాగాలు',
    fundamentalRights: '⚖️ ప్రాథమిక హక్కులు (భాగం 3)',
    article21Privacy: '🛡️ అధికరణ 21 & వ్యక్తిగత స్వేచ్ఛ',
    karnatakaHighCourt: '🏛️ కర్ణాటక & హైకోర్టులు (అధికరణ 226)',
    basicStructure: '🇮🇳 మౌలిక స్వరూపం & ప్రజాస్వామ్యం',
    equalityJustice: '👥 సమానత్వం & వివక్ష రహితం (అధికరణ 14-16)',
    federalism: '🤝 సమాఖ్య వ్యవస్థ & రాష్ట్రాల అధికారాలు (అధికరణ 200)',
    constitutionalRemedies: '📜 రాజ్యాంగ పరిహారాలు (అధికరణ 32 & 226)',
    readDispatch: 'రాజ్యాంగ విశ్లేషణను చదవండి',
    askAi: 'LegalAI ని అడగండి',
    officialSource: 'అధికారిక సుప్రీంకోర్టు రికార్డు ↗',
    topDispatch: '🌟 సుప్రీంకోర్టు రాజ్యాంగ ధర్మాసనం చారిత్రాత్మక తీర్పు',
    readFull: 'పూర్తి రాజ్యాంగ విశ్లేషణను చదవండి',
    analyzeAi: 'LegalAI తో విశ్లేషించండి',
    statutesCited: 'ప్రస్తావించిన రాజ్యాంగ అధికరణలు & చట్టాలు:',
    keyTakeaways: 'కీలక రాజ్యాంగ ముఖ్యాంశాలు',
    backToArticles: 'అన్ని నివేదికలు',
    listen: 'వినండి',
    save: 'భద్రపరచు',
    share: 'భాగస్వామ్యం',
    checklistHeading: 'రాజ్యాంగ అనుసరణ తనిఖీ జాబితా',
    disclaimerHeading: 'చట్టపరమైన మార్గదర్శకత్వం & హెచ్చరిక',
    practiceCta: 'న్యాయవాదిని సంప్రదించండి →',
    aiCta: 'ఈ తీర్పు గురించి LegalAI ని అడగండి'
  },
  bn: {
    readIn: 'ভাষা নির্বাচন করুন (Read In):',
    tickerLabel: 'সাংবিধানিক লাইভ ওয়্যার (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'ভারতের সংবিধানের অনুচ্ছেদ, সুপ্রিম কোর্টের সাংবিধানিক রায় খুঁজুন...',
    wireActive: 'সাংবিধানিক পরিষেবা সক্রিয়',
    refresh: 'রিফ্রেশ',
    allRegions: '🌐 সমস্ত সাংবিধানিক ক্ষেত্র',
    fundamentalRights: '⚖️ মৌলিক অধিকার (অংশ ৩)',
    article21Privacy: '🛡️ অনুচ্ছেদ ২১ ও ব্যক্তিগত স্বাধীনতা',
    karnatakaHighCourt: '🏛️ কর্ণাটক ও হাইকোর্ট (অনুচ্ছেদ ২২৬)',
    basicStructure: '🇮🇳 মূল কাঠামো ও গণতন্ত্র',
    equalityJustice: '👥 সমতা ও বৈষম্যহীনতা (অনুচ্ছেদ ১৪-১৬)',
    federalism: '🤝 যুক্তরাষ্ট্রীয় ব্যবস্থা ও রাজ্যের অধিকার (অনুচ্ছেদ ২০০)',
    constitutionalRemedies: '📜 সাংবিধানিক প্রতিকার (অনুচ্ছেদ ৩২ ও ২২৬)',
    readDispatch: 'সাংবিধানিক বিশ্লেষণ পড়ুন',
    askAi: 'LegalAI কে জিজ্ঞাসা করুন',
    officialSource: 'অফিসিয়াল সুপ্রিম কোর্ট রেকর্ড ↗',
    topDispatch: '🌟 সুপ্রিম কোর্টের সংবিধান বেঞ্চের ঐতিহাসিক রায়',
    readFull: 'সম্পূর্ণ সাংবিধানিক বিশ্লেষণ পড়ুন',
    analyzeAi: 'LegalAI দিয়ে বিশ্লেষণ করুন',
    statutesCited: 'উল্লেখিত সংবিধানের অনুচ্ছেদ ও আইন:',
    keyTakeaways: 'মূল সাংবিধানিক দিকসমূহ',
    backToArticles: 'সমস্ত সাংবিধানिक প্রতিবেদন',
    listen: 'শুনুন',
    save: 'সংরক্ষণ',
    share: 'শেয়ার',
    checklistHeading: 'সাংবিধানিক সম্মতি চেকলিস্ট',
    disclaimerHeading: 'আইনি পরামর্শ ও সতর্কতা',
    practiceCta: 'আইনজীবীর পরামর্শ নিন →',
    aiCta: 'এই রায় সম্পর্কে LegalAI কে জিজ্ঞাসা করুন'
  },
  mr: {
    readIn: 'भाषा निवडा (Read In):',
    tickerLabel: 'संवैधानिक थेट बातम्या (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'भारतीय राज्यघटनेची कलमे, सर्वोच्च न्यायालयाचे घटनापीठाचे निकाल शोधा...',
    wireActive: 'संवैधानिक सेवा सुरू आहे',
    refresh: 'ताजे करा',
    allRegions: '🌐 सर्व घटनात्मक विभाग',
    fundamentalRights: '⚖️ मूलभूत हक्क (भाग ३)',
    article21Privacy: '🛡️ कलम २१ आणि वैयक्तिक स्वातंत्र्य',
    karnatakaHighCourt: '🏛️ कर्नाटक आणि उच्च न्यायालये (कलम २२६)',
    basicStructure: '🇮🇳 मूलभूत चौकट आणि लोकशाही',
    equalityJustice: '👥 समता आणि भेदभावमुक्ती (कलम १४-१६)',
    federalism: '🤝 संघराज्य आणि राज्यांचे अधिकार (कलम २००)',
    constitutionalRemedies: '📜 घटनात्मक उपाययोजना (कलम ३२ व २२६)',
    readDispatch: 'संवैधानिक विश्लेषण वाचा',
    askAi: 'LegalAI ला विचारा',
    officialSource: 'अधिकृत सर्वोच्च न्यायालय नोंद ↗',
    topDispatch: '🌟 सर्वोच्च न्यायालयाच्या घटनापीठाचा ऐतिहासिक निकाल',
    readFull: 'संपूर्ण घटनात्मक विश्लेषण वाचा',
    analyzeAi: 'LegalAI द्वारे विश्लेषण करा',
    statutesCited: 'उल्लेखित राज्यघटनेची कलमे आणि कायदे:',
    keyTakeaways: 'महत्त्वाचे घटनात्मक मुद्दे',
    backToArticles: 'सर्व घटनात्मक वृत्ते',
    listen: 'ऐका',
    save: 'जतन करा',
    share: 'शेअर करा',
    checklistHeading: 'घटनात्मक अनुपालन तपासणी यादी',
    disclaimerHeading: 'वैधानिक मार्गदर्शक इशारा',
    practiceCta: 'वकिलांचा सल्ला घ्या →',
    aiCta: 'या निकालावर LegalAI ला विचारा'
  },
  gu: {
    readIn: 'ભાષા પસંદ કરો (Read In):',
    tickerLabel: 'બંધારણીય લાઇવ સમાચાર (CONSTITUTIONAL WIRE)',
    searchPlaceholder: 'ભારતના બંધારણની કલમો, સુપ્રીમ કોર્ટના બંધારણીય ચુકાદા શોધો...',
    wireActive: 'બંધારણીય સેવા સક્રિય',
    refresh: 'તાજું કરો',
    allRegions: '🌐 તમામ બંધારણીય ક્ષેત્રો',
    fundamentalRights: '⚖️ મૂળભૂત અધિકારો (ભાગ ૩)',
    article21Privacy: '🛡️ અનુચ્છેદ ૨૧ અને અંગત સ્વતંત્રતા',
    karnatakaHighCourt: '🏛️ કર્ણાટક અને વડી અદાલતો (અનુચ્છેદ ૨૨૬)',
    basicStructure: '🇮🇳 મૂળભૂત માળખું અને લોકશાહી',
    equalityJustice: '👥 સમાનતા અને બિન-ભેદભાવ (અનુચ્છેદ ૧૪-૧૬)',
    federalism: '🤝 સંઘવાદ અને રાજ્યોની સ્વાયત્તતા (અનુચ્છેદ ૨૦૦)',
    constitutionalRemedies: '📜 બંધારણીય ઉપાયો (અનુચ્છેદ ૩૨ અને ૨૨૬)',
    readDispatch: 'બંધારણીય વિશ્લેષણ વાંચો',
    askAi: 'LegalAI ને પૂછો',
    officialSource: 'સત્તાવાર સુપ્રીમ કોર્ટ રેકોર્ડ ↗',
    topDispatch: '🌟 સુપ્રીમ કોર્ટ બંધારણીય ખંડપીઠનો ઐતિહાસિક ચુકાદો',
    readFull: 'સંપૂર્ણ બંધારણીય વિશ્લેષણ વાંચો',
    analyzeAi: 'LegalAI સાથે વિશ્લેષણ કરો',
    statutesCited: 'સંદર્ભિત બંધારણીય અનુચ્છેદો અને કાયદા:',
    keyTakeaways: 'મુખ્ય બંધારણીય મુદ્દાઓ',
    backToArticles: 'તમામ બંધારણીય અહેવાલો',
    listen: 'સાંભળો',
    save: 'સાચવો',
    share: 'શેર કરો',
    checklistHeading: 'બંધારણીય પાલન ચેકલિસ્ટ',
    disclaimerHeading: 'કાનૂની માર્ગદર્શન અને ચેતવણી',
    practiceCta: 'નિષ્ણાત વકીલની સલાહ લો →',
    aiCta: 'આ ચુકાદા વિશે LegalAI ને પૂછો'
  }
};

// ── 100% Indian Constitutional Law Legal Dispatches Dataset ──
window.MULTILINGUAL_LEGAL_ARTICLES = [
  {
    id: 'india-const-article21-privacy-dpdp',
    region: 'Fundamental Rights (Part III)',
    flag: '🇮🇳',
    category: 'Article 21 & Privacy Jurisprudence',
    source: 'Supreme Court of India (Constitution Bench)',
    pubDate: new Date().toISOString(),
    relativeTime: 'Today',
    readTime: '5 min read',
    laws: ['Constitution of India Art. 21', 'Constitution of India Art. 32', 'Digital Personal Data Protection Act, 2023'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Constitution Bench Expands Article 21 Right to Privacy to Enforce Zero-Knowledge Digital Autonomy',
        lead: 'Reaffirming the landmark Puttaswamy doctrine, the Supreme Court of India holds that Article 21 guarantees informational self-determination, mandating affirmative corporate data minimization and penalties up to ₹250 Crores.',
        category: 'Article 21 & Privacy Jurisprudence',
        takeaways: [
          'Informational privacy and algorithmic autonomy are inalienable fundamental rights under Article 21 of the Indian Constitution.',
          'Data Fiduciaries face statutory penalties up to ₹250 Crores for systemic personal data breaches.',
          'Mandatory parental consent architecture required for processing personal data of minors and children.'
        ],
        sections: [
          {
            heading: 'Informational Self-Determination as an Inalienable Facet of Article 21',
            paragraphs: [
              'The Constitution Bench emphasized that personal liberty under Article 21 extends seamlessly into cyberspace. Every citizen possesses an inviolable constitutional entitlement to control their personal, biometric, and behavioural data trail.',
              'The Court ruled that state and corporate algorithmic profiling without explicit, informed consent constitutes an ultra vires encroachment upon bodily and digital autonomy.'
            ]
          },
          {
            heading: 'Constitutional Proportionality Standards for Data Processing',
            paragraphs: [
              'Applying the four-pronged proportionality test (Legitimate Goal, Rational Connection, Necessity, and Balancing), the bench affirmed that non-consensual biometric processing fails constitutional scrutiny.',
              'Enterprises deploying artificial intelligence or high-risk algorithmic scoring must maintain cryptographic audit trails proving statutory compliance.'
            ]
          }
        ],
        checklist: [
          'Implement end-to-end cryptographic consent management architectures across all user intake pipelines',
          'Appoint an independent Data Protection Officer (DPO) registered with the Data Protection Board of India',
          'Conduct periodic constitutional privacy impact assessments (DPIAs) prior to deploying machine learning models'
        ],
        warning: 'Failure to safeguard personal data under Article 21 and the DPDP Act 2023 attracts constitutional writ jurisdiction under Article 32 and regulatory penalties up to ₹250 Crores.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠ: 21ನೇ ವಿಧಿಯಡಿ ವೈಯಕ್ತಿಕ ಗೌಪ್ಯತೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಸ್ವಾಯತ್ತತೆಯ ರಕ್ಷಣೆ ದೃಢೀಕರಣ',
        lead: 'ಪುಟ್ಟಸ್ವಾಮಿ ಐತಿಹಾಸಿಕ ತೀರ್ಪನ್ನು ಮರುಸ್ಥಾಪಿಸಿದ ಭಾರತದ ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯ, ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯು ಮಾಹಿತಿ ಗೌಪ್ಯತೆಯನ್ನು ಮೂಲಭೂತ ಹಕ್ಕಾಗಿ ಖಾತರಿಪಡಿಸುತ್ತದೆ ಮತ್ತು ಉಲ್ಲಂಘನೆಗೆ ₹250 ಕೋಟಿವರೆಗೆ ದಂಡ ವಿಧಿಸಬಹುದು ಎಂದು ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.',
        category: '21ನೇ ವಿಧಿ ಮತ್ತು ಗೌಪ್ಯತೆ ಸಾಂವಿಧಾನಿಕ ನ್ಯಾಯಶಾಸ್ತ್ರ',
        takeaways: [
          'ಮಾಹಿತಿ ಗೌಪ್ಯತೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಸ್ವಾಯತ್ತತೆ ಭಾರತೀಯ ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಬೇರ್ಪಡಿಸಲಾಗದ ಮೂಲಭೂತ ಹಕ್ಕುಗಳಾಗಿವೆ.',
          'ವೈಯಕ್ತಿಕ ಡೇಟಾ ಉಲ್ಲಂಘನೆಗೆ ಕಾರ್ಪೊರೇಟ್ ಸಂಸ್ಥೆಗಳಿಗೆ ₹250 ಕೋಟಿವರೆಗೆ ಶಾಸನಬದ್ಧ ದಂಡ ವಿಧಿಸಲು ಆದೇಶಿಸಲಾಗಿದೆ.',
          'ಅಪ್ರಾಪ್ತ ವಯಸ್ಕರ ಡಿಜಿಟಲ್ ಸೇವೆಗಳಿಗೆ ಪೋಷಕರ ಕಡ್ಡಾಯ ಪರಿಶೀಲನಾ ಸಮ್ಮತಿ ವ್ಯವಸ್ಥೆ ಜಾರಿಗೆ ತರಬೇಕು.'
        ],
        sections: [
          {
            heading: '21ನೇ ವಿಧಿಯ ಅವಿಭಾಜ್ಯ ಅಂಗವಾಗಿ ಮಾಹಿತಿ ಸ್ವಾಯತ್ತತೆ',
            paragraphs: [
              'ಸಂವಿಧಾನ ಪೀಠವು 21ನೇ ವಿಧಿಯಡಿ ನೀಡಲಾದ ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯವು ಡಿಜಿಟಲ್ ಜಗತ್ತಿಗೂ ಸಮಗ್ರವಾಗಿ ಅನ್ವಯಿಸುತ್ತದೆ ಎಂದು ಪ್ರತಿಪಾದಿಸಿದೆ. ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನೂ ತನ್ನ ವೈಯಕ್ತಿಕ, ಬಯೋಮೆಟ್ರಿಕ್ ಮತ್ತು ವರ್ತನೆಯ ಡೇಟಾವನ್ನು ನಿಯಂತ್ರಿಸುವ ಸಂವಿಧಾನಬದ್ಧ ಹಕ್ಕನ್ನು ಹೊಂದಿದ್ದಾನೆ.',
              'ನಾಗರಿಕರ ಸ್ಪಷ್ಟ ಅನುಮತಿಯಿಲ್ಲದೆ ಸರ್ಕಾರ ಅಥವಾ ಖಾಸಗಿ ಕಂಪನಿಗಳು ಮಾಡುವ ಅಲ್ಗಾರಿದಮಿಕ್ ಪ್ರೊಫೈಲಿಂಗ್ ಸಂವಿಧಾನಬಾಹಿರ ಮತ್ತು ವ್ಯಕ್ತಿಗತ ಸ್ವಾಯತ್ತತೆಯ ಮೇಲಿನ ಅತಿಕ್ರಮಣವಾಗಿದೆ ಎಂದು ನ್ಯಾಯಾಲಯ ತೀರ್ಪು ನೀಡಿದೆ.'
            ]
          },
          {
            heading: 'ಸಾಂವಿಧಾನಿಕ ಪ್ರಮಾಣಬದ್ಧತೆಯ ಪರೀಕ್ಷೆ',
            paragraphs: [
              'ನ್ಯಾಯಾಲಯವು ನಾಲ್ಕು ಅಂಶಗಳ ಸಾಂವಿಧಾನಿಕ ಪ್ರಮಾಣಬದ್ಧತೆಯ ಪರೀಕ್ಷೆಯನ್ನು ಅನ್ವಯಿಸಿ, ಸಮ್ಮತಿಯಿಲ್ಲದ ಬಯೋಮೆಟ್ರಿಕ್ ಡೇಟಾ ಸಂಸ್ಕರಣೆಯು ಸಂವಿಧಾನ ವಿರೋಧಿಯಾಗಿದೆ ಎಂದು ತೀರ್ಪು ನೀಡಿದೆ.',
              'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಬಳಸುವ ಪ್ರತಿಯೊಂದು ಕಂಪನಿಯು ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಮಂಡಳಿಯ ನಿಯಮಗಳಿಗೆ ಬದ್ಧವಾಗಿ ಲೆಕ್ಕಪರಿಶೋಧನೆ ನಡೆಸಬೇಕು.'
            ]
          }
        ],
        checklist: [
          'ಬಳಕೆದಾರರ ಡೇಟಾ ಸಂಗ್ರಹಣೆಯಲ್ಲಿ ಸಂಪೂರ್ಣ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾದ ಸಮ್ಮತಿ ವ್ಯವಸ್ಥೆಯನ್ನು ಜಾರಿಗೆ ತನ್ನಿ',
          'ಭಾರತೀಯ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಮಂಡಳಿಯಲ್ಲಿ ನೋಂದಾಯಿತ ಸ್ವತಂತ್ರ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಅಧಿಕಾರಿಯನ್ನು (DPO) ನೇಮಿಸಿ',
          'AI ಮತ್ತು ಯಂತ್ರ ಕಲಿಕೆ ಮಾದರಿಗಳನ್ನು ನಿಯೋಜಿಸುವ ಮುನ್ನ ಸಾಂವಿಧಾನಿಕ ಗೌಪ್ಯತೆ ಪ್ರಭಾವದ ಮೌಲ್ಯಮಾಪನ ನಡೆಸಿ'
        ],
        warning: '21ನೇ ವಿಧಿ ಮತ್ತು DPDP ಕಾಯ್ದೆಯಡಿ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣೆಯಲ್ಲಿ ವಿಫಲವಾದರೆ ಸುಪ್ರೀಂ ಕೋರ್ಟ್‌ನಲ್ಲಿ 32ನೇ ವಿಧಿಯಡಿ ರಿಟ್ ಅರ್ಜಿ ಮತ್ತು ₹250 ಕೋಟಿವರೆಗೆ ದಂಡ ವಿಧಿಸಲಾಗುವುದು.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट संविधान पीठ: अनुच्छेद 21 के तहत निजता और डिजिटल स्वायत्तता का मौलिक अधिकार सुदृढ़',
        lead: 'ऐतिहासिक पुट्टास्वामी निर्णय की पुष्टि करते हुए सर्वोच्च न्यायालय ने व्यवस्था दी कि अनुच्छेद 21 सूचनात्मक निजता की गारंटी देता है, जिसके उल्लंघन पर ₹250 करोड़ तक का जुर्माना हो सकता है।',
        category: 'अनुच्छेद 21 एवं निजता संवैधानिक न्यायशास्त्र',
        takeaways: [
          'सूचनात्मक निजता और डिजिटल स्वायत्तता अनुच्छेद 21 के तहत अहरणीय मौलिक अधिकार हैं।',
          'डेटा सुरक्षा में चूक पर कंपनियों पर ₹250 करोड़ तक के भारी जुर्माने का प्रावधान।',
          'नाबालिगों के डेटा उपयोग के लिए माता-पिता की सत्यापनीय सहमति अनिवार्य।'
        ],
        sections: [
          {
            heading: 'अनुच्छेद 21 के अंतर्गत सूचनात्मक आत्मनिर्णय का अधिकार',
            paragraphs: [
              'संविधान पीठ ने रेखांकित किया कि अनुच्छेद 21 का व्यक्तिगत स्वतंत्रता का अधिकार डिजिटल जगत में भी समान रूप से लागू होता है। प्रत्येक नागरिक को अपने निजी डेटा पर पूर्ण नियंत्रण का संवैधानिक अधिकार है।',
              'नागरिकों की स्वतंत्र सहमति के बिना डेटा संग्रह और एल्गोरिथमिक प्रोफाइलिंग को अदालत ने असंवैधानिक करार दिया।'
            ]
          }
        ],
        checklist: [
          'समस्त डेटा प्रणालियों में एंड-टू-एंड एन्क्रिप्टेड सहमति तंत्र लागू करें',
          'डेटा संरक्षण बोर्ड के तहत स्वतंत्र डेटा संरक्षण अधिकारी (DPO) की नियुक्ति करें'
        ],
        warning: 'अनुच्छेद 21 और डीपीडीपी अधिनियम का उल्लंघन करने पर अनुच्छेद 32 के तहत रिट याचिका और ₹250 करोड़ तक का जुर्माना लगाया जा सकता है।'
      },
      ta: {
        title: 'உச்ச நீதிமன்ற அரசியலமைப்பு அமர்வு: பிரிவு 21-ன் கீழ் தனிநபர் தனியுரிமை மற்றும் டிஜிட்டல் சுயாட்சி உறுதி',
        lead: 'புட்டாசுவாமி தீர்ப்பை மீண்டும் உறுதிப்படுத்திய உச்ச நீதிமன்றம், பிரிவு 21 தகவல் தனியுரிமையை அடிப்படை உரிமையாக வழங்குகிறது என்றும் மீறினால் ₹250 கோடி வரை அபராதம் விதிக்கப்படும் என்றும் தீர்ப்பளித்துள்ளது.',
        category: 'பிரிவு 21 & தனியுரிமை நீதித்துறை',
        takeaways: [
          'தகவல் தனியுரிமை பிரிவு 21-ன் கீழ் அடிப்படை உரிமையாகும்.',
          'நிறுவனங்கள் தரவு மீறல்களுக்கு ₹250 கோடி வரை அபராதம் எதிர்கொள்ள நேரிடும்.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు రాజ్యాంగ ధర్మాసనం: అధికరణ 21 కింద వ్యక్తిగత గోప్యత మరియు డిజిటల్ స్వేచ్ఛ ధృవీకరణ',
        lead: 'పుట్టస్వామి తీర్పును పునరుద్ఘాటిస్తూ సుప్రీంకోర్టు, అధికరణ 21 కింద గోప్యత ప్రాథమిక హక్కు అని మరియు ఉల్లంఘిస్తే ₹250 కోట్ల వరకు జరిమానా ఉంటుందని తీర్పు ఇచ్చింది.',
        category: 'అధికరణ 21 & గోప్యతా న్యాయశాస్త్రం',
        takeaways: [
          'సమాచార గోప్యత అధికరణ 21 కింద విడదీయరాని ప్రాథమిక హక్కు.',
          'నిబంధనల ఉల్లంఘనకు కార్పొరేట్ సంస్థలపై ₹250 కోట్ల వరకు జరిమానా.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্টের সংবিধান বেঞ্চ: অনুচ্ছেদ ২১ এর অধীনে গোপনীয়তা ও ডিজিটাল স্বায়ত্তশাসন নিশ্চিত',
        lead: 'ঐতিহাসিক পুট্টাস্বামী রায়ের পুনরাবৃত্তি করে শীর্ষ আদালত জানিয়েছে যে অনুচ্ছেদ ২১ অনুযায়ী ব্যক্তিগত তথ্যের গোপনীয়তা একটি মৌলিক অধিকার।',
        category: 'অনুচ্ছেদ ২১ ও গোপনীয়তা বিচারব্যবস্থা',
        takeaways: [
          'তথ্যগত গোপনীয়তা অনুচ্ছেদ ২১ এর অধীনে অবিচ্ছেদ্য মৌলিক অধিকার।',
          'তথ্য ফাঁসের দায়ে কর্পোরেট সংস্থাকে ₹২৫০ কোটি পর্যন্ত জরিমানা।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय घटनापीठ: कलम २१ अंतर्गत गोपनीयतेचा आणि डिजिटल स्वातंत्र्याचा मूलभूत अधिकार कायम',
        lead: 'पुट्टास्वामी निकालाचा पुनरुच्चार करत सर्वोच्च न्यायालयाने स्पष्ट केले की कलम २१ माहितीच्या गोपनीयतेची हमी देते आणि उल्लंघनावर ₹२५० कोटींपर्यंत दंड होऊ शकतो.',
        category: 'कलम २१ आणि गोपनीयता न्यायशास्त्र',
        takeaways: [
          'माहितीची गोपनीयता हा कलम २१ अंतर्गत मूलभूत हक्क आहे.',
          'डेटा सुरक्षेत हलगर्जीपणा केल्यास ₹२५० कोटींपर्यंत दंडाची तरतूद.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ બંધારણીય ખંડપીઠ: અનુચ્છેદ ૨૧ હેઠળ પ્રાઇવસી અને ડિજિટલ સ્વાયત્તતાનો મૂળભૂત અધિકાર સુરક્ષિત',
        lead: 'પુટ્ટસ્વામી ચુકાદાને પુનઃપુષ્ટ કરતા સુપ્રીમ કોર્ટે જણાવ્યું કે અનુચ્છેદ ૨૧ હેઠળ માહિતીની પ્રાઇવસી મૂળભૂત અધિકાર છે અને તેના ઉલ્લંઘન પર ₹૨૫૦ કરોડ સુધીનો દંડ થઈ શકે છે.',
        category: 'અનુચ્છેદ ૨૧ અને ગોપનીયતા ન્યાયશાસ્ત્ર',
        takeaways: [
          'માહિતીની ગોપનીયતા અનુચ્છેદ ૨૧ હેઠળ અભિન્ન મૂળભૂત અધિકાર છે.',
          'ડેટા ઉલ્લંઘન પર કંપનીઓને ₹૨૫૦ કરોડ સુધીનો કાનૂની દંડ.'
        ]
      }
    }
  },
  {
    id: 'india-const-karnataka-hc-article21-roads',
    region: 'Karnataka & High Courts (Art. 226)',
    flag: '🏛️',
    category: 'Constitutional Writs & Municipal Accountability',
    source: 'High Court of Karnataka (Principal Bench Bengaluru)',
    pubDate: new Date().toISOString(),
    relativeTime: 'Today',
    readTime: '4 min read',
    laws: ['Constitution of India Art. 226', 'Constitution of India Art. 21', 'Karnataka Municipal Corporations Act, 1976'],
    link: 'https://karnatakahighcourt.kar.nic.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Karnataka High Court Rules Pothole-Free Roads and Urban Safety are Inherent Article 21 Fundamental Rights',
        lead: 'A Division Bench of the High Court of Karnataka rules under Article 226 that citizens possess an enforceable fundamental right to safe, motorable roads under Article 21, establishing strict civic compensation liability.',
        category: 'Constitutional Writs & Municipal Accountability',
        takeaways: [
          'Access to pothole-free, motorable public roads is an integral guarantee of Article 21 Right to Life.',
          'BBMP and municipal civic commissioners held strictly liable under public constitutional tort law.',
          'Mandatory institutional compensation must be disbursed to accident victims within 45 days.'
        ],
        sections: [
          {
            heading: 'Article 21 and the Doctrine of Constitutional Public Torts',
            paragraphs: [
              'The High Court held that the Right to Life under Article 21 is not mere animal existence but encompasses the right to live with dignity and travel on safe municipal roads free from lethal hazards.',
              'The judges rejected municipal immunity defenses, holding that persistent civic negligence resulting in accidents amounts to a direct violation of constitutional guarantees remediable under Article 226.'
            ]
          },
          {
            heading: 'Judicial Directives on Time-Bound Restitution',
            paragraphs: [
              'The court mandated the establishment of a dedicated grievance and compensation cell where affected citizens or legal heirs can submit damage claims with hospital records and geolocation evidence.',
              'Senior civic officials face contempt proceedings under the Contempt of Courts Act for non-compliance with road resurfacing quality standards.'
            ]
          }
        ],
        checklist: [
          'Preserve date-stamped photographic evidence, FIR/traffic police reports, and medical treatment records',
          'File statutory notice of claim before the civic municipal legal redressal cell within 30 days',
          'Seek constitutional writ of mandamus under Article 226 before the High Court if compensation is delayed'
        ],
        warning: 'Municipal civic bodies cannot disclaim constitutional tort liability under Article 21 for infrastructural negligence causing grievous hurt or fatal injuries.'
      },
      kn: {
        title: 'ಕರ್ನಾಟಕ ಉಚ್ಚ ನ್ಯಾಯಾಲಯ: ಗುಂಡಿಮುಕ್ತ ರಸ್ತೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ 21ನೇ ವಿಧಿಯಡಿ ಸಂವಿಧಾನಬದ್ಧ ಮೂಲಭೂತ ಹಕ್ಕು',
        lead: 'ಕರ್ನಾಟಕ ಉಚ್ಚ ನ್ಯಾಯಾಲಯದ ವಿಭಾಗೀಯ ಪೀಠವು 226ನೇ ವಿಧಿಯಡಿ ಮಹತ್ವದ ತೀರ್ಪು ನೀಡಿ, ಗುಂಡಿಮುಕ್ತ ಮತ್ತು ಸುರಕ್ಷಿತ ರಸ್ತೆಗಳು ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯ ಜೀವಿಸುವ ಹಕ್ಕಿನ ಅವಿಭಾಜ್ಯ ಅಂಗವಾಗಿದೆ ಎಂದು ಘೋಷಿಸಿದೆ.',
        category: 'ಸಾಂವಿಧಾನಿಕ ರಿಟ್ ಮತ್ತು ನಾಗರಿಕ ಹೊಣೆಗಾರಿಕೆ',
        takeaways: [
          'ಗುಂಡಿಮುಕ್ತ ರಸ್ತೆಗಳಲ್ಲಿ ಸಂಚರಿಸುವುದು ಭಾರತೀಯ ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯಡಿ ನಾಗರಿಕರ ಮೂಲಭೂತ ಹಕ್ಕಾಗಿದೆ.',
          'ಬಿಬಿಎಂಪಿ ಮತ್ತು ಪಾಲಿಕೆ ಆಯುಕ್ತರು ಸಾಂವಿಧಾನಿಕ ಟಾರ್ಟ್ ಕಾನೂನಿನಡಿ ಕಡ್ಡಾಯ ಹೊಣೆಗಾರರಾಗಿದ್ದಾರೆ.',
          'ರಸ್ತೆ ಅಪಘಾತದಲ್ಲಿ ಗಾಯಗೊಂಡ ನಾಗರಿಕರಿಗೆ 45 ದಿನಗಳೊಳಗೆ ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರ ವಿತರಿಸಲು ಆದೇಶ.'
        ],
        sections: [
          {
            heading: '21ನೇ ವಿಧಿ ಮತ್ತು ಸಾಂವಿಧಾನಿಕ ನಾಗರಿಕ ಹೊಣೆಗಾರಿಕೆಯ ಸಿದ್ಧಾಂತ',
            paragraphs: [
              'ಉಚ್ಚ ನ್ಯಾಯಾಲಯವು 21ನೇ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಜೀವಿಸುವ ಹಕ್ಕು ಕೇವಲ ಬದುಕುಳಿಯುವುದಲ್ಲ, ಮಾನವೀಯ ಘನತೆ ಮತ್ತು ಸುರಕ್ಷಿತ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯವನ್ನು ಒಳಗೊಂಡಿದೆ ಎಂದು ಆದೇಶಿಸಿದೆ.',
              'ರಸ್ತೆ ಗುಂಡಿಗಳಿಂದಾಗುವ ಅಪಘಾತಗಳಿಗೆ ಪಾಲಿಕೆಯ ನಿರ್ಲಕ್ಷ್ಯವೇ ಕಾರಣವಾಗಿದ್ದು, ಇದು ನೇರವಾಗಿ ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯ ಉಲ್ಲಂಘನೆಯಾಗಿದೆ ಎಂದು ನ್ಯಾಯಾಲಯ ಹೇಳಿದೆ.'
            ]
          },
          {
            heading: 'ಸಮಯಬದ್ಧ ಪರಿಹಾರ ವಿತರಣೆಗೆ ನ್ಯಾಯಾಂಗ ನಿರ್ದೇಶನಗಳು',
            paragraphs: [
              'ಬಾಧಿತ ನಾಗರಿಕರು ಜಿಯೋಟ್ಯಾಗ್ ಫೋಟೋಗಳು, ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪಾಲಿಕೆಯ ವಿಶೇಷ ಪರಿಹಾರ ಕೋಶಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
              'ರಸ್ತೆ ಕಾಮಗಾರಿ ಗುಣಮಟ್ಟ ಪಾಲಿಸದ ಅಧಿಕಾರಿಗಳ ವಿರುದ್ಧ ನ್ಯಾಯಾಂಗ ನಿಂದನೆ ಕಾಯ್ದೆಯಡಿ ಕ್ರಮ ಜರುಗಿಸಲಾಗುವುದು.'
            ]
          }
        ],
        checklist: [
          'ಅಪಘಾತ ಸ್ಥಳದ ದಿನಾಂಕ-ಸಮಯದ ಫೋಟೋಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ದಾಖಲೆಗಳನ್ನು ಸಂರಕ್ಷಿಸಿ',
          'ಪಾಲಿಕೆಯ ಕಾನೂನು ಕೋಶಕ್ಕೆ 30 ದಿನಗಳೊಳಗೆ ಪರಿಹಾರ ಕೋರಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
          'ಪರಿಹಾರ ವಿಳಂಬವಾದರೆ ಉಚ್ಚ ನ್ಯಾಯಾಲಯದಲ್ಲಿ 226ನೇ ವಿಧಿಯಡಿ ರಿಟ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
        ],
        warning: 'ರಸ್ತೆ ಗುಂಡಿಗಳಿಂದಾಗುವ ಪ್ರಾಣಾಪಾಯ ಅಥವಾ ಗಂಭೀರ ಗಾಯಗಳಿಗೆ ನಗರ ಪಾಲಿಕೆಗಳು 21ನೇ ವಿಧಿಯ ಸಾಂವಿಧಾನಿಕ ಹೊಣೆಗಾರಿಕೆಯಿಂದ ನುಣುಚಿಕೊಳ್ಳುವಂತಿಲ್ಲ.'
      },
      hi: {
        title: 'कर्नाटक उच्च न्यायालय: गड्ढा-मुक्त सुरक्षित सड़कें अनुच्छेद 21 के तहत नागरिकों का मौलिक अधिकार',
        lead: 'कर्नाटक उच्च न्यायालय ने अनुच्छेद 226 के तहत ऐतिहासिक फैसला सुनाते हुए कहा कि सुरक्षित एवं गड्ढा-मुक्त सड़कें अनुच्छेद 21 के तहत जीवन के अधिकार का अभिन्न हिस्सा हैं।',
        category: 'संवैधानिक रिट एवं नागरिक दायित्व',
        takeaways: [
          'गड्ढा-मुक्त सुरक्षित सड़कें अनुच्छेद 21 के तहत संवैधानिक मौलिक अधिकार हैं।',
          'सड़क दुर्घटना पीड़ितों को 45 दिनों के भीतर अनिवार्य मुआवजा देने का आदेश।',
          'नगर निगम अधिकारी संवैधानिक सार्वजनिक अपकृत्य कानून के तहत सीधे उत्तरदायी।'
        ]
      },
      ta: {
        title: 'கர்நாடக உயர் நீதிமன்றம்: குண்டும் குழியுமற்ற சாலைகள் பிரிவு 21-ன் கீழ் அடிப்படை உரிமை எனத் தீர்ப்பு',
        lead: 'பிரிவு 226-ன் கீழ் கர்நாடக உயர் நீதிமன்றம் தீர்ப்பளித்து, பாதுகாப்பான சாலைகள் பிரிவு 21-ன் கீழ் வாழ்வுரிமையின் பிரிக்க முடியாத பகுதியாகும் என அறிவித்துள்ளது.',
        category: 'அரசியலமைப்பு ரிட் & நகராட்சி பொறுப்பு',
        takeaways: [
          'பாதுகாப்பான சாலைகள் பிரிவு 21-ன் கீழ் அடிப்படை உரிமையாகும்.',
          'பாதிக்கப்பட்ட மக்களுக்கு 45 நாட்களுக்குள் இழப்பீடு வழங்க உத்தரவு.'
        ]
      },
      te: {
        title: 'కర్ణాటక హైకోర్టు: గుంతలు లేని సురక్షిత రహదారులు అధికరణ 21 కింద ప్రాథమిక హక్కు',
        lead: 'హైకోర్టు కీలక తీర్పునిస్తూ, గుంతలు లేని రహదారులు అధికరణ 21 కింద జీవించే హక్కులో అంతర్భాగమని స్పష్టం చేసింది.',
        category: 'రాజ్యాంగ రిట్ & పౌర బాధ్యత',
        takeaways: [
          'సురక్షితమైన ప్రయాణం అధికరణ 21 కింద పౌరుల ప్రాథమిక హక్కు.',
          'రోడ్డు ప్రమాద బాధితులకు 45 రోజుల్లో నష్టపరిహారం చెల్లించాలని ఆదేశం.'
        ]
      },
      bn: {
        title: 'কর্ণাটক হাইকোর্ট: খানাখন্দহীন নিরাপদ রাস্তা অনুচ্ছেদ ২১ এর অধীনে মৌলিক অধিকার',
        lead: 'কর্ণাটক হাইকোর্ট অনুচ্ছেদ ২২৬ এর অধীনে রায় দিয়েছে যে নিরাপদ রাস্তা অনুচ্ছেদ ২১ এর অধীনে বাঁচার অধিকারের অংশ।',
        category: 'সাংবিধানিক রিট ও দায়বদ্ধতা',
        takeaways: [
          'নিরাপদ রাস্তা অনুচ্ছেদ ২১ এর অধীনে সাংবিধানিক অধিকার।',
          'দুর্ঘটনায় ক্ষতিগ্রস্তদের ৪৫ দিনের মধ্যে ক্ষতিপূরণ দেওয়ার নির্দেশ।'
        ]
      },
      mr: {
        title: 'कर्नाटक उच्च न्यायालय: खड्डेमुक्त रस्ते कलम २१ अंतर्गत जगण्याच्या मूलभूत हक्काचा भाग',
        lead: 'कर्नाटक उच्च न्यायालयाने स्पष्ट केले की सुरक्षित रस्ते हा कलम २१ अंतर्गत मूलभूत हक्क असून अपघातात नुकसानभरपाई देणे बंधनकारक आहे.',
        category: 'घटनात्मक रिट आणि नागरी दायित्व',
        takeaways: [
          'खड्डेमुक्त रस्ते हा कलम २१ अन्वये मूलभूत हक्क आहे.',
          '४५ दिवसांच्या आत नुकसानभरपाई वाटप करण्याचे महापालिकेस निर्देश.'
        ]
      },
      gu: {
        title: 'કર્ણાટક વડી અદાલત: ખાડામુક્ત સલામત રસ્તાઓ અનુચ્છેદ ૨૧ હેઠળ બંધારણીય મૂળભૂત અધિકાર',
        lead: 'કર્ણાટક હાઈકોર્ટે અનુચ્છેદ ૨૨૬ હેઠળ ચુકાદો આપ્યો કે નાગરિકો માટે સલામત રસ્તાઓ અનુચ્છેદ ૨૧ હેઠળ જીવન જીવવાના અધિકારનો અભિન્ન ભાગ છે.',
        category: 'બંધારણીય રિટ અને મ્યુનિસિપલ જવાબદારી',
        takeaways: [
          'સલામત રસ્તાઓ અનુચ્છેદ ૨૧ હેઠળ બંધારણીય ગેરંટી છે.',
          'અકસ્માત પીડિતોને ૪૫ દિવસમાં વળતર આપવાનો મ્યુનિસિપલ કોર્પોરેશનને આદેશ.'
        ]
      }
    }
  },
  {
    id: 'india-const-electoral-bonds-article19',
    region: 'Basic Structure & Democracy',
    flag: '🇮🇳',
    category: 'Freedom of Speech & Democratic Sovereignty',
    source: 'Supreme Court of India (Constitution Bench)',
    pubDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    readTime: '6 min read',
    laws: ['Constitution of India Art. 19(1)(a)', 'Constitution of India Art. 14', 'Representation of the People Act, 1951'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Strikes Down Anonymous Political Financing as Violative of Article 19(1)(a) Voter Right to Information',
        lead: 'A unanimous five-judge Constitution Bench holds that unlimited corporate political funding infringes upon the voter fundamental right to information under Article 19(1)(a) and breaches the Basic Structure of democracy.',
        category: 'Freedom of Speech & Democratic Sovereignty',
        takeaways: [
          'Voters possess an unassailable constitutional right to know political donor identities under Article 19(1)(a).',
          'Unlimited corporate campaign donations violate Article 14 substantive equality by distorting the electoral playing field.',
          'Reaffirms democratic free and fair elections as an unamendable pillar of the Basic Structure Doctrine.'
        ],
        sections: [
          {
            heading: 'Article 19(1)(a) and the Constitutional Right to Know',
            paragraphs: [
              'The Constitution Bench held that the freedom of speech and expression includes the right to receive information necessary for participatory democracy. An uninformed electorate cannot exercise genuine franchise.',
              'The Court struck down legislative amendments to the Companies Act that permitted loss-making shell entities to channel unlimited funds to political parties without disclosure.'
            ]
          },
          {
            heading: 'The Basic Structure Doctrine and Electoral Purity',
            paragraphs: [
              'Drawing upon Kesavananda Bharati and Indira Gandhi v. Raj Narain, the Chief Justice affirmed that free, fair, and transparent elections constitute the core foundation of Indian republican democracy.',
              'The bench directed public disclosure of all historic political bond transaction numbers to ensure absolute retrospective accountability.'
            ]
          }
        ],
        checklist: [
          'Audit all corporate political contributions to ensure strict compliance with Section 182 of the Companies Act',
          'Ensure public disclosures of corporate social responsibility (CSR) and political expenditure in annual filings',
          'Refrain from anonymous party funding vehicles lacking constitutional transparency'
        ],
        warning: 'Political contributions made without statutory disclosure violate Article 19(1)(a) and render corporate boards liable to regulatory scrutiny and forensic tax audits.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠ: ಅನಾಮಧೇಯ ರಾಜಕೀಯ ದೇಣಿಗೆ ರದ್ದು — 19(1)(ಎ) ಅಡಿ ಮತದಾರರ ಮಾಹಿತಿ ಹಕ್ಕು ಅಬಾಧಿತ',
        lead: 'ಐವರು ನ್ಯಾಯಮೂರ್ತಿಗಳ ಸಂವಿಧಾನ ಪೀಠವು ಸರ್ವಾನುಮತದ ಐತಿಹಾಸಿಕ ತೀರ್ಪು ನೀಡಿ, ಅನಿಯಮಿತ ಕಾರ್ಪೊರೇಟ್ ದೇಣಿಗೆಯು 19(1)(ಎ) ವಿಧಿಯಡಿ ಮತದಾರರ ಮಾಹಿತಿ ಪಡೆಯುವ ಮೂಲಭೂತ ಹಕ್ಕನ್ನು ಉಲ್ಲಂಘಿಸುತ್ತದೆ ಎಂದು ರದ್ದುಗೊಳಿಸಿದೆ.',
        category: 'ವಾಕ್ ಸ್ವಾತಂತ್ರ್ಯ ಮತ್ತು ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಸಾರ್ವಭೌಮತ್ವ',
        takeaways: [
          'ಯಾವ ಪಕ್ಷಕ್ಕೆ ಯಾರು ಹಣ ನೀಡಿದ್ದಾರೆ ಎಂದು ತಿಳಿಯುವುದು ಸಂವಿಧಾನದ 19(1)(ಎ) ಅಡಿಯಲ್ಲಿ ಮತದಾರರ ಮೂಲಭೂತ ಹಕ್ಕು.',
          'ಅನಿಯಮಿತ ಕಾರ್ಪೊರೇಟ್ ದೇಣಿಗೆಯು 14ನೇ ವಿಧಿಯ ಸಮಾನತೆಯ ತತ್ವವನ್ನು ಉಲ್ಲಂಘಿಸುತ್ತದೆ.',
          'ಮುಕ್ತ ಮತ್ತು ನ್ಯಾಯಸಮ್ಮತ ಚುನಾವಣೆಗಳು ಸಂವಿಧಾನದ ಮೂಲ ಸಂರಚನೆಯ (Basic Structure) ಅವಿಭಾಜ್ಯ ಅಂಗ ಎಂದು ಮರುಸ್ಥಾಪನೆ.'
        ],
        sections: [
          {
            heading: '19(1)(ಎ) ವಿಧಿ ಮತ್ತು ಮಾಹಿತಿ ಪಡೆಯುವ ಸಾಂವಿಧಾನಿಕ ಹಕ್ಕು',
            paragraphs: [
              'ಸಂವಿಧಾನ ಪೀಠವು ಮತದಾನದ ಹಕ್ಕನ್ನು ಚಲಾಯಿಸಲು ರಾಜಕೀಯ ಪಕ್ಷಗಳ ಆರ್ಥಿಕ ಮೂಲಗಳ ಪಾರದರ್ಶಕತೆ ಅತ್ಯಗತ್ಯ ಎಂದು ಸ್ಪಷ್ಟಪಡಿಸಿದೆ. ಮತದಾರರಿಗೆ ಮಾಹಿತಿ ಸಿಗದಿದ್ದರೆ ಪ್ರಜಾಪ್ರಭುತ್ವ ಅರ್ಥಹೀನವಾಗುತ್ತದೆ.',
              'ಕಂಪನಿಗಳ ಕಾಯ್ದೆಗೆ ತರಲಾಗಿದ್ದ ತಿದ್ದುಪಡಿಗಳನ್ನು ರದ್ದುಗೊಳಿಸಿದ ಸುಪ್ರೀಂ ಕೋರ್ಟ್, ಎಲ್ಲ ದೇಣಿಗೆಯ ವಿವರಗಳನ್ನು ಸಾರ್ವಜನಿಕವಾಗಿ ಪ್ರಕಟಿಸಲು ಆದೇಶಿಸಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ಕಂಪನಿಗಳ ಕಾಯ್ದೆಯ 182ನೇ ಸೆಕ್ಷನ್‌ಗೆ ಅನುಗುಣವಾಗಿ ಮಾತ್ರ ಕಾರ್ಪೊರೇಟ್ ದೇಣಿಗೆಗಳನ್ನು ನೀಡಿ',
          'ವಾರ್ಷಿಕ ಲೆಕ್ಕಪರಿಶೋಧನೆಯಲ್ಲಿ ಎಲ್ಲ ರಾಜಕೀಯ ಮತ್ತು ಸಿಎಸ್‌ಆರ್ ವೆಚ್ಚಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಬಹಿರಂಗಪಡಿಸಿ'
        ],
        warning: 'ಅನಾಮಧೇಯ ಅಥವಾ ಪಾರದರ್ಶಕವಲ್ಲದ ರಾಜಕೀಯ ದೇಣಿಗೆಗಳು ಸಂವಿಧಾನದ 19(1)(ಎ) ವಿಧಿಯ ಉಲ್ಲಂಘನೆಯಾಗಿದ್ದು ಕಾನೂನು ಕ್ರಮಕ್ಕೆ ಒಳಪಡುತ್ತವೆ.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट संविधान पीठ: चुनावी बॉण्ड रद्द — अनुच्छेद 19(1)(a) के तहत मतदाताओं का जानने का अधिकार मौलिक',
        lead: 'पांच जजों की संविधान पीठ ने सर्वसम्मति से चुनावी बॉण्ड योजना को असंवैधानिक घोषित करते हुए कहा कि राजनीतिक चंदे की गोपनीयता मतदाताओं के जानने के मौलिक अधिकार का उल्लंघन है।',
        category: 'अभिव्यक्ति की स्वतंत्रता एवं लोकतांत्रिक संप्रभुता',
        takeaways: [
          'अनुच्छेद 19(1)(a) के तहत राजनीतिक दलों के वित्तपोषण को जानना मतदाताओं का मौलिक अधिकार है।',
          'असीमित कॉर्पोरेट चंदा अनुच्छेद 14 के समानता के अधिकार का उल्लंघन करता है।',
          'स्वतंत्र और निष्पक्ष चुनाव संविधान के मूल ढांचे का हिस्सा हैं।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: தேர்தல் பத்திரங்கள் ரத்து — பிரிவு 19(1)(a) வாக்காளர் தகவல் உரிமை உறுதி',
        lead: 'அரசியலமைப்பு அமர்வு ஒருமனதாக தேர்தல் பத்திரங்களை ரத்து செய்து, வாக்காளர்களுக்கு தகவல் பெறும் உரிமை அடிப்படை உரிமை என அறிவித்தது.',
        category: 'பேச்சுரிமை & ஜனநாயக சுயாட்சி',
        takeaways: [
          'வாக்காளர்களுக்கு அரசியல் நிதியுதவி குறித்து அறியும் உரிமை பிரிவு 19(1)(a)-ன் கீழ் உள்ளது.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు రాజ్యాంగ ధర్మాసనం: ఎలక్టోరల్ బాండ్ల రద్దు — అధికరణ 19(1)(a) ఓటరు సమాచార హక్కు ప్రాథమికం',
        lead: 'రాజకీయ విరాళాల గోప్యత ఓటర్ల సమాచార హక్కును ఉల్లంఘిస్తుందని సుప్రీంకోర్టు తీర్పునిచ్చింది.',
        category: 'వాక్ స్వాతంత్ర్యం & ప్రజాస్వామ్యం',
        takeaways: [
          'అధికరణ 19(1)(a) కింద విరాళాల వివరాలు తెలుసుకోవడం ఓటరు ప్రాథమిక హక్కు.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: ইলেক্টোরাল বন্ড বাতিল — অনুচ্ছেদ ১৯(১)(ক) ভোটারদের জানার অধিকার সুরক্ষিত',
        lead: 'শীর্ষ আদালত জানিয়েছে যে বেনামী রাজনৈতিক অনুদান ভোটারদের অনুচ্ছেদ ১৯(১)(ক) এর অধিকার খর্ব করে।',
        category: 'বাকস্বাধীনতা ও গণতন্ত্র',
        takeaways: [
          'রাজনৈতিক দলের তহবিলের উৎস জানা নাগরিকের মৌলিক অধিকার।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: इलेक्टोरल बाँड्स रद्द — कलम १९(१)(अ) अंतर्गत मतदारांचा माहितीचा हक्क अबाधित',
        lead: 'पाच न्यायमूर्तींच्या घटनापीठाने एकमुखाने इलेक्टोरल बाँड योजना असंवैधानिक ठरवून रद्द केली.',
        category: 'अभिव्यक्ती स्वातंत्र्य आणि लोकशाही',
        takeaways: [
          'राजकीय पक्षांना मिळणाऱ्या देणग्यांची माहिती मिळणे हा मतदारांचा मूलभूत हक्क आहे.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: ઇલેક્ટોરલ બોન્ડ્સ રદ — અનુચ્છેદ ૧૯(૧)(a) હેઠળ મતદારોનો જાણવાનો અધિકાર મૂળભૂત',
        lead: 'પાંચ જજોની બંધારણીય ખંડપીઠે અનામી રાજકીય ફંડિંગને ગેરબંધારણીય ઠેરવી રદ કર્યું છે.',
        category: 'વાણી સ્વાતંત્ર્ય અને લોકશાહી',
        takeaways: [
          'મતદારોને રાજકીય ફંડિંગ વિશે જાણવાનો અધિકાર અનુચ્છેદ ૧૯(૧)(a) હેઠળ સુરક્ષિત છે.'
        ]
      }
    }
  },
  {
    id: 'india-const-article14-gender-equality',
    region: 'Equality & Social Justice (Part III & IV)',
    flag: '⚖️',
    category: 'Substantive Equality & Non-Discrimination',
    source: 'Supreme Court of India (Appellate Civil Division)',
    pubDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    readTime: '5 min read',
    laws: ['Constitution of India Art. 14', 'Constitution of India Art. 15(1)', 'Constitution of India Art. 39(d)'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Enforces Article 14 & 15 Constitutional Mandate on Gender Pay Equity and Permanent Commissions',
        lead: 'Apex Court rules that systemic remuneration disparities and career progression glass ceilings breach the non-negotiable equality guarantees under Articles 14 and 15, ordering enforceable institutional parity audits.',
        category: 'Substantive Equality & Non-Discrimination',
        takeaways: [
          'Substantive equality under Article 14 requires structural dismantling of indirect gender discrimination in workplaces.',
          'Equal pay for equal work elevated from a Directive Principle (Art. 39(d)) to an enforceable Article 14 facet.',
          'Mandates all statutory public and corporate entities to conduct transparent annual gender remuneration audits.'
        ],
        sections: [
          {
            heading: 'Transformative Constitutionalism and Article 15(1)',
            paragraphs: [
              'The Supreme Court reiterated that equality under the Constitution of India is substantive and transformative, not formal. Neutral workplace policies that yield disparate gender impacts violate Article 15(1).',
              'The bench directed that women officers and corporate professionals must receive equal pensionary, promotional, and command opportunities without arbitrary criteria.'
            ]
          }
        ],
        checklist: [
          'Conduct comprehensive cross-departmental compensation parity reviews matching job descriptions',
          'Revise promotion evaluation rubrics to eliminate indirect historical gender bias',
          'Publish gender representation and compensation statistics in statutory board reports'
        ],
        warning: 'Discriminatory employment practices based on gender violate Articles 14, 15, and 16, exposing employers to constitutional writ damages and labour court penalties.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್: ಸಂವಿಧಾನದ 14 ಮತ್ತು 15ನೇ ವಿಧಿಯಡಿ ಲಿಂಗ ಸಮಾನತೆ ಮತ್ತು ಸಮಾನ ವೇತನ ಸಾಂವಿಧಾನಿಕ ಕಡ್ಡಾಯ',
        lead: 'ಕೆಲಸದ ಸ್ಥಳಗಳಲ್ಲಿ ಲಿಂಗ ತಾರತಮ್ಯ ಮತ್ತು ವೇತನ ಅಸಮಾನತೆಯು ಸಂವಿಧಾನದ 14 ಮತ್ತು 15ನೇ ವಿಧಿಗಳ ಉಲ್ಲಂಘನೆಯಾಗಿದ್ದು, ಸಮಾನ ಕೆಲಸಕ್ಕೆ ಸಮಾನ ವೇತನ ಸಾಂವಿಧಾನಿಕ ಕಡ್ಡಾಯವಾಗಿದೆ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಆದೇಶಿಸಿದೆ.',
        category: 'ಸಮಾನತೆ ಮತ್ತು ಸಾಮಾಜಿಕ ನ್ಯಾಯ',
        takeaways: [
          '14ನೇ ವಿಧಿಯ ಸಮಾನತೆಯು ಕೆಲಸದ ಸ್ಥಳಗಳಲ್ಲಿ ಲಿಂಗ ತಾರತಮ್ಯವನ್ನು ನಿರ್ಮೂಲನೆ ಮಾಡುವುದನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸುತ್ತದೆ.',
          'ಸಮಾನ ಕೆಲಸಕ್ಕೆ ಸಮಾನ ವೇತನ ನೀಡುವ ತತ್ವವು 14ನೇ ವಿಧಿಯಡಿ ಜಾರಿಗೊಳಿಸಬಹುದಾದ ಹಕ್ಕಾಗಿದೆ.',
          'ಎಲ್ಲ ಸಾರ್ವಜನಿಕ ಮತ್ತು ಖಾಸಗಿ ಸಂಸ್ಥೆಗಳು ವಾರ್ಷಿಕ ವೇತನ ಸಮಾನತೆಯ ಲೆಕ್ಕಪರಿಶೋಧನೆ ನಡೆಸಬೇಕು.'
        ],
        sections: [
          {
            heading: 'ಪರಿವರ್ತನಾತ್ಮಕ ಸಾಂವಿಧಾನಿಕತೆ ಮತ್ತು 15(1) ವಿಧಿ',
            paragraphs: [
              'ಭಾರತೀಯ ಸಂವಿಧಾನದ ಸಮಾನತೆಯು ಕೇವಲ ಔಪಚಾರಿಕವಲ್ಲ, ನೈಜ ಸಾಮಾಜಿಕ ನ್ಯಾಯವನ್ನು ತರಬೇಕಾದ ಕರ್ತವ್ಯವಾಗಿದೆ ಎಂದು ನ್ಯಾಯಾಲಯ ಪ್ರತಿಪಾದಿಸಿದೆ.',
              'ಮಹಿಳಾ ಉದ್ಯೋಗಿಗಳಿಗೆ ಬಡ್ತಿ, ಸಮಾನ ವೇತನ ಮತ್ತು ಪಿಂಚಣಿ ಸೌಲಭ್ಯಗಳನ್ನು ಯಾವುದೇ ತಾರತಮ್ಯವಿಲ್ಲದೆ ಒದಗಿಸಬೇಕು ಎಂದು ಪೀಠವು ಸ್ಪಷ್ಟಪಡಿಸಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ಸಂಸ್ಥೆಯ ಎಲ್ಲ ಇಲಾಖೆಗಳಲ್ಲಿ ಲಿಂಗ ವೇತನ ಸಮಾನತೆಯ ಪರಿಶೀಲನೆ ನಡೆಸಿ',
          'ಬಡ್ತಿ ನಿಯಮಗಳಲ್ಲಿರುವ ಪರೋಕ್ಷ ತಾರತಮ್ಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ'
        ],
        warning: 'ಲಿಂಗಾಧಾರಿತ ಉದ್ಯೋಗ ತಾರತಮ್ಯವು ಸಂವಿಧಾನದ 14, 15 ಮತ್ತು 16ನೇ ವಿಧಿಗಳ ಗಂಭೀರ ಉಲ್ಲಂಘನೆಯಾಗಿದ್ದು ನ್ಯಾಯಾಲಯದ ಶಿಕ್ಷೆಗೆ ಗುರಿಯಾಗಬಹುದು.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट: अनुच्छेद 14 एवं 15 के तहत समान कार्य के लिए समान वेतन और लैंगिक समानता अनिवार्य',
        lead: 'सर्वोच्च न्यायालय ने व्यवस्था दी कि कार्यस्थल पर वेतन विषमता और पदोन्नति में भेदभाव अनुच्छेद 14 और 15 का सीधा उल्लंघन है।',
        category: 'मौलिक समानता एवं गैर-भेदभाव',
        takeaways: [
          'समान कार्य के लिए समान वेतन अनुच्छेद 14 के तहत प्रवर्तनीय मौलिक अधिकार का हिस्सा है।',
          'संस्थानों को वार्षिक लैंगिक वेतन समानता ऑडिट कराना अनिवार्य।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: பிரிவு 14 & 15-ன் கீழ் சம வேலைக்கு சம ஊதியம் மற்றும் பாலின சமத்துவம் உறுதி',
        lead: 'வேலை இடங்களில் பாலின பாகுபாடு காட்டுவது அரசியலமைப்பு பிரிவு 14 மற்றும் 15-ன் கடுமையான மீறல் என உச்ச நீதிமன்றம் தீர்ப்பளித்துள்ளது.',
        category: 'சமத்துவம் & சமூக நீதி',
        takeaways: [
          'சம ஊதியம் பெறுவது பிரிவு 14-ன் கீழ் அடிப்படை உரிமையாகும்.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు: అధికరణ 14 & 15 కింద సమాన పనికి సమాన వేతనం మరియు లింగ సమానత్వం తప్పనిసరి',
        lead: 'పని ప్రదేశాలలో వివక్ష రాజ్యాంగ విరుద్ధమని సుప్రీంకోర్టు స్పష్టం చేసింది.',
        category: 'సమానత్వ హక్కు & న్యాయం',
        takeaways: [
          'అధికరణ 14 కింద లింగ వివక్ష లేని సమాన వేతనం ప్రాథమిక హక్కు.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: অনুচ্ছেদ ১৪ ও ১৫ এর অধীনে সমান কাজের জন্য সমান বেতন ও লিঙ্গ সমতা নিশ্চিত',
        lead: 'কর্মক্ষেত্রে লিঙ্গ বৈষম্য অনুচ্ছেদ ১৪ এবং ১৫ এর সরাসরি লঙ্ঘন বলে ঘোষণা করেছে সুপ্রিম কোর্ট।',
        category: 'সমতা ও সামাজিক ন্যায়বিচার',
        takeaways: [
          'সমান কাজের জন্য সমান বেতন পাওয়া অনুচ্ছেদ ১৪ এর অন্তর্গত অধিকার।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: कलम १४ आणि १५ अंतर्गत समान कामासाठी समान वेतन आणि लैंगिक समानता अनिवार्य',
        lead: 'कामाच्या ठिकाणी वेतनातील तफावत कलम १४ आणि १५ चे उल्लंघन असल्याचे सर्वोच्च न्यायालयाने स्पष्ट केले.',
        category: 'समानतेचा मूलभूत हक्क',
        takeaways: [
          'समान कामासाठी समान वेतन हा घटनात्मक अधिकार आहे.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: અનુચ્છેદ ૧૪ અને ૧૫ હેઠળ સમાન કામ માટે સમાન વેતન અને લિંગ સમાનતા ફરજિયાત',
        lead: 'કાર્યસ્થળ પર વેતન અસમાનતા અનુચ્છેદ ૧૪ અને ૧૫ નું સીધું ઉલ્લંઘન છે તેમ સુપ્રીમ કોર્ટે ઠરાવ્યું છે.',
        category: 'સમાનતા અને સામાજિક ન્યાય',
        takeaways: [
          'સમાન કામ માટે સમાન વેતન મેળવવો બંધારણીય અધિકાર છે.'
        ]
      }
    }
  },
  {
    id: 'india-const-article20-22-bns-criminal-safeguards',
    region: 'Criminal Due Process & Safeguards',
    flag: '🇮🇳',
    category: 'Constitutional Criminal Safeguards',
    source: 'Supreme Court of India (Criminal Appellate Division)',
    pubDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    relativeTime: '2 days ago',
    readTime: '5 min read',
    laws: ['Constitution of India Art. 20(3)', 'Constitution of India Art. 21', 'Constitution of India Art. 22', 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Mandates Electronic Evidence Hashing to Enforce Article 20(3) and 22 Constitutional Safeguards in Criminal Procedure',
        lead: 'Apex Court standardizes mandatory videography and unalterable cryptographic hashing during police search and seizures, ensuring criminal procedures strictly conform with Articles 20(3), 21, and 22 due process guarantees.',
        category: 'Constitutional Criminal Safeguards',
        takeaways: [
          'Right against self-incrimination (Art. 20(3)) and procedural due process (Art. 21) apply strictly to seized digital devices.',
          'Mandatory electronic search hashing under BNSS Section 105 required to preserve forensic chain of custody.',
          'Failure to provide contemporaneous search video and hash certificates invalidates seizure evidence at trial.'
        ],
        sections: [
          {
            heading: 'Article 20(3) and Electronic Compulsion Limits',
            paragraphs: [
              'The Supreme Court ruled that coercing an accused person to provide biometric device passcodes without judicial warrants infringes upon Article 20(3) immunity against self-incrimination.',
              'Investigators must record video footage during physical and digital property seizures, generating immediate cryptographic SHA-256 hashes to prevent post-facto tampering.'
            ]
          }
        ],
        checklist: [
          'Insist on immediate generation of cryptographic hash values during device seizure with written panchnama',
          'Verify that digital search videography is contemporaneously uploaded to the verified court e-evidence vault',
          'File an immediate bail and constitutional exclusion application if search procedures violate Article 21/22'
        ],
        warning: 'Digital evidence seized without mandatory cryptographic hashes and video timestamps is inadmissible in criminal trials under constitutional due process rules.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್: ಅಪರಾಧ ತನಿಖೆಯಲ್ಲಿ 20(3) ಮತ್ತು 22ನೇ ವಿಧಿಗಳ ರಕ್ಷಣೆಗಾಗಿ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಗಳ ವೀಡಿಯೋಗ್ರಫಿ ಕಡ್ಡಾಯ',
        lead: 'ಪೊಲೀಸ್ ಶೋಧ ಮತ್ತು ವಶಪಡಿಸಿಕೊಳ್ಳುವಿಕೆ ವೇಳೆ ವೀಡಿಯೋಗ್ರಫಿ ಮತ್ತು ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಹ್ಯಾಶ್ ಕಡ್ಡಾಯಗೊಳಿಸಿದ ಸುಪ್ರೀಂ ಕೋರ್ಟ್, ಸಂವಿಧಾನದ 20(3), 21 ಮತ್ತು 22ನೇ ವಿಧಿಗಳ ಸಾಂವಿಧಾನಿಕ ರಕ್ಷಣೆಗಳನ್ನು ಖಾತರಿಪಡಿಸಿದೆ.',
        category: 'ಸಾಂವಿಧಾನಿಕ ಕ್ರಿಮಿನಲ್ ರಕ್ಷಣೆಗಳು',
        takeaways: [
          'ಸ್ವಯಂ-ದೋಷಾರೋಪಣೆ ವಿರುದ್ಧದ ಹಕ್ಕು (ವಿಧಿ 20(3)) ಮತ್ತು ನ್ಯಾಯಸಮ್ಮತ ವಿಚಾರಣೆಯ ಹಕ್ಕು (ವಿಧಿ 21) ಡಿಜಿಟಲ್ ಸಾಧನಗಳಿಗೂ ಅನ್ವಯಿಸುತ್ತದೆ.',
          'ಪೊಲೀಸರು ಮೊಬೈಲ್/ಲ್ಯಾಪ್‌ಟಾಪ್ ವಶಪಡಿಸಿಕೊಳ್ಳುವಾಗ ಕಡ್ಡಾಯವಾಗಿ ಹ್ಯಾಶ್ ಕೋಡ್ ರಚಿಸಬೇಕು.',
          'ವೀಡಿಯೋ ದಾಖಲೀಕರಣವಿಲ್ಲದ ಶೋಧ ಸಾಕ್ಷ್ಯಗಳು ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಅಮಾನ್ಯವಾಗುತ್ತವೆ.'
        ],
        sections: [
          {
            heading: '20(3) ವಿಧಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಾಧನಗಳ ಮೇಲಿನ ಸಾಂವಿಧಾನಿಕ ರಕ್ಷಣೆ',
            paragraphs: [
              'ನ್ಯಾಯಾಂಗ ಆದೇಶವಿಲ್ಲದೆ ಆರೋಪಿಯಿಂದ ಬಲವಂತವಾಗಿ ಫೋನ್ ಅಥವಾ ಲ್ಯಾಪ್‌ಟಾಪ್ ಪಾಸ್‌ವರ್ಡ್ ಪಡೆಯುವುದು 20(3)ನೇ ವಿಧಿಯ ಉಲ್ಲಂಘನೆಯಾಗಿದೆ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.',
              'ಶೋಧ ಕಾರ್ಯಾಚರಣೆಯ ಪ್ರತಿಯೊಂದು ಹಂತವನ್ನೂ ವೀಡಿಯೋಗ್ರಫಿ ಮಾಡಿ ನ್ಯಾಯಾಲಯದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಬೇಕು.'
            ]
          }
        ],
        checklist: [
          'ಸಾಧನ ವಶಪಡಿಸಿಕೊಳ್ಳುವಾಗ ತಕ್ಷಣ ಪಂಚನಾಮೆಯಲ್ಲಿ ಹ್ಯಾಶ್ ಮೌಲ್ಯವನ್ನು ನಮೂದಿಸಲು ಒತ್ತಾಯಿಸಿ',
          'ಶೋಧ ಪ್ರಕ್ರಿಯೆ ನಿಯಮಬಾಹಿರವಾಗಿದ್ದರೆ 21 ಮತ್ತು 22ನೇ ವಿಧಿಯಡಿ ಜಾಮೀನು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ'
        ],
        warning: 'ಹ್ಯಾಶ್ ಮೌಲ್ಯ ಮತ್ತು ವೀಡಿಯೋ ಇಲ್ಲದೆ ವಶಪಡಿಸಿಕೊಂಡ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಗಳು ಸಂವಿಧಾನಬಾಹಿರವಾಗಿದ್ದು ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಸಾಕ್ಷ್ಯವಾಗಿ ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट: आपराधिक प्रक्रिया में अनुच्छेद 20(3) व 22 के तहत डिजिटल साक्ष्यों की वीडियोग्राफी अनिवार्य',
        lead: 'सुप्रीम कोर्ट ने निर्देश दिया कि तलाशी और जब्ती के दौरान अनिवार्य वीडियोग्राफी और हैश वैल्यू तैयार करना अनुच्छेद 21 व 22 के तहत संवैधानिक अधिकार है।',
        category: 'संवैधानिक आपराधिक संरक्षण',
        takeaways: [
          'अनुच्छेद 20(3) के तहत आत्म-दोषारोपण से संरक्षण डिजिटल उपकरणों पर भी लागू।',
          'बिना वीडियो रिकॉर्डिंग और हैश वैल्यू की जब्ती अदालत में अमान्य होगी।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: பிரிவு 20(3) & 22-ன் கீழ் டிஜிட்டல் ஆதாரங்களுக்கு வீடியோ பதிவு கட்டாயம்',
        lead: 'காவல்துறை சோதனைகளின் போது டிஜிட்டல் ஆதாரங்களுக்கு ஹாஷ் குறியீடு மற்றும் வீடியோ பதிவு கட்டாயம் என உச்ச நீதிமன்றம் உத்தரவிட்டுள்ளது.',
        category: 'குற்றவியல் அரசியலமைப்பு பாதுகாப்பு',
        takeaways: [
          'சுய வாக்குமூலத்திற்கு எதிரான உரிமை பிரிவு 20(3)-ன் கீழ் டிஜிட்டல் சாதனங்களுக்கும் பொருந்தும்.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు: అధికరణ 20(3) & 22 కింద డిజిటల్ ఆధారాల వీడియోగ్రఫీ తప్పనిసరి',
        lead: 'సోదాలు మరియు జప్తుల సమయంలో వీడియోగ్రఫీ లేకపోతే ఆ ఆధారాలు చెల్లవని సుప్రీంకోర్టు స్పష్టం చేసింది.',
        category: 'రాజ్యాంగ నేర విచారణ రక్షణలు',
        takeaways: [
          'అధికరణ 20(3) కింద నిందితులకు రాజ్యాంగ రక్షణలు తప్పనిసరి.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: ফৌজদারি প্রক্রিয়ায় অনুচ্ছেদ ২০(৩) ও ২২ এর অধীনে ডিজিটাল প্রমাণের ভিডিওগ্রাফি বাধ্যতামূলক',
        lead: 'তল্লাশির সময় ডিজিটাল প্রমাণের হ্যাশ ভ্যালু এবং ভিডিওগ্রাফি তৈরি করা সাংবিধানিক সুরক্ষার অংশ।',
        category: 'সাংবিধানিক ফৌজদারি সুরক্ষা',
        takeaways: [
          'অনুচ্ছেদ ২০(৩) এর অধীনে জোরপূর্বক পাসওয়ার্ড নেওয়া অসাংবিধানিক।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: फौजदारी प्रक्रियेत कलम २०(३) आणि २२ अंतर्गत डिजिटल पुराव्यांचे व्हिडिओ रेकॉर्डिंग अनिवार्य',
        lead: 'पोलिसांनी जप्ती करताना व्हिडिओ रेकॉर्डिंग आणि हॅश व्हॅल्यू तयार करणे कलम २१ अंतर्गत बंधनकारक आहे.',
        category: 'घटनात्मक फौजदारी संरक्षण',
        takeaways: [
          'स्वतःविरुद्ध साक्ष न देण्याचा अधिकार कलम २०(३) अंतर्गत डिजिटल उपकरणांनाही लागू.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: ફોજદારી કાર્યવાહીમાં અનુચ્છેદ ૨૦(૩) અને ૨૨ હેઠળ ડિજિટલ પુરાવાઓની વિડિયોગ્રાફી ફરજિયાત',
        lead: 'તલાશી અને જપ્તી વખતે વિડિયો રેકોર્ડિંગ અને ક્રિપ્ટોગ્રાફિક હેશ તૈયાર કરવો બંધારણીય અધિકાર છે.',
        category: 'બંધારણીય ફોજદારી સુરક્ષા',
        takeaways: [
          'અનુચ્છેદ ૨૦(૩) હેઠળ સ્વયં-દોષારોપણ સામે રક્ષણ ડિજિટલ ઉપકરણો પર પણ લાગુ.'
        ]
      }
    }
  },
  {
    id: 'india-const-federalism-governor-article200',
    region: 'Federalism & State Autonomy (Art. 200)',
    flag: '🤝',
    category: 'Constitutional Federal Architecture',
    source: 'Supreme Court of India (Constitution Bench)',
    pubDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    relativeTime: '2 days ago',
    readTime: '6 min read',
    laws: ['Constitution of India Art. 200', 'Constitution of India Art. 163', 'Constitution of India Art. 368'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Clarifies Federalism as Basic Structure: Governors Cannot Withhold State Legislative Bills Indefinitely',
        lead: 'Reaffirming federalism as an inviolable pillar of the Basic Structure Doctrine, the Supreme Court limits gubernatorial inaction under Article 200, ruling that state governors cannot sit on passed legislation indefinitely.',
        category: 'Constitutional Federal Architecture',
        takeaways: [
          'Federalism is an unalterable core component of the Basic Structure of the Indian Constitution.',
          'Article 200 does not confer pocket veto powers upon state governors to frustrate state legislative will.',
          'Governors must return bills "as soon as possible" with recommendations or grant constitutional assent.'
        ],
        sections: [
          {
            heading: 'The Article 200 Proviso and Parliamentary Democracy',
            paragraphs: [
              'The Constitution Bench clarified that in a parliamentary democracy governed by the Constitution of India, the elected legislature reflects the sovereign will of the people. Unelected constitutional functionaries cannot stall governance.',
              'If a State Legislative Assembly re-passes a returned bill with or without amendments, Article 200 mandates that the Governor "shall not withhold assent therefrom".'
            ]
          }
        ],
        checklist: [
          'Track state legislative transmission dates and gubernatorial receipt stamps formally',
          'Seek constitutional guidance through Supreme Court writ jurisdiction if executive gridlock threatens statutory rollout',
          'Uphold constitutional convention requiring harmonious coordination between Union representatives and State Cabinets'
        ],
        warning: 'Arbitrary obstruction of state assembly enactments breaches the federal constitutional balance protected under the Basic Structure Doctrine.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್: ಸಂವಿಧಾನದ ಮೂಲ ರಚನೆಯಾದ ಒಕ್ಕೂಟ ವ್ಯವಸ್ಥೆ — ರಾಜ್ಯ ಮಸೂದೆಗಳನ್ನು ರಾಜ್ಯಪಾಲರು ಅನಿರ್ದಿಷ್ಟಾವಧಿ ತಡೆಹಿಡಿಯುವಂತಿಲ್ಲ',
        lead: 'ಒಕ್ಕೂಟ ವ್ಯವಸ್ಥೆಯು ಸಂವಿಧಾನದ ಮೂಲ ರಚನೆಯ ಅವಿಭಾಜ್ಯ ಅಂಗವಾಗಿದೆ ಎಂದು ದೃಢಪಡಿಸಿದ ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯ, 200ನೇ ವಿಧಿಯಡಿ ರಾಜ್ಯಪಾಲರು ಶಾಸನಸಭೆ ಅಂಗೀಕರಿಸಿದ ಮಸೂದೆಗಳನ್ನು ಅನಿರ್ದಿಷ್ಟಾವಧಿ ತಡೆಹಿಡಿಯಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂದು ಆದೇಶಿಸಿದೆ.',
        category: 'ಸಾಂವಿಧಾನಿಕ ಒಕ್ಕೂಟ ವಾಸ್ತುಶಿಲ್ಪ',
        takeaways: [
          'ಒಕ್ಕೂಟ ವ್ಯವಸ್ಥೆಯು (Federalism) ಭಾರತೀಯ ಸಂವಿಧಾನದ ಮೂಲ ರಚನೆಯ ಅಳಿಸಲಾಗದ ಸ್ತಂಭವಾಗಿದೆ.',
          'ಸಂವಿಧಾನದ 200ನೇ ವಿಧಿಯು ರಾಜ್ಯಪಾಲರಿಗೆ ಪಾಕೆಟ್ ವೀಟೋ ಅಧಿಕಾರವನ್ನು ನೀಡುವುದಿಲ್ಲ.',
          'ಶಾಸನಸಭೆಯು ಮಸೂದೆಯನ್ನು ಮರು-ಅಂಗೀಕರಿಸಿದರೆ ರಾಜ್ಯಪಾಲರು ಕಡ್ಡಾಯವಾಗಿ ಒಪ್ಪಿಗೆ ನೀಡಬೇಕು.'
        ],
        sections: [
          {
            heading: 'ಸಂಸದೀಯ ಪ್ರಜಾಪ್ರಭುತ್ವ ಮತ್ತು 200ನೇ ವಿಧಿ',
            paragraphs: [
              'ಜನರಿಂದ ಆಯ್ಕೆಯಾದ ಶಾಸಕಾಂಗವು ಜನರ ಸಾರ್ವಭೌಮ ಇಚ್ಛೆಯನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ. ನಾಮನಿರ್ದೇಶಿತ ಸಾಂವಿಧಾನಿಕ ಮುಖ್ಯಸ್ಥರು ಶಾಸಕಾಂಗದ ಕಾರ್ಯವನ್ನು ಸ್ಥಗಿತಗೊಳಿಸುವಂತಿಲ್ಲ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹೇಳಿದೆ.',
              'ರಾಜ್ಯ ಶಾಸನಸಭೆಯು ಮಸೂದೆಯನ್ನು ಮರಳಿ ಅಂಗೀಕರಿಸಿದಾಗ, ರಾಜ್ಯಪಾಲರು ಅದಕ್ಕೆ ಒಪ್ಪಿಗೆ ನೀಡುವುದು ಸಂವಿಧಾನಬದ್ಧ ಕರ್ತವ್ಯವಾಗಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ವಿಧಾನಸಭೆಯಿಂದ ಅಂಗೀಕೃತ ಮಸೂದೆಗಳ ಸಾಂವಿಧಾನಿಕ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅಧಿಕೃತವಾಗಿ ದಾಖಲಿಸಿ',
          'ಒಕ್ಕೂಟ ಮತ್ತು ರಾಜ್ಯಗಳ ನಡುವೆ ಸಾಂವಿಧಾನಿಕ ಸಮತೋಲನವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ'
        ],
        warning: 'ರಾಜ್ಯ ಶಾಸಕಾಂಗದ ಕಾಯ್ದೆಗಳನ್ನು ಅಕಾರಣವಾಗಿ ತಡೆಹಿಡಿಯುವುದು ಸಂವಿಧಾನದ ಒಕ್ಕೂಟ ತತ್ವದ ಗಂಭೀರ ಉಲ್ಲಂಘನೆಯಾಗಿದೆ.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट: संघवाद संविधान का मूल ढांचा — राज्यपाल राज्य विधानसभा के विधेयकों को अनिश्चितकाल तक नहीं रोक सकते',
        lead: 'सर्वोच्च न्यायालय ने अनुच्छेद 200 की व्याख्या करते हुए कहा कि राज्यपालों के पास विधानसभा द्वारा पारित विधेयकों पर वीटो का असीमित अधिकार नहीं है।',
        category: 'संवैधानिक संघवाद वास्तुकला',
        takeaways: [
          'संघवाद भारतीय संविधान के मूल ढांचे का अभिन्न हिस्सा है।',
          'राज्यपालों को अनुच्छेद 200 के तहत विधेयकों पर समयबद्ध निर्णय लेना अनिवार्य है।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: கூட்டாட்சி அரசியலமைப்பின் அடிப்படைக் கட்டமைப்பு — ஆளுநர்கள் மசோதாக்களை காலவரையின்றி நிறுத்தி வைக்க முடியாது',
        lead: 'பிரிவு 200-ன் கீழ் ஆளுநர்கள் சட்டமன்ற மசோதாக்களை காலவரையின்றி முடக்க முடியாது என உச்ச நீதிமன்றம் தீர்ப்பளித்துள்ளது.',
        category: 'கூட்டாட்சி & மாநில சுயாட்சி',
        takeaways: [
          'கூட்டாட்சி அரசியலமைப்பின் மாற்ற முடியாத அடிப்படைக் கட்டமைப்பாகும்.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు: సమాఖ్య వ్యవస్థ రాజ్యాంగ మౌలిక స్వరూపం — గవర్నర్లు బిల్లులను నిరవధికంగా నిలిపివేయలేరు',
        lead: 'అధికరణ 200 కింద గవర్నర్లు చట్టసభ బిల్లులను నిరవధికంగా ఆలస్యం చేయరాదని సుప్రీంకోర్టు స్పష్టం చేసింది.',
        category: 'సమాఖ్య రాజ్యాంగ నిర్మాణం',
        takeaways: [
          'సమాఖ్య వ్యవస్థ రాజ్యాంగ మౌలిక స్వరూపంలో భాగం.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: যুক্তরাষ্ট্রীয় ব্যবস্থা সংবিধানের মূল কাঠামো — রাজ্যপালরা বিল অনির্দিষ্টকালের জন্য আটকে রাখতে পারেন না',
        lead: 'অনুচ্ছেদ ২০০ এর অধীনে রাজ্যপালদের সাংবিধানিক দায়িত্ব স্পষ্ট করে ঐতিহাসিক রায় শীর্ষ আদালতের।',
        category: 'যুক্তরাষ্ট্রীয় কাঠামো',
        takeaways: [
          'যুক্তরাষ্ট্রীয় শাসনব্যবস্থা সংবিধানের মৌলিক কাঠামোর অঙ্গ।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: संघराज्य व्यवस्था मूळ संरचनेचा भाग — राज्यपाल विधेयके अनिश्चित काळासाठी रोखू शकत नाहीत',
        lead: 'कलम २०० अन्वये राज्यपालांनी विधीमंडळाने मंजूर केलेल्या विधेयकांवर वेळेत निर्णय घेणे घटनात्मक बंधन असल्याचे कोर्टाने स्पष्ट केले.',
        category: 'घटनात्मक संघराज्य रचना',
        takeaways: [
          'संघराज्य रचना ही संविधानाची मूलभूत चौकट आहे.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: સંઘવાદ બંધારણનું મૂળભૂત માળખું — રાજ્યપાલ બિલને અનિશ્ચિત મુદત માટે અટકાવી શકતા નથી',
        lead: 'અનુચ્છેદ ૨૦૦ ની સ્પષ્ટતા કરતા સુપ્રીમ કોર્ટે કહ્યું કે રાજ્યપાલો પાસે પોકેટ વીટોની અનંત સત્તા નથી.',
        category: 'બંધારણીય સંઘવાદ',
        takeaways: [
          'સંઘવાદ ભારતીય બંધારણના મૂળભૂત માળખાનો અતૂટ હિસ્સો છે.'
        ]
      }
    }
  },
  {
    id: 'india-const-article25-secularism-religious-autonomy',
    region: 'Fundamental Freedoms & Secularism',
    flag: '🇮🇳',
    category: 'Freedom of Religion & Constitutional Morality',
    source: 'Supreme Court of India (7-Judge Constitutional Reference)',
    pubDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    relativeTime: '3 days ago',
    readTime: '5 min read',
    laws: ['Constitution of India Art. 25', 'Constitution of India Art. 26', 'Constitution of India Art. 14'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Reaffirms Article 25 Essential Religious Practices Test Balancing Faith and Fundamental Rights',
        lead: 'A 7-Judge Constitutional Reference bench articulates that religious freedoms under Articles 25 and 26 are inherently subordinate to Constitutional Morality, gender equality under Article 14, and individual human dignity.',
        category: 'Freedom of Religion & Constitutional Morality',
        takeaways: [
          'Article 25 freedom of conscience is expressly subject to public order, morality, health, and Part III rights.',
          'Essential religious practices test cannot be invoked to perpetuate caste, gender, or social exclusion.',
          'Constitutional Morality supersedes sectarian customary practices that violate human dignity.'
        ],
        sections: [
          {
            heading: 'The Primacy of Constitutional Morality over Custom',
            paragraphs: [
              'The Supreme Court affirmed that the Constitution of India envisioned a modern, egalitarian republic. Freedom of religion under Article 25 protects core devotional practices but does not shield discriminatory exclusions.',
              'The bench emphasized that every citizen has an equal right to conscience and worship that cannot be abrogated by arbitrary institutional gatekeeping.'
            ]
          }
        ],
        checklist: [
          'Ensure religious and educational trust bylaws comply with non-discrimination standards',
          'Respect individual rights of conscience and worship in public and charitable institutions',
          'Align institutional governance with secular constitutional values under Article 26'
        ],
        warning: 'Customary practices that deny women or marginalized communities access to public places of worship violate Articles 14, 15, and 25.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್ 7 ನ್ಯಾಯಮೂರ್ತಿಗಳ ಪೀಠ: 25ನೇ ವಿಧಿ ಧಾರ್ಮಿಕ ಆಚರಣೆಗಳು ಸಾಂವಿಧಾನಿಕ ನೈತಿಕತೆ ಮತ್ತು ಘನತೆಗೆ ಒಳಪಟ್ಟಿವೆ',
        lead: 'ಸಂವಿಧಾನದ 25 ಮತ್ತು 26ನೇ ವಿಧಿಗಳ ಅಡಿಯಲ್ಲಿ ಧಾರ್ಮಿಕ ಸ್ವಾತಂತ್ರ್ಯವು ಸಾಂವಿಧಾನಿಕ ನೈತಿಕತೆ, 14ನೇ ವಿಧಿಯ ಲಿಂಗ ಸಮಾನತೆ ಮತ್ತು ವ್ಯಕ್ತಿಗತ ಮಾನವ ಘನತೆಗೆ ಬದ್ಧವಾಗಿರಬೇಕು ಎಂದು ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯ ಆದೇಶಿಸಿದೆ.',
        category: 'ಧಾರ್ಮಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಮತ್ತು ಸಾಂವಿಧಾನಿಕ ನೈತಿಕತೆ',
        takeaways: [
          '25ನೇ ವಿಧಿಯ ಧಾರ್ಮಿಕ ಸ್ವಾತಂತ್ರ್ಯವು ಸಾರ್ವಜನಿಕ ಸುವ್ಯವಸ್ಥೆ, ನೈತಿಕತೆ ಮತ್ತು ಮೂಲಭೂತ ಹಕ್ಕುಗಳಿಗೆ ಒಳಪಟ್ಟಿದೆ.',
          'ಧಾರ್ಮಿಕ ಪದ್ಧತಿಗಳ ಹೆಸರಿನಲ್ಲಿ ಜಾತಿ ಅಥವಾ ಲಿಂಗ ತಾರತಮ್ಯವನ್ನು ಸಮರ್ಥಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
          'ಸಾಂವಿಧಾನಿಕ ನೈತಿಕತೆಯು (Constitutional Morality) ಸಂಪ್ರದಾಯಗಳಿಗಿಂತ ಶ್ರೇಷ್ಠವಾಗಿದೆ.'
        ],
        sections: [
          {
            heading: 'ಸಾಂಪ್ರದಾಯಿಕ ಪದ್ಧತಿಗಳಿಗಿಂತ ಸಾಂವಿಧಾನಿಕ ನೈತಿಕತೆಯ ಪ್ರಾಧಾನ್ಯತೆ',
            paragraphs: [
              'ಭಾರತೀಯ ಸಂವಿಧಾನವು ಸಮಾನತೆ ಮತ್ತು ಸಾಮಾಜಿಕ ನ್ಯಾಯದ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ. 25ನೇ ವಿಧಿಯು ಧಾರ್ಮಿಕ ನಂಬಿಕೆಯನ್ನು ರಕ್ಷಿಸುತ್ತದೆಯಾದರೂ, ತಾರತಮ್ಯದ ಆಚರಣೆಗಳನ್ನು ರಕ್ಷಿಸುವುದಿಲ್ಲ ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹೇಳಿದೆ.',
              'ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನಿಗೂ ಸಮಾನ ಪೂಜಾ ಸ್ವಾತಂತ್ರ್ಯ ಮತ್ತು ಆತ್ಮಸಾಕ್ಷಿಯ ಹಕ್ಕು ಸಂವಿಧಾನದತ್ತವಾಗಿ ಲಭಿಸಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ಧಾರ್ಮಿಕ ಮತ್ತು ದತ್ತಿ ಸಂಸ್ಥೆಗಳು ತಾರತಮ್ಯ ರಹಿತ ನಿಯಮಾವಳಿಗಳನ್ನು ಪಾಲಿಸಬೇಕು',
          'ಸಾರ್ವಜನಿಕ ಧಾರ್ಮಿಕ ಸ್ಥಳಗಳಲ್ಲಿ ಸಮಾನ ಪ್ರವೇಶಾವಕಾಶವನ್ನು ಖಾತರಿಪಡಿಸಿ'
        ],
        warning: 'ಮಹಿಳೆಯರು ಅಥವಾ ಯಾವುದೇ ವರ್ಗದ ಜನರಿಗೆ ಪೂಜಾ ಸ್ಥಳಗಳಿಗೆ ಪ್ರವೇಶ ನಿರಾಕರಿಸುವುದು 14, 15 ಮತ್ತು 25ನೇ ವಿಧಿಗಳ ಉಲ್ಲಂಘನೆಯಾಗಿದೆ.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट: अनुच्छेद 25 के तहत धार्मिक स्वतंत्रता संवैधानिक नैतिकता और समानता के अधीन',
        lead: 'सर्वोच्च न्यायालय ने स्पष्ट किया कि अनुच्छेद 25 और 26 के तहत धार्मिक अधिकार संवैधानिक नैतिकता, लैंगिक समानता और मानवीय गरिमा के अधीन हैं।',
        category: 'धार्मिक स्वतंत्रता एवं संवैधानिक नैतिकता',
        takeaways: [
          'अनुच्छेद 25 सार्वजनिक व्यवस्था, नैतिकता और भाग 3 के मौलिक अधिकारों के अधीन है।',
          'रूढ़िवादिता के आधार पर किसी भी वर्ग से भेदभाव असंवैधानिक।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: பிரிவு 25 மத சுதந்திரம் அரசியலமைப்பு தார்மீகத்திற்கு உட்பட்டது',
        lead: 'மத நம்பிக்கைகள் பிரிவு 14 சமத்துவத்திற்கும் மனித மாண்பிற்கும் கட்டுப்பட்டது என உச்ச நீதிமன்றம் அறிவித்துள்ளது.',
        category: 'மத சுதந்திரம் & அரசியலமைப்பு தார்மீகம்',
        takeaways: [
          'பிரிவு 25 பொது அமைதி மற்றும் அடிப்படை உரிமைகளுக்கு உட்பட்டது.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు: అధికరణ 25 కింద మత స్వేచ్ఛ రాజ్యాంగ నైతికతకు లోబడి ఉండాలి',
        lead: 'మత ఆచారాలు సమానత్వం మరియు మానవ గౌరవానికి విరుద్ధంగా ఉండరాదని సుప్రీంకోర్టు తీర్పునిచ్చింది.',
        category: 'మత స్వేచ్ఛ & రాజ్యాంగ నైతికత',
        takeaways: [
          'అధికరణ 25 ప్రాథమిక హక్కులకు మరియు పౌర సమానత్వానికి లోబడి ఉంటుంది.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: অনুচ্ছেদ ২৫ এর অধীনে ধর্মীয় স্বাধীনতা সাংবিধানিক নৈতিকতার অধীন',
        lead: 'ধর্মীয় আচার-অনুষ্ঠান অনুচ্ছেদ ১৪ এর সমতা এবং মানবিক মর্যাদাকে খর্ব করতে পারে না।',
        category: 'ধর্মীয় স্বাধীনতা ও সমতা',
        takeaways: [
          'অনুচ্ছেদ ২৫ জনশৃঙ্খলা এবং মৌলিক অধিকারের অধীন।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: कलम २५ अंतर्गत धार्मिक स्वातंत्र्य घटनात्मक नैतिकतेच्या अधीन',
        lead: 'धार्मिक प्रथांच्या नावाखाली लिंग किंवा जातीवर आधारित भेदभाव करता येणार नाही असा निकाल सर्वोच्च न्यायालयाने दिला.',
        category: 'धार्मिक स्वातंत्र्य आणि घटनात्मक नैतिकता',
        takeaways: [
          'कलम २५ हे सार्वजनिक सुव्यवस्था आणि मानवी प्रतिष्ठेच्या अधीन आहे.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: અનુચ્છેદ ૨૫ હેઠળ ધાર્મિક સ્વતંત્રતા બંધારણીય નૈતિકતા અને સમાનતાને આધીન',
        lead: 'સુપ્રીમ કોર્ટે ઠરાવ્યું છે કે ધાર્મિક સ્વતંત્રતા મૂળભૂત અધિકારો અને માનવીય ગરિમા કરતાં સર્વોપરી નથી.',
        category: 'ધાર્મિક સ્વતંત્રતા અને નૈતિકતા',
        takeaways: [
          'અનુચ્છેદ ૨૫ જાહેર વ્યવસ્થા અને સમાનતાના અધિકારને આધીન છે.'
        ]
      }
    }
  },
  {
    id: 'india-const-article32-habeas-corpus-preventive-detention',
    region: 'Constitutional Remedies (Art. 32 & 226)',
    flag: '⚖️',
    category: 'Habeas Corpus & Constitutional Remedies',
    source: 'Supreme Court of India (Appellate & Writ Jurisdiction)',
    pubDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    relativeTime: '3 days ago',
    readTime: '5 min read',
    laws: ['Constitution of India Art. 32', 'Constitution of India Art. 226', 'Constitution of India Art. 22(4)'],
    link: 'https://main.sci.gov.in/',
    isLive: true,
    translations: {
      en: {
        title: 'Supreme Court Re-Anchors Article 32 as the Heart and Soul of the Constitution against Arbitrary Preventive Detention',
        lead: 'Quashing arbitrary preventive custody orders, the Supreme Court declares that constitutional courts must adjudicate Habeas Corpus petitions with utmost dispatch, recalling Dr. B.R. Ambedkar doctrine that Article 32 is the very soul of the Constitution.',
        category: 'Habeas Corpus & Constitutional Remedies',
        takeaways: [
          'Article 32 and 226 writ remedies represent the most potent shield against unlawful state detention.',
          'Preventive detention is an exceptional constitutional power subject to strict procedural compliance under Article 22.',
          'Unexplained delays in deciding representation petitions render detention orders void ab initio.'
        ],
        sections: [
          {
            heading: 'The Constitutional Sanctity of Article 32',
            paragraphs: [
              'The Supreme Court reaffirmed Dr. B.R. Ambedkar historic formulation that Article 32 is the very heart and soul of the Constitution of India. Without swift constitutional judicial remedies, fundamental rights become hollow promises.',
              'The bench directed that constitutional High Courts and the Supreme Court must accord immediate priority to Habeas Corpus petitions where personal liberty under Article 21 is curtailed.'
            ]
          }
        ],
        checklist: [
          'Verify that grounds of preventive detention are served in the detenu mother tongue within statutory deadlines',
          'Submit a formal constitutional representation to the state advisory board immediately',
          'File a Writ of Habeas Corpus under Article 32 (Supreme Court) or Article 226 (High Court) upon arbitrary detention'
        ],
        warning: 'Failure by state authorities to strictly follow Article 22 procedural safeguards invalidates preventive detention and invites constitutional writ compensation.'
      },
      kn: {
        title: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್: 32ನೇ ವಿಧಿ ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮ — ಅಕ್ರಮ ಬಂಧನದ ವಿರುದ್ಧ ಹೇಬಿಯಸ್ ಕಾರ್ಪಸ್ ಅರ್ಜಿಗಳ ತಕ್ಷಣದ ವಿಲೇವಾರಿ',
        lead: 'ಅಕ್ರಮ ತಡೆಗಾವಲು ಬಂಧನ ಆದೇಶಗಳನ್ನು ರದ್ದುಗೊಳಿಸಿದ ಸುಪ್ರೀಂ ಕೋರ್ಟ್, ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರ ನುಡಿಯಂತೆ 32ನೇ ವಿಧಿಯು ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮವಾಗಿದ್ದು, ಹೇಬಿಯಸ್ ಕಾರ್ಪಸ್ ಅರ್ಜಿಗಳನ್ನು ತಕ್ಷಣ ವಿಚಾರಣೆ ನಡೆಸಬೇಕು ಎಂದು ಆದೇಶಿಸಿದೆ.',
        category: 'ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳು ಮತ್ತು ಹೇಬಿಯಸ್ ಕಾರ್ಪಸ್',
        takeaways: [
          '32 ಮತ್ತು 226ನೇ ವಿಧಿಗಳ ರಿಟ್ ಪರಿಹಾರಗಳು ಅಕ್ರಮ ಬಂಧನದ ವಿರುದ್ಧ ನಾಗರಿಕರ ಪ್ರಬಲ ಸಾಂವಿಧಾನಿಕ ಕವಚವಾಗಿವೆ.',
          'ತಡೆಗಾವಲು ಬಂಧನವು ಅಸಾಧಾರಣ ಅಧಿಕಾರವಾಗಿದ್ದು, 22ನೇ ವಿಧಿಯ ನಿಯಮಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸಬೇಕು.',
          'ಅರ್ಜಿಗಳ ವಿಲೇವಾರಿಯಲ್ಲಿ ವಿಳಂಬವಾದರೆ ಬಂಧನ ಆದೇಶವು ಆರಂಭದಿಂದಲೇ ಅಸಿಂಧುವಾಗುತ್ತದೆ.'
        ],
        sections: [
          {
            heading: '32ನೇ ವಿಧಿಯ ಸಾಂವಿಧಾನಿಕ ಪಾವಿತ್ರ್ಯತೆ',
            paragraphs: [
              'ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಹೇಳಿದಂತೆ 32ನೇ ವಿಧಿಯಿಲ್ಲದೆ ಸಂವಿಧಾನ ಶೂನ್ಯ. ಮೂಲಭೂತ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆಗೆ ನ್ಯಾಯಾಂಗ ಪರಿಹಾರ ಅತ್ಯಗತ್ಯ ಎಂದು ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯ ಮರುಸ್ಥಾಪಿಸಿದೆ.',
              'ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಮೊಟಕುಗೊಂಡಾಗ ಉಚ್ಚ ನ್ಯಾಯಾಲಯಗಳು ಮತ್ತು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹೇಬಿಯಸ್ ಕಾರ್ಪಸ್ ಅರ್ಜಿಗಳಿಗೆ ಪ್ರಥಮ ಆದ್ಯತೆ ನೀಡಬೇಕು ಎಂದು ನ್ಯಾಯಪೀಠವು ನಿರ್ದೇಶಿಸಿದೆ.'
            ]
          }
        ],
        checklist: [
          'ಬಂಧನದ ಕಾರಣಗಳನ್ನು ಬಂಧಿತನ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಶಾಸನಬದ್ಧ ಗಡುವಿನೊಳಗೆ ಒದಗಿಸಲಾಗಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ',
          'ತಕ್ಷಣವೇ ರಾಜ್ಯ ಸಲಹಾ ಮಂಡಳಿಗೆ ಸಾಂವಿಧಾನಿಕ ಮನವಿ ಸಲ್ಲಿಸಿ',
          'ಅಕ್ರಮ ಬಂಧನವಾಗಿದ್ದರೆ 32 ಅಥವಾ 226ನೇ ವಿಧಿಯಡಿ ಹೇಬಿಯಸ್ ಕಾರ್ಪಸ್ ರಿಟ್ ಅರ್ಜಿ ದಾಖಲಿಸಿ'
        ],
        warning: 'ಸಂವಿಧಾನದ 22ನೇ ವಿಧಿಯ ಕಾರ್ಯವಿಧಾನಗಳನ್ನು ಪಾಲಿಸದ ತಡೆಗಾವಲು ಬಂಧನವು ಸಂಪೂರ್ಣ ಅಕ್ರಮವಾಗಿದ್ದು, ಸಂವಿಧಾನಬದ್ಧ ಪರಿಹಾರಕ್ಕೆ ಬಾಧ್ಯವಾಗಿರುತ್ತದೆ.'
      },
      hi: {
        title: 'सुप्रीम कोर्ट: अनुच्छेद 32 संविधान की आत्मा — अवैध हिरासत के विरुद्ध बंदी प्रत्यक्षीकरण का त्वरित निपटारा अनिवार्य',
        lead: 'सर्वोच्च न्यायालय ने डॉ. बी.आर. आंबेडकर के कथन को दोहराते हुए कहा कि अनुच्छेद 32 संविधान का हृदय और आत्मा है और बंदी प्रत्यक्षीकरण याचिकाओं का त्वरित निस्तारण होना चाहिए।',
        category: 'संवैधानिक उपचार एवं बंदी प्रत्यक्षीकरण',
        takeaways: [
          'अनुच्छेद 32 और 226 अवैध हिरासत के खिलाफ सबसे मजबूत सुरक्षा कवच हैं।',
          'निवारक हिरासत के मामलों में अनुच्छेद 22 के नियमों का कड़ाई से पालन अनिवार्य।'
        ]
      },
      ta: {
        title: 'உச்ச நீதிமன்றம்: பிரிவு 32 அரசியலமைப்பின் ஆன்மா — சட்டவிரோத தடுப்புக் காவலுக்கு எதிராக ஆட்கொணர்வு மனுக்கள்',
        lead: 'டாக்டர் அம்பேத்கர் குறிப்பிட்டது போல பிரிவு 32 அரசியலமைப்பின் இதயம் மற்றும் ஆன்மா என உச்ச நீதிமன்றம் மீண்டும் உறுதி செய்துள்ளது.',
        category: 'அரசியலமைப்பு பரிகாரங்கள் & ஆட்கொணர்வு',
        takeaways: [
          'பிரிவு 32 மற்றும் 226 சட்டவிரோத தடுப்புக் காவலுக்கு எதிரான மிகச் சிறந்த கவசமாகும்.'
        ]
      },
      te: {
        title: 'సుప్రీంకోర్టు: అధికరణ 32 రాజ్యాంగానికి ఆత్మ — అక్రమ నిర్బంధానికి వ్యతిరేకంగా హెబియస్ కార్పస్ పిటిషన్లు',
        lead: 'డాక్టర్ బి.ఆర్. అంబేద్కర్ మాటలను గుర్తుచేస్తూ సుప్రీంకోర్టు, అధికరణ 32 రాజ్యాంగానికి గుండెకాయ వంటిదని స్పష్టం చేసింది.',
        category: 'రాజ్యాంగ పరిహారాలు & హెబియస్ కార్పస్',
        takeaways: [
          'అధికరణ 32 మరియు 226 అక్రమ నిర్బంధాల నుండి పౌరులను రక్షించే ఆయుధాలు.'
        ]
      },
      bn: {
        title: 'সুপ্রিম কোর্ট: অনুচ্ছেদ ৩২ সংবিধানের প্রাণ — বেআইনি আটকের বিরুদ্ধে হেবিয়াস কর্পাস',
        lead: 'ডঃ বি আর আম্বেদকরের মতকে পুনরুজ্জীবিত করে শীর্ষ আদালত জানিয়েছে যে অনুচ্ছেদ ৩২ সংবিধানের আত্মা।',
        category: 'সাংবিধানিক প্রতিকার ও হেবিয়াস কর্পাস',
        takeaways: [
          'অনুচ্ছেদ ৩২ ও ২২৬ বেআইনি আটকের বিরুদ্ধে সবচেয়ে বড় ঢাল।'
        ]
      },
      mr: {
        title: 'सर्वोच्च न्यायालय: कलम ३२ संविधानाचा आत्मा — बेकायदेशीर अटकेविरुद्ध हेबियस कॉर्पस याचिकांचा जलद निपटारा',
        lead: 'डॉ. बाबासाहेब आंबेडकरांच्या विचारानुसार कलम ३२ हा संविधानाचा आत्मा असून नागरिकांच्या स्वातंत्र्याचे रक्षण करणे न्यायालयांचे कर्तव्य आहे.',
        category: 'घटनात्मक उपाययोजना आणि देहोपस्थिती',
        takeaways: [
          'कलम ३२ आणि २२६ बेकायदेशीर अटकेविरुद्ध सर्वात प्रभावी कायदेशीर कवच आहे.'
        ]
      },
      gu: {
        title: 'સુપ્રીમ કોર્ટ: અનુચ્છેદ ૩૨ બંધારણનો આત્મા — ગેરકાયદેસર અટકાયત સામે હેબિયસ કોર્પસ અરજીઓનો ઝડપી નિકાલ',
        lead: 'ડો. બાબાસાહેબ આંબેડકરના શબ્દોને દોહરાવતા સુપ્રીમ કોર્ટે કહ્યું કે અનુચ્છેદ ૩૨ બંધારણનું હૃદય અને આત્મા છે.',
        category: 'બંધારણીય ઉપાયો અને હેબિયસ કોર્પસ',
        takeaways: [
          'અનુચ્છેદ ૩૨ અને ૨૨૬ ગેરકાયદેસર અટકાયત સામે સૌથી મજબૂત કવચ છે.'
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

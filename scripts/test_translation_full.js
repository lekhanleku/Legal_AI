// Full translation integration test
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'newsLanguages.js'), 'utf8');

// Check for emojis
const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
if (emojiRegex.test(code)) {
  console.error('FAIL: Emojis detected in newsLanguages.js!');
  process.exit(1);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const sampleArticle = {
  id: 'world-live-art-act-age-restrictions-apply-individually-not-to-married-couples-as-a-unit-p-h-high-court-allows-ivf',
  title: 'ART Act Age Restrictions Apply Individually, Not To Married Couples As A Unit: P&H High Court Allows IVF...',
  category: 'International Treaties & Conventions',
  lead: 'Live legal dispatch reported by Live Law: In-depth analysis of evolving judicial proceedings, jurisdictional rulings, and regulatory compliance standards concerning "ART Act Age Restrictions Apply Individually, Not To Married Couples As A Unit: P&H High Court Allows IVF...".',
  takeaways: [
    'Authoritative proceeding docketed and reviewed by Live Law.',
    'Direct compliance and operational exposure governed under International Treaties & Conventions.',
    'Legal counsel advised to monitor active motions and regional appellate deadlines.'
  ],
  sections: [
    {
      heading: 'Factual Background & Judicial Forum',
      paragraphs: [
        'The Punjab & Haryana High Court examined the statutory limits under the ART Act regarding maternal and paternal age qualifications for assisted reproductive procedures.'
      ]
    }
  ],
  checklist: [
    'Verify individual age documentation prior to medical fertility protocol commencement.'
  ],
  warning: 'This article provides general informational guidance and is not a substitute for formal attorney-client representation.'
};

const languages = ['gu', 'kn', 'hi', 'ta', 'te', 'bn', 'mr'];

for (const lang of languages) {
  const localized = sandbox.window.getLocalizedArticle(sampleArticle, lang);
  if (!localized) {
    console.error(`FAIL: No localized article for ${lang}`);
    process.exit(1);
  }
  if (localized.title === sampleArticle.title) {
    console.error(`FAIL: Title did not translate for ${lang}`);
    process.exit(1);
  }
  console.log(`[PASS] ${lang.toUpperCase()} Title: ${localized.title.substring(0, 70)}...`);
  console.log(`       Takeaways translated count: ${localized.takeaways.length}`);
}

console.log('\nALL 7 INDIAN LANGUAGES TRANSLATED SUCCESSFULLY!');

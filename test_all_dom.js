const fs = require('fs');
const vm = require('vm');

function createDOMEnvironment(htmlContent) {
  const elements = new Map();
  const eventListeners = new Map();
  const docEventListeners = {};
  const winEventListeners = {};

  function createElement(tagName, id = '', className = '') {
    const classListSet = new Set(className.split(' ').filter(Boolean));
    const el = {
      tagName: tagName.toUpperCase(),
      id,
      className,
      classList: {
        add: (...cls) => cls.forEach(c => classListSet.add(c)),
        remove: (...cls) => cls.forEach(c => classListSet.delete(c)),
        contains: (c) => classListSet.has(c),
        toggle: (c, force) => {
          if (force !== undefined) {
            force ? classListSet.add(c) : classListSet.delete(c);
          } else {
            classListSet.has(c) ? classListSet.delete(c) : classListSet.add(c);
          }
        }
      },
      style: {},
      options: [],
      children: [],
      parentElement: null,
      appendChild: (child) => {
        el.children.push(child);
        child.parentElement = el;
        if (el.tagName === 'SELECT' && child.tagName === 'OPTION') {
          el.options.push(child);
        }
        return child;
      },
      remove: () => {},
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null,
      value: '',
      textContent: '',
      innerHTML: '',
      src: '',
      href: '',
      getAttribute: (attr) => el[attr] || null,
      setAttribute: (attr, val) => { el[attr] = val; },
      removeAttribute: (attr) => { delete el[attr]; },
      dataset: {},
      addEventListener: (type, handler) => {
        if (!eventListeners.has(el)) eventListeners.set(el, {});
        const map = eventListeners.get(el);
        if (!map[type]) map[type] = [];
        map[type].push(handler);
      },
      dispatchEvent: (event) => {
        const map = eventListeners.get(el);
        if (map && map[event.type]) {
          map[event.type].forEach(h => h.call(el, event));
        }
      },
      click: () => {
        el.dispatchEvent({
          type: 'click',
          target: el,
          preventDefault: () => {},
          stopPropagation: () => {}
        });
      },
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 40 }),
      focus: () => {},
      reset: () => {},
      submit: () => {},
      scrollIntoView: () => {},
      scrollTo: () => {},
      closest: (sel) => {
        if (sel === 'button' && el.tagName === 'BUTTON') return el;
        if (sel === 'a' && el.tagName === 'A') return el;
        return null;
      }
    };
    return el;
  }

  // Parse all elements with id and their class from HTML tags
  const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)>/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(htmlContent)) !== null) {
    const tagName = tagMatch[1];
    const attrs = tagMatch[2];
    const idMatch = /id=["']([^"']+)["']/.exec(attrs);
    const classMatch = /class=["']([^"']+)["']/.exec(attrs);
    if (idMatch) {
      const id = idMatch[1];
      const className = classMatch ? classMatch[1] : '';
      if (!elements.has(id)) {
        elements.set(id, createElement(tagName, id, className));
      }
    }
  }

  const documentMock = {
    head: createElement('head'),
    body: createElement('body'),
    getElementById: (id) => elements.get(id) || null,
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements.get(sel.slice(1)) || null;
      return createElement('div');
    },
    querySelectorAll: (sel) => [],
    createElement: (tag) => createElement(tag),
    addEventListener: (type, handler) => {
      if (!docEventListeners[type]) docEventListeners[type] = [];
      docEventListeners[type].push(handler);
    },
    removeEventListener: () => {},
    dispatchEvent: (event) => {
      if (docEventListeners[event.type]) {
        docEventListeners[event.type].forEach(h => h(event));
      }
    },
    readyState: 'complete'
  };

  const windowMock = {
    document: documentMock,
    location: { href: 'http://localhost:5000/index.html', origin: 'http://localhost:5000', search: '', pathname: '/index.html' },
    navigator: { userAgent: 'NodeTest' },
    localStorage: {
      data: {},
      getItem: (k) => windowMock.localStorage.data[k] || null,
      setItem: (k, v) => { windowMock.localStorage.data[k] = String(v); },
      removeItem: (k) => { delete windowMock.localStorage.data[k]; }
    },
    setTimeout: (fn, delay) => { fn(); return 1; },
    setInterval: () => 1,
    clearTimeout: () => {},
    clearInterval: () => {},
    addEventListener: (type, handler) => {
      if (!winEventListeners[type]) winEventListeners[type] = [];
      winEventListeners[type].push(handler);
    },
    dispatchEvent: (event) => {
      if (winEventListeners[event.type]) {
        winEventListeners[event.type].forEach(h => h(event));
      }
    },
    fetch: async () => ({ ok: true, json: async () => ({ courts: [], lawyers: [], bookings: [] }) }),
    aiSuggestionsCache: { courts: {}, lawyers: {} },
    console: console,
    requestAnimationFrame: (cb) => cb(),
    URL,
    URLSearchParams
  };

  class IntersectionObserverMock {
    constructor(cb) { this.cb = cb; }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  windowMock.IntersectionObserver = IntersectionObserverMock;
  windowMock.window = windowMock;
  windowMock.global = windowMock;

  return { elements, documentMock, windowMock, docEventListeners, winEventListeners };
}

let passed = 0;
let failed = 0;

function assert(name, condition, extra = '') {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name} ${extra}`);
    failed++;
  }
}

console.log('====================================================');
console.log('   LEGALAI COMPREHENSIVE DOM & FUNCTION VERIFICATION');
console.log('====================================================\n');

// ──────────────────────────────────────────────────
// TEST SUITE 1: index.html & script.js
// ──────────────────────────────────────────────────
console.log('--- SUITE 1: index.html + script.js ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const env1 = createDOMEnvironment(indexHtml);
const ctx1 = vm.createContext(env1.windowMock);

vm.runInContext(fs.readFileSync('indianCourts.js', 'utf8'), ctx1);
vm.runInContext(fs.readFileSync('newsLanguages.js', 'utf8'), ctx1);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), ctx1);

// Test 1.1: Court modal initial hidden state
const courtOverlay = env1.elements.get('court-modal-overlay');
assert('Court modal overlay starts hidden or has class', courtOverlay && courtOverlay.classList.contains('hidden'));

// Test 1.2: Click nav item courts directory (The exact feature user reported)
const navItemCourts = env1.elements.get('nav-item-courts-directory');
assert('nav-item-courts-directory exists in DOM', !!navItemCourts);
if (navItemCourts) {
  navItemCourts.click();
  const isShown = !courtOverlay.classList.contains('hidden');
  const title = env1.elements.get('court-modal-title');
  assert('Clicking nav-item-courts-directory opens Court Modal', isShown);
  assert('Court Modal title is Supreme Court of India', title && title.textContent.includes('Supreme Court of India'), `(got: "${title?.textContent}")`);
}

// Test 1.3: Quick court switcher options
const quickSelect = env1.elements.get('court-modal-quick-select');
assert('Court quick switch select exists and was populated', quickSelect && quickSelect.innerHTML.length > 100);

// Test 1.4: Switch to Delhi High Court
ctx1.openCourtModal('DHC');
const titleDhc = env1.elements.get('court-modal-title');
assert('openCourtModal("DHC") displays High Court of Delhi', titleDhc && titleDhc.textContent.includes('Delhi'));

// Test 1.5: Switch to Bombay High Court
ctx1.openCourtModal('BHC');
const titleBhc = env1.elements.get('court-modal-title');
assert('openCourtModal("BHC") displays High Court of Bombay', titleBhc && titleBhc.textContent.includes('Bombay'));

// Test 1.6: openCourtModal with no params defaults to Supreme Court
ctx1.openCourtModal();
const titleDefault = env1.elements.get('court-modal-title');
assert('openCourtModal() defaults to Supreme Court', titleDefault && titleDefault.textContent.includes('Supreme Court'));

// Test 1.7: Close court modal via close button
const courtCloseBtn = env1.elements.get('court-modal-close');
assert('court-modal-close button exists', !!courtCloseBtn);
if (courtCloseBtn) {
  courtCloseBtn.click();
  assert('Court modal closed after clicking close button', courtOverlay.classList.contains('hidden'));
}

// Test 1.8: Close court modal via Escape key
ctx1.openCourtModal('sci');
assert('Court modal reopened', !courtOverlay.classList.contains('hidden'));
env1.documentMock.dispatchEvent({ type: 'keydown', key: 'Escape' });
assert('Court modal closed via Escape key', courtOverlay.classList.contains('hidden'));

// Test 1.9: AI Drawer toggle
const aiDrawer = env1.elements.get('ai-drawer');
assert('AI Drawer exists in DOM', !!aiDrawer);
ctx1.openAIDrawer();
assert('openAIDrawer() makes AI drawer visible', !aiDrawer.classList.contains('hidden'));
ctx1.closeAIDrawer();
assert('closeAIDrawer() hides AI drawer', aiDrawer.classList.contains('hidden'));

// Test 1.10: CTA buttons
const ctaConsult = env1.elements.get('cta-consult');
assert('cta-consult exists', !!ctaConsult);
if (ctaConsult) {
  ctaConsult.click();
  assert('cta-consult opens AI drawer', !aiDrawer.classList.contains('hidden'));
  ctx1.closeAIDrawer();
}

const ctaLearn = env1.elements.get('cta-learn');
const articlesOverlay = env1.elements.get('articles-modal-overlay');
assert('cta-learn exists', !!ctaLearn);
if (ctaLearn) {
  ctaLearn.click();
  assert('cta-learn opens articles modal', articlesOverlay && !articlesOverlay.classList.contains('hidden'));
  ctx1.closeArticlesModal();
  assert('closeArticlesModal() closes articles modal', articlesOverlay.classList.contains('hidden'));
}

// Test 1.11: Bookings Modal
const bookingsOverlay = env1.elements.get('bookings-modal-overlay');
ctx1.openBookingsModal();
assert('openBookingsModal() makes bookings overlay visible', bookingsOverlay && !bookingsOverlay.classList.contains('hidden'));
ctx1.closeBookingsModal();
assert('closeBookingsModal() hides bookings overlay', bookingsOverlay.classList.contains('hidden'));

// Test 1.12: RAG Lab Modal
const ragOverlay = env1.elements.get('rag-lab-modal-overlay');
ctx1.openRagLabModal();
assert('openRagLabModal() makes RAG lab visible', ragOverlay && !ragOverlay.classList.contains('hidden'));
ctx1.closeRagLabModal();
assert('closeRagLabModal() hides RAG lab', ragOverlay.classList.contains('hidden'));

// Test 1.13: Lawyer profile & Consult Modals
const lawyerOverlay = env1.elements.get('lawyer-modal-overlay');
ctx1.openLawyerModal(1);
assert('openLawyerModal(1) opens lawyer modal', lawyerOverlay && !lawyerOverlay.classList.contains('hidden'));
ctx1.closeLawyerModal();
assert('closeLawyerModal() hides lawyer modal', lawyerOverlay.classList.contains('hidden'));

const consultOverlay = env1.elements.get('consult-modal-overlay');
// 1.13a: Unauthenticated attempt prompts login
ctx1.openConsultModal(1);
assert('Unauthenticated openConsultModal keeps modal hidden (redirects to login)', consultOverlay.classList.contains('hidden'));

// 1.13b: Authenticated user opens consultation modal
env1.windowMock.localStorage.setItem('legalai_token', 'jwt_test_token_123');
env1.windowMock.localStorage.setItem('legalai_user', JSON.stringify({ name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210' }));
ctx1.openConsultModal(1);
assert('Authenticated openConsultModal(1) opens consult modal', !consultOverlay.classList.contains('hidden'));
ctx1.closeConsultModal();
assert('closeConsultModal() hides consult modal', consultOverlay.classList.contains('hidden'));

// Test 1.14: Side menu toggle
const sideMenuDrawer = env1.elements.get('side-menu-drawer');
assert('side-menu-drawer exists', !!sideMenuDrawer);
ctx1.openSideMenu();
assert('openSideMenu() sets open class on side menu', sideMenuDrawer.classList.contains('open'));
ctx1.closeSideMenu();
assert('closeSideMenu() removes open class from side menu', !sideMenuDrawer.classList.contains('open'));

// ──────────────────────────────────────────────────
// TEST SUITE 2: lawyers.html & lawyers.js
// ──────────────────────────────────────────────────
console.log('\n--- SUITE 2: lawyers.html + lawyers.js ---');
const lawyersHtml = fs.readFileSync('lawyers.html', 'utf8');
const env2 = createDOMEnvironment(lawyersHtml);
const ctx2 = vm.createContext(env2.windowMock);

vm.runInContext(fs.readFileSync('indianCourts.js', 'utf8'), ctx2);
vm.runInContext(fs.readFileSync('lawyers.js', 'utf8'), ctx2);

assert('lawyers.js loaded without error', typeof ctx2.fetchAndRenderLawyers === 'function');
assert('openLawyerModal available on lawyers.html', typeof ctx2.openLawyerModal === 'function');
assert('openConsultModal available on lawyers.html', typeof ctx2.openConsultModal === 'function');

const lawyersGrid = env2.elements.get('lawyers-grid');
assert('lawyers-grid element exists in lawyers.html', !!lawyersGrid);

// ──────────────────────────────────────────────────
// TEST SUITE 3: user.html & user.js
// ──────────────────────────────────────────────────
console.log('\n--- SUITE 3: user.html + user.js ---');
const userHtml = fs.readFileSync('user.html', 'utf8');
const env3 = createDOMEnvironment(userHtml);
const ctx3 = vm.createContext(env3.windowMock);

vm.runInContext(fs.readFileSync('user.js', 'utf8'), ctx3);
assert('user.js loaded without error', typeof ctx3.initUserPortal === 'function');
assert('showAccessGate exists in user.js', typeof ctx3.showAccessGate === 'function');
assert('showDashboard exists in user.js', typeof ctx3.showDashboard === 'function');

// ──────────────────────────────────────────────────
// TEST SUITE 4: admin.html & admin.js
// ──────────────────────────────────────────────────
console.log('\n--- SUITE 4: admin.html + admin.js ---');
const adminHtml = fs.readFileSync('admin.html', 'utf8');
const env4 = createDOMEnvironment(adminHtml);
const ctx4 = vm.createContext(env4.windowMock);

vm.runInContext(fs.readFileSync('admin.js', 'utf8'), ctx4);
assert('admin.js loaded without error', typeof ctx4.initAdminDashboard === 'function');
assert('loadAdminStats exists in admin.js', typeof ctx4.loadAdminStats === 'function');
assert('loadAdminLawyers exists in admin.js', typeof ctx4.loadAdminLawyers === 'function');

console.log('\n====================================================');
console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

process.exit(failed > 0 ? 1 : 0);

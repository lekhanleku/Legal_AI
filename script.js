/* ===================================
   LEGALAI — JAVASCRIPT
   =================================== */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ── NAV LINK ACTIVE STATE ──
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // close mobile menu
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── HERO SLIDER (text only) ──
const slides = [
  {
    tag: 'WE FIGHT FOR JUSTICE',
    line1: 'Dedicated To One',
    line2: 'Client At A Time.',
    sub: 'Combining decades of legal expertise with cutting-edge AI technology to deliver justice for every client.',
    counter: '01 / 02'
  },
  {
    tag: 'YOUR RIGHTS MATTER',
    line1: 'Excellence In Every',
    line2: 'Case We Take.',
    sub: 'Our AI-powered platform matches you with the right attorney for your specific legal situation.',
    counter: '02 / 02'
  }
];
let currentSlide = 0;

function applySlide(index) {
  const s = slides[index];
  document.querySelector('.tag-text').textContent = s.tag;
  document.getElementById('line1').textContent = s.line1;
  document.getElementById('line2').textContent = s.line2;
  document.getElementById('hero-sub').textContent = s.sub;
  document.getElementById('slide-counter').textContent = s.counter;

  // animate
  const content = document.getElementById('hero-content');
  content.style.opacity = '0';
  content.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
  });
}

document.getElementById('slider-next').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  applySlide(currentSlide);
});
document.getElementById('slider-prev').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  applySlide(currentSlide);
});

// Auto-advance
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  applySlide(currentSlide);
}, 6000);

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;
const heroStats = document.getElementById('hero-stats');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(c => animateCounter(c));
    }
  });
}, { threshold: 0.5 });
statsObserver.observe(heroStats);

// ── SCROLL REVEAL ──
const revealElements = document.querySelectorAll(
  '.why-left, .why-center, .why-right, .feature-card, .area-card, .section-header'
);

revealElements.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

// Small delay so CSS transition is set before observing
requestAnimationFrame(() => {
  revealElements.forEach(el => revealObserver.observe(el));
});

// ── BUTTON RIPPLE ──
function addRipple(btn) {
  btn.addEventListener('click', function (e) {
    const r = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.22);
      transform:scale(0); animation:rippleAnim 0.6s linear;
    `;
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
}

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
document.head.appendChild(style);

[
  document.getElementById('btn-login'),
  document.getElementById('btn-register'),
  document.getElementById('cta-consult'),
  document.getElementById('cta-learn')
].forEach(btn => { if (btn) { btn.style.position = 'relative'; addRipple(btn); } });

// ── AUTH SYSTEM & MONGODB API INTEGRATION ──

// Dynamic Server Origin Detection (handles localhost:5000, 127.0.0.1:5000, custom ports, or static local files)
const SERVER_ORIGIN = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? window.location.origin
  : 'http://localhost:5000';

const API_BASE_URL = `${SERVER_ORIGIN}/api/auth`;

// DOM Elements
const authModalOverlay = document.getElementById('auth-modal-overlay');
const modalCloseBtn     = document.getElementById('modal-close-btn');
const modalTitle        = document.getElementById('modal-title');
const modalSubtitle     = document.getElementById('modal-subtitle');
const loginForm         = document.getElementById('login-form');
const registerForm      = document.getElementById('register-form');
const formAlert         = document.getElementById('form-alert');
const switchToRegister  = document.getElementById('switch-to-register');
const switchToLogin     = document.getElementById('switch-to-login');
const loggedOutView     = document.getElementById('logged-out-view');
const loggedInView      = document.getElementById('logged-in-view');
const userNameEl        = document.getElementById('user-name');
const userAvatarEl      = document.getElementById('user-avatar');
const btnLogout         = document.getElementById('btn-logout');

let currentMode = 'login'; // 'login' | 'register'

// Show Toast Function
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span style="font-weight:700;font-size:16px;">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Show Form Alert
function setFormAlert(message, type = 'error') {
  if (!formAlert) return;
  if (!message) {
    formAlert.classList.add('hidden');
    formAlert.textContent = '';
    return;
  }
  formAlert.className = `form-alert ${type}`;
  formAlert.textContent = message;
  formAlert.classList.remove('hidden');
}

// Modal Control
function openModal(mode = 'login') {
  currentMode = mode;
  setFormAlert('');
  authModalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (mode === 'login') {
    modalTitle.textContent = 'Welcome Back';
    modalSubtitle.textContent = 'Sign in to access your legal dashboard & AI assistant';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    modalTitle.textContent = 'Create Account';
    modalSubtitle.textContent = 'Join LegalAI to consult top lawyers & AI legal tools';
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function closeModal() {
  authModalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  setFormAlert('');
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const targetId = this.dataset.target;
    const input = document.getElementById(targetId);
    if (input) {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      this.style.color = isPassword ? 'var(--gold)' : 'var(--muted)';
    }
  });
});

// Event Listeners for Open / Switch
document.getElementById('btn-login')?.addEventListener('click', () => openModal('login'));
document.getElementById('btn-register')?.addEventListener('click', () => openModal('register'));
modalCloseBtn?.addEventListener('click', closeModal);

authModalOverlay?.addEventListener('click', (e) => {
  if (e.target === authModalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !authModalOverlay.classList.contains('hidden')) {
    closeModal();
  }
});

switchToRegister?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('register');
});

switchToLogin?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('login');
});

// Update Navbar Auth State
function setLoggedInState(user) {
  if (!user) {
    loggedOutView.classList.remove('hidden');
    loggedInView.classList.add('hidden');
    return;
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  userAvatarEl.textContent = initial;
  userNameEl.textContent = user.name;
  
  loggedOutView.classList.add('hidden');
  loggedInView.classList.remove('hidden');
}

// Check session on startup
async function initSession() {
  const token = localStorage.getItem('legalai_token');
  const cachedUser = localStorage.getItem('legalai_user');

  if (cachedUser) {
    try {
      setLoggedInState(JSON.parse(cachedUser));
    } catch (e) {}
  }

  if (!token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('legalai_user', JSON.stringify(data.user));
      setLoggedInState(data.user);
    } else {
      // Token expired or invalid
      localStorage.removeItem('legalai_token');
      localStorage.removeItem('legalai_user');
      setLoggedInState(null);
    }
  } catch (err) {
    console.log('Session verification server offline or unreachable.');
  }
}

// ── LOGIN FORM SUBMISSION ──
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setFormAlert('');

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnSpinner.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('legalai_token', data.token);
      localStorage.setItem('legalai_user', JSON.stringify(data.user));
      setLoggedInState(data.user);
      closeModal();
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      loginForm.reset();
    } else {
      setFormAlert(data.message || 'Login failed. Please try again.', 'error');
    }
  } catch (err) {
    setFormAlert('Could not connect to authentication server. Ensure backend is running.', 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
  }
});

// ── REGISTER FORM SUBMISSION ──
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setFormAlert('');

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const role = document.getElementById('reg-role').value;
  const password = document.getElementById('reg-password').value;
  const submitBtn = document.getElementById('reg-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  if (password.length < 8) {
    setFormAlert('Password must be at least 8 characters long.', 'error');
    return;
  }

  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnSpinner.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('legalai_token', data.token);
      localStorage.setItem('legalai_user', JSON.stringify(data.user));
      setLoggedInState(data.user);
      closeModal();
      showToast(`Account created! Welcome to LegalAI, ${data.user.name}.`, 'success');
      registerForm.reset();
    } else {
      setFormAlert(data.message || 'Registration failed. Please try again.', 'error');
    }
  } catch (err) {
    setFormAlert('Could not connect to authentication server. Ensure backend is running.', 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
  }
});

// ── LOGOUT HANDLER ──
btnLogout?.addEventListener('click', () => {
  localStorage.removeItem('legalai_token');
  localStorage.removeItem('legalai_user');
  setLoggedInState(null);
  showToast('You have been logged out.', 'info');
});

// Initialize session check on load
initSession();

// ===================================
// LEGALAI ASSISTANT (FRONTEND CLIENT)
// ===================================

const AI_API_BASE = `${SERVER_ORIGIN}/api/ai`;

// ── BACKEND HEALTH MONITOR ──
let isBackendOnline = false;

async function checkBackendHealth() {
  const statusDot = document.getElementById('ai-status-indicator');
  const statusBadge = document.getElementById('ai-status-badge');
  const statusSub = document.getElementById('ai-status-sub');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${SERVER_ORIGIN}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      isBackendOnline = true;
      if (statusDot) {
        statusDot.classList.remove('offline');
        statusDot.title = 'LegalAI Backend: Online';
      }
      if (statusBadge) {
        statusBadge.textContent = 'Server Online';
        statusBadge.style.background = 'rgba(34, 197, 94, 0.15)';
        statusBadge.style.color = '#22c55e';
        statusBadge.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      }
      if (statusSub) {
        statusSub.textContent = 'Connected to LegalAI Intelligence Server';
      }
      return true;
    }
  } catch (err) {
    // Server is offline
  }

  isBackendOnline = false;
  if (statusDot) {
    statusDot.classList.add('offline');
    statusDot.title = 'LegalAI Backend: Offline (Offline Engine Active)';
  }
  if (statusBadge) {
    statusBadge.textContent = 'Offline Engine Active';
    statusBadge.style.background = 'rgba(245, 158, 11, 0.15)';
    statusBadge.style.color = '#f59e0b';
    statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
  }
  if (statusSub) {
    statusSub.textContent = 'Run run.bat to enable full database sync';
  }
  return false;
}

// Initial health check and periodic ping
checkBackendHealth();
setInterval(checkBackendHealth, 10000);

// ── CLIENT-SIDE LEGAL REASONING ENGINE (OFFLINE FALLBACK) ──
const CLIENT_LEGAL_DOMAINS = [
  {
    id: 'tenant',
    name: 'Landlord & Tenant Law',
    specialty: 'Real Estate Law',
    courtCode: 'COOK-IL',
    courtGuidance: 'Residential lease breaches, habitability actions, and security deposit disputes proceed in the County Municipal / Small Claims Housing Division with expedited mediation protocols.',
    fallbackLawyer: {
      id: 15,
      name: 'Aisha Bello, J.D.',
      title: 'Senior Housing & Property Counsel',
      specialty: 'Real Estate Law',
      barNumber: 'IL-6329104',
      experienceYears: 12,
      firmName: 'Bello & Associates Real Estate Practice',
      city: 'Chicago',
      state: 'IL',
      hourlyRate: 315,
      rating: 4.9,
      reviewCount: 48,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      casesWon: 240,
      successRate: 97,
      matchReason: 'Top-rated specialist in Landlord-Tenant disputes with 12 years of trial experience and a 97% case success rate.'
    },
    fallbackCourt: {
      id: 14,
      code: 'COOK-IL',
      name: 'Cook County Circuit Court',
      jurisdiction: 'County / Municipal',
      level: 'Trial',
      city: 'Chicago',
      state: 'IL',
      address: '50 West Washington Street, Richard J. Daley Center',
      filingSystem: 'Odyssey eFileIL',
      website: 'https://www.cookcountycourt.org',
      overview: 'One of the largest unified court systems in the world, hearing municipal housing violations, eviction defense, and contract disputes.',
      jurisdictionGuidance: 'Residential lease breaches, habitability actions, and security deposit disputes under $10,000 proceed in the County Municipal / Small Claims Housing Division with expedited mediation protocols.'
    },
    keywords: ['landlord', 'tenant', 'rent', 'lease', 'eviction', 'deposit', 'security deposit', 'apartment', 'housing', 'sublet', 'padlock', 'lockout'],
    rights: [
      'Right to the warranty of habitability (safe, clean, functional living conditions)',
      'Protection against retaliatory eviction or constructive eviction',
      'Statutory limits on security deposit deductions and strict return deadlines (commonly 14–30 days)',
      'Requirement of formal written notice prior to entering or termination of tenancy'
    ],
    actions: [
      'Document all communications in writing (certified mail or email with delivery receipts)',
      'Photograph and video the exact condition of the premises with date/time stamps',
      'Send a formal demand letter citing local housing code and state deposit statutes',
      'Refrain from self-help withholding of rent without statutory escrow compliance'
    ],
    documents: ['Lease agreement & addendums', 'Move-in/move-out inspection checklist', 'Bank statements & rent receipts', 'Written repair requests & notices'],
    attorneyRole: 'Tenant Rights & Real Estate Attorney'
  },
  {
    id: 'criminal',
    name: 'Criminal Defense & Rights',
    specialty: 'Criminal Defense',
    courtCode: 'MASS-SUFFOLK',
    courtGuidance: 'Misdemeanors and preliminary felony arraignments begin in the District/Municipal Court, while major felony indictments are tried before the Superior Court trial division.',
    fallbackLawyer: {
      id: 1,
      name: 'Marcus Vance, J.D.',
      title: 'Principal Criminal Defense Litigator',
      specialty: 'Criminal Defense',
      barNumber: 'MA-6712901',
      experienceYears: 18,
      firmName: 'Vance Defense Group',
      city: 'Boston',
      state: 'MA',
      hourlyRate: 450,
      rating: 4.9,
      reviewCount: 64,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      casesWon: 380,
      successRate: 96,
      matchReason: 'Recognized trial advocate with 18 years defending constitutional liberties and 380+ successful verdicts.'
    },
    fallbackCourt: {
      id: 17,
      code: 'MASS-SUFFOLK',
      name: 'Massachusetts Superior Court - Suffolk County',
      jurisdiction: 'State Superior',
      level: 'Trial',
      city: 'Boston',
      state: 'MA',
      address: '3 Pemberton Square, Suffolk County Courthouse',
      filingSystem: 'Tyler eFileMA',
      website: 'https://www.mass.gov/orgs/superior-court',
      overview: 'General trial jurisdiction court presiding over serious felony prosecutions, major civil controversies, and constitutional liberties.',
      jurisdictionGuidance: 'Misdemeanors and preliminary felony arraignments begin in the District/Municipal Court, while major felony indictments are tried before the Superior Court trial division.'
    },
    keywords: ['arrest', 'police', 'cop', 'jail', 'bail', 'charge', 'felony', 'misdemeanor', 'warrant', 'investigation', 'interrogation', 'dui', 'miranda'],
    rights: [
      '5th Amendment right to remain silent — you are never required to answer investigatory questions',
      '6th Amendment right to legal counsel prior to and during any interrogation',
      '4th Amendment protection against unreasonable searches without a valid signed warrant or established exception',
      'Right to a speedy, public trial and prompt arraignment (typically within 48–72 hours)'
    ],
    actions: [
      'Politely invoke your right to remain silent: "I am exercising my right to remain silent and want an attorney"',
      'Do not consent to warrantless searches of your person, vehicle, phone, or residence',
      'Never resist physically; remember names, badge numbers, and patrol vehicle identifiers',
      'Contact a criminal defense attorney or public defender immediately before discussing facts with anyone'
    ],
    documents: ['Citation or charging documents', 'Bail bond paperwork', 'Property seizure receipts', 'Names and contacts of eyewitnesses'],
    attorneyRole: 'Criminal Defense Specialist'
  },
  {
    id: 'corporate',
    name: 'Corporate, Business & Startup Law',
    specialty: 'Corporate Law',
    courtCode: 'DE-CHANCERY',
    courtGuidance: 'Court of Chancery maintains exclusive equity jurisdiction over Delaware corporation governance, shareholder disputes, and corporate fiduciary duty litigations.',
    fallbackLawyer: {
      id: 4,
      name: 'Eleanor Vance, J.D.',
      title: 'Senior Corporate Partner',
      specialty: 'Corporate Law',
      barNumber: 'DE-3982019',
      experienceYears: 21,
      firmName: 'Vance & Sterling LLP',
      city: 'Wilmington',
      state: 'DE',
      hourlyRate: 550,
      rating: 5.0,
      reviewCount: 92,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      casesWon: 410,
      successRate: 98,
      matchReason: 'Elite corporate strategist specializing in Delaware Chancery disputes, mergers, and founder equity structuring.'
    },
    fallbackCourt: {
      id: 13,
      code: 'DE-CHANCERY',
      name: 'Delaware Court of Chancery',
      jurisdiction: 'State Equity Court',
      level: 'Trial',
      city: 'Wilmington',
      state: 'DE',
      address: '500 North King Street, Leonard L. Williams Justice Center',
      filingSystem: 'File & ServeXpress',
      website: 'https://courts.delaware.gov/chancery',
      overview: 'The nation\'s preeminent forum for corporate law, hearing fiduciary duty breaches, mergers & acquisitions disputes, and derivative corporate suits.',
      jurisdictionGuidance: 'Court of Chancery maintains exclusive equity jurisdiction over Delaware corporation governance, shareholder disputes, and corporate fiduciary duty litigations.'
    },
    keywords: ['llc', 'corporation', 'incorporate', 'partnership', 'equity', 'shares', 'founder', 'trademark', 'patent', 'copyright', 'intellectual property', 'investor', 's-corp'],
    rights: [
      'Limited personal liability shielding owners from enterprise obligations',
      'Ownership governance determined by operating agreements and corporate bylaws',
      'Fiduciary duties owed by directors, managers, and controlling members',
      'Statutory inspection rights of books, records, and financial statements'
    ],
    actions: [
      'Select the appropriate entity structure (LLC for pass-through flexibility, C-Corp for institutional venture capital)',
      'Draft a comprehensive Operating Agreement / Bylaws establishing vesting, voting, and dissolution terms',
      'Maintain strict separation between corporate and personal finances to prevent piercing the corporate veil',
      'File for trademark protection and execute Proprietary Information & Inventions Agreements (PIIA)'
    ],
    documents: ['Articles of Organization / Incorporation', 'Operating Agreement or Bylaws', 'EIN confirmation from IRS', 'Cap table & stock purchase agreements'],
    attorneyRole: 'Corporate & Venture Counsel'
  },
  {
    id: 'family',
    name: 'Family & Domestic Relations Law',
    specialty: 'Family Law',
    courtCode: 'FL-11TH',
    courtGuidance: 'Family Division maintains jurisdiction over marital dissolution, equitable asset distribution, time-sharing parental plans, and administrative child support petitions.',
    fallbackLawyer: {
      id: 2,
      name: 'Sofia Rodriguez, J.D.',
      title: 'Family Court Litigator & Mediator',
      specialty: 'Family Law',
      barNumber: 'FL-4920182',
      experienceYears: 14,
      firmName: 'Rodriguez Family Advocacy',
      city: 'Miami',
      state: 'FL',
      hourlyRate: 375,
      rating: 4.9,
      reviewCount: 52,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      casesWon: 290,
      successRate: 95,
      matchReason: 'Compassionate and assertive domestic relations attorney with 14 years resolving complex custody and asset divisions.'
    },
    fallbackCourt: {
      id: 15,
      code: 'FL-11TH',
      name: 'Eleventh Judicial Circuit Court of Florida',
      jurisdiction: 'State Circuit',
      level: 'Trial',
      city: 'Miami',
      state: 'FL',
      address: '73 West Flagler Street, Miami-Dade County Courthouse',
      filingSystem: 'Florida Courts E-Filing Portal',
      website: 'https://www.jud11.flcourts.org',
      overview: 'The largest circuit court in Florida, handling complex family dissolutions, domestic relations, probate, and general civil claims.',
      jurisdictionGuidance: 'Family Division maintains jurisdiction over marital dissolution, equitable asset distribution, time-sharing parental plans, and administrative child support petitions.'
    },
    keywords: ['divorce', 'custody', 'child support', 'alimony', 'spousal support', 'visitation', 'prenup', 'prenuptial', 'separation', 'paternity', 'guardian'],
    rights: [
      'Equitable distribution or community property division of marital assets and liabilities',
      'Determination of child custody evaluated under the paramount standard of "best interests of the child"',
      'Statutory child support formulas based on parental income ratios and overnight timeshares',
      'Right to petition for protective orders in instances of domestic harassment or danger'
    ],
    actions: [
      'Compile complete financial disclosures including tax returns, retirement assets, and bank accounts',
      'Maintain an objective parenting journal detailing timeshare custody schedules and parental contributions',
      'Avoid hostile social media posts or text exchanges that can be introduced as evidence in court',
      'Consult with a certified family law attorney before signing informal custody or separation agreements'
    ],
    documents: ['Marriage certificate', 'Past 3 years of state and federal tax returns', 'Bank, investment, and mortgage records', 'Children’s medical, school, and schedule logs'],
    attorneyRole: 'Family Law & Custody Attorney'
  },
  {
    id: 'employment',
    name: 'Employment & Workplace Rights',
    specialty: 'Employment Law',
    courtCode: 'NDIL',
    courtGuidance: 'Title VII, FLSA, ADEA, and ADA statutory employment claims fall within federal question jurisdiction under 28 U.S.C. § 1331 following EEOC right-to-sue issuance.',
    fallbackLawyer: {
      id: 5,
      name: 'Amara Okafor, J.D.',
      title: 'Workplace Rights Advocate',
      specialty: 'Employment Law',
      barNumber: 'IL-5819034',
      experienceYears: 16,
      firmName: 'Okafor Employment Law Group',
      city: 'Chicago',
      state: 'IL',
      hourlyRate: 410,
      rating: 4.9,
      reviewCount: 58,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      casesWon: 310,
      successRate: 97,
      matchReason: 'Recognized champion for employee rights in wrongful termination, wage & hour violations, and retaliation claims.'
    },
    fallbackCourt: {
      id: 8,
      code: 'NDIL',
      name: 'U.S. District Court - Northern District of Illinois',
      jurisdiction: 'Federal District',
      level: 'Trial',
      city: 'Chicago',
      state: 'IL',
      address: '219 South Dearborn Street, Everett McKinley Dirksen Courthouse',
      filingSystem: 'CM/ECF / PACER',
      website: 'https://www.ilnd.uscourts.gov',
      overview: 'Leading Midwestern federal district with extensive jurisprudence in statutory employee discrimination, FLSA wage claims, and collective bargaining.',
      jurisdictionGuidance: 'Title VII, FLSA, ADEA, and ADA statutory employment claims fall within federal question jurisdiction under 28 U.S.C. § 1331 following EEOC right-to-sue issuance.'
    },
    keywords: ['fired', 'wrongful termination', 'wage', 'overtime', 'harassment', 'discrimination', 'severance', 'non-compete', 'whistleblower', 'retaliation', 'boss', 'employer'],
    rights: [
      'Protection against unlawful discrimination based on race, sex, age, disability, religion, or pregnancy (Title VII / ADA / ADEA)',
      'Right to timely payment of earned wages, statutory overtime, and mandated meal/rest breaks',
      'Whistleblower protection against retaliation for reporting workplace safety or legal violations',
      'Statutory right to review personnel files and receive an itemized wage stub'
    ],
    actions: [
      'Preserve personnel records, performance reviews, offer letters, and termination notices',
      'Document dated incidents of adverse treatment, derogatory remarks, or wage discrepancies',
      'File an internal complaint with HR or ethics hotline in writing to create an evidentiary record',
      'Consult legal counsel before signing any release of claims, severance agreement, or restrictive covenant'
    ],
    documents: ['Employment contract & employee handbook', 'Performance appraisals and emails/Slack logs', 'Pay stubs and timesheet records', 'Formal HR grievances and severance proposals'],
    attorneyRole: 'Labor & Employment Rights Attorney'
  },
  {
    id: 'contracts',
    name: 'Contracts & Dispute Resolution',
    specialty: 'Commercial Litigation',
    courtCode: 'SDNY',
    courtGuidance: 'Commercial disputes exceeding $75,000 between diverse citizens or involving federal statutory trade questions are litigated under 28 U.S.C. § 1332 diversity jurisdiction.',
    fallbackLawyer: {
      id: 6,
      name: 'David Sterling, J.D.',
      title: 'Senior Trial Counsel & Arbitrator',
      specialty: 'Commercial Litigation',
      barNumber: 'NY-4710928',
      experienceYears: 20,
      firmName: 'Sterling Commercial Litigation LLP',
      city: 'New York',
      state: 'NY',
      hourlyRate: 520,
      rating: 4.9,
      reviewCount: 76,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      casesWon: 460,
      successRate: 98,
      matchReason: 'Master contract litigator with 20 years enforcing commercial agreements, indemnity covenants, and arbitration awards.'
    },
    fallbackCourt: {
      id: 6,
      code: 'SDNY',
      name: 'U.S. District Court - Southern District of New York',
      jurisdiction: 'Federal District',
      level: 'Trial',
      city: 'New York',
      state: 'NY',
      address: '500 Pearl Street, Daniel Patrick Moynihan Courthouse',
      filingSystem: 'CM/ECF / PACER',
      website: 'https://www.nysd.uscourts.gov',
      overview: 'The preeminent federal trial court known as the "Mother Court", adjudicating complex multi-million dollar commercial disputes and international arbitration.',
      jurisdictionGuidance: 'Commercial disputes exceeding $75,000 between diverse citizens or involving federal statutory trade questions are litigated under 28 U.S.C. § 1332 diversity jurisdiction.'
    },
    keywords: ['contract', 'agreement', 'breach', 'sue', 'lawsuit', 'damages', 'clause', 'signed', 'vendor', 'refund', 'payment dispute', 'settlement'],
    rights: [
      'Entitlement to expectation damages restoring the non-breaching party to the benefit of the bargain',
      'Right to demand adequate assurance of due performance when reasonable grounds for insecurity arise',
      'Defenses to enforcement including mutual mistake, fraud in the inducement, unconscionability, or force majeure',
      'Enforcement of mandatory arbitration, mediation, or choice-of-venue clauses'
    ],
    actions: [
      'Conduct a clause-by-clause review for notice requirements, default cure periods, and limitation of liability',
      'Issue a formal Notice of Default / Opportunity to Cure citing specific provision breaches',
      'Calculate documented quantifiable financial damages and mitigation efforts',
      'Explore pre-litigation alternative dispute resolution (mediation) to limit litigation expenses'
    ],
    documents: ['Signed contract, amendments, and exhibits', 'Proof of delivery or performance milestones', 'Written breach notifications and cure demands', 'Accounting ledger of financial harm suffered'],
    attorneyRole: 'Civil Litigation & Commercial Contracts Attorney'
  },
  {
    id: 'civilrights',
    name: 'Civil Rights & Constitutional Protections',
    specialty: 'Civil Rights',
    courtCode: 'SDNY',
    courtGuidance: 'Section 1983 civil rights and constitutional violations by state or local entities are litigated in federal district courts pursuant to 28 U.S.C. § 1343.',
    fallbackLawyer: {
      id: 3,
      name: 'Maya Lin, J.D.',
      title: 'Constitutional Rights Litigator',
      specialty: 'Civil Rights',
      barNumber: 'NY-5290184',
      experienceYears: 13,
      firmName: 'Lin Constitutional Law Group',
      city: 'New York',
      state: 'NY',
      hourlyRate: 390,
      rating: 4.9,
      reviewCount: 44,
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      casesWon: 195,
      successRate: 96,
      matchReason: 'Prominent constitutional litigator with extensive record in Section 1983 actions, free speech, and due process.'
    },
    fallbackCourt: {
      id: 6,
      code: 'SDNY',
      name: 'U.S. District Court - Southern District of New York',
      jurisdiction: 'Federal District',
      level: 'Trial',
      city: 'New York',
      state: 'NY',
      address: '500 Pearl Street, Daniel Patrick Moynihan Courthouse',
      filingSystem: 'CM/ECF / PACER',
      website: 'https://www.nysd.uscourts.gov',
      overview: 'Premier federal district with extensive jurisprudence in federal civil rights, First Amendment protections, and Section 1983 liability.',
      jurisdictionGuidance: 'Section 1983 civil rights and constitutional violations by state or local entities are litigated in federal district courts pursuant to 28 U.S.C. § 1343.'
    },
    keywords: ['civil rights', 'discrimination', 'free speech', 'first amendment', 'police brutality', 'excessive force', 'protest', 'equal protection', 'due process', 'voting'],
    rights: [
      'Section 1983 federal statutory claims against state actors violating constitutional liberties',
      'First Amendment protection for political expression, assembly, and religious freedom',
      '14th Amendment Equal Protection against arbitrary discriminatory classifications',
      'Substantive and procedural Due Process before deprivation of liberty or property'
    ],
    actions: [
      'Immediately preserve third-party bodycam, surveillance, or smartphone video recordings',
      'Obtain complete medical treatment records documenting any physical or psychological harm',
      'File mandatory municipal or agency administrative tort claims within strict statutory deadlines (often 6 months)',
      'Retain specialized civil rights counsel experienced with Qualified Immunity defenses'
    ],
    documents: ['Video/photo recordings', 'Incident reports & civilian complaint filings', 'Hospital and medical records', 'Witness contact information and declarations'],
    attorneyRole: 'Civil Rights & Constitutional Law Attorney'
  },
  {
    id: 'injury',
    name: 'Personal Injury & Torts',
    specialty: 'Personal Injury',
    courtCode: 'FL-11TH',
    courtGuidance: 'Negligence, premises liability, vehicular collisions, and medical malpractice actions exceeding circuit thresholds proceed in the General Civil Trial Division.',
    fallbackLawyer: {
      id: 8,
      name: 'Carlos Mendoza, J.D.',
      title: 'Senior Trial Attorney',
      specialty: 'Personal Injury',
      barNumber: 'FL-3910842',
      experienceYears: 15,
      firmName: 'Mendoza Injury & Trial Lawyers',
      city: 'Miami',
      state: 'FL',
      hourlyRate: 340,
      rating: 4.8,
      reviewCount: 65,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      casesWon: 340,
      successRate: 98,
      matchReason: 'Aggressive trial litigator having secured over $25M in combined client recoveries for negligence and severe injuries.'
    },
    fallbackCourt: {
      id: 15,
      code: 'FL-11TH',
      name: 'Eleventh Judicial Circuit Court of Florida',
      jurisdiction: 'State Circuit',
      level: 'Trial',
      city: 'Miami',
      state: 'FL',
      address: '73 West Flagler Street, Miami-Dade County Courthouse',
      filingSystem: 'Florida Courts E-Filing Portal',
      website: 'https://www.jud11.flcourts.org',
      overview: 'State trial court presiding over general civil controversies, personal injury suits, and tort recovery actions.',
      jurisdictionGuidance: 'Negligence, premises liability, vehicular collisions, and medical malpractice actions exceeding circuit thresholds proceed in the General Civil Trial Division.'
    },
    keywords: ['accident', 'car crash', 'slip and fall', 'injury', 'medical malpractice', 'insurance', 'hospital', 'negligence', 'whiplash', 'doctor error'],
    rights: [
      'Right to compensation for medical costs, lost earning capacity, pain, suffering, and property damage',
      'Protection against early predatory insurance settlement offers prior to full medical stabilization',
      'Comparative negligence recovery ensuring proportional compensation even if partially at fault',
      'Statutory tolling rules and strict statute of limitations timelines'
    ],
    actions: [
      'Seek prompt medical examination and follow all clinical treatment protocols consistently',
      'Do not give recorded statements to opposing insurance adjusters without attorney consent',
      'Photograph vehicular damage, road conditions, skid marks, and visible bodily injuries',
      'Keep a comprehensive diary tracking daily pain levels, physical limitations, and missed work'
    ],
    documents: ['Official police accident report', 'Emergency room and doctor visit records', 'Medical bills and pharmaceutical receipts', 'Insurance policy declaration sheets and correspondence'],
    attorneyRole: 'Personal Injury & Trial Attorney'
  }
];

function generateClientLegalAssessment(prompt, userName) {
  const clean = prompt.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'help', 'what can you do'];
  if (greetings.some(g => clean === g || clean.startsWith(g + ' ') || clean.endsWith(' ' + g)) && clean.length < 35) {
    const greetingName = userName ? `, ${userName}` : '';
    return {
      category: 'General Assistant',
      text: `Hello${greetingName}! I am your **LegalAI Intelligent Assistant**.\n\n### How I Can Assist You:\n* **Issue Spotting:** Break down disputes in Employment, Criminal Defense, Landlord-Tenant, Corporate, Family, and Civil Rights.\n* **Rights & Statutes:** Identify critical legal protections and statutory deadlines.\n* **Actionable Checklists:** Specific immediate steps and evidence to preserve.\n* **Lawyer Matching:** Guide you to the right attorney specialty for a formal consultation.\n\n*What legal matter or question would you like to examine today?*`,
      suggestedLawyer: null,
      suggestedCourt: null
    };
  }

  let bestDomain = null;
  let maxScore = 0;
  for (const domain of CLIENT_LEGAL_DOMAINS) {
    let score = 0;
    for (const kw of domain.keywords) {
      if (clean.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }

  const userGreeting = userName ? `Hello ${userName}, based on your inquiry regarding ` : `Based on your inquiry regarding `;
  if (!bestDomain) {
    const defaultLawyer = CLIENT_LEGAL_DOMAINS[2].fallbackLawyer; // Corporate / general
    const defaultCourt = CLIENT_LEGAL_DOMAINS[5].fallbackCourt; // SDNY
    return {
      category: 'General Legal Advisory',
      text: `${userGreeting}this legal situation:\n\n### 🔍 Initial Assessment & Issue Spotting\nYour situation touches upon general civil and administrative legal principles. Because legal outcomes are highly fact-dependent and subject to jurisdiction-specific statutes, establishing the factual timeline is your primary objective.\n\n### ⚖️ Universal Legal Protections\n* **Due Process:** Any formal adverse legal action typically requires formal written notice and an opportunity to respond.\n* **Statute of Limitations:** All claims have strict time limits. Delaying action can permanently forfeit your right to relief.\n* **Duty to Mitigate:** In financial or contract disputes, parties are expected to take reasonable steps to minimize escalating damages.\n\n### 📋 Immediate Actionable Recommendations\n1. **Establish a Chronological Record:** Write down a detailed, dated sequence of all events, communications, and promises made.\n2. **Preserve All Written Evidence:** Back up emails, text messages, receipts, and contracts in a secure offsite location.\n3. **Avoid Speculative Statements:** Do not make written admissions or discuss case merits on social media.\n4. **Consult a Verified Attorney:** Schedule a confidential case evaluation through the LegalAI network.\n\n> ⚠️ *Disclaimer: LegalAI Assistant provides informational analysis and legal information, not formal attorney-client representation. For binding legal advice tailored to your state and jurisdiction, always consult a licensed attorney.*`,
      suggestedLawyer: defaultLawyer,
      suggestedCourt: defaultCourt
    };
  }

  const rightsList = bestDomain.rights.map(r => `* ${r}`).join('\n');
  const actionsList = bestDomain.actions.map((a, i) => `${i + 1}. **${a.split(':')[0] || a.slice(0, 30)}**: ${a}`).join('\n');
  const docsList = bestDomain.documents.map(d => `* ${d}`).join('\n');

  const text = `${userGreeting}**${bestDomain.name}**, here is an executive legal assessment and strategic checklist:\n\n### 🔍 Legal Analysis & Key Issues\nYour situation involves core provisions of **${bestDomain.name}**. In these matters, courts and tribunals scrutinize documentation, compliance with notice rules, and procedural timelines above all else.\n\n### ⚖️ Key Rights & Statutory Principles\n${rightsList}\n\n### 📋 Immediate Action Steps\n${actionsList}\n\n### 📁 Critical Evidence & Documents to Preserve\n${docsList}\n\n### 👨‍⚖️ Recommended Attorney Specialty\nFor formal representation and strategic negotiation in this matter, we recommend consulting with a **LegalAI ${bestDomain.attorneyRole}**.\n\n> ⚠️ *Disclaimer: Information provided by LegalAI Assistant is for educational and guidance purposes only and does not create an attorney-client relationship. Laws vary by state and municipality. Consult a licensed attorney before taking legal action.*`;

  return {
    category: bestDomain.name,
    text,
    suggestedLawyer: bestDomain.fallbackLawyer,
    suggestedCourt: bestDomain.fallbackCourt
  };
}

const aiFabBtn        = document.getElementById('ai-fab-btn');
const aiDrawer        = document.getElementById('ai-drawer');
const aiCloseBtn      = document.getElementById('ai-close-btn');
const aiClearBtn      = document.getElementById('ai-clear-btn');
const aiMessages      = document.getElementById('ai-messages');
const aiMessagesWrap  = document.getElementById('ai-messages-wrapper');
const aiTyping        = document.getElementById('ai-typing');
const aiInputForm     = document.getElementById('ai-input-form');
const aiUserInput     = document.getElementById('ai-user-input');
const aiTopicsList    = document.getElementById('ai-topics-list');
const navAiLink       = document.getElementById('nav-ai');
const ctaConsultBtn   = document.getElementById('cta-consult');

// Markdown to HTML simple parser for structured legal answers
function renderLegalMarkdown(text) {
  if (!text) return '';
  
  let formatted = text
    // Headings (###)
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Headings (##)
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    // Blockquote disclaimer
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Unordered List Items
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    // Numbered List Items
    .replace(/^(\d+)\. (.*$)/gim, '<li><strong>$1.</strong> $2</li>');

  // Wrap loose <li> in <ul>
  formatted = formatted.replace(/(<li>.*<\/li>)/gims, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Convert double newlines to paragraph breaks
  formatted = formatted.split('\n\n').map(p => {
    if (p.startsWith('<h3>') || p.startsWith('<ul>') || p.startsWith('<blockquote>')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('');

  return formatted;
}

// Scroll messages container to bottom
function scrollAIToBottom() {
  if (!aiMessagesWrap) return;
  aiMessagesWrap.scrollTo({
    top: aiMessagesWrap.scrollHeight,
    behavior: 'smooth'
  });
}

// Open / Close Drawer
function openAIDrawer() {
  if (!aiDrawer) return;
  aiDrawer.classList.remove('hidden');
  aiFabBtn?.classList.add('hidden');
  aiUserInput?.focus();
  scrollAIToBottom();
}

function closeAIDrawer() {
  if (!aiDrawer) return;
  aiDrawer.classList.add('hidden');
  aiFabBtn?.classList.remove('hidden');
}

// Global cache for AI matched lawyer & court recommendations
window.aiSuggestionsCache = {
  lawyers: {},
  courts: {}
};

// Render Rich Matched Specialist Lawyer Card HTML
function renderSuggestedLawyerCardHTML(lawyer) {
  if (!lawyer) return '';
  window.aiSuggestionsCache.lawyers[lawyer.id] = lawyer;

  const initials = getInitials(lawyer.name);
  const ratingVal = lawyer.rating ? Number(lawyer.rating).toFixed(1) : '4.9';
  const reviewsText = lawyer.reviewCount ? `(${lawyer.reviewCount} reviews)` : '(45+ reviews)';
  const rateText = lawyer.hourlyRate ? `$${lawyer.hourlyRate}/hr` : 'Competitive Hourly';
  const matchReason = lawyer.matchReason || `Top-rated specialist in ${lawyer.specialty || 'this domain'} with a high success rate.`;

  return `
    <div class="ai-recommend-card ai-lawyer-card" id="ai-matched-lawyer-${lawyer.id}">
      <div class="ai-card-header">
        <div class="ai-card-tag"><span class="ai-tag-dot"></span> BEST MATCHED SPECIALIST ATTORNEY</div>
        <div class="ai-card-match-badge">98% Match</div>
      </div>
      <div class="ai-card-body">
        ${lawyer.avatarUrl ? `
          <img src="${lawyer.avatarUrl}" class="ai-card-avatar" alt="${escapeHtml(lawyer.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
          <div class="ai-card-avatar-fallback" style="display:none;">${initials}</div>
        ` : `
          <div class="ai-card-avatar-fallback">${initials}</div>
        `}
        <div class="ai-card-details">
          <h4 class="ai-card-name">${escapeHtml(lawyer.name)} <span class="ai-card-verified-badge" title="State Bar Verified Advocate">✓ Verified</span></h4>
          <div class="ai-card-specialty">${escapeHtml(lawyer.specialty || 'General Counsel')} · ${lawyer.experienceYears || 10}+ Yrs Experience</div>
          <div class="ai-card-meta-row">
            <span class="ai-card-rating">★ ${ratingVal} <span class="ai-card-reviews">${reviewsText}</span></span>
            <span class="ai-card-rate">${rateText}</span>
          </div>
        </div>
      </div>
      <div class="ai-card-reason">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>${escapeHtml(matchReason)}</span>
      </div>
      <div class="ai-card-actions">
        <button type="button" class="ai-btn-primary" onclick="handleAILawyerConsult(${lawyer.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Book Consultation
        </button>
        <button type="button" class="ai-btn-secondary" onclick="scrollToLawyerProfile('${escapeHtml(lawyer.name)}', ${lawyer.id})">
          View Profile
        </button>
      </div>
    </div>
  `;
}

// Render Rich Matched Court & Jurisdiction Card HTML
function renderSuggestedCourtCardHTML(court) {
  if (!court) return '';
  window.aiSuggestionsCache.courts[court.id] = court;

  const levelText = court.level ? `${court.level} Level` : 'Competent Court';
  const locText = court.city && court.state ? `${court.city}, ${court.state}` : (court.circuit || court.jurisdiction || '');
  const filing = court.filingSystem ? `Filing: ${court.filingSystem}` : 'Electronic Filing Portal';
  const guidance = court.jurisdictionGuidance || court.overview || 'Competent judicial venue with primary subject-matter jurisdiction over these matters.';

  return `
    <div class="ai-recommend-card ai-court-card" id="ai-matched-court-${court.id}">
      <div class="ai-card-header">
        <div class="ai-card-tag court-tag"><span class="ai-tag-dot court-dot"></span> RECOMMENDED COURT & JURISDICTION</div>
        <div class="ai-court-level-badge">${escapeHtml(levelText)}</div>
      </div>
      <div class="ai-card-court-body">
        <div class="ai-court-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2 2 7h20L12 2z"/>
          </svg>
        </div>
        <div class="ai-court-details">
          <h4 class="ai-court-name">${escapeHtml(court.name)}</h4>
          <div class="ai-court-jurisdiction">${escapeHtml(court.circuit || court.state || 'General')} · ${escapeHtml(court.jurisdiction || 'Judicial District')}</div>
          <div class="ai-court-filing">
            <span class="ai-filing-pill">${escapeHtml(filing)}</span>
            ${locText ? `<span class="ai-loc-text">📍 ${escapeHtml(locText)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="ai-court-guidance">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>${escapeHtml(guidance)}</span>
      </div>
      <div class="ai-card-actions">
        <button type="button" class="ai-btn-primary court-btn" onclick="handleAICourtDetails(${court.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          View Court Details
        </button>
        ${court.website ? `
          <a class="ai-btn-secondary" href="${court.website}" target="_blank" rel="noopener noreferrer">
            Official Portal ↗
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Global action handlers for AI cards
window.handleAILawyerConsult = function(lawyerId) {
  const lawyerObj = window.aiSuggestionsCache.lawyers[lawyerId];
  if (lawyerObj && !lawyersData.find(l => l.id === lawyerId)) {
    lawyersData.push(lawyerObj);
  }
  if (typeof window.openConsultModal === 'function') {
    window.openConsultModal(lawyerId, lawyerObj);
  }
};

window.handleAICourtDetails = function(courtId) {
  const courtObj = window.aiSuggestionsCache.courts[courtId];
  if (courtObj && !courtsData.find(c => c.id === courtId)) {
    courtsData.push(courtObj);
  }
  if (typeof window.openCourtModal === 'function') {
    window.openCourtModal(courtId, courtObj);
  }
};

window.scrollToLawyerProfile = function(lawyerName, lawyerId) {
  const section = document.getElementById('lawyers');
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Check if card is currently rendered
  let card = document.getElementById(`lawyer-card-${lawyerId}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('card-highlight-pulse');
    setTimeout(() => card.classList.remove('card-highlight-pulse'), 3500);
    return;
  }

  // Filter directory to show this lawyer
  if (lawyerSearchInput) {
    lawyerSearchInput.value = lawyerName;
    lawyerFilters.search = lawyerName;
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = 'All Specialties';
    lawyerFilters.specialty = 'All Specialties';
    fetchAndRenderLawyers().then(() => {
      setTimeout(() => {
        const loadedCard = document.getElementById(`lawyer-card-${lawyerId}`);
        if (loadedCard) {
          loadedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          loadedCard.classList.add('card-highlight-pulse');
          setTimeout(() => loadedCard.classList.remove('card-highlight-pulse'), 3500);
        }
      }, 350);
    });
  }
};

// Append Chat Message with Rich Cards
function appendAIMessage(role, content, category = null, suggestedLawyer = null, suggestedCourt = null) {
  if (!aiMessages) return;

  const msgRow = document.createElement('div');
  msgRow.className = `ai-msg ${role}`;

  const isUser = role === 'user';
  const cachedUser = localStorage.getItem('legalai_user');
  let userInitial = 'U';
  let userName = 'You';

  if (cachedUser) {
    try {
      const u = JSON.parse(cachedUser);
      userInitial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
      userName = u.name || 'You';
    } catch (e) {}
  }

  const avatarContent = isUser
    ? `<span>${userInitial}</span>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>`;

  const authorName = isUser ? userName : (category ? `LegalAI • ${category}` : 'LegalAI Intelligence');
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Generate recommendations HTML if provided for assistant responses
  let recommendationsHTML = '';
  if (!isUser && (suggestedLawyer || suggestedCourt)) {
    recommendationsHTML = `
      <div class="ai-recommendations-wrapper">
        ${renderSuggestedLawyerCardHTML(suggestedLawyer)}
        ${renderSuggestedCourtCardHTML(suggestedCourt)}
      </div>
    `;
  }

  msgRow.innerHTML = `
    <div class="ai-msg-avatar">${avatarContent}</div>
    <div class="ai-msg-bubble">
      <div class="ai-msg-meta">
        <span class="ai-msg-author">${authorName}</span>
        <span class="ai-msg-time">${timeString}</span>
      </div>
      <div class="ai-msg-text">${isUser ? escapeHtml(content) : renderLegalMarkdown(content)}</div>
      ${recommendationsHTML}
    </div>
  `;

  aiMessages.appendChild(msgRow);
  scrollAIToBottom();
}

// HTML escape helper for user input
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Send Query to AI Backend
async function sendAIQuery(promptText) {
  if (!promptText || !promptText.trim()) return;
  const cleanPrompt = promptText.trim();

  // Append user message immediately
  appendAIMessage('user', cleanPrompt);
  if (aiUserInput) {
    aiUserInput.value = '';
    aiUserInput.style.height = 'auto';
  }

  // Show typing indicator
  aiTyping?.classList.remove('hidden');
  scrollAIToBottom();

  const token = localStorage.getItem('legalai_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${AI_API_BASE}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: cleanPrompt })
    });

    const data = await res.json();

    if (data.success) {
      appendAIMessage('bot', data.response, data.category, data.suggestedLawyer, data.suggestedCourt);
      checkBackendHealth();
    } else {
      appendAIMessage('bot', `⚠️ I encountered an issue analyzing your query: ${data.message || 'Please try again.'}`);
    }
  } catch (err) {
    // Server is unreachable: trigger health check update and provide immediate offline fallback
    checkBackendHealth();
    
    let currentUserName = null;
    const cachedUser = localStorage.getItem('legalai_user');
    if (cachedUser) {
      try {
        currentUserName = JSON.parse(cachedUser).name;
      } catch (e) {}
    }

    const fallback = generateClientLegalAssessment(cleanPrompt, currentUserName);
    const offlineAlert = `\n\n> 💡 **Notice:** The backend server on port 5000 is currently offline. You received this response from the built-in offline engine. To save chats to your SQLite profile and book consultations, launch **run.bat** in your project folder.`;
    appendAIMessage('bot', fallback.text + offlineAlert, fallback.category, fallback.suggestedLawyer, fallback.suggestedCourt);
  } finally {
    aiTyping?.classList.add('hidden');
    scrollAIToBottom();
  }
}

// Restore previous user chat history if logged in
async function loadAIHistory() {
  const token = localStorage.getItem('legalai_token');
  if (!token) return;

  try {
    const res = await fetch(`${AI_API_BASE}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.success && Array.isArray(data.history) && data.history.length > 0) {
      // Clear initial dummy greeting if we have saved history
      if (aiMessages) {
        aiMessages.innerHTML = '';
      }
      data.history.forEach(item => {
        appendAIMessage(item.role === 'user' ? 'user' : 'bot', item.message, item.category);
      });
    }
  } catch (err) {
    console.log('Chat history could not be loaded.');
  }
}

// Clear conversation
async function clearAIConversation() {
  const token = localStorage.getItem('legalai_token');
  if (token) {
    try {
      await fetch(`${AI_API_BASE}/history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }

  if (aiMessages) {
    aiMessages.innerHTML = `
      <div class="ai-msg bot">
        <div class="ai-msg-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
        </div>
        <div class="ai-msg-bubble">
          <div class="ai-msg-meta">
            <span class="ai-msg-author">LegalAI Intelligence</span>
            <span class="ai-msg-time">Online</span>
          </div>
          <div class="ai-msg-text">
            Conversation cleared. I am ready to evaluate your new legal dispute, contractual inquiry, or statutory question.
          </div>
        </div>
      </div>
    `;
  }
  showToast('Chat history cleared', 'info');
}

// Event Listeners
aiFabBtn?.addEventListener('click', openAIDrawer);
aiCloseBtn?.addEventListener('click', closeAIDrawer);
aiClearBtn?.addEventListener('click', clearAIConversation);

// Navbar "AI Assistant" Link
navAiLink?.addEventListener('click', (e) => {
  e.preventDefault();
  openAIDrawer();
});

// Hero "Free Consultation" CTA
ctaConsultBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openAIDrawer();
});

// Topic Chips Click Handlers
aiTopicsList?.addEventListener('click', (e) => {
  const chip = e.target.closest('.ai-topic-chip');
  if (!chip) return;
  const query = chip.dataset.query;
  if (query) {
    sendAIQuery(query);
  }
});

// Form Submit
aiInputForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = aiUserInput?.value;
  if (text && text.trim()) {
    sendAIQuery(text);
  }
});

// Auto-expand textarea and submit on Enter (Shift+Enter for newline)
aiUserInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    aiInputForm?.dispatchEvent(new Event('submit', { cancelable: true }));
  }
});

aiUserInput?.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

// Hero Legal Question Input and Quick Suggestions
const heroAiForm        = document.getElementById('hero-ai-form');
const heroAiInput       = document.getElementById('hero-ai-input');
const heroAiSearchWrap  = document.getElementById('hero-ai-search');

heroAiForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = heroAiInput?.value.trim();
  if (!query) return;
  openAIDrawer();
  sendAIQuery(query);
  heroAiInput.value = '';
});

heroAiSearchWrap?.addEventListener('click', (e) => {
  const chip = e.target.closest('.hero-ai-chip');
  if (!chip) return;
  const prompt = chip.dataset.prompt;
  if (!prompt) return;
  openAIDrawer();
  sendAIQuery(prompt);
});

// Load history on initialization
loadAIHistory();


// ================================================================
// LAWYER DIRECTORY MODULE
// ================================================================

const LAWYERS_API = `${SERVER_ORIGIN}/api/lawyers`;

// ── State ──
let lawyersData = [];
let lawyerFilters = {
  search: '',
  specialty: 'All Specialties',
  maxFee: '',
  minRating: '',
  availability: ''
};

// ── DOM references ──
const lawyersGrid           = document.getElementById('lawyers-grid');
const lawyerSearchInput     = document.getElementById('lawyer-search-input');
const lawyerSearchClear     = document.getElementById('lawyer-search-clear');
const lawyerSpecialtySelect  = document.getElementById('lawyer-specialty-select');
const lawyerAvailSelect     = document.getElementById('lawyer-avail-select');
const lawyerRateSelect      = document.getElementById('lawyer-rate-select');
const lawyerRatingSelect    = document.getElementById('lawyer-rating-select');
const lawyerCountBadge      = document.getElementById('lawyer-count-badge');
const specialtyPills        = document.querySelectorAll('.pill-chip');

// Consultation Modal
const consultOverlay       = document.getElementById('consult-modal-overlay');
const consultModalClose    = document.getElementById('consult-modal-close');
const consultModalTitle    = document.getElementById('consult-modal-title');
const consultAttySubtitle  = document.getElementById('consult-attorney-subtitle');
const consultLawyerId      = document.getElementById('consult-lawyer-id');
const consultForm          = document.getElementById('consult-form');
const consultSubmit        = document.getElementById('consult-submit');

// ── Helpers ──
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function lawyerCardHTML(l) {
  const avatarEl = l.avatarUrl
    ? `<img class="lawyer-avatar" src="${l.avatarUrl}" alt="${l.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback" style="display:none">${getInitials(l.name)}</div>`
    : `<div class="lawyer-avatar-fallback">${getInitials(l.name)}</div>`;

  const isAvail = l.isAvailable !== 0;
  const availBadge = isAvail
    ? `<span class="badge-availability available" title="Available for consultation"><span class="status-pulse-dot"></span> Available for Consult</span>`
    : `<span class="badge-availability booked" title="Currently retained on active trial dockets"><span class="status-busy-dot"></span> Booked / In Trial</span>`;

  const consultBtn = isAvail
    ? `<button class="btn-consult" data-lawyer-id="${l.id}" onclick="openConsultModal(${l.id})">
        📅 Book Consultation
      </button>`
    : `<button class="btn-consult btn-waitlist" data-lawyer-id="${l.id}" onclick="openConsultModal(${l.id})">
        ⏳ Join Waitlist / Inquire
      </button>`;

  return `
  <div class="lawyer-card ${isAvail ? 'card-available' : 'card-booked'}" id="lawyer-card-${l.id}" data-id="${l.id}">
    <div class="lawyer-card-header">
      ${avatarEl}
      <div class="lawyer-header-info">
        <div class="lawyer-name">${l.name}</div>
        <div class="lawyer-title">${l.title}</div>
        <div class="lawyer-badges">
          <span class="badge-verified">✓ Bar Verified</span>
          <span class="badge-specialty">${l.specialty}</span>
          ${availBadge}
        </div>
      </div>
    </div>

    <div class="lawyer-rating-row">
      <span class="stars">${renderStars(l.rating)}</span>
      <span class="lawyer-rating-val">${Number(l.rating).toFixed(1)}</span>
      <span class="lawyer-review-count">(${l.reviewCount} reviews)</span>
    </div>

    <div class="lawyer-stats-row">
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.experienceYears}+</span>
        <span class="lawyer-stat-lbl">Yrs Exp</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.casesWon}</span>
        <span class="lawyer-stat-lbl">Cases Won</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.successRate}%</span>
        <span class="lawyer-stat-lbl">Success Rate</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">$${l.hourlyRate}</span>
        <span class="lawyer-stat-lbl">Per Hour</span>
      </div>
    </div>

    <div class="lawyer-details-list">
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${l.firmName} — ${l.city}, ${l.state}</span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>${l.phone}</span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span>${l.email}</span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>${l.education} · ${l.languages}</span>
      </div>
    </div>

    <p class="lawyer-bio">${l.bio}</p>

    <div class="lawyer-card-footer">
      ${consultBtn}
      <button class="btn-profile" title="Bar Number: ${l.barNumber}">
        ${l.barNumber}
      </button>
    </div>
  </div>`;
}

function renderSkeletons(count = 4) {
  if (!lawyersGrid) return;
  lawyersGrid.innerHTML = Array.from({ length: count }, () => `
    <div class="lawyer-skeleton">
      <div style="display:flex;gap:14px;align-items:center">
        <div class="skeleton-line" style="width:72px;height:72px;border-radius:50%;flex-shrink:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px">
          <div class="skeleton-line" style="height:16px;width:70%"></div>
          <div class="skeleton-line" style="height:12px;width:45%"></div>
          <div class="skeleton-line" style="height:12px;width:55%"></div>
        </div>
      </div>
      <div class="skeleton-line" style="height:12px;width:50%"></div>
      <div style="display:flex;gap:12px">
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
        <div class="skeleton-line" style="height:42px;flex:1"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div class="skeleton-line" style="height:11px;width:90%"></div>
        <div class="skeleton-line" style="height:11px;width:75%"></div>
        <div class="skeleton-line" style="height:11px;width:80%"></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <div class="skeleton-line" style="height:40px;flex:1"></div>
        <div class="skeleton-line" style="height:40px;width:110px"></div>
      </div>
    </div>
  `).join('');
}

function renderLawyers(lawyers) {
  if (!lawyersGrid) return;

  if (!lawyers || lawyers.length === 0) {
    lawyersGrid.innerHTML = `
      <div class="lawyers-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <h4>No Attorneys Found</h4>
        <p>Try adjusting your search filters or removing criteria to see more results.</p>
      </div>`;
    if (lawyerCountBadge) lawyerCountBadge.textContent = 'No results found';
    return;
  }

  lawyersGrid.innerHTML = lawyers.map(lawyerCardHTML).join('');
  if (lawyerCountBadge) {
    const availCount = lawyers.filter(l => l.isAvailable !== 0).length;
    lawyerCountBadge.textContent = `Showing ${lawyers.length} Verified Attorney${lawyers.length !== 1 ? 's' : ''} (${availCount} Available)`;
  }
}

async function fetchAndRenderLawyers() {
  renderSkeletons();
  try {
    const params = new URLSearchParams();
    if (lawyerFilters.search)        params.set('search',       lawyerFilters.search);
    if (lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties')
                                      params.set('specialty',    lawyerFilters.specialty);
    if (lawyerFilters.maxFee)        params.set('maxFee',       lawyerFilters.maxFee);
    if (lawyerFilters.minRating)     params.set('minRating',    lawyerFilters.minRating);
    if (lawyerFilters.availability)  params.set('availability', lawyerFilters.availability);

    const resp = await fetch(`${LAWYERS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('Server error ' + resp.status);
    const data = await resp.json();
    lawyersData = data.lawyers || [];
    renderLawyers(lawyersData);

    // Update available badge counter
    const badgeAvail = document.getElementById('badge-avail-count');
    if (badgeAvail) {
      const totalAvail = lawyersData.filter(l => l.isAvailable !== 0).length;
      badgeAvail.textContent = totalAvail;
    }
  } catch (err) {
    console.error('Lawyer fetch error:', err);
    if (lawyersGrid) {
      lawyersGrid.innerHTML = `
        <div class="lawyers-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h4>Connection Error</h4>
          <p>Could not load attorneys. Make sure the backend server is running.</p>
        </div>`;
    }
  }
}

// ── Debounce utility ──
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Search input ──
if (lawyerSearchInput) {
  lawyerSearchInput.addEventListener('input', debounce(() => {
    lawyerFilters.search = lawyerSearchInput.value.trim();
    if (lawyerSearchClear) {
      lawyerSearchClear.classList.toggle('hidden', !lawyerFilters.search);
    }
    fetchAndRenderLawyers();
  }, 350));
}

if (lawyerSearchClear) {
  lawyerSearchClear.addEventListener('click', () => {
    lawyerFilters.search = '';
    if (lawyerSearchInput) lawyerSearchInput.value = '';
    lawyerSearchClear.classList.add('hidden');
    fetchAndRenderLawyers();
  });
}

// ── Filter selects ──
if (lawyerSpecialtySelect) {
  lawyerSpecialtySelect.addEventListener('change', () => {
    lawyerFilters.specialty = lawyerSpecialtySelect.value;
    syncPillsToSpecialty(lawyerFilters.specialty);
    fetchAndRenderLawyers();
  });
}

if (lawyerRateSelect) {
  lawyerRateSelect.addEventListener('change', () => {
    lawyerFilters.maxFee = lawyerRateSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerRatingSelect) {
  lawyerRatingSelect.addEventListener('change', () => {
    lawyerFilters.minRating = lawyerRatingSelect.value;
    fetchAndRenderLawyers();
  });
}

// ── Lawyer Availability Filter ──
if (lawyerAvailSelect) {
  lawyerAvailSelect.addEventListener('change', () => {
    lawyerFilters.availability = lawyerAvailSelect.value;
    const tabAvail = document.getElementById('tab-available-lawyers');
    if (tabAvail) {
      tabAvail.classList.toggle('active', lawyerFilters.availability === 'available' || !lawyerFilters.availability);
    }
    fetchAndRenderLawyers();
  });
}

// ── Tab Available Lawyers toggle ──
const tabAvailableLawyers = document.getElementById('tab-available-lawyers');
if (tabAvailableLawyers) {
  tabAvailableLawyers.addEventListener('click', () => {
    tabAvailableLawyers.classList.add('active');
    if (lawyerAvailSelect) lawyerAvailSelect.value = 'available';
    lawyerFilters.availability = 'available';
    fetchAndRenderLawyers();
  });
}

// ── Specialty pill chips ──
function syncPillsToSpecialty(specialty) {
  specialtyPills.forEach(p => {
    p.classList.toggle('active', p.dataset.specialty === specialty);
  });
}

specialtyPills.forEach(pill => {
  pill.addEventListener('click', () => {
    lawyerFilters.specialty = pill.dataset.specialty;
    syncPillsToSpecialty(lawyerFilters.specialty);
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = lawyerFilters.specialty;
    fetchAndRenderLawyers();
  });
});

// ── Consultation Modal ──
window.openConsultModal = function(lawyerId, fallbackLawyer = null) {
  let lawyer = lawyersData.find(l => l.id === lawyerId) || fallbackLawyer;
  if (!lawyer && window.aiSuggestionsCache?.lawyers[lawyerId]) {
    lawyer = window.aiSuggestionsCache.lawyers[lawyerId];
  }
  if (!lawyer || !consultOverlay) return;

  consultLawyerId.value = lawyer.id;
  consultModalTitle.textContent = `Book — ${lawyer.name}`;
  consultAttySubtitle.textContent = `${lawyer.title || 'Attorney'} · ${lawyer.specialty} · $${lawyer.hourlyRate}/hr`;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('consult-date');
  if (dateInput) dateInput.min = today;

  consultOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function closeConsultModal() {
  if (consultOverlay) consultOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  if (consultForm) consultForm.reset();
}

if (consultModalClose) consultModalClose.addEventListener('click', closeConsultModal);

if (consultOverlay) {
  consultOverlay.addEventListener('click', (e) => {
    if (e.target === consultOverlay) closeConsultModal();
  });
}

// ── Consult Form Submission ──
if (consultForm) {
  consultForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lawyerId = consultLawyerId.value;
    const clientName    = document.getElementById('consult-name').value.trim();
    const clientEmail   = document.getElementById('consult-email').value.trim();
    const clientPhone   = document.getElementById('consult-phone').value.trim();
    const preferredDate = document.getElementById('consult-date').value;
    const caseSummary   = document.getElementById('consult-summary').value.trim();

    if (!lawyerId || !clientName || !clientEmail || !clientPhone || !preferredDate || !caseSummary) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const btnText    = consultSubmit.querySelector('.btn-text');
    const btnSpinner = consultSubmit.querySelector('.btn-spinner');
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    consultSubmit.disabled = true;

    try {
      const resp = await fetch(`${LAWYERS_API}/${lawyerId}/consult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientEmail, clientPhone, preferredDate, caseSummary })
      });
      const data = await resp.json();

      if (data.success) {
        closeConsultModal();
        showToast(`✅ Consultation booked with ${data.lawyer.name}! You'll be contacted within 24 hours.`, 'success');
        fetchAndRenderBookings();
      } else {
        showToast(data.message || 'Could not submit booking. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Network error. Make sure the server is running.', 'error');
    } finally {
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      consultSubmit.disabled = false;
    }
  });
}

// ── Navbar "Lawyers" link scrolls to section ──
const navLawyersLink = document.getElementById('nav-lawyers');
if (navLawyersLink) {
  navLawyersLink.addEventListener('click', (e) => {
    e.preventDefault();
    const lawyersSection = document.getElementById('lawyers');
    if (lawyersSection) {
      lawyersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ================================================================
// BOOKED CONSULTATIONS MANAGEMENT MODULE
// ================================================================

let bookingsData = [];

// DOM References for Bookings Modal
const bookingsModalOverlay  = document.getElementById('bookings-modal-overlay');
const bookingsModalClose    = document.getElementById('bookings-modal-close');
const bookingsListContainer = document.getElementById('bookings-list-container');
const bookingsRefreshBtn    = document.getElementById('bookings-refresh-btn');
const bookingsSearchInput   = document.getElementById('bookings-search-input');
const bookingsTotalCount    = document.getElementById('bookings-total-count');
const bookingsPluralS       = document.getElementById('bookings-plural-s');
const navBookingsCount      = document.getElementById('nav-bookings-count');
const badgeBookedCount      = document.getElementById('badge-booked-count');

window.openBookingsModal = function() {
  if (bookingsModalOverlay) {
    bookingsModalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    fetchAndRenderBookings();
  }
};

window.closeBookingsModal = function() {
  if (bookingsModalOverlay) {
    bookingsModalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.scrollToLawyers = function() {
  const section = document.getElementById('lawyers');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

if (bookingsModalClose) {
  bookingsModalClose.addEventListener('click', closeBookingsModal);
}

if (bookingsModalOverlay) {
  bookingsModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookingsModalOverlay) closeBookingsModal();
  });
}

if (bookingsRefreshBtn) {
  bookingsRefreshBtn.addEventListener('click', () => {
    fetchAndRenderBookings();
    showToast('Bookings refreshed', 'info');
  });
}

if (bookingsSearchInput) {
  bookingsSearchInput.addEventListener('input', debounce(() => {
    const q = bookingsSearchInput.value.trim().toLowerCase();
    if (!q) {
      renderBookingsList(bookingsData);
      return;
    }
    const filtered = bookingsData.filter(b => 
      (b.lawyerName && b.lawyerName.toLowerCase().includes(q)) ||
      (b.lawyerSpecialty && b.lawyerSpecialty.toLowerCase().includes(q)) ||
      (b.clientName && b.clientName.toLowerCase().includes(q)) ||
      (b.clientEmail && b.clientEmail.toLowerCase().includes(q)) ||
      (b.caseSummary && b.caseSummary.toLowerCase().includes(q))
    );
    renderBookingsList(filtered);
  }, 250));
}

function updateBookingsCounters(count) {
  if (navBookingsCount) navBookingsCount.textContent = count;
  if (badgeBookedCount) badgeBookedCount.textContent = count;
  if (bookingsTotalCount) bookingsTotalCount.textContent = count;
  if (bookingsPluralS) bookingsPluralS.textContent = count === 1 ? '' : 's';
}

async function fetchAndRenderBookings() {
  if (bookingsListContainer) {
    bookingsListContainer.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--muted-text);">
        <div class="skeleton-line" style="height: 100px; width: 100%; border-radius: 12px; margin-bottom: 12px;"></div>
        <div class="skeleton-line" style="height: 100px; width: 100%; border-radius: 12px;"></div>
      </div>
    `;
  }

  try {
    const resp = await fetch(`${LAWYERS_API}/consultations`);
    if (!resp.ok) throw new Error('Failed to load consultations');
    const data = await resp.json();
    bookingsData = data.consultations || [];
    
    // Active / non-cancelled count for badges
    const activeBookings = bookingsData.filter(b => b.status !== 'cancelled');
    updateBookingsCounters(activeBookings.length);
    renderBookingsList(bookingsData);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    if (bookingsListContainer) {
      bookingsListContainer.innerHTML = `
        <div class="lawyers-empty-state" style="padding: 30px;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h4 style="margin: 8px 0;">Could not load booked consultations</h4>
          <p style="font-size: 0.85rem; color: var(--muted-text);">Please verify the server is running on port 5000.</p>
        </div>
      `;
    }
  }
}

function renderBookingsList(bookings) {
  if (!bookingsListContainer) return;

  if (!bookings || bookings.length === 0) {
    bookingsListContainer.innerHTML = `
      <div class="bookings-empty-state">
        <div class="empty-icon-wrap">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <h4>No Consultations Booked Yet</h4>
        <p>Browse our directory of verified specialist attorneys and schedule your one-on-one consultation today.</p>
        <button class="bookings-explore-btn" style="margin: 16px auto 0 auto;" onclick="closeBookingsModal(); scrollToLawyers();">
          Explore Available Attorneys
        </button>
      </div>
    `;
    return;
  }

  bookingsListContainer.innerHTML = bookings.map(b => {
    const isCancelled = b.status === 'cancelled';
    const statusBadge = isCancelled
      ? `<span class="booking-status-pill status-cancelled"><span class="status-busy-dot"></span> Cancelled</span>`
      : `<span class="booking-status-pill status-active"><span class="status-pulse-dot"></span> Confirmed Consultation</span>`;

    const avatarEl = b.lawyerAvatar
      ? `<img class="booking-card-avatar" src="${b.lawyerAvatar}" alt="${b.lawyerName}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback small" style="display:none">${getInitials(b.lawyerName || 'A')}</div>`
      : `<div class="lawyer-avatar-fallback small">${getInitials(b.lawyerName || 'A')}</div>`;

    return `
      <div class="booked-consult-card ${isCancelled ? 'booking-cancelled' : ''}" id="booking-item-${b.id}">
        <div class="booking-card-top">
          <div class="booking-atty-profile">
            ${avatarEl}
            <div>
              <div class="booking-atty-name">${b.lawyerName || 'Attorney'}</div>
              <div class="booking-atty-meta">
                <span>${b.lawyerTitle || 'Counsel'}</span> · 
                <span class="badge-specialty small">${b.lawyerSpecialty || 'General Practice'}</span>
                ${b.lawyerRate ? ` · <strong style="color:var(--gold);">$${b.lawyerRate}/hr</strong>` : ''}
              </div>
            </div>
          </div>
          <div class="booking-meta-right">
            ${statusBadge}
            <div class="booking-ref-id">REF #LGL-${String(b.id).padStart(4, '0')}</div>
          </div>
        </div>

        <div class="booking-card-body">
          <div class="booking-info-grid">
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div>
                <span class="info-label">Session Date</span>
                <span class="info-val highlight-date">📅 ${b.preferredDate || 'To be determined'}</span>
              </div>
            </div>

            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div>
                <span class="info-label">Client Name</span>
                <span class="info-val">${b.clientName || 'Client'}</span>
              </div>
            </div>

            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <span class="info-label">Contact Phone</span>
                <span class="info-val">${b.clientPhone || b.lawyerPhone || 'Not provided'}</span>
              </div>
            </div>

            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <div>
                <span class="info-label">Email Confirmation</span>
                <span class="info-val">${b.clientEmail || b.lawyerEmail || 'Not provided'}</span>
              </div>
            </div>
          </div>

          ${b.caseSummary ? `
            <div class="booking-summary-box">
              <div class="summary-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                Legal Case Note / Objective:
              </div>
              <p class="summary-text">${b.caseSummary}</p>
            </div>
          ` : ''}
        </div>

        <div class="booking-card-actions">
          ${b.lawyerPhone ? `
            <a href="tel:${b.lawyerPhone}" class="booking-action-btn btn-call" title="Call office: ${b.lawyerPhone}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call Office
            </a>
          ` : ''}

          ${b.lawyerEmail ? `
            <a href="mailto:${b.lawyerEmail}?subject=LegalAI%20Consultation%20Inquiry%20Ref%23${b.id}&body=Dear%20${encodeURIComponent(b.lawyerName)},%0A%0AReferencing%20consultation%20Ref%23${b.id}%20scheduled%20for%20${b.preferredDate}." class="booking-action-btn btn-email" title="Email attorney directly">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email Attorney
            </a>
          ` : ''}

          <button class="booking-action-btn btn-cal" onclick="downloadBookingICS(${b.id})" title="Add event to Outlook, Apple Calendar, or Google Calendar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
            Add to Calendar (.ics)
          </button>

          ${!isCancelled ? `
            <button class="booking-action-btn btn-cancel" onclick="cancelConsultationBooking(${b.id})" title="Cancel this scheduled session">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              Cancel Booking
            </button>
          ` : `
            <span class="booking-cancelled-label">Consultation Cancelled</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

window.downloadBookingICS = function(id) {
  const b = bookingsData.find(item => item.id === id);
  if (!b) return;
  const dateParts = (b.preferredDate || '').split('-');
  const dateFormatted = dateParts.length === 3 ? dateParts.join('') : '20260401';
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LegalAI//Legal Consultation Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:legalai-consult-${b.id}@legalai.internal`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${dateFormatted}`,
    `SUMMARY:Legal Consultation with ${b.lawyerName || 'Attorney'} (${b.lawyerSpecialty || 'LegalAI'})`,
    `DESCRIPTION:Legal Consultation with ${b.lawyerName || 'Attorney'}\\nFirm: ${b.lawyerFirm || ''}\\nSpecialty: ${b.lawyerSpecialty || ''}\\nClient: ${b.clientName || ''}\\nSummary: ${(b.caseSummary || '').replace(/\\r?\\n/g, ' ')}`,
    `LOCATION:${b.lawyerFirm || ''}, ${b.lawyerCity || ''} ${b.lawyerState || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LegalAI_Consultation_${(b.lawyerName || 'Attorney').replace(/\\s+/g, '_')}_#${b.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Calendar event (.ics) downloaded!', 'success');
};

window.cancelConsultationBooking = async function(id) {
  if (!confirm('Are you sure you want to cancel this consultation booking?')) return;

  try {
    const resp = await fetch(`${LAWYERS_API}/consultations/${id}`, {
      method: 'DELETE'
    });
    const data = await resp.json();
    if (data.success) {
      showToast('Consultation cancelled successfully.', 'info');
      fetchAndRenderBookings();
    } else {
      showToast(data.message || 'Could not cancel booking.', 'error');
    }
  } catch (err) {
    console.error('Cancel booking error:', err);
    showToast('Failed to cancel booking. Make sure the server is reachable.', 'error');
  }
};

/* ================================================================
   COURT DIRECTORY MODULE
   ================================================================ */

const COURTS_API = `${SERVER_ORIGIN}/api/courts`;

// ── State ──
let courtsData = [];
let courtFilters = {
  search: '',
  jurisdiction: 'All Jurisdictions',
  state: 'All States'
};

// ── DOM References ──
const courtsGrid              = document.getElementById('courts-grid');
const courtSearchInput        = document.getElementById('court-search-input');
const courtSearchClear        = document.getElementById('court-search-clear');
const courtJurisdictionSelect = document.getElementById('court-jurisdiction-select');
const courtStateSelect        = document.getElementById('court-state-select');
const courtCountBadge         = document.getElementById('court-count-badge');
const courtPillChips          = document.querySelectorAll('.court-pill-chip');

// Court Modal References
const courtModalOverlay       = document.getElementById('court-modal-overlay');
const courtModalClose         = document.getElementById('court-modal-close');
const courtModalBtnClose      = document.getElementById('court-modal-btn-close');
const courtModalBadge         = document.getElementById('court-modal-badge');
const courtModalTitle         = document.getElementById('court-modal-title');
const courtModalCircuit       = document.getElementById('court-modal-circuit');
const courtModalLevel         = document.getElementById('court-modal-level');
const courtModalJudge         = document.getElementById('court-modal-judge');
const courtModalFiling        = document.getElementById('court-modal-filing');
const courtModalHours         = document.getElementById('court-modal-hours');
const courtModalAddress       = document.getElementById('court-modal-address');
const courtModalPhone         = document.getElementById('court-modal-phone');
const courtModalOverview      = document.getElementById('court-modal-overview');
const courtModalDivisions     = document.getElementById('court-modal-divisions');
const courtModalLink          = document.getElementById('court-modal-link');

// ── Fallback Dataset for Offline / Direct Preview ──
const FALLBACK_COURTS = [
  {
    id: 6,
    name: 'U.S. District Court - Southern District of New York',
    code: 'SDNY',
    jurisdiction: 'Federal District',
    level: 'Trial',
    circuit: '2nd Circuit',
    city: 'New York',
    state: 'NY',
    address: '500 Pearl Street, Daniel Patrick Moynihan Courthouse',
    zipCode: '10007',
    phone: '(212) 805-0136',
    website: 'https://www.nysd.uscourts.gov',
    clerkHours: 'Mon - Fri: 8:30 AM - 5:00 PM EST',
    filingSystem: 'CM/ECF / PACER',
    chiefJudge: 'Chief Judge Laura Taylor Swain',
    divisions: 'Civil Trial, Criminal, Complex Securities, Corporate Fraud, Admiralty',
    overview: 'The preeminent federal trial court known as the "Mother Court", adjudicating high-profile Wall Street financial crimes, international arbitration, and civil disputes.',
    badge: 'Mother Court of America'
  },
  {
    id: 7,
    name: 'U.S. District Court - Northern District of California',
    code: 'NDCA',
    jurisdiction: 'Federal District',
    level: 'Trial',
    circuit: '9th Circuit',
    city: 'San Francisco',
    state: 'CA',
    address: '450 Golden Gate Avenue, Phillip Burton Federal Building',
    zipCode: '94102',
    phone: '(415) 522-2000',
    website: 'https://www.cand.uscourts.gov',
    clerkHours: 'Mon - Fri: 9:00 AM - 4:00 PM PST',
    filingSystem: 'CM/ECF / PACER',
    chiefJudge: 'Chief Judge Richard Seeborg',
    divisions: 'Technology Antitrust, AI Copyright, Semiconductor Patents, Privacy Actions',
    overview: 'Trial epicenter for Silicon Valley tech litigation, presiding over multi-district class actions, privacy violations, and landmark software patents.',
    badge: 'Silicon Valley Tech Center'
  },
  {
    id: 8,
    name: 'U.S. District Court - Northern District of Illinois',
    code: 'NDIL',
    jurisdiction: 'Federal District',
    level: 'Trial',
    circuit: '7th Circuit',
    city: 'Chicago',
    state: 'IL',
    address: '219 South Dearborn Street, Everett McKinley Dirksen Courthouse',
    zipCode: '60604',
    phone: '(312) 435-5670',
    website: 'https://www.ilnd.uscourts.gov',
    clerkHours: 'Mon - Fri: 8:30 AM - 5:00 PM CST',
    filingSystem: 'CM/ECF / PACER',
    chiefJudge: 'Chief Judge Virginia M. Kendall',
    divisions: 'Commercial Disputes, Commodity Futures, Civil Rights, Federal Crimes',
    overview: 'Leading Midwestern federal district with extensive jurisprudence in financial derivatives, corporate restructuring, and civil rights litigation.',
    badge: 'Midwest Commercial Trial Center'
  },
  {
    id: 9,
    name: 'U.S. District Court - Central District of California',
    code: 'CDCA',
    jurisdiction: 'Federal District',
    level: 'Trial',
    circuit: '9th Circuit',
    city: 'Los Angeles',
    state: 'CA',
    address: '350 West 1st Street, First Street U.S. Courthouse',
    zipCode: '90012',
    phone: '(213) 894-1565',
    website: 'https://www.cacd.uscourts.gov',
    clerkHours: 'Mon - Fri: 8:30 AM - 4:30 PM PST',
    filingSystem: 'CM/ECF / PACER',
    chiefJudge: 'Chief Judge Dolly M. Gee',
    divisions: 'Entertainment & Media, Trademark, Class Action, Intellectual Property',
    overview: 'The most populous federal trial district in the United States, commanding premier dockets in entertainment contracts, trademark infringement, and cross-border trade.',
    badge: 'Entertainment & Media Hub'
  },
  {
    id: 10,
    name: 'U.S. District Court - Eastern District of Texas',
    code: 'EDTX',
    jurisdiction: 'Federal District',
    level: 'Trial',
    circuit: '5th Circuit',
    city: 'Tyler',
    state: 'TX',
    address: '211 West Ferguson Street, William M. Steger Courthouse',
    zipCode: '75702',
    phone: '(903) 590-1000',
    website: 'https://www.txed.uscourts.gov',
    clerkHours: 'Mon - Fri: 8:00 AM - 5:00 PM CST',
    filingSystem: 'CM/ECF / PACER',
    chiefJudge: 'Chief Judge Rodney Gilstrap',
    divisions: 'Patent Infringement, High-Tech Jury Trials, Energy Commercial Litigation',
    overview: 'Renowned nationwide for specialized patent jury trials, procedural speed, and high-stakes intellectual property dispute resolutions.',
    badge: 'Patent Trial Epicenter'
  },
];


// ── HTML Template for Court Card ──
function courtCardHTML(c) {
  return `
  <div class="court-card" id="court-card-${c.id}" data-id="${c.id}">
    <div class="court-card-top">
      <div class="court-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"/>
        </svg>
      </div>
      <div class="court-badges-wrap">
        <span class="court-jurisdiction-badge">${c.jurisdiction}</span>
        <span class="court-level-badge">${c.level} Level</span>
      </div>
    </div>

    <div class="court-name">${c.name}</div>
    <div class="court-circuit-text">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      <span>${c.circuit || c.state}</span>
    </div>

    <p class="court-desc-text">${c.overview}</p>

    <div class="court-meta-box">
      <div class="court-meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${c.city}, ${c.state}</span>
      </div>
      <div class="court-meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>${c.chiefJudge.length > 34 ? c.chiefJudge.substring(0, 32) + '...' : c.chiefJudge}</span>
      </div>
      <div class="court-meta-item">
        <span class="court-filing-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ${c.filingSystem}
        </span>
      </div>
    </div>

    <div class="court-card-actions">
      <button class="btn-court-details" onclick="openCourtModal(${c.id})">
        📋 View Court Info & Rules
      </button>
      <a href="${c.website}" target="_blank" rel="noopener" class="btn-court-ext" title="Visit Official Website">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  </div>`;
}

// ── Render Courts ──
function renderCourts(courts) {
  if (!courtsGrid) return;

  if (!courts || courts.length === 0) {
    courtsGrid.innerHTML = `
      <div class="lawyers-empty-state" style="grid-column: 1 / -1;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"/></svg>
        <h4>No Courts Found</h4>
        <p>Try clearing your search query or selecting "All Jurisdictions".</p>
      </div>`;
    if (courtCountBadge) courtCountBadge.textContent = 'No courts found';
    return;
  }

  courtsGrid.innerHTML = courts.map(courtCardHTML).join('');
  if (courtCountBadge) {
    courtCountBadge.textContent = `Showing ${courts.length} Verified Court${courts.length !== 1 ? 's' : ''}`;
  }
}

// ── Filter and Fetch Courts ──
async function fetchAndRenderCourts() {
  try {
    const params = new URLSearchParams();
    if (courtFilters.search) params.set('search', courtFilters.search);
    if (courtFilters.jurisdiction && courtFilters.jurisdiction !== 'All Jurisdictions') {
      params.set('jurisdiction', courtFilters.jurisdiction);
    }
    if (courtFilters.state && courtFilters.state !== 'All States') {
      params.set('state', courtFilters.state);
    }

    const resp = await fetch(`${COURTS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('Courts API status ' + resp.status);
    const data = await resp.json();
    courtsData = data.courts || [];
    renderCourts(courtsData);
  } catch (err) {
    // Offline / Local fallback
    let filtered = [...FALLBACK_COURTS];
    if (courtFilters.jurisdiction && courtFilters.jurisdiction !== 'All Jurisdictions') {
      filtered = filtered.filter(c => c.jurisdiction === courtFilters.jurisdiction);
    }
    if (courtFilters.state && courtFilters.state !== 'All States') {
      filtered = filtered.filter(c => c.state === courtFilters.state);
    }
    if (courtFilters.search) {
      const q = courtFilters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.chiefJudge.toLowerCase().includes(q) ||
        c.overview.toLowerCase().includes(q)
      );
    }
    courtsData = filtered;
    renderCourts(courtsData);
  }
}

// ── Search & Filter Listeners ──
if (courtSearchInput) {
  courtSearchInput.addEventListener('input', debounce(() => {
    courtFilters.search = courtSearchInput.value.trim();
    if (courtSearchClear) {
      courtSearchClear.classList.toggle('hidden', !courtFilters.search);
    }
    fetchAndRenderCourts();
  }, 300));
}

if (courtSearchClear) {
  courtSearchClear.addEventListener('click', () => {
    courtFilters.search = '';
    if (courtSearchInput) courtSearchInput.value = '';
    courtSearchClear.classList.add('hidden');
    fetchAndRenderCourts();
  });
}

if (courtJurisdictionSelect) {
  courtJurisdictionSelect.addEventListener('change', () => {
    courtFilters.jurisdiction = courtJurisdictionSelect.value;
    syncCourtPills(courtFilters.jurisdiction);
    fetchAndRenderCourts();
  });
}

if (courtStateSelect) {
  courtStateSelect.addEventListener('change', () => {
    courtFilters.state = courtStateSelect.value;
    fetchAndRenderCourts();
  });
}

function syncCourtPills(jurisdiction) {
  courtPillChips.forEach(p => {
    p.classList.toggle('active', p.dataset.jurisdiction === jurisdiction);
  });
}

courtPillChips.forEach(pill => {
  pill.addEventListener('click', () => {
    courtFilters.jurisdiction = pill.dataset.jurisdiction;
    syncCourtPills(courtFilters.jurisdiction);
    if (courtJurisdictionSelect) {
      courtJurisdictionSelect.value = courtFilters.jurisdiction;
    }
    fetchAndRenderCourts();
  });
});

// ── Court Modal Open & Close ──
window.openCourtModal = function(courtId, fallbackCourt = null) {
  let court = courtsData.find(c => c.id === courtId) || (typeof FALLBACK_COURTS !== 'undefined' ? FALLBACK_COURTS.find(c => c.id === courtId) : null) || fallbackCourt;
  if (!court && window.aiSuggestionsCache?.courts[courtId]) {
    court = window.aiSuggestionsCache.courts[courtId];
  }
  if (!court || !courtModalOverlay) return;

  if (courtModalBadge)    courtModalBadge.textContent = court.badge || court.jurisdiction || 'Court';
  if (courtModalTitle)    courtModalTitle.textContent = court.name;
  if (courtModalCircuit)  courtModalCircuit.textContent = `${court.circuit || court.state || 'General'} · ${court.jurisdiction || 'Judicial'}`;
  if (courtModalLevel)    courtModalLevel.textContent = `${court.level || 'Trial'} Level`;
  if (courtModalJudge)    courtModalJudge.textContent = court.chiefJudge || 'Presiding Judicial Bench';
  if (courtModalFiling)   courtModalFiling.textContent = court.filingSystem || 'Standard Electronic / Clerk Filing';
  if (courtModalHours)    courtModalHours.textContent = court.clerkHours || 'Mon - Fri: 8:30 AM - 5:00 PM';
  if (courtModalAddress)  courtModalAddress.textContent = court.address ? `${court.address}, ${court.city || ''}, ${court.state || ''} ${court.zipCode || ''}` : `${court.city || ''}, ${court.state || ''}`;
  if (courtModalPhone)    courtModalPhone.textContent = court.phone || '(555) 019-2831';
  if (courtModalOverview) courtModalOverview.textContent = court.overview || court.jurisdictionGuidance || '';

  if (courtModalDivisions) {
    const divs = (court.divisions || 'General Civil, Complex Litigation').split(',').map(d => d.trim()).filter(Boolean);
    courtModalDivisions.innerHTML = divs.map(d => `<span class="court-division-chip">${d}</span>`).join('');
  }

  if (courtModalLink) {
    courtModalLink.href = court.website || '#';
  }

  courtModalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function closeCourtModal() {
  if (!courtModalOverlay) return;
  courtModalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

courtModalClose?.addEventListener('click', closeCourtModal);
courtModalBtnClose?.addEventListener('click', closeCourtModal);
courtModalOverlay?.addEventListener('click', (e) => {
  if (e.target === courtModalOverlay) closeCourtModal();
});

// ── Navbar "Courts" link scroll handler ──
const navCourtsLink = document.getElementById('nav-courts');
if (navCourtsLink) {
  navCourtsLink.addEventListener('click', (e) => {
    e.preventDefault();
    const courtsSection = document.getElementById('courts');
    if (courtsSection) {
      courtsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ── Footer AI link ──
const footerAiLink = document.getElementById('footer-ai-link');
if (footerAiLink) {
  footerAiLink.addEventListener('click', (e) => {
    e.preventDefault();
    openAIDrawer();
  });
}

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderLawyers();
  fetchAndRenderCourts();
  fetchAndRenderBookings();
  fetchAndRenderWorldNews();
});

// Also fire immediately if DOM is ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  fetchAndRenderLawyers();
  fetchAndRenderCourts();
  fetchAndRenderBookings();
  fetchAndRenderWorldNews();
}



/* ================================================================
   PRACTICE AREA DETAIL MODAL
   ================================================================ */

const PRACTICE_AREA_DATA = {
  criminal: {
    title: 'Criminal Law',
    tag: 'Criminal Defense',
    subtitle: 'Vigorous defense of your constitutional rights against state and federal prosecution.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>`,
    stats: [
      { num: '94%', lbl: 'Acquittal Rate' },
      { num: '1,200+', lbl: 'Cases Handled' },
      { num: '15+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Criminal law encompasses offenses prosecuted by federal or state governments against individuals. Our attorneys provide aggressive, strategic defense from the first investigation through trial and appeal, protecting your liberty and constitutional rights at every stage.',
    rights: [
      '5th Amendment right to remain silent — you cannot be compelled to incriminate yourself',
      '6th Amendment right to a speedy, public trial and to confront witnesses',
      'Miranda rights: right to counsel before any police questioning',
      'Right to a jury of your peers for any offense punishable by more than 6 months',
      'Protection against double jeopardy — you cannot be tried twice for the same crime',
      'Right to a competent, zealous defense attorney throughout all proceedings'
    ],
    cases: ['DUI / DWI Defense', 'Drug Offenses', 'White-Collar Crime', 'Assault & Battery', 'Federal Charges', 'Homicide Defense', 'Domestic Violence', 'Theft & Fraud', 'Sex Offense Defense', 'Juvenile Cases'],
    when: 'Contact a criminal defense attorney immediately upon arrest, when you receive a target letter from a federal grand jury, when you become aware you are under investigation, or when charged with any misdemeanor or felony offense. Early legal intervention dramatically improves outcomes.'
  },
  family: {
    title: 'Family Law',
    tag: 'Family & Domestic',
    subtitle: 'Compassionate, strategic counsel through life\'s most sensitive legal transitions.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    stats: [
      { num: '98%', lbl: 'Client Satisfaction' },
      { num: '3,500+', lbl: 'Families Served' },
      { num: '20+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Family law governs the legal relationships between individuals within a family unit, including marriage, divorce, child custody, and adoption. Our attorneys approach each case with both legal rigor and genuine compassion, understanding that these matters affect your most important relationships.',
    rights: [
      'Right to an equitable division of marital assets and liabilities upon divorce',
      'Right to seek spousal support (alimony) based on financial disparity',
      'Parent\'s right to seek custody and visitation arrangements in the child\'s best interest',
      'Right to modify custody or support orders when material circumstances change',
      'Children\'s right to financial support from both parents regardless of custody arrangement',
      'Right to a confidential, court-approved adoption process with full legal protections'
    ],
    cases: ['Divorce & Separation', 'Child Custody', 'Child Support', 'Spousal Alimony', 'Adoption', 'Paternity', 'Domestic Violence Orders', 'Prenuptial Agreements', 'Property Division', 'Guardianship'],
    when: 'Consult a family law attorney when filing for or responding to divorce, when custody or support agreements need to be established or modified, before signing a prenuptial agreement, when facing domestic violence, or when pursuing or contesting an adoption.'
  },
  corporate: {
    title: 'Corporate Law',
    tag: 'Business & Corporate',
    subtitle: 'Strategic legal counsel protecting and advancing your business at every stage of growth.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    stats: [
      { num: '$4.2B+', lbl: 'Deals Closed' },
      { num: '2,800+', lbl: 'Businesses Served' },
      { num: '18+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Corporate law encompasses the formation, governance, financing, and dissolution of corporate entities, as well as mergers, acquisitions, and commercial contracts. Our attorneys serve startups, mid-market companies, and Fortune 500 enterprises with sophisticated transactional and advisory services.',
    rights: [
      'Right to form a legally protected corporate entity limiting personal liability',
      'Shareholder rights: voting, dividends, inspection of books and records',
      'Contractual right to enforce binding business agreements and recover breach damages',
      'IP protection rights: trademarks, patents, trade secrets, and copyrights',
      'Right to challenge and seek relief for unfair business competition',
      'Director and officer rights to indemnification and D&O insurance protections'
    ],
    cases: ['Business Formation (LLC/Corp)', 'Mergers & Acquisitions', 'Contract Drafting', 'Securities Compliance', 'Commercial Disputes', 'Intellectual Property', 'Employment Agreements', 'Venture Capital Financing', 'Joint Ventures', 'Corporate Governance'],
    when: 'Engage corporate counsel when forming or restructuring a business entity, before signing any significant contract, during M&A due diligence, when raising capital, when facing commercial litigation, or when navigating regulatory compliance requirements.'
  },
  civil: {
    title: 'Civil Rights',
    tag: 'Civil Rights & Liberties',
    subtitle: 'Fearless advocacy for equality, justice, and your fundamental constitutional freedoms.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    stats: [
      { num: '87%', lbl: 'Win Rate' },
      { num: '$320M+', lbl: 'Recovered for Clients' },
      { num: '25+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Civil rights law protects individuals from government abuse and private discrimination based on race, gender, religion, disability, and other protected characteristics. Our attorneys stand at the forefront of constitutional litigation, fighting to hold institutions accountable and secure justice for those whose rights have been violated.',
    rights: [
      '1st Amendment: freedom of speech, religion, press, assembly, and petition',
      '4th Amendment: protection against unreasonable searches and seizures',
      '14th Amendment equal protection: freedom from discrimination by state actors',
      'Right to due process before the government deprives you of life, liberty, or property',
      'Title VII protections against workplace discrimination based on race, sex, religion, or national origin',
      'ADA protections guaranteeing equal access and reasonable accommodations for disabilities'
    ],
    cases: ['Police Misconduct', 'Employment Discrimination', 'Housing Discrimination', 'Wrongful Arrest', 'Free Speech Violations', 'Disability Rights (ADA)', 'Voting Rights', 'Prison Conditions', 'School Discrimination', 'LGBTQ+ Rights'],
    when: 'Retain a civil rights attorney when you have suffered discrimination by an employer, landlord, or government entity; when law enforcement has violated your constitutional rights; when your freedom of speech or religion has been suppressed; or when seeking systemic change through civil litigation.'
  },

  employment: {
    title: 'Employment Law',
    tag: 'Workplace & Labor Rights',
    subtitle: 'Protecting employees and employers through every stage of the employment relationship.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    stats: [
      { num: '96%', lbl: 'Cases Resolved' },
      { num: '4,100+', lbl: 'Workers Represented' },
      { num: '$890M+', lbl: 'Recovered in Wages' }
    ],
    overview: 'Employment law governs the rights and duties between employers and employees, covering hiring, wages, workplace safety, discrimination, termination, and post-employment obligations. Our attorneys are relentless advocates for workers whose rights have been violated and advisors to businesses seeking full legal compliance.',
    rights: [
      'Right to be free from discrimination based on race, sex, age, disability, religion, or national origin (Title VII, ADA, ADEA)',
      'Right to equal pay for equal work regardless of gender (Equal Pay Act)',
      'Right to minimum wage and overtime pay under the Fair Labor Standards Act (FLSA)',
      'Whistleblower protections against retaliation for reporting safety or legal violations',
      'Right to 12 weeks of unpaid family/medical leave under FMLA without job loss',
      'Right to a workplace free from sexual harassment and a hostile work environment'
    ],
    cases: ['Wrongful Termination', 'Wage & Overtime Theft', 'Sexual Harassment', 'Race & Age Discrimination', 'FMLA Violations', 'Non-Compete Disputes', 'Severance Negotiation', 'Whistleblower Claims', 'Retaliation', 'ADA Accommodations'],
    when: 'Consult an employment attorney when you have been fired for an unlawful reason, subjected to workplace harassment or discrimination, denied earned wages or overtime, retaliated against for reporting violations, or before signing any severance agreement or non-compete clause.'
  },

  injury: {
    title: 'Personal Injury',
    tag: 'Accident & Injury Claims',
    subtitle: 'Fighting for maximum compensation when someone else\'s negligence changes your life.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 12.5l3 3 8-8"/><circle cx="12" cy="12" r="10"/></svg>`,
    stats: [
      { num: '$1.6B+', lbl: 'Recovered for Clients' },
      { num: '99%', lbl: 'Success Rate' },
      { num: '12,000+', lbl: 'Injury Cases Won' }
    ],
    overview: 'Personal injury law allows victims harmed by another party\'s negligence or intentional misconduct to seek monetary compensation. Our trial attorneys handle everything from automobile accidents and slip-and-falls to catastrophic injuries and wrongful death, ensuring you are never outmatched by insurance companies.',
    rights: [
      'Right to compensation for all medical bills, future treatment costs, and rehabilitation',
      'Right to recover lost wages and loss of future earning capacity',
      'Right to damages for pain, suffering, emotional distress, and loss of enjoyment of life',
      'Right to pursue punitive damages when the defendant\'s conduct was reckless or intentional',
      'Protection against early predatory settlement offers before your injuries are fully assessed',
      'Right to file a wrongful death claim if a loved one was killed by another\'s negligence'
    ],
    cases: ['Car & Truck Accidents', 'Slip & Fall Injuries', 'Medical Malpractice', 'Motorcycle Accidents', 'Product Liability', 'Workplace Accidents', 'Brain & Spinal Injuries', 'Wrongful Death', 'Dog Bites', 'Nursing Home Abuse'],
    when: 'Contact a personal injury attorney immediately after any accident causing injury. Critical deadlines (statutes of limitations) begin from the date of injury — typically 2–3 years depending on your state. Early legal action preserves evidence, protects your rights, and maximizes your recovery.'
  },

  immigration: {
    title: 'Immigration Law',
    tag: 'Visas, Residency & Citizenship',
    subtitle: 'Guiding individuals, families, and businesses through every stage of the U.S. immigration system.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    stats: [
      { num: '97%', lbl: 'Visa Approval Rate' },
      { num: '8,500+', lbl: 'Clients Served' },
      { num: '22+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Immigration law governs who may enter, remain in, or become a citizen of the United States. Our immigration attorneys handle family-based petitions, employment visas, asylum claims, deportation defense, and naturalization, providing knowledgeable guidance through one of the most complex areas of federal law.',
    rights: [
      'Right to apply for asylum if you face persecution based on race, religion, nationality, political opinion, or social group',
      'Due process rights in removal (deportation) proceedings, including the right to present a defense',
      'Right to seek adjustment of status to lawful permanent residence (green card)',
      'Right to apply for naturalization after meeting continuous residence and physical presence requirements',
      'Right to petition for qualifying family members under family-based immigration categories',
      'DACA recipients\' right to renew deferred action and employment authorization'
    ],
    cases: ['Family Petitions (I-130)', 'Employment Visas (H-1B, L-1, O-1)', 'Green Card Applications', 'Asylum & Refugee Status', 'Deportation Defense', 'Citizenship & Naturalization', 'DACA Renewals', 'Consular Processing', 'Student Visas (F-1)', 'Investor Visas (EB-5)'],
    when: 'Consult an immigration attorney when applying for any visa or green card, before any USCIS or immigration court hearing, upon receiving a Notice to Appear (NTA) for removal, when your visa status has been violated, or when planning to bring family members to the United States.'
  },

  ip: {
    title: 'Intellectual Property',
    tag: 'Patents, Trademarks & Copyrights',
    subtitle: 'Protecting your innovations, brand identity, and creative works in the global marketplace.',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
    stats: [
      { num: '3,200+', lbl: 'Patents Secured' },
      { num: '$2.1B+', lbl: 'IP Assets Protected' },
      { num: '25+ yrs', lbl: 'Avg Experience' }
    ],
    overview: 'Intellectual property law safeguards the products of human creativity and invention — including patents, trademarks, copyrights, and trade secrets. Our IP attorneys work with startups, established enterprises, and individual creators to register, enforce, and defend their most valuable intangible assets.',
    rights: [
      'Exclusive right to make, use, sell, and license your patented invention for up to 20 years',
      'Trademark rights to exclusive use of your brand name, logo, or slogan in commerce',
      'Automatic copyright protection for original creative works from the moment of creation',
      'Trade secret protections against misappropriation of confidential business information',
      'Right to seek injunctive relief, damages, and attorney\'s fees for IP infringement',
      'Right to license your IP and collect royalties from authorized third-party use'
    ],
    cases: ['Utility & Design Patents', 'Trademark Registration', 'Copyright Registration', 'Trade Secret Litigation', 'IP Infringement Lawsuits', 'DMCA Takedowns', 'Licensing Agreements', 'Patent Portfolio Strategy', 'Brand Protection', 'Software & Tech IP'],
    when: 'Engage an IP attorney before launching a new product or brand, before filing any patent application, when you discover someone is infringing your IP rights, before signing any licensing or assignment agreement, or when you receive a cease-and-desist letter asserting infringement claims against you.'
  }
};

// ── Open Practice Area Modal ──
function openPracticeModal(areaKey) {
  const data = PRACTICE_AREA_DATA[areaKey];
  if (!data) return;

  const overlay = document.getElementById('pa-modal-overlay');

  // Populate header
  document.getElementById('pa-modal-icon').innerHTML    = data.icon;
  document.getElementById('pa-modal-tag').textContent   = data.tag;
  document.getElementById('pa-modal-title').textContent = data.title;
  document.getElementById('pa-modal-subtitle').textContent = data.subtitle;

  // Populate stats
  document.getElementById('pa-stats-row').innerHTML = data.stats
    .map(s => `<div class="pa-stat"><span class="pa-stat-num">${s.num}</span><span class="pa-stat-lbl">${s.lbl}</span></div>`)
    .join('');

  // Populate overview
  document.getElementById('pa-overview-text').textContent = data.overview;

  // Populate rights
  document.getElementById('pa-rights-list').innerHTML = data.rights
    .map(r => `<li>${r}</li>`)
    .join('');

  // Populate case types
  document.getElementById('pa-cases-grid').innerHTML = data.cases
    .map(c => `<span class="pa-case-chip">${c}</span>`)
    .join('');

  // Populate when
  document.getElementById('pa-when-text').textContent = data.when;

  // CTA button — scroll to lawyers section filtered by specialty
  const specialtyMap = {
    criminal:    'Criminal Law',
    family:      'Family Law',
    corporate:   'Corporate Law',
    civil:       'Civil Rights',
    employment:  'Employment Law',
    injury:      'Personal Injury',
    immigration: 'Immigration Law',
    ip:          'Intellectual Property'
  };
  document.getElementById('pa-cta-btn').onclick = () => {
    closePracticeModal();
    const specialtySelect = document.getElementById('specialty-select');
    if (specialtySelect) {
      specialtySelect.value = specialtyMap[areaKey] || 'All Specialties';
      specialtySelect.dispatchEvent(new Event('change'));
    }
    const lawyersSection = document.getElementById('lawyers');
    if (lawyersSection) lawyersSection.scrollIntoView({ behavior: 'smooth' });
  };

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// ── Close Practice Area Modal ──
function closePracticeModal() {
  const overlay = document.getElementById('pa-modal-overlay');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}


// ── Event Listeners for Practice Area Modal ──
document.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('pa-modal-overlay');
  const closeBtn  = document.getElementById('pa-modal-close');
  const closeBtnF = document.getElementById('pa-close-btn');

  if (closeBtn)  closeBtn.addEventListener('click', closePracticeModal);
  if (closeBtnF) closeBtnF.addEventListener('click', closePracticeModal);
  if (overlay)   overlay.addEventListener('click', (e) => { if (e.target === overlay) closePracticeModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePracticeModal();
  });
});


// ═══════════════════════════════════════════════════════════
//  REAL-TIME LEGAL ARTICLES SYSTEM
// ═══════════════════════════════════════════════════════════

(function () {
  // ── STATE ──
  let articlesData = [];
  let currentCategory = 'All';
  let currentSearch = '';
  let isFetchingArticles = false;
  let articlesAutoRefreshTimer = null;
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  // ── DOM REFS ──
  const articlesOverlay      = document.getElementById('articles-modal-overlay');
  const articlesCloseBtn     = document.getElementById('articles-close-btn');
  const articlesRefreshBtn   = document.getElementById('articles-refresh-btn');
  const articlesSearchInput  = document.getElementById('articles-search-input');
  const articlesSearchClear  = document.getElementById('articles-search-clear');
  const articlesGrid         = document.getElementById('articles-grid');
  const articlesEmpty        = document.getElementById('articles-empty');
  const articlesLiveDot      = document.getElementById('articles-live-dot');
  const articlesLiveText     = document.getElementById('articles-live-text');
  const articlesLastUpdated  = document.getElementById('articles-last-updated');
  const articlesCountText    = document.getElementById('articles-count-text');
  const articlesPills        = document.querySelectorAll('.articles-pill');

  // ── OPEN MODAL ──
  window.openArticlesModal = function () {
    if (!articlesOverlay) return;
    articlesOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Start auto-refresh
    if (!articlesAutoRefreshTimer) {
      articlesAutoRefreshTimer = setInterval(() => {
        if (!articlesOverlay.classList.contains('hidden')) {
          fetchArticles(true); // silent refresh
        }
      }, AUTO_REFRESH_INTERVAL);
    }

    // Fetch on first open or if stale
    if (articlesData.length === 0) {
      fetchArticles(false);
    } else {
      renderArticles();
    }
  };

  // ── CLOSE MODAL ──
  function closeArticlesModal() {
    if (!articlesOverlay) return;
    articlesOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ── SET LIVE STATUS ──
  function setArticleLiveStatus(state, text) {
    if (!articlesLiveDot || !articlesLiveText) return;
    articlesLiveDot.className = 'articles-live-dot';
    if (state === 'live') {
      articlesLiveDot.classList.add('live');
      articlesLiveText.textContent = text || 'Live Feed';
    } else if (state === 'loading') {
      articlesLiveDot.classList.add('loading');
      articlesLiveText.textContent = text || 'Fetching...';
    } else {
      articlesLiveDot.classList.add('offline');
      articlesLiveText.textContent = text || 'Offline Content';
    }
  }

  // ── FETCH ARTICLES FROM BACKEND ──
  async function fetchArticles(silent = false) {
    if (isFetchingArticles) return;
    isFetchingArticles = true;

    if (!silent) {
      showSkeletons();
      setArticleLiveStatus('loading', 'Fetching live articles...');
    } else {
      setArticleLiveStatus('loading', 'Refreshing...');
    }

    if (articlesRefreshBtn) {
      articlesRefreshBtn.classList.add('spinning');
      articlesRefreshBtn.disabled = true;
    }

    try {
      const params = new URLSearchParams({ limit: 30 });
      const apiUrl = `${SERVER_ORIGIN}/api/articles?${params.toString()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (data.success && data.articles && data.articles.length > 0) {
        articlesData = data.articles;
        const onlineSources = data.sourcesOnline || 0;

        if (onlineSources > 0) {
          setArticleLiveStatus('live', `${onlineSources} live source${onlineSources > 1 ? 's' : ''} active`);
        } else {
          setArticleLiveStatus('offline', 'Curated editorial content');
        }

        const updatedAt = new Date(data.lastUpdated || Date.now());
        if (articlesLastUpdated) {
          articlesLastUpdated.textContent = `Last updated: ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        if (silent) {
          showToast('📰 Articles refreshed with latest legal news', 'info');
        }
      } else {
        setArticleLiveStatus('offline', 'Curated content active');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log('Articles fetch failed, showing curated content.');
      }
      // Use fallback inline data if backend is offline
      if (articlesData.length === 0) {
        articlesData = getLocalFallbackArticles();
        setArticleLiveStatus('offline', 'Curated content active');
        if (articlesLastUpdated) {
          articlesLastUpdated.textContent = 'Showing curated legal articles';
        }
      }
    } finally {
      isFetchingArticles = false;
      if (articlesRefreshBtn) {
        articlesRefreshBtn.classList.remove('spinning');
        articlesRefreshBtn.disabled = false;
      }
      renderArticles();
    }
  }

  // ── LOCAL FALLBACK (when server is offline) ──
  // ── LOCAL FALLBACK ARTICLES WITH RICH EDITORIAL CONTENT ──
  function getLocalFallbackArticles() {
    const now = Date.now();
    return [
      {
        id: 'miranda-rights',
        title: 'Understanding Your Miranda Rights: A Complete Legal Guide',
        lead: 'The Miranda warning protects fundamental Fifth and Sixth Amendment rights during custodial police interrogation. Knowing precisely when these rights attach and how to assert them is vital.',
        description: 'The Miranda warning protects your 5th and 6th Amendment rights during police custody. Learn when these rights apply and how to properly invoke them.',
        pubDate: new Date(now).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Criminal Law',
        icon: '🛡️',
        readTime: '4 min read',
        practiceArea: 'criminal',
        link: '#',
        takeaways: [
          'Miranda rights apply only when a suspect is in formal custody AND subjected to police interrogation.',
          'Remaining completely silent is legally insufficient; you must invoke your right to silence unambiguously under Berghuis v. Thompkins.',
          'Once you unequivocally request an attorney, all police questioning must immediately cease under Edwards v. Arizona.',
          'Violations of Miranda lead to suppression of custodial statements under the judicial Exclusionary Rule.'
        ],
        sections: [
          {
            heading: '1. The Constitutional Genesis of Miranda Warnings',
            paragraphs: [
              'In the landmark 1966 Supreme Court decision Miranda v. Arizona (384 U.S. 436), the Court recognized that custodial police interrogations inherently exert coercive pressure capable of overbearing an individual’s will. To safeguard the Fifth Amendment privilege against compelled self-incrimination, the Court mandated procedural safeguards before questioning begins.',
              'The four universal components of the warning are: (1) You have the right to remain silent; (2) Anything you say can and will be used against you in court; (3) You have the right to consult an attorney and have one present during questioning; and (4) If you cannot afford an attorney, one will be appointed for you.'
            ]
          },
          {
            heading: '2. The Two-Prong Test: Custody + Interrogation',
            paragraphs: [
              'A common misconception is that officers must read you your rights the moment handcuffs are placed on your wrists. Under constitutional doctrine, Miranda is only triggered when two concurrent conditions exist:',
              'Custody: A reasonable person in your position would feel they were not free to terminate the encounter and leave (formal arrest or restraint to a degree associated with formal arrest).',
              'Interrogation: Express questioning or words/actions by law enforcement reasonably likely to elicit an incriminating response (Rhode Island v. Innis).'
            ]
          },
          {
            heading: '3. How to Unambiguously Assert Your Rights',
            paragraphs: [
              'Under Berghuis v. Thompkins (2010), simply staying quiet does not constitute invoking your right to remain silent. The Supreme Court held that invocation must be clear and affirmative.',
              'The single most effective phrase you can state is: "I am invoking my Fifth Amendment right to remain silent and I want to speak with my attorney immediately. I will not answer any questions without legal counsel present."'
            ]
          },
          {
            heading: '4. Legal Consequences of Police Violations',
            paragraphs: [
              'If officers interrogate you in custody without advising you of your Miranda rights or continue questioning after you requested counsel, your statements are inadmissible in the prosecution’s case-in-chief under the exclusionary rule.',
              'However, voluntary un-Mirandized statements can still be used for impeachment purposes if you testify inconsistently at trial, which is why immediate retention of criminal defense counsel is indispensable.'
            ]
          }
        ],
        laws: [
          'U.S. Const. amend. V & VI',
          'Miranda v. Arizona, 384 U.S. 436 (1966)',
          'Berghuis v. Thompkins, 560 U.S. 370 (2010)',
          'Edwards v. Arizona, 451 U.S. 477 (1981)',
          '18 U.S.C. § 3501'
        ],
        checklist: [
          'Ask the officer clearly: "Am I free to leave?" If yes, calmly exit the encounter.',
          'If not free to leave, state: "I invoke my right to remain silent and I want my lawyer."',
          'Do not sign waivers, consent forms, or consent to cell phone searches without counsel.',
          'Never attempt to "explain your side" or negotiate with detectives in an interrogation room.',
          'Remember officer badge numbers and request your phone call to contact legal representation.'
        ],
        warning: 'Police are legally permitted to use deception, misrepresent evidence, and claim accomplices confessed during interrogations. Never assume you can talk your way out of charges without an attorney.'
      },
      {
        id: 'tenant-rights',
        title: 'Tenant Rights in 2026: Security Deposits, Evictions & Habitability',
        lead: 'Landlord-tenant disputes have evolved rapidly with new statutory caps on security deposits, strict eviction protocols, and universal habitability standards nationwide.',
        description: 'State-by-state breakdown of landlord-tenant laws including security deposit limits, notice requirements, and your right to habitable housing.',
        pubDate: new Date(now - 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Real Estate Law',
        icon: '🏠',
        readTime: '5 min read',
        practiceArea: 'real-estate',
        link: '#',
        takeaways: [
          'The Implied Warranty of Habitability is non-waivable in residential leases regardless of lease language.',
          'Most jurisdictions mandate return of security deposits within 14 to 30 days with itemized receipts.',
          'Self-help evictions (changing locks, shutting off utilities) are universally illegal and carry severe statutory damages.',
          'Retaliatory evictions following tenant habitability complaints trigger rebuttable presumptions in favor of the tenant.'
        ],
        sections: [
          {
            heading: '1. The Implied Warranty of Habitability',
            paragraphs: [
              'Every residential lease includes an implied warranty that the premises are fit for human habitation. This includes structural integrity, weather protection, operational plumbing and hot water, safe electrical systems, functioning heating during winter, and freedom from hazardous mold or vermin infestations.',
              'Tenants cannot contract away this right. Lease clauses stating "tenant accepts apartment as-is and waives repair claims" are void as against public policy in virtually every state jurisdiction.'
            ]
          },
          {
            heading: '2. Security Deposit Protections and Timelines',
            paragraphs: [
              'Landlords cannot treat security deposits as a personal windfall. Recent 2025–2026 statutory reforms have capped deposits at 1 month\'s rent in major states (including California, New York, and Washington).',
              'Upon vacating, landlords must provide an itemized written statement detailing exact deductions alongside receipts within a statutory window (typically 21 days). Normal wear and tear cannot be deducted. Failure to meet the deadline often forfeits the landlord\'s right to retain any portion and may trigger treble damages.'
            ]
          },
          {
            heading: '3. Eviction Protections and Illegal Landlord Actions',
            paragraphs: [
              'A landlord cannot legally evict you without a formal court judgment issued by a housing or civil judge. Acts such as padlocking doors, removing tenant belongings, removing front doors, or terminating electricity or water constitute unlawful self-help evictions.',
              'Tenants subjected to self-help lockouts are entitled to emergency judicial re-entry orders, civil penalties up to thousands of dollars per violation, and recovery of reasonable attorney\'s fees.'
            ]
          }
        ],
        laws: [
          'Uniform Residential Landlord and Tenant Act (URLTA)',
          'Javins v. First National Realty Corp., 428 F.2d 1071 (D.C. Cir. 1970)',
          'Cal. Civ. Code § 1950.5',
          'N.Y. Real Prop. Law § 238-a',
          'Restatement (Second) of Property: Landlord & Tenant § 5.4'
        ],
        checklist: [
          'Photograph and video every room, appliance, and existing defect prior to move-in and upon move-out.',
          'Submit all maintenance and repair requests in writing with timestamped email delivery or certified mail.',
          'Request a joint move-out walk-through inspection at least 14 days prior to lease termination.',
          'Provide your written forwarding address via certified mail for the return of your security deposit.',
          'Never withhold rent without consulting local legal aid or an attorney regarding escrow requirements.'
        ],
        warning: 'Withholding rent without following state-mandated notice and escrow procedures can subject you to an immediate eviction action for non-payment. Consult an attorney before escrowing rent.'
      },
      {
        id: 'wrongful-termination',
        title: 'Wrongful Termination: Know Your Rights After Being Fired',
        lead: 'While 49 of 50 U.S. states follow at-will employment principles, severe statutory, constitutional, and public policy exceptions protect workers against unlawful termination.',
        description: 'Employment at-will has exceptions. Discrimination, retaliation for whistleblowing, and FMLA violations can all constitute wrongful termination claims.',
        pubDate: new Date(now - 2 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Employment Law',
        icon: '👔',
        readTime: '6 min read',
        practiceArea: 'employment',
        link: '#',
        takeaways: [
          'At-will employment allows dismissal for any lawful reason, but termination based on protected characteristics is illegal.',
          'Retaliation is the single most commonly filed EEOC charge, protecting employees who oppose unlawful practices.',
          'Whistleblower protections shield workers reporting financial fraud, safety violations, and public health threats.',
          'Severance agreements often contain binding waivers; workers aged 40+ have 21 days to review under the OWBPA.'
        ],
        sections: [
          {
            heading: '1. What Qualifies as Unlawful Termination?',
            paragraphs: [
              'An employer cannot terminate an employee based on protected characteristics established under Title VII of the Civil Rights Act of 1964, the Americans with Disabilities Act (ADA), the Age Discrimination in Employment Act (ADEA), or state anti-discrimination statutes.',
              'Protected categories include race, color, national origin, religion, sex (including sexual orientation, pregnancy, and gender identity), age (40 and older), disability, and genetic information.'
            ]
          },
          {
            heading: '2. Whistleblower Retaliation and Public Policy Exceptions',
            paragraphs: [
              'Terminating an employee for refusing to commit an illegal act, reporting OSHA safety hazards, reporting wage theft, or filing a worker\'s compensation claim violates public policy.',
              'Under the Sarbanes-Oxley Act (SOX) and the Dodd-Frank Act, corporate employees reporting securities fraud or accounting irregularities to the SEC or internal compliance channels cannot be discharged, demoted, or harassed.'
            ]
          },
          {
            heading: '3. Navigating Severance Agreements and Release of Claims',
            paragraphs: [
              'Employers routinely offer severance packages paired with comprehensive general releases of liability. Once signed, you forfeit virtually all rights to pursue discrimination or retaliation claims against the employer.',
              'Under the Older Workers Benefit Protection Act (OWBPA), employees aged 40 and older must be given at least 21 days to evaluate the agreement and 7 days to revoke their signature. Never sign a severance release without having an employment attorney review the document.'
            ]
          }
        ],
        laws: [
          'Title VII of the Civil Rights Act of 1964 (42 U.S.C. § 2000e)',
          'Americans with Disabilities Act of 1990 (42 U.S.C. § 12101)',
          'Age Discrimination in Employment Act (29 U.S.C. § 621)',
          'Family and Medical Leave Act (29 U.S.C. § 2601)',
          'Older Workers Benefit Protection Act (29 U.S.C. § 626(f))'
        ],
        checklist: [
          'Preserve performance reviews, commendation emails, and disciplinary records to your personal drive.',
          'Request your complete personnel file in writing pursuant to state labor codes.',
          'Do not sign severance waivers immediately; ask for the maximum statutory review period.',
          'Document a chronological timeline of events leading up to termination with relevant names and dates.',
          'File an EEOC or state agency inquiry promptly — administrative filing deadlines are as short as 180–300 days.'
        ],
        warning: 'The statute of limitations for filing employment discrimination claims with the EEOC is strictly 180 to 300 days from the discriminatory act. Missing this window permanently extinguishes your federal claim.'
      },
      {
        id: 'contract-clauses',
        title: 'How to Read a Contract: Key Clauses Every Client Should Know',
        lead: 'Contractual language often disguises severe financial liabilities inside boilerplate terms. Master indemnification, limitation of liability, and dispute resolution clauses.',
        description: 'From indemnification to force majeure — understanding contract clauses can protect you from costly legal disputes before they arise.',
        pubDate: new Date(now - 3 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Contract Law',
        icon: '📝',
        readTime: '5 min read',
        practiceArea: 'corporate',
        link: '#',
        takeaways: [
          'Indemnification clauses transfer legal defense costs and liabilities; ensure they are mutual and capped.',
          'Limitation of liability clauses should establish explicit monetary caps and carve-outs for gross negligence.',
          'Arbitration and choice-of-law clauses dictate where, how, and under which state\'s statutes disputes will be resolved.',
          'Integration/merger clauses mean prior oral promises are legally void unless written in the four corners of the contract.'
        ],
        sections: [
          {
            heading: '1. The Danger of Uncapped Indemnification',
            paragraphs: [
              'An indemnity clause requires one party to defend and hold harmless the other party from specified damages, liabilities, and legal defense fees. Unchecked indemnity clauses can bankrupt small businesses or contractors if they assume liability for third-party claims beyond their direct control.',
              'Always ensure indemnification obligations are: (1) strictly bilateral and mutual; (2) limited to direct breaches and willful misconduct; and (3) subject to the overall limitation of liability cap.'
            ]
          },
          {
            heading: '2. Limitation of Liability: Protecting Your Bottom Line',
            paragraphs: [
              'A well-drafted limitation of liability clause contains two distinct protections: a waiver of consequential/indirect/punitive damages, and an aggregate dollar cap on direct damages (often pegged to the total fees paid under the contract over the preceding 12 months).',
              'Ensure mutual carve-outs are reasonable and tailored strictly to confidentiality breaches and intellectual property infringement.'
            ]
          },
          {
            heading: '3. Integration and The Parol Evidence Rule',
            paragraphs: [
              'The "Entire Agreement" or merger clause states that the written document represents the final, complete expression of the parties\' understanding, superseding all prior oral promises, email exchanges, and pitch decks.',
              'Under the Parol Evidence Rule, courts generally refuse to hear evidence of oral promises that contradict or supplement an integrated contract. If an important promise was made during negotiations, it must appear in the text.'
            ]
          }
        ],
        laws: [
          'Uniform Commercial Code (UCC) Article 2',
          'Restatement (Second) of Contracts §§ 209-218',
          'Federal Arbitration Act (9 U.S.C. §§ 1-16)',
          'Del. Code Ann. tit. 6, § 2-719',
          'New York Uniform Commercial Code § 2-302'
        ],
        checklist: [
          'Verify that all oral promises, service levels, and milestones are explicitly memorialized in the text.',
          'Examine the indemnity clause to ensure it is mutual and does not cover the other party\'s sole negligence.',
          'Check the governing law and jurisdiction clause to avoid having to litigate across the country.',
          'Confirm termination notice periods and whether a cure period (e.g. 30 days) is provided before termination for cause.',
          'Have a corporate attorney conduct a pre-execution redline review for any agreement exceeding $10,000.'
        ],
        warning: 'Signing an agreement with a unilateral attorney\'s fee clause means you pay their legal bills if you lose, but they do not pay yours if you win. Demand that fee-shifting provisions be mutual.'
      },
      {
        id: 'child-custody',
        title: 'Child Custody in 2026: Legal Standards for Determining Best Interests',
        lead: 'Family courts determine custody through the lens of the child’s physical, emotional, and psychological welfare. Understanding statutory factors and parenting plans is paramount.',
        description: "Courts prioritize children's well-being above all else. This guide covers legal custody, physical custody, modification standards, and parenting plans.",
        pubDate: new Date(now - 4 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Family Law',
        icon: '👨‍👩‍👧',
        readTime: '6 min read',
        practiceArea: 'family',
        link: '#',
        takeaways: [
          'Legal custody governs major decisions (education, healthcare, religion); physical custody determines residence.',
          'The "Best Interests of the Child" standard balances parental fitness, stability, and emotional bonding.',
          'Modern family courts strongly favor joint legal custody unless domestic violence or abuse is demonstrated.',
          'Custody orders can only be modified upon showing a substantial, material change in circumstances.'
        ],
        sections: [
          {
            heading: '1. Deconstructing Legal vs. Physical Custody',
            paragraphs: [
              'Custody is bifurcated into two distinct legal concepts: Legal Custody concerns the authority to make critical life decisions regarding schooling, medical care, therapy, and religious upbringing. Joint legal custody requires both parents to confer in good faith.',
              'Physical Custody (or parenting time) designates the child’s primary physical residence and day-to-day schedule. Joint physical custody does not necessarily mean a 50/50 time split; schedules are tailored to work commitments and schooling.'
            ]
          },
          {
            heading: '2. The Statutory "Best Interests" Factors',
            paragraphs: [
              'While states enact distinct statutes, judges universally evaluate a codified list of factors, including: the emotional bond between child and each parent; each parent’s demonstrated capacity to provide food, shelter, and medical care; the child’s adjustment to home, school, and community; the mental and physical health of all individuals; and which parent is more likely to foster an affectionate relationship between the child and the other parent.',
              'Acts of parental alienation, disparaging the other parent in front of the child, or interfering with court-ordered visitation weigh heavily against custody requests.'
            ]
          },
          {
            heading: '3. Modification of Existing Custody Decrees',
            paragraphs: [
              'Once a final custody decree is entered, the doctrine of res judicata applies. A court will not re-adjudicate custody simply because a parent is dissatisfied.',
              'To modify an order, the moving parent must prove: (1) A material, substantial, and unanticipated change in circumstances has occurred since the decree; and (2) The proposed modification serves the child’s best interests.'
            ]
          }
        ],
        laws: [
          'Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)',
          'Troxel v. Granville, 530 U.S. 57 (2000)',
          'Parental Kidnapping Prevention Act (28 U.S.C. § 1738A)',
          'Cal. Fam. Code § 3011',
          'N.Y. Dom. Rel. Law § 240'
        ],
        checklist: [
          'Maintain a detailed parenting journal logging visitation dates, pickup times, and school involvement.',
          'Keep all communication with co-parents written, respectful, and focused strictly on the children (use parenting apps if needed).',
          'Avoid introducing new romantic partners to the children during ongoing custody proceedings.',
          'Never discuss legal strategy, alimony, or court filings within earshot of the children.',
          'Consult with an experienced family law attorney to draft a comprehensive, enforceable parenting agreement.'
        ],
        warning: 'Unilaterally withholding court-ordered visitation as leverage for unpaid child support is illegal and constitutes contempt of court, potentially resulting in fines, jail time, or loss of custody.'
      },
      {
        id: 'llc-vs-scorp',
        title: 'LLC vs. S-Corp: Choosing the Right Business Structure in 2026',
        lead: 'Selecting between a Limited Liability Company and an S-Corporation tax status impacts self-employment taxation, investor readiness, and statutory compliance formalities.',
        description: "Tax treatment, liability protection, and governance differ significantly between LLCs and S-Corps. Here's how to choose the right entity for your business.",
        pubDate: new Date(now - 5 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Corporate Law',
        icon: '💼',
        readTime: '5 min read',
        practiceArea: 'corporate',
        link: '#',
        takeaways: [
          'Both LLCs and S-Corps provide an equivalent corporate liability shield protecting personal assets.',
          'S-Corp status allows active owner-operators to minimize self-employment taxes (FICA) on dividend distributions.',
          'The IRS strictly enforces "Reasonable Compensation" requirements for S-Corp shareholder-employees.',
          'An LLC can elect S-Corp tax status via IRS Form 2553 without losing LLC organizational flexibility.'
        ],
        sections: [
          {
            heading: '1. The Core Legal Difference: Entity vs. Tax Election',
            paragraphs: [
              'A foundational point that confuses many business owners: An LLC is a legal business entity created under state law. An S-Corporation is not a distinct state entity type; it is a federal tax election made under Subchapter S of the Internal Revenue Code.',
              'This means your business can be legally formed as an LLC under state law and subsequently elect to be taxed as an S-Corporation for federal and state tax purposes.'
            ]
          },
          {
            heading: '2. The Self-Employment Tax Advantage',
            paragraphs: [
              'In a standard single-member LLC, 100% of net business profits are subject to federal self-employment tax (15.3% for Social Security and Medicare) in addition to ordinary income tax.',
              'With an S-Corporation election, net earnings can be divided into two streams: (1) A reasonable W-2 salary (subject to payroll taxes); and (2) Shareholder dividend distributions (free of self-employment tax). Once a company generates $60,000–$80,000+ in net profit, S-Corp tax savings frequently exceed $4,000 to $10,000 annually.'
            ]
          },
          {
            heading: '3. Restrictions and Compliance Formalities',
            paragraphs: [
              'S-Corporations face strict statutory limitations: A maximum of 100 shareholders, all shareholders must be U.S. citizens or resident aliens, no corporate or institutional owners, and only one class of stock is permitted.',
              'Additionally, S-Corps require formal payroll processing, quarterly payroll tax filings, and unemployment insurance contributions. Failure to maintain these formalities can pierce the corporate veil.'
            ]
          }
        ],
        laws: [
          'Internal Revenue Code Subchapter S (§§ 1361-1379)',
          'IRS Form 2553 (Election by a Small Business Corporation)',
          'Delaware Limited Liability Company Act (6 Del. C. § 18-101)',
          'Rev. Rul. 74-44 (Reasonable Compensation Standards)',
          'Treas. Reg. § 301.7701-3 (Check-the-box regulations)'
        ],
        checklist: [
          'Calculate current and projected annual net business earnings to determine if S-Corp election breaks even.',
          'Consult a CPA to establish benchmark "reasonable compensation" data for your specific industry role.',
          'Draft a robust Operating Agreement defining member voting, capital contributions, and buyout provisions.',
          'Maintain separate commercial bank accounts and never commingle personal and business funds.',
          'File IRS Form 2553 within 75 days of entity formation or by March 15 of the target tax year.'
        ],
        warning: 'Setting your W-2 salary artificially low (e.g. $10,000 salary with $150,000 in dividends) is an immediate audit trigger. The IRS regularly reclassifies dividends as wages, levying heavy back taxes and penalties.'
      },
      {
        id: 'personal-injury',
        title: 'Personal Injury Claims: From Accident Scene to Settlement',
        lead: 'The critical window immediately following an injury dictates the viability of your claim. Learn how negligence is established, damages calculated, and insurer tactics countered.',
        description: 'The legal process after an accident — documenting injuries, dealing with insurance adjusters, statute of limitations, and when to settle vs. litigate.',
        pubDate: new Date(now - 6 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Personal Injury',
        icon: '⚕️',
        readTime: '5 min read',
        practiceArea: 'injury',
        link: '#',
        takeaways: [
          'The four tort elements are Duty, Breach of Duty, Causation (factual and proximate), and measurable Damages.',
          'Insurance adjusters use recorded statements to establish comparative negligence; never give recorded statements without counsel.',
          'Economic damages include medical bills and lost wages; non-economic damages encompass pain, suffering, and impairment.',
          'Statutes of limitations for bodily injury range from 1 to 4 years depending on jurisdiction; claims against government entities are far shorter.'
        ],
        sections: [
          {
            heading: '1. Establishing the Four Elements of Negligence',
            paragraphs: [
              'To recover financial compensation in a tort claim, the plaintiff bears the burden of establishing negligence by a preponderance of the evidence:',
              '1. Duty: The defendant owed a legal duty of reasonable care (e.g., driver following traffic laws, property owner addressing hazards).',
              '2. Breach: The defendant failed to meet that standard through unreasonable action or omission.',
              '3. Causation: The breach was both the "but-for" factual cause and proximate legal cause of your injuries.',
              '4. Damages: Real, compensable physical, financial, and emotional harm resulted.'
            ]
          },
          {
            heading: '2. Comparative vs. Contributory Fault Rules',
            paragraphs: [
              'How your own potential fault affects recovery depends heavily on your state\'s doctrine. Pure Comparative Negligence states (California, Florida, New York) reduce awards by your percentage of fault (e.g., 20% at fault reduces a $100,000 verdict to $80,000).',
              'Modified Comparative Fault states (Texas, Illinois, Ohio) bar all recovery if the plaintiff is 50% or 51% or more at fault. Pure Contributory Negligence jurisdictions (Virginia, Maryland, D.C., North Carolina) bar all recovery if the plaintiff is even 1% at fault.'
            ]
          },
          {
            heading: '3. Combating Early Low-Ball Insurance Offers',
            paragraphs: [
              'Insurance adjusters often contact injured victims within days of an accident, offering a swift check in exchange for signing a general release of liability. Accepting this early offer bars you from recovering future medical expenses, surgeries, or permanent disability discovered weeks or months later.',
              'A seasoned personal injury attorney will delay formal settlement demands until you reach Maximum Medical Improvement (MMI) so full future treatment costs can be accurately calculated.'
            ]
          }
        ],
        laws: [
          'Restatement (Third) of Torts: Liability for Physical and Emotional Harm',
          'Palsgraf v. Long Island Railroad Co., 248 N.Y. 339 (1928)',
          'Cal. Civ. Code § 1714 (General Duty of Care)',
          'Federal Tort Claims Act (28 U.S.C. §§ 2671-2680)',
          'N.Y. C.P.L.R. § 214 (Statute of Limitations)'
        ],
        checklist: [
          'Call emergency services and obtain an official police or incident report at the scene.',
          'Photograph vehicle positions, roadway conditions, skid marks, property damage, and visible injuries.',
          'Seek medical evaluation immediately; gaps in treatment are used by insurers to argue injuries are fabricated.',
          'Do not post details of the accident, physical activities, or vacations on social media platforms.',
          'Consult a personal injury attorney on contingency (no fee unless you win) before speaking with insurance adjusters.'
        ],
        warning: 'Claims against municipal or state government agencies (e.g., public transit buses, city sidewalk defects) require filing an administrative Tort Claim Notice within as little as 30 to 90 days from the accident.'
      },
      {
        id: 'civil-rights-digital',
        title: 'Civil Rights in the Digital Age: Privacy, Free Speech & AI Law',
        lead: 'The rapid proliferation of algorithmic decision-making, predictive policing, and mass digital surveillance has ignited an urgent frontier of constitutional litigation.',
        description: 'Emerging legal challenges in the digital era including data privacy rights, First Amendment protections online, and the legal landscape of AI-generated content.',
        pubDate: new Date(now - 7 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Civil Rights',
        icon: '⚖️',
        readTime: '6 min read',
        practiceArea: 'civil',
        link: '#',
        takeaways: [
          'The Fourth Amendment applies to digital data; geofence and cell site location warrants require individualized probable cause under Carpenter.',
          'Algorithmic bias in hiring, credit scoring, and predictive sentencing violates Title VII and equal protection standards.',
          'Section 230 of the CDA shields internet platforms from publisher liability, but algorithmic recommendation curation faces constitutional scrutiny.',
          'Biometric privacy acts (such as Illinois BIPA) allow private lawsuits for unauthorized collection of facial recognition and fingerprint data.'
        ],
        sections: [
          {
            heading: '1. The Fourth Amendment in the Digital Sphere',
            paragraphs: [
              'In Carpenter v. United States (2018), the Supreme Court fundamentally curtailed the third-party doctrine by holding that individuals maintain a reasonable expectation of privacy in the physical location data gathered by cellular carriers.',
              'Today, civil rights attorneys frequently challenge "geofence warrants" and keyword search warrants as unconstitutional general warrants prohibited by the Fourth Amendment.'
            ]
          },
          {
            heading: '2. Algorithmic Discrimination and Disparate Impact',
            paragraphs: [
              'When automated recruitment software, facial recognition scans, or AI tenant screening tools systematically screen out applicants of color or disabled individuals, they violate federal civil rights laws under the disparate impact doctrine.',
              'The Department of Justice and Equal Employment Opportunity Commission (EEOC) have issued formal guidance confirming that algorithmic tools cannot shield employers from Title VII liability.'
            ]
          },
          {
            heading: '3. Asserting Violations Under 42 U.S.C. § 1983',
            paragraphs: [
              'When government entities or law enforcement agencies deploy unconstitutional surveillance, illegal wiretaps, or retaliatory online censorship, individuals can file civil rights lawsuits under 42 U.S.C. § 1983.',
              'Successful plaintiffs can secure declaratory relief, federal court injunctions halting the unlawful practice, monetary damages, and full recovery of attorney\'s fees under 42 U.S.C. § 1988.'
            ]
          }
        ],
        laws: [
          '42 U.S.C. § 1983 (Civil Action for Deprivation of Rights)',
          'Carpenter v. United States, 138 S. Ct. 2206 (2018)',
          'Katz v. United States, 389 U.S. 347 (1967)',
          'Illinois Biometric Information Privacy Act (740 ILCS 14/)',
          'Communications Decency Act § 230 (47 U.S.C. § 230)'
        ],
        checklist: [
          'Enable encrypted messaging protocols (Signal) and hardware security keys for sensitive communications.',
          'Review data access logs and request copies of personal algorithmic profiles under CCPA/GDPR where applicable.',
          'If targeted by an unconstitutional geofence warrant, motion for suppression of digital evidence through defense counsel.',
          'Document instances where biometric or algorithmic screening denied employment, housing, or financial services.',
          'Partner with civil rights litigators when institutional technology policies infringe upon constitutional guarantees.'
        ],
        warning: 'Digital evidence can be permanently altered or purged by servers within days. If you anticipate civil rights litigation, your attorney must immediately dispatch a formal Litigation Hold and Spoliation Notice.'
      },
      {
        id: 'supreme-court-2026',
        title: 'Supreme Court 2026 Term: Key Cases That Could Reshape American Law',
        lead: 'An in-depth analysis of the landmark jurisprudence emerging from the high court, examining administrative deregulation, Second Amendment limits, and digital First Amendment boundaries.',
        description: 'A preview of the most consequential Supreme Court cases set for argument this term, covering immigration, second amendment, and administrative law challenges.',
        pubDate: new Date(now - 8 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Supreme Court',
        icon: '🏛️',
        readTime: '6 min read',
        practiceArea: 'civil',
        link: '#',
        takeaways: [
          'The demise of Chevron deference under Loper Bright continues to shift regulatory interpretative power back to federal judges.',
          'The Bruen and Rahimi Second Amendment framework tests firearms regulations against historical analogues from 1791.',
          'State social media moderation laws face intense First Amendment scrutiny under the Moody v. NetChoice doctrine.',
          'Supreme Court precedent directly governs lower federal circuits and reshapes every area of commercial and criminal practice.'
        ],
        sections: [
          {
            heading: '1. The Post-Chevron Era: Loper Bright\'s Lasting Shockwaves',
            paragraphs: [
              'With the Supreme Court\'s ruling in Loper Bright Enterprises v. Raimondo overruling 40 years of Chevron deference, federal courts no longer defer to agency interpretations of ambiguous statutes. Instead, judges must exercise independent judgment.',
              'This paradigm shift has accelerated challenges across EPA environmental rules, FDA drug approval processes, FTC antitrust enforcement, and Department of Labor wage regulations.'
            ]
          },
          {
            heading: '2. The Second Amendment and The "Historical Tradition" Test',
            paragraphs: [
              'Following New York State Rifle & Pistol Association v. Bruen (2022) and United States v. Rahimi (2024), courts evaluating gun restrictions must determine whether the modern regulation is consistent with the nation\'s historical tradition of firearm regulation.',
              'Lower courts continue to grapple with circuit splits regarding age restrictions, public transit bans, and sensitive places doctrine.'
            ]
          },
          {
            heading: '3. Digital Speech and The First Amendment',
            paragraphs: [
              'As state legislatures attempt to mandate content moderation neutrality or prohibit political censorship on social networks, the Supreme Court has clarified that private internet platforms exercise editorial discretion protected by the First Amendment.',
              'The evolving boundary between private platform discretion and state-compelled speech remains one of the most volatile constitutional arenas of the decade.'
            ]
          }
        ],
        laws: [
          'U.S. Const. art. III, § 2',
          'Loper Bright Enterprises v. Raimondo, 144 S. Ct. 2244 (2024)',
          'N.Y. State Rifle & Pistol Ass\'n v. Bruen, 597 U.S. 1 (2022)',
          'Moody v. NetChoice, LLC, 144 S. Ct. 2383 (2024)',
          '28 U.S.C. § 1254 (Supreme Court Jurisdiction)'
        ],
        checklist: [
          'Audit commercial compliance policies for regulations vulnerable to administrative challenges.',
          'Track Supreme Court grants of certiorari on issues directly affecting your business sector.',
          'Review whether contract arbitration clauses incorporate Supreme Court Federal Arbitration Act precedents.',
          'Verify that appellate preservation strategies in federal district court anticipate Supreme Court review.',
          'Consult appellate counsel to evaluate potential amicus curiae briefing opportunities on critical cases.'
        ],
        warning: 'Never assume lower court precedents remain good law without checking Shepard\'s or KeyCite flags following each Supreme Court decision day.'
      },
      {
        id: 'immigration-updates',
        title: 'Immigration Law Updates: Visa Categories, DACA, and Border Policy 2026',
        lead: 'A comprehensive operational guide navigating employment-based visa backlogs, humanitarian relief, family unification criteria, and immigration court defense standards.',
        description: 'Current immigration law landscape including visa processing times, DACA program status, asylum procedures, and recent regulatory changes.',
        pubDate: new Date(now - 9 * 86400000).toISOString(),
        image: null,
        source: 'LegalAI Editorial',
        category: 'Legal News',
        icon: '📋',
        readTime: '5 min read',
        practiceArea: 'immigration',
        link: '#',
        takeaways: [
          'Employment-based green card processing (EB-1, EB-2 NIW, EB-3) requires strategic priority date tracking against the Visa Bulletin.',
          'DACA renewals continue for current beneficiaries, but initial applications remain enjoined under federal court rulings.',
          'Consular processing vs. Adjustment of Status (AOS) hinges critically on lawful entry and continuous immigration status.',
          'Notice to Appear (NTA) documents initiate removal proceedings before the Executive Office for Immigration Review (EOIR).'
        ],
        sections: [
          {
            heading: '1. Employment-Based Immigration & The National Interest Waiver',
            paragraphs: [
              'Attracting international talent in STEM and business, the EB-2 National Interest Waiver (NIW) allows qualifying foreign nationals to self-petition for a green card without an employer sponsor or labor certification (PERM).',
              'Under the Dhanasar standard, petitioners must prove: (1) Their proposed endeavor has substantial merit and national importance; (2) They are well positioned to advance the endeavor; and (3) On balance, it is beneficial to the United States to waive the job offer requirement.'
            ]
          },
          {
            heading: '2. Family-Based Petitions and Adjustment of Status',
            paragraphs: [
              'Immediate relatives of U.S. citizens (spouses, unmarried minor children, parents) enjoy uncapped visa availability without numerical quotas. Other categories (spouses of green card holders, adult children, siblings) are subject to multi-year backlogs.',
              'Adjustment of Status under INA § 245(a) allows beneficiaries who entered the United States lawfully through inspection to obtain permanent residence without leaving the country.'
            ]
          },
          {
            heading: '3. Defending Against Removal Proceedings',
            paragraphs: [
              'Receiving a Notice to Appear (Form I-862) is the initiation of formal deportation proceedings before an Immigration Judge. Key defenses include Asylum, Withholding of Removal, Convention Against Torture (CAT), Cancellation of Removal, and Voluntary Departure.',
              'Representation by an immigration attorney in removal proceedings dramatically increases the likelihood of relief from deportation compared to unrepresented respondents.'
            ]
          }
        ],
        laws: [
          'Immigration and Nationality Act (8 U.S.C. §§ 1101-1537)',
          'Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016)',
          'INA § 245(a) (Adjustment of Status)',
          '8 C.F.R. § 208 (Asylum and Withholding Procedures)',
          'Texas v. United States, 50 F.4th 498 (5th Cir. 2022) (DACA)'
        ],
        checklist: [
          'Check your priority date against the monthly Department of State Visa Bulletin.',
          'File DACA renewal applications 120 to 150 days prior to work authorization expiration.',
          'Maintain complete physical copies of all Form I-797 Notice of Actions and I-94 travel records.',
          'Never submit fraudulent credentials, forged stamps, or misrepresentations on USCIS applications.',
          'Consult with an immigration attorney immediately upon receiving any USCIS Request for Evidence (RFE) or NTA.'
        ],
        warning: 'Departing the United States after accruing more than 180 days of unlawful presence triggers a mandatory 3-year or 10-year statutory bar to re-entry under INA § 212(a)(9)(B). Never leave the country without legal clearance.'
      }
    ];
  }

  // ── SKELETON LOADERS ──
  function showSkeletons() {
    if (!articlesGrid) return;
    articlesGrid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      articlesGrid.innerHTML += `
        <div class="article-skeleton">
          <div class="sk-img"></div>
          <div class="sk-cat"></div>
          <div class="sk-title"></div>
          <div class="sk-desc"></div>
          <div class="sk-meta"></div>
        </div>`;
    }
    if (articlesEmpty) articlesEmpty.classList.add('hidden');
  }

  // ── FILTER ARTICLES ──
  function getFilteredArticles() {
    let filtered = [...articlesData];
    if (currentCategory && currentCategory !== 'All') {
      filtered = filtered.filter(a =>
        (a.category || '').toLowerCase().includes(currentCategory.toLowerCase())
      );
    }
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.source || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }

  // ── FORMAT TIME ──
  function timeAgo(isoString) {
    if (!isoString) return 'recently';
    const diff = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1)  return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24)  return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `${days}d ago`;
  }

  // ── RENDER ARTICLES GRID ──
  function renderArticles() {
    if (!articlesGrid) return;
    const filtered = getFilteredArticles();

    if (articlesCountText) {
      articlesCountText.textContent = `Showing ${filtered.length} article${filtered.length !== 1 ? 's' : ''}${currentCategory !== 'All' ? ` · ${currentCategory}` : ''}${currentSearch ? ` · "${currentSearch}"` : ''}`;
    }

    if (filtered.length === 0) {
      articlesGrid.innerHTML = '';
      if (articlesEmpty) articlesEmpty.classList.remove('hidden');
      return;
    }

    if (articlesEmpty) articlesEmpty.classList.add('hidden');

    articlesGrid.innerHTML = filtered.map((article, i) => {
      const imgHtml = article.image
        ? `<div class="article-card-img" style="background-image:url('${article.image}')"><div class="article-img-overlay"></div></div>`
        : `<div class="article-card-img no-img"><span>${article.icon || '📰'}</span></div>`;

      const catColor = getCategoryColor(article.category);

      return `
        <div class="article-card" role="button" tabindex="0" onclick="window.openArticleReader(${i})"
             style="animation-delay:${i * 0.04}s" data-article-index="${i}">
          ${imgHtml}
          <div class="article-card-body">
            <div class="article-card-cat" style="--cat-color:${catColor}">${article.icon || '📋'} ${escapeHtml(article.category || 'Legal')}</div>
            <h4 class="article-card-title">${escapeHtml(article.title)}</h4>
            <p class="article-card-desc">${escapeHtml(article.description || '')}</p>
            <div class="article-card-meta">
              <span class="article-card-source">${escapeHtml(article.source || 'LegalAI')}</span>
              <span class="article-card-time">${timeAgo(article.pubDate)}</span>
            </div>
          </div>
          <div class="article-card-arrow" title="Read Article">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>`;
    }).join('');
  }

  // ── CATEGORY COLOR MAP ──
  function getCategoryColor(category) {
    const map = {
      'supreme court': '#8b6914',
      'criminal law': '#c0392b',
      'family law': '#e74c3c',
      'employment law': '#2980b9',
      'corporate law': '#27ae60',
      'real estate law': '#8e44ad',
      'civil rights': '#d35400',
      'personal injury': '#e67e22',
      'contract law': '#16a085',
      'legal industry': '#7f8c8d',
      'legal news': '#b8956a',
      'case law': '#2c3e50',
    };
    const key = (category || '').toLowerCase();
    for (const [k, v] of Object.entries(map)) {
      if (key.includes(k)) return v;
    }
    return '#b8956a';
  }

  // ── ESCAPE HTML ──
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── DEBOUNCE ──
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }


  // ═══════════════════════════════════════════════════════════
  //  ARTICLE READER MODAL CONTROLLER
  // ═══════════════════════════════════════════════════════════

  let currentArticleIndex = 0;
  let isSpeaking = false;

  // DOM elements for Reader Modal
  const readerOverlay       = document.getElementById('article-reader-overlay');
  const readerModal         = document.getElementById('article-reader-modal');
  const readerScrollArea    = document.getElementById('reader-scroll-area');
  const readerProgressBar   = document.getElementById('reader-progress-bar');
  const readerBackBtn       = document.getElementById('reader-back-btn');
  const readerCloseBtn      = document.getElementById('reader-close-btn');
  const readerSpeechBtn     = document.getElementById('reader-speech-btn');
  const readerSpeechText    = document.getElementById('reader-speech-text');
  const readerBookmarkBtn   = document.getElementById('reader-bookmark-btn');
  const readerBookmarkText  = document.getElementById('reader-bookmark-text');
  const readerShareBtn      = document.getElementById('reader-share-btn');
  const readerAskAiBtn      = document.getElementById('reader-ask-ai-btn');

  const readerCatBadge      = document.getElementById('reader-cat-badge');
  const readerReadTime      = document.getElementById('reader-read-time');
  const readerSourceBadge   = document.getElementById('reader-source-badge');
  const readerPubDate       = document.getElementById('reader-pub-date');
  const readerTitle         = document.getElementById('reader-title');
  const readerLead          = document.getElementById('reader-lead');
  const readerTakeawaysCard = document.getElementById('reader-takeaways-card');
  const readerTakeawaysList = document.getElementById('reader-takeaways-list');
  const readerBodyContent   = document.getElementById('reader-body-content');
  const readerLawsChips     = document.getElementById('reader-laws-chips');
  const readerChecklist     = document.getElementById('reader-checklist');
  const readerWarningText   = document.getElementById('reader-warning-text');
  const readerLawyerCta     = document.getElementById('reader-lawyer-cta');
  const readerAiCta         = document.getElementById('reader-ai-cta');
  const readerExternalLink  = document.getElementById('reader-external-link');
  const readerPrevBtn       = document.getElementById('reader-prev-btn');
  const readerNextBtn       = document.getElementById('reader-next-btn');
  const readerPrevTitle     = document.getElementById('reader-prev-title');
  const readerNextTitle     = document.getElementById('reader-next-title');

  // Generate dynamic reader content for RSS items if rich content is not pre-defined
  function getEnrichedArticle(article) {
    if (article.sections && article.takeaways) {
      return article;
    }

    // Dynamic generation for live RSS articles
    const desc = article.description || '';
    const cat = article.category || 'Legal News';
    const source = article.source || 'Legal Publication';

    return {
      ...article,
      lead: desc,
      readTime: '3 min read',
      takeaways: [
        `Key development reported by ${source} regarding ${cat}.`,
        'Constitutional, statutory, and regulatory standards are actively evolving in this legal sector.',
        'Parties affected by this development should consult qualified legal counsel regarding compliance.',
        desc.length > 50 ? desc.substring(0, 140) + '...' : 'Review the complete source reporting for ongoing court updates.'
      ],
      sections: [
        {
          heading: `1. Case Background & Context: ${escapeHtml(article.title)}`,
          paragraphs: [
            desc,
            `This matter reflects key contemporary legal debates surrounding ${cat}. Legal practitioners across jurisdictions are closely monitoring the judicial and regulatory implications of these developments.`
          ]
        },
        {
          heading: '2. Legal Authority & Regulatory Framework',
          paragraphs: [
            `Matters within ${cat} typically involve compliance with federal and state statutory mandates, administrative guidance, and binding appellate precedents. Both individual rights and commercial obligations require precise legal analysis.`,
            'Judicial review in these cases balances statutory interpretation, due process protections, and administrative agency authority.'
          ]
        },
        {
          heading: '3. Key Considerations for Clients & Practitioners',
          paragraphs: [
            'Parties confronting similar legal challenges should maintain comprehensive records, review governing contractual agreements, and adhere to strict statutory filing deadlines.',
            'Early consultation with verified legal counsel ensures rights are preserved before court deadlines or administrative statutes of limitations expire.'
          ]
        }
      ],
      laws: [
        'U.S. Constitution',
        `${cat} Statutory Code`,
        'Federal Rules of Civil/Criminal Procedure',
        'State Administrative Regulations',
        `${source} Case Docket`
      ],
      checklist: [
        `Review documentation and records concerning this ${cat} topic.`,
        'Consult with legal counsel prior to signing waivers or legal agreements.',
        'Track relevant court dockets and upcoming appellate hearings.',
        'Formulate proactive compliance and liability prevention measures.'
      ],
      warning: `This summary of ${source} reporting is provided for informational and educational purposes only. Always consult a licensed attorney for case-specific representation.`
    };
  }

  // ── OPEN ARTICLE READER ──
  window.openArticleReader = function (indexOrId) {
    let article = null;
    if (typeof indexOrId === 'string' && window.worldNewsData) {
      const wMatch = window.worldNewsData.find(a => a.id === indexOrId);
      if (wMatch) {
        article = wMatch;
      }
    }

    if (!article) {
      const list = getFilteredArticles();
      if (list.length === 0) return;

      let targetIndex = 0;
      if (typeof indexOrId === 'number') {
        targetIndex = Math.max(0, Math.min(indexOrId, list.length - 1));
      } else if (typeof indexOrId === 'string') {
        const idx = list.findIndex(a => a.id === indexOrId);
        targetIndex = idx !== -1 ? idx : 0;
      }

      currentArticleIndex = targetIndex;
      const rawArticle = list[currentArticleIndex];
      if (!rawArticle) return;

      article = getEnrichedArticle(rawArticle);
    }

    // Stop previous audio
    stopSpeech();

    // Populate Reader
    const catColor = getCategoryColor(article.category);
    if (readerCatBadge) {
      readerCatBadge.textContent = `${article.icon || '⚖️'} ${article.category || 'Legal'}`;
      readerCatBadge.style.borderColor = catColor;
      readerCatBadge.style.color = catColor;
    }

    if (readerReadTime) readerReadTime.textContent = `⏱️ ${article.readTime || '4 min read'}`;
    if (readerSourceBadge) readerSourceBadge.textContent = article.source || 'LegalAI Editorial';
    if (readerPubDate) readerPubDate.textContent = timeAgo(article.pubDate);
    if (readerTitle) readerTitle.textContent = article.title;
    if (readerLead) readerLead.textContent = article.lead || article.description || '';

    // Takeaways
    if (readerTakeawaysList) {
      readerTakeawaysList.innerHTML = (article.takeaways || []).map(t =>
        `<li>${escapeHtml(t)}</li>`
      ).join('');
    }

    // Body Content
    if (readerBodyContent) {
      readerBodyContent.innerHTML = (article.sections || []).map(sec => `
        <h3>${escapeHtml(sec.heading)}</h3>
        ${sec.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      `).join('');
    }

    // Laws Chips
    if (readerLawsChips) {
      readerLawsChips.innerHTML = (article.laws || []).map(law =>
        `<span class="reader-law-chip">${escapeHtml(law)}</span>`
      ).join('');
    }

    // Checklist
    if (readerChecklist) {
      readerChecklist.innerHTML = (article.checklist || []).map((item, idx) => `
        <label class="reader-check-item" id="check-item-${idx}">
          <input type="checkbox" onchange="this.parentElement.classList.toggle('checked', this.checked)" />
          <span>${escapeHtml(item)}</span>
        </label>
      `).join('');
    }

    // Warning
    if (readerWarningText) {
      readerWarningText.textContent = article.warning || 'This article provides general informational guidance and is not a substitute for formal attorney-client representation.';
    }

    // External link
    if (readerExternalLink) {
      if (article.link && article.link !== '#') {
        readerExternalLink.href = article.link;
        readerExternalLink.classList.remove('hidden');
        readerExternalLink.textContent = `Read Full Article on ${article.source || 'Source'} ↗`;
      } else {
        readerExternalLink.classList.add('hidden');
      }
    }

    // Lawyer CTA
    if (readerLawyerCta) {
      const practiceAreaKey = article.practiceArea || 'criminal';
      readerLawyerCta.onclick = () => {
        closeArticleReader();
        closeArticlesModal();
        const specialtySelect = document.getElementById('specialty-select');
        if (specialtySelect) {
          const specialtyMap = {
            criminal: 'Criminal Law',
            family: 'Family Law',
            corporate: 'Corporate Law',
            civil: 'Civil Rights',
            employment: 'Employment Law',
            injury: 'Personal Injury',
            immigration: 'Immigration Law',
            ip: 'Intellectual Property',
            'real-estate': 'Corporate Law'
          };
          specialtySelect.value = specialtyMap[practiceAreaKey] || 'All Specialties';
          specialtySelect.dispatchEvent(new Event('change'));
        }
        const lawyersSection = document.getElementById('lawyers');
        if (lawyersSection) {
          lawyersSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    // AI Assistant CTA
    if (readerAiCta) {
      readerAiCta.onclick = () => {
        window.askAIAboutTopic(article.title);
      };
    }

    // Prev / Next Navigation
    if (readerPrevBtn) {
      readerPrevBtn.disabled = currentArticleIndex === 0;
      if (currentArticleIndex > 0) {
        readerPrevTitle.textContent = list[currentArticleIndex - 1].title;
      } else {
        readerPrevTitle.textContent = 'None';
      }
    }

    if (readerNextBtn) {
      readerNextBtn.disabled = currentArticleIndex >= list.length - 1;
      if (currentArticleIndex < list.length - 1) {
        readerNextTitle.textContent = list[currentArticleIndex + 1].title;
      } else {
        readerNextTitle.textContent = 'End of List';
      }
    }

    // Reset scroll & progress
    if (readerScrollArea) readerScrollArea.scrollTop = 0;
    if (readerProgressBar) readerProgressBar.style.width = '0%';

    // Check Bookmark State
    updateBookmarkButtonState(article.id || article.title);

    // Show Reader Overlay
    if (readerOverlay) {
      readerOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  // ── CLOSE ARTICLE READER ──
  window.closeArticleReader = function () {
    stopSpeech();
    if (readerOverlay) {
      readerOverlay.classList.add('hidden');
    }
    // If articles modal is not open, restore scroll
    if (!articlesOverlay || articlesOverlay.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  };

  // ── ASK AI ABOUT TOPIC ──
  window.askAIAboutTopic = function (topicTitle) {
    window.closeArticleReader();
    closeArticlesModal();

    if (typeof openAIDrawer === 'function') {
      openAIDrawer();
    } else {
      const drawer = document.getElementById('ai-drawer');
      if (drawer) drawer.classList.remove('hidden');
    }

    const aiInput = document.getElementById('ai-user-input');
    if (aiInput) {
      aiInput.value = `Can you explain the key legal implications and practical advice regarding: "${topicTitle}"?`;
      aiInput.focus();
    }

    showToast('💬 Ask LegalAI about this article', 'info');
  };

  // ── TEXT-TO-SPEECH (READ ALOUD) ──
  function toggleSpeech() {
    if (!('speechSynthesis' in window)) {
      showToast('⚠️ Speech synthesis is not supported on this browser', 'warning');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    const list = getFilteredArticles();
    const rawArticle = list[currentArticleIndex];
    if (!rawArticle) return;
    const article = getEnrichedArticle(rawArticle);

    const speechText = `${article.title}. ${article.lead || ''}. Key takeaways: ${(article.takeaways || []).join('. ')}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      if (readerSpeechBtn) {
        readerSpeechBtn.classList.add('active');
        if (readerSpeechText) readerSpeechText.textContent = 'Stop';
      }
    };

    utterance.onend = () => {
      stopSpeech();
    };

    utterance.onerror = () => {
      stopSpeech();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (readerSpeechBtn) {
      readerSpeechBtn.classList.remove('active');
      if (readerSpeechText) readerSpeechText.textContent = 'Listen';
    }
  }

  // ── BOOKMARK SYSTEM ──
  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('legalai_bookmarks') || '[]');
    } catch (e) {
      return [];
    }
  }

  function toggleBookmark() {
    const list = getFilteredArticles();
    const article = list[currentArticleIndex];
    if (!article) return;

    const id = article.id || article.title;
    let bookmarks = getBookmarks();
    const index = bookmarks.indexOf(id);

    if (index === -1) {
      bookmarks.push(id);
      localStorage.setItem('legalai_bookmarks', JSON.stringify(bookmarks));
      showToast('🔖 Article saved to bookmarks', 'success');
    } else {
      bookmarks.splice(index, 1);
      localStorage.setItem('legalai_bookmarks', JSON.stringify(bookmarks));
      showToast('Bookmark removed', 'info');
    }
    updateBookmarkButtonState(id);
  }

  function updateBookmarkButtonState(id) {
    const bookmarks = getBookmarks();
    const isSaved = bookmarks.includes(id);
    if (readerBookmarkBtn) {
      readerBookmarkBtn.classList.toggle('active', isSaved);
      if (readerBookmarkText) {
        readerBookmarkText.textContent = isSaved ? 'Saved' : 'Save';
      }
    }
  }

  // ── SHARE / COPY LINK ──
  function shareArticle() {
    const list = getFilteredArticles();
    const article = list[currentArticleIndex];
    if (!article) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}#article-${article.id || currentArticleIndex}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('📋 Article link copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Article: ' + article.title, 'info');
      });
    } else {
      showToast('Article: ' + article.title, 'info');
    }
  }

  // ── READING PROGRESS TRACKER ──
  if (readerScrollArea && readerProgressBar) {
    readerScrollArea.addEventListener('scroll', () => {
      const total = readerScrollArea.scrollHeight - readerScrollArea.clientHeight;
      if (total <= 0) {
        readerProgressBar.style.width = '100%';
        return;
      }
      const pct = (readerScrollArea.scrollTop / total) * 100;
      readerProgressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    });
  }

  // ── EVENT LISTENERS ──
  if (articlesCloseBtn) articlesCloseBtn.addEventListener('click', closeArticlesModal);
  if (articlesOverlay) {
    articlesOverlay.addEventListener('click', (e) => {
      if (e.target === articlesOverlay) closeArticlesModal();
    });
  }

  if (readerBackBtn) readerBackBtn.addEventListener('click', window.closeArticleReader);
  if (readerCloseBtn) readerCloseBtn.addEventListener('click', window.closeArticleReader);
  if (readerOverlay) {
    readerOverlay.addEventListener('click', (e) => {
      if (e.target === readerOverlay) window.closeArticleReader();
    });
  }

  if (readerSpeechBtn) readerSpeechBtn.addEventListener('click', toggleSpeech);
  if (readerBookmarkBtn) readerBookmarkBtn.addEventListener('click', toggleBookmark);
  if (readerShareBtn) readerShareBtn.addEventListener('click', shareArticle);
  if (readerAskAiBtn) {
    readerAskAiBtn.addEventListener('click', () => {
      const list = getFilteredArticles();
      if (list[currentArticleIndex]) {
        window.askAIAboutTopic(list[currentArticleIndex].title);
      }
    });
  }

  if (readerPrevBtn) {
    readerPrevBtn.addEventListener('click', () => {
      if (currentArticleIndex > 0) window.openArticleReader(currentArticleIndex - 1);
    });
  }

  if (readerNextBtn) {
    readerNextBtn.addEventListener('click', () => {
      const list = getFilteredArticles();
      if (currentArticleIndex < list.length - 1) window.openArticleReader(currentArticleIndex + 1);
    });
  }

  if (articlesRefreshBtn) {
    articlesRefreshBtn.addEventListener('click', () => {
      articlesData = []; // force refetch
      fetchArticles(false);
    });
  }

  // Search input with debounce
  if (articlesSearchInput) {
    const debouncedSearch = debounce(() => {
      currentSearch = articlesSearchInput.value.trim();
      if (articlesSearchClear) {
        articlesSearchClear.classList.toggle('hidden', !currentSearch);
      }
      renderArticles();
    }, 300);

    articlesSearchInput.addEventListener('input', debouncedSearch);
  }

  if (articlesSearchClear) {
    articlesSearchClear.addEventListener('click', () => {
      articlesSearchInput.value = '';
      currentSearch = '';
      articlesSearchClear.classList.add('hidden');
      renderArticles();
    });
  }

  // Category filter pills
  articlesPills.forEach(pill => {
    pill.addEventListener('click', () => {
      articlesPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category || 'All';
      renderArticles();
    });
  });

  // Global Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (readerOverlay && !readerOverlay.classList.contains('hidden')) {
        window.closeArticleReader();
        return;
      }
      if (articlesOverlay && !articlesOverlay.classList.contains('hidden')) {
        closeArticlesModal();
      }
    } else if (readerOverlay && !readerOverlay.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft' && currentArticleIndex > 0) {
        window.openArticleReader(currentArticleIndex - 1);
      } else if (e.key === 'ArrowRight') {
        const list = getFilteredArticles();
        if (currentArticleIndex < list.length - 1) {
          window.openArticleReader(currentArticleIndex + 1);
        }
      }
    }
  });

})();

// ================================================================
// WORLD LEGAL NEWS & INTERNATIONAL LAW MODULE
// ================================================================

const WORLD_NEWS_API = `${SERVER_ORIGIN}/api/articles/world-news`;

let worldNewsData = [];
window.worldNewsData = worldNewsData;
let worldNewsFilters = {
  region: 'All',
  search: ''
};

// DOM References
const worldNewsGrid        = document.getElementById('world-news-grid');
const worldFeaturedWrapper = document.getElementById('world-featured-wrapper');
const worldSearchInput     = document.getElementById('world-search-input');
const worldSearchClear     = document.getElementById('world-search-clear');
const worldRefreshBtn      = document.getElementById('world-refresh-btn');
const worldFeedStatus      = document.getElementById('world-feed-status');
const worldRegionPills     = document.querySelectorAll('.world-pill-chip');
const navWorldNews         = document.getElementById('nav-world-news');

function worldNewsCardHTML(a) {
  const flag = a.flag || '🌐';
  const lawsChips = (a.laws || []).slice(0, 2).map(law => 
    `<span class="world-law-tag">${escapeHtml(law)}</span>`
  ).join('');

  return `
    <article class="world-news-card" id="world-card-${a.id}">
      <div class="world-card-top">
        <div class="world-card-meta">
          <span class="world-region-badge">${flag} ${escapeHtml(a.region)}</span>
          <span class="world-cat-badge">${escapeHtml(a.category)}</span>
        </div>
        <span class="world-card-time">⏱️ ${a.readTime || '4 min'}</span>
      </div>

      <h3 class="world-card-title" onclick="window.openArticleReader('${a.id}')">${escapeHtml(a.title)}</h3>

      <p class="world-card-desc">${escapeHtml(a.description || a.lead || '')}</p>

      ${lawsChips ? `<div class="world-laws-row">${lawsChips}</div>` : ''}

      <div class="world-card-footer">
        <div class="world-source-info">
          <span class="world-source-icon">🏛️</span>
          <span class="world-source-name">${escapeHtml(a.source)}</span>
        </div>
        <div class="world-card-actions">
          <button class="world-read-btn" onclick="window.openArticleReader('${a.id}')">
            <span>Read Dispatch</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="world-ai-btn" onclick="window.askAIAboutWorldNews('${escapeHtml(a.title).replace(/'/g, "\\'")}', '${escapeHtml(a.description || a.lead || '').replace(/'/g, "\\'")}')" title="Analyze with LegalAI">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedWorldNews(lead) {
  if (!worldFeaturedWrapper) return;
  if (!lead) {
    worldFeaturedWrapper.innerHTML = '';
    return;
  }

  const flag = lead.flag || '🌐';
  const lawsChips = (lead.laws || []).map(law => 
    `<span class="world-law-tag highlight">${escapeHtml(law)}</span>`
  ).join('');

  worldFeaturedWrapper.innerHTML = `
    <div class="world-featured-card">
      <div class="world-featured-badge-row">
        <span class="featured-lead-tag">🌟 TOP GLOBAL DISPATCH</span>
        <span class="world-region-badge large">${flag} ${escapeHtml(lead.region)}</span>
        <span class="world-cat-badge large">${escapeHtml(lead.category)}</span>
        <span class="world-timestamp">⏱️ ${lead.readTime || '5 min read'} · Updated Recently</span>
      </div>

      <h2 class="world-featured-title" onclick="window.openArticleReader('${lead.id}')">
        ${escapeHtml(lead.title)}
      </h2>

      <p class="world-featured-lead">
        ${escapeHtml(lead.lead || lead.description)}
      </p>

      ${lawsChips ? `
        <div class="world-featured-laws">
          <span class="laws-label">Statutes & Treaties Cited:</span>
          ${lawsChips}
        </div>
      ` : ''}

      <div class="world-featured-footer">
        <div class="world-featured-source">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>Jurisdictional Authority: <strong>${escapeHtml(lead.source)}</strong></span>
        </div>
        <div class="world-featured-btns">
          <button class="btn-read-featured" onclick="window.openArticleReader('${lead.id}')">
            <span>Read Full Legal Analysis</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="btn-ai-featured" onclick="window.askAIAboutWorldNews('${escapeHtml(lead.title).replace(/'/g, "\\'")}', '${escapeHtml(lead.lead || lead.description || '').replace(/'/g, "\\'")}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
            <span>Analyze with LegalAI</span>
          </button>
          ${lead.link && lead.link !== '#' ? `
            <a href="${lead.link}" target="_blank" rel="noopener noreferrer" class="btn-official-source" title="Open Official Tribunal / Authority Registry">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Official Registry ↗</span>
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderWorldNews(articles) {
  if (!worldNewsGrid) return;

  if (!articles || articles.length === 0) {
    if (worldFeaturedWrapper) worldFeaturedWrapper.innerHTML = '';
    worldNewsGrid.innerHTML = `
      <div class="world-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m21 21-4.35-4.35"/></svg>
        <h4>No World Legal Dispatches Found</h4>
        <p>Try clearing your search query or selecting a different regional filter.</p>
      </div>
    `;
    return;
  }

  // First article is showcased as lead featured story if viewing All or without search
  const isFiltering = worldNewsFilters.search || (worldNewsFilters.region !== 'All');
  if (!isFiltering && articles.length > 1) {
    renderFeaturedWorldNews(articles[0]);
    worldNewsGrid.innerHTML = articles.slice(1).map(worldNewsCardHTML).join('');
  } else {
    if (worldFeaturedWrapper) worldFeaturedWrapper.innerHTML = '';
    worldNewsGrid.innerHTML = articles.map(worldNewsCardHTML).join('');
  }
}

async function fetchAndRenderWorldNews() {
  if (worldNewsGrid) {
    worldNewsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
        <div class="skeleton-line" style="height: 180px; border-radius: 16px; margin-bottom: 20px;"></div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          <div class="skeleton-line" style="height: 220px; border-radius: 14px;"></div>
          <div class="skeleton-line" style="height: 220px; border-radius: 14px;"></div>
          <div class="skeleton-line" style="height: 220px; border-radius: 14px;"></div>
        </div>
      </div>
    `;
  }

  try {
    const params = new URLSearchParams();
    if (worldNewsFilters.region && worldNewsFilters.region !== 'All') {
      params.set('region', worldNewsFilters.region);
    }
    if (worldNewsFilters.search) {
      params.set('search', worldNewsFilters.search);
    }

    const resp = await fetch(`${WORLD_NEWS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    worldNewsData = data.articles || [];
    window.worldNewsData = worldNewsData;
    renderWorldNews(worldNewsData);

    if (worldFeedStatus) {
      worldFeedStatus.textContent = `Global Wire Active (${worldNewsData.length} Dispatches)`;
    }
  } catch (err) {
    console.error('Fetch world news error:', err);
    if (worldFeedStatus) worldFeedStatus.textContent = 'Wire Offline';
    if (worldNewsGrid) {
      worldNewsGrid.innerHTML = `
        <div class="world-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h4>Could Not Connect to Global Legal Wire</h4>
          <p>Verify server is running on port 5000 and try refreshing.</p>
        </div>
      `;
    }
  }
}

window.askAIAboutWorldNews = function(title, summary) {
  openAIDrawer();
  const input = document.getElementById('ai-drawer-input');
  if (input) {
    input.value = `Explain the international legal implications, jurisdictional reach, and compliance requirements of this global development: "${title}". Summary: ${summary || ''}`;
    input.focus();
  }
};

// Event Listeners for World News
if (worldSearchInput) {
  worldSearchInput.addEventListener('input', debounce(() => {
    worldNewsFilters.search = worldSearchInput.value.trim();
    if (worldSearchClear) {
      worldSearchClear.classList.toggle('hidden', !worldNewsFilters.search);
    }
    fetchAndRenderWorldNews();
  }, 300));
}

if (worldSearchClear) {
  worldSearchClear.addEventListener('click', () => {
    worldNewsFilters.search = '';
    if (worldSearchInput) worldSearchInput.value = '';
    worldSearchClear.classList.add('hidden');
    fetchAndRenderWorldNews();
  });
}

if (worldRefreshBtn) {
  worldRefreshBtn.addEventListener('click', () => {
    fetchAndRenderWorldNews();
    showToast('Global Legal Wire refreshed', 'info');
  });
}

worldRegionPills.forEach(pill => {
  pill.addEventListener('click', () => {
    worldRegionPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    worldNewsFilters.region = pill.dataset.region || 'All';
    fetchAndRenderWorldNews();
  });
});

if (navWorldNews) {
  navWorldNews.addEventListener('click', (e) => {
    e.preventDefault();
    const section = document.getElementById('world-news');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}


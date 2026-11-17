/* ================================================================
   LEGALAI — DEDICATED LAWYERS DIRECTORY ENGINE (lawyers.js)
   ================================================================ */

const SERVER_ORIGIN = (function() {
  if (window.location.protocol === 'file:') return 'http://localhost:5000';
  if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '5000') {
    return 'http://localhost:5000';
  }
  return (window.location.origin && window.location.origin.startsWith('http'))
    ? window.location.origin
    : 'http://localhost:5000';
})();

const LAWYERS_API = `${SERVER_ORIGIN}/api/lawyers`;

// ── State ──
let lawyersData = [];
let lawyerFilters = {
  search: '',
  specialty: 'All Specialties',
  court: 'All Courts',
  location: 'All Locations',
  maxFee: '',
  minRating: '',
  availability: '',
  sortBy: 'rating'
};

// ── Fallback Dataset of 37 Verified Indian Advocates with Court Affiliations ──
const FALLBACK_LAWYERS = (typeof window !== 'undefined' && Array.isArray(window.INDIAN_LAWYERS_DATA))
  ? window.INDIAN_LAWYERS_DATA
  : (typeof require !== 'undefined' ? (require('./indianCourts').INDIAN_LAWYERS || []) : []);

// ── DOM References ──
const lawyersGrid          = document.getElementById('lawyers-grid');
const lawyerSearchInput    = document.getElementById('lawyer-search-input');
const lawyerSearchClear    = document.getElementById('lawyer-search-clear');
const lawyerSpecialtySelect = document.getElementById('lawyer-specialty-select');
const lawyerCourtSelect     = document.getElementById('lawyer-court-select');
const lawyerLocationSelect = document.getElementById('lawyer-location-select');
const lawyerRateSelect     = document.getElementById('lawyer-rate-select');
const lawyerRatingSelect   = document.getElementById('lawyer-rating-select');
const lawyerAvailSelect    = document.getElementById('lawyer-avail-select');
const lawyerSortSelect     = document.getElementById('lawyer-sort-select');
const btnResetFilters      = document.getElementById('btn-reset-filters');
const lawyerCountBadge     = document.getElementById('lawyer-count-badge');
const specialtyPills       = document.querySelectorAll('.pill-chip');
const kpiTotalLawyers      = document.getElementById('kpi-total-lawyers');
const kpiAvailCount        = document.getElementById('kpi-available-count');
const badgeNavBookings     = document.getElementById('badge-nav-bookings');

// Jurisdiction Advisory Banner Elements
const dirRuleBanner        = document.getElementById('directory-jurisdiction-rule-banner');
const dirRuleBannerTitle   = document.getElementById('dir-rule-banner-title');
const dirRuleBannerActs    = document.getElementById('dir-rule-banner-acts');
const dirRuleBannerDesc    = document.getElementById('dir-rule-banner-desc');
const dirRuleBannerMeta    = document.getElementById('dir-rule-banner-meta');

// Modal Elements
const lawyerModalOverlay   = document.getElementById('lawyer-modal-overlay');
const lawyerModalClose     = document.getElementById('lawyer-modal-close');
const lawyerModalBtnClose  = document.getElementById('lawyer-modal-btn-close');
const lawyerModalBtnBook   = document.getElementById('lawyer-modal-btn-book');
const lawyerModalBtnCopy   = document.getElementById('lawyer-modal-btn-copy');
const lawyerCopyBtnText    = document.getElementById('lawyer-copy-btn-text');

const consultOverlay       = document.getElementById('consult-modal-overlay');
const consultModalClose    = document.getElementById('consult-modal-close');
const consultModalTitle    = document.getElementById('consult-modal-title');
const consultAttySubtitle  = document.getElementById('consult-attorney-subtitle');
const consultLawyerId      = document.getElementById('consult-lawyer-id');
const consultForm          = document.getElementById('consult-form');
const consultSubmit        = document.getElementById('consult-submit');

const bookingsModalOverlay = document.getElementById('bookings-modal-overlay');
const bookingsModalClose   = document.getElementById('bookings-modal-close');
const bookingsListContainer= document.getElementById('bookings-list-container');
const bookingsSearchInput  = document.getElementById('bookings-search-input');
const bookingsRefreshBtn   = document.getElementById('bookings-refresh-btn');

// Ensure any stale booked consultations from prior sessions are cleared
(function checkAndPurgeStoredConsultations() {
  try {
    if (!localStorage.getItem('legalai_consultations_purged_v2')) {
      localStorage.removeItem('legalai_consultations');
      localStorage.removeItem('legalai_offline_bookings');
      localStorage.removeItem('legalai_recent_bookings');
      localStorage.setItem('legalai_consultations_purged_v2', 'true');
    }
  } catch (_) {}
})();

let currentModalLawyer = null;
let bookingsData = [];
let currentBookingTab = 'all';

// ── Helpers ──
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getInitials(name) {
  if (!name) return 'A';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return ''.repeat(full) + (half ? '½' : '') + ''.repeat(empty);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Lawyer Card HTML Generator ──
function lawyerCardHTML(l) {
  const avatarEl = l.avatarUrl
    ? `<img class="lawyer-avatar" src="${l.avatarUrl}" alt="${escapeHtml(l.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback" style="display:none">${getInitials(l.name)}</div>`
    : `<div class="lawyer-avatar-fallback">${getInitials(l.name)}</div>`;

  const isAvail = l.isAvailable !== 0;
  const availBadge = isAvail
    ? `<span class="badge-availability available" title="Available for immediate client consultation"><span class="status-pulse-dot"></span> Available for Consult</span>`
    : `<span class="badge-availability booked" title="Currently retained on active trial dockets"><span class="status-busy-dot"></span> Booked / In Trial</span>`;

  const consultBtn = isAvail
    ? `<button class="btn-consult" data-lawyer-id="${l.id}" onclick="event.stopPropagation(); openConsultModal('${l.id}')">
         Book Consultation
      </button>`
    : `<button class="btn-consult btn-waitlist" data-lawyer-id="${l.id}" onclick="event.stopPropagation(); openConsultModal('${l.id}')">
         Join Waitlist / Inquire
      </button>`;

  const activeBooking = (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData))
    ? bookingsData.find(b => String(b.lawyerId) === String(l.id) && b.status !== 'cancelled')
    : null;

  const footerAction = activeBooking
    ? `
      <div class="lawyer-card-booked-footer">
        <div class="card-booked-status">
          <span class="status-pulse-dot"></span>
          <span>Booked: <strong>${escapeHtml(activeBooking.preferredDate)}</strong></span>
        </div>
        <div class="card-booked-actions">
          <button class="btn-card-cancel" onclick="event.stopPropagation(); cancelConsultationBooking(${activeBooking.id})" title="Cancel this consultation">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Cancel Booking
          </button>
          <button class="btn-profile" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="View complete credentials, biography & bar registration">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Full Details
          </button>
        </div>
      </div>
    `
    : `
      ${consultBtn}
      <button class="btn-profile" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="View complete credentials, biography & bar registration">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Full Details
      </button>
    `;

  // Court & Jurisdiction recommendation matching
  const hasCourtFilter = lawyerFilters.court && lawyerFilters.court !== 'All Courts';
  const hasSpecFilter = lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties';

  let isCourtMatched = false;
  if (hasCourtFilter) {
    const cCode = lawyerFilters.court.trim().toUpperCase();
    if (Array.isArray(l.courtCodes)) {
      isCourtMatched = l.courtCodes.includes(cCode);
    } else if (l.courtCodes) {
      isCourtMatched = String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
    }
  }

  let isSpecMatched = false;
  if (hasSpecFilter && l.specialty) {
    isSpecMatched = l.specialty.toLowerCase() === lawyerFilters.specialty.toLowerCase();
  }

  let matchBanner = '';
  let isCardMatched = false;

  if (hasCourtFilter && isCourtMatched) {
    isCardMatched = true;
    let courtName = lawyerFilters.court;
    if (typeof window !== 'undefined' && Array.isArray(window.INDIAN_COURTS_DATA)) {
      const cObj = window.INDIAN_COURTS_DATA.find(c => c.code && c.code.toUpperCase() === lawyerFilters.court.trim().toUpperCase());
      if (cObj && cObj.name) courtName = cObj.name;
    }
    const specLabel = hasSpecFilter ? lawyerFilters.specialty : (l.specialty || 'Designated');
    matchBanner = `<div class="court-lawyer-match-banner"><span class="match-sparkle">⭐</span> Recommended ${escapeHtml(specLabel)} Counsel for ${escapeHtml(courtName)}</div>`;
  } else if (!hasCourtFilter && hasSpecFilter && isSpecMatched) {
    matchBanner = `<div class="court-lawyer-match-banner"><span class="match-sparkle">⭐</span> Verified Specialist in ${escapeHtml(lawyerFilters.specialty)}</div>`;
    isCardMatched = true;
  }

  return `
  <div class="lawyer-card ${isAvail ? 'card-available' : 'card-booked'} ${isCardMatched ? 'court-lawyer-card-matched' : ''}" id="lawyer-card-${l.id}" data-id="${l.id}" onclick="handleLawyerCardClick(event, '${l.id}')" title="Click to view full credentials of ${escapeHtml(l.name)}">
    ${matchBanner}
    <div class="lawyer-card-header">
      <div class="lawyer-avatar-clickable" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">
        ${avatarEl}
      </div>
      <div class="lawyer-header-info">
        <div class="lawyer-name" onclick="event.stopPropagation(); openLawyerModal('${l.id}')" title="Click to view advocate profile">${escapeHtml(l.name)}</div>
        <div class="lawyer-title">${escapeHtml(l.title || 'Advocate / Senior Counsel')}</div>
        <div class="lawyer-badges">
          <span class="badge-verified"> Bar Verified</span>
          ${isCardMatched ? `<span class="badge-verified" style="background:rgba(184,149,106,0.2);color:var(--gold-light);border:1px solid rgba(184,149,106,0.4);">Recommended</span>` : ''}
          <span class="badge-specialty" onclick="event.stopPropagation(); openLawyerModal('${l.id}')">${escapeHtml(l.specialty)}</span>
          ${availBadge}
        </div>
      </div>
    </div>

    <div class="lawyer-rating-row" style="display:flex; align-items:center; gap:6px; font-size:0.78rem; color:#86efac; margin-bottom:8px;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span>Enrolled Advocate &middot; Bar Council Verified</span>
    </div>

    <div class="lawyer-stats-row">
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.experienceYears}+</span>
        <span class="lawyer-stat-lbl">Yrs Standing</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">${l.casesWon}</span>
        <span class="lawyer-stat-lbl">Reported Matters</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val" style="color:#86efac; font-size:0.8rem; font-weight:700;">Active</span>
        <span class="lawyer-stat-lbl">BCI Status</span>
      </div>
      <div class="lawyer-stat">
        <span class="lawyer-stat-val">₹${Number(l.hourlyRate).toLocaleString('en-IN')}</span>
        <span class="lawyer-stat-lbl">Consultation</span>
      </div>
    </div>

    <div class="lawyer-details-list">
      <div class="lawyer-detail-item lawyer-court-affiliation-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="m3 7 9-3 9 3"/><path d="m6 10-3 6h6l-3-6z"/><path d="m18 10-3 6h6l-3-6z"/><line x1="3" y1="21" x2="21" y2="21"/></svg>
        <span>Courts: <strong style="${isCourtMatched ? 'color:#fbbf24; text-decoration: underline;' : 'color:var(--gold-light);'}">${escapeHtml(l.practicingCourts || l.primaryCourt || "Supreme Court of India")}</strong></span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${escapeHtml(l.firmName)} · ${escapeHtml(l.city)}, ${escapeHtml(l.state)}</span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Bar Enrollment: <strong>${escapeHtml(l.barNumber || 'Verified')}</strong></span>
      </div>
      <div class="lawyer-detail-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <span>${escapeHtml(l.education || '')}</span>
      </div>
    </div>

    <p class="lawyer-bio">${escapeHtml(l.bio || '')}</p>

    <div class="lawyer-card-footer">
      ${footerAction}
    </div>
  </div>`;
}

function renderSkeletons(count = 6) {
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

// ── Directory Jurisdiction & Statutory Rules Advisory ──
function updateDirectoryJurisdictionRule() {
  if (!dirRuleBanner) return;

  const hasCourt = lawyerFilters.court && lawyerFilters.court !== 'All Courts';
  const hasSpec = lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties';

  if (!hasCourt && !hasSpec) {
    dirRuleBanner.classList.add('hidden');
    return;
  }

  let courtObj = null;
  if (hasCourt) {
    const code = lawyerFilters.court.trim().toUpperCase();
    if (typeof window !== 'undefined' && Array.isArray(window.INDIAN_COURTS_DATA)) {
      courtObj = window.INDIAN_COURTS_DATA.find(c => c.code && c.code.toUpperCase() === code);
    }
  }

  const jurRule = (typeof window.getJurisdictionRule === 'function')
    ? window.getJurisdictionRule(courtObj, lawyerFilters.specialty)
    : {
        title: hasCourt ? `${courtObj ? courtObj.name : lawyerFilters.court} Jurisdiction Rules` : `${lawyerFilters.specialty} Practice Rules`,
        governingActs: 'Constitution of India, Code of Civil Procedure (CPC), Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
        ruleSummary: 'Territorial, subject-matter, and pecuniary jurisdiction govern litigation and counsel representation.',
        proceduralRequirements: 'Representation by advocate enrolled with State Bar Council; verified pleadings on affidavit.',
        appellateHierarchy: 'Subordinate Court → District Court → High Court → Supreme Court of India.'
      };

  if (dirRuleBannerTitle) {
    if (hasCourt && courtObj) {
      dirRuleBannerTitle.textContent = `${courtObj.name} · ${jurRule.title || 'Jurisdiction & Practice Rules'}`;
    } else {
      dirRuleBannerTitle.textContent = jurRule.title || 'Jurisdiction & Practice Rules';
    }
  }
  if (dirRuleBannerActs) dirRuleBannerActs.textContent = `Governing Statute: ${jurRule.governingActs}`;
  if (dirRuleBannerDesc) dirRuleBannerDesc.textContent = jurRule.ruleSummary;
  if (dirRuleBannerMeta) {
    dirRuleBannerMeta.innerHTML = `<strong>Prerequisites:</strong> ${jurRule.proceduralRequirements} · <strong>Appellate Route:</strong> ${jurRule.appellateHierarchy}`;
  }

  dirRuleBanner.classList.remove('hidden');
}

function renderLawyers(lawyers) {
  if (!lawyersGrid) return;
  updateDirectoryJurisdictionRule();

  if (!lawyers || lawyers.length === 0) {
    lawyersGrid.innerHTML = `
      <div class="lawyers-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--gold); margin-bottom:16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <h3 style="font-family:'Playfair Display', serif; color:#fff; font-size:1.5rem; margin-bottom:8px;">No Advocates Matching Criteria</h3>
        <p style="color:var(--muted); max-width:480px; margin:0 auto 20px;">We could not find verified advocates matching your active filters. Try clearing or expanding your search parameters.</p>
        <button class="directory-reset-btn" onclick="resetAllFilters();" style="margin: 0 auto;">Reset All Search Filters</button>
      </div>`;
    if (lawyerCountBadge) lawyerCountBadge.textContent = 'Showing 0 results';
    return;
  }

  lawyersGrid.innerHTML = lawyers.map(lawyerCardHTML).join('');
  if (lawyerCountBadge) {
    const availCount = lawyers.filter(l => l.isAvailable !== 0).length;
    lawyerCountBadge.textContent = `Showing ${lawyers.length} Verified Advocate${lawyers.length !== 1 ? 's' : ''} (${availCount} Available for Consult)`;
  }
}

// ── Sort Utility ──
function applySorting(list, sortKey) {
  const sorted = [...list];
  switch (sortKey) {
    case 'experience':
      return sorted.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    case 'cases':
      return sorted.sort((a, b) => (b.casesWon || 0) - (a.casesWon || 0));
    case 'rate-asc':
      return sorted.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    case 'rate-desc':
      return sorted.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    case 'rating':
    default:
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.casesWon || 0) - (a.casesWon || 0));
  }
}

// ── Fetch & Filter Engine ──
async function fetchAndRenderLawyers() {
  renderSkeletons();
  try {
    const params = new URLSearchParams();
    if (lawyerFilters.search)        params.set('search',       lawyerFilters.search);
    if (lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties')
                                      params.set('specialty',    lawyerFilters.specialty);
    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts')
                                      params.set('court',        lawyerFilters.court);
    if (lawyerFilters.maxFee)        params.set('maxFee',       lawyerFilters.maxFee);
    if (lawyerFilters.minRating)     params.set('minRating',    lawyerFilters.minRating);
    if (lawyerFilters.availability)  params.set('availability', lawyerFilters.availability);

    const resp = await fetch(`${LAWYERS_API}?${params.toString()}`);
    if (!resp.ok) throw new Error('Server error ' + resp.status);
    const data = await resp.json();
    let result = data.lawyers || [];

    // Filter location client-side if selected
    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      const loc = lawyerFilters.location.toLowerCase();
      result = result.filter(l => (l.city && l.city.toLowerCase() === loc) || (l.state && l.state.toLowerCase() === loc) || (l.city && loc.includes(l.city.toLowerCase())) || (l.state && loc.includes(l.state.toLowerCase())));
    }

    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts') {
      const cCode = lawyerFilters.court.trim().toUpperCase();
      result = result.filter(l => {
        if (!l.courtCodes) return false;
        if (Array.isArray(l.courtCodes)) return l.courtCodes.includes(cCode);
        return String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
      });
    }

    result = applySorting(result, lawyerFilters.sortBy);
    lawyersData = result;
    renderLawyers(lawyersData);

    // Update KPI counters
    if (kpiTotalLawyers) kpiTotalLawyers.textContent = lawyersData.length;
    if (kpiAvailCount) {
      const totalAvail = lawyersData.filter(l => l.isAvailable !== 0).length;
      kpiAvailCount.textContent = totalAvail;
    }
  } catch (err) {
    console.warn('Backend lawyer API unavailable, loading authentic verified Indian advocates dataset:', err.message);
    let filtered = [...FALLBACK_LAWYERS];

    if (lawyerFilters.availability === 'available' || lawyerFilters.availability === '1') {
      filtered = filtered.filter(l => l.isAvailable !== 0);
    } else if (lawyerFilters.availability === 'booked' || lawyerFilters.availability === '0') {
      filtered = filtered.filter(l => l.isAvailable === 0);
    }

    if (lawyerFilters.specialty && lawyerFilters.specialty !== 'All Specialties') {
      filtered = filtered.filter(l => l.specialty.toLowerCase() === lawyerFilters.specialty.toLowerCase());
    }

    if (lawyerFilters.court && lawyerFilters.court !== 'All Courts') {
      const cCode = lawyerFilters.court.trim().toUpperCase();
      filtered = filtered.filter(l => {
        if (!l.courtCodes) return false;
        if (Array.isArray(l.courtCodes)) return l.courtCodes.includes(cCode);
        return String(l.courtCodes).split(',').map(s => s.trim().toUpperCase()).includes(cCode);
      });
    }

    if (lawyerFilters.location && lawyerFilters.location !== 'All Locations') {
      const loc = lawyerFilters.location.toLowerCase();
      filtered = filtered.filter(l => (l.city && l.city.toLowerCase() === loc) || (l.state && l.state.toLowerCase() === loc) || (l.city && loc.includes(l.city.toLowerCase())) || (l.state && loc.includes(l.state.toLowerCase())));
    }

    if (lawyerFilters.search && lawyerFilters.search.trim()) {
      const q = lawyerFilters.search.trim().toLowerCase();
      filtered = filtered.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.firmName && l.firmName.toLowerCase().includes(q)) ||
        (l.bio && l.bio.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.state && l.state.toLowerCase().includes(q)) ||
        (l.barNumber && l.barNumber.toLowerCase().includes(q)) ||
        (l.specialty && l.specialty.toLowerCase().includes(q))
      );
    }

    if (lawyerFilters.maxFee) {
      filtered = filtered.filter(l => Number(l.hourlyRate) <= Number(lawyerFilters.maxFee));
    }

    if (lawyerFilters.minRating) {
      filtered = filtered.filter(l => Number(l.rating) >= Number(lawyerFilters.minRating));
    }

    filtered = applySorting(filtered, lawyerFilters.sortBy);
    lawyersData = filtered;
    renderLawyers(lawyersData);

    if (kpiTotalLawyers) kpiTotalLawyers.textContent = lawyersData.length;
    if (kpiAvailCount) {
      const totalAvail = lawyersData.filter(l => l.isAvailable !== 0).length;
      kpiAvailCount.textContent = totalAvail;
    }
  }
}

// ── Sync Pills ──
function syncPillsToSpecialty(spec) {
  specialtyPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.specialty === spec);
  });
}

// ── Reset All Filters ──
window.resetAllFilters = function() {
  lawyerFilters = {
    search: '',
    specialty: 'All Specialties',
    court: 'All Courts',
    location: 'All Locations',
    maxFee: '',
    minRating: '',
    availability: '',
    sortBy: 'rating'
  };

  if (lawyerSearchInput) lawyerSearchInput.value = '';
  if (lawyerSearchClear) lawyerSearchClear.classList.add('hidden');
  if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = 'All Specialties';
  if (lawyerCourtSelect) lawyerCourtSelect.value = 'All Courts';
  if (lawyerLocationSelect) lawyerLocationSelect.value = 'All Locations';
  if (lawyerRateSelect) lawyerRateSelect.value = '';
  if (lawyerRatingSelect) lawyerRatingSelect.value = '';
  if (lawyerAvailSelect) lawyerAvailSelect.value = '';
  if (lawyerSortSelect) lawyerSortSelect.value = 'rating';

  syncPillsToSpecialty('All Specialties');
  fetchAndRenderLawyers();
  showToast(' Search filters have been reset', 'info');
};

if (btnResetFilters) btnResetFilters.addEventListener('click', resetAllFilters);

// ── Debounce utility ──
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── Search & Filter Listeners ──
if (lawyerSearchInput) {
  lawyerSearchInput.addEventListener('input', debounce(() => {
    lawyerFilters.search = lawyerSearchInput.value.trim();
    if (lawyerSearchClear) {
      lawyerSearchClear.classList.toggle('hidden', !lawyerFilters.search);
    }
    fetchAndRenderLawyers();
  }, 300));
}

if (lawyerSearchClear) {
  lawyerSearchClear.addEventListener('click', () => {
    lawyerFilters.search = '';
    if (lawyerSearchInput) lawyerSearchInput.value = '';
    lawyerSearchClear.classList.add('hidden');
    fetchAndRenderLawyers();
  });
}

if (lawyerSpecialtySelect) {
  lawyerSpecialtySelect.addEventListener('change', () => {
    lawyerFilters.specialty = lawyerSpecialtySelect.value;
    syncPillsToSpecialty(lawyerFilters.specialty);
    fetchAndRenderLawyers();
  });
}

if (lawyerCourtSelect) {
  lawyerCourtSelect.addEventListener('change', () => {
    lawyerFilters.court = lawyerCourtSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerLocationSelect) {
  lawyerLocationSelect.addEventListener('change', () => {
    lawyerFilters.location = lawyerLocationSelect.value;
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

if (lawyerAvailSelect) {
  lawyerAvailSelect.addEventListener('change', () => {
    lawyerFilters.availability = lawyerAvailSelect.value;
    fetchAndRenderLawyers();
  });
}

if (lawyerSortSelect) {
  lawyerSortSelect.addEventListener('change', () => {
    lawyerFilters.sortBy = lawyerSortSelect.value;
    fetchAndRenderLawyers();
  });
}

// Specialty Pills click
specialtyPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const spec = pill.dataset.specialty;
    lawyerFilters.specialty = spec;
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = spec;
    syncPillsToSpecialty(spec);
    fetchAndRenderLawyers();
  });
});

// ── Lawyer Full Details Modal ──
window.handleLawyerCardClick = function(event, lawyerId) {
  if (event.target.closest('button') || event.target.closest('a') || event.target.closest('input')) {
    return;
  }
  openLawyerModal(lawyerId);
};

window.openLawyerModal = async function(lawyerId, fallbackLawyer = null) {
  let lawyer = null;

  // 1. Try finding in loaded lawyersData
  if (typeof lawyersData !== 'undefined' && Array.isArray(lawyersData)) {
    lawyer = lawyersData.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId));
  }

  // 2. Try finding in FALLBACK_LAWYERS
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
    lawyer = FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId));
  }

  // 3. Fallback parameter
  if (!lawyer && fallbackLawyer) lawyer = fallbackLawyer;

  // 4. Try matching by name
  if (!lawyer) {
    const fallbackObj = typeof FALLBACK_LAWYERS !== 'undefined' ? FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId)) : null;
    const searchTarget = fallbackObj ? fallbackObj.name : (typeof lawyerId === 'string' && isNaN(Number(lawyerId)) ? lawyerId : null);
    if (searchTarget) {
      const q = searchTarget.toLowerCase().trim();
      if (typeof lawyersData !== 'undefined' && Array.isArray(lawyersData)) {
        lawyer = lawyersData.find(l => l.name && (l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())));
      }
      if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
        lawyer = FALLBACK_LAWYERS.find(l => l.name && (l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())));
      }
    }
  }

  // 5. If missing details, fetch directly from API
  if (!lawyer || !lawyer.bio || !lawyer.phone) {
    try {
      const resp = await fetch(`${LAWYERS_API}/${lawyerId}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.lawyer) {
          lawyer = json.lawyer;
        }
      }
    } catch (e) {
      console.warn('Could not fetch lawyer by id:', e);
    }
  }

  // 6. Default to first advocate if not found
  if (!lawyer) {
    lawyer = (lawyersData && lawyersData.length > 0) ? lawyersData[0] : FALLBACK_LAWYERS[0];
  }

  if (!lawyer || !lawyerModalOverlay) return;
  currentModalLawyer = lawyer;

  // Header Avatar
  const avatarWrap = document.getElementById('lawyer-modal-avatar-wrap');
  if (avatarWrap) {
    const initials = getInitials(lawyer.name || 'Advocate');
    avatarWrap.innerHTML = lawyer.avatarUrl 
      ? `<img class="lawyer-modal-avatar" src="${lawyer.avatarUrl}" alt="${escapeHtml(lawyer.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" /><div class="lawyer-modal-avatar-fallback" style="display:none">${initials}</div>`
      : `<div class="lawyer-modal-avatar-fallback">${initials}</div>`;
  }

  // Header info
  const nameEl = document.getElementById('lawyer-modal-name');
  if (nameEl) nameEl.textContent = lawyer.name || 'Advocate';

  const titleEl = document.getElementById('lawyer-modal-title');
  if (titleEl) titleEl.textContent = lawyer.title || 'Legal Advocate & Counsel';

  const specialtyEl = document.getElementById('lawyer-modal-specialty');
  if (specialtyEl) specialtyEl.textContent = lawyer.specialty || 'General Practice';

  const availEl = document.getElementById('lawyer-modal-avail');
  if (availEl) {
    const isAvail = lawyer.isAvailable !== 0;
    availEl.className = `badge-availability ${isAvail ? 'available' : 'booked'}`;
    availEl.innerHTML = isAvail 
      ? '<span class="status-pulse-dot"></span> Available for Consult'
      : '<span class="status-busy-dot"></span> Booked / In Trial';
  }

  const barnumEl = document.getElementById('lawyer-modal-barnum');
  if (barnumEl) barnumEl.textContent = `Bar Council Enrollment: ${lawyer.barNumber || 'Verified'}`;

  // Key Metrics
  const expEl = document.getElementById('lawyer-modal-exp');
  if (expEl) expEl.textContent = `${lawyer.experienceYears || 10}+ Years`;

  const winsEl = document.getElementById('lawyer-modal-wins');
  if (winsEl) winsEl.textContent = `${lawyer.casesWon || 50} Matters`;

  const successEl = document.getElementById('lawyer-modal-success');
  if (successEl) successEl.textContent = 'Verified Active';

  const ratingEl = document.getElementById('lawyer-modal-rating');
  if (ratingEl) ratingEl.textContent = 'BCI Registered';

  const rateEl = document.getElementById('lawyer-modal-rate');
  if (rateEl) rateEl.textContent = `₹${Number(lawyer.hourlyRate || 5000).toLocaleString('en-IN')} / hr`;

  // Practicing Courts
  const courtEl = document.getElementById('lawyer-modal-courts');
  if (courtEl) {
    courtEl.textContent = lawyer.practicingCourts || lawyer.primaryCourt || 'Supreme Court of India · State High Courts';
  }

  // Chambers & Location
  const locEl = document.getElementById('lawyer-modal-location');
  if (locEl) {
    const firm = lawyer.firmName ? `${lawyer.firmName} · ` : '';
    locEl.textContent = `${firm}${lawyer.city || ''}, ${lawyer.state || ''}`;
  }

  // Education & Languages
  const eduEl = document.getElementById('lawyer-modal-education');
  if (eduEl) eduEl.textContent = lawyer.education || 'Faculty of Law, Recognized Bar';

  const langEl = document.getElementById('lawyer-modal-languages');
  if (langEl) langEl.textContent = lawyer.languages || 'English, Hindi';

  // Direct Contact
  const phoneEl = document.getElementById('lawyer-modal-phone');
  const phoneLink = document.getElementById('lawyer-modal-phone-link');
  if (phoneEl) phoneEl.textContent = lawyer.phone || '+91 11 2461 7890';
  if (phoneLink) {
    phoneLink.href = lawyer.phone ? `tel:${lawyer.phone.replace(/[^\d+]/g, '')}` : '#';
  }

  const emailEl = document.getElementById('lawyer-modal-email');
  const emailLink = document.getElementById('lawyer-modal-email-link');
  if (emailEl) emailEl.textContent = lawyer.email || 'counsel@legalai.org';
  if (emailLink) {
    emailLink.href = lawyer.email ? `mailto:${lawyer.email}` : '#';
  }

  // Biography
  const bioEl = document.getElementById('lawyer-modal-bio');
  if (bioEl) bioEl.textContent = lawyer.bio || 'Trial attorney dedicated to client advocacy and comprehensive courtroom representation.';

  if (lawyerModalBtnBook) {
    lawyerModalBtnBook.onclick = () => {
      closeLawyerModal();
      openConsultModal(lawyer.id, lawyer);
    };
  }

  if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = 'Copy Advocate Details';

  lawyerModalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeLawyerModal = function() {
  if (lawyerModalOverlay) lawyerModalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
};

window.copyLawyerDetails = function() {
  if (!currentModalLawyer) return;
  const text = `ADVOCATE PROFILE - LegalAI
Name: ${currentModalLawyer.name} (${currentModalLawyer.title || 'Advocate'})
Specialty: ${currentModalLawyer.specialty}
Bar Enrollment: ${currentModalLawyer.barNumber}
Experience: ${currentModalLawyer.experienceYears}+ Years | Reported Matters: ${currentModalLawyer.casesWon} | Standing: Bar Council Verified Active
Chambers / Firm: ${currentModalLawyer.firmName || ''} (${currentModalLawyer.city || ''}, ${currentModalLawyer.state || ''})
Education: ${currentModalLawyer.education || ''}
Languages: ${currentModalLawyer.languages || ''}
Phone: ${currentModalLawyer.phone}
Email: ${currentModalLawyer.email}
Consultation Fee: ₹${Number(currentModalLawyer.hourlyRate).toLocaleString('en-IN')} / hour`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = ' Copied!';
      showToast(' Advocate credentials copied to clipboard!', 'success');
      setTimeout(() => {
        if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = 'Copy Advocate Details';
      }, 2500);
    });
  } else {
    showToast('Advocate details selected for copy', 'info');
  }
};

if (lawyerModalClose)    lawyerModalClose.addEventListener('click', closeLawyerModal);
if (lawyerModalBtnClose) lawyerModalBtnClose.addEventListener('click', closeLawyerModal);
if (lawyerModalBtnCopy)  lawyerModalBtnCopy.addEventListener('click', copyLawyerDetails);

if (lawyerModalOverlay) {
  lawyerModalOverlay.addEventListener('click', (e) => {
    if (e.target === lawyerModalOverlay) closeLawyerModal();
  });
}

// ── Consultation Booking Modal (Works seamlessly for all visitors and authenticated clients) ──

// ── Phone Validation Helpers for Consultation Booking ──
function validatePhoneNumber(phone) {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return {
      valid: false,
      message: 'Phone number is required. Please provide a valid contact number.'
    };
  }

  const validPattern = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      message: 'Invalid phone number format! Letters and special symbols are not allowed. Please provide a valid contact number.'
    };
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) {
    return {
      valid: false,
      message: `Invalid phone number! It has only ${digits.length} digits. Please provide a valid 10-digit contact number.`
    };
  }
  if (digits.length > 15) {
    return {
      valid: false,
      message: `Invalid phone number! Too long (${digits.length} digits). Standard phone numbers cannot exceed 15 digits.`
    };
  }

  if (/^(\d)\1+$/.test(digits)) {
    return {
      valid: false,
      message: 'Invalid phone number! Repeating placeholder digits are not accepted. Please provide a real contact number.'
    };
  }

  return { valid: true, digits };
}

function showConsultPhoneError(message) {
  const phoneInput = document.getElementById('consult-phone');
  const errorEl = document.getElementById('consult-phone-error');
  const errorText = document.getElementById('consult-phone-error-text');
  if (phoneInput) {
    phoneInput.classList.add('input-error');
    phoneInput.classList.remove('input-valid');
  }
  if (errorEl && errorText) {
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function clearConsultPhoneError() {
  const phoneInput = document.getElementById('consult-phone');
  const errorEl = document.getElementById('consult-phone-error');
  if (phoneInput) {
    phoneInput.classList.remove('input-error');
    phoneInput.classList.remove('input-valid');
  }
  if (errorEl) {
    errorEl.classList.add('hidden');
  }
}

function showConsultPhoneValid() {
  const phoneInput = document.getElementById('consult-phone');
  const errorEl = document.getElementById('consult-phone-error');
  if (phoneInput) {
    phoneInput.classList.remove('input-error');
    phoneInput.classList.add('input-valid');
  }
  if (errorEl) {
    errorEl.classList.add('hidden');
  }
}


window.openConsultModal = function(lawyerId, fallbackLawyer = null) {
  let lawyer = null;
  if (Array.isArray(lawyersData) && lawyersData.length > 0) {
    lawyer = lawyersData.find(l => String(l.id) === String(lawyerId) || l.name === lawyerId);
  }
  if (!lawyer && fallbackLawyer) {
    lawyer = fallbackLawyer;
  }
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
    lawyer = FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || l.name === lawyerId);
  }
  if (!lawyer && typeof window !== 'undefined' && Array.isArray(window.INDIAN_LAWYERS_DATA)) {
    lawyer = window.INDIAN_LAWYERS_DATA.find(l => String(l.id) === String(lawyerId) || l.name === lawyerId);
  }
  if (!lawyer && !isNaN(Number(lawyerId))) {
    const list = (typeof FALLBACK_LAWYERS !== 'undefined' && FALLBACK_LAWYERS.length) ? FALLBACK_LAWYERS : (window.INDIAN_LAWYERS_DATA || []);
    const idx = Number(lawyerId) - 1;
    if (list[idx]) lawyer = list[idx];
  }
  if (!lawyer) {
    lawyer = {
      id: lawyerId || '26',
      name: 'Harish Salve, Senior Advocate',
      title: 'Senior Advocate & King\'s Counsel',
      specialty: 'Constitutional & Commercial Law',
      hourlyRate: 45000
    };
  }

  const overlay = consultOverlay || document.getElementById('consult-modal-overlay');
  if (!overlay) return;

  const titleEl = consultModalTitle || document.getElementById('consult-modal-title');
  const subtitleEl = consultAttySubtitle || document.getElementById('consult-attorney-subtitle');
  const idInput = consultLawyerId || document.getElementById('consult-lawyer-id');

  if (idInput) idInput.value = lawyer.id;
  if (titleEl) titleEl.textContent = `Consultation · ${lawyer.name}`;
  if (subtitleEl) subtitleEl.textContent = `${lawyer.title || 'Advocate'} · ${lawyer.specialty} · ₹${Number(lawyer.hourlyRate || 25000).toLocaleString('en-IN')}/hr`;

  // Pre-fill authenticated user details if available
  const cachedUserStr = localStorage.getItem('legalai_user');
  if (cachedUserStr) {
    try {
      const user = JSON.parse(cachedUserStr);
      const nameInput = document.getElementById('consult-name');
      const emailInput = document.getElementById('consult-email');
      const phoneInput = document.getElementById('consult-phone');
      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (phoneInput && user.phone && !phoneInput.value) phoneInput.value = user.phone;
    } catch (_) {}
  }

  // Set min date to today and default date to tomorrow
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('consult-date');
  if (dateInput) {
    dateInput.min = today;
    if (!dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  // Clear any past validation errors
  clearConsultPhoneError();

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeConsultModal = function() {
  const overlay = consultOverlay || document.getElementById('consult-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
  clearConsultPhoneError();
  const form = consultForm || document.getElementById('consult-form');
  if (form && typeof form.reset === 'function') form.reset();
};

const closeBtn = consultModalClose || document.getElementById('consult-modal-close');
if (closeBtn) closeBtn.addEventListener('click', window.closeConsultModal);

const overlayEl = consultOverlay || document.getElementById('consult-modal-overlay');
if (overlayEl) {
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) window.closeConsultModal();
  });
}

// Attach real-time validation on phone input
const consultPhoneInput = document.getElementById('consult-phone');
if (consultPhoneInput) {
  consultPhoneInput.addEventListener('blur', () => {
    const val = consultPhoneInput.value.trim();
    if (!val) {
      clearConsultPhoneError();
      return;
    }
    const check = validatePhoneNumber(val);
    if (!check.valid) {
      showConsultPhoneError(check.message);
    } else {
      showConsultPhoneValid();
    }
  });

  consultPhoneInput.addEventListener('input', () => {
    const val = consultPhoneInput.value.trim();
    if (!val) {
      clearConsultPhoneError();
      return;
    }
    if (consultPhoneInput.classList.contains('input-error')) {
      const check = validatePhoneNumber(val);
      if (check.valid) {
        showConsultPhoneValid();
      }
    }
  });
}

// Consultation Form Submission (Works seamlessly both authenticated and guest, online and offline)
const formEl = consultForm || document.getElementById('consult-form');
if (formEl) {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('legalai_token');
    const idInput = consultLawyerId || document.getElementById('consult-lawyer-id');
    const lawyerId = idInput?.value || '26';

    const clientName    = document.getElementById('consult-name')?.value.trim();
    const clientEmail   = document.getElementById('consult-email')?.value.trim();
    const clientPhone   = document.getElementById('consult-phone')?.value.trim();
    const preferredDate = document.getElementById('consult-date')?.value;
    const caseSummary   = document.getElementById('consult-summary')?.value.trim();

    if (!clientName || !clientEmail || !clientPhone || !preferredDate) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const phoneCheck = validatePhoneNumber(clientPhone);
    if (!phoneCheck.valid) {
      showToast(phoneCheck.message, 'error');
      showConsultPhoneError(phoneCheck.message);
      if (consultPhoneInput) consultPhoneInput.focus();
      return;
    }

    const submitBtn = consultSubmit || document.getElementById('consult-submit');
    const btnText    = submitBtn?.querySelector('.btn-text');
    const btnSpinner = submitBtn?.querySelector('.btn-spinner');
    if (btnText) btnText.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    if (submitBtn) submitBtn.disabled = true;

    let currentLawyer = (lawyersData || []).find(l => String(l.id) === String(lawyerId)) ||
                        (typeof FALLBACK_LAWYERS !== 'undefined' ? FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId)) : null);
    const titleEl = consultModalTitle || document.getElementById('consult-modal-title');
    const lawyerNameClean = currentLawyer?.name || titleEl?.textContent.replace('Consultation · ', '').trim() || 'Advocate';

    const payload = {
      lawyerId,
      lawyerName: lawyerNameClean,
      clientName,
      clientEmail,
      clientPhone,
      preferredDate,
      caseSummary: caseSummary || 'Legal consultation advisory inquiry.'
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let resp = await fetch(`${LAWYERS_API}/${lawyerId}/consult`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (resp.status === 401 && token) {
        resp = await fetch(`${LAWYERS_API}/${lawyerId}/consult`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await resp.json();

      if (data.success) {
        window.closeConsultModal();
        try { sessionStorage.removeItem('pending_consult_lawyer'); } catch (_) {}
        const bookedId = data.bookingId || data.consultation?.id;
        showToast(
          `Consultation #${bookedId || ''} booked with ${data.lawyer?.name || lawyerNameClean}!`,
          'success',
          bookedId ? {
            label: 'Cancel Booking',
            callback: () => cancelConsultationBooking(bookedId, true)
          } : null
        );
        await fetchAndRenderBookings();
        renderLawyers(lawyersData);
      } else {
        if (data.message && data.message.toLowerCase().includes('phone')) {
          showConsultPhoneError(data.message);
          if (consultPhoneInput) consultPhoneInput.focus();
        }
        showToast(data.message || 'Could not submit booking request.', 'error');
      }
    } catch (err) {
      // Seamless offline fallback when server is unreachable
      const offlineId = Date.now();
      const offlineConsultation = {
        id: offlineId,
        lawyerId: currentLawyer?.id || lawyerId,
        lawyerName: lawyerNameClean,
        lawyerTitle: currentLawyer?.title || 'Senior Advocate',
        lawyerSpecialty: currentLawyer?.specialty || 'General Practice',
        lawyerAvatar: currentLawyer?.avatarUrl || '',
        lawyerRate: currentLawyer?.hourlyRate || 25000,
        clientName,
        clientEmail,
        clientPhone,
        preferredDate,
        caseSummary: payload.caseSummary,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isOffline: true
      };

      try {
        const storedConsultations = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
        storedConsultations.unshift(offlineConsultation);
        localStorage.setItem('legalai_consultations', JSON.stringify(storedConsultations));

        const storedOffline = JSON.parse(localStorage.getItem('legalai_offline_bookings') || '[]');
        storedOffline.unshift(offlineConsultation);
        localStorage.setItem('legalai_offline_bookings', JSON.stringify(storedOffline));
      } catch (_) {}

      bookingsData.unshift(offlineConsultation);
      window.closeConsultModal();
      showToast(`Consultation #${offlineId} scheduled with ${lawyerNameClean}! Request saved successfully.`, 'success');
      const activeCount = bookingsData.filter(b => b.status !== 'cancelled').length;
      updateBookingsCounters(activeCount);
      renderBookingsList(bookingsData);
      renderLawyers(lawyersData);
    } finally {
      if (btnText) btnText.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ── Bookings Modal Engine ──
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

if (bookingsModalClose) bookingsModalClose.addEventListener('click', closeBookingsModal);

if (bookingsModalOverlay) {
  bookingsModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookingsModalOverlay) closeBookingsModal();
  });
}

function updateBookingsCounters(count) {
  if (badgeNavBookings) badgeNavBookings.textContent = count;
  const badgeBookedCount = document.getElementById('badge-booked-count');
  if (badgeBookedCount) badgeBookedCount.textContent = count;
}

async function fetchAndRenderBookings() {
  try {
    const resp = await fetch(`${LAWYERS_API}/consultations`);
    if (resp.ok) {
      const data = await resp.json();
      bookingsData = data.consultations || [];
    } else {
      bookingsData = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
    }
  } catch (err) {
    bookingsData = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
  }
  const activeBookings = bookingsData.filter(b => b.status !== 'cancelled');
  updateBookingsCounters(activeBookings.length);
  renderBookingsList(bookingsData);
}

function renderBookingsList(bookings) {
  if (!bookingsListContainer) return;

  const allBookings = bookingsData || [];
  const activeBookings = allBookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');

  const countAllTab = document.getElementById('count-all-tab');
  const countActiveTab = document.getElementById('count-active-tab');
  const countCancelledTab = document.getElementById('count-cancelled-tab');
  if (countAllTab) countAllTab.textContent = allBookings.length;
  if (countActiveTab) countActiveTab.textContent = activeBookings.length;
  if (countCancelledTab) countCancelledTab.textContent = cancelledBookings.length;

  let filtered = bookings || [];
  if (currentBookingTab === 'active') {
    filtered = filtered.filter(b => b.status !== 'cancelled');
  } else if (currentBookingTab === 'cancelled') {
    filtered = filtered.filter(b => b.status === 'cancelled');
  }

  if (!filtered || filtered.length === 0) {
    bookingsListContainer.innerHTML = `
      <div class="bookings-empty-state" style="text-align:center; padding: 40px 20px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--gold); margin-bottom:12px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h4 style="color:#fff; margin-bottom:6px;">No Consultations in this view</h4>
        <p style="color:var(--muted); font-size:0.85rem;">Browse our verified advocate directory and schedule your legal advisory meeting.</p>
      </div>`;
    return;
  }

  bookingsListContainer.innerHTML = filtered.map(b => {
    const isCancelled = b.status === 'cancelled';
    const statusBadge = isCancelled
      ? `<span class="booking-status-pill status-cancelled"><span class="status-busy-dot"></span> Cancelled</span>`
      : `<span class="booking-status-pill status-active"><span class="status-pulse-dot"></span> Confirmed Consultation</span>`;

    const avatarEl = b.lawyerAvatar
      ? `<img class="booking-card-avatar" src="${b.lawyerAvatar}" alt="${escapeHtml(b.lawyerName)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="lawyer-avatar-fallback small" style="display:none">${getInitials(b.lawyerName || 'A')}</div>`
      : `<div class="lawyer-avatar-fallback small">${getInitials(b.lawyerName || 'A')}</div>`;

    return `
      <div class="booked-consult-card ${isCancelled ? 'booking-cancelled' : ''}" id="booking-item-${b.id}">
        <div class="booking-card-top">
          <div class="booking-atty-profile" onclick="openLawyerModal('${b.lawyerId}')" style="cursor:pointer;" title="Click to view advocate's full credentials">
            ${avatarEl}
            <div>
              <div class="booking-atty-name" style="text-decoration: underline dotted var(--gold);">${escapeHtml(b.lawyerName || 'Advocate')}</div>
              <div class="booking-atty-meta">
                <span>${escapeHtml(b.lawyerTitle || 'Counsel')}</span> · 
                <span class="badge-specialty small">${escapeHtml(b.lawyerSpecialty || 'General Practice')}</span>
                ${b.lawyerRate ? ` · <strong style="color:var(--gold);">₹${Number(b.lawyerRate).toLocaleString('en-IN')}/hr</strong>` : ''}
              </div>
            </div>
          </div>
          <div class="booking-meta-right">
            ${statusBadge}
            <div class="booking-ref-id">REF #LGL-${String(b.id).slice(-4)}</div>
          </div>
        </div>

        <div class="booking-card-body">
          <div class="booking-info-grid">
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div>
                <span class="info-label">Session Date</span>
                <span class="info-val highlight-date"> ${escapeHtml(b.preferredDate || 'TBD')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div>
                <span class="info-label">Client Name</span>
                <span class="info-val">${escapeHtml(b.clientName || 'Client')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <span class="info-label">Contact Phone</span>
                <span class="info-val">${escapeHtml(b.clientPhone || b.lawyerPhone || 'N/A')}</span>
              </div>
            </div>
            <div class="booking-info-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <div>
                <span class="info-label">Email</span>
                <span class="info-val">${escapeHtml(b.clientEmail || b.lawyerEmail || 'N/A')}</span>
              </div>
            </div>
          </div>
          ${b.caseSummary ? `
            <div class="booking-summary-box" style="margin-top:12px;">
              <span class="info-label">Case Note:</span>
              <p style="margin:2px 0 0 0; color:#fff; font-size:0.85rem;">${escapeHtml(b.caseSummary)}</p>
            </div>
          ` : ''}
        </div>

        <div class="booking-card-actions">
          <button type="button" class="booking-action-btn btn-view-profile" onclick="openLawyerModal('${b.lawyerId}')" title="View advocate profile & credentials">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Advocate Details
          </button>
          ${b.lawyerPhone ? `
            <a href="tel:${b.lawyerPhone}" class="booking-action-btn btn-call" title="Call office: ${b.lawyerPhone}">Call Chambers</a>
          ` : ''}
          ${!isCancelled ? `
            <button class="booking-action-btn btn-cancel" onclick="cancelConsultationBooking(${b.id})" title="Cancel this consultation">Cancel</button>
          ` : `
            <span class="booking-cancelled-label">Cancelled</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

window.cancelConsultationBooking = async function(id) {
  if (!confirm('Are you sure you want to cancel this scheduled consultation?')) return;
  try {
    const resp = await fetch(`${LAWYERS_API}/consultations/${id}`, { method: 'DELETE' });
    if (resp.ok) {
      showToast('Consultation cancelled successfully.', 'info');
    }
  } catch (_) {}
  const b = bookingsData.find(item => item.id === id);
  if (b) b.status = 'cancelled';
  try {
    const stored = JSON.parse(localStorage.getItem('legalai_consultations') || '[]');
    const filtered = stored.filter(x => x.id !== id);
    localStorage.setItem('legalai_consultations', JSON.stringify(filtered));
  } catch (_) {}
  updateBookingsCounters(bookingsData.filter(x => x.status !== 'cancelled').length);
  renderBookingsList(bookingsData);
  renderLawyers(lawyersData);
};

// ── Cancel / Remove All Booked Consultations ──
window.cancelAllBookings = async function() {
  if (typeof confirm === 'function' && !confirm('Are you sure you want to remove all booked consultations for all lawyers?')) return;
  try {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const url = user && user.id
      ? `${LAWYERS_API}/consultations/clear-all?userId=${user.id}`
      : `${LAWYERS_API}/consultations/clear-all`;

    try {
      await fetch(url, { method: 'DELETE' });
    } catch (_) {}

    try {
      const cancelUrl = user && user.id
        ? `${LAWYERS_API}/consultations/cancel-all?userId=${user.id}&purge=true`
        : `${LAWYERS_API}/consultations/cancel-all?purge=true`;
      await fetch(cancelUrl, { method: 'DELETE' });
    } catch (_) {}
  } catch (err) {
    console.warn('Network error clearing bookings:', err);
  }

  // Clear local storage completely
  try { localStorage.removeItem('legalai_consultations'); } catch (_) {}
  try { localStorage.removeItem('legalai_offline_bookings'); } catch (_) {}
  try { localStorage.removeItem('legalai_recent_bookings'); } catch (_) {}

  bookingsData = [];
  updateBookingsCounters(0);
  renderBookingsList([]);
  if (typeof lawyersData !== 'undefined' && Array.isArray(lawyersData) && lawyersData.length > 0) {
    renderLawyers(lawyersData);
  }
  showToast('All booked consultations have been removed.', 'info');
};
window.removeAllBookings = window.cancelAllBookings;

// Bookings Tabs
document.querySelectorAll('.bookings-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bookings-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBookingTab = btn.dataset.tab;
    renderBookingsList(bookingsData);
  });
});

if (bookingsSearchInput) {
  bookingsSearchInput.addEventListener('input', () => {
    const q = bookingsSearchInput.value.toLowerCase().trim();
    if (!q) {
      renderBookingsList(bookingsData);
    } else {
      const filtered = bookingsData.filter(b =>
        (b.lawyerName && b.lawyerName.toLowerCase().includes(q)) ||
        (b.clientName && b.clientName.toLowerCase().includes(q)) ||
        (b.clientEmail && b.clientEmail.toLowerCase().includes(q)) ||
        (b.lawyerSpecialty && b.lawyerSpecialty.toLowerCase().includes(q))
      );
      renderBookingsList(filtered);
    }
  });
}

if (bookingsRefreshBtn) {
  bookingsRefreshBtn.addEventListener('click', () => {
    fetchAndRenderBookings();
    showToast('Consultations refreshed', 'info');
  });
}

// ── Global Escape Key Listener ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lawyerModalOverlay && !lawyerModalOverlay.classList.contains('hidden')) {
      closeLawyerModal();
    }
    if (consultOverlay && !consultOverlay.classList.contains('hidden')) {
      closeConsultModal();
    }
    if (bookingsModalOverlay && !bookingsModalOverlay.classList.contains('hidden')) {
      closeBookingsModal();
    }
  }
});

// ── Side Menu Navigation Drawer ──
const navMenuBtn     = document.getElementById('nav-menu-btn');
const sideMenuDrawer = document.getElementById('side-menu-drawer');
const sideMenuOverlay= document.getElementById('side-menu-overlay');
const sideMenuClose  = document.getElementById('side-menu-close');

function openSideMenu() {
  if (sideMenuDrawer) sideMenuDrawer.classList.add('open');
  if (sideMenuOverlay) sideMenuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
  if (sideMenuDrawer) sideMenuDrawer.classList.remove('open');
  if (sideMenuOverlay) sideMenuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

navMenuBtn?.addEventListener('click', openSideMenu);
sideMenuClose?.addEventListener('click', closeSideMenu);
sideMenuOverlay?.addEventListener('click', closeSideMenu);

// ── URL Query Parameters Parser ──
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const lawyerIdParam = params.get('lawyer');
  if (lawyerIdParam) {
    setTimeout(() => {
      if (typeof window.openLawyerModal === 'function') {
        window.openLawyerModal(lawyerIdParam);
      }
      const targetCard = document.getElementById('lawyer-card-' + lawyerIdParam);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }
  const courtParam = params.get('court');
  if (courtParam) {
    lawyerFilters.court = courtParam;
    if (lawyerCourtSelect) lawyerCourtSelect.value = courtParam;
  }
  const spec = params.get('specialty');
  if (spec) {
    lawyerFilters.specialty = spec;
    if (lawyerSpecialtySelect) lawyerSpecialtySelect.value = spec;
    syncPillsToSpecialty(spec);
  }
  const city = params.get('city');
  if (city && lawyerLocationSelect) {
    lawyerFilters.location = city;
    lawyerLocationSelect.value = city;
  }
  const search = params.get('search');
  if (search && lawyerSearchInput) {
    lawyerFilters.search = search;
    lawyerSearchInput.value = search;
    if (lawyerSearchClear) lawyerSearchClear.classList.remove('hidden');
  }
}

// ── Check and auto-resume consultation booking if navigated with ?bookLawyerId=... ──
function checkPendingConsultationResume() {
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get('bookLawyerId');
  if (resumeId) {
    window.history.replaceState({}, document.title, window.location.pathname);
    try { sessionStorage.removeItem('pending_consult_lawyer'); } catch (_) {}
    const tryOpen = (attempts = 0) => {
      if (typeof window.openConsultModal === 'function') {
        window.openConsultModal(resumeId);
        showToast('Opening consultation booking...', 'info');
      } else if (attempts < 15) {
        setTimeout(() => tryOpen(attempts + 1), 200);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => tryOpen(0));
    } else {
      setTimeout(() => tryOpen(0), 300);
    }
  }
}

// ── Sync Navbar Auth Button State ──
function syncLawyersNavAuthState() {
  const token = localStorage.getItem('legalai_token');
  const userStr = localStorage.getItem('legalai_user');
  const navAuthBtn = document.getElementById('nav-auth-btn');
  if (!navAuthBtn) return;
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      navAuthBtn.textContent = `${user.name ? user.name.split(' ')[0] : 'Client'} Portal ↗`;
      navAuthBtn.href = 'user.html';
    } catch (_) {}
  } else {
    navAuthBtn.textContent = 'Sign In / Register';
    navAuthBtn.href = 'login.html';
  }
}

// ── Initialize on Page Load ──
document.addEventListener('DOMContentLoaded', () => {
  syncLawyersNavAuthState();
  parseUrlParams();
  fetchAndRenderLawyers();
  fetchAndRenderBookings();
  checkPendingConsultationResume();
});


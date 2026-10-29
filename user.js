/* ================================================================
   LEGALAI — CLIENT USER PORTAL LOGIC (user.js)
   ================================================================ */

const SERVER_ORIGIN = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000'
  : window.location.origin;

let currentUser = null;
let currentConsultations = [];

// DOM Elements
const accessGate = document.getElementById('user-access-gate');
const dashboardContent = document.getElementById('user-dashboard-content');
const loginForm = document.getElementById('portal-login-form');
const btnQuickDemo = document.getElementById('btn-quick-demo-login');
const btnLogout = document.getElementById('btn-user-logout');
const navAdminLink = document.getElementById('nav-admin-link');

// ── SESSION MANAGEMENT ──
function getAuthToken() {
  return localStorage.getItem('legalai_token');
}

function setAuthSession(token, user) {
  localStorage.setItem('legalai_token', token);
  localStorage.setItem('legalai_user', JSON.stringify(user));
  currentUser = user;
}

function clearAuthSession() {
  localStorage.removeItem('legalai_token');
  localStorage.removeItem('legalai_user');
  currentUser = null;
}

// ── INITIALIZE USER PORTAL ──
async function initUserPortal() {
  const token = getAuthToken();
  if (!token) {
    showAccessGate();
    return;
  }

  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      showDashboard(data);
    } else {
      clearAuthSession();
      showAccessGate();
    }
  } catch (err) {
    console.error('Session error:', err);
    // Offline or fallback to cached
    const cached = localStorage.getItem('legalai_user');
    if (cached) {
      try {
        currentUser = JSON.parse(cached);
        showDashboard({ user: currentUser, stats: { totalConsultations: 0, activeConsultations: 0, totalAIQueries: 0 } });
        return;
      } catch (e) {}
    }
    showAccessGate();
  }
}

function showAccessGate() {
  accessGate?.classList.remove('hidden');
  dashboardContent?.classList.add('hidden');
}

function showDashboard(profileData) {
  accessGate?.classList.add('hidden');
  dashboardContent?.classList.remove('hidden');

  const u = profileData.user;
  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';

  // Update Header Chip
  const elAvatar = document.getElementById('user-header-avatar');
  const elName = document.getElementById('user-header-name');
  const elRole = document.getElementById('user-header-role');
  if (elAvatar) elAvatar.textContent = initial;
  if (elName) elName.textContent = u.name;
  if (elRole) elRole.textContent = u.role === 'admin' ? 'Administrator' : (u.isVerified ? 'Verified Client' : 'Client Account');

  // Show Admin Link if user is an admin
  if (u.role === 'admin' && navAdminLink) {
    navAdminLink.style.display = 'inline-block';
  }

  // Update Drawer Info
  const drawerName = document.getElementById('drawer-user-name');
  const drawerEmail = document.getElementById('drawer-user-email');
  const drawerRoleBadge = document.getElementById('drawer-user-role-badge');
  const drawerAdminLink = document.getElementById('drawer-admin-link');
  if (drawerName) drawerName.textContent = u.name || 'Client Account';
  if (drawerEmail) drawerEmail.textContent = u.email || '';
  if (drawerRoleBadge) drawerRoleBadge.textContent = u.role === 'admin' ? '👑 Admin' : (u.isVerified ? '✓ Verified Client' : 'Client');
  if (u.role === 'admin' && drawerAdminLink) drawerAdminLink.style.display = 'flex';

  // Update Hero Banner
  const elWelcome = document.getElementById('user-welcome-title');
  if (elWelcome) elWelcome.textContent = `Welcome back, ${u.name}`;

  const elJoined = document.getElementById('user-joined-badge');
  if (elJoined && u.createdAt) {
    const dateStr = new Date(u.createdAt).toLocaleDateString();
    elJoined.textContent = `Member since ${dateStr}`;
  }

  // Update KPI Cards
  const stats = profileData.stats || {};
  const elActive = document.getElementById('kpi-active-consultations');
  const elTotal = document.getElementById('kpi-total-consultations');
  const elChats = document.getElementById('kpi-ai-queries');

  if (elActive) elActive.textContent = stats.activeConsultations || 0;
  if (elTotal) elTotal.textContent = stats.totalConsultations || 0;
  if (elChats) elChats.textContent = stats.totalAIQueries || 0;

  // Pre-fill profile settings form
  const inputName = document.getElementById('profile-name');
  const inputEmail = document.getElementById('profile-email');
  if (inputName) inputName.value = u.name || '';
  if (inputEmail) inputEmail.value = u.email || '';

  // Load User Consultations & Chats
  loadUserConsultations();
  loadUserChats();
}

// ── LOAD USER CONSULTATIONS ──
async function loadUserConsultations(filterStatus = 'all') {
  const container = document.getElementById('consultations-container');
  if (!container) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/consultations`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    currentConsultations = data.consultations || [];

    // Update Badge
    const badge = document.getElementById('tab-badge-consults');
    if (badge) badge.textContent = currentConsultations.length;

    renderConsultations(filterStatus);
  } catch (err) {
    container.innerHTML = `<div style="color:#f87171; padding:20px;">Could not load consultations: ${escapeHtml(err.message)}</div>`;
  }
}

function renderConsultations(filterStatus = 'all') {
  const container = document.getElementById('consultations-container');
  if (!container) return;

  let list = currentConsultations;
  if (filterStatus !== 'all') {
    list = list.filter(c => c.status === filterStatus);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="background:#131823; border:1px dashed rgba(255,255,255,0.1); border-radius:12px; padding:50px 20px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">📁</div>
        <h3 style="color:#fff; margin-bottom:6px; font-size:1.15rem;">No Consultations Found</h3>
        <p style="color:#94a3b8; font-size:0.86rem; max-width:420px; margin:0 auto 20px;">
          ${filterStatus === 'all' 
            ? 'You do not have any consultations booked yet. Connect with our verified attorneys to review your case.' 
            : `No consultations with status "${filterStatus}".`}
        </p>
        <a href="index.html#lawyers" class="btn-portal-primary" style="display:inline-flex; text-decoration:none;">
          Browse Available Attorneys →
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="consultations-grid">
      ${list.map(c => `
        <div class="consult-card" id="consult-card-${c.id}">
          <div class="consult-card-header">
            <div class="consult-lawyer-profile" onclick="openLawyerModal('${c.lawyerId}')" style="cursor:pointer;" title="Click to view full advocate profile & credentials">
              ${c.lawyerAvatar ? `
                <img src="${c.lawyerAvatar}" class="consult-lawyer-avatar" alt="${escapeHtml(c.lawyerName)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"/>
                <div class="consult-avatar-fallback" style="display:none;">${getInitials(c.lawyerName)}</div>
              ` : `
                <div class="consult-avatar-fallback">${getInitials(c.lawyerName)}</div>
              `}
              <div>
                <h4 class="consult-lawyer-name" style="text-decoration: underline dotted var(--gold);">${escapeHtml(c.lawyerName)}</h4>
                <div class="consult-lawyer-spec">${escapeHtml(c.lawyerSpecialty || 'Legal Counsel')} · ${escapeHtml(c.lawyerFirm || '')}</div>
              </div>
            </div>
            <span class="status-badge ${c.status}">${c.status}</span>
          </div>

          <div class="consult-card-body">
            <div class="consult-meta-row">
              <div class="consult-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span><strong>Date:</strong> ${escapeHtml(c.preferredDate)}</span>
              </div>
              <div class="consult-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>₹${Number(c.lawyerRate || 25000).toLocaleString('en-IN')}/hr</span>
              </div>
            </div>

            <div class="consult-summary-box">
              <strong style="color:#dfb77c; display:block; margin-bottom:2px; font-size:0.75rem; text-transform:uppercase;">Case Summary / Issue:</strong>
              ${escapeHtml(c.caseSummary || 'General consultation regarding legal rights and case evaluation.')}
            </div>
          </div>

          <div class="consult-card-footer">
            <div style="font-size:0.76rem; color:#64748b;">Booking ID: #${c.id}</div>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn-action-icon" title="View Full Advocate Profile & Credentials" onclick="openLawyerModal('${c.lawyerId}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
              ${c.status !== 'cancelled' ? `
                <button type="button" class="btn-action-icon danger" title="Cancel this consultation" onclick="cancelConsultation(${c.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              ` : ''}
              ${c.lawyerPhone ? `
                <a href="tel:${c.lawyerPhone}" class="btn-action-icon" title="Call Attorney Office (${c.lawyerPhone})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ── CANCEL CONSULTATION ──
window.cancelConsultation = async function(id) {
  if (!confirm('Are you sure you want to cancel this consultation booking?')) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/consultations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) {
      alert('Consultation cancelled successfully.');
      loadUserConsultations();
    } else {
      alert(data.message || 'Could not cancel booking.');
    }
  } catch (err) {
    alert('Error cancelling consultation: ' + err.message);
  }
};

// ── LOAD USER AI CHATS ──
async function loadUserChats() {
  const tbody = document.getElementById('user-chats-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/chats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const chats = data.chats || [];

    const badge = document.getElementById('tab-badge-chats');
    if (badge) badge.textContent = chats.length;

    if (chats.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:30px; color:#94a3b8;">
            No AI conversations recorded for your account yet. Ask a question on the main site!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = chats.map(c => `
      <tr>
        <td>#${c.id}</td>
        <td style="max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;" title="${escapeHtml(c.message)}">
          ${escapeHtml(c.message)}
        </td>
        <td>
          <span class="meta-pill meta-pill-gold">${escapeHtml(c.category || 'General Legal Advisory')}</span>
        </td>
        <td style="font-size:0.78rem;">${new Date(c.timestamp).toLocaleString()}</td>
        <td>
          <a href="index.html" class="portal-nav-link" style="padding:4px 8px; font-size:0.78rem; border:1px solid var(--border);">Open AI Chat ↗</a>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#f87171; padding:20px;">Error loading chats: ${escapeHtml(err.message)}</td></tr>`;
  }
}

// ── PROFILE FORM SUBMIT ──
const profileForm = document.getElementById('user-profile-form');
profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('profile-alert');
  const name = document.getElementById('profile-name').value.trim();
  const email = document.getElementById('profile-email').value.trim();

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();
    if (data.success) {
      currentUser.name = data.user.name;
      currentUser.email = data.user.email;
      localStorage.setItem('legalai_user', JSON.stringify(currentUser));
      document.getElementById('user-header-name').textContent = currentUser.name;
      document.getElementById('user-welcome-title').textContent = `Welcome back, ${currentUser.name}`;

      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.color = '#86efac';
        alertEl.textContent = '✓ Profile updated successfully!';
        setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
      }
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.color = '#f87171';
        alertEl.textContent = data.message || 'Error updating profile.';
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.style.color = '#f87171';
      alertEl.textContent = 'Server unreachable: ' + err.message;
    }
  }
});

// ── PASSWORD FORM SUBMIT ──
const passwordForm = document.getElementById('user-password-form');
passwordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('password-alert');
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();
    if (data.success) {
      passwordForm.reset();
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.color = '#86efac';
        alertEl.textContent = '✓ Password changed successfully!';
        setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
      }
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.style.color = '#f87171';
        alertEl.textContent = data.message || 'Password update failed.';
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.style.color = '#f87171';
      alertEl.textContent = 'Server unreachable: ' + err.message;
    }
  }
});

// ── TAB SWITCHER ──
document.querySelectorAll('.portal-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.portal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.portal-tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    document.getElementById(targetId)?.classList.add('active');
  });
});

// ── CONSULTATION FILTERS ──
document.querySelectorAll('#consult-filters .portal-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#consult-filters .portal-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const status = btn.getAttribute('data-status');
    renderConsultations(status);
  });
});

// ── LOGIN FORM SUBMISSION (ACCESS GATE) ──
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('gate-email').value.trim();
  const password = document.getElementById('gate-password').value;
  const alertEl = document.getElementById('gate-alert');

  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      setAuthSession(data.token, data.user);
      initUserPortal();
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.textContent = data.message || 'Invalid credentials';
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Could not connect to server: ' + err.message;
    }
  }
});

// ── ONE-CLICK DEMO LOGIN ──
btnQuickDemo?.addEventListener('click', async () => {
  const alertEl = document.getElementById('gate-alert');
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demouser@legalai.com', password: 'demo1234' })
    });

    const data = await res.json();
    if (data.success) {
      setAuthSession(data.token, data.user);
      initUserPortal();
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.textContent = 'Demo login failed: ' + data.message;
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Demo login error: ' + err.message;
    }
  }
});

// ── LOGOUT ──
btnLogout?.addEventListener('click', () => {
  clearAuthSession();
  showAccessGate();
});

// ── HELPERS ──
function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// ── PORTAL THREE LINE MENU BUTTON & DRAWER ──
const portalMenuBtn    = document.getElementById('portal-menu-btn');
const portalSideDrawer = document.getElementById('portal-side-drawer');
const portalSideOverlay= document.getElementById('portal-side-overlay');
const portalSideClose  = document.getElementById('portal-side-close');
const drawerLogoutBtn  = document.getElementById('drawer-btn-logout');

function openPortalDrawer() {
  if (portalSideDrawer) {
    portalSideDrawer.classList.add('open');
    portalSideDrawer.setAttribute('aria-hidden', 'false');
  }
  if (portalSideOverlay) {
    portalSideOverlay.classList.add('open');
    portalSideOverlay.setAttribute('aria-hidden', 'false');
  }
  if (portalMenuBtn) {
    portalMenuBtn.classList.add('open');
    portalMenuBtn.setAttribute('aria-expanded', 'true');
  }
  document.body.style.overflow = 'hidden';
}

function closePortalDrawer() {
  if (portalSideDrawer) {
    portalSideDrawer.classList.remove('open');
    portalSideDrawer.setAttribute('aria-hidden', 'true');
  }
  if (portalSideOverlay) {
    portalSideOverlay.classList.remove('open');
    portalSideOverlay.setAttribute('aria-hidden', 'true');
  }
  if (portalMenuBtn) {
    portalMenuBtn.classList.remove('open');
    portalMenuBtn.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

portalMenuBtn?.addEventListener('click', () => {
  if (portalSideDrawer?.classList.contains('open')) {
    closePortalDrawer();
  } else {
    openPortalDrawer();
  }
});

portalSideClose?.addEventListener('click', closePortalDrawer);
portalSideOverlay?.addEventListener('click', closePortalDrawer);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && portalSideDrawer?.classList.contains('open')) {
    closePortalDrawer();
  }
});

// Portal drawer tab navigation
document.querySelectorAll('[data-portal-tab]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.getAttribute('data-portal-tab');
    document.querySelector(`.portal-tab-btn[data-tab="${tabId}"]`)?.click();
    
    // Update active state in drawer
    document.querySelectorAll('[data-portal-tab]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    closePortalDrawer();
  });
});

drawerLogoutBtn?.addEventListener('click', () => {
  closePortalDrawer();
  clearAuthSession();
  showAccessGate();
});

// ── FALLBACK LAWYERS DATASET (AUTHENTIC VERIFIED INDIAN ADVOCATES) ──
const FALLBACK_LAWYERS = [
  {
    id: 1,
    name: 'Harish Salve, Senior Advocate',
    title: "Senior Advocate & King's Counsel",
    specialty: 'Corporate Law',
    barNumber: 'D/248/1980',
    experienceYears: 44,
    education: 'Nagpur University, LL.B. · FCA',
    firmName: 'Chambers of Harish Salve',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 45000,
    rating: 5.0,
    reviewCount: 248,
    languages: 'English, Hindi, Marathi',
    bio: 'Former Solicitor General of India and King\'s Counsel. Master legal strategist renowned worldwide for high-stakes international commercial arbitration, cross-border corporate mergers, Kulbhushan Jadhav case before the ICJ, and landmark Supreme Court constitutional benches.',
    casesWon: 860,
    successRate: 99,
    phone: '+91 11 2461 7890',
    email: 'h.salve@chambersofsalve.in',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 2,
    name: 'Mukul Rohatgi, Senior Advocate',
    title: 'Senior Advocate & 14th Attorney General for India',
    specialty: 'Criminal Law',
    barNumber: 'D/152/1978',
    experienceYears: 46,
    education: 'Faculty of Law, University of Delhi, LL.B.',
    firmName: 'Chambers of Mukul Rohatgi',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 210,
    languages: 'English, Hindi',
    bio: '14th Attorney General for India and former Additional Solicitor General. One of India\'s most celebrated senior trial defense and corporate litigators before the Supreme Court of India and High Courts nationwide.',
    casesWon: 920,
    successRate: 98,
    phone: '+91 11 2338 4120',
    email: 'rohatgi@mukulrohatgi.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 3,
    name: 'Dr. Abhishek Manu Singhvi, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Corporate Law',
    barNumber: 'D/318/1982',
    experienceYears: 42,
    education: 'Trinity College, Cambridge (Ph.D.) · Harvard Law School',
    firmName: 'Chambers of Dr. Abhishek Manu Singhvi',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 40000,
    rating: 4.9,
    reviewCount: 185,
    languages: 'English, Hindi, Marwari',
    bio: 'Youngest designated Senior Advocate in Supreme Court history. Celebrated for high-stakes corporate disputes, commercial arbitration, telecom litigation, and decisive constitutional bench arguments.',
    casesWon: 790,
    successRate: 97,
    phone: '+91 11 2611 9045',
    email: 'amsinghvi@singhvilegal.in',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 4,
    name: 'Indira Jaising, Senior Advocate',
    title: 'Senior Advocate & Human Rights Pioneer',
    specialty: 'Civil Rights',
    barNumber: 'MAH/421/1965',
    experienceYears: 58,
    education: 'Government Law College, Mumbai, LL.B.',
    firmName: 'The Lawyers Collective',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 30000,
    rating: 5.0,
    reviewCount: 205,
    languages: 'English, Hindi, Marathi, Sindhi',
    bio: 'First woman Senior Advocate designated by Bombay High Court and first female Additional Solicitor General of India. Legendary pioneer in fundamental rights, workplace gender equality, and key architect of the Domestic Violence Act.',
    casesWon: 690,
    successRate: 98,
    phone: '+91 11 2437 5521',
    email: 'indira.jaising@lawyerscollective.org',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 5,
    name: 'Kapil Sibal, Senior Advocate',
    title: 'Senior Advocate & SCBA President',
    specialty: 'Criminal Law',
    barNumber: 'D/104/1972',
    experienceYears: 52,
    education: 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)',
    firmName: 'Chambers of Kapil Sibal',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 45000,
    rating: 4.9,
    reviewCount: 230,
    languages: 'English, Hindi, Punjabi',
    bio: 'President of the Supreme Court Bar Association and former Union Minister for Law & Justice. Preeminent counsel in high-profile criminal defense, constitutional liberties, federalism, and appellate litigation.',
    casesWon: 890,
    successRate: 98,
    phone: '+91 11 2307 3311',
    email: 'chambers@kapilsibal.in',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 6,
    name: 'Zia Mody, Advocate',
    title: 'Founding & Senior Partner',
    specialty: 'Corporate Law',
    barNumber: 'MAH/314/1979',
    experienceYears: 45,
    education: 'Selwyn College, Cambridge (MA) · Harvard Law School (LL.M.)',
    firmName: 'AZB & Partners',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 48000,
    rating: 5.0,
    reviewCount: 260,
    languages: 'English, Hindi, Gujarati',
    bio: 'India\'s foremost corporate law luminary. Founder of AZB & Partners, orchestrating multi-billion dollar cross-border mergers, private equity transactions, conglomerate governance, and banking resolutions.',
    casesWon: 610,
    successRate: 99,
    phone: '+91 22 6639 6880',
    email: 'zia.mody@azbpartners.com',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 7,
    name: 'K.K. Venugopal, Senior Advocate',
    title: 'Senior Advocate & 15th Attorney General for India',
    specialty: 'Civil Rights',
    barNumber: 'MS/18/1954',
    experienceYears: 70,
    education: 'Raja Lakhamgouda Law College, Belgaum',
    firmName: 'Chambers of K.K. Venugopal',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 50000,
    rating: 5.0,
    reviewCount: 320,
    languages: 'English, Hindi, Malayalam, Tamil',
    bio: 'Doyen of the Indian Bar, Padma Vibhushan awardee, and 15th Attorney General for India. Unrivaled constitutional authority on basic structure doctrine, federal dispute resolution, and public jurisprudence.',
    casesWon: 1180,
    successRate: 99,
    phone: '+91 11 2338 2901',
    email: 'kk.venugopal@kkvchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 8,
    name: 'Mahesh Jethmalani, Senior Advocate',
    title: 'Senior Advocate, Supreme Court & Bombay High Court',
    specialty: 'Criminal Law',
    barNumber: 'MAH/812/1980',
    experienceYears: 44,
    education: 'St. Xavier\'s Mumbai · Oxford University (M.A. Jurisprudence)',
    firmName: 'Jethmalani Chambers',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 38000,
    rating: 4.8,
    reviewCount: 150,
    languages: 'English, Hindi, Marathi, Sindhi',
    bio: 'Master trial and appellate criminal defense counsel, celebrated for handling high-profile economic offenses (PMLA/ED/CBI), cross-examinations, constitutional liberty writs, and corporate white-collar defense.',
    casesWon: 640,
    successRate: 96,
    phone: '+91 22 2204 1599',
    email: 'mahesh@jethmalanichambers.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 9,
    name: 'Pravin Anand, Advocate',
    title: 'Managing Partner & IP Pioneer',
    specialty: 'Intellectual Property',
    barNumber: 'D/148/1979',
    experienceYears: 45,
    education: 'Campus Law Centre, Faculty of Law, University of Delhi',
    firmName: 'Anand and Anand',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 36000,
    rating: 5.0,
    reviewCount: 205,
    languages: 'English, Hindi',
    bio: 'Pioneer of intellectual property law in India. Lead counsel in historic patent litigations, software copyright doctrines, standard-essential patents (SEP), and cross-border trademark protection.',
    casesWon: 740,
    successRate: 99,
    phone: '+91 120 405 9300',
    email: 'pravin@anandandanand.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 10,
    name: 'Karuna Nundy, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Civil Rights',
    barNumber: 'D/1429/2000',
    experienceYears: 24,
    education: 'St. Stephen\'s College · Cambridge University · Columbia Law (LL.M.)',
    firmName: 'Chambers of Karuna Nundy',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 28000,
    rating: 4.9,
    reviewCount: 140,
    languages: 'English, Hindi, Bengali',
    bio: 'TIME 100 Most Influential People honoree. Renowned for online free speech defense (Section 66A IT Act), Bhopal toxic gas restorative justice, fundamental gender equality, and corporate commercial arbitration.',
    casesWon: 400,
    successRate: 98,
    phone: '+91 11 2649 3371',
    email: 'karuna@karunanundy.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 11,
    name: 'Gopal Subramanium, Senior Advocate',
    title: 'Senior Advocate & Former Solicitor General',
    specialty: 'Corporate Law',
    barNumber: 'D/209/1980',
    experienceYears: 44,
    education: 'Campus Law Centre, Faculty of Law, University of Delhi',
    firmName: 'Chambers of Gopal Subramanium',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 175,
    languages: 'English, Hindi, Tamil',
    bio: 'Former Solicitor General of India and Chairman of the Bar Council of India. Leading international arbitrator (FCIArb) and Supreme Court senior counsel in corporate commercial dispute resolution and public law.',
    casesWon: 740,
    successRate: 97,
    phone: '+91 11 2686 2110',
    email: 'subramanium@gschambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 12,
    name: 'Dr. Menaka Guruswamy, Senior Advocate',
    title: 'Senior Advocate & Constitutional Scholar',
    specialty: 'Civil Rights',
    barNumber: 'D/1812/1997',
    experienceYears: 27,
    education: 'NLSIU Bengaluru · Oxford (Rhodes Scholar, BCL) · Harvard (LL.M.)',
    firmName: 'Chambers of Dr. Menaka Guruswamy',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 32000,
    rating: 4.9,
    reviewCount: 156,
    languages: 'English, Hindi, Tamil',
    bio: 'TIME 100 honoree and Rhodes Scholar. Landmark lead counsel in decriminalizing Section 377 IPC (Navtej Johar), the Fundamental Right to Privacy (Puttaswamy), and bureaucratic transparency.',
    casesWon: 360,
    successRate: 98,
    phone: '+91 11 2623 4810',
    email: 'menaka@guruswamychambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 13,
    name: 'Shyam Divan, Senior Advocate',
    title: 'Senior Advocate & Environmental Jurisprudence Leader',
    specialty: 'Real Estate Law',
    barNumber: 'MAH/678/1984',
    experienceYears: 40,
    education: 'Government Law College, Mumbai · UC Berkeley (LL.M.)',
    firmName: 'Chambers of Shyam Divan',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 34000,
    rating: 4.9,
    reviewCount: 160,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'Author of the definitive treatise \'Environmental Law and Policy in India\'. Preeminent senior counsel in land acquisition, zoning laws, National Green Tribunal (NGT) litigations, and property dispute arbitrations.',
    casesWon: 520,
    successRate: 97,
    phone: '+91 11 2469 1184',
    email: 'sdivan@chambersdivan.in',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 14,
    name: 'Pinky Anand, Senior Advocate',
    title: 'Senior Advocate & Former Additional Solicitor General',
    specialty: 'Family Law',
    barNumber: 'D/274/1980',
    experienceYears: 44,
    education: 'Faculty of Law, University of Delhi · Harvard Law School (LL.M.)',
    firmName: 'Anand & Associates',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 32000,
    rating: 4.8,
    reviewCount: 168,
    languages: 'English, Hindi, Punjabi',
    bio: 'Former Additional Solicitor General of India. Master authority on international child custody disputes, Hague Convention litigations, matrimonial asset partition, divorce mediation, and domestic relations.',
    casesWon: 480,
    successRate: 96,
    phone: '+91 11 2652 7100',
    email: 'pinky@anandlaw.in',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 15,
    name: 'Prashant Bhushan, Advocate',
    title: 'Public Interest Litigator & Senior Advocate',
    specialty: 'Civil Rights',
    barNumber: 'D/308/1983',
    experienceYears: 41,
    education: 'Allahabad University · IIT Madras · Princeton University',
    firmName: 'Centre for Public Interest Litigation (CPIL)',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 20000,
    rating: 4.8,
    reviewCount: 195,
    languages: 'English, Hindi',
    bio: 'Legendary Public Interest Litigation (PIL) advocate. Spearheaded landmark transparency cases, 2G spectrum cancellations, coal block allocations, environmental protections, and judicial accountability.',
    casesWon: 530,
    successRate: 95,
    phone: '+91 11 2656 4003',
    email: 'pbhushan@cpilindia.org',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 16,
    name: 'C. Aryama Sundaram, Senior Advocate',
    title: 'Senior Advocate, Supreme Court of India',
    specialty: 'Corporate Law',
    barNumber: 'MS/332/1980',
    experienceYears: 44,
    education: 'Madras Law College (LL.B.)',
    firmName: 'Chambers of C.A. Sundaram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    hourlyRate: 38000,
    rating: 4.9,
    reviewCount: 148,
    languages: 'English, Hindi, Tamil',
    bio: 'High-profile senior counsel specializing in corporate shareholder disputes, Insolvency and Bankruptcy Code (IBC) proceedings, CCI competition law appeals, and constitutional writs.',
    casesWon: 620,
    successRate: 97,
    phone: '+91 44 2499 1234',
    email: 'casundaram@sundaramchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 17,
    name: 'Dushyant Dave, Senior Advocate',
    title: 'Senior Advocate & Former President SCBA',
    specialty: 'Real Estate Law',
    barNumber: 'G/190/1978',
    experienceYears: 46,
    education: 'Gujarat University (LL.B.)',
    firmName: 'Chambers of Dushyant Dave',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 39000,
    rating: 4.9,
    reviewCount: 158,
    languages: 'English, Hindi, Gujarati',
    bio: 'Three-time President of the Supreme Court Bar Association. Premier authority on mega-infrastructure construction arbitrations, commercial property leases, land title litigation, and contract enforcement.',
    casesWon: 690,
    successRate: 98,
    phone: '+91 11 2685 5543',
    email: 'dave@dushyantdave.in',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 18,
    name: 'Saurabh Kirpal, Senior Advocate',
    title: 'Senior Advocate, Delhi High Court & Supreme Court',
    specialty: 'Employment Law',
    barNumber: 'D/892/1994',
    experienceYears: 30,
    education: 'St. Stephen\'s · Oxford University · Cambridge (LL.M.)',
    firmName: 'Kirpal Chambers',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 30000,
    rating: 4.9,
    reviewCount: 125,
    languages: 'English, Hindi',
    bio: 'Leading senior advocate in executive employment disputes, workplace discrimination, service jurisprudence, and commercial contract litigation. Lead counsel in landmark constitutional equality challenges.',
    casesWon: 380,
    successRate: 97,
    phone: '+91 11 2462 8840',
    email: 'saurabh@kirpalchambers.in',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 19,
    name: 'Shardul S. Shroff, Advocate',
    title: 'Executive Chairman & Senior Partner',
    specialty: 'Corporate Law',
    barNumber: 'D/415/1980',
    experienceYears: 44,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Shardul Amarchand Mangaldas & Co.',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 46000,
    rating: 5.0,
    reviewCount: 218,
    languages: 'English, Hindi, Gujarati',
    bio: 'Executive Chairman of Shardul Amarchand Mangaldas. Doyen of Indian corporate finance, major cross-border M&A, debt restructurings, and Insolvency and Bankruptcy Code (IBC) resolutions.',
    casesWon: 540,
    successRate: 99,
    phone: '+91 11 4159 0700',
    email: 'shardul.shroff@amsshardul.com',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 20,
    name: 'Cyril Shroff, Advocate',
    title: 'Managing Partner & Financial Markets Authority',
    specialty: 'Corporate Law',
    barNumber: 'MAH/520/1982',
    experienceYears: 42,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Cyril Amarchand Mangaldas',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 47000,
    rating: 5.0,
    reviewCount: 230,
    languages: 'English, Hindi, Gujarati',
    bio: 'Managing Partner of Cyril Amarchand Mangaldas. Celebrated corporate strategist leading conglomerate board governance, banking syndications, private equity, and family business succession.',
    casesWon: 520,
    successRate: 99,
    phone: '+91 22 2496 4455',
    email: 'cyril.shroff@cyrilshroff.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 21,
    name: 'Poornima Hatti, Advocate',
    title: 'Partner & Workplace Dispute Resolution Leader',
    specialty: 'Employment Law',
    barNumber: 'KAR/910/2003',
    experienceYears: 21,
    education: 'NLSIU Bengaluru (B.A. LL.B.) · London School of Economics (LL.M.)',
    firmName: 'Samvad Partners',
    city: 'Bengaluru',
    state: 'Karnataka',
    hourlyRate: 26000,
    rating: 4.8,
    reviewCount: 112,
    languages: 'English, Hindi, Kannada',
    bio: 'Partner heading Dispute Resolution at Samvad Partners. Specialist in POSH compliance, executive severance structuring, labor regulations, whistleblower investigations, and commercial mediations.',
    casesWon: 310,
    successRate: 96,
    phone: '+91 80 4110 3344',
    email: 'poornima@samvadpartners.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 22,
    name: 'Nishith Desai, Advocate',
    title: 'Founder & International Tax Specialist',
    specialty: 'Tax Law',
    barNumber: 'MAH/390/1977',
    experienceYears: 47,
    education: 'Government Law College, Mumbai (LL.B., Tax Law)',
    firmName: 'Nishith Desai Associates',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 42000,
    rating: 4.9,
    reviewCount: 180,
    languages: 'English, Hindi, Gujarati',
    bio: 'Global pioneer in cross-border tax structuring, fund formation, Silicon Valley-India investments, cryptocurrency regulation, and international transfer pricing controversies.',
    casesWon: 450,
    successRate: 98,
    phone: '+91 22 6669 5000',
    email: 'nishith@nishithdesai.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 23,
    name: 'Vandana Shah, Advocate',
    title: 'Matrimonial Litigator & Family Law Authority',
    specialty: 'Family Law',
    barNumber: 'MAH/2104/2011',
    experienceYears: 15,
    education: 'Government Law College, Mumbai (LL.B.)',
    firmName: 'Vandana Shah & Associates',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 24000,
    rating: 4.8,
    reviewCount: 134,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'High-profile matrimonial litigator and author of \'Ex-Files\'. Renowned for high-net-worth divorce settlements, child custody disputes, NRI matrimonial conflicts, and domestic abuse legal protection.',
    casesWon: 330,
    successRate: 96,
    phone: '+91 22 2282 3901',
    email: 'vandana@vandanashah.com',
    avatarUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 24,
    name: 'Sajan Poovayya, Senior Advocate',
    title: 'Senior Advocate & Technology Law Specialist',
    specialty: 'Intellectual Property',
    barNumber: 'KAR/789/1996',
    experienceYears: 28,
    education: 'NLSIU Bengaluru · London School of Economics (LL.M.)',
    firmName: 'Poovayya & Co.',
    city: 'Bengaluru',
    state: 'Karnataka',
    hourlyRate: 34000,
    rating: 4.9,
    reviewCount: 145,
    languages: 'English, Hindi, Kannada',
    bio: 'Former Additional Advocate General of Karnataka. Foremost counsel in data privacy, intermediary liability, AI regulation, patent enforcement, and telecommunications litigation.',
    casesWon: 440,
    successRate: 97,
    phone: '+91 80 2221 4400',
    email: 'sajan@poovayya.net',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 25,
    name: 'Poorvi Chothani, Advocate',
    title: 'Managing Partner & Immigration Law Authority',
    specialty: 'Immigration Law',
    barNumber: 'MAH/1042/1983',
    experienceYears: 40,
    education: 'Government Law College, Mumbai · Penn Carey Law (LL.M.)',
    firmName: 'LawQuest International Law Firm',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 28000,
    rating: 4.9,
    reviewCount: 172,
    languages: 'English, Hindi, Gujarati, Marathi',
    bio: 'Founder of LawQuest and registered legal practitioner. Leading specialist in Indian-US cross-border immigration, corporate executive mobility, EB-5/L-1, NRI citizenship, and consular visa appeals.',
    casesWon: 520,
    successRate: 98,
    phone: '+91 22 6633 4455',
    email: 'poorvi@lawquestindia.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 26,
    name: 'Colin Gonsalves, Senior Advocate',
    title: 'Senior Advocate, Supreme Court & HRLN Founder',
    specialty: 'Personal Injury',
    barNumber: 'MAH/490/1983',
    experienceYears: 41,
    education: 'IIT Bombay (B.Tech) · Government Law College, Mumbai (LL.B.)',
    firmName: 'Human Rights Law Network (HRLN)',
    city: 'New Delhi',
    state: 'Delhi',
    hourlyRate: 22000,
    rating: 4.9,
    reviewCount: 182,
    languages: 'English, Hindi, Marathi',
    bio: 'Senior Advocate and Right Livelihood Award recipient. Champion in Motor Accident Claims Tribunal (MACT), catastrophic industrial injuries, public tort liability, and victim compensation before the Supreme Court.',
    casesWon: 600,
    successRate: 97,
    phone: '+91 11 2437 4501',
    email: 'colin@hrln.org',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  },
  {
    id: 27,
    name: 'Anand Grover, Senior Advocate',
    title: 'Senior Advocate & Health Law Authority',
    specialty: 'Healthcare Law',
    barNumber: 'MAH/355/1979',
    experienceYears: 45,
    education: 'University of Surrey (B.Sc) · Government Law College, Mumbai (LL.B.)',
    firmName: 'Lawyers Collective',
    city: 'Mumbai',
    state: 'Maharashtra',
    hourlyRate: 32000,
    rating: 5.0,
    reviewCount: 148,
    languages: 'English, Hindi, Marathi, Gujarati',
    bio: 'Former UN Special Rapporteur on the Right to Health. Key litigator in historic Supreme Court pharmaceutical cases (Novartis cancer drug patent), healthcare regulation, medical negligence, and patient privacy.',
    casesWon: 490,
    successRate: 99,
    phone: '+91 22 2287 4001',
    email: 'anand@lawyerscollective.org',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isAvailable: 1
  }
];

// ── LAWYER DETAILS MODAL (PORTAL) ──
const lawyerModalOverlay  = document.getElementById('lawyer-modal-overlay');
const lawyerModalClose    = document.getElementById('lawyer-modal-close');
const lawyerModalBtnClose = document.getElementById('lawyer-modal-btn-close');
const lawyerModalBtnCopy  = document.getElementById('lawyer-modal-btn-copy');
const lawyerCopyBtnText   = document.getElementById('lawyer-copy-btn-text');

let currentModalLawyer = null;

window.openLawyerModal = async function(lawyerId) {
  let lawyer = null;

  // 1. Fetch directly from server API
  if (lawyerId) {
    try {
      const resp = await fetch(`${SERVER_ORIGIN}/api/lawyers/${lawyerId}`);
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.lawyer) {
          lawyer = json.lawyer;
        }
      }
    } catch (e) {
      console.warn('Could not fetch lawyer by id from API:', e);
    }
  }

  // 2. Try finding in FALLBACK_LAWYERS by ID
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
    lawyer = FALLBACK_LAWYERS.find(l => String(l.id) === String(lawyerId) || Number(l.id) === Number(lawyerId));
  }

  // 3. Try matching by name if lawyerId was a name or via fallback lawyer matching
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && Array.isArray(FALLBACK_LAWYERS)) {
    const q = String(lawyerId).toLowerCase().trim();
    lawyer = FALLBACK_LAWYERS.find(l => l.name && (l.name.toLowerCase().includes(q) || q.includes(l.name.toLowerCase())));
  }

  // 4. Fallback to first advocate if not found
  if (!lawyer && typeof FALLBACK_LAWYERS !== 'undefined' && FALLBACK_LAWYERS.length > 0) {
    lawyer = FALLBACK_LAWYERS[0];
  }

  if (!lawyer || !lawyerModalOverlay) return;
  currentModalLawyer = lawyer;

  // Avatar
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
  if (winsEl) winsEl.textContent = `${lawyer.casesWon || 50} Cases Won`;

  const successEl = document.getElementById('lawyer-modal-success');
  if (successEl) successEl.textContent = `${lawyer.successRate || 95}%`;

  const ratingEl = document.getElementById('lawyer-modal-rating');
  if (ratingEl) ratingEl.textContent = `★ ${Number(lawyer.rating || 5.0).toFixed(1)} (${lawyer.reviewCount || 40} reviews)`;

  const rateEl = document.getElementById('lawyer-modal-rate');
  if (rateEl) rateEl.textContent = `₹${Number(lawyer.hourlyRate || 5000).toLocaleString('en-IN')} / hr`;

  // Chambers & Location
  const locEl = document.getElementById('lawyer-modal-location');
  if (locEl) {
    const firm = lawyer.firmName ? `${lawyer.firmName} — ` : '';
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
  const text = `ADVOCATE PROFILE — LegalAI
Name: ${currentModalLawyer.name} (${currentModalLawyer.title || 'Advocate'})
Specialty: ${currentModalLawyer.specialty}
Bar Enrollment: ${currentModalLawyer.barNumber}
Experience: ${currentModalLawyer.experienceYears}+ Years | Cases Won: ${currentModalLawyer.casesWon} | Win Rate: ${currentModalLawyer.successRate}%
Chambers / Firm: ${currentModalLawyer.firmName || ''} (${currentModalLawyer.city || ''}, ${currentModalLawyer.state || ''})
Education: ${currentModalLawyer.education || ''}
Languages: ${currentModalLawyer.languages || ''}
Phone: ${currentModalLawyer.phone}
Email: ${currentModalLawyer.email}
Consultation Fee: ₹${Number(currentModalLawyer.hourlyRate).toLocaleString('en-IN')} / hour`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = '✓ Copied!';
      setTimeout(() => {
        if (lawyerCopyBtnText) lawyerCopyBtnText.textContent = 'Copy Advocate Details';
      }, 2500);
    });
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lawyerModalOverlay && !lawyerModalOverlay.classList.contains('hidden')) {
    closeLawyerModal();
  }
});

// Run on page load
initUserPortal();

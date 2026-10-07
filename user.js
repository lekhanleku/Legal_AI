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
            <div class="consult-lawyer-profile">
              ${c.lawyerAvatar ? `
                <img src="${c.lawyerAvatar}" class="consult-lawyer-avatar" alt="${escapeHtml(c.lawyerName)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"/>
                <div class="consult-avatar-fallback" style="display:none;">${getInitials(c.lawyerName)}</div>
              ` : `
                <div class="consult-avatar-fallback">${getInitials(c.lawyerName)}</div>
              `}
              <div>
                <h4 class="consult-lawyer-name">${escapeHtml(c.lawyerName)}</h4>
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
                <span>$${c.lawyerRate || '250'}/hr</span>
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

// Run on page load
initUserPortal();

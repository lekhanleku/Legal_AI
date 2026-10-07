/* ================================================================
   LEGALAI — MASTER ADMIN DASHBOARD LOGIC (admin.js)
   ================================================================ */

const SERVER_ORIGIN = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000'
  : window.location.origin;

let currentAdmin = null;
let allUsers = [];
let allConsultations = [];
let allLawyers = [];

// DOM Elements
const accessGate = document.getElementById('admin-access-gate');
const dashboardContent = document.getElementById('admin-dashboard-content');
const loginForm = document.getElementById('admin-login-form');
const btnQuickAdmin = document.getElementById('btn-quick-admin-login');
const btnLogout = document.getElementById('btn-admin-logout');

function getAuthToken() {
  return localStorage.getItem('legalai_token');
}

function setAdminSession(token, user) {
  localStorage.setItem('legalai_token', token);
  localStorage.setItem('legalai_user', JSON.stringify(user));
  currentAdmin = user;
}

function clearAdminSession() {
  localStorage.removeItem('legalai_token');
  localStorage.removeItem('legalai_user');
  currentAdmin = null;
}

// ── INITIALIZE ADMIN DASHBOARD ──
async function initAdminDashboard() {
  const token = getAuthToken();
  if (!token) {
    showAccessGate();
    return;
  }

  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success && data.user && data.user.role === 'admin') {
      currentAdmin = data.user;
      showDashboard();
      loadAdminStats();
      loadAdminUsers();
      loadAdminConsultations();
      loadAdminLawyers();
      loadAdminAIChats();
    } else {
      showAccessGate('Administrator privileges (role: admin) required.');
    }
  } catch (err) {
    console.error('Admin Auth Error:', err);
    showAccessGate();
  }
}

function showAccessGate(msg = '') {
  accessGate?.classList.remove('hidden');
  dashboardContent?.classList.add('hidden');
  if (msg) {
    const alertEl = document.getElementById('admin-gate-alert');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = msg;
    }
  }
}

function showDashboard() {
  accessGate?.classList.add('hidden');
  dashboardContent?.classList.remove('hidden');

  const nameEl = document.getElementById('admin-header-name');
  if (nameEl && currentAdmin) nameEl.textContent = currentAdmin.name;
}

// ── LOAD PLATFORM STATS ──
async function loadAdminStats() {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) {
      const stats = data.stats;

      // Users KPI
      const elUsers = document.getElementById('kpi-admin-users');
      const elUsersSub = document.getElementById('kpi-admin-users-sub');
      if (elUsers) elUsers.textContent = stats.users.totalUsers || 0;
      if (elUsersSub) {
        const rb = stats.users.roleBreakdown || {};
        elUsersSub.textContent = `${rb.user || 0} Clients · ${rb.lawyer || 0} Lawyers · ${rb.admin || 0} Admins`;
      }

      // Consultations KPI
      const elConsults = document.getElementById('kpi-admin-consults');
      const elConsultsSub = document.getElementById('kpi-admin-consults-sub');
      if (elConsults) elConsults.textContent = stats.consultations.total || 0;
      if (elConsultsSub) {
        const bs = stats.consultations.byStatus || {};
        elConsultsSub.textContent = `${bs.pending || 0} Pending · ${bs.confirmed || 0} Confirmed`;
      }

      // Lawyers KPI
      const elLawyers = document.getElementById('kpi-admin-lawyers');
      const elLawyersSub = document.getElementById('kpi-admin-lawyers-sub');
      if (elLawyers) elLawyers.textContent = stats.lawyers.totalLawyers || 0;
      if (elLawyersSub) {
        elLawyersSub.textContent = `${stats.lawyers.specialtiesCount || 0} Specialties · ${stats.lawyers.avgSuccessRate || 96}% Win Rate`;
      }

      // AI Queries KPI
      const elAI = document.getElementById('kpi-admin-ai-queries');
      if (elAI) elAI.textContent = stats.ai.totalQueries || 0;

      // Top AI Categories breakdown
      const domainsWrap = document.getElementById('ai-domains-breakdown');
      if (domainsWrap && stats.ai.topCategories) {
        if (stats.ai.topCategories.length === 0) {
          domainsWrap.innerHTML = '<div style="color:#94a3b8; font-size:0.84rem;">No domain sessions recorded yet.</div>';
        } else {
          domainsWrap.innerHTML = stats.ai.topCategories.map(cat => `
            <div style="display:flex; justify-content:space-between; font-size:0.84rem;">
              <span style="color:#cbd5e1;">${escapeHtml(cat.category)}</span>
              <strong style="color:#dfb77c;">${cat.count} inquiries</strong>
            </div>
          `).join('');
        }
      }
    }
  } catch (err) {
    console.error('Error fetching admin stats:', err);
  }
}

// ── TAB 1: USERS MANAGEMENT ──
async function loadAdminUsers(search = '', role = 'all') {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const q = new URLSearchParams({ search, role, limit: 100 });
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    allUsers = data.users || [];

    const badge = document.getElementById('tab-badge-users');
    if (badge) badge.textContent = data.total || allUsers.length;

    if (allUsers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">No users found matching your criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = allUsers.map(u => `
      <tr id="user-row-${u.id}">
        <td>#${u.id}</td>
        <td style="color:#fff; font-weight:600;">${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>
          <select class="portal-form-select" style="padding:4px 8px; font-size:0.78rem; width:auto;" onchange="updateUserRole(${u.id}, this.value)">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>Client (User)</option>
            <option value="lawyer" ${u.role === 'lawyer' ? 'selected' : ''}>Lawyer</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrator</option>
          </select>
        </td>
        <td>
          <button type="button" class="portal-filter-btn" style="padding:3px 8px; font-size:0.75rem;" onclick="toggleUserVerify(${u.id})">
            ${u.isVerified ? '<span style="color:#86efac;">✓ Verified</span>' : '<span style="color:#94a3b8;">○ Unverified</span>'}
          </button>
        </td>
        <td style="font-size:0.78rem;">${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <button type="button" class="btn-action-icon danger" title="Delete Account" onclick="deleteUser(${u.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#f87171; padding:20px;">Error loading users: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.updateUserRole = async function(id, newRole) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    const data = await res.json();
    if (data.success) {
      loadAdminStats();
    } else {
      alert(data.message || 'Error updating role');
      loadAdminUsers();
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.toggleUserVerify = async function(id) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users/${id}/verify`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      loadAdminUsers();
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.deleteUser = async function(id) {
  if (!confirm(`Are you sure you want to permanently delete user #${id}?`)) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      loadAdminUsers();
      loadAdminStats();
    } else {
      alert(data.message || 'Error deleting user');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

// ── TAB 2: CONSULTATIONS MANAGEMENT ──
async function loadAdminConsultations(search = '', status = 'all') {
  const tbody = document.getElementById('admin-consults-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const q = new URLSearchParams({ search, status, limit: 100 });
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/consultations?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    allConsultations = data.consultations || [];

    const badge = document.getElementById('tab-badge-bookings');
    if (badge) badge.textContent = data.total || allConsultations.length;

    if (allConsultations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">No consultations recorded.</td></tr>`;
      return;
    }

    tbody.innerHTML = allConsultations.map(c => `
      <tr>
        <td>#${c.id}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(c.clientName)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.clientEmail)} · ${escapeHtml(c.clientPhone || '')}</div>
        </td>
        <td>
          <div style="color:#dfb77c; font-weight:600;">${escapeHtml(c.lawyerName)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.lawyerSpecialty)}</div>
        </td>
        <td style="font-size:0.82rem; white-space:nowrap;">${escapeHtml(c.preferredDate)}</td>
        <td style="max-width:240px; font-size:0.78rem; color:#cbd5e1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(c.caseSummary)}">
          ${escapeHtml(c.caseSummary)}
        </td>
        <td>
          <span class="status-badge ${c.status}">${c.status}</span>
        </td>
        <td>
          <div class="table-actions">
            ${c.status !== 'confirmed' ? `
              <button class="btn-action-icon success" title="Confirm Booking" onclick="updateConsultStatus(${c.id}, 'confirmed')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            ` : ''}
            ${c.status !== 'completed' ? `
              <button class="btn-action-icon" title="Mark Completed" onclick="updateConsultStatus(${c.id}, 'completed')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </button>
            ` : ''}
            ${c.status !== 'cancelled' ? `
              <button class="btn-action-icon danger" title="Cancel Booking" onclick="updateConsultStatus(${c.id}, 'cancelled')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#f87171; padding:20px;">Error loading bookings: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.updateConsultStatus = async function(id, newStatus) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/consultations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      loadAdminConsultations();
      loadAdminStats();
    } else {
      alert(data.message || 'Error updating status');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

// ── TAB 3: LAWYERS DIRECTORY CONTROL ──
async function loadAdminLawyers(search = '') {
  const tbody = document.getElementById('admin-lawyers-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const q = new URLSearchParams({ search, limit: 100 });
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    allLawyers = data.lawyers || [];

    const badge = document.getElementById('tab-badge-attorneys');
    if (badge) badge.textContent = allLawyers.length;

    tbody.innerHTML = allLawyers.map(l => `
      <tr>
        <td>#${l.id}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(l.name)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(l.firmName || '')} · ${escapeHtml(l.city)}, ${escapeHtml(l.state)}</div>
        </td>
        <td><span class="meta-pill meta-pill-gold">${escapeHtml(l.specialty)}</span></td>
        <td style="font-size:0.8rem; font-family:monospace;">${escapeHtml(l.barNumber)}</td>
        <td style="color:#86efac; font-weight:700;">$${l.hourlyRate}/hr</td>
        <td>★ ${l.rating || 5.0} (${l.casesWon || 20} wins)</td>
        <td>
          <button type="button" class="portal-filter-btn" style="padding:3px 8px; font-size:0.75rem;" onclick="toggleLawyerAvail(${l.id}, ${l.isAvailable ? 0 : 1})">
            ${l.isAvailable ? '<span style="color:#86efac;">● Available</span>' : '<span style="color:#f87171;">○ Booked</span>'}
          </button>
        </td>
        <td>
          <button type="button" class="btn-action-icon danger" title="Remove Lawyer" onclick="deleteLawyer(${l.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:#f87171; padding:20px;">Error loading lawyers: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.toggleLawyerAvail = async function(id, newAvail) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isAvailable: newAvail })
    });
    const data = await res.json();
    if (data.success) {
      loadAdminLawyers();
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.deleteLawyer = async function(id) {
  if (!confirm(`Remove attorney #${id} from the public directory?`)) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      loadAdminLawyers();
      loadAdminStats();
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

// ── TAB 4: AI OPERATIONS & LOGS ──
async function loadAdminAIChats() {
  const tbody = document.getElementById('admin-ai-chats-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/chats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const chats = data.chats || [];

    if (chats.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#94a3b8;">No AI queries recorded in SQLite database.</td></tr>`;
      return;
    }

    tbody.innerHTML = chats.map(c => `
      <tr>
        <td>#${c.id}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(c.userName || 'Anonymous Client')}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.userEmail || 'Guest')}</div>
        </td>
        <td style="max-width:380px; color:#cbd5e1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(c.message)}">
          ${escapeHtml(c.message)}
        </td>
        <td>
          <span class="meta-pill meta-pill-gold">${escapeHtml(c.category || 'General Legal Advisory')}</span>
        </td>
        <td style="font-size:0.78rem; white-space:nowrap;">${new Date(c.timestamp).toLocaleString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#f87171; padding:20px;">Error loading AI logs: ${escapeHtml(err.message)}</td></tr>`;
  }
}

// ── MODAL UTILITIES ──
window.openModal = function(id) {
  document.getElementById(id)?.classList.remove('hidden');
};

window.closeModal = function(id) {
  document.getElementById(id)?.classList.add('hidden');
};

document.getElementById('btn-open-create-user')?.addEventListener('click', () => openModal('modal-create-user'));
document.getElementById('btn-open-add-lawyer')?.addEventListener('click', () => openModal('modal-add-lawyer'));

// ── FORM: CREATE USER ──
document.getElementById('form-create-user')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-user-name').value.trim();
  const email = document.getElementById('new-user-email').value.trim();
  const role = document.getElementById('new-user-role').value;
  const password = document.getElementById('new-user-password').value;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, role, password })
    });

    const data = await res.json();
    if (data.success) {
      closeModal('modal-create-user');
      document.getElementById('form-create-user').reset();
      loadAdminUsers();
      loadAdminStats();
    } else {
      alert(data.message || 'Error creating user');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
});

// ── FORM: ADD LAWYER ──
document.getElementById('form-add-lawyer')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('new-lawyer-name').value.trim(),
    title: document.getElementById('new-lawyer-title').value.trim(),
    specialty: document.getElementById('new-lawyer-specialty').value.trim(),
    barNumber: document.getElementById('new-lawyer-barnum').value.trim(),
    firmName: document.getElementById('new-lawyer-firm').value.trim(),
    hourlyRate: Number(document.getElementById('new-lawyer-rate').value),
    city: document.getElementById('new-lawyer-city').value.trim(),
    state: document.getElementById('new-lawyer-state').value.trim(),
    experienceYears: Number(document.getElementById('new-lawyer-exp').value),
    phone: document.getElementById('new-lawyer-phone').value.trim(),
    email: document.getElementById('new-lawyer-email').value.trim(),
    bio: document.getElementById('new-lawyer-bio').value.trim()
  };

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      closeModal('modal-add-lawyer');
      document.getElementById('form-add-lawyer').reset();
      loadAdminLawyers();
      loadAdminStats();
    } else {
      alert(data.message || 'Error adding lawyer');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
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

// ── FILTER CONTROLS ──
document.querySelectorAll('#users-role-filters .portal-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#users-role-filters .portal-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const role = btn.getAttribute('data-role');
    const search = document.getElementById('users-search-input')?.value || '';
    loadAdminUsers(search, role);
  });
});

document.getElementById('users-search-input')?.addEventListener('input', (e) => {
  const activeRoleBtn = document.querySelector('#users-role-filters .portal-filter-btn.active');
  const role = activeRoleBtn ? activeRoleBtn.getAttribute('data-role') : 'all';
  loadAdminUsers(e.target.value, role);
});

document.querySelectorAll('#admin-consults-filters .portal-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#admin-consults-filters .portal-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const status = btn.getAttribute('data-status');
    const search = document.getElementById('consults-search-input')?.value || '';
    loadAdminConsultations(search, status);
  });
});

document.getElementById('consults-search-input')?.addEventListener('input', (e) => {
  const activeStatusBtn = document.querySelector('#admin-consults-filters .portal-filter-btn.active');
  const status = activeStatusBtn ? activeStatusBtn.getAttribute('data-status') : 'all';
  loadAdminConsultations(e.target.value, status);
});

document.getElementById('lawyers-search-input')?.addEventListener('input', (e) => {
  loadAdminLawyers(e.target.value);
});

// ── AUTH HANDLERS ──
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-gate-email').value.trim();
  const password = document.getElementById('admin-gate-password').value;
  const alertEl = document.getElementById('admin-gate-alert');

  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success && data.user && data.user.role === 'admin') {
      setAdminSession(data.token, data.user);
      initAdminDashboard();
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.textContent = data.user && data.user.role !== 'admin'
          ? 'Access denied: Account is not an administrator.'
          : (data.message || 'Invalid administrator credentials');
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Server connection error: ' + err.message;
    }
  }
});

btnQuickAdmin?.addEventListener('click', async () => {
  const alertEl = document.getElementById('admin-gate-alert');
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalai.com', password: 'admin1234' })
    });

    const data = await res.json();
    if (data.success && data.user && data.user.role === 'admin') {
      setAdminSession(data.token, data.user);
      initAdminDashboard();
    } else {
      if (alertEl) {
        alertEl.style.display = 'block';
        alertEl.textContent = 'Admin login failed: ' + data.message;
      }
    }
  } catch (err) {
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.textContent = 'Error: ' + err.message;
    }
  }
});

btnLogout?.addEventListener('click', () => {
  clearAdminSession();
  showAccessGate();
});

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// Run on page load
initAdminDashboard();

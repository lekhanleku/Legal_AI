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
let allCourts = [];

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
      loadAdminCourts();
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

      // Courts KPI
      const elCourts = document.getElementById('kpi-admin-courts');
      const elCourtsSub = document.getElementById('kpi-admin-courts-sub');
      if (elCourts && stats.courts) {
        elCourts.textContent = stats.courts.totalCourts || 0;
        if (elCourtsSub) {
          elCourtsSub.textContent = `${stats.courts.activeCourts || 0} Active · ${stats.courts.jurisdictions?.length || 0} Jurisdictions`;
        }
      }

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
    if (badge) badge.textContent = allUsers.length;

    if (allUsers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">No matching users found.</td></tr>`;
      return;
    }

    tbody.innerHTML = allUsers.map(u => `
      <tr>
        <td>#${u.id}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(u.name)}</div>
        </td>
        <td>${escapeHtml(u.email)}</td>
        <td>
          <select class="portal-form-select" style="padding:4px 8px; font-size:0.8rem; width:auto;" onchange="changeUserRole(${u.id}, this.value)">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>Client (user)</option>
            <option value="lawyer" ${u.role === 'lawyer' ? 'selected' : ''}>Lawyer</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>
          <button type="button" class="portal-filter-btn" style="padding:3px 8px; font-size:0.75rem;" onclick="toggleUserVerify(${u.id}, ${u.isVerified ? 0 : 1})">
            ${u.isVerified ? '<span style="color:#86efac;">✓ Verified</span>' : '<span style="color:#94a3b8;">○ Unverified</span>'}
          </button>
        </td>
        <td style="font-size:0.78rem; color:#94a3b8;">${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <button type="button" class="btn-action-icon danger" title="Delete User" onclick="deleteUser(${u.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#f87171; padding:20px;">Error loading users: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.changeUserRole = async function(id, newRole) {
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
      loadAdminUsers();
      loadAdminStats();
    } else {
      alert(data.message || 'Error updating role');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.toggleUserVerify = async function(id, isVerified) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/users/${id}/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isVerified })
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
  if (!confirm(`Are you sure you want to permanently delete user account #${id}?`)) return;

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

// ── TAB 2: CONSULTATIONS & BOOKINGS ──
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
    if (badge) badge.textContent = allConsultations.length;

    if (allConsultations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">No consultation bookings found.</td></tr>`;
      return;
    }

    tbody.innerHTML = allConsultations.map(c => `
      <tr>
        <td>#${c.id}</td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(c.clientName)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.clientEmail)}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#dfb77c;">${escapeHtml(c.lawyerName)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.lawyerSpecialty || '')} · $${c.lawyerRate}/hr</div>
        </td>
        <td style="font-size:0.82rem; white-space:nowrap;">${escapeHtml(c.preferredDate)}</td>
        <td style="max-width:280px; font-size:0.82rem; color:#cbd5e1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(c.caseSummary)}">
          ${escapeHtml(c.caseSummary)}
        </td>
        <td>
          <select class="portal-form-select" style="padding:4px 8px; font-size:0.8rem; width:auto;" onchange="changeConsultStatus(${c.id}, this.value)">
            <option value="pending" ${c.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${c.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="completed" ${c.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${c.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button type="button" class="btn-action-icon danger" title="Delete Booking" onclick="deleteConsultation(${c.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#f87171; padding:20px;">Error loading consultations: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.changeConsultStatus = async function(id, newStatus) {
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

window.deleteConsultation = async function(id) {
  if (!confirm(`Permanently remove consultation record #${id}?`)) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/consultations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      loadAdminConsultations();
      loadAdminStats();
    } else {
      alert(data.message || 'Error deleting consultation');
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

    if (allLawyers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">No matching lawyers found.</td></tr>`;
      return;
    }

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
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-action-icon" title="Edit Attorney Details" onclick="openEditLawyerModal(${l.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button type="button" class="btn-action-icon danger" title="Remove Lawyer" onclick="deleteLawyer(${l.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
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

window.openEditLawyerModal = async function(id) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success || !data.lawyer) {
      alert(data.message || 'Could not load attorney profile');
      return;
    }

    const l = data.lawyer;
    document.getElementById('edit-lawyer-id').value = l.id;
    document.getElementById('edit-lawyer-name').value = l.name || '';
    document.getElementById('edit-lawyer-title').value = l.title || '';
    document.getElementById('edit-lawyer-specialty').value = l.specialty || '';
    document.getElementById('edit-lawyer-barnum').value = l.barNumber || '';
    document.getElementById('edit-lawyer-firm').value = l.firmName || '';
    document.getElementById('edit-lawyer-rate').value = l.hourlyRate || 250;
    document.getElementById('edit-lawyer-city').value = l.city || '';
    document.getElementById('edit-lawyer-state').value = l.state || '';
    document.getElementById('edit-lawyer-edu').value = l.education || '';
    document.getElementById('edit-lawyer-exp').value = l.experienceYears || '';
    document.getElementById('edit-lawyer-languages').value = l.languages || '';
    document.getElementById('edit-lawyer-phone').value = l.phone || '';
    document.getElementById('edit-lawyer-email').value = l.email || '';
    document.getElementById('edit-lawyer-avatar').value = l.avatarUrl || '';
    document.getElementById('edit-lawyer-rating').value = l.rating || 5.0;
    document.getElementById('edit-lawyer-wins').value = l.casesWon || 25;
    document.getElementById('edit-lawyer-bio').value = l.bio || '';

    openModal('modal-edit-lawyer');
  } catch (err) {
    alert('Error loading lawyer: ' + err.message);
  }
};

// ── TAB 4: COURTS DIRECTORY CONTROL ──
async function loadAdminCourts(search = '', jurisdiction = 'all') {
  const tbody = document.getElementById('admin-courts-tbody');
  if (!tbody) return;

  const token = getAuthToken();
  try {
    const q = new URLSearchParams({ search, jurisdiction, limit: 100 });
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    allCourts = data.courts || [];

    const badge = document.getElementById('tab-badge-courts');
    if (badge) badge.textContent = allCourts.length;

    if (allCourts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">No matching court venues found.</td></tr>`;
      return;
    }

    tbody.innerHTML = allCourts.map(c => `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:700; color:#c084fc; background:rgba(168,85,247,0.15); padding:3px 7px; border-radius:4px;">
            ${escapeHtml(c.code)}
          </span>
        </td>
        <td>
          <div style="font-weight:600; color:#fff;">${escapeHtml(c.name)}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${escapeHtml(c.address || '')}, ${escapeHtml(c.city)}, ${escapeHtml(c.state)} ${escapeHtml(c.zipCode || '')}</div>
        </td>
        <td>
          <span class="meta-pill meta-pill-blue" style="font-size:0.72rem;">${escapeHtml(c.jurisdiction)}</span>
          <div style="font-size:0.72rem; color:#94a3b8; margin-top:2px;">${escapeHtml(c.level || 'Court')}</div>
        </td>
        <td style="font-size:0.82rem; color:#cbd5e1;">${escapeHtml(c.chiefJudge || 'Presiding Judge')}</td>
        <td style="font-size:0.8rem; font-family:monospace; color:#dfb77c;">${escapeHtml(c.filingSystem || 'CM/ECF')}</td>
        <td style="font-size:0.78rem;">
          <div>${escapeHtml(c.phone || '')}</div>
          ${c.website ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noreferrer" style="color:#7dd3fc; text-decoration:none; font-size:0.74rem;">Website ↗</a>` : ''}
        </td>
        <td>
          <button type="button" class="portal-filter-btn" style="padding:3px 8px; font-size:0.75rem;" onclick="toggleCourtAvail(${c.id}, ${c.isAvailable ? 0 : 1})">
            ${c.isAvailable ? '<span style="color:#86efac;">● Active</span>' : '<span style="color:#f87171;">○ Recessed</span>'}
          </button>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-action-icon" title="Edit Court Venue" onclick="openEditCourtModal(${c.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button type="button" class="btn-action-icon danger" title="Remove Court Venue" onclick="deleteCourt(${c.id})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:#f87171; padding:20px;">Error loading courts: ${escapeHtml(err.message)}</td></tr>`;
  }
}

window.toggleCourtAvail = async function(id, newAvail) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isAvailable: newAvail })
    });
    const data = await res.json();
    if (data.success) {
      loadAdminCourts();
      loadAdminStats();
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.deleteCourt = async function(id) {
  if (!confirm(`Are you sure you want to permanently remove court venue #${id} from directory?`)) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      loadAdminCourts();
      loadAdminStats();
    } else {
      alert(data.message || 'Error removing court');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.openEditCourtModal = async function(id) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success || !data.court) {
      alert(data.message || 'Could not load court details');
      return;
    }

    const c = data.court;
    document.getElementById('edit-court-id').value = c.id;
    document.getElementById('edit-court-name').value = c.name || '';
    document.getElementById('edit-court-code').value = c.code || '';
    document.getElementById('edit-court-jurisdiction').value = c.jurisdiction || 'Federal District';
    document.getElementById('edit-court-level').value = c.level || 'Trial';
    document.getElementById('edit-court-circuit').value = c.circuit || '';
    document.getElementById('edit-court-city').value = c.city || '';
    document.getElementById('edit-court-state').value = c.state || '';
    document.getElementById('edit-court-address').value = c.address || '';
    document.getElementById('edit-court-zip').value = c.zipCode || '';
    document.getElementById('edit-court-phone').value = c.phone || '';
    document.getElementById('edit-court-website').value = c.website || '';
    document.getElementById('edit-court-hours').value = c.clerkHours || '';
    document.getElementById('edit-court-filing').value = c.filingSystem || '';
    document.getElementById('edit-court-judge').value = c.chiefJudge || '';
    document.getElementById('edit-court-divisions').value = c.divisions || '';
    document.getElementById('edit-court-overview').value = c.overview || '';

    openModal('modal-edit-court');
  } catch (err) {
    alert('Error loading court venue: ' + err.message);
  }
};

// ── TAB 5: AI OPERATIONS & LOGS ──
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
document.getElementById('btn-open-add-court')?.addEventListener('click', () => openModal('modal-add-court'));

// ── PREFILL HELPERS ──
document.getElementById('btn-prefill-lawyer')?.addEventListener('click', () => {
  document.getElementById('new-lawyer-name').value = 'Marcus Vance, Esq.';
  document.getElementById('new-lawyer-title').value = 'Managing Partner & Senior Trial Litigator';
  document.getElementById('new-lawyer-specialty').value = 'Corporate Law';
  document.getElementById('new-lawyer-barnum').value = 'NY Bar #9182341';
  document.getElementById('new-lawyer-firm').value = 'Vance & Sterling LLP';
  document.getElementById('new-lawyer-rate').value = '425';
  document.getElementById('new-lawyer-city').value = 'New York';
  document.getElementById('new-lawyer-state').value = 'NY';
  document.getElementById('new-lawyer-edu').value = 'Columbia Law School, J.D.';
  document.getElementById('new-lawyer-exp').value = '15';
  document.getElementById('new-lawyer-languages').value = 'English, German, French';
  document.getElementById('new-lawyer-phone').value = '(212) 555-0144';
  document.getElementById('new-lawyer-email').value = 'marcus.vance@vancesterling.com';
  document.getElementById('new-lawyer-avatar').value = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400';
  document.getElementById('new-lawyer-rating').value = '4.9';
  document.getElementById('new-lawyer-wins').value = '115';
  document.getElementById('new-lawyer-bio').value = 'Senior trial counselor specializing in corporate governance, securities disputes, startup capitalization, and high-stakes cross-border mergers.';
});

document.getElementById('btn-prefill-court')?.addEventListener('click', () => {
  document.getElementById('new-court-name').value = 'U.S. District Court for the Southern District of New York';
  document.getElementById('new-court-code').value = 'US-SDNY';
  document.getElementById('new-court-jurisdiction').value = 'Federal District';
  document.getElementById('new-court-level').value = 'Trial';
  document.getElementById('new-court-circuit').value = '2nd Circuit';
  document.getElementById('new-court-city').value = 'New York';
  document.getElementById('new-court-state').value = 'NY';
  document.getElementById('new-court-address').value = '500 Pearl Street';
  document.getElementById('new-court-zip').value = '10007';
  document.getElementById('new-court-phone').value = '(212) 805-0136';
  document.getElementById('new-court-website').value = 'https://www.nysd.uscourts.gov';
  document.getElementById('new-court-hours').value = '8:30 AM - 5:00 PM ET';
  document.getElementById('new-court-filing').value = 'CM/ECF (NextGen)';
  document.getElementById('new-court-judge').value = 'Chief Judge Laura Taylor Swain';
  document.getElementById('new-court-divisions').value = 'Civil, Criminal, Admiralty, Commercial';
  document.getElementById('new-court-overview').value = 'Premier federal district trial venue possessing broad subject-matter jurisdiction over commercial, financial, international trade, and high-profile federal criminal proceedings.';
});

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
    education: document.getElementById('new-lawyer-edu').value.trim(),
    experienceYears: Number(document.getElementById('new-lawyer-exp').value) || 5,
    languages: document.getElementById('new-lawyer-languages').value.trim(),
    phone: document.getElementById('new-lawyer-phone').value.trim(),
    email: document.getElementById('new-lawyer-email').value.trim(),
    avatarUrl: document.getElementById('new-lawyer-avatar').value.trim(),
    rating: Number(document.getElementById('new-lawyer-rating').value) || 4.9,
    casesWon: Number(document.getElementById('new-lawyer-wins').value) || 25,
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
      alert(data.message || 'Error adding attorney');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
});

// ── FORM: EDIT LAWYER ──
document.getElementById('form-edit-lawyer')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-lawyer-id').value;
  const payload = {
    name: document.getElementById('edit-lawyer-name').value.trim(),
    title: document.getElementById('edit-lawyer-title').value.trim(),
    specialty: document.getElementById('edit-lawyer-specialty').value.trim(),
    barNumber: document.getElementById('edit-lawyer-barnum').value.trim(),
    firmName: document.getElementById('edit-lawyer-firm').value.trim(),
    hourlyRate: Number(document.getElementById('edit-lawyer-rate').value),
    city: document.getElementById('edit-lawyer-city').value.trim(),
    state: document.getElementById('edit-lawyer-state').value.trim(),
    education: document.getElementById('edit-lawyer-edu').value.trim(),
    experienceYears: Number(document.getElementById('edit-lawyer-exp').value),
    languages: document.getElementById('edit-lawyer-languages').value.trim(),
    phone: document.getElementById('edit-lawyer-phone').value.trim(),
    email: document.getElementById('edit-lawyer-email').value.trim(),
    avatarUrl: document.getElementById('edit-lawyer-avatar').value.trim(),
    rating: Number(document.getElementById('edit-lawyer-rating').value),
    casesWon: Number(document.getElementById('edit-lawyer-wins').value),
    bio: document.getElementById('edit-lawyer-bio').value.trim()
  };

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/lawyers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      closeModal('modal-edit-lawyer');
      loadAdminLawyers();
      loadAdminStats();
    } else {
      alert(data.message || 'Error updating attorney');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
});

// ── FORM: ADD COURT ──
document.getElementById('form-add-court')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('new-court-name').value.trim(),
    code: document.getElementById('new-court-code').value.trim().toUpperCase(),
    jurisdiction: document.getElementById('new-court-jurisdiction').value,
    level: document.getElementById('new-court-level').value,
    circuit: document.getElementById('new-court-circuit').value.trim(),
    city: document.getElementById('new-court-city').value.trim(),
    state: document.getElementById('new-court-state').value.trim(),
    address: document.getElementById('new-court-address').value.trim(),
    zipCode: document.getElementById('new-court-zip').value.trim(),
    phone: document.getElementById('new-court-phone').value.trim(),
    website: document.getElementById('new-court-website').value.trim(),
    clerkHours: document.getElementById('new-court-hours').value.trim(),
    filingSystem: document.getElementById('new-court-filing').value.trim(),
    chiefJudge: document.getElementById('new-court-judge').value.trim(),
    divisions: document.getElementById('new-court-divisions').value.trim(),
    overview: document.getElementById('new-court-overview').value.trim()
  };

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      closeModal('modal-add-court');
      document.getElementById('form-add-court').reset();
      loadAdminCourts();
      loadAdminStats();
    } else {
      alert(data.message || 'Error adding court venue');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
});

// ── FORM: EDIT COURT ──
document.getElementById('form-edit-court')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-court-id').value;
  const payload = {
    name: document.getElementById('edit-court-name').value.trim(),
    code: document.getElementById('edit-court-code').value.trim().toUpperCase(),
    jurisdiction: document.getElementById('edit-court-jurisdiction').value,
    level: document.getElementById('edit-court-level').value,
    circuit: document.getElementById('edit-court-circuit').value.trim(),
    city: document.getElementById('edit-court-city').value.trim(),
    state: document.getElementById('edit-court-state').value.trim(),
    address: document.getElementById('edit-court-address').value.trim(),
    zipCode: document.getElementById('edit-court-zip').value.trim(),
    phone: document.getElementById('edit-court-phone').value.trim(),
    website: document.getElementById('edit-court-website').value.trim(),
    clerkHours: document.getElementById('edit-court-hours').value.trim(),
    filingSystem: document.getElementById('edit-court-filing').value.trim(),
    chiefJudge: document.getElementById('edit-court-judge').value.trim(),
    divisions: document.getElementById('edit-court-divisions').value.trim(),
    overview: document.getElementById('edit-court-overview').value.trim()
  };

  const token = getAuthToken();
  try {
    const res = await fetch(`${SERVER_ORIGIN}/api/admin/courts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      closeModal('modal-edit-court');
      loadAdminCourts();
      loadAdminStats();
    } else {
      alert(data.message || 'Error updating court venue');
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

// Courts filter and search listeners
document.querySelectorAll('#courts-jurisdiction-filters .portal-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#courts-jurisdiction-filters .portal-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const jurisdiction = btn.getAttribute('data-jurisdiction');
    const search = document.getElementById('courts-search-input')?.value || '';
    loadAdminCourts(search, jurisdiction);
  });
});

document.getElementById('courts-search-input')?.addEventListener('input', (e) => {
  const activeJurBtn = document.querySelector('#courts-jurisdiction-filters .portal-filter-btn.active');
  const jurisdiction = activeJurBtn ? activeJurBtn.getAttribute('data-jurisdiction') : 'all';
  loadAdminCourts(e.target.value, jurisdiction);
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

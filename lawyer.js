/**
 * LegalAI - Advocate Case Portal & Litigation Dockets Client Controller
 */

const API_BASE = window.location.origin ? `${window.location.origin}/api` : 'http://localhost:5000/api';

let activeLawyer = null;
let currentCases = [];
let currentConsultations = [];
let allLawyersList = [];
let activeCaseIdInModal = null;
let activeStatusFilter = 'all';
let currentNotifications = [];
let lastNotifIds = new Set();
let notifPollTimer = null;

// Toast Notification
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAuthToken() {
  return localStorage.getItem('legalai_token') || '';
}

function setAuthSession(token, user) {
  localStorage.setItem('legalai_token', token);
  localStorage.setItem('legalai_user', JSON.stringify(user));
}

function clearAuthSession() {
  localStorage.removeItem('legalai_token');
  localStorage.removeItem('legalai_user');
}

// ── Tab Switching ──
function switchToTab(tabId) {
  document.querySelectorAll('.portal-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.portal-tab-pane').forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

// ── Notification Dropdown Toggle ──
function toggleNotifDropdown(forceState) {
  const dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  if (forceState !== undefined) {
    forceState ? dropdown.classList.remove('hidden') : dropdown.classList.add('hidden');
  } else {
    dropdown.classList.toggle('hidden');
  }
}

// ── Fetch & Render Notifications ──
async function fetchAndRenderNotifications(isBackgroundPoll = false) {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.notifications)) {
      currentNotifications = data.notifications;
      const unreadCount = data.unreadCount || 0;

      // Update Bell Badge
      const badge = document.getElementById('notif-badge');
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      const unreadText = document.getElementById('notif-unread-text');
      if (unreadText) {
        unreadText.textContent = `${unreadCount} new inquiry${unreadCount === 1 ? '' : 'ies'}`;
      }

      // Live toast trigger if a new consultation arrived during background polling
      if (isBackgroundPoll && data.notifications.length > 0) {
        data.notifications.forEach(n => {
          if (!n.isRead && !lastNotifIds.has(n.id)) {
            showToast(`New Consultation Booking: ${n.clientName} scheduled for ${n.preferredDate}!`, 'success');
            fetchAndRenderConsultations();
          }
        });
      }

      lastNotifIds = new Set(data.notifications.map(n => n.id));
      renderNotificationsList();
    }
  } catch (err) {
    console.warn('Could not fetch notifications:', err);
  }
}

function renderNotificationsList() {
  const container = document.getElementById('notif-list-container');
  if (!container) return;

  if (currentNotifications.length === 0) {
    container.innerHTML = `
      <div style="padding:28px 16px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        No booking notifications right now.
      </div>
    `;
    return;
  }

  container.innerHTML = currentNotifications.map(n => {
    const isUnread = !n.isRead;
    return `
      <div class="notif-item ${isUnread ? 'unread' : ''}" id="notif-item-${n.id}" onclick="handleNotifClick(${n.id}, ${n.consultationId || 'null'})">
        <div style="width:34px; height:34px; border-radius:50%; background:${isUnread ? 'rgba(223,183,124,0.2)' : 'rgba(255,255,255,0.06)'}; color:${isUnread ? 'var(--gold-glow)' : '#94a3b8'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:0.85rem; color:${isUnread ? '#fff' : '#cbd5e1'};">${escapeHtml(n.title)}</strong>
            ${isUnread ? '<span style="width:7px; height:7px; border-radius:50%; background:var(--gold-glow); display:inline-block;"></span>' : ''}
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin:3px 0 6px 0; line-height:1.4;">
            ${escapeHtml(n.message)}
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.72rem; color:var(--gold-glow); font-weight:600;">Scheduled: ${escapeHtml(n.preferredDate)}</span>
            <div style="display:flex; gap:6px;">
              ${n.consultationId ? `
                <button type="button" onclick="event.stopPropagation(); quickConfirmFromNotif(${n.consultationId}, ${n.id});" style="background:var(--gold-primary); color:#000; border:none; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700; cursor:pointer;">
                  Confirm
                </button>
              ` : ''}
              ${isUnread ? `
                <button type="button" onclick="event.stopPropagation(); markNotificationRead(${n.id});" style="background:none; border:none; color:var(--text-muted); font-size:0.7rem; cursor:pointer; text-decoration:underline;">
                  Mark Read
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Mark Notification Read ──
async function markNotificationRead(notifId) {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      const target = currentNotifications.find(n => n.id === notifId);
      if (target) target.isRead = 1;
      renderNotificationsList();
      const badge = document.getElementById('notif-badge');
      if (badge) {
        if (data.unreadCount > 0) {
          badge.textContent = data.unreadCount;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
      const unreadText = document.getElementById('notif-unread-text');
      if (unreadText) unreadText.textContent = `${data.unreadCount} new inquir${data.unreadCount === 1 ? 'y' : 'ies'}`;
    }
  } catch (err) {
    console.warn('Could not mark notification read:', err);
  }
}

// ── Mark All Read ──
async function markAllNotificationsRead() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/notifications/mark-all-read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      currentNotifications.forEach(n => n.isRead = 1);
      renderNotificationsList();
      document.getElementById('notif-badge')?.classList.add('hidden');
      const unreadText = document.getElementById('notif-unread-text');
      if (unreadText) unreadText.textContent = '0 new inquiries';
      showToast('All notifications marked as read', 'info');
    }
  } catch (err) {
    console.warn('Could not mark all read:', err);
  }
}

// ── Quick Confirm Booking From Notification ──
async function quickConfirmFromNotif(consultId, notifId) {
  await updateConsultationStatus(consultId, 'confirmed');
  await markNotificationRead(notifId);
}

// ── Handle Notification Click ──
function handleNotifClick(notifId, consultId) {
  markNotificationRead(notifId);
  switchToTab('tab-consultations');
  toggleNotifDropdown(false);
}

// ── Render Lawyers in Dropdown ──
async function loadAllLawyersDropdown() {
  const select = document.getElementById('select-active-lawyer');
  if (!select) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/all-lawyers`);
    const data = await res.json();
    if (data.success && Array.isArray(data.lawyers)) {
      allLawyersList = data.lawyers;
      let html = '<option value="">-- Switch Advocate (54 Verified Profiles) --</option>';
      allLawyersList.forEach(l => {
        const isCurrent = activeLawyer && Number(activeLawyer.id) === Number(l.id);
        html += `<option value="${l.id}" ${isCurrent ? 'selected' : ''}>${escapeHtml(l.name)} (${l.specialty} · ${l.caseCount || 0} cases)</option>`;
      });
      select.innerHTML = html;
    }
  } catch (err) {
    console.warn('Could not load all lawyers dropdown:', err);
  }
}

// ── Switch Active Lawyer ──
async function switchActiveLawyer(lawyerId) {
  if (!lawyerId) return;
  try {
    const res = await fetch(`${API_BASE}/lawyer/switch-lawyer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lawyerId: Number(lawyerId) })
    });
    const data = await res.json();
    if (data.success) {
      setAuthSession(data.token, data.user);
      activeLawyer = data.lawyer;
      showToast(`Switched to Chambers of ${data.lawyer.name}`, 'success');
      showDashboard(data.lawyer, data.stats);
      fetchAndRenderCases();
      fetchAndRenderConsultations();
      fetchAndRenderNotifications();
    } else {
      showToast(data.message || 'Failed to switch lawyer account', 'error');
    }
  } catch (err) {
    showToast('Network error while switching lawyer account', 'error');
  }
}

// ── Show Gate or Dashboard ──
function showAccessGate() {
  document.getElementById('lawyer-gate-card').style.display = 'block';
  document.getElementById('lawyer-dashboard-content').style.display = 'none';
  document.getElementById('lawyer-header-chip').style.display = 'none';
  document.getElementById('btn-lawyer-logout').style.display = 'none';
}

function showDashboard(lawyer, stats = {}) {
  activeLawyer = lawyer;
  document.getElementById('lawyer-gate-card').style.display = 'none';
  document.getElementById('lawyer-dashboard-content').style.display = 'block';
  document.getElementById('lawyer-header-chip').style.display = 'flex';
  document.getElementById('btn-lawyer-logout').style.display = 'inline-flex';

  // Header & Chambers details
  document.getElementById('lawyer-header-name').textContent = lawyer.name;
  document.getElementById('lawyer-header-bar').textContent = `Bar: ${lawyer.barNumber || 'Enrolled'}`;
  document.getElementById('lawyer-display-name').textContent = lawyer.name;
  document.getElementById('lawyer-display-firm').textContent = `${lawyer.firmName || 'Chambers of Advocate'} · ${lawyer.city || ''}, ${lawyer.state || ''} · ${lawyer.experienceYears || 20}+ Yrs Courtroom Practice`;
  document.getElementById('lawyer-bar-badge').textContent = `Bar: ${lawyer.barNumber || 'Verified'}`;
  document.getElementById('lawyer-court-badge').textContent = lawyer.primaryCourt || 'Supreme Court of India';
  document.getElementById('lawyer-specialty-badge').textContent = lawyer.specialty || 'General Practice';
  document.getElementById('lawyer-display-winrate').textContent = `${lawyer.successRate || 95}%`;
  document.getElementById('lawyer-display-caseswon').textContent = `${lawyer.casesWon || 100} Favorable Judgments`;

  // Sync Dropdown Selection
  const select = document.getElementById('select-active-lawyer');
  if (select && select.value !== String(lawyer.id)) {
    select.value = String(lawyer.id);
  }

  // Update Stats Counters
  updateKPIStats(stats);
  fetchAndRenderNotifications();
}

function updateKPIStats(stats = {}) {
  document.getElementById('kpi-lawyer-total-cases').textContent = stats.totalCases || currentCases.length || 0;
  document.getElementById('kpi-lawyer-active-hearings').textContent = stats.activeHearings || currentCases.filter(c => (c.status || '').toLowerCase().includes('active')).length || 0;
  document.getElementById('kpi-lawyer-consultations').textContent = stats.consultationsCount || currentConsultations.length || 0;
  document.getElementById('kpi-lawyer-disposed').textContent = stats.disposedCases || currentCases.filter(c => (c.status || '').toLowerCase().includes('disposed')).length || 0;

  document.getElementById('badge-tab-cases').textContent = currentCases.length;
  document.getElementById('badge-tab-cause-list').textContent = currentCases.length;
  document.getElementById('badge-tab-consults').textContent = currentConsultations.length;
}

// ── Fetch & Render Cases ──
async function fetchAndRenderCases() {
  const token = getAuthToken();
  if (!token) return;

  const container = document.getElementById('cases-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/cases`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.cases)) {
      currentCases = data.cases;
      renderCasesList();
      renderCauseList();
      updateKPIStats(data.stats);
    } else {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:40px; color:#f87171;">Failed to load cases: ${escapeHtml(data.message)}</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:40px; color:#f87171;">Network error while retrieving case dockets.</div>`;
  }
}

// ── Render Filtered Cases ──
function renderCasesList() {
  const container = document.getElementById('cases-container');
  if (!container) return;

  const searchVal = (document.getElementById('case-search-input')?.value || '').toLowerCase().trim();

  const filtered = currentCases.filter(cs => {
    // Status filter
    if (activeStatusFilter !== 'all' && (cs.status || '').toLowerCase() !== activeStatusFilter.toLowerCase()) {
      return false;
    }
    // Search filter
    if (searchVal) {
      const match = (cs.caseNumber || '').toLowerCase().includes(searchVal) ||
                    (cs.title || '').toLowerCase().includes(searchVal) ||
                    (cs.clientName || '').toLowerCase().includes(searchVal) ||
                    (cs.courtName || '').toLowerCase().includes(searchVal) ||
                    (cs.relevantActs || '').toLowerCase().includes(searchVal) ||
                    (cs.opposingParty || '').toLowerCase().includes(searchVal);
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:50px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border);">
        <p style="font-size:1.1rem; color:#fff; margin-bottom:8px;">No matching court dockets found</p>
        <p style="font-size:0.85rem; color:var(--text-muted);">Try selecting "All Cases" or clearing your search keywords.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(cs => {
    const isDisposed = (cs.status || '').toLowerCase().includes('disposed');
    const isBail = (cs.caseNumber || '').includes('BAIL') || (cs.relevantActs || '').includes('Bail');

    return `
      <div class="case-card" id="card-case-${cs.id}">
        <div class="case-header-row">
          <div>
            <span class="case-number-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              ${escapeHtml(cs.caseNumber)}
            </span>
            <h3 class="case-title">${escapeHtml(cs.title)}</h3>
          </div>
          <div>
            <select class="status-select-chip" onchange="updateCaseStatus(${cs.id}, this.value)" title="Change case status">
              <option value="Active Hearing" ${cs.status === 'Active Hearing' ? 'selected' : ''}>Active Hearing</option>
              <option value="Pending Hearing" ${cs.status === 'Pending Hearing' ? 'selected' : ''}>Pending Hearing</option>
              <option value="Under Investigation" ${cs.status === 'Under Investigation' ? 'selected' : ''}>Under Investigation</option>
              <option value="Disposed / Favorable" ${cs.status === 'Disposed / Favorable' ? 'selected' : ''}>Disposed / Favorable</option>
              <option value="Appeal Review" ${cs.status === 'Appeal Review' ? 'selected' : ''}>Appeal Review</option>
            </select>
          </div>
        </div>

        <div class="case-meta-grid">
          <div class="case-meta-item">
            <span class="case-meta-label">Court &amp; Venue</span>
            <span class="case-meta-value">${escapeHtml(cs.courtName)}</span>
          </div>
          <div class="case-meta-item">
            <span class="case-meta-label">Bench / Courtroom</span>
            <span class="case-meta-value">${escapeHtml(cs.bench || 'Division Bench')}</span>
          </div>
          <div class="case-meta-item">
            <span class="case-meta-label">Client Name</span>
            <span class="case-meta-value">${escapeHtml(cs.clientName)} · ${escapeHtml(cs.clientPhone || '')}</span>
          </div>
          <div class="case-meta-item">
            <span class="case-meta-label">Governing Statute</span>
            <span class="case-meta-value" style="font-size:0.8rem; color:var(--gold-glow);">${escapeHtml(cs.relevantActs || 'Applicable Procedural Law')}</span>
          </div>
        </div>

        <div class="case-hearing-box">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); display:block;">Next Court Listing</span>
            <span class="case-hearing-date">${escapeHtml(cs.nextHearingDate)} (${escapeHtml(cs.hearingTime || '10:30 AM')})</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); display:block;">Proceedings Stage</span>
            <span style="font-weight:600; color:#fff; font-size:0.85rem;">${escapeHtml(cs.stage || 'Hearing on Arguments')}</span>
          </div>
        </div>

        <div class="case-actions-row">
          <div style="font-size:0.82rem; color:var(--text-muted);">
            Dispute Value: <strong style="color:#fff;">${escapeHtml(cs.disputeValue || 'Statutory Relief')}</strong>
          </div>
          <button type="button" class="btn-portal-primary" onclick="openCaseDossierModal(${cs.id})" style="padding:6px 14px; font-size:0.82rem;">
            Open Case File &amp; Notes
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Render Hearing Cause List / Calendar ──
function renderCauseList() {
  const container = document.getElementById('cause-list-container');
  if (!container) return;

  if (currentCases.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:30px;">No scheduled court hearings.</p>';
    return;
  }

  // Sort by hearing date ascending
  const sorted = [...currentCases].sort((a, b) => (a.nextHearingDate || '').localeCompare(b.nextHearingDate || ''));

  container.innerHTML = sorted.map((cs, idx) => {
    return `
      <div style="background:var(--bg-card); border:1px solid var(--border); border-left:4px solid var(--gold-primary); border-radius:var(--radius-md); padding:16px 20px; display:flex; justify-content:space-between; align-items:center; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:42px; height:42px; border-radius:50%; background:rgba(223,183,124,0.12); color:var(--gold-glow); font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${idx + 1}
          </div>
          <div>
            <div style="font-size:0.8rem; font-family:monospace; color:var(--gold-glow); font-weight:700;">${escapeHtml(cs.caseNumber)}</div>
            <div style="font-weight:700; color:#fff; font-size:1rem; margin:2px 0;">${escapeHtml(cs.title)}</div>
            <div style="font-size:0.82rem; color:var(--text-muted);">${escapeHtml(cs.courtName)} · ${escapeHtml(cs.bench)}</div>
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-size:1rem; font-weight:800; color:var(--gold-glow);">${escapeHtml(cs.nextHearingDate)}</div>
          <div style="font-size:0.82rem; color:#fff;">${escapeHtml(cs.hearingTime || '10:30 AM IST')}</div>
          <div style="font-size:0.75rem; color:#86efac; margin-top:2px;">● Stage: ${escapeHtml(cs.stage)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Update Case Status ──
async function updateCaseStatus(caseId, newStatus) {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/cases/${caseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Case status updated to "${newStatus}"`, 'success');
      // Update local state
      const target = currentCases.find(c => c.id === caseId);
      if (target) target.status = newStatus;
      updateKPIStats();
    } else {
      showToast(data.message || 'Failed to update case status', 'error');
    }
  } catch (err) {
    showToast('Network error while updating case status', 'error');
  }
}

// ── Open & Close Case Dossier Modal ──
function openCaseDossierModal(caseId) {
  const cs = currentCases.find(c => c.id === caseId);
  if (!cs) return;

  activeCaseIdInModal = caseId;
  document.getElementById('modal-docket-number').textContent = cs.caseNumber;
  document.getElementById('modal-docket-title').textContent = cs.title;
  document.getElementById('modal-docket-court').textContent = cs.courtName;
  document.getElementById('modal-docket-bench').textContent = cs.bench || 'Division Bench';
  document.getElementById('modal-docket-client').textContent = `${cs.clientName} (${cs.clientPhone || cs.clientEmail || 'Private'})`;
  document.getElementById('modal-docket-opposing').textContent = cs.opposingParty || 'Opposing Party';
  document.getElementById('modal-docket-acts').textContent = cs.relevantActs || 'Applicable Law';
  document.getElementById('modal-docket-value').textContent = cs.disputeValue || 'Statutory Relief';
  document.getElementById('modal-docket-summary').textContent = cs.caseSummary || 'No case brief recorded.';
  document.getElementById('modal-docket-notes').value = cs.lawyerNotes || '';

  document.getElementById('case-dossier-modal').classList.add('open');
}

function closeCaseDossierModal() {
  document.getElementById('case-dossier-modal').classList.remove('open');
  activeCaseIdInModal = null;
}

// ── Save Case Notes ──
async function saveActiveCaseNotes() {
  if (!activeCaseIdInModal) return;
  const token = getAuthToken();
  const notes = document.getElementById('modal-docket-notes').value.trim();

  try {
    const res = await fetch(`${API_BASE}/lawyer/cases/${activeCaseIdInModal}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lawyerNotes: notes })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Chambers notes saved to case database.', 'success');
      const target = currentCases.find(c => c.id === activeCaseIdInModal);
      if (target) target.lawyerNotes = notes;
    } else {
      showToast(data.message || 'Failed to save notes', 'error');
    }
  } catch (err) {
    showToast('Network error while saving notes', 'error');
  }
}

// ── Fetch & Render Consultations ──
async function fetchAndRenderConsultations() {
  const token = getAuthToken();
  if (!token) return;

  const tbody = document.getElementById('lawyer-consults-tbody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/lawyer/consultations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.consultations)) {
      currentConsultations = data.consultations;
      if (currentConsultations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">No client consultations requested yet.</td></tr>';
      } else {
        tbody.innerHTML = currentConsultations.map(c => `
          <tr>
            <td>#${c.id}</td>
            <td><strong>${escapeHtml(c.clientName)}</strong></td>
            <td>${escapeHtml(c.clientEmail)}<br/><span style="font-size:0.8rem; color:#94a3b8;">${escapeHtml(c.clientPhone)}</span></td>
            <td><strong style="color:var(--gold-glow);">${escapeHtml(c.preferredDate)}</strong></td>
            <td style="max-width:280px; font-size:0.85rem;">${escapeHtml(c.caseSummary)}</td>
            <td>
              <span class="meta-pill ${c.status === 'confirmed' ? 'meta-pill-emerald' : (c.status === 'completed' ? 'meta-pill-blue' : 'meta-pill-gold')}">
                ${escapeHtml(c.status)}
              </span>
            </td>
            <td>
              ${c.status === 'pending' ? `
                <button class="btn-portal-primary" style="padding:4px 8px; font-size:0.75rem;" onclick="updateConsultationStatus(${c.id}, 'confirmed')">
                  Confirm
                </button>
              ` : (c.status === 'confirmed' ? `
                <button class="btn-portal-primary" style="padding:4px 8px; font-size:0.75rem; background:#10b981;" onclick="updateConsultationStatus(${c.id}, 'completed')">
                  Mark Done
                </button>
              ` : `<span>Completed</span>`)}
            </td>
          </tr>
        `).join('');
      }
      updateKPIStats();
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#f87171;">Could not load consultations.</td></tr>';
  }
}

async function updateConsultationStatus(consultId, status) {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_BASE}/lawyer/consultations/${consultId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Consultation #${consultId} status marked as ${status}`, 'success');
      fetchAndRenderConsultations();
    }
  } catch (err) {
    showToast('Failed to update consultation status', 'error');
  }
}

// ── Register New Case Docket ──
async function handleNewCaseSubmit(e) {
  e.preventDefault();
  const token = getAuthToken();
  if (!token) return;

  const title = document.getElementById('new-case-title').value.trim();
  const caseNumber = document.getElementById('new-case-number').value.trim();
  const clientName = document.getElementById('new-client-name').value.trim();
  const clientEmail = document.getElementById('new-client-email').value.trim();
  const clientPhone = document.getElementById('new-client-phone').value.trim();
  const courtName = document.getElementById('new-case-court').value.trim();
  const bench = document.getElementById('new-case-bench').value.trim();
  const opposingParty = document.getElementById('new-opposing-party').value.trim();
  const relevantActs = document.getElementById('new-case-acts').value.trim();
  const nextHearingDate = document.getElementById('new-hearing-date').value;
  const stage = document.getElementById('new-hearing-stage').value.trim();
  const disputeValue = document.getElementById('new-dispute-value').value.trim();
  const caseSummary = document.getElementById('new-case-summary').value.trim();

  try {
    const res = await fetch(`${API_BASE}/lawyer/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title, caseNumber, clientName, clientEmail, clientPhone,
        courtName, bench, opposingParty, relevantActs, nextHearingDate,
        stage, disputeValue, caseSummary
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast('New Case Docket registered successfully!', 'success');
      document.getElementById('form-new-case').reset();
      await fetchAndRenderCases();
      switchToTab('tab-cases');
    } else {
      showToast(data.message || 'Failed to register case', 'error');
    }
  } catch (err) {
    showToast('Network error while registering case docket', 'error');
  }
}

// ── Initialize Portal ──
async function initLawyerPortal() {
  await loadAllLawyersDropdown();

  // Setup Event Listeners
  document.getElementById('select-active-lawyer')?.addEventListener('change', (e) => {
    if (e.target.value) {
      switchActiveLawyer(e.target.value);
    }
  });

  // Tab switching
  document.querySelectorAll('.portal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchToTab(btn.dataset.tab);
    });
  });

  // Status Filter buttons
  document.querySelectorAll('#case-status-filters .portal-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#case-status-filters .portal-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatusFilter = btn.dataset.status;
      renderCasesList();
    });
  });

  // Search input
  document.getElementById('case-search-input')?.addEventListener('input', () => {
    renderCasesList();
  });

  // Save notes in modal
  document.getElementById('btn-save-case-notes')?.addEventListener('click', saveActiveCaseNotes);

  // New case form submit
  document.getElementById('form-new-case')?.addEventListener('submit', handleNewCaseSubmit);

  // Notification Bell Toggle
  document.getElementById('btn-notif-bell')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNotifDropdown();
  });

  // Mark all notifications read
  document.getElementById('btn-mark-all-read')?.addEventListener('click', (e) => {
    e.stopPropagation();
    markAllNotificationsRead();
  });

  // Click outside to dismiss notification dropdown
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('notif-bell-wrap');
    if (wrap && !wrap.contains(e.target)) {
      toggleNotifDropdown(false);
    }
  });

  // Live Background Polling for New Client Bookings (Every 12 seconds)
  if (!notifPollTimer) {
    notifPollTimer = setInterval(() => {
      if (getAuthToken() && activeLawyer) {
        fetchAndRenderNotifications(true);
      }
    }, 12000);
  }

  // Logout button
  document.getElementById('btn-lawyer-logout')?.addEventListener('click', () => {
    clearAuthSession();
    showToast('Signed out of Advocate Chambers Portal', 'info');
    showAccessGate();
  });

  // Gate Quick Logins
  document.getElementById('gate-btn-harish')?.addEventListener('click', () => switchActiveLawyer(1));
  document.getElementById('gate-btn-mukul')?.addEventListener('click', () => switchActiveLawyer(2));
  document.getElementById('gate-btn-indira')?.addEventListener('click', () => switchActiveLawyer(4));

  // Gate Standard Form Login
  document.getElementById('lawyer-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('gate-lawyer-email').value.trim();
    const password = document.getElementById('gate-lawyer-password').value;
    const alertEl = document.getElementById('gate-lawyer-alert');
    alertEl.style.display = 'none';

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setAuthSession(data.token, data.user);
        checkSessionAndLoad();
      } else {
        alertEl.textContent = data.message || 'Invalid email or password.';
        alertEl.style.display = 'block';
      }
    } catch (err) {
      alertEl.textContent = 'Network error connecting to authentication server.';
      alertEl.style.display = 'block';
    }
  });

  // Check Current Session
  checkSessionAndLoad();
}

async function checkSessionAndLoad() {
  const token = getAuthToken();
  if (!token) {
    showAccessGate();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/lawyer/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.lawyer) {
      showDashboard(data.lawyer, data.stats);
      fetchAndRenderCases();
      fetchAndRenderConsultations();
    } else {
      // If user is not authorized or token expired, show gate
      showAccessGate();
    }
  } catch (err) {
    showAccessGate();
  }
}

// ── Admin Impersonation Bar ──
function checkAdminImpersonationBar() {
  const imp = localStorage.getItem('legalai_admin_impersonating');
  if (!imp) return;
  try {
    const data = JSON.parse(imp);
    if (document.getElementById('admin-impersonation-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'admin-impersonation-bar';
    bar.style.cssText = 'position:sticky; top:0; z-index:99999; background:linear-gradient(90deg, #7c3aed, #4f46e5); color:#fff; padding:10px 20px; font-size:0.85rem; display:flex; align-items:center; justify-content:space-between; box-shadow:0 3px 12px rgba(0,0,0,0.4);';
    bar.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span><strong>ADMINISTRATOR FULL ACCESS MODE:</strong> Viewing advocate portal as <strong>${escapeHtml(data.name)}</strong></span>
      </div>
      <button id="btn-return-admin" style="background:#fff; color:#4f46e5; border:none; padding:6px 14px; border-radius:6px; font-weight:700; font-size:0.82rem; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
        <span>Return to Master Admin Suite</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;
    document.body.prepend(bar);

    document.getElementById('btn-return-admin')?.addEventListener('click', () => {
      const backupToken = localStorage.getItem('legalai_admin_backup_token');
      const backupUser = localStorage.getItem('legalai_admin_backup_user');
      if (backupToken) localStorage.setItem('legalai_token', backupToken);
      if (backupUser) localStorage.setItem('legalai_user', backupUser);
      localStorage.removeItem('legalai_admin_backup_token');
      localStorage.removeItem('legalai_admin_backup_user');
      localStorage.removeItem('legalai_admin_impersonating');
      window.location.href = 'admin.html';
    });
  } catch (_) {}
}

// Global functions for inline HTML calls
window.switchToTab = switchToTab;
window.openCaseDossierModal = openCaseDossierModal;
window.closeCaseDossierModal = closeCaseDossierModal;
window.updateCaseStatus = updateCaseStatus;
window.updateConsultationStatus = updateConsultationStatus;
window.toggleNotifDropdown = toggleNotifDropdown;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleNotifClick = handleNotifClick;
window.quickConfirmFromNotif = quickConfirmFromNotif;

// Run on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkAdminImpersonationBar();
    initLawyerPortal();
  });
} else {
  checkAdminImpersonationBar();
  initLawyerPortal();
}


// LegalAI - Portal Authentication & Session Controller
const API_BASE = '/api/auth';
const urlParams = new URLSearchParams(window.location.search);
const redirectReason = urlParams.get('redirect');
const paramLawyerId = urlParams.get('lawyerId');
const paramLawyerName = urlParams.get('lawyerName');
const paramAction = urlParams.get('action'); // 'login' or 'register'
const paramPortal = urlParams.get('portal') || urlParams.get('role');

// Active state
let currentRole = 'user'; // 'user' (Client), 'lawyer' (Advocate), 'admin' (Admin)
let currentTab = 'login';  // 'login' or 'register'

// Form elements
const loginForm = document.getElementById('page-login-form');
const registerForm = document.getElementById('page-register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const pageTitle = document.getElementById('page-auth-title');
const pageSub = document.getElementById('page-auth-sub');
const alertBox = document.getElementById('page-form-alert');
const gateNotice = document.getElementById('consult-gate-notice');
const noticeLawyerPill = document.getElementById('consult-notice-lawyer');
const noticeLawyerName = document.getElementById('consult-notice-lawyer-name');
const containerCard = document.getElementById('auth-container-card');

// Role definitions
const ROLE_CONFIG = {
  user: {
    badgeClass: 'badge-client',
    badgeText: 'Client & Citizen Case Portal',
    badgeIcon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    title: 'Client Case & Consultation Access',
    subtitle: 'Sign in to track your booked advocate consultations, legal checklists & AI advisory sessions.',
    emailLabel: 'Client Email Address',
    emailPlaceholder: 'client@example.com (or demouser@legalai.com)',
    passwordLabel: 'Account Password',
    submitText: 'Sign In to Client Portal',
    themeClass: 'role-theme-user',
    buttonClass: '',
    helperNote: 'Client Portal: Access your legal consultations, case action checklists, and personalized AI research.',
    helperClass: 'client',
    demoEmail: 'demouser@legalai.com',
    demoPass: 'demo1234'
  },
  lawyer: {
    badgeClass: 'badge-advocate',
    badgeText: 'Verified Advocate Chambers & Litigation Desk',
    badgeIcon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    title: 'Advocate Chambers Sign In',
    subtitle: 'Sign in with your Bar Council registered chambers email to manage courtroom dockets, hearings & client consultations.',
    emailLabel: 'Advocate Chambers Email / Bar ID',
    emailPlaceholder: 'lekhanleku017@gmail.com (or advocate@chambers.in)',
    passwordLabel: 'Chambers Access Password',
    submitText: 'Sign In to Advocate Chambers',
    themeClass: 'role-theme-lawyer',
    buttonClass: 'btn-role-lawyer',
    helperNote: 'Advocate Chambers: Manage court dockets, hearing schedules, and client consultation bookings.',
    helperClass: 'advocate',
    demoEmail: 'lekhanleku017@gmail.com',
    demoPass: '12345678'
  },
  admin: {
    badgeClass: 'badge-admin',
    badgeText: 'Master Platform Administrator Console',
    badgeIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    title: 'Master Administrator Sign In',
    subtitle: 'Restricted administrative access for court registry synchronization, advocate verification & platform audits.',
    emailLabel: 'Administrator Security Email',
    emailPlaceholder: 'admin@legalai.com',
    passwordLabel: 'Admin Security Key / Master Password',
    submitText: 'Sign In to Master Admin Console',
    themeClass: 'role-theme-admin',
    buttonClass: 'btn-role-admin',
    helperNote: 'Security Clearance Required: Restricted to authorized LegalAI system administrators.',
    helperClass: 'admin',
    demoEmail: 'admin@legalai.com',
    demoPass: 'admin1234'
  }
};

// Retrieve pending consultation from URL or sessionStorage
function getPendingConsultation() {
  if (paramLawyerId) {
    return {
      lawyerId: paramLawyerId,
      lawyerName: paramLawyerName ? decodeURIComponent(paramLawyerName) : 'Selected Advocate'
    };
  }
  try {
    const stored = sessionStorage.getItem('pending_consult_lawyer');
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return null;
}

// Show alert message
function setAlert(message, type = 'error') {
  if (!alertBox) return;
  alertBox.className = `page-auth-alert ${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove('hidden');
}

function clearAlert() {
  if (!alertBox) return;
  alertBox.className = 'page-auth-alert hidden';
  alertBox.textContent = '';
}

// Select Login Role (user, lawyer, admin)
window.selectLoginRole = function(role, silent = false) {
  if (!ROLE_CONFIG[role]) role = 'user';
  currentRole = role;

  const cfg = ROLE_CONFIG[role];

  // Update role buttons
  document.querySelectorAll('.auth-role-btn').forEach(btn => {
    if (btn.dataset.role === role) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update container card glow
  if (containerCard) {
    containerCard.classList.remove('role-theme-user', 'role-theme-lawyer', 'role-theme-admin');
    containerCard.classList.add(cfg.themeClass);
  }

  // Update portal badge
  const badgeEl = document.getElementById('role-portal-badge');
  const badgeIconEl = document.getElementById('role-badge-icon');
  const badgeTextEl = document.getElementById('role-portal-badge-text');
  if (badgeEl) {
    badgeEl.className = `role-portal-badge ${cfg.badgeClass}`;
  }
  if (badgeIconEl) {
    badgeIconEl.innerHTML = cfg.badgeIcon;
  }
  if (badgeTextEl) {
    badgeTextEl.textContent = cfg.badgeText;
  }

  // Update title & subtitle if in login tab
  if (currentTab === 'login') {
    if (pageTitle) pageTitle.textContent = cfg.title;
    if (pageSub) pageSub.textContent = cfg.subtitle;
  }

  // Update form inputs & labels
  const roleInput = document.getElementById('page-login-role');
  const emailLabel = document.getElementById('page-login-email-label');
  const emailInput = document.getElementById('page-login-email');
  const passLabel = document.getElementById('page-login-password-label');
  const submitText = document.getElementById('login-submit-text');
  const submitBtn = document.getElementById('page-login-submit');

  if (roleInput) roleInput.value = role;
  if (emailLabel) emailLabel.textContent = cfg.emailLabel;
  if (emailInput) emailInput.placeholder = cfg.emailPlaceholder;
  if (passLabel) passLabel.textContent = cfg.passwordLabel;
  if (submitText) submitText.textContent = cfg.submitText;

  if (submitBtn) {
    submitBtn.classList.remove('btn-role-lawyer', 'btn-role-admin');
    if (cfg.buttonClass) submitBtn.classList.add(cfg.buttonClass);
  }

  // Update helper note
  const helperBox = document.getElementById('role-helper-note');
  const helperText = document.getElementById('role-helper-note-text');
  if (helperBox) {
    helperBox.className = `role-helper-note ${cfg.helperClass}`;
  }
  if (helperText) {
    helperText.textContent = cfg.helperNote;
  }

  // Update register form admin warning if on register tab
  const adminRegBlock = document.getElementById('admin-reg-block');
  const regRoleSelect = document.getElementById('page-reg-role');
  if (adminRegBlock) {
    if (role === 'admin' && currentTab === 'register') {
      adminRegBlock.classList.remove('hidden');
    } else {
      adminRegBlock.classList.add('hidden');
    }
  }
  if (regRoleSelect && (role === 'user' || role === 'lawyer')) {
    regRoleSelect.value = role;
    handleRegRoleChange(role);
  }

  if (!silent) {
    clearAlert();
  }
};

// Toggle password visibility
window.togglePassword = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
};

// Switch between Login and Register tabs
window.switchAuthTab = function(tab) {
  clearAlert();
  currentTab = tab;

  if (tab === 'register') {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    pageTitle.textContent = 'Create LegalAI Account';
    pageSub.textContent = 'Register for client portal access or enroll as a verified advocate.';

    const adminRegBlock = document.getElementById('admin-reg-block');
    if (adminRegBlock) {
      if (currentRole === 'admin') {
        adminRegBlock.classList.remove('hidden');
      } else {
        adminRegBlock.classList.add('hidden');
      }
    }
  } else {
    tabRegister.classList.remove('active');
    tabLogin.classList.add('active');
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');

    const cfg = ROLE_CONFIG[currentRole] || ROLE_CONFIG.user;
    pageTitle.textContent = cfg.title;
    pageSub.textContent = cfg.subtitle;
  }
};

// Handle registration role selection change
window.handleRegRoleChange = function(selectedRole) {
  const advocateFields = document.getElementById('advocate-reg-fields');
  const barInput = document.getElementById('page-reg-bar');
  if (selectedRole === 'lawyer') {
    if (advocateFields) advocateFields.classList.remove('hidden');
    if (barInput) barInput.required = true;
  } else {
    if (advocateFields) advocateFields.classList.add('hidden');
    if (barInput) barInput.required = false;
  }
};

// Fill demo credentials
window.fillDemo = function(role) {
  selectLoginRole(role, true);
  switchAuthTab('login');

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const emailInput = document.getElementById('page-login-email');
  const passInput = document.getElementById('page-login-password');

  if (emailInput) emailInput.value = cfg.demoEmail;
  if (passInput) passInput.value = cfg.demoPass;

  clearAlert();
  setAlert(`Loaded demo credentials for ${role.toUpperCase()} (${cfg.demoEmail}). Click '${cfg.submitText}'.`, 'success');
};

// Check if directed from a consultation attempt
function checkConsultationTrigger() {
  const pending = getPendingConsultation();
  if (pending && pending.lawyerId) {
    if (gateNotice) gateNotice.classList.remove('hidden');
    if (noticeLawyerPill) noticeLawyerPill.classList.remove('hidden');
    if (noticeLawyerName) noticeLawyerName.textContent = pending.lawyerName || 'Selected Advocate';
    setAlert(`Sign in as a Client to finalize your consultation booking with ${pending.lawyerName || 'the advocate'}.`, 'info');
    selectLoginRole('user', true);
  } else if (redirectReason === 'auth_required') {
    setAlert('Please sign in or create an account to access this feature.', 'info');
  } else if (redirectReason === 'admin_required') {
    setAlert('Platform Administrator access required. Please sign in to the Admin Console.', 'error');
    selectLoginRole('admin', true);
  } else if (redirectReason === 'lawyer_required') {
    setAlert('Advocate credentials required. Please sign in to Advocate Chambers.', 'error');
    selectLoginRole('lawyer', true);
  }
}

// Redirect after successful authentication
function handleAuthSuccess(user, token, serverRedirectUrl) {
  if (user.role === 'user' || user.role === 'lawyer') {
    localStorage.removeItem('legalai_admin_impersonating');
    localStorage.removeItem('legalai_admin_backup_token');
    localStorage.removeItem('legalai_admin_backup_user');
  }
  localStorage.setItem('legalai_token', token);
  localStorage.setItem('legalai_user', JSON.stringify(user));

  const pending = getPendingConsultation();

  if (pending && pending.lawyerId && user.role === 'user') {
    sessionStorage.removeItem('pending_consult_lawyer');
    setAlert('Authentication successful! Resuming consultation booking...', 'success');
    const returnPage = pending.sourcePage || 'lawyers.html';
    const targetUrl = `${returnPage}?bookLawyerId=${encodeURIComponent(pending.lawyerId)}`;
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 700);
    return;
  }

  let dest = serverRedirectUrl;
  if (!dest) {
    if (user.role === 'admin') dest = 'admin.html';
    else if (user.role === 'lawyer') dest = 'lawyer.html';
    else dest = 'user.html';
  }

  let roleLabel = 'Client Portal';
  if (user.role === 'admin') roleLabel = 'Master Administrator Console';
  else if (user.role === 'lawyer') roleLabel = 'Advocate Chambers';

  setAlert(`Login verified for ${user.name}! Redirecting to ${roleLabel}...`, 'success');

  setTimeout(() => {
    window.location.href = dest;
  }, 600);
}

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Determine starting role from URL
  if (paramPortal === 'admin') {
    selectLoginRole('admin', true);
  } else if (paramPortal === 'lawyer' || paramPortal === 'advocate') {
    selectLoginRole('lawyer', true);
  } else {
    selectLoginRole('user', true);
  }

  // Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      const email = document.getElementById('page-login-email')?.value.trim();
      const password = document.getElementById('page-login-password')?.value;
      const btn = document.getElementById('page-login-submit') || document.getElementById('page-login-btn');
      const btnText = btn?.querySelector('.btn-text');
      const btnSpinner = btn?.querySelector('.btn-spinner');

      if (!email || !password) {
        setAlert('Please provide both email address and password.');
        return;
      }

      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = 'Authenticating...';
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: currentRole })
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Authentication failed. Please verify credentials.');
        }

        handleAuthSuccess(data.user, data.token, data.redirectUrl);
      } catch (err) {
        setAlert(err.message || 'Connection error. Please try again.');
        const cfg = ROLE_CONFIG[currentRole] || ROLE_CONFIG.user;
        if (btnText) btnText.textContent = cfg.submitText;
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btn) btn.disabled = false;
      }
    });
  }

  // Register submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      if (currentRole === 'admin') {
        setAlert('Administrator accounts cannot be self-registered. Please switch to the Sign In tab.');
        return;
      }

      const name = document.getElementById('page-reg-name')?.value.trim();
      const email = document.getElementById('page-reg-email')?.value.trim();
      const phone = document.getElementById('page-reg-phone')?.value.trim();
      const role = document.getElementById('page-reg-role')?.value || 'user';
      const password = document.getElementById('page-reg-password')?.value;
      const confirmPassword = document.getElementById('page-reg-confirm-password')?.value;
      const terms = document.getElementById('page-reg-terms')?.checked;
      const barNumber = document.getElementById('page-reg-bar')?.value.trim();
      const specialty = document.getElementById('page-reg-specialty')?.value.trim();

      const btn = document.getElementById('page-reg-submit') || document.getElementById('page-reg-btn');
      const btnText = btn?.querySelector('.btn-text');
      const btnSpinner = btn?.querySelector('.btn-spinner');

      if (!name || !email || !password || !phone) {
        setAlert('Please complete all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setAlert('Passwords do not match. Please re-enter your password.');
        return;
      }
      if (password.length < 8) {
        setAlert('Password must be at least 8 characters long.');
        return;
      }
      if (!terms) {
        setAlert('You must agree to the Terms of Practice.');
        return;
      }
      if (role === 'lawyer' && !barNumber) {
        setAlert('Advocate registration requires a valid Bar Council Enrollment Number.');
        return;
      }

      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = 'Registering Account...';
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      try {
        const payload = { name, email, phone, password, confirmPassword, role };
        if (role === 'lawyer') {
          payload.barNumber = barNumber;
          payload.specialty = specialty || 'General Litigation';
        }

        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Registration failed.');
        }

        handleAuthSuccess(data.user, data.token);
      } catch (err) {
        setAlert(err.message || 'Registration error. Please check your details.');
        if (btnText) btnText.textContent = 'Register Account & Proceed';
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btn) btn.disabled = false;
      }
    });
  }

  // Check URL action
  if (paramAction === 'register') {
    switchAuthTab('register');
  }

  checkConsultationTrigger();

  // If user is ALREADY authenticated when loading login page:
  const existingToken = localStorage.getItem('legalai_token');
  const existingUserStr = localStorage.getItem('legalai_user');
  if (existingToken && existingUserStr) {
    try {
      const user = JSON.parse(existingUserStr);
      const pending = getPendingConsultation();
      if (pending && pending.lawyerId && user.role === 'user') {
        const returnPage = pending.sourcePage || 'lawyers.html';
        setAlert(`Already signed in as ${user.name}. Redirecting to consultation booking...`, 'success');
        setTimeout(() => {
          window.location.href = `${returnPage}?bookLawyerId=${encodeURIComponent(pending.lawyerId)}`;
        }, 600);
      }
    } catch (_) {}
  }
});

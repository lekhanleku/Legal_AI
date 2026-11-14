// Configuration & State
const API_BASE = '/api/auth';
const urlParams = new URLSearchParams(window.location.search);
const redirectReason = urlParams.get('redirect');
const paramLawyerId = urlParams.get('lawyerId');
const paramLawyerName = urlParams.get('lawyerName');
const paramAction = urlParams.get('action'); // 'login' or 'register'

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
  if (tab === 'register') {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    pageTitle.textContent = 'Create LegalAI Account';
    pageSub.textContent = 'Register for client portal access and consultation scheduling';
  } else {
    tabRegister.classList.remove('active');
    tabLogin.classList.add('active');
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    pageTitle.textContent = 'Welcome Back';
    pageSub.textContent = 'Sign in to access your cases, consultation bookings & legal tools';
  }
};

// Fill demo credentials
window.fillDemo = function(role) {
  switchAuthTab('login');
  const emailInput = document.getElementById('page-login-email');
  const passInput = document.getElementById('page-login-password');
  if (role === 'lawyer') {
    emailInput.value = 'h.salve@chambersofsalve.in';
    passInput.value = 'lawyer1234';
  } else if (role === 'admin') {
    emailInput.value = 'admin@legalai.com';
    passInput.value = 'Admin@LegalAI2026!';
  } else {
    emailInput.value = 'demouser@legalai.com';
    passInput.value = 'LegalAI2026!';
  }
  clearAlert();
  setAlert(`Loaded demo credentials for ${role.toUpperCase()}. Click 'Sign In to Portal'.`, 'success');
};

// Check if directed from a consultation attempt
function checkConsultationTrigger() {
  const pending = getPendingConsultation();
  if (pending && pending.lawyerId) {
    if (gateNotice) gateNotice.classList.remove('hidden');
    if (noticeLawyerPill) noticeLawyerPill.classList.remove('hidden');
    if (noticeLawyerName) noticeLawyerName.textContent = pending.lawyerName || 'Selected Advocate';
    setAlert(`Sign in to finalize your consultation booking with ${pending.lawyerName || 'the advocate'}.`, 'info');
  } else if (redirectReason === 'auth_required') {
    setAlert('Please sign in or create an account to access this feature.', 'info');
  }
}

// Redirect after successful authentication
function handleAuthSuccess(user, token) {
  localStorage.setItem('legalai_token', token);
  localStorage.setItem('legalai_user', JSON.stringify(user));

  const pending = getPendingConsultation();

  if (pending && pending.lawyerId) {
    sessionStorage.removeItem('pending_consult_lawyer');
    setAlert('Authentication successful! Resuming consultation booking...', 'success');
    const returnPage = pending.sourcePage || 'lawyers.html';
    const targetUrl = `${returnPage}?bookLawyerId=${encodeURIComponent(pending.lawyerId)}`;
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 700);
    return;
  }

  setAlert('Login successful! Redirecting to your portal...', 'success');
  setTimeout(() => {
    if (user.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (user.role === 'lawyer') {
      window.location.href = 'lawyer.html';
    } else {
      window.location.href = 'user.html';
    }
  }, 600);
}

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
  // Login submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById('page-login-email').value.trim();
    const password = document.getElementById('page-login-password').value;
    const btn = document.getElementById('page-login-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    if (!email || !password) {
      setAlert('Please provide both email and password.');
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Authenticating...';
    btnSpinner.classList.remove('hidden');

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }

      handleAuthSuccess(data.user, data.token);
    } catch (err) {
      setAlert(err.message || 'Connection error. Please try again.');
      btnText.textContent = 'Sign In to Portal';
      btnSpinner.classList.add('hidden');
      btn.disabled = false;
    }
  });

  // Register submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById('page-reg-name').value.trim();
    const email = document.getElementById('page-reg-email').value.trim();
    const role = document.getElementById('page-reg-role').value;
    const password = document.getElementById('page-reg-password').value;
    const terms = document.getElementById('page-reg-terms').checked;
    const btn = document.getElementById('page-reg-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    if (!name || !email || !password) {
      setAlert('Please complete all required fields.');
      return;
    }
    if (!terms) {
      setAlert('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }
    if (password.length < 6) {
      setAlert('Password must be at least 6 characters long.');
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Creating Account...';
    btnSpinner.classList.remove('hidden');

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      handleAuthSuccess(data.user, data.token);
    } catch (err) {
      setAlert(err.message || 'Registration error. Please check your details.');
      btnText.textContent = 'Create LegalAI Account';
      btnSpinner.classList.add('hidden');
      btn.disabled = false;
    }
  });

  // Check URL parameters
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
      if (pending && pending.lawyerId) {
        const returnPage = pending.sourcePage || 'lawyers.html';
        setAlert(`Already signed in as ${user.name}. Redirecting to consultation booking...`, 'success');
        setTimeout(() => {
          window.location.href = `${returnPage}?bookLawyerId=${encodeURIComponent(pending.lawyerId)}`;
        }, 600);
      }
    } catch (_) {}
  }
});


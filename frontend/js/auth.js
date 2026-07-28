// ===== CONFIG =====
const API_BASE = 'http://localhost:5000/api';

// ===== SESSION HELPERS =====
function saveSession(user) {
  sessionStorage.setItem('hrms_token', user.token);
  sessionStorage.setItem('hrms_user', JSON.stringify({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  }));
}

function getToken() {
  return sessionStorage.getItem('hrms_token');
}

function getCurrentUser() {
  const raw = sessionStorage.getItem('hrms_user');
  return raw ? JSON.parse(raw) : null;
}

function logout() {
  sessionStorage.removeItem('hrms_token');
  sessionStorage.removeItem('hrms_user');
  window.location.href = 'index.html';
}

// Call at the top of every protected page. Redirects to login if not authenticated.
function requireAuth() {
  const token = getToken();
  const user = getCurrentUser();
  if (!token || !user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

// Call on Admin-only pages. Redirects non-admins back to dashboard.
function requireAdmin() {
  const user = requireAuth();
  if (user && user.role !== 'Admin') {
    window.location.href = 'dashboard.html';
    return null;
  }
  return user;
}

// ===== API CALL WRAPPER =====
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ===== AUTH ACTIONS =====
async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', 'POST', { email, password });
  saveSession(data);
  return data;
}

async function registerStaff(fullName, email, password, role) {
  return apiRequest('/auth/register', 'POST', { fullName, email, password, role });
}

async function fetchAllUsers() {
  return apiRequest('/auth/users', 'GET');
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', 'PUT', { currentPassword, newPassword });
}

// ===== SIDEBAR (shared across all pages) =====
// activePage: 'patients' | 'users' | 'profile'
function initSidebar(user, activePage) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const isAdmin = user.role === 'Admin';
  const initial = user.fullName?.charAt(0).toUpperCase() || '?';

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <i class="fa-solid fa-notes-medical"></i>
      <div>
        HRMS
        <span class="sb-sub">Akunza PHC</span>
      </div>
    </div>
    <nav>
      <a href="dashboard.html" class="${activePage === 'patients' ? 'active' : ''}">
        <i class="fa-solid fa-user-injured"></i> Patients
      </a>
      ${isAdmin ? `
      <a href="users.html" class="${activePage === 'users' ? 'active' : ''}">
        <i class="fa-solid fa-users-gear"></i> Health Workers
      </a>` : ''}
      <a href="profile.html" class="${activePage === 'profile' ? 'active' : ''}">
        <i class="fa-solid fa-circle-user"></i> Profile
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="sf-name">${user.fullName}</div>
      <span class="sf-role">${user.role}</span>
      <button class="btn btn-outline btn-sm" onclick="logout()" style="color:#fff; border-color:rgba(255,255,255,0.3);">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  `;
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', 'PUT', { currentPassword, newPassword });
}
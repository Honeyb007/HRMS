const currentUser = requireAdmin(); // redirects non-admins to dashboard

document.getElementById('userName').textContent = currentUser.fullName;
document.getElementById('userRole').textContent = currentUser.role;

let allUsers = [];
let activeTab = 'all';

// ===== LOAD USERS =====
async function loadUsers() {
  try {
    const users = await fetchAllUsers();
    allUsers = users;
    renderUsers();
  } catch (err) {
    console.error(err);
  }
}

function setTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  renderUsers();
}

function renderUsers() {
  const tbody = document.getElementById('userTableBody');
  const emptyState = document.getElementById('emptyState');

  const filtered = activeTab === 'all'
    ? allUsers
    : allUsers.filter(u => u.role === activeTab);

  tbody.innerHTML = '';

  if (!filtered.length) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  filtered.forEach(u => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'default';
    const badgeClass = u.role === 'Admin' ? 'badge-admin' : 'badge-worker';
    tr.innerHTML = `
      <td>${escapeHtml(u.fullName)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge ${badgeClass}">${escapeHtml(u.role)}</span></td>
      <td>${formatDate(u.createdAt)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== REGISTER STAFF =====
function openUserPanel() {
  document.getElementById('userForm').reset();
  document.getElementById('userErrorBox').hidden = true;
  document.getElementById('userPanelOverlay').hidden = false;
}

function closeUserPanel() {
  document.getElementById('userPanelOverlay').hidden = true;
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('userSubmitBtn');
  const errorBox = document.getElementById('userErrorBox');
  errorBox.hidden = true;

  const fullName = document.getElementById('uFullName').value.trim();
  const email = document.getElementById('uEmail').value.trim();
  const password = document.getElementById('uPassword').value;
  const role = document.getElementById('uRole').value;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

  try {
    await registerStaff(fullName, email, password, role);
    closeUserPanel();
    loadUsers();
  } catch (err) {
    errorBox.textContent = err.message || 'Failed to create account.';
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Create Account';
  }
});

// ===== HELPERS =====
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ===== INIT =====
loadUsers();
const currentUser = requireAuth();

// Populate header user info
document.getElementById('userName').textContent = currentUser.fullName;
document.getElementById('userRole').textContent = currentUser.role;
if (currentUser.role === 'Admin') {
  document.getElementById('usersLink').hidden = false;
}

let allPatients = [];

// ===== LOAD PATIENTS =====
async function loadPatients(search = '') {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const patients = await apiRequest(`/patients${query}`, 'GET');
    allPatients = patients;
    renderPatients(patients);
  } catch (err) {
    console.error(err);
  }
}

function renderPatients(patients) {
  const tbody = document.getElementById('patientTableBody');
  const emptyState = document.getElementById('emptyState');

  tbody.innerHTML = '';

  if (!patients.length) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  patients.forEach(p => {
    const tr = document.createElement('tr');
    tr.onclick = () => window.location.href = `patient.html?id=${p._id}`;
    tr.innerHTML = `
      <td>${escapeHtml(p.fullName)}</td>
      <td>${escapeHtml(p.gender)}</td>
      <td>${formatDate(p.dateOfBirth)}</td>
      <td>${escapeHtml(p.phone)}</td>
      <td>${p.bloodGroup ? escapeHtml(p.bloodGroup) : '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== SEARCH =====
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  const value = e.target.value.trim();
  searchTimeout = setTimeout(() => loadPatients(value), 300);
});

// ===== REGISTER PATIENT PANEL =====
function openPatientPanel() {
  document.getElementById('patientForm').reset();
  document.getElementById('patientErrorBox').hidden = true;
  document.getElementById('patientPanelOverlay').hidden = false;
}

function closePatientPanel() {
  document.getElementById('patientPanelOverlay').hidden = true;
}

document.getElementById('patientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('patientSubmitBtn');
  const errorBox = document.getElementById('patientErrorBox');
  errorBox.hidden = true;

  const payload = {
    fullName: document.getElementById('pFullName').value.trim(),
    gender: document.getElementById('pGender').value,
    dateOfBirth: document.getElementById('pDob').value,
    phone: document.getElementById('pPhone').value.trim(),
    address: document.getElementById('pAddress').value.trim(),
    bloodGroup: document.getElementById('pBloodGroup').value.trim()
  };

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  try {
    await apiRequest('/patients', 'POST', payload);
    closePatientPanel();
    loadPatients();
  } catch (err) {
    errorBox.textContent = err.message || 'Failed to register patient.';
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Register Patient';
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
loadPatients();
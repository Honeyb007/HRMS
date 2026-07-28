const currentUser = requireAuth();
document.getElementById('userName').textContent = currentUser.fullName;
document.getElementById('userRole').textContent = currentUser.role;
if (currentUser.role === 'Admin') {
  document.getElementById('usersLink').hidden = false;
}

const params = new URLSearchParams(window.location.search);
const patientId = params.get('id');

if (!patientId) {
  window.location.href = 'dashboard.html';
}

let currentPatient = null;

// ===== LOAD PATIENT BIO =====
async function loadPatient() {
  try {
    const patient = await apiRequest(`/patients/${patientId}`, 'GET');
    currentPatient = patient;
    renderBio(patient);
  } catch (err) {
    console.error(err);
    window.location.href = 'dashboard.html';
  }
}

function renderBio(p) {
  document.getElementById('bioName').textContent = p.fullName;
  document.getElementById('bioMeta').textContent = `Registered ${formatDate(p.registeredAt)}`;

  const details = document.getElementById('bioDetails');
  details.innerHTML = `
    ${bioItem('Gender', p.gender)}
    ${bioItem('Date of Birth', formatDate(p.dateOfBirth))}
    ${bioItem('Phone', p.phone)}
    ${bioItem('Blood Group', p.bloodGroup || '—')}
    ${bioItem('Address', p.address)}
  `;
}

function bioItem(label, value) {
  return `
    <div>
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.4px; color:var(--ink-soft); margin-bottom:2px;">${label}</div>
      <div style="font-weight:600;">${escapeHtml(value)}</div>
    </div>
  `;
}

// ===== LOAD RECORDS =====
async function loadRecords() {
  try {
    const records = await apiRequest(`/records/patient/${patientId}`, 'GET');
    renderRecords(records);
  } catch (err) {
    console.error(err);
  }
}

function renderRecords(records) {
  const list = document.getElementById('recordsList');
  const empty = document.getElementById('emptyRecords');

  list.innerHTML = '';

  if (!records.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  records.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <div>
          <div style="font-weight:700; font-size:15px;">${escapeHtml(r.diagnosis)}</div>
          <div style="font-size:12px; color:var(--ink-soft);">${formatDate(r.visitDate)} &middot; Recorded by ${escapeHtml(r.recordedBy?.fullName || 'Unknown')}</div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:10px; font-size:13px;">
        ${r.symptoms ? bioItem('Symptoms', r.symptoms) : ''}
        ${r.treatment ? bioItem('Treatment', r.treatment) : ''}
        ${r.prescription ? bioItem('Prescription', r.prescription) : ''}
      </div>
    `;
    list.appendChild(card);
  });
}

// ===== ADD RECORD =====
function openRecordPanel() {
  document.getElementById('recordForm').reset();
  document.getElementById('recordErrorBox').hidden = true;
  document.getElementById('recordPanelOverlay').hidden = false;
}

function closeRecordPanel() {
  document.getElementById('recordPanelOverlay').hidden = true;
}

document.getElementById('recordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('recordSubmitBtn');
  const errorBox = document.getElementById('recordErrorBox');
  errorBox.hidden = true;

  const payload = {
    patientId,
    diagnosis: document.getElementById('rDiagnosis').value.trim(),
    symptoms: document.getElementById('rSymptoms').value.trim(),
    treatment: document.getElementById('rTreatment').value.trim(),
    prescription: document.getElementById('rPrescription').value.trim()
  };

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  try {
    await apiRequest('/records', 'POST', payload);
    closeRecordPanel();
    loadRecords();
  } catch (err) {
    errorBox.textContent = err.message || 'Failed to save record.';
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Save Record';
  }
});

// ===== EDIT PATIENT =====
function openEditPanel() {
  document.getElementById('editErrorBox').hidden = true;
  document.getElementById('ePFullName').value = currentPatient.fullName;
  document.getElementById('ePGender').value = currentPatient.gender;
  document.getElementById('ePDob').value = currentPatient.dateOfBirth?.split('T')[0] || '';
  document.getElementById('ePPhone').value = currentPatient.phone;
  document.getElementById('ePBloodGroup').value = currentPatient.bloodGroup || '';
  document.getElementById('ePAddress').value = currentPatient.address;
  document.getElementById('editPanelOverlay').hidden = false;
}

function closeEditPanel() {
  document.getElementById('editPanelOverlay').hidden = true;
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('editSubmitBtn');
  const errorBox = document.getElementById('editErrorBox');
  errorBox.hidden = true;

  const payload = {
    fullName: document.getElementById('ePFullName').value.trim(),
    gender: document.getElementById('ePGender').value,
    dateOfBirth: document.getElementById('ePDob').value,
    phone: document.getElementById('ePPhone').value.trim(),
    bloodGroup: document.getElementById('ePBloodGroup').value.trim(),
    address: document.getElementById('ePAddress').value.trim()
  };

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  try {
    const updated = await apiRequest(`/patients/${patientId}`, 'PUT', payload);
    currentPatient = updated;
    renderBio(updated);
    closeEditPanel();
  } catch (err) {
    errorBox.textContent = err.message || 'Failed to update patient.';
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
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
loadPatient();
loadRecords();
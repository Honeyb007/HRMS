const currentUser = requireAuth();

// Sidebar
document.getElementById('sbUserName').textContent = currentUser.fullName;
document.getElementById('sbUserRole').textContent = currentUser.role;
if (currentUser.role === 'Admin') {
  document.getElementById('usersLink').hidden = false;
}

// Profile card
document.getElementById('profileName').textContent = currentUser.fullName;
document.getElementById('profileEmail').textContent = currentUser.email;

const roleBadge = document.getElementById('profileRoleBadge');
roleBadge.textContent = currentUser.role;
roleBadge.className = 'badge ' + (currentUser.role === 'Admin' ? 'badge-admin' : 'badge-worker');

const initials = currentUser.fullName
  .split(' ')
  .map(n => n[0])
  .slice(0, 2)
  .join('')
  .toUpperCase();
document.getElementById('avatarInitials').textContent = initials;

// Change password
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('passwordSubmitBtn');
  const errorBox = document.getElementById('passwordErrorBox');
  const successBox = document.getElementById('successBox');
  errorBox.hidden = true;
  successBox.hidden = true;

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    errorBox.textContent = 'New passwords do not match.';
    errorBox.hidden = false;
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

  try {
    await changePassword(currentPassword, newPassword);
    successBox.textContent = 'Password updated successfully.';
    successBox.hidden = false;
    document.getElementById('passwordForm').reset();
  } catch (err) {
    errorBox.textContent = err.message || 'Failed to update password.';
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-key"></i> Update Password';
  }
});
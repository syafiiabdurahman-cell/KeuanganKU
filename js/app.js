// Real-time Clock for iOS Status Bar
function updateIOSClock() {
  const clockEl = document.getElementById('ios-clock');
  if (!clockEl) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}`;
}
setInterval(updateIOSClock, 1000);
updateIOSClock();

// Tab Switcher Logic
function switchTab(tabName) {
  const views = document.querySelectorAll('.tab-view');
  views.forEach(view => view.classList.add('hidden'));

  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('text-indigo-500', 'active');
    item.classList.add('text-slate-400');
  });

  const activeNav = document.getElementById(`nav-${tabName}`);
  if (activeNav) {
    activeNav.classList.remove('text-slate-400');
    activeNav.classList.add('text-indigo-500', 'active');
  }
}

// Toggle Frame / Fullscreen Mode
document.getElementById('toggle-frame-btn')?.addEventListener('click', () => {
  const body = document.body;
  const statusText = document.getElementById('frame-status-text');
  
  body.classList.toggle('fullscreen-mode');
  if (body.classList.contains('fullscreen-mode')) {
    statusText.textContent = 'Mode Fullscreen';
  } else {
    statusText.textContent = 'Mode iPhone Mockup';
  }
});

// Modal Helper Functions
function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}
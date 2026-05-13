// BillSafe Portal — shared JS
// Include after supabase-js script tag

const SUPABASE_URL  = 'https://rjnsnodvqwwhkxbznzqa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbnNub2R2cXd3aGt4YnpuenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODg1OTksImV4cCI6MjA5Mzc2NDU5OX0.gkV9ynTFdY8B72s2fnRpTkUH71FUz59ICIpQLZQDsIc';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── AUTH GUARD ─────────────────────────────────────────────
async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { window.location.href = 'auth.html'; return null; }
  return session.user;
}

// ── RENDER SIDEBAR USER ────────────────────────────────────
function renderSidebarUser(user) {
  const name = user.user_metadata?.full_name || user.email || 'Utilisateur';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const avatarEl = document.getElementById('user-avatar');
  const nameEl   = document.getElementById('user-name');
  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl)   nameEl.textContent = name;
}

// ── LOGOUT ─────────────────────────────────────────────────
async function logout() {
  await db.auth.signOut();
  window.location.href = 'auth.html';
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── FORMAT ─────────────────────────────────────────────────
function fmtAmount(n) {
  return n ? Number(n).toLocaleString('fr-FR') + ' FCFA' : '—';
}
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '—';
}
function fmtMonth(m) {
  return m ? new Date(m + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—';
}
function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}
function avatarColor(name) {
  const colors = ['av-green','av-blue','av-purple','av-amber'];
  return colors[(name || '').charCodeAt(0) % colors.length];
}

// ── MODAL HELPERS ──────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

const root = document.documentElement;

// ---- Цэс: Bootstrap Collapse. Холбоос дарах, Escape даралтаар хаана ----
const nav = document.getElementById('main-nav');
const toggler = document.querySelector('.navbar-toggler');
const collapse = bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });
nav.addEventListener('show.bs.collapse', () => toggler.setAttribute('aria-label', 'Цэс хаах'));
nav.addEventListener('hide.bs.collapse', () => toggler.setAttribute('aria-label', 'Цэс нээх'));
nav.addEventListener('click', e => { if (e.target.closest('a')) collapse.hide(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') collapse.hide(); });

// ---- Dark mode: Bootstrap-ийн data-bs-theme атрибутыг сольно ----
const themeBtn = document.getElementById('theme-btn');
function syncBtn() {
  const dark = root.getAttribute('data-bs-theme') === 'dark';
  themeBtn.setAttribute('aria-pressed', dark);
  themeBtn.textContent = dark ? '☀️ Гэрэлтэй' : '🌙 Харанхуй';
}
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-bs-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncBtn();
});
syncBtn();

// ---- Эргэдэг цэсний card ----
document.querySelectorAll('.flip').forEach(card => {
  const btn = card.querySelector('.flip-btn');
  const back = card.querySelector('.flip-back');
  btn.addEventListener('click', () => {
    const on = card.classList.toggle('is-flipped');
    btn.setAttribute('aria-pressed', on);
    back.setAttribute('aria-hidden', !on);
  });
});

// ---- Form validation: Bootstrap-ийн .was-validated ----
const form = document.getElementById('feedback-form');
const ok = document.getElementById('form-ok');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (form.checkValidity()) {
    ok.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');
  } else {
    ok.classList.add('d-none');
    form.classList.add('was-validated');
    form.querySelector(':invalid').focus();
  }
});

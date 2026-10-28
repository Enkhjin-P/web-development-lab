const root = document.documentElement;

// ---- Цэс (гар утас) ----
const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');
function setMenu(open) {
  mainNav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Цэс хаах' : 'Цэс нээх');
  menuBtn.textContent = open ? '✕' : '☰';
}
menuBtn.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));
mainNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---- Dark mode: html[data-theme]-ийг сольно, @custom-variant үүнийг уншина ----
const themeBtn = document.getElementById('theme-btn');
function syncBtn() {
  const dark = root.getAttribute('data-theme') === 'dark';
  themeBtn.setAttribute('aria-pressed', dark);
  themeBtn.textContent = dark ? '☀️ Гэрэлтэй' : '🌙 Харанхуй';
}
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncBtn();
});
syncBtn();

// ---- Эргэдэг цэсний card ----
document.querySelectorAll('.group.flex').forEach(card => {
  const btn = card.querySelector('.flip-btn');
  if (!btn) return;
  const back = card.querySelector('.flip-inner > :last-child');
  btn.addEventListener('click', () => {
    const on = card.classList.toggle('is-flipped');
    btn.setAttribute('aria-pressed', on);
    back.setAttribute('aria-hidden', !on);
  });
});

// ---- Form validation: :invalid төлөв + ".touched" класс ----
const form = document.getElementById('feedback-form');
const ok = document.getElementById('form-ok');
const fields = form.querySelectorAll('input, textarea');
fields.forEach(f => f.addEventListener('blur', () => f.classList.add('touched')));
form.addEventListener('submit', e => {
  e.preventDefault();
  fields.forEach(f => f.classList.add('touched'));
  if (form.checkValidity()) {
    ok.classList.remove('hidden');
    form.reset();
    fields.forEach(f => f.classList.remove('touched'));
  } else {
    ok.classList.add('hidden');
    form.querySelector(':invalid').focus();
  }
});

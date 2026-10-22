const root = document.documentElement;
root.classList.add('js');


const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');
function setMenu(open) {
  mainNav.classList.toggle('main-nav--open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Цэс хаах' : 'Цэс нээх');
  menuBtn.textContent = open ? '✕' : '☰';
}
menuBtn.addEventListener('click', () => setMenu(!mainNav.classList.contains('main-nav--open')));
mainNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });


const themeBtn = document.getElementById('theme-btn');
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
function syncBtn() {
  const dark = root.dataset.theme === 'dark' ||
    (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  themeBtn.setAttribute('aria-pressed', dark);
  themeBtn.textContent = dark ? '☀️ Гэрэлтэй' : '🌙 Харанхуй';
}
themeBtn.addEventListener('click', () => {
  const dark = themeBtn.getAttribute('aria-pressed') === 'true';
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  syncBtn();
});
syncBtn();


document.querySelectorAll('.flip').forEach(card => {
  const btn = card.querySelector('.flip__btn');
  const back = card.querySelector('.flip__face--back');
  btn.addEventListener('click', () => {
    const on = card.classList.toggle('flip--flipped');
    btn.setAttribute('aria-pressed', on);
    back.setAttribute('aria-hidden', !on);
  });
});

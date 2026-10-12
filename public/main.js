(() => {
  'use strict';
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'เปิดเมนู' : 'ปิดเมนู');
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Source originals are kept unmodified. WebP previews are optimized for mobile.
  const posters = {
    'ice-cream': {title: 'ไอศกรีมโคน', file: 'assets/originals/ice-cream.png'},
    'fruit-tea': {title: 'ซีรีส์ชาผลไม้สด', file: 'assets/originals/fruit-tea.png'},
    'milk-tea': {title: 'ชานมหอมหวาน', file: 'assets/originals/milk-tea.png'},
    'smoothie': {title: 'ซีรีส์สมูทตี้', file: 'assets/originals/smoothie.png'},
    'sundae': {title: 'เมนูซันเดย์', file: 'assets/originals/sundae.png'},
    'bakery': {title: 'เมนูเบเกอรี่', file: 'assets/originals/bakery.png'},
    'pizza': {title: 'พิซซ่าฮาวายเอี้ยน', file: 'assets/originals/pizza-portrait.png'}
  };
  const dialog = document.getElementById('posterDialog');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogImage = document.getElementById('dialogImage');
  const close = document.getElementById('dialogClose');
  let previousFocus = null;
  function openPoster(key) {
    const poster = posters[key];
    if (!poster || !dialog || !dialogImage || !dialogTitle) return;
    previousFocus = document.activeElement;
    dialogTitle.textContent = poster.title;
    dialogImage.alt = 'โปสเตอร์เมนู ' + poster.title + ' SNOWTEE ขนาดเต็ม';
    dialogImage.src = poster.file;
    if (!dialog.open) dialog.showModal();
  }
  document.querySelectorAll('[data-poster]').forEach(button => {
    button.addEventListener('click', () => openPoster(button.dataset.poster));
  });
  close?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    dialogImage.removeAttribute('src');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  });
})();

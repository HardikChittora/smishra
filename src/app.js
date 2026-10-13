const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});
const visitCount = document.querySelector('[data-visit-count]');
if (visitCount) {
  try {
    const saved = Number(localStorage.getItem('laboratory-visits') || 0);
    const visits = Number.isSafeInteger(saved) && saved >= 0 && saved < Number.MAX_SAFE_INTEGER ? saved + 1 : 1;
    localStorage.setItem('laboratory-visits', String(visits));
    const digits = String(visits).padStart(5,'0');
    visitCount.replaceChildren(...Array.from(digits, digit => {
      const cell = document.createElement('span');
      cell.className = 'visit-digit';
      cell.textContent = digit;
      cell.setAttribute('aria-hidden','true');
      return cell;
    }));
    visitCount.setAttribute('aria-label', `${visits.toLocaleString()} visits in this browser`);
  } catch {
    visitCount.textContent = '—';
    visitCount.parentElement.title = 'Visit counting is unavailable because browser storage is disabled.';
  }
}
const slides = [...document.querySelectorAll('.announcement-slide')];
if (slides.length) {
  const dots = [...document.querySelectorAll('[data-slide-index]')];
  let current = 0;
  const select = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => {
      slide.hidden = i !== current;
      slide.querySelectorAll('iframe').forEach(frame => {
        if (i === current && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
        else if (i !== current) frame.removeAttribute('src');
      });
    });
    dots.forEach((dot,i) => dot.setAttribute('aria-current',String(i === current)));
  };
  document.querySelector('[data-slide-next]').addEventListener('click', () => select(current+1));
  document.querySelector('[data-slide-prev]').addEventListener('click', () => select(current-1));
  dots.forEach(dot => dot.addEventListener('click', () => select(Number(dot.dataset.slideIndex))));
  document.querySelector('.updates-section').addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {event.preventDefault();select(current+1);}
    if (event.key === 'ArrowLeft') {event.preventDefault();select(current-1);}
  });
  const initial = slides.findIndex(slide => '#' + slide.id === location.hash);
  select(initial >= 0 ? initial : 0);
}
const dialog = document.querySelector('.image-dialog');
if (dialog) {
  document.querySelectorAll('[data-image-viewer]').forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      dialog.querySelector('img').src = image.src;
      dialog.querySelector('img').alt = image.alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
}
const sectionLinks = [...document.querySelectorAll('.section-index a')];
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) sectionLinks.forEach(link => link.classList.toggle('is-active',link.hash === '#'+visible[0].target.id));
  },{rootMargin:'-10% 0px -65% 0px'});
  document.querySelectorAll('.page-content .content-section').forEach(section => observer.observe(section));
}

// Standalone interactions replacing the reference site's platform runtime.
const counter = document.getElementById('comp-kg57wti5');
if (counter) {
  let visits = 1;
  try {
    visits = Number(localStorage.getItem('laboratory-visits') || 0) + 1;
    localStorage.setItem('laboratory-visits', String(visits));
  } catch {}
  const digits = document.createElement('div');
  digits.className = 'visit-digits';
  digits.setAttribute('aria-label', visits + ' visits in this browser');
  String(visits).padStart(6, '0').split('').forEach(digit => {
    const tile = document.createElement('span');tile.textContent = digit;digits.append(tile);
  });
  const label = document.createElement('div');label.className = 'visit-label';label.textContent = 'Visits';
  counter.append(digits, label);
}
document.querySelectorAll('.wixui-video-box').forEach(box => {
  const video = box.querySelector('video');
  const control = box.querySelector('[role="button"]');
  if (!video || !control) return;
  const sync = () => {
    control.setAttribute('aria-pressed', String(!video.paused));
    control.setAttribute('aria-label', video.paused ? 'Play material testing video' : 'Pause material testing video');
    box.toggleAttribute('data-playing', !video.paused);
  };
  const toggle = () => video.paused ? video.play().catch(() => {}) : video.pause();
  control.addEventListener('click', toggle);
  control.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {event.preventDefault();toggle();}
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  video.play().catch(sync);
});

document.querySelectorAll('.wixui-slideshow').forEach(show => {
  const slides = [...show.querySelectorAll('.replica-slide')];
  const dots = [...show.querySelectorAll('nav[aria-label="Slides"] a')];
  let current = 0;
  const select = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.querySelectorAll('iframe').forEach(frame => {
        if (i === current && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
        else if (i !== current) frame.removeAttribute('src');
      });
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('JPnvZO', i === current);
      dot.parentElement.setAttribute('aria-current', String(i === current));
    });
  };
  show.querySelector('[data-testid="nextButton"]').addEventListener('click', () => select(current + 1));
  show.querySelector('[data-testid="prevButton"]').addEventListener('click', () => select(current - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', event => {
    event.preventDefault();select(i);
    history.replaceState(null, '', dot.getAttribute('href'));
  }));
  show.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {event.preventDefault();select(current + 1);}
    if (event.key === 'ArrowLeft') {event.preventDefault();select(current - 1);}
  });
  const initial = slides.findIndex(slide => '#' + slide.id === location.hash);
  select(initial >= 0 ? initial : 0);
});

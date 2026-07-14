// frame counter tied to sections
const frames = document.querySelectorAll('.frame[data-num]');
const badge = document.getElementById('frameBadge');
const total = frames.length;
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const n = e.target.getAttribute('data-num').padStart(2, '0');
      badge.innerHTML = 'QUADRO <span>' + n + ' / ' + String(total).padStart(2, '0') + '</span>';
    }
  });
}, { threshold: 0.4 });
frames.forEach(f => obs.observe(f));

// build filmstrip sprocket holes to fill viewport height
const strip = document.getElementById('filmstrip');
function buildStrip() {
  strip.innerHTML = '';
  const count = Math.ceil(window.innerHeight / 26) + 2;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'hole';
    strip.appendChild(h);
  }
}
buildStrip();
window.addEventListener('resize', buildStrip);

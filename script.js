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

// ---------- synthesized shutter click sound (no audio file needed) ----------
function playShutterClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.035;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    src.connect(gain).connect(ctx.destination);
    src.start();
  } catch (e) { /* audio not available, silently ignore */ }
}

// ---------- flash button ----------
const flashBtn = document.getElementById('flashBtn');
const flashOverlay = document.getElementById('flashOverlay');
if (flashBtn && flashOverlay) {
  flashBtn.addEventListener('click', () => {
    playShutterClick();
    flashOverlay.style.transition = 'none';
    flashOverlay.style.opacity = '1';
    requestAnimationFrame(() => {
      flashOverlay.style.transition = 'opacity 0.6s ease';
      flashOverlay.style.opacity = '0';
    });
  });
}

// ---------- negative mode toggle ----------
const negBtn = document.getElementById('negBtn');
if (negBtn) {
  negBtn.addEventListener('click', () => {
    document.body.classList.toggle('neg-mode');
    negBtn.classList.toggle('active');
  });
}

// ---------- shutter click on contact-sheet photos ----------
document.querySelectorAll('.neg').forEach((n) => {
  n.addEventListener('click', () => {
    playShutterClick();
    n.style.transition = 'none';
    n.style.outline = '3px solid var(--lime)';
    requestAnimationFrame(() => {
      n.style.transition = 'outline-color 0.4s ease';
      setTimeout(() => { n.style.outline = 'none'; }, 400);
    });
  });
});

const phrases = ['Student','AI Enthusiast','Cloud Explorer','Cybersecurity Explorer','Future Entrepreneur'];
let pIndex = 0, cIndex = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  const current = phrases[pIndex];
  if (!deleting) {
    tw.textContent = current.slice(0, ++cIndex);
    if (cIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    tw.textContent = current.slice(0, --cIndex);
    if (cIndex === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 40 : 90);
}
type();

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.width = (scrolled / Math.max(height,1) * 100) + '%';
  document.getElementById('header').classList.toggle('scrolled', scrolled > 50);
  document.getElementById('backToTop').classList.toggle('visible', scrolled > 500);
});
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const toggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active')));

const counters = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;
function runCounters() {
  if (countersStarted) return;
  const about = document.getElementById('about');
  if (about.getBoundingClientRect().top < window.innerHeight * 0.85) {
    countersStarted = true;
    counters.forEach(el => {
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.max(1, target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + (target === 80 ? '+' : '');
          clearInterval(timer);
        } else el.textContent = Math.floor(current);
      }, 25);
    });
  }
}
window.addEventListener('scroll', runCounters);
runCounters();

const fills = document.querySelectorAll('.bar-fill');
function animateBars() {
  fills.forEach(bar => {
    if (bar.getBoundingClientRect().top < window.innerHeight && !bar.classList.contains('done')) {
      bar.classList.add('done');
      bar.style.width = (+bar.dataset.level * 20) + '%';
    }
  });
}
window.addEventListener('scroll', animateBars);
animateBars();

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const body = `Name: ${this.name.value}\nEmail: ${this.email.value}\n\n${this.message.value}`;
  window.location.href = `mailto:utshavadhiakri@gmail.com?subject=${encodeURIComponent(this.subject.value)}&body=${encodeURIComponent(body)}`;
  this.reset();
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.tool-chip').forEach(chip => {
  chip.style.setProperty('--z', (chip.dataset.z || 20) + 'px');
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.animationDelay = (i % 8) * 60 + 'ms';
  io.observe(el);
});

const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let stars = [];
function sizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 2.4 + 0.2,
    s: Math.random() * 1.6 + 0.2
  }));
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(st => {
    st.y += st.z * 0.22;
    st.x += Math.sin(st.y * 0.01) * 0.15;
    if (st.y > canvas.height) st.y = 0;
    ctx.fillStyle = `rgba(165,243,252,${0.18 + st.z * 0.22})`;
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  const hero = document.getElementById('heroContent');
  let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const dx = (e.clientX / innerWidth - 0.5) * 22;
    const dy = (e.clientY / innerHeight - 0.5) * 14;
    hero.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg) translateZ(18px)`;
  });

  function animateCursor() {
    cx += (mx - cx) * 0.25; cy += (my - cy) * 0.25;
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
    follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--gx', x * 100 + '%');
      card.style.setProperty('--gy', y * 100 + '%');
      card.classList.add('tilting');
      card.style.transform = `rotateX(${(0.5 - y) * 18}deg) rotateY(${(x - 0.5) * 20}deg) translateY(-12px) translateZ(24px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.transition = 'transform .35s ease';
      card.style.transform = 'rotateX(0) rotateY(0) translateY(0) translateZ(0)';
      setTimeout(() => { card.style.transition = ''; }, 350);
    });
  });
}
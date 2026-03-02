// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== FLOATING PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['rgba(124,58,237,0.6)', 'rgba(6,182,212,0.6)', 'rgba(168,85,247,0.4)', 'rgba(34,211,238,0.4)'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

// ===== STAR RATING SELECTOR =====
const stars = document.querySelectorAll('#starSelector .star');
let selectedRating = 0;

stars.forEach((star, idx) => {
  star.addEventListener('mouseover', () => {
    stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
  });
  star.addEventListener('click', () => {
    selectedRating = idx + 1;
    stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
  });
});

// ===== REVIEW SUBMISSION =====
const submitReview = document.getElementById('submitReview');
const reviewsGrid = document.getElementById('reviewsGrid');

submitReview.addEventListener('click', () => {
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();

  if (!name) return showToast('Please enter your name!', 'error');
  if (!text) return showToast('Please write your review!', 'error');
  if (selectedRating === 0) return showToast('Please select a rating!', 'error');

  const starStr = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
  const firstLetter = name.charAt(0).toUpperCase();

  const card = document.createElement('div');
  card.className = 'review-card';
  card.style.opacity = '0';
  card.innerHTML = `
    <div class="review-stars">${starStr}</div>
    <p class="review-text">"${escapeHtml(text)}"</p>
    <div class="review-author">
      <div class="review-avatar">${firstLetter}</div>
      <div>
        <strong>${escapeHtml(name)}</strong>
        <span>Verified Customer</span>
      </div>
    </div>
  `;
  reviewsGrid.prepend(card);
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.opacity = '1';
  });

  // Reset form
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewText').value = '';
  selectedRating = 0;
  stars.forEach(s => s.classList.remove('active'));

  showToast('✅ Thank you for your review!', 'success');
  saveReviews();
});

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? 'linear-gradient(135deg, #25d366, #128c7e)' : 'linear-gradient(135deg, #ea4335, #c5221f)'};
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    opacity: 0;
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== SAVE & LOAD REVIEWS (localStorage) =====
function saveReviews() {
  const cards = Array.from(reviewsGrid.querySelectorAll('.review-card')).slice(0, 3);
  const data = cards.map(card => ({
    stars: card.querySelector('.review-stars').textContent,
    text: card.querySelector('.review-text').textContent,
    name: card.querySelector('strong').textContent,
    initial: card.querySelector('.review-avatar').textContent,
  }));
  try { localStorage.setItem('humanizeai_reviews', JSON.stringify(data)); } catch(e) {}
}

function loadSavedReviews() {
  try {
    const saved = localStorage.getItem('humanizeai_reviews');
    if (!saved) return;
    const data = JSON.parse(saved);
    data.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-stars">${r.stars}</div>
        <p class="review-text">${r.text}</p>
        <div class="review-author">
          <div class="review-avatar">${r.initial}</div>
          <div>
            <strong>${r.name}</strong>
            <span>Verified Customer</span>
          </div>
        </div>
      `;
      reviewsGrid.prepend(card);
    });
  } catch(e) {}
}

// ===== WHATSAPP AUTO POPUP =====
// Show popup to visitors after 4 seconds
const waPopup = document.getElementById('waPopup');
const waPopupClose = document.getElementById('waPopupClose');

setTimeout(() => {
  const dismissed = sessionStorage.getItem('wa_popup_dismissed');
  if (!dismissed) {
    waPopup.classList.add('show');
  }
}, 4000);

waPopupClose.addEventListener('click', () => {
  waPopup.classList.remove('show');
  sessionStorage.setItem('wa_popup_dismissed', '1');
});

// Auto-open WhatsApp link after 8 seconds for first-time visitors
(function autoOpenWhatsApp() {
  const alreadyOpened = sessionStorage.getItem('wa_auto_opened');
  if (alreadyOpened) return;
  setTimeout(() => {
    sessionStorage.setItem('wa_auto_opened', '1');
    // Visual click animation on the floating WhatsApp button
    const floatBtn = document.getElementById('floatWhatsApp');
    if (floatBtn) {
      floatBtn.style.transform = 'scale(1.3)';
      setTimeout(() => floatBtn.style.transform = '', 300);
    }
  }, 8000);
})();

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease both';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .step-card, .pricing-card, .review-card, .why-item, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  observer.observe(el);
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinkEls.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--primary-light)' : '';
  });
}, { passive: true });

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent;
        const val = parseInt(text.replace(/[^0-9]/g, ''));
        if (!isNaN(val)) {
          const suffix = text.replace(/[0-9]/g, '').replace('5', '').replace(',', '');
          num.dataset.suffix = suffix;
          num.textContent = '0' + suffix;
          animateCounter(num, val);
        }
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) counterObserver.observe(heroSection);

// Init
loadSavedReviews();

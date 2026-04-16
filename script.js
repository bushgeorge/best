// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileMenuIcon = document.getElementById('mobileMenuIcon');

if (mobileMenuBtn && mobileNav && mobileMenuIcon) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('show');
    mobileMenuIcon.textContent = mobileNav.classList.contains('show') ? '✕' : '☰';
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      mobileNav?.classList.remove('show');
      mobileMenuIcon && (mobileMenuIcon.textContent = '☰');
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll progress bar
const progressBar = document.getElementById('progressBar');
const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();

// Contact form mailto submit
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const sendBtn = document.getElementById('sendBtn');

if (contactForm && formSuccess && sendBtn) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const subject = document.getElementById('subject')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';

    const to = 'georgebushobare@gmail.com';
    const composedSubject = subject || `New message from ${name || 'Portfolio Contact'}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailtoHref = `mailto:${to}?subject=${encodeURIComponent(composedSubject)}&body=${body}`;

    // Open the user's email client
    window.location.href = mailtoHref;

    // Optimistically show success after a short delay to allow client to open
    sendBtn.disabled = true;
    sendBtn.textContent = 'Opening email...';
    setTimeout(() => {
      formSuccess.hidden = false;
      sendBtn.textContent = 'Sent!';
      setTimeout(() => {
        contactForm.reset();
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
      }, 2500);
    }, 800);
  });
}

// Lightweight carousel logic
function initCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const images = Array.from(track.querySelectorAll('img'));
  const slides = Array.from(track.querySelectorAll('.carousel-slide')); // Get slides, not just images
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const autoplayMs = parseInt(carousel.dataset.autoplay || '0', 10);
  let index = 0;
  let intervalId = null;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === index ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    const offset = -index * carousel.clientWidth; // Use a negative value for leftward movement
    track.style.transform = `translateX(${offset}px)`;
    renderDots();
  }

  function onResize() {
    layout(); // Recalculate layout on resize
    goTo(index);
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));
  window.addEventListener('resize', onResize);

  if (autoplayMs > 0) {
    intervalId = setInterval(() => goTo(index + 1), autoplayMs);
    carousel.addEventListener('mouseenter', () => intervalId && clearInterval(intervalId));
    carousel.addEventListener('mouseleave', () => { intervalId = setInterval(() => goTo(index + 1), autoplayMs); });
  }

  // Ensure images sit side-by-side with equal width
  function layout() {
    const width = carousel.clientWidth;
    slides.forEach((slide) => { 
      slide.style.width = `${width}px`;
      // Ensure slide height is auto for responsive behavior
      if (window.innerWidth <= 768) {
        slide.style.height = 'auto';
      }
    });
    track.style.width = `${width * slides.length}px`;
  }

  layout();
  renderDots();
  goTo(0);
}

document.querySelectorAll('.carousel').forEach(initCarousel);




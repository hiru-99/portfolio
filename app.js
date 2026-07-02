/* ==========================================================================
   Hiruni Hansini Portfolio - Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initActiveNavScroll();
  initProjectFilters();
  initContactForm();
  initScrollAnimations();
});

/**
 * Navbar interactions: scrolled state and mobile toggle
 */
function initNavbar() {
  const header = document.getElementById('main-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
}

/**
 * Hero Typewriter Effect
 */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = JSON.parse(element.getAttribute('data-words'));
  let wordIndex = 0;
  let txt = '';
  let isDeleting = false;
  
  function type() {
    const currentWord = words[wordIndex % words.length];
    
    if (isDeleting) {
      // Remove characters
      txt = currentWord.substring(0, txt.length - 1);
    } else {
      // Add characters
      txt = currentWord.substring(0, txt.length + 1);
    }

    element.innerHTML = txt;

    // Determine speed
    let typeSpeed = 100;
    if (isDeleting) {
      typeSpeed /= 2; // Delete twice as fast
    }

    // Check if word is complete
    if (!isDeleting && txt === currentWord) {
      // Wait before starting delete
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex++;
      // Wait before starting type
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing
  setTimeout(type, 500);
}

/**
 * Dynamic active navigation links on scroll using IntersectionObserver
 */
function initActiveNavScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const options = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in central part of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

/**
 * Filter projects by tech category
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          // Force reflow for transitions
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Hide after transition
          setTimeout(() => {
            if (btn.getAttribute('data-filter') !== 'all' && !card.getAttribute('data-categories').split(' ').includes(btn.getAttribute('data-filter'))) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/**
 * Contact Form client-side validation and simulation
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !statusDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    const originalText = btnText.textContent;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';

    // Simulate API request (e.g. Formspree/Netlify Form)
    setTimeout(() => {
      showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
      form.reset();
      
      // Reset button
      submitBtn.disabled = false;
      btnText.textContent = originalText;
      btnIcon.className = 'fa-solid fa-paper-plane';
    }, 1500);
  });

  function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';

    // Hide error status after 5 seconds
    if (type === 'error') {
      setTimeout(() => {
        statusDiv.style.opacity = '0';
        setTimeout(() => {
          statusDiv.style.display = 'none';
          statusDiv.style.opacity = '1';
        }, 300);
      }, 5000);
    }
  }
}

/**
 * Scroll reveal animations using IntersectionObserver
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Unobserve once animated
      }
    });
  }, observerOptions);

  // Add scroll reveal classes to panels and elements
  const cards = document.querySelectorAll('.glass-panel, .timeline-item, .project-card, .edu-card, .vol-card');
  
  // Inject transition styles dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal-item {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .reveal-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  cards.forEach(card => {
    card.classList.add('reveal-item');
    observer.observe(card);
  });
}

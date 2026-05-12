/* ================================================================
   KASR BRAZILIAN COFFEE — main.js
   Vanilla JavaScript for:
   - Sticky header on scroll
   - Mobile navigation toggle
   - Scroll-reveal animations
   - Contact form (mailto fallback)
   - Active nav link highlighting
================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------------
     STICKY HEADER — adds .scrolled class when page is scrolled
  ---------------------------------------------------------------- */
  const header = document.getElementById('site-header');

  function handleScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load in case page is already scrolled


  /* ----------------------------------------------------------------
     MOBILE NAVIGATION TOGGLE
  ---------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ----------------------------------------------------------------
     SCROLL REVEAL ANIMATIONS
     Adds .reveal class to elements, then .visible when in viewport
  ---------------------------------------------------------------- */
  const revealTargets = [
    '.product-card',
    '.why-card',
    '.ws-card',
    '.about-text > *',
    '.timeline-item',
    '.channel-item',
    '.pillar',
    '.wholesale-features',
    '.section-title',
    '.section-subtitle',
  ];

  // Add reveal class to all target elements
  revealTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger delay for grid items
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  // IntersectionObserver for reveal
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });


  /* ----------------------------------------------------------------
     ACTIVE NAV LINK — highlights the current section in view
  ---------------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--gold)';
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();


  /* ----------------------------------------------------------------
     CONTACT FORM — opens mailto or WhatsApp with pre-filled message
  ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name     = document.getElementById('name').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const email    = document.getElementById('email').value.trim();
      const interest = document.getElementById('interest').value;
      const message  = document.getElementById('message').value.trim();

      // Build a readable message
      const subject = encodeURIComponent('Inquiry from ' + (name || 'Website Visitor') + ' — Kasr Brazilian Coffee');

      const body = encodeURIComponent(
        'Name: '     + (name     || 'Not provided') + '\n' +
        'Phone: '    + (phone    || 'Not provided') + '\n' +
        'Email: '    + (email    || 'Not provided') + '\n' +
        'Interest: ' + (interest || 'General inquiry') + '\n\n' +
        'Message:\n' + (message  || 'No message provided.')
      );

      // ============================================================
      // CONTACT FORM EMAIL — Edit the email address below
      // ============================================================
      const mailtoLink = 'mailto:info@kasrbraziliancoffee.com?subject=' + subject + '&body=' + body;
      window.location.href = mailtoLink;

      // Show a brief confirmation
      showFormSuccess(contactForm);
    });
  }

  function showFormSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent — We\'ll be in touch!';
    btn.style.background = '#25D366';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }


  /* ----------------------------------------------------------------
     SMOOTH SCROLL for anchor links (fallback for older browsers)
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ----------------------------------------------------------------
     HERO PARALLAX (subtle, performance-safe)
  ---------------------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg-pattern');
  if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------------
     PRODUCT CARD image placeholder hover effect
  ---------------------------------------------------------------- */
  document.querySelectorAll('.product-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      const icon = card.querySelector('.product-img-placeholder');
      if (icon) {
        icon.style.opacity = '0.8';
        icon.style.transform = 'scale(1.1)';
        icon.style.transition = 'all 0.3s ease';
      }
    });
    card.addEventListener('mouseleave', function () {
      const icon = card.querySelector('.product-img-placeholder');
      if (icon) {
        icon.style.opacity = '';
        icon.style.transform = '';
      }
    });
  });


  /* ----------------------------------------------------------------
     CONSOLE WELCOME MESSAGE (for developers inspecting the site)
  ---------------------------------------------------------------- */
  console.log(
    '%c☕ Kasr Brazilian Coffee',
    'color: #C9973A; font-size: 18px; font-weight: bold;'
  );
  console.log(
    '%cPremium Brazilian Coffee in Egypt\nEdit products & prices in index.html\nEdit contact info in index.html & main.js',
    'color: #4A1C08; font-size: 12px;'
  );

}); // end DOMContentLoaded

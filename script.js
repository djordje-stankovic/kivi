/* Kivi - Premium Website Script */

(function() {
  'use strict';

  // ===== Preloader =====
  window.addEventListener('load', function() {
    var preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('loaded');
    }
  });

  // ===== Dynamic Copyright Year =====
  document.querySelectorAll('.current-year').forEach(function(el) {
    el.textContent = new Date().getFullYear();
  });

  // ===== Navbar Scroll =====
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ===== Mobile Menu =====
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileOverlay = document.querySelector('.mobile-overlay');

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (hamburger) hamburger.classList.add('active');
    if (mobileNav) mobileNav.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      if (mobileNav && mobileNav.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ===== Back to Top =====
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Scroll Animations (AN4: Staggered) =====
  var animElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // Safety fallback: show all after 2s
  setTimeout(function() {
    animElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }, 2000);

  // ===== Counter Animation =====
  var counters = document.querySelectorAll('.hero-stat__number[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(c) {
      counterObserver.observe(c);
    });
  } else {
    // Fallback
    counters.forEach(function(c) {
      var target = c.getAttribute('data-count') || '';
      var suffix = c.getAttribute('data-suffix') || '';
      c.textContent = target + suffix;
    });
  }

  // ===== Contact Form Validation =====
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(function(g) {
        g.classList.remove('error');
      });

      var name = contactForm.querySelector('#name');
      var email = contactForm.querySelector('#email');
      var message = contactForm.querySelector('#message');

      if (name && name.value.trim().length < 2) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (message && message.value.trim().length < 10) {
        message.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (valid) {
        var success = contactForm.querySelector('.form-success');
        if (success) success.classList.add('show');
        contactForm.reset();
        setTimeout(function() {
          if (success) success.classList.remove('show');
        }, 5000);
      }
    });
  }

  // ===== 3D Tilt Cards =====
  (function() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.tilt-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  })();

})();

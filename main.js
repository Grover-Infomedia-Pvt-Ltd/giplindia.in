/* ===================================================================
   GIPL India — Main JavaScript (main.js)
   Handles: Nav scroll, Mobile menu, Scroll animations, Counters,
            FAQ accordions, FormSubmit.co AJAX integration,
            Back-to-top, Smooth scroll, Toast notifications
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar & Site Header Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');
  const siteHeader = document.getElementById('site-header');
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
      siteHeader?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');
  const menuOverlay = mobileMenu?.querySelector('.menu-overlay');

  const openMenu = () => {
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Smooth Scrolling for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMenu();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Scroll Reveal Animations ---------- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  /* ---------- Animated Number Counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const targetStr = el.getAttribute('data-counter');
    const target = parseFloat(targetStr);
    if (isNaN(target)) return;

    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const isDecimal = targetStr.includes('.');
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        current = target;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix;
        return;
      }
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix;
      requestAnimationFrame(tick);
    };

    tick();
  };

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- FAQ Accordions ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close other items in the same container
      const container = item.closest('.space-y-4, .container-custom');
      if (container) {
        container.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = '0';
          }
        });
      }

      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = (answer.scrollHeight + 30) + 'px';
      } else {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = '0';
      }
    });
  });

  // Initialize pre-opened FAQ items
  document.querySelectorAll('.faq-item.active .faq-answer').forEach(ans => {
    ans.style.maxHeight = (ans.scrollHeight + 30) + 'px';
  });

  /* ---------- Contact Form & FormSubmit.co AJAX Handling ---------- */
  const contactForm = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-error-banner');
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors & banners
      contactForm.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
      contactForm.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
      if (successBanner) successBanner.classList.add('hidden');
      if (errorBanner) errorBanner.classList.add('hidden');

      // 1. Name validation
      const name = contactForm.querySelector('#contact-name');
      if (name && name.value.trim().length < 2) {
        showFieldError(name, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      }

      // 2. Email validation
      const email = contactForm.querySelector('#contact-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid business email address.');
        isValid = false;
      }

      // 3. Phone validation
      const phone = contactForm.querySelector('#contact-phone');
      if (phone && phone.value.trim().length < 7) {
        showFieldError(phone, 'Please enter a valid contact phone number.');
        isValid = false;
      }

      // 3.5 Company validation
      const company = contactForm.querySelector('#contact-company');
      if (company && company.value.trim().length < 2) {
        showFieldError(company, 'Please enter your organization name.');
        isValid = false;
      }

      // 3.6 Primary Service dropdown validation
      const service = contactForm.querySelector('#contact-service');
      if (service && !service.value) {
        showFieldError(service, 'Please select a primary solution category.');
        isValid = false;
      }

      // 3.7 NDA Checkbox validation
      const nda = contactForm.querySelector('#nda-agree');
      if (nda && !nda.checked) {
        showToast('Please agree to the confidentiality and privacy terms to proceed.', 'error');
        isValid = false;
      }

      // 4. Subject validation
      const subject = contactForm.querySelector('#contact-subject');
      if (subject && subject.value.trim().length < 3) {
        showFieldError(subject, 'Please specify the subject or purpose of engagement.');
        isValid = false;
      }

      // 5. Project details validation
      const message = contactForm.querySelector('#contact-message');
      if (message && message.value.trim().length < 10) {
        showFieldError(message, 'Please provide project details (at least 10 characters).');
        isValid = false;
      }

      if (!isValid) return;

      // Prepare hidden reply-to field
      const replyTo = document.getElementById('hidden-replyto');
      if (replyTo && email) {
        replyTo.value = email.value.trim();
      }

      // Show spinner & disable button
      if (submitBtn) submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.classList.remove('hidden');
      if (btnText) btnText.innerHTML = 'Sending Proposal Request...';

      // Submit via FormSubmit.co AJAX Endpoint
      const endpoint = 'https://formsubmit.co/ajax/subuhi@giplindia.in';
      const formData = new FormData(contactForm);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          // Success
          if (successBanner) {
            successBanner.classList.remove('hidden');
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          showToast('Inquiry Submitted Successfully! Subuhi Abbasi will connect within 2 hours.', 'success');
          contactForm.reset();
        } else {
          throw new Error('Server responded with status: ' + response.status);
        }
      } catch (err) {
        console.warn('FormSubmit AJAX encounter error, revealing fallback:', err);
        if (errorBanner) {
          errorBanner.classList.remove('hidden');
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Please email Subuhi Abbasi directly at subuhi@giplindia.in', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btnText) btnText.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> Submit Request for Proposal';
      }
    });
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    const parent = input.closest('div');
    const errorEl = parent?.querySelector('.form-error') || parent?.parentElement?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /* ---------- Toast Notification ---------- */
  function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="margin-right:0.5rem"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
  window.showToast = showToast;

  /* ---------- Back to Top Button ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Active Nav Link Highlight ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Hero Typing Effect ---------- */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = JSON.parse(typingEl.getAttribute('data-words') || '[]');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentWord = words[wordIndex];
      if (!currentWord) return;

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 45 : 90;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      setTimeout(typeLoop, delay);
    }

    if (words.length > 0) typeLoop();
  }

});

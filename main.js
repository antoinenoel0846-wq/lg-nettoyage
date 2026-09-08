(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Scroll progress ---------- */
  var progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  /* ---------- Mobile menu: services toggle + auto-close on nav ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var fsSubnavToggle = document.querySelector('.fs-subnav-toggle');
  if (fsSubnavToggle) {
    fsSubnavToggle.addEventListener('click', function () {
      var item = fsSubnavToggle.closest('.fs-nav-item');
      var isOpen = item.classList.toggle('is-open');
      fsSubnavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
  if (navToggle) {
    var burgerLabel = document.querySelector('label.burger');
    var syncBurgerLabel = function () {
      if (burgerLabel) burgerLabel.setAttribute('aria-label', navToggle.checked ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    navToggle.addEventListener('change', syncBurgerLabel);
    document.querySelectorAll('.fullscreen-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.checked = false;
        syncBurgerLabel();
      });
    });
  }

  /* ---------- Vitres parallax ---------- */
  var vitresBgImg = document.getElementById('vitresBgImg');
  var vitresSection = document.querySelector('.vitres-v2');

  function updateParallax() {
    if (!vitresBgImg || !vitresSection || reduceMotion) return;
    var r = vitresSection.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var center = r.top + r.height / 2 - vh / 2;
    var shift = Math.max(-40, Math.min(40, center * -0.08));
    vitresBgImg.style.transform = 'translateY(' + shift.toFixed(1) + 'px) scale(1.05)';
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateHeader();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
  updateHeader();
  updateParallax();

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.reveal, [data-reveal-group]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Count-up numbers (stats, ratings) ---------- */
  function animateCountUp(el) {
    var raw = el.textContent;
    var match = raw.match(/(\d+)([,.]\d+)?/);
    if (!match) return;
    var prefix = raw.slice(0, match.index);
    var suffix = raw.slice(match.index + match[0].length);
    var decDigits = match[2] ? match[2].slice(1) : '';
    var target = parseFloat(match[1] + (decDigits ? '.' + decDigits : ''));
    var decimals = decDigits.length;
    var duration = 1300;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals).replace('.', ',') + suffix;
      if (progress < 1) window.requestAnimationFrame(tick);
      else el.textContent = raw;
    }
    window.requestAnimationFrame(tick);
  }
  var countEls = document.querySelectorAll('.count-up');
  if (countEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- Cursor glow (hero only, fine pointer) ---------- */
  var glow = document.getElementById('cursorGlow');
  var heroV2 = document.querySelector('.hero-v2');
  if (glow && heroV2 && finePointer && !reduceMotion) {
    heroV2.addEventListener('mousemove', function (e) {
      glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      glow.classList.add('is-active');
    });
    heroV2.addEventListener('mouseleave', function () {
      glow.classList.remove('is-active');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      var strength = 10;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        var y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Services accordion ---------- */
  var accItems = Array.prototype.slice.call(document.querySelectorAll('.service-acc-item'));
  function activateServiceItem(item) {
    if (!item || item.classList.contains('is-active')) return;
    accItems.forEach(function (other) {
      var otherSummary = other.querySelector('.service-acc-summary');
      other.classList.remove('is-active');
      if (otherSummary) otherSummary.setAttribute('aria-expanded', 'false');
    });
    item.classList.add('is-active');
    var summary = item.querySelector('.service-acc-summary');
    if (summary) summary.setAttribute('aria-expanded', 'true');
  }
  if (accItems.length) {
    accItems.forEach(function (item) {
      var summary = item.querySelector('.service-acc-summary');
      if (!summary) return;
      summary.addEventListener('click', function () { activateServiceItem(item); });
    });

    /* Deep links to a specific service (nav dropdown, mobile menu, #service-... URLs).
       Expanding the target collapses whichever item was open before it — if that
       item sits above the target, its panel shrinking shifts everything below
       right as we scroll, so the jump overshoots. Fix: turn off the accordion's
       transitions for one frame, resize instantly, scroll, then restore them. */
    document.querySelectorAll('a[href^="#service-"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target || !target.classList.contains('service-acc-item')) return;
        e.preventDefault();
        var accWrap = document.querySelector('.services-acc');
        if (accWrap) accWrap.classList.add('no-anim');
        activateServiceItem(target);
        void target.offsetHeight; /* force layout before measuring/scrolling */
        var root = document.documentElement;
        var prevBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        target.scrollIntoView({ block: 'start' });
        root.style.scrollBehavior = prevBehavior;
        history.pushState(null, '', link.getAttribute('href'));
        if (accWrap) {
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { accWrap.classList.remove('no-anim'); });
          });
        }
      });
    });
    if (location.hash) {
      var initial = document.querySelector(location.hash);
      if (initial && initial.classList.contains('service-acc-item')) activateServiceItem(initial);
    }
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', function () {
        var wasActive = item.classList.contains('is-active');
        faqItems.forEach(function (other) {
          var otherQuestion = other.querySelector('.faq-question');
          other.classList.remove('is-active');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('is-active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Comment ça marche: step switcher ---------- */
  var howDots = Array.prototype.slice.call(document.querySelectorAll('.how-step-dot'));
  var howSteps = Array.prototype.slice.call(document.querySelectorAll('.how-step'));
  if (howDots.length && howSteps.length) {
    var howAutoplayTimer = null;
    var howCurrent = 0;

    function setHowStep(i) {
      howCurrent = i;
      howDots.forEach(function (d) { d.classList.toggle('is-active', parseInt(d.getAttribute('data-step'), 10) === i); });
      howSteps.forEach(function (s) { s.classList.toggle('is-active', parseInt(s.getAttribute('data-step-panel'), 10) === i); });
    }
    function howNext() { setHowStep((howCurrent + 1) % howSteps.length); }
    function startHowAutoplay() {
      if (reduceMotion) return;
      stopHowAutoplay();
      howAutoplayTimer = window.setInterval(howNext, 5000);
    }
    function stopHowAutoplay() {
      if (howAutoplayTimer) window.clearInterval(howAutoplayTimer);
    }

    howDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setHowStep(parseInt(dot.getAttribute('data-step'), 10) || 0);
        startHowAutoplay();
      });
    });

    var howPanelEl = document.querySelector('.how-v2-panel');
    if (howPanelEl) {
      howPanelEl.addEventListener('mouseenter', stopHowAutoplay);
      howPanelEl.addEventListener('mouseleave', startHowAutoplay);
    }

    /* Only start cycling once the section is actually in view, so visitors
       always land on step 01 first instead of scrolling in mid-cycle. */
    var howSection = document.querySelector('.how-v2');
    if (howSection && 'IntersectionObserver' in window) {
      var howSectionIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setHowStep(0);
            startHowAutoplay();
            howSectionIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      howSectionIO.observe(howSection);
    } else {
      startHowAutoplay();
    }
  }

  /* ---------- Avant / après : slider suivant le curseur ---------- */
  var baFrame = document.getElementById('baFrame');
  if (baFrame) {
    var baDragging = false;

    function setBaPos(clientX) {
      var r = baFrame.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      baFrame.style.setProperty('--ba-pos', pct + '%');
    }

    baFrame.addEventListener('pointermove', function (e) {
      if (finePointer || baDragging) setBaPos(e.clientX);
    });
    baFrame.addEventListener('pointerdown', function (e) {
      baDragging = true;
      setBaPos(e.clientX);
    });
    window.addEventListener('pointerup', function () { baDragging = false; });
    baFrame.addEventListener('pointerleave', function () {
      if (finePointer) baFrame.style.setProperty('--ba-pos', '50%');
    });
  }

  /* ---------- Témoignages : carousel ---------- */
  var spotlight = document.getElementById('spotlight');
  var spotlightText = document.getElementById('spotlightText');
  var spotlightName = document.getElementById('spotlightName');
  var spotlightAvatar = document.getElementById('spotlightAvatar');
  var dots = document.querySelectorAll('#spotlightDots .dot');
  var avisPrev = document.getElementById('avisPrev');
  var avisNext = document.getElementById('avisNext');

  var testimonials = [
    { text: '« Appelé pour laver les vitres de la véranda bon rapport rapport qualité prix »', name: 'Stéphane Mamoul', initials: 'SM' },
    { text: '« Je recommande vivement, sérieux, arrangeant et professionnel 👍 »', name: 'Yanis Ai', initials: 'YA' },
    { text: "« Appelé pour les vitres de chez moi, intervention la semaine d'après, propre efficace a bon prix, je recommande vivement. »", name: 'Léo Couderc', initials: 'LC' }
  ];

  if (spotlight && spotlightText && spotlightName && spotlightAvatar && dots.length) {
    var current = 0;
    var autoplayTimer = null;

    function renderSlide(i) {
      spotlight.classList.add('is-fading');
      window.setTimeout(function () {
        spotlightText.textContent = testimonials[i].text;
        spotlightName.textContent = testimonials[i].name;
        spotlightAvatar.textContent = testimonials[i].initials;
        dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
        spotlight.classList.remove('is-fading');
      }, reduceMotion ? 0 : 280);
      current = i;
    }

    function next() { renderSlide((current + 1) % testimonials.length); }
    function prev() { renderSlide((current - 1 + testimonials.length) % testimonials.length); }

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(next, 6000);
    }
    function stopAutoplay() {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.getAttribute('data-i'), 10) || 0;
        renderSlide(i);
        startAutoplay();
      });
    });
    if (avisNext) avisNext.addEventListener('click', function () { next(); startAutoplay(); });
    if (avisPrev) avisPrev.addEventListener('click', function () { prev(); startAutoplay(); });

    startAutoplay();
    spotlight.addEventListener('mouseenter', stopAutoplay);
    spotlight.addEventListener('mouseleave', startAutoplay);
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');

  if (galleryItems.length && lightbox && lightboxImg) {
    function openLightbox(item) {
      var full = item.getAttribute('data-full');
      var img = item.querySelector('img');
      lightboxImg.src = full;
      lightboxImg.alt = img ? img.alt : '';
      if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- Contact form: fake success state ---------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.hidden = true;
      success.hidden = false;
      window.requestAnimationFrame(function () { success.classList.add('is-visible'); });
    });
  }
})();

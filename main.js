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

  /* ---------- Services rail: buttons + drag-to-scroll ---------- */
  var rail = document.getElementById('servicesRail');
  if (rail) {
    document.querySelectorAll('.rail-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
        var card = rail.querySelector('.service-card');
        var step = card ? card.getBoundingClientRect().width + 24 : 300;
        rail.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    if (finePointer) {
      var isDown = false, startX = 0, startScroll = 0, moved = false;
      rail.addEventListener('pointerdown', function (e) {
        isDown = true; moved = false;
        startX = e.clientX; startScroll = rail.scrollLeft;
        rail.classList.add('is-dragging');
      });
      window.addEventListener('pointermove', function (e) {
        if (!isDown) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        rail.scrollLeft = startScroll - dx;
      });
      window.addEventListener('pointerup', function () {
        isDown = false;
        rail.classList.remove('is-dragging');
      });
      rail.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    }

    /* Pagination dots synced to scroll position */
    var railDots = document.querySelectorAll('#servicesDots .dot');
    var railCards = Array.prototype.slice.call(rail.querySelectorAll('.service-card'));
    if (railDots.length && railCards.length) {
      var setActiveDot = function (i) {
        railDots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
      };
      var currentCardIndex = function () {
        var railLeft = rail.getBoundingClientRect().left;
        var closest = 0, closestDist = Infinity;
        railCards.forEach(function (card, idx) {
          var dist = Math.abs(card.getBoundingClientRect().left - railLeft);
          if (dist < closestDist) { closestDist = dist; closest = idx; }
        });
        return closest;
      };
      var dotTicking = false;
      rail.addEventListener('scroll', function () {
        if (!dotTicking) {
          window.requestAnimationFrame(function () {
            setActiveDot(currentCardIndex());
            dotTicking = false;
          });
          dotTicking = true;
        }
      }, { passive: true });

      railDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          var i = parseInt(dot.getAttribute('data-i'), 10) || 0;
          var card = railCards[i];
          if (!card) return;
          var target = card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
          rail.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
    }
  }

  /* ---------- Avis spotlight carousel ---------- */
  var spotlight = document.getElementById('spotlight');
  var spotlightText = document.getElementById('spotlightText');
  var spotlightName = document.getElementById('spotlightName');
  var dots = document.querySelectorAll('#spotlightDots .dot');

  var testimonials = [
    { text: 'Appelé pour laver les vitres de la véranda bon rapport rapport qualité prix', name: '★★★★★ — Stéphane Mamoul' },
    { text: 'Je recommande vivement, sérieux, arrangeant et professionnel 👍', name: '★★★★★ — Yanis Ai' },
    { text: "Appelé pour les vitres de chez moi, intervention la semaine d'après, propre efficace a bon prix, je recommande vivement.", name: '★★★★★ — Léo Couderc' }
  ];

  if (spotlight && spotlightText && spotlightName && dots.length) {
    var current = 0;
    var autoplayTimer = null;

    function renderSlide(i) {
      spotlight.classList.add('is-fading');
      window.setTimeout(function () {
        spotlightText.textContent = testimonials[i].text;
        spotlightName.textContent = testimonials[i].name;
        dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
        spotlight.classList.remove('is-fading');
      }, reduceMotion ? 0 : 280);
      current = i;
    }

    function next() { renderSlide((current + 1) % testimonials.length); }

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

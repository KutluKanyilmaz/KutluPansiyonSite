// Kutlu Pansiyon — header scroll state + scroll-reveal animations
(function () {
  'use strict';

  // Fixed header: transparent over the hero, solid once scrolled past 60px.
  var header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger menu.
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    function setMenu(open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    }
    toggle.addEventListener('click', function () {
      setMenu(!header.classList.contains('nav-open'));
    });
    // Close after choosing a link.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    // Close on outside click.
    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) setMenu(false);
    });
    // Reset if the viewport grows back to desktop.
    window.matchMedia('(min-width: 781px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // Light photo carousel for room cards ([data-carousel] with 2+ images).
  document.querySelectorAll('[data-carousel]').forEach(function (media) {
    var slides = Array.prototype.slice.call(media.querySelectorAll('img'));
    if (slides.length < 2) return;

    media.classList.add('carousel-ready');
    var index = 0;

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Fotoğraf ' + (i + 1));
      dot.addEventListener('click', function () { show(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function makeArrow(dir, label, symbol) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel-btn ' + dir;
      btn.setAttribute('aria-label', label);
      btn.innerHTML = symbol;
      btn.addEventListener('click', function () {
        show((index + (dir === 'next' ? 1 : -1) + slides.length) % slides.length);
      });
      return btn;
    }

    function show(i) {
      index = i;
      slides.forEach(function (img, j) { img.classList.toggle('is-active', j === i); });
      dots.forEach(function (dot, j) { dot.classList.toggle('is-active', j === i); });
    }

    media.appendChild(makeArrow('prev', 'Önceki fotoğraf', '&#8249;'));
    media.appendChild(makeArrow('next', 'Sonraki fotoğraf', '&#8250;'));
    media.appendChild(dotsWrap);
    show(0);
  });

  // Scroll-reveal: elements below the fold slide up as they enter the viewport.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var pending = [];
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      // Visible on load — don't animate.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      el.classList.add('reveal-pending');
      pending.push(el);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    pending.forEach(function (el) { observer.observe(el); });

    // Safety net: nothing may stay hidden.
    setTimeout(function () {
      pending.forEach(function (el) { el.classList.add('reveal-in'); });
      observer.disconnect();
    }, 12000);
  }
})();

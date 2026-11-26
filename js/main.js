/* =========================================================
   Aziz Chharchhodawala - Portfolio  |  js/main.js
   1 Loader  2 Scroll reveal  3 Nav + scroll progress
   4 Active link  5 Mobile menu  6 Skill keycaps
   7 Preview lightbox  8 Back to top + copy email  9 Videos
   Every block checks that its elements exist, so a missing
   element can never stop the rest of the script.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return [].slice.call((ctx || document).querySelectorAll(sel));
  };

  /* 1. LOADER 0 -> 100 ------------------------------------ */
  var loader = $('#loader'),
    pct = $('#pct'),
    barFill = $('#bar i'),
    revealStarted = false;

  function startReveal() {
    if (revealStarted) return;
    revealStarted = true;
    var items = $$('.rv');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (x) {
          if (x.isIntersecting) {
            x.target.classList.add('in');
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  if (loader && pct) {
    var t0 = performance.now(),
      DURATION = 1500; // loader length in ms
    document.body.style.overflow = 'hidden';
    (function tick(t) {
      var n = Math.min(100, Math.round(((t - t0) / DURATION) * 100));
      pct.textContent = n;
      if (barFill) barFill.style.width = n + '%';
      if (n < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          loader.classList.add('done');
          document.body.style.overflow = '';
          startReveal();
        }, 250);
      }
    })(t0);
  } else {
    startReveal();
  }

  /* 3. NAV STATE + SCROLL PROGRESS + BACK-TO-TOP BUTTON --- */
  var nav = $('#nav'),
    prog = $('#prog'),
    fab = $('#fab'),
    ticking = false;

  function onScroll() {
    var y = window.scrollY,
      h = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('sc', y > 20);
    if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (fab) fab.classList.toggle('show', y > 600);
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  /* 4. ACTIVE NAV LINK ------------------------------------ */
  var navLinks = $$('.links a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (x) {
          if (x.isIntersecting) {
            navLinks.forEach(function (a) {
              a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    $$('header[id],section[id]').forEach(function (s) {
      spy.observe(s);
    });
  }

  /* 5. MOBILE MENU ---------------------------------------- */
  var burger = $('#burger'),
    menu = $('#links');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger && menu) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains('open'));
    });
    menu.addEventListener('click', function () {
      setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== burger) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* 6. SKILL KEYCAPS -> SKILL CHIPS ------------------------ */
  var keys = $$('.key');
  keys.forEach(function (k) {
    k.addEventListener('click', function () {
      keys.forEach(function (x) {
        x.classList.remove('on');
      });
      k.classList.add('on');
      var v = (k.dataset.k || '').toLowerCase();
      $$('.chip').forEach(function (c) {
        c.classList.toggle('on', c.textContent.toLowerCase().indexOf(v) > -1);
      });
      var target = $('#skills');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* 7. PREVIEW LIGHTBOX (projects + certificates) ---------- */
  (function () {
    var lb = $('#lb');
    if (!lb) return;
    var img = $('img', lb),
      frame = $('iframe', lb),
      cap = $('.cap', lb),
      miss = $('.miss', lb),
      closeBtn = $('.lbx', lb),
      prevBtn = $('.p', lb),
      nextBtn = $('.n', lb),
      items = [],
      idx = 0,
      lastFocus = null;

    // Uses the image the thumbnail actually shows; PDFs use data-src.
    function sourceOf(t) {
      var ds = t.dataset.src || '';
      if (/\.pdf$/i.test(ds)) return ds;
      var im = $('img', t);
      return (im && im.getAttribute('src')) || ds;
    }

    function show(n) {
      if (!items.length) return;
      idx = (n + items.length) % items.length;
      var t = items[idx],
        src = sourceOf(t);
      cap.textContent = t.dataset.cap || '';
      img.hidden = frame.hidden = miss.hidden = true;
      if (/\.pdf$/i.test(src)) {
        frame.src = src;
        frame.hidden = false;
      } else {
        img.onload = function () {
          img.hidden = false;
        };
        img.onerror = function () {
          miss.textContent = 'Nothing here yet. Add your file at ' + src;
          miss.hidden = false;
        };
        img.src = src;
      }
    }

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      frame.src = 'about:blank';
      if (lastFocus) lastFocus.focus();
    }

    $$('.thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        lastFocus = t;
        items = $$('.thumb[data-group="' + t.dataset.group + '"]');
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        show(items.indexOf(t));
        if (closeBtn) closeBtn.focus();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn)
      prevBtn.addEventListener('click', function () {
        show(idx - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener('click', function () {
        show(idx + 1);
      });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  })();

  /* 8. BACK TO TOP + COPY EMAIL --------------------------- */
  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  var toTop = $('#toTop');
  if (toTop) toTop.addEventListener('click', scrollTop);
  if (fab) fab.addEventListener('click', scrollTop);

  var copyBtn = $('#copyMail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var mail = copyBtn.dataset.mail || '';
      function done() {
        copyBtn.textContent = 'Copied ✓';
        setTimeout(function () {
          copyBtn.textContent = 'Copy email';
        }, 1800);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(done, function () {
          window.prompt('Copy email:', mail);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = mail;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          done();
        } catch (err) {
          window.prompt('Copy email:', mail);
        }
        ta.remove();
      }
    });
  }

  /* 9. AUTOPLAY VIDEOS ------------------------------------ */
  $$('video[autoplay]').forEach(function (v) {
    var p = v.play && v.play();
    if (p && p.catch) p.catch(function () {});
  });
  /* 10. THEME TOGGLE (always starts in dark) --------------- */
  var themeBtn = $('#themeBtn'),
    root = document.documentElement;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      themeBtn.setAttribute(
        'aria-label',
        t === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
      );
    }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f8fc' : '#050914');
  }

  applyTheme('dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.classList.add('theme-anim');
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      setTimeout(function () {
        root.classList.remove('theme-anim');
      }, 450);
    });
  }
})();

// loader 0 -> 100
(function () {
  var p = document.getElementById('pct'),
    b = document.querySelector('#bar i'),
    l = document.getElementById('loader'),
    n = 0,
    t0 = performance.now(),
    D = 1500;
  document.body.style.overflow = 'hidden';
  function s(t) {
    n = Math.min(100, Math.round(((t - t0) / D) * 100));
    p.textContent = n;
    b.style.width = n + '%';
    if (n < 100) requestAnimationFrame(s);
    else
      setTimeout(function () {
        l.classList.add('done');
        document.body.style.overflow = '';
        start();
      }, 250);
  }
  requestAnimationFrame(s);
})();
function start() {
  var io = new IntersectionObserver(
    function (e) {
      e.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add('in');
          io.unobserve(x.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('.rv').forEach(function (el) {
    io.observe(el);
  });
}
// nav state, scroll progress, active link
var nav = document.getElementById('nav'),
  prog = document.getElementById('prog'),
  ticking = false;
function onS() {
  var y = scrollY,
    h = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('sc', y > 20);
  prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  ticking = false;
}
addEventListener(
  'scroll',
  function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onS);
    }
  },
  { passive: true },
);
onS();
var links = [].slice.call(document.querySelectorAll('.links a[href^="#"]'));
var so = new IntersectionObserver(
  function (e) {
    e.forEach(function (x) {
      if (x.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
document.querySelectorAll('header[id],section[id]').forEach(function (s) {
  so.observe(s);
});
// mobile menu
var bg = document.getElementById('burger'),
  lk = document.getElementById('links');
bg.onclick = function () {
  var o = lk.classList.toggle('open');
  bg.setAttribute('aria-expanded', o);
};
lk.addEventListener('click', function () {
  lk.classList.remove('open');
  bg.setAttribute('aria-expanded', false);
});
// keycaps <-> chips link
var keys = document.querySelectorAll('.key');
keys.forEach(function (k) {
  k.onclick = function () {
    keys.forEach(function (x) {
      x.classList.remove('on');
    });
    k.classList.add('on');
    var v = k.dataset.k.toLowerCase();
    document.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('on', c.textContent.toLowerCase().indexOf(v) > -1);
    });
    document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
  };
});
// preview lightbox (projects + certificates)
(function () {
  var lb = document.getElementById('lb'),
    im = lb.querySelector('img'),
    fr = lb.querySelector('iframe'),
    cp = lb.querySelector('.cap'),
    ms = lb.querySelector('.miss'),
    items = [],
    i = 0,
    last = null;
  function show(n) {
    i = (n + items.length) % items.length;
    var t = items[i],
      s = t.dataset.src;
    cp.textContent = t.dataset.cap;
    im.hidden = fr.hidden = ms.hidden = true;
    if (/\.pdf$/i.test(s)) {
      fr.src = s;
      fr.hidden = false;
    } else {
      im.onload = function () {
        im.hidden = false;
      };
      im.onerror = function () {
        ms.textContent = 'Nothing here yet. Add your file at ' + s;
        ms.hidden = false;
      };
      im.src = s;
    }
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    fr.src = 'about:blank';
    if (last) last.focus();
  }
  document.querySelectorAll('.thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      last = t;
      items = [].slice.call(
        document.querySelectorAll('.thumb[data-group="' + t.dataset.group + '"]'),
      );
      i = items.indexOf(t);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      show(i);
      lb.querySelector('.lbx').focus();
    });
  });
  lb.querySelector('.lbx').onclick = close;
  lb.querySelector('.p').onclick = function () {
    show(i - 1);
  };
  lb.querySelector('.n').onclick = function () {
    show(i + 1);
  };
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });
  addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

// back to top, copy email, hero video fallback
(function () {
  var up = function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    t = document.getElementById('toTop'),
    f = document.getElementById('fab');
  if (t) t.addEventListener('click', up);
  if (f) f.addEventListener('click', up);
  addEventListener(
    'scroll',
    function () {
      f.classList.toggle('show', scrollY > 600);
    },
    { passive: true },
  );
  var cm = document.getElementById('copyMail');
  if (cm)
    cm.addEventListener('click', function () {
      var m = cm.dataset.mail,
        done = function () {
          cm.textContent = 'Copied ✓';
          setTimeout(function () {
            cm.textContent = 'Copy email';
          }, 1800);
        };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(m).then(done, function () {
          prompt('Copy email:', m);
        });
      } else {
        var a = document.createElement('textarea');
        a.value = m;
        document.body.appendChild(a);
        a.select();
        try {
          document.execCommand('copy');
          done();
        } catch (e) {
          prompt('Copy email:', m);
        }
        a.remove();
      }
    });
  var hm = document.querySelector('.hero-media'),
    v = hm.querySelector('video'),
    src = v.querySelector('source');
  src.addEventListener('error', function () {
    hm.classList.add('novideo');
  });
  v.addEventListener('error', function () {
    hm.classList.add('novideo');
  });
  var p = v.play && v.play();
  if (p && p.catch) p.catch(function () {});
})();

// play any autoplay videos (browsers sometimes block the first attempt)
document.querySelectorAll('video[autoplay]').forEach(function(v){
  var p=v.play&&v.play();
  if(p&&p.catch)p.catch(function(){});
});

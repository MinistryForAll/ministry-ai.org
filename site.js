/* MinistryAI — shared chrome behaviour. No dependencies. */
(function () {
  'use strict';

  /* Mobile navigation disclosure -------------------------------------- */
  var nav = document.querySelector('.site-nav');
  var toggle = nav && nav.querySelector('.nav-toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after following an in-page link on mobile.
    nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.nav-links a') : null;
      if (a && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Copy-to-clipboard for email addresses -----------------------------
     mailto: links do nothing on a machine with no configured mail
     client, so every address on the site is also plain, copyable text. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.copy-btn') : null;
    if (!btn) return;

    var value = btn.getAttribute('data-copy') || '';
    var done = function () {
      var original = btn.textContent;
      btn.textContent = 'Copied';
      btn.setAttribute('data-copied', '1');
      setTimeout(function () {
        btn.textContent = original;
        btn.removeAttribute('data-copied');
      }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, function () { fallback(value, done); });
    } else {
      fallback(value, done);
    }
  });

  function fallback(value, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (err) {
      /* Clipboard unavailable — the address is visible as text anyway. */
    }
  }
})();

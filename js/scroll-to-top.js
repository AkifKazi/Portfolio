(function () {
  var btn = document.querySelector('.floating-top-button');
  if (!btn) return;
  var toggle = function () {
    if (window.scrollY > window.innerHeight * 0.5) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };
  toggle();
  var refresh = function () { window.requestAnimationFrame(toggle); };
  window.addEventListener('scroll', toggle, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('orientationchange', refresh);
})();

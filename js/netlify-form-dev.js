(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  if (!isLocal) return;

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.nodeName !== 'FORM') return;
    if (!(form.hasAttribute('data-netlify') || form.hasAttribute('netlify'))) return;
    var method = (form.getAttribute('method') || 'GET').toUpperCase();
    if (method !== 'POST') return;

    event.preventDefault();

    var action = form.getAttribute('action') || '/';
    try {
      var url = new URL(action, window.location.origin);
      window.location.assign(url.pathname + url.search + url.hash);
    } catch (err) {
      window.location.assign(action);
    }
  }, true);
})();

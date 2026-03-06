(function () {
  // Aplica lazy-load a imágenes dentro del contenido markdown (kramdown no añade atributos).
  // Selectors: .page-body (page, micro, standalone), .project-content (project, project-two-column)
  var selector = '.page-body img:not([loading]), .project-content img:not([loading])';
  var init = function () {
    document.querySelectorAll(selector).forEach(function (img) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

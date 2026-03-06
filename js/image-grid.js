(function () {
  const markInlineImageGrids = () => {
    document.querySelectorAll('p').forEach((p) => {
      const images = p.querySelectorAll('img');
      if (images.length < 2) return;
      const onlyMedia = Array.from(p.childNodes).every((node) => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() === '';
        return node.nodeName === 'IMG' || node.nodeName === 'BR';
      });
      if (onlyMedia) {
        p.classList.add('image-inline-grid');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markInlineImageGrids);
  } else {
    markInlineImageGrids();
  }
})();

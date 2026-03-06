(function () {
  const selector = 'main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]';
  const shouldTapReveal =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const copyLinkToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error('clipboard not available'));
  };

  const copyIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heading-anchor-icon lucide lucide-link-icon lucide-link" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `;
  const anchorLabelPrefix = document.body.dataset.anchorLinkTo || 'Enlace a';
  const anchorPermalinkTitle = document.body.dataset.anchorPermalinkTitle || 'Enlace permanente';

  const initHeadingAnchors = () => {
    document.querySelectorAll(selector).forEach((heading) => {
      if (!heading.id || heading.dataset.anchorSkip !== undefined) return;
      if (heading.querySelector('.heading-anchor')) return;
      const headingLabel = heading.textContent.trim();
      const wrap = document.createElement('span');
      wrap.className = 'heading-anchor-wrap';
      while (heading.firstChild) {
        wrap.appendChild(heading.firstChild);
      }
      heading.appendChild(wrap);
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = `#${heading.id}`;
      anchor.setAttribute('aria-label', `${anchorLabelPrefix} ${headingLabel}`.trim());
      anchor.setAttribute('title', anchorPermalinkTitle);
      anchor.innerHTML = copyIcon.trim();
      if (shouldTapReveal) {
        let revealTimer = null;
        const reveal = () => {
          wrap.classList.add('is-revealed');
          window.clearTimeout(revealTimer);
          revealTimer = window.setTimeout(() => wrap.classList.remove('is-revealed'), 1500);
        };
        heading.addEventListener('pointerdown', (event) => {
          if (event.pointerType !== 'touch') return;
          if (event.target instanceof Element && event.target.closest('.heading-anchor')) return;
          reveal();
        });
      }
      anchor.addEventListener('click', () => {
        const url = new URL(window.location.href);
        url.hash = heading.id;
        copyLinkToClipboard(url.toString()).catch(() => {});
      });
      wrap.appendChild(anchor);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeadingAnchors);
  } else {
    initHeadingAnchors();
  }
})();

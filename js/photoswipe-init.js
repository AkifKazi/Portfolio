import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe.esm.min.js';

window.addEventListener('load', () => {
  const autoGalleries = document.querySelectorAll('[data-pswp-auto]');
  autoGalleries.forEach((container, idx) => {
    const galleryId = container.getAttribute('data-pswp-gallery') || `auto-${idx}`;
    container.setAttribute('data-pswp-gallery', galleryId);
    const images = container.querySelectorAll('img:not([data-pswp-skip])');
    images.forEach((img) => {
      if (img.closest('.project-sponsors')) return;
      const target = img.dataset.full || img.dataset.src || img.currentSrc || img.src;
      let anchor = img.closest('a[data-pswp-item]');

      if (!anchor || !container.contains(anchor)) {
        anchor = document.createElement('a');
        anchor.href = target;
        anchor.setAttribute('data-pswp-item', '');
        img.parentNode.insertBefore(anchor, img);
        anchor.appendChild(img);
      } else if (!anchor.getAttribute('href')) {
        anchor.setAttribute('href', target);
      }

      const width = parseInt(img.dataset.pswpWidth || img.getAttribute('width') || img.naturalWidth || 0, 10);
      const height = parseInt(img.dataset.pswpHeight || img.getAttribute('height') || img.naturalHeight || 0, 10);

      if (width > 0 && height > 0) {
        anchor.setAttribute('data-pswp-width', width);
        anchor.setAttribute('data-pswp-height', height);
      }

      anchor.setAttribute('data-pswp-caption', img.getAttribute('alt') || img.getAttribute('title') || '');
      anchor.setAttribute('data-pswp-gallery', galleryId);
    });
  });

  const pswpItems = document.querySelectorAll('a[data-pswp-item]');
  const ensureDimensions = (anchor, img) => {
    if (!anchor || anchor.getAttribute('data-pswp-width')) return;
    const w = img?.naturalWidth || 0;
    const h = img?.naturalHeight || 0;
    if (w > 0 && h > 0) {
      anchor.setAttribute('data-pswp-width', w);
      anchor.setAttribute('data-pswp-height', h);
    }
  };

  pswpItems.forEach((anchor) => {
    if (anchor.getAttribute('data-pswp-width') && anchor.getAttribute('data-pswp-height')) {
      return;
    }
    const img = anchor.querySelector('img');
    if (img) {
      if (img.complete) {
        ensureDimensions(anchor, img);
      } else {
        img.addEventListener('load', () => ensureDimensions(anchor, img), { once: true });
      }
    }
  });

  document.querySelectorAll('[data-gallery-carousel]').forEach(function (track) {
    const container = track.closest('.project-gallery');
    if (!container) return;
    const prev = container.querySelector('[data-carousel-prev]');
    const next = container.querySelector('[data-carousel-next]');
    const amount = function () {
      return Math.max(200, track.clientWidth * 0.8);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -amount(), behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: amount(), behavior: 'smooth' });
      });
    }
  });

  const lightbox = new PhotoSwipeLightbox({
    gallery: '[data-pswp-gallery]',
    children: 'a[data-pswp-item]',
    pswpModule: PhotoSwipe,
    bgOpacity: 1,
    captionContent: (slide) => {
      const data = slide.data || {};
      return data.caption || data.element?.getAttribute('data-pswp-caption') || '';
    }
  });

  lightbox.on('uiRegister', () => {
    const pswp = lightbox.pswp;
    if (!pswp?.ui) return;
    pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      className: 'pswp__custom-caption',
      onInit: (el, pswpInstance) => {
        const updateCaption = () => {
          const curr = pswpInstance.currSlide;
          const caption = curr?.data?.caption || curr?.data?.element?.getAttribute('data-pswp-caption') || '';
          el.textContent = caption || '';
          el.hidden = !caption;
        };

        pswpInstance.on('change', updateCaption);
        pswpInstance.on('afterInit', updateCaption);
      }
    });
  });

  lightbox.on('itemData', (itemData) => {
    if (itemData.element) {
      const caption = itemData.element.getAttribute('data-pswp-caption');
      if (caption) {
        itemData.caption = caption;
      }
    }
    if ((!itemData.width || !itemData.height) && itemData.src) {
      const preload = new Image();
      preload.src = itemData.src;
      preload.onload = () => {
        itemData.width = preload.naturalWidth;
        itemData.height = preload.naturalHeight;
        if (lightbox.pswp && lightbox.pswp.currSlide && lightbox.pswp.currSlide.data === itemData) {
          lightbox.pswp.currSlide.updateContentSize(true);
        }
      };
    }
  });

  lightbox.init();
});

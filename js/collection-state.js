(function () {
  const storageKey = 'libellus-collections-state';
  const selector = '.collection-collapsible[data-collection-id]';

  const readState = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      return {};
    }
  };

  const writeState = (state) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (err) { }
  };

  const initCollections = () => {
    const state = readState();
    document.querySelectorAll(selector).forEach((details) => {
      const id = details.dataset.collectionId;
      if (!id) return;
      if (Object.prototype.hasOwnProperty.call(state, id) && typeof state[id] === 'boolean') {
        details.open = state[id];
      }
      details.addEventListener('toggle', () => {
        state[id] = details.open;
        writeState(state);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollections);
  } else {
    initCollections();
  }
})();

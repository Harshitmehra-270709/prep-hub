/* India AI Open · Round 2 — shared runtime (global: R2Core)
   Used by every component file. Load once per page, before component scripts.
   R2Core.create(globalName, rootEl, CONFIG) returns the component API and sets window[globalName]. */
(function () {
  if (window.R2Core) return;
  var rm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function fill(root, values) {
    if (!values) return;
    Object.keys(values).forEach(function (k) {
      if (values[k] == null) return;
      root.querySelectorAll('[data-r2-field="' + k + '"]').forEach(function (el) { el.textContent = values[k]; });
    });
  }
  function inWindow(from, until) {
    var now = Date.now();
    if (from && now < new Date(from).getTime()) return false;
    if (until && now > new Date(until).getTime()) return false;
    return true;
  }
  function onceVisible(el, cb) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); cb(); }
    }, { threshold: 0.35 });
    io.observe(el);
  }
  function call(fn) { if (typeof fn === 'function') fn.apply(null, Array.prototype.slice.call(arguments, 1)); }

  function create(name, root, cfg) {
    cfg = cfg || {};
    var api = {
      el: root, config: cfg,
      onView: null, onShow: null, onHide: null, onAction: null,
      set: function (values) { fill(root, values); return api; },
      open: function () { root.hidden = false; call(api.onShow, api); return api; },
      close: function () { root.hidden = true; call(api.onHide, api); return api; },
      isOpen: function () { return !root.hidden; }
    };
    api.show = api.open; api.hide = api.close;

    // Any element inside the root with data-r2-action="name" fires api.onAction(name, el, event).
    root.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-r2-action]');
      if (!t || !root.contains(t)) return;
      var action = t.getAttribute('data-r2-action');
      call(api.onAction, action, t, e);
      if (action === 'close') api.close();
    });
    if (cfg.DISMISS_WITH_ESC) {
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && api.isOpen()) api.close(); });
    }
    fill(root, cfg.VALUES);
    if (cfg.ENABLE_DATE_WINDOW && !inWindow(cfg.SHOW_FROM, cfg.SHOW_UNTIL)) root.hidden = true;
    onceVisible(root, function () { call(api.onView, api); });
    window[name] = api;
    return api;
  }

  window.R2Core = {
    create: create, fill: fill, inWindow: inWindow, onceVisible: onceVisible,
    prefersReducedMotion: function () { return !!(rm && rm.matches); }
  };
})();

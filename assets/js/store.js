/* ============================================================
   store.js — state + localStorage persistence
   Items are stored under localStorage key "shopping-list" as an
   array of objects: { id, name, status: 'open'|'done', order, updatedAt }
   Legacy string arrays are auto-migrated on load.
   ============================================================ */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'shopping-list';

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* Uppercase the first character so every item reads with a capital. */
  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function normalize(entry, i) {
    if (typeof entry === 'string') {
      return { id: uid(), name: entry, status: 'open', order: i, updatedAt: Date.now() };
    }
    if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
      return {
        id: entry.id || uid(),
        name: entry.name,
        status: entry.status === 'done' ? 'done' : 'open',
        order: typeof entry.order === 'number' ? entry.order : i,
        updatedAt: entry.updatedAt || Date.now()
      };
    }
    return null;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalize).filter(Boolean);
    } catch (e) {
      console.warn('[store] failed to load, starting fresh', e);
      return [];
    }
  }

  function Store() {
    this.items = load();
    this.listeners = new Set();
  }

  Store.prototype.subscribe = function (fn) {
    this.listeners.add(fn);
    var self = this;
    return function () { self.listeners.delete(fn); };
  };

  Store.prototype._emit = function (origin) {
    var items = this.items;
    this.listeners.forEach(function (fn) { fn(items, origin); });
  };

  Store.prototype._commit = function (origin) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('[store] persist failed', e);
    }
    this._emit(origin);
  };

  Store.prototype.getOpen = function () {
    return this.items
      .filter(function (i) { return i.status === 'open'; })
      .sort(function (a, b) { return a.order - b.order; });
  };

  Store.prototype.getDone = function () {
    return this.items
      .filter(function (i) { return i.status === 'done'; })
      .sort(function (a, b) { return b.updatedAt - a.updatedAt; });
  };

  Store.prototype.add = function (name) {
    var n = capitalize((name || '').trim());
    if (!n) return;
    var maxOrder = this.items.reduce(function (m, i) { return Math.max(m, i.order); }, -1);
    this.items.push({
      id: uid(), name: n, status: 'open', order: maxOrder + 1, updatedAt: Date.now()
    });
    this._commit('local');
  };

  Store.prototype.rename = function (id, name) {
    var n = capitalize((name || '').trim());
    var it = this._find(id);
    if (!it || !n || it.name === n) return;
    it.name = n;
    it.updatedAt = Date.now();
    this._commit('local');
  };

  Store.prototype.toggle = function (id) {
    var it = this._find(id);
    if (!it) return;
    it.status = it.status === 'open' ? 'done' : 'open';
    it.updatedAt = Date.now();
    this._commit('local');
  };

  Store.prototype.reorder = function (orderedIds) {
    orderedIds.forEach(function (id, idx) {
      var it = this._find(id);
      if (it) it.order = idx;
    }, this);
    this._commit('local');
  };

  Store.prototype.clear = function () {
    if (!this.items.length) return;
    this.items = [];
    this._commit('local');
  };

  /* Replace the whole list from a remote peer (does NOT re-broadcast). */
  Store.prototype.replaceAll = function (items) {
    this.items = (items || []).map(normalize).filter(Boolean);
    this._commit('remote');
  };

  Store.prototype._find = function (id) {
    return this.items.find(function (i) { return i.id === id; });
  };

  global.Store = Store;
})(window);

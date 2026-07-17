/* ============================================================
   sync.js — realtime streaming of the list

   Two transports, used together:
     1. WebSocket  — cross-device streaming (set WS_URL in app.js).
        Every local mutation is streamed as a full snapshot; incoming
        snapshots newer than the last applied version replace state.
     2. BroadcastChannel — instant, server-less sync across tabs/windows
        of the SAME browser. Always on, so the app "streams" out of the
        box even before you stand up a WebSocket server.

   Wire protocol (JSON):
     { app, clientId, version, items:[...] }
   ============================================================ */
(function (global) {
  'use strict';

  var APP = 'shoppinglist-v1';

  function Sync(opts) {
    opts = opts || {};
    this.wsUrl = opts.wsUrl || '';
    this.onRemote = opts.onRemote || function () {};
    this.onStatus = opts.onStatus || function () {};
    this.clientId = Math.random().toString(36).slice(2);
    this.lastVersion = 0;
    this.ws = null;
    this.retry = 0;
    this.closed = false;

    var self = this;
    this.bc = ('BroadcastChannel' in global) ? new BroadcastChannel(APP) : null;
    if (this.bc) {
      this.bc.onmessage = function (e) { self._handle(e.data); };
    }
  }

  Sync.prototype.start = function () {
    if (this.wsUrl) {
      this._connect();
    } else {
      // No WebSocket configured — still live across tabs via BroadcastChannel.
      this.onStatus(this.bc ? 'local' : 'down');
    }
  };

  Sync.prototype._connect = function () {
    var self = this;
    this.onStatus('connecting');
    var ws;
    try {
      ws = new WebSocket(this.wsUrl);
    } catch (e) {
      this._scheduleReconnect();
      return;
    }
    this.ws = ws;

    ws.onopen = function () {
      self.retry = 0;
      self.onStatus('up');
    };
    ws.onmessage = function (e) {
      var data;
      try { data = JSON.parse(e.data); } catch (err) { return; }
      self._handle(data);
    };
    ws.onerror = function () {
      try { ws.close(); } catch (e) {}
    };
    ws.onclose = function () {
      if (self.closed) return;
      self.onStatus(self.bc ? 'local' : 'down');
      self._scheduleReconnect();
    };
  };

  Sync.prototype._scheduleReconnect = function () {
    if (!this.wsUrl || this.closed) return;
    var self = this;
    this.retry = Math.min(this.retry + 1, 6);
    var delay = Math.min(1000 * Math.pow(2, this.retry), 15000);
    setTimeout(function () { self._connect(); }, delay);
  };

  Sync.prototype._handle = function (data) {
    if (!data || data.app !== APP) return;          // not ours
    if (data.clientId === this.clientId) return;     // our own echo
    if (typeof data.version === 'number' && data.version <= this.lastVersion) return;
    this.lastVersion = data.version || this.lastVersion;
    this.onRemote(data.items || []);
  };

  /* Stream a full snapshot to every peer. */
  Sync.prototype.broadcast = function (items) {
    this.lastVersion = Date.now();
    var msg = { app: APP, clientId: this.clientId, version: this.lastVersion, items: items };
    if (this.bc) {
      try { this.bc.postMessage(msg); } catch (e) {}
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try { this.ws.send(JSON.stringify(msg)); } catch (e) {}
    }
  };

  global.Sync = Sync;
})(window);

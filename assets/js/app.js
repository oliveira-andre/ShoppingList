/* ============================================================
   app.js — UI wiring: render, inline edit, circle-toggle,
   swipe-right-to-done, drag-to-reorder, clear, realtime sync.
   ============================================================ */
(function () {
  'use strict';

  /* --------------------------------------------------------
     Realtime endpoint.
     Leave '' to run purely local (still streams across tabs of
     the same browser via BroadcastChannel).
     To stream across devices, point this at a broadcast
     WebSocket server, e.g.:
        var WS_URL = 'wss://your-server.example/ws';
     A tiny reference server lives in /server (see README).
     -------------------------------------------------------- */
  var WS_URL = '';

  var store = new Store();

  var els = {
    openList: document.getElementById('openList'),
    doneList: document.getElementById('doneList'),
    openEmpty: document.getElementById('openEmpty'),
    doneEmpty: document.getElementById('doneEmpty'),
    doneCount: document.getElementById('doneCount'),
    addForm: document.getElementById('addForm'),
    addInput: document.getElementById('addInput'),
    clearBtn: document.getElementById('clearBtn'),
    status: document.getElementById('status'),
    statusLabel: document.getElementById('statusLabel')
  };

  var sync = new Sync({
    wsUrl: WS_URL,
    onRemote: function (items) { store.replaceAll(items); },
    onStatus: setStatus
  });

  /* editing + drag guards */
  var editingId = null;
  var editingValue = null;
  var justDragged = false;

  function markDragged() {
    justDragged = true;
    setTimeout(function () { justDragged = false; }, 0);
  }

  /* -------------------- status pill -------------------- */
  var STATUS_TEXT = {
    up: 'LIVE',
    connecting: 'CONNECTING',
    down: 'OFFLINE',
    local: 'LOCAL SYNC'
  };
  function setStatus(state) {
    els.status.className = 'status status--' + state;
    els.statusLabel.textContent = STATUS_TEXT[state] || state.toUpperCase();
  }

  /* -------------------- rendering -------------------- */
  function render() {
    var open = store.getOpen();
    var done = store.getDone();

    els.openList.innerHTML = '';
    open.forEach(function (item) { els.openList.appendChild(makeRow(item, false)); });
    els.openEmpty.hidden = open.length > 0;

    els.doneList.innerHTML = '';
    done.forEach(function (item) { els.doneList.appendChild(makeRow(item, true)); });
    els.doneEmpty.hidden = done.length > 0;
    els.doneCount.textContent = String(done.length);

    // keep focus in the active inline editor
    if (editingId) {
      var input = document.querySelector('.item__edit');
      if (input) {
        input.focus();
        var v = input.value;
        input.value = '';
        input.value = v; // move caret to end
      }
    }
  }

  function makeRow(item, isDone) {
    var li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = item.id;

    // name (left)
    var name = document.createElement('div');
    name.className = 'item__name';

    if (editingId === item.id) {
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'item__edit';
      input.value = editingValue != null ? editingValue : item.name;
      input.setAttribute('aria-label', 'Edit item');
      input.addEventListener('input', function () { editingValue = input.value; });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
        else if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
      });
      input.addEventListener('blur', commitEdit);
      name.appendChild(input);
    } else {
      var label = document.createElement('span');
      label.className = 'item__label';
      label.textContent = item.name;
      label.addEventListener('click', function () {
        if (justDragged) return;
        startEdit(item.id, item.name);
      });
      name.appendChild(label);
    }

    // circle (right)
    var circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'item__circle';
    circle.setAttribute('aria-label', isDone ? 'Move back to list' : 'Mark as done');
    circle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (justDragged) return;
      store.toggle(item.id);
    });

    li.appendChild(name);
    li.appendChild(circle);

    // gestures: open rows can be reordered (vertical) or swiped right (done)
    if (!isDone) attachGestures(li, item);

    return li;
  }

  /* -------------------- inline edit -------------------- */
  function startEdit(id, current) {
    editingId = id;
    editingValue = current;
    render();
  }
  function commitEdit() {
    if (editingId == null) return;
    var id = editingId;
    var value = editingValue;
    editingId = null;
    editingValue = null;
    if (value != null && value.trim()) {
      store.rename(id, value); // triggers render
    } else {
      render();
    }
  }
  function cancelEdit() {
    editingId = null;
    editingValue = null;
    render();
  }

  /* -------------------- gestures -------------------- */
  var SWIPE_THRESHOLD = 110; // px to the right => mark done
  var START_THRESHOLD = 8;   // px before a gesture is recognized

  function attachGestures(row, item) {
    var startX = 0, startY = 0, pointerId = null;
    var axis = null;   // 'x' (swipe) | 'y' (reorder)
    var active = false;

    row.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.item__circle') || e.target.closest('.item__edit')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      active = true;
      axis = null;
      startX = e.clientX;
      startY = e.clientY;
      pointerId = e.pointerId;
    });

    row.addEventListener('pointermove', function (e) {
      if (!active) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (!axis) {
        if (Math.hypot(dx, dy) < START_THRESHOLD) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        row.classList.add('item--dragging');
        document.body.classList.add('dragging-active');
        try { row.setPointerCapture(pointerId); } catch (err) {}
      }

      if (axis === 'x') {
        var tx = Math.max(0, dx);
        row.style.transform = 'translateX(' + tx + 'px)';
        row.style.opacity = String(Math.max(0.3, 1 - tx / 260));
        row.classList.toggle('item--will-done', tx > SWIPE_THRESHOLD);
      } else {
        reorderByPointer(row, e.clientY);
      }
      e.preventDefault();
    });

    function end(e) {
      if (!active) return;
      active = false;
      document.body.classList.remove('dragging-active');
      row.classList.remove('item--dragging', 'item--will-done');
      row.style.transform = '';
      row.style.opacity = '';

      if (axis) markDragged(); // any real gesture suppresses the trailing click

      if (axis === 'x') {
        if (e.clientX - startX > SWIPE_THRESHOLD) {
          store.toggle(item.id); // -> done
        }
        return;
      } else if (axis === 'y') {
        var ids = Array.prototype.map.call(
          els.openList.querySelectorAll('.item'),
          function (el) { return el.dataset.id; }
        );
        store.reorder(ids); // -> persist + broadcast + render
        return;
      }
      // otherwise it was a tap — click handlers on label/circle take over
    }

    row.addEventListener('pointerup', end);
    row.addEventListener('pointercancel', end);
  }

  /* Live DOM reorder: move `dragEl` to the slot under the pointer. */
  function reorderByPointer(dragEl, y) {
    var list = els.openList;
    var rows = Array.prototype.slice.call(list.querySelectorAll('.item'));
    for (var i = 0; i < rows.length; i++) {
      var s = rows[i];
      if (s === dragEl) continue;
      var r = s.getBoundingClientRect();
      if (y < r.top + r.height / 2) {
        if (dragEl.nextSibling !== s) list.insertBefore(dragEl, s);
        return;
      }
    }
    if (list.lastElementChild !== dragEl) list.appendChild(dragEl);
  }

  /* -------------------- top-level controls -------------------- */
  els.addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = els.addInput.value;
    if (!value.trim()) return;
    store.add(value);       // -> render + broadcast
    els.addInput.value = '';
    els.addInput.focus();
  });

  els.clearBtn.addEventListener('click', function () {
    if (!store.items.length) return;
    if (!window.confirm('Clear the entire list (open and done)?')) return;
    store.clear();
  });

  /* -------------------- store -> UI + outgoing stream -------------------- */
  store.subscribe(function (items, origin) {
    render();
    if (origin === 'local') sync.broadcast(items);
  });

  /* -------------------- go -------------------- */
  render();
  sync.start();
})();

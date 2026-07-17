# <img src="icon.png" alt="" height="30" valign="middle"> ShoppingList

A single-page shopping list with inline editing, swipe/click to complete,
drag-to-reorder, and realtime streaming. Installable as a PWA. See the design
system in [`DESIGN.md`](DESIGN.md).

## Features

- **Add** — type in the top box and press **Enter** (or tap **+**) to create an item.
- **Persist** — items are saved to `localStorage` under the key `shopping-list`
  as objects `{ id, name, status, order, updatedAt }` (legacy string arrays are
  auto-migrated).
- **Complete** — click an item's circle, or **swipe it right** (great on mobile),
  to move it into the **Done** section. Click the circle again to bring it back.
- **Edit** — click an item's name to edit it **inline**; press **Enter** to save
  (**Esc** to cancel).
- **Reorder** — **drag** items up/down to change their order.
- **Clear** — the **Clear** button next to the title empties the whole list.
- **Realtime** — every change is streamed to other open clients (see below).
- **Installable** — ships a web app manifest (`manifest.webmanifest`) and
  `icon.png`, so it can be installed to a phone home screen or desktop and
  launched standalone.

## Project structure

```
index.html                 # the single page
manifest.webmanifest       # PWA manifest (installable app)
icon.png                   # app icon (PWA + favicon)
assets/css/styles.css      # hunter's-night theme
assets/js/store.js         # state + localStorage
assets/js/sync.js          # realtime (WebSocket + BroadcastChannel)
assets/js/app.js           # UI: render, edit, gestures, wiring
server/                    # optional broadcast WebSocket relay
.github/workflows/deploy.yml   # GitHub Pages deploy
```

## Realtime streaming

Two transports work together (`assets/js/sync.js`):

1. **BroadcastChannel** — always on, no server. Instantly syncs every open
   tab/window of the **same browser** (same origin). Great out of the box, but
   it does **not** reach other people/devices.
2. **WebSocket** — for **cross-device, cross-person** sync. Point the app at a
   running relay (see below). This is the only path that lets other people see
   the items you add.

> **Important:** GitHub Pages is **static-only** — it cannot run the WebSocket
> relay. On a plain Pages deploy with no relay configured, everyone is on
> BroadcastChannel only, so **you will not see items other people added.** To
> sync across people you must host `server/` somewhere that supports WebSockets
> (Render, Railway, Fly.io, a VPS…) and point the app at it.

### How multi-person sync works

The relay (`server/server.js`) keeps the current list **in memory** and is the
source of truth:

- When a client **connects**, the server immediately sends it the current list —
  so a person joining sees everyone's existing items right away.
- Each change is streamed as a full snapshot
  `{ app, clientId, version, items, replace }`. The server **merges** items
  per-id (newest `updatedAt` wins) and echoes the authoritative union to
  everyone, so concurrent inserts from different people are **combined**, not
  overwritten. `replace: true` (from **Clear**) is an authoritative wipe.

The status pill shows `LIVE` / `CONNECTING` / `OFFLINE` / `LOCAL SYNC`.

### Pointing the app at a relay

Set `WS_URL` **once** at the top of `assets/js/app.js` to your deployed relay:

```js
var WS_URL = 'wss://your-relay.example';   // ws:// for local dev
```

That's it — every visit uses it automatically; there's nothing to declare per
load. (Optional: append `?ws=<url>` to the page URL to override it for a single
visit, e.g. when testing against a different relay.)

### Running the relay

```bash
cd server
npm install
npm start          # ws://localhost:8080
```

Then open the app pointing at it:

```
http://localhost:5199/?ws=ws://localhost:8080
```

Two different origins (e.g. `localhost` vs `127.0.0.1`) behave like two
different devices — a handy way to test real cross-client sync locally. In
production use `wss://` (TLS) and set it via `WS_FALLBACK` or `?ws=`.

## Deploy to GitHub Pages

1. Create a repo and push this folder to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
   which publishes the site. Your app appears at
   `https://<user>.github.io/<repo>/`.

The `.nojekyll` file ensures the `assets/` folder is served verbatim.

> Pages hosts only the static page. For sync between different people, also
> deploy `server/` to a WebSocket host and load the app with
> `?ws=wss://your-relay` (see **Realtime streaming** above).

## Local development

Because the page loads separate JS files, open it through a local server
(not `file://`):

```bash
python3 -m http.server 5173
# then visit http://localhost:5173
```

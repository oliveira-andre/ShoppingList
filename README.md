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
   tab/window of the **same browser**. This makes the app "stream" out of the box.
2. **WebSocket** — for **cross-device** sync. Set `WS_URL` at the top of
   `assets/js/app.js` to your server, e.g. `wss://your-app.onrender.com`.

Each change is streamed as a full JSON snapshot
`{ app, clientId, version, items }`; peers apply any snapshot newer than the
last one they've seen (last-writer-wins). The status pill shows
`LIVE` / `CONNECTING` / `OFFLINE` / `LOCAL SYNC`.

### Running the optional relay

GitHub Pages is static-only, so cross-device sync needs a WebSocket host.
A minimal relay is included:

```bash
cd server
npm install
npm start          # ws://localhost:8080
```

Then set `var WS_URL = 'ws://localhost:8080';` in `assets/js/app.js`
(use `wss://` when deployed behind TLS).

## Deploy to GitHub Pages

1. Create a repo and push this folder to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
   which publishes the site. Your app appears at
   `https://<user>.github.io/<repo>/`.

The `.nojekyll` file ensures the `assets/` folder is served verbatim.

## Local development

Because the page loads separate JS files, open it through a local server
(not `file://`):

```bash
python3 -m http.server 5173
# then visit http://localhost:5173
```

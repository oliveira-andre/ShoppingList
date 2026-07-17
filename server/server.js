/* ============================================================
   Reference broadcast WebSocket server (optional).

   GitHub Pages serves only static files, so cross-DEVICE realtime
   sync needs a WebSocket server hosted somewhere else (Render,
   Railway, Fly.io, a small VPS, etc.). Same-browser tab sync works
   with no server at all via BroadcastChannel.

   This server simply relays every message it receives to all other
   connected clients — exactly what assets/js/sync.js expects.

   Run:
     cd server
     npm install
     npm start            # listens on ws://localhost:8080

   Then in assets/js/app.js set:
     var WS_URL = 'ws://localhost:8080';   // or wss://... in production
   ============================================================ */
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  socket.on('message', (data, isBinary) => {
    // Relay to every OTHER open client.
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === 1 /* OPEN */) {
        client.send(data, { binary: isBinary });
      }
    }
  });
});

console.log(`ShoppingList relay listening on ws://localhost:${PORT}`);

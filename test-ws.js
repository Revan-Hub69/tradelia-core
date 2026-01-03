const WebSocket = require("ws");

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

ws.on("open", () => {
  console.log("WS CONNECTED");
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg.toString());
  console.log("price:", data.p);
});

ws.on("error", console.error);
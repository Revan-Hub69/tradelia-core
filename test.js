const fetch = global.fetch;

async function test() {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=5",
    {
      headers: {
        "User-Agent": "Mozilla/5.0 BinanceTest"
      }
    }
  );
  console.log(res.status);
  const data = await res.json();
  console.log(data[0]);
}

test();
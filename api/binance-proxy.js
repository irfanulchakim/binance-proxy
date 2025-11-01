// file: api/binance-proxy.js
export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname.toLowerCase();
    const base = "https://fapi.binance.com";
    let target = "";

    if (path.endsWith("/api/openinterest")) {
      const symbol = (url.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
      target = `${base}/fapi/v1/openInterest?symbol=${symbol}`;
    } else if (path.endsWith("/api/fundingrate")) {
      const symbol = (url.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
      target = `${base}/fapi/v1/fundingRate?symbol=${symbol}&limit=1`;
    } else if (path.endsWith("/api/longshort")) {
      const symbol = (url.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
      target = `${base}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=5m&limit=1`;
    } else {
      return res.status(404).json({ error: "Use /api/openinterest, /api/fundingrate, or /api/longshort" });
    }

    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://www.binance.com",
        "Referer": "https://www.binance.com/"
      }
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

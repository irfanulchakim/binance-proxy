export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    const type = url.searchParams.get("type") || "openinterest";
    const symbol = (url.searchParams.get("symbol") || "BTCUSDT").toUpperCase();

    const base = "https://fapi.binance.com";
    let target = "";

    if (type === "openinterest") {
      target = `${base}/fapi/v1/openInterest?symbol=${symbol}`;
    } else if (type === "fundingrate") {
      target = `${base}/fapi/v1/fundingRate?symbol=${symbol}&limit=1`;
    } else if (type === "longshort") {
      target = `${base}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=5m&limit=1`;
    } else {
      return res.status(404).json({ error: "Invalid type. Use ?type=openinterest|fundingrate|longshort" });
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

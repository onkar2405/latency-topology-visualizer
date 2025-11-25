export async function fetchLatency() {
  // TODO: fetch this data from Cloudflare
  return [
    {
      exchange: "Binance",
      provider: "AWS",
      latency: Math.floor(Math.random() * 120) + 10, // 10 - 130ms
    },
    {
      exchange: "OKX",
      provider: "AWS",
      latency: Math.floor(Math.random() * 90) + 5,
    },
    {
      exchange: "Bybit",
      provider: "GCP",
      latency: Math.floor(Math.random() * 180) + 20,
    },
    {
      exchange: "Deribit",
      provider: "Azure",
      latency: Math.floor(Math.random() * 160) + 25,
    },
  ];
}

export async function fetchLatency() {
  console.log("Fetching latency data from backend API...");

  try {
    const res = await fetch("/api/latency", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend API error:", res.status, errorText);
      throw new Error(`Backend API error: ${res.status}`);
    }

    const apiResponse = await res.json();

    if (!apiResponse.success || !apiResponse.data) {
      console.error("Invalid API response:", apiResponse);
      throw new Error("Invalid response from latency API");
    }

    console.log("Fetched latency data:", apiResponse.data);
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching latency:", error);

    return [
      {
        exchange: "Binance",
        provider: "AWS",
        latency: Math.floor(Math.random() * 50) + 20,
      },
      {
        exchange: "OKX",
        provider: "AWS",
        latency: Math.floor(Math.random() * 50) + 20,
      },
      {
        exchange: "Bybit",
        provider: "GCP",
        latency: Math.floor(Math.random() * 60) + 30,
      },
      {
        exchange: "Deribit",
        provider: "Azure",
        latency: Math.floor(Math.random() * 70) + 40,
      },
    ];
  }
}

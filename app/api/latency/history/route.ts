import { NextRequest, NextResponse } from "next/server";

interface LatencyDataPoint {
  timestamp: number;
  latency: number;
}

interface HistoricalLatencyResponse {
  exchangeName: string;
  region: string;
  data: LatencyDataPoint[];
  stats: {
    current: number;
    average: number;
    min: number;
    max: number;
    variance: number;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const exchange = searchParams.get("exchange");
  const region = searchParams.get("region");
  const hours = parseInt(searchParams.get("hours") || "24");

  if (!exchange || !region) {
    return NextResponse.json(
      { error: "Missing exchange or region parameter" },
      { status: 400 }
    );
  }

  try {
    // Generate mock historical data
    // In production, this would fetch from a database
    const now = Date.now();
    const dataPoints: LatencyDataPoint[] = [];

    // Determine appropriate data point density
    let numDataPoints = 25; // Default for 24h
    if (hours > 24) {
      numDataPoints = Math.min(Math.ceil(hours / 2), 100); // More points for longer periods
    }

    const interval = (hours * 60 * 60 * 1000) / (numDataPoints - 1); // Divide into intervals

    for (let i = numDataPoints - 1; i >= 0; i--) {
      const timestamp = now - i * interval;
      // Simulate realistic latency with some variance
      const baseLatency = 50 + Math.random() * 30;
      const spike = Math.random() > 0.95 ? Math.random() * 40 : 0;
      const latency = Math.round(baseLatency + spike);

      dataPoints.push({
        timestamp,
        latency: Math.max(10, latency),
      });
    }

    const latencies = dataPoints.map((d) => d.latency);
    const average = Math.round(
      latencies.reduce((a, b) => a + b) / latencies.length
    );
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    const variance = Math.round(
      Math.sqrt(
        latencies.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
          latencies.length
      )
    );

    return NextResponse.json({
      exchangeName: exchange,
      region,
      data: dataPoints,
      stats: {
        current: dataPoints[dataPoints.length - 1].latency,
        average,
        min,
        max,
        variance,
      },
    } as HistoricalLatencyResponse);
  } catch (error) {
    console.error("Error fetching historical latency:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical latency data" },
      { status: 500 }
    );
  }
}

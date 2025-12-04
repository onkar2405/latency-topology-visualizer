import { NextRequest, NextResponse } from "next/server";

interface LatencyDataPoint {
  timestamp: number;
  latency: number;
}

/**
 * API route to fetch historical latency data for a given exchange and region.
 */
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

/**
 * API route handler for fetching historical latency data.
 * @param request The incoming Next.js request object.
 * @returns A JSON response containing historical latency data and statistics.
 */
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
    // Fetch historical data from Cloudflare's GraphQL API
    const cf_account_id = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cf_api_token = process.env.CLOUDFLARE_API_TOKEN;

    if (!cf_account_id || !cf_api_token) {
      console.warn("Cloudflare credentials not configured, using mock data");
      return getMockHistoricalData(exchange, region, hours);
    }

    // Build time range for GraphQL query
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const startTime = now - hours * 3600; // Start time in seconds

    // Cloudflare GraphQL query for HTTP request metrics
    const query = `
      query {
        viewer {
          zones(filter: {accountTag: "${cf_account_id}"}) {
            httpRequests1mGroups(
              limit: 10000
              filter: {
                datetime_geq: "${new Date(startTime * 1000).toISOString()}"
                datetime_leq: "${new Date(now * 1000).toISOString()}"
              }
              orderBy: [datetime_ASC]
            ) {
              dimensions {
                datetime
              }
              sum {
                responseTime
              }
              count
            }
          }
        }
      }
    `;

    const response = await fetch(
      "https://api.cloudflare.com/client/v4/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cf_api_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      console.error("Cloudflare API error:", response.statusText);
      return getMockHistoricalData(exchange, region, hours);
    }

    const cfData = await response.json();

    if (cfData.errors) {
      console.error("GraphQL errors:", cfData.errors);
      return getMockHistoricalData(exchange, region, hours);
    }

    // Parse Cloudflare response and convert to our data format
    const httpGroups =
      cfData.data?.viewer?.zones?.[0]?.httpRequests1mGroups || [];

    if (httpGroups.length === 0) {
      console.warn("No data from Cloudflare, using mock data");
      return getMockHistoricalData(exchange, region, hours);
    }

    const dataPoints: LatencyDataPoint[] = httpGroups.map((group: any) => ({
      timestamp: new Date(group.dimensions.datetime).getTime(),
      latency: group.sum.responseTime
        ? Math.round(group.sum.responseTime / group.count)
        : 0,
    }));

    // Calculate statistics
    const latencies = dataPoints.map((d) => d.latency);
    const average = Math.round(
      latencies.reduce((a, b) => a + b, 0) / latencies.length
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
        current: dataPoints[dataPoints.length - 1]?.latency || 0,
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

/**
 * Fallback function to generate mock historical data
 * Used when Cloudflare API is unavailable or not configured
 */
function getMockHistoricalData(
  exchange: string,
  region: string,
  hours: number
): NextResponse {
  const now = Date.now();
  const dataPoints: LatencyDataPoint[] = [];

  // Determine appropriate data point density
  let numDataPoints = 25; // Default for 24h
  if (hours > 24) {
    numDataPoints = Math.min(Math.ceil(hours / 2), 100);
  }

  const interval = (hours * 60 * 60 * 1000) / (numDataPoints - 1);

  for (let i = numDataPoints - 1; i >= 0; i--) {
    const timestamp = now - i * interval;
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
}

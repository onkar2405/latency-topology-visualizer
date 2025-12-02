"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/LatencyChart.css";

interface DataPoint {
  timestamp: number;
  latency: number;
}

interface LatencyChartProps {
  data: DataPoint[];
  exchangeName: string;
  region: string;
  theme?: any;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="latency-tooltip">
        <p className="tooltip-time">{data.time}</p>
        <p className="tooltip-latency">{data.latency}ms</p>
      </div>
    );
  }
  return null;
};

export default function LatencyChart({
  data,
  exchangeName,
  region,
  theme,
}: LatencyChartProps) {
  // Determine time span for proper formatting
  const timeSpan =
    data.length > 0 ? data[data.length - 1].timestamp - data[0].timestamp : 0;
  const hours = timeSpan / (60 * 60 * 1000);

  // Format based on time range
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (hours > 48) {
      // For 7d and 30d, show only date (cleaner for multi-day views)
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    } else {
      // For 24h, show only time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const formattedData = data.map((point) => ({
    ...point,
    time: formatTime(point.timestamp),
  }));

  return (
    <div
      className="latency-chart-container"
      style={{
        background: theme?.bg.secondary || "#f5f5f5",
        color: theme?.text.primary || "#333",
      }}
    >
      <h3
        className="chart-title"
        style={{ color: theme?.text.primary || "#333" }}
      >
        {exchangeName} → {region}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: hours > 48 ? 50 : 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme?.ui.border || "#e0e0e0"}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: theme?.text.secondary || "#666" }}
            stroke={theme?.ui.border || "#666"}
            interval={Math.max(
              0,
              Math.floor(formattedData.length / (hours > 48 ? 5 : 6))
            )}
            angle={hours > 48 ? -45 : 0}
            textAnchor={hours > 48 ? "end" : "middle"}
            height={hours > 48 ? 80 : 30}
          />
          <YAxis
            label={{
              value: "Latency (ms)",
              angle: -90,
              position: "insideLeft",
              fill: theme?.text.secondary || "#666",
            }}
            tick={{ fontSize: 12, fill: theme?.text.secondary || "#666" }}
            stroke={theme?.ui.border || "#666"}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#4a90e2"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

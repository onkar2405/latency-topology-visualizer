"use client";

import React, { useState, useEffect } from "react";
import LatencyChart from "../charts/LatencyChartHistorical";
import TrendStatistics from "../charts/TrendStatistics";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/HistoricalTrendsPanel.css";

interface LatencyDataPoint {
  timestamp: number;
  latency: number;
}

interface HistoricalData {
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

interface HistoricalTrendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  exchangeName?: string;
  region?: string;
}

export default function HistoricalTrendsPanel({
  isOpen,
  onClose,
  exchangeName,
  region,
}: HistoricalTrendsPanelProps) {
  const theme = useTheme();
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(24);

  const fetchHistoricalData = async () => {
    if (!exchangeName || !region) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/latency/history?exchange=${exchangeName}&region=${region}&hours=${timeRange}`
      );
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && exchangeName && region) {
      fetchHistoricalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, exchangeName, region, timeRange]);

  if (!isOpen) return null;

  return (
    <div className="historical-trends-overlay" onClick={onClose}>
      <div
        className="historical-trends-panel"
        style={
          {
            background: theme.ui.panel,
            color: theme.text.primary,
            ["--panel-border"]: theme.ui.border,
            ["--text-primary"]: theme.text.primary,
            ["--text-secondary"]: theme.text.secondary,
            ["--bg-secondary"]: theme.bg.secondary,
          } as any
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h2>Historical Latency Trends</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="time-range-controls">
          {[
            { label: "24h", value: 24 },
            { label: "7d", value: 168 },
            { label: "30d", value: 720 },
          ].map((option) => (
            <button
              key={option.value}
              className={`time-button ${
                timeRange === option.value ? "active" : ""
              }`}
              onClick={() => setTimeRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="panel-content">
          {loading ? (
            <div className="loading-state">Loading data...</div>
          ) : historicalData ? (
            <>
              <LatencyChart
                data={historicalData.data}
                exchangeName={historicalData.exchangeName}
                region={historicalData.region}
                theme={theme}
              />
              <TrendStatistics stats={historicalData.stats} theme={theme} />
            </>
          ) : (
            <div className="empty-state">
              Select an exchange and region to view trends
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

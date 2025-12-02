"use client";

import React, { useState } from "react";
import "../../styles/TrendStatistics.css";

interface Stats {
  current: number;
  average: number;
  min: number;
  max: number;
  variance: number;
}

interface TrendStatisticsProps {
  stats: Stats;
  theme?: any;
}

const STAT_TOOLTIPS = {
  current: "The most recent latency measurement for this connection",
  average: "Mean latency across all measurements in the selected time period",
  min: "Best latency performance (lowest response time) in the period",
  max: "Worst latency performance (highest response time) in the period",
  trend: "Indicates if latency is worsening (↑), improving (↓), or stable (→)",
};

const StatTooltip = ({ text }: { text: string }) => (
  <div className="tooltip-content">{text}</div>
);

const StatCard = ({
  label,
  value,
  tooltipKey,
  isTrend = false,
  trendClass = "",
  theme,
  tooltipActive,
  setTooltipActive,
}: any) => (
  <div
    className={`stat-card ${isTrend ? `trend ${trendClass}` : ""}`}
    style={{
      background: theme?.bg.secondary || (isTrend ? "#f0f7ff" : "#f9f9f9"),
      color: theme?.text.primary || "#333",
      borderColor: theme?.ui.border || "#e0e0e0",
    }}
    onMouseEnter={() => setTooltipActive(tooltipKey)}
    onMouseLeave={() => setTooltipActive(null)}
  >
    <span
      className="stat-label"
      style={{ color: theme?.text.secondary || "#666" }}
    >
      {label}
      <span className="tooltip-icon">ⓘ</span>
    </span>
    <span className="stat-value">{value}</span>
    {tooltipActive === tooltipKey && (
      <StatTooltip
        text={STAT_TOOLTIPS[tooltipKey as keyof typeof STAT_TOOLTIPS]}
      />
    )}
  </div>
);

export default function TrendStatistics({
  stats,
  theme,
}: TrendStatisticsProps) {
  const [tooltipActive, setTooltipActive] = useState<string | null>(null);

  const getTrendIndicator = () => {
    if (stats.current > stats.average) {
      return { icon: "↑", label: "Worsening", className: "trend-up" };
    } else if (stats.current < stats.average) {
      return { icon: "↓", label: "Improving", className: "trend-down" };
    }
    return { icon: "→", label: "Stable", className: "trend-stable" };
  };

  const trend = getTrendIndicator();

  return (
    <div className="trend-statistics">
      <StatCard
        label="Current"
        value={`${stats.current}ms`}
        tooltipKey="current"
        theme={theme}
        tooltipActive={tooltipActive}
        setTooltipActive={setTooltipActive}
      />
      <StatCard
        label="Average"
        value={`${stats.average}ms`}
        tooltipKey="average"
        theme={theme}
        tooltipActive={tooltipActive}
        setTooltipActive={setTooltipActive}
      />
      <StatCard
        label="Min"
        value={`${stats.min}ms`}
        tooltipKey="min"
        theme={theme}
        tooltipActive={tooltipActive}
        setTooltipActive={setTooltipActive}
      />
      <StatCard
        label="Max"
        value={`${stats.max}ms`}
        tooltipKey="max"
        theme={theme}
        tooltipActive={tooltipActive}
        setTooltipActive={setTooltipActive}
      />
      <StatCard
        label="Trend"
        value={trend.icon}
        tooltipKey="trend"
        isTrend={true}
        trendClass={trend.className}
        theme={theme}
        tooltipActive={tooltipActive}
        setTooltipActive={setTooltipActive}
      />
    </div>
  );
}

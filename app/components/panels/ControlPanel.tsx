"use client";
import CollapsiblePanel from "../common/CollapsiblePanel";
import ExpandablePanel from "../common/ExpandablePanel";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/ControlPanel.css";

export default function ControlPanel({
  exchanges,
  providers,
  selectedExchange,
  onExchangeChange,
  selectedProviders,
  onProviderToggle,
  latencyRange,
  onLatencyRangeChange,
  searchQuery,
  onSearchChange,
  layers,
  onLayerToggle,
  metrics,
}) {
  const theme = useTheme();
  const latencyOptions = ["0-50", "50-100", "100-200", "200+"];

  const themeStyles = {
    background: theme.ui.panel,
    color: theme.text.primary,
    ["--panel-border" as any]: theme.ui.border,
    ["--text-primary" as any]: theme.text.primary,
    ["--text-secondary" as any]: theme.text.secondary,
    ["--text-accent" as any]: theme.text.accent,
    ["--bg-secondary" as any]: theme.bg.secondary,
  } as React.CSSProperties;

  return (
    <ExpandablePanel
      title="Controls"
      panelClassName="controlPanel"
      themeStyles={themeStyles}
    >
      <CollapsiblePanel
        title="Filters & Layers"
        id="control-panel-content"
        titleElement="h3"
      >
        {/* Search */}
        <div className="panelSection">
          <input
            type="text"
            placeholder="Search exchanges/regions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="inputField"
          />
        </div>

        {/* Exchange Selector */}
        <div className="panelSection">
          <label className="sectionLabel exchangesLabel">
            📍 EXCHANGES (Trading Hubs)
          </label>
          <select
            value={selectedExchange}
            onChange={(e) => onExchangeChange(e.target.value)}
            className="inputField mt4"
          >
            <option value="">All Exchanges</option>
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        {/* Cloud Provider Filter */}
        <div className="panelSection">
          <label className="sectionLabel providersLabel">
            ☁️ CLOUD PROVIDERS (Infrastructure)
          </label>
          {providers.map((p) => (
            <label key={p} className="checkboxLabel">
              <input
                type="checkbox"
                checked={selectedProviders.includes(p)}
                onChange={() => onProviderToggle(p)}
              />
              <span className="spaced">{p}</span>
            </label>
          ))}
        </div>

        {/* Latency Filter */}
        <div className="panelSection">
          <label className="sectionLabel">Latency Range (ms)</label>
          {latencyOptions.map((r) => (
            <label key={r} className="radioLabel">
              <input
                type="radio"
                name="latencyRange"
                checked={latencyRange === r}
                onChange={() => onLatencyRangeChange(r)}
              />
              <span className="spaced">{r}</span>
            </label>
          ))}
        </div>

        {/* Visualization Layers */}
        <div className="panelSection">
          <label className="sectionLabel">Visualization Layers</label>
          {Object.keys(layers).map((key) => (
            <label key={key} className="checkboxLabel">
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => onLayerToggle(key)}
              />
              <span className="spaced">{key}</span>
            </label>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className={`panelSection metricsSection`}>
          <label className="sectionLabel">Performance Metrics</label>
          <p className="metricsText">Markers: {metrics.markers}</p>
          <p className="metricsText">Latency Lines: {metrics.latencyLines}</p>
          <p className="metricsText">Regions: {metrics.regions}</p>
          <p className="metricsText">FPS: {metrics.fps}</p>
        </div>
      </CollapsiblePanel>
    </ExpandablePanel>
  );
}

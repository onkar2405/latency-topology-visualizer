"use client";
import CollapsiblePanel from "./common/CollapsiblePanel";
import { useTheme } from "../context/ThemeContext";

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

  return (
    <div
      className="control-panel"
      style={{
        background: theme.ui.panel,
        color: theme.text.primary,
        borderColor: theme.ui.border,
        borderRadius: "8px",
        padding: "16px",
        left: "20px",
        top: "20px",
        width: "320px",
        maxHeight: "80vh",
        overflowY: "auto",
        position: "fixed",
        zIndex: 10,
        fontFamily: "sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        border: `1px solid ${theme.ui.border}`,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Hide scrollbar for webkit browsers */}
      <style>{`
        .control-panel::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, color: theme.text.accent, fontSize: "18px" }}>
          Controls
        </h2>
        <button
          onClick={theme.toggleTheme}
          style={{
            background: theme.bg.secondary,
            color: theme.text.primary,
            border: `1px solid ${theme.ui.border}`,
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
          title="Toggle dark/light mode"
        >
          {theme.isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <CollapsiblePanel
        title="Filters & Layers"
        id="control-panel-content"
        titleElement="h3"
      >
        {/* Search */}
        <div className="panel-section" style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Search exchanges/regions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
            style={{
              background: theme.bg.secondary,
              color: theme.text.primary,
              border: `1px solid ${theme.ui.border}`,
              borderRadius: "4px",
              padding: "8px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Exchange Selector */}
        <div className="panel-section" style={{ marginBottom: "12px" }}>
          <label
            className="section-label"
            style={{
              color: theme.text.secondary,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Exchange
          </label>
          <select
            value={selectedExchange}
            onChange={(e) => onExchangeChange(e.target.value)}
            className="input-field"
            style={{
              background: theme.bg.secondary,
              color: theme.text.primary,
              border: `1px solid ${theme.ui.border}`,
              borderRadius: "4px",
              padding: "8px",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "4px",
            }}
          >
            <option value="">All</option>
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>

        {/* Cloud Provider Filter */}
        <div className="panel-section" style={{ marginBottom: "12px" }}>
          <label
            className="section-label"
            style={{
              color: theme.text.secondary,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Providers
          </label>
          {providers.map((p) => (
            <label
              key={p}
              className="checkbox-label"
              style={{
                display: "block",
                marginTop: "6px",
                color: theme.text.primary,
              }}
            >
              <input
                type="checkbox"
                checked={selectedProviders.includes(p)}
                onChange={() => onProviderToggle(p)}
              />
              <span style={{ marginLeft: "6px" }}>{p}</span>
            </label>
          ))}
        </div>

        {/* Latency Filter */}
        <div className="panel-section" style={{ marginBottom: "12px" }}>
          <label
            className="section-label"
            style={{
              color: theme.text.secondary,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Latency Range (ms)
          </label>
          {latencyOptions.map((r) => (
            <label
              key={r}
              className="radio-label"
              style={{
                display: "block",
                marginTop: "6px",
                color: theme.text.primary,
              }}
            >
              <input
                type="radio"
                name="latencyRange"
                checked={latencyRange === r}
                onChange={() => onLatencyRangeChange(r)}
              />
              <span style={{ marginLeft: "6px" }}>{r}</span>
            </label>
          ))}
        </div>

        {/* Visualization Layers */}
        <div className="panel-section" style={{ marginBottom: "12px" }}>
          <label
            className="section-label"
            style={{
              color: theme.text.secondary,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Visualization Layers
          </label>
          {Object.keys(layers).map((key) => (
            <label
              key={key}
              className="checkbox-label"
              style={{
                display: "block",
                marginTop: "6px",
                color: theme.text.primary,
              }}
            >
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => onLayerToggle(key)}
              />
              <span style={{ marginLeft: "6px" }}>{key}</span>
            </label>
          ))}
        </div>

        {/* Performance Metrics */}
        <div
          className="panel-section metrics-section"
          style={{
            background: theme.bg.secondary,
            padding: "10px",
            borderRadius: "4px",
            marginTop: "12px",
            border: `1px solid ${theme.ui.border}`,
          }}
        >
          <label
            className="section-label"
            style={{
              color: theme.text.secondary,
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Performance Metrics
          </label>
          <p
            style={{
              margin: "4px 0",
              fontSize: "12px",
              color: theme.text.secondary,
            }}
          >
            Markers: {metrics.markers}
          </p>
          <p
            style={{
              margin: "4px 0",
              fontSize: "12px",
              color: theme.text.secondary,
            }}
          >
            Latency Lines: {metrics.latencyLines}
          </p>
          <p
            style={{
              margin: "4px 0",
              fontSize: "12px",
              color: theme.text.secondary,
            }}
          >
            Regions: {metrics.regions}
          </p>
          <p
            style={{
              margin: "4px 0",
              fontSize: "12px",
              color: theme.text.secondary,
            }}
          >
            FPS: {metrics.fps}
          </p>
        </div>
      </CollapsiblePanel>
    </div>
  );
}

"use client";
import CollapsiblePanel from "./common/CollapsiblePanel";

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
  const latencyOptions = ["0-50", "50-100", "100-200", "200+"];

  return (
    <div className="control-panel">
      <CollapsiblePanel
        title="Controls"
        id="control-panel-content"
        titleElement="h3"
      >
        {/* Search */}
        <div className="panel-section">
          <input
            type="text"
            placeholder="Search exchanges/regions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Exchange Selector */}
        <div className="panel-section">
          <label className="section-label">Exchange</label>
          <select
            value={selectedExchange}
            onChange={(e) => onExchangeChange(e.target.value)}
            className="input-field"
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
        <div className="panel-section">
          <label className="section-label">Providers</label>
          {providers.map((p) => (
            <label key={p} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedProviders.includes(p)}
                onChange={() => onProviderToggle(p)}
              />
              <span>{p}</span>
            </label>
          ))}
        </div>

        {/* Latency Filter */}
        <div className="panel-section">
          <label className="section-label">Latency Range (ms)</label>
          {latencyOptions.map((r) => (
            <label key={r} className="radio-label">
              <input
                type="radio"
                name="latencyRange"
                checked={latencyRange === r}
                onChange={() => onLatencyRangeChange(r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        {/* Visualization Layers */}
        <div className="panel-section">
          <label className="section-label">Visualization Layers</label>
          {Object.keys(layers).map((key) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => onLayerToggle(key)}
              />
              <span>{key}</span>
            </label>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="panel-section metrics-section">
          <label className="section-label">Performance Metrics</label>
          <p>Markers: {metrics.markers}</p>
          <p>Latency Lines: {metrics.latencyLines}</p>
          <p>Regions: {metrics.regions}</p>
          <p>FPS: {metrics.fps}</p>
        </div>
      </CollapsiblePanel>
    </div>
  );
}

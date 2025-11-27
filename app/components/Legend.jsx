"use client";
import CollapsiblePanel from "./common/CollapsiblePanel";

export default function Legend() {
  const providers = [
    { name: "AWS", color: "#FF9900" },
    { name: "GCP", color: "#4285F4" },
    { name: "Azure", color: "#0080FF" },
  ];

  const latencyColors = [
    { range: "0-50 ms", color: "#00FF00" },
    { range: "50-100 ms", color: "#FFFF00" },
    { range: "100-200 ms", color: "#FFA500" },
    { range: "200+ ms", color: "#FF0000" },
  ];

  return (
    <div className="legend-panel">
      <CollapsiblePanel
        title="Legend"
        id="legend-panel-content"
        titleElement="h4"
      >
        <div className="legend-section">
          <p className="legend-section-label">Cloud Providers</p>
          {providers.map((p) => (
            <div key={p.name} className="legend-item">
              <span
                className="legend-color-box"
                style={{ backgroundColor: p.color }}
              ></span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="legend-section">
          <p className="legend-section-label">Latency</p>
          {latencyColors.map((l) => (
            <div key={l.range} className="legend-item">
              <span
                className="legend-color-box"
                style={{ backgroundColor: l.color }}
              ></span>
              <span>{l.range}</span>
            </div>
          ))}
        </div>
      </CollapsiblePanel>
    </div>
  );
}

"use client";
import CollapsiblePanel from "./common/CollapsiblePanel";
import { useTheme } from "../context/ThemeContext";

export default function Legend() {
  const theme = useTheme();

  const providers = [
    { name: "AWS", color: "#FFD700" },
    { name: "GCP", color: "#1E90FF" },
    { name: "Azure", color: "#9b5de5" },
  ];

  const latencyColors = [
    { range: "0-60 ms", color: "#00ff6a" },
    { range: "60-120 ms", color: "#ffd700" },
    { range: "120+ ms", color: "#ff4444" },
  ];

  return (
    <div
      className="legend-panel"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: theme.ui.panel,
        color: theme.text.primary,
        borderColor: theme.ui.border,
        borderRadius: "8px",
        padding: "12px",
        width: "240px",
        zIndex: 15,
        fontFamily: "sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        border: `1px solid ${theme.ui.border}`,
      }}
    >
      <h4
        style={{
          margin: "0 0 12px 0",
          color: theme.text.accent,
          fontSize: "14px",
        }}
      >
        Legend
      </h4>

      <div className="legend-section" style={{ marginBottom: "12px" }}>
        <p
          className="legend-section-label"
          style={{
            margin: "0 0 8px 0",
            color: theme.text.secondary,
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Cloud Providers
        </p>
        {providers.map((p) => (
          <div
            key={p.name}
            className="legend-item"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              fontSize: "12px",
            }}
          >
            <span
              className="legend-color-box"
              style={{
                backgroundColor: p.color,
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                marginRight: "8px",
              }}
            ></span>
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="legend-section">
        <p
          className="legend-section-label"
          style={{
            margin: "0 0 8px 0",
            color: theme.text.secondary,
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Latency
        </p>
        {latencyColors.map((l) => (
          <div
            key={l.range}
            className="legend-item"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              fontSize: "12px",
            }}
          >
            <span
              className="legend-color-box"
              style={{
                backgroundColor: l.color,
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                marginRight: "8px",
              }}
            ></span>
            <span>{l.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

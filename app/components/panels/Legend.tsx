"use client";
import { useState } from "react";
import CollapsiblePanel from "../common/CollapsiblePanel";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/Legend.css";

export default function Legend() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
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
    <>
      {/* Mobile/Tablet Toggle Button */}
      <button
        className="legendToggleBtn"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Legend Panel"
      >
        📊
      </button>

      {/* Legend Panel */}
      <div
        className={`legendPanel ${isOpen ? "open" : "closed"}`}
        style={
          {
            background: theme.ui.panel,
            color: theme.text.primary,
            ["--panel-border"]: theme.ui.border,
            ["--text-accent"]: theme.text.accent,
            ["--text-secondary"]: theme.text.secondary,
          } as any
        }
      >
        <h4 className="heading">Legend</h4>

        <div className="legendSection">
          <p className="legendSectionLabel">Cloud Providers</p>
          {providers.map((p) => (
            <div key={p.name} className="legendItem">
              <span className={`legendColorBox ${p.name.toLowerCase()}`}></span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="legendSection">
          <p className="legendSectionLabel">Latency</p>
          {latencyColors.map((l, idx) => (
            <div key={l.range} className="legendItem">
              <span
                className={`legendColorBox ${
                  idx === 0
                    ? "latencyLow"
                    : idx === 1
                    ? "latencyMid"
                    : "latencyHigh"
                }`}
              ></span>
              <span>{l.range}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

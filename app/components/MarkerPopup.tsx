"use client";

import { useEffect, useState } from "react";
import "../styles/MarkerPopup.css";

export default function MarkerPopup({
  data,
  onClose,
  theme,
}: {
  data: any;
  onClose: any;
  theme?: any;
}) {
  const [position, setPosition] = useState({ top: 20, right: 20 });

  // Dynamically position the popup near the clicked region
  useEffect(() => {
    if (data && data.screenPosition) {
      const offset = 20;
      setPosition({
        top: Math.max(20, data.screenPosition.y - 10),
        right: Math.max(20, window.innerWidth - data.screenPosition.x - offset),
      });
    }
  }, [data]);

  if (!data) return null;

  return (
    <div
      className="popup"
      style={
        {
          background: theme?.ui.panel || "rgba(0,0,0,0.95)",
          color: theme?.text.primary || "#fff",
          ["--panel-border"]: theme?.ui.border || "#444",
          ["--title-accent"]: theme?.text.accent || "#ffd700",
          top: position.top,
          right: position.right,
        } as any
      }
    >
      <button className="closeBtn" onClick={onClose}>
        ×
      </button>
      <h3 className="title">{data.exchange || data.provider}</h3>
      {data.exchange && (
        <p className="text">
          <strong>Cloud:</strong> {data.provider}
        </p>
      )}
      {data.region && (
        <p className="text">
          <strong>Region:</strong> {data.region}
        </p>
      )}
      {data.lat && data.lon && (
        <p className="text">
          <strong>Coords:</strong> {data.lat.toFixed(2)}, {data.lon.toFixed(2)}
        </p>
      )}
      {data.latency && (
        <p className="text">
          <strong>Latency:</strong> {data.latency}ms
        </p>
      )}
    </div>
  );
}

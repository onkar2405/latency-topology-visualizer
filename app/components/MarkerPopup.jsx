"use client";

import { useEffect, useState } from "react";

export default function MarkerPopup({ data, onClose, theme }) {
  const [position, setPosition] = useState({ top: 20, right: 20 });

  // Dynamically position the popup near the clicked region
  useEffect(() => {
    if (data && data.screenPosition) {
      // Position popup to the top-right of the clicked region
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
      style={{
        ...styles.popup,
        background: theme?.ui.panel || "rgba(0,0,0,0.95)",
        color: theme?.text.primary || "#fff",
        borderColor: theme?.ui.border || "#444",
        top: position.top,
        right: position.right,
      }}
    >
      <button style={styles.closeBtn} onClick={onClose}>
        ×
      </button>

      <h3 style={styles.title}>{data.exchange || data.provider}</h3>
      {data.exchange && (
        <p style={styles.text}>
          <strong>Cloud:</strong> {data.provider}
        </p>
      )}
      {data.region && (
        <p style={styles.text}>
          <strong>Region:</strong> {data.region}
        </p>
      )}
      {data.lat && data.lon && (
        <p style={styles.text}>
          <strong>Coords:</strong> {data.lat.toFixed(2)}, {data.lon.toFixed(2)}
        </p>
      )}
      {data.latency && (
        <p style={styles.text}>
          <strong>Latency:</strong> {data.latency}ms
        </p>
      )}
    </div>
  );
}

const styles = {
  popup: {
    position: "fixed",
    background: "rgba(0,0,0,0.95)",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    width: "280px",
    fontFamily: "sans-serif",
    zIndex: 1000, // Ensure it appears above everything
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
    border: "1px solid #444",
    backdropFilter: "blur(8px)",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ffd700",
  },
  text: {
    margin: "8px 0",
    fontSize: "13px",
    lineHeight: "1.4",
  },
  closeBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0 4px",
    transition: "color 0.2s",
  },
};

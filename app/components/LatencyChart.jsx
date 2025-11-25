"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function LatencyChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={styles.container}>
        <h3>No data yet</h3>
      </div>
    );
  }

  // Extract timestamps and latency values
  const labels = history.map((d) => new Date(d.timestamp).toLocaleTimeString());

  const values = history.map((d) => d.latency);

  // Calculate stats
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  const data = {
    labels,
    datasets: [
      {
        label: "Latency (ms)",
        data: values,
        borderColor: "#4dc9f6",
        backgroundColor: "rgba(77,201,246,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h3>Historical Latency</h3>

      <Line data={data} height={100} />

      <div style={styles.stats}>
        <p>
          <strong>Min:</strong> {min} ms
        </p>
        <p>
          <strong>Max:</strong> {max} ms
        </p>
        <p>
          <strong>Avg:</strong> {avg} ms
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    right: 20,
    top: 20,
    width: "360px",
    padding: "16px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    borderRadius: "8px",
    zIndex: 20,
    fontFamily: "sans-serif",
  },
  stats: {
    marginTop: "12px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
  },
};

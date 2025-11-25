"use client";

export default function TimeRangeSelector({ value, onChange }) {
  const ranges = ["1h", "24h", "7d", "30d"];

  return (
    <div style={styles.container}>
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            ...styles.btn,
            background: value === r ? "#4dc9f6" : "#333",
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    right: 20,
    top: 350,
    zIndex: 30,
    display: "flex",
    gap: "8px",
  },
  btn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};

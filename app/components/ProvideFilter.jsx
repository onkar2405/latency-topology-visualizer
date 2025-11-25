"use client";

export default function ProviderFilter({ selected, onToggle }) {
  const providers = ["AWS", "GCP", "Azure"];

  return (
    <div style={styles.container}>
      {providers.map((p) => (
        <label key={p} style={styles.label}>
          <input
            type="checkbox"
            checked={selected.includes(p)}
            onChange={() => onToggle(p)}
          />
          {p}
        </label>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 30,
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    fontFamily: "sans-serif",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
  },
};

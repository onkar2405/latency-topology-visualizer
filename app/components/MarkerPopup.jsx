"use client";

export default function MarkerPopup({ data, onClose }) {
  if (!data) return null;

  return (
    <div style={styles.popup}>
      <button style={styles.closeBtn} onClick={onClose}>
        ×
      </button>

      <h3>{data.exchange}</h3>
      <p>
        <strong>Cloud:</strong> {data.provider}
      </p>
      <p>
        <strong>Region:</strong> {data.region}
      </p>
    </div>
  );
}

const styles = {
  popup: {
    position: "absolute",
    top: 20,
    left: 20,
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    width: "220px",
    fontFamily: "sans-serif",
    zIndex: 10,
  },
  closeBtn: {
    float: "right",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
};

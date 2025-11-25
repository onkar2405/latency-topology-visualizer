"use client";

export default function Legend() {
  return (
    <div style={styles.container}>
      <h4>Legend</h4>

      <div style={styles.item}>
        <span style={{ ...styles.dot, background: "#FFD700" }}></span>
        AWS
      </div>

      <div style={styles.item}>
        <span style={{ ...styles.dot, background: "#1E90FF" }}></span>
        GCP
      </div>

      <div style={styles.item}>
        <span style={{ ...styles.dot, background: "#9b5de5" }}></span>
        Azure
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    padding: "12px",
    background: "rgba(0,0,0,0.7)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    width: "140px",
    fontFamily: "sans-serif",
    zIndex: 10,
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginTop: "6px",
    gap: "8px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
};

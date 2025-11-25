"use client";

export default function ExchangeSelector({ exchanges, selected, onChange }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      style={styles.dropdown}
    >
      {exchanges.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}

const styles = {
  dropdown: {
    position: "absolute",
    right: 20,
    top: 300,
    zIndex: 30,
    padding: "8px",
    borderRadius: "6px",
    fontSize: "14px",
  },
};

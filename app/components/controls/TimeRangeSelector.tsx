"use client";
import "../../styles/TimeRangeSelector.css";

export default function TimeRangeSelector({ value, onChange }) {
  const ranges = ["1h", "24h", "7d", "30d"];

  return (
    <div className="container">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`btn ${value === r ? "btnActive" : "btnInactive"}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

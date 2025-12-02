"use client";
import "../../styles/ExchangeSelector.css";

export default function ExchangeSelector({ exchanges, selected, onChange }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target?.value)}
      className="dropdown"
    >
      {exchanges.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
}

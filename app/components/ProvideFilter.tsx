"use client";
import "../styles/ProviderFilter.css";

export default function ProviderFilter({ selected, onToggle }) {
  const providers = ["AWS", "GCP", "Azure"];

  return (
    <div className="container">
      {providers.map((p) => (
        <label key={p} className="label">
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

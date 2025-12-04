"use client";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const theme = useTheme();

  return (
    <button
      onClick={theme.toggleTheme}
      className="themeToggleButton"
      title="Toggle dark/light mode"
      style={{
        color: theme.text.primary,
        borderColor: theme.ui.border,
        backgroundColor: theme.ui.panel,
      }}
    >
      {theme.isDark ? "☀️" : "🌙"}
    </button>
  );
}

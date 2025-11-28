"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage on client mount
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  const theme = {
    isDark,
    toggleTheme,
    bg: {
      primary: isDark ? "#0a0e27" : "#efefef",
      secondary: isDark ? "#1a1f3a" : "#e0e0e0",
      tertiary: isDark ? "#242a45" : "#d8d8d8",
    },
    text: {
      primary: isDark ? "#ffffff" : "#000000",
      secondary: isDark ? "#b0b0b0" : "#555555",
      accent: isDark ? "#ffd700" : "#ff9500",
    },
    ui: {
      border: isDark ? "#444444" : "#999999",
      panel: isDark ? "rgba(0,0,0,0.75)" : "rgba(239,239,239,0.95)",
      panelTransparent: isDark ? "rgba(0,0,0,0.5)" : "rgba(224,224,224,0.85)",
    },
  };

  // Prevent hydration mismatch by rendering without theme until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  // Return default dark theme if context not available (during hydration)
  if (!context) {
    return {
      isDark: true,
      toggleTheme: () => {},
      bg: {
        primary: "#0a0e27",
        secondary: "#1a1f3a",
        tertiary: "#242a45",
      },
      text: {
        primary: "#ffffff",
        secondary: "#000000",
        accent: "#ffd700",
      },
      ui: {
        border: "#444444",
        panel: "rgba(0,0,0,0.75)",
        panelTransparent: "rgba(0,0,0,0.5)",
      },
    };
  }

  return context;
}

"use client";
import { ReactNode, useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/ExpandablePanel.css";

interface ExpandablePanelProps {
  title: string;
  panelClassName: string;
  children: ReactNode;
  themeStyles?: React.CSSProperties;
  defaultCollapsed?: boolean;
}

// Helper function to determine if screen is small
const isSmallScreen = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
};

export default function ExpandablePanel({
  title,
  panelClassName,
  children,
  themeStyles,
  defaultCollapsed,
}: ExpandablePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);

  // Initialize collapsed state on mount based on screen size
  useEffect(() => {
    const updateCollapsedState = () => {
      // If defaultCollapsed is explicitly set, use that
      if (defaultCollapsed !== undefined) {
        setIsCollapsed(defaultCollapsed);
        return;
      }

      // Responsive breakpoints:
      // Large (desktop/laptop): >= 1024px -> expanded (false)
      // Medium (tablets): 768px - 1023px -> collapsed (true)
      // Small (mobile): < 768px -> collapsed (true)
      setIsCollapsed(isSmallScreen());
    };

    updateCollapsedState();

    // Add resize listener to update on window resize
    window.addEventListener("resize", updateCollapsedState);
    return () => window.removeEventListener("resize", updateCollapsedState);
  }, [defaultCollapsed]);

  // Prevent hydration mismatch - render initial state during SSR
  if (isCollapsed === null) {
    return (
      <div className={`expandablePanel ${panelClassName}`} style={themeStyles}>
        <div className="expandablePanelHeader">
          <h2 className="expandablePanelTitle">{title}</h2>
          <button
            className="expandablePanelButton"
            disabled
            aria-label={`Toggle ${title.toLowerCase()}`}
          >
            ◀
          </button>
        </div>
        <div className="expandablePanelContent">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`expandablePanel ${panelClassName} ${
        isCollapsed ? "collapsed" : ""
      }`}
      style={themeStyles}
    >
      <div className="expandablePanelHeader">
        <h2 className={`expandablePanelTitle ${isCollapsed ? "hidden" : ""}`}>
          {title}
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`expandablePanelButton ${isCollapsed ? "collapsed" : ""}`}
          title={
            isCollapsed
              ? `Expand ${title.toLowerCase()}`
              : `Collapse ${title.toLowerCase()}`
          }
          aria-label={`Toggle ${title.toLowerCase()}`}
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>

      {!isCollapsed && <div className="expandablePanelContent">{children}</div>}
    </div>
  );
}

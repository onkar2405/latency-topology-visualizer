"use client";
import { useState, useId } from "react";

export default function CollapsiblePanel({
  title,
  children,
  defaultCollapsed = false,
  id,
  titleElement = "h3",
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const TitleTag = titleElement;
  const uid = useId();
  const contentId = id || `collapsible-${uid}`;

  return (
    <div className="collapsible-panel">
      <div className="panel-header">
        <TitleTag className="panel-title">{title}</TitleTag>

        <button
          className="toggle-button"
          onClick={() => setCollapsed((s) => !s)}
          aria-expanded={!collapsed}
          aria-controls={contentId}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 15l6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        id={contentId}
        className={`panel-content ${collapsed ? "collapsed" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

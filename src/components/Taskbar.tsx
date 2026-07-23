"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

interface TaskbarProps {
  isFullscreen: boolean;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  onToggleFullscreen: () => void;
  onToggleNotificationCenter: () => void;
}

type TrayTooltip = {
  label: string;
  meta: string;
};

export default function Taskbar({
  isFullscreen,
  isCrtEnabled,
  onToggleCrt,
  onToggleFullscreen,
  onToggleNotificationCenter,
}: TaskbarProps) {
  const {
    openApps,
    activeAppId,
    focusApp,
    restoreApp,
    minimizeApp,
    toggleStartMenu,
    isStartMenuOpen,
    toggleFlip3d,
  } = useDesktopStore();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tooltip, setTooltip] = useState<TrayTooltip | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleAppClick = (id: string) => {
    const app = openApps.find((a) => a.id === id);
    if (!app) return;

    if (app.isMinimized) {
      restoreApp(id);
      focusApp(id);
    } else if (activeAppId === id) {
      minimizeApp(id);
    } else {
      focusApp(id);
    }
  };

  const trayButtonStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    position: "relative",
    padding: 0,
    margin: "0 2px",
    filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.5))",
  };

  const renderTrayButton = (
    label: string,
    meta: string,
    onClick: () => void,
    icon: React.ReactNode,
    active?: boolean
  ) => (
    <button
      type="button"
      aria-label={label}
      title={meta}
      onClick={onClick}
      onMouseEnter={() => setTooltip({ label, meta })}
      onMouseLeave={() => setTooltip(null)}
      style={{
        ...trayButtonStyle,
        opacity: active ? 1 : 0.85,
      }}
    >
      {icon}
    </button>
  );

  return (
    <div className="taskbar" onClick={(e) => e.stopPropagation()}>
      {/* Start Button */}
      <button
        className="start-btn"
        onClick={toggleStartMenu}
        style={{
          outline: isStartMenuOpen ? "2px solid rgba(100,200,100,0.5)" : "none",
        }}
        title="Start"
      >
        <img src="/icons/Start-icon.png" alt="Start" width={22} height={22} />
      </button>

      {/* Quick Launch - Flip 3D */}
      <button
        className="taskbar-app-btn"
        style={{ padding: "0 8px", marginLeft: 70 }}
        onClick={toggleFlip3d}
        title="Windows Flip 3D (Meta + Tab)"
      >
        <span style={{ fontSize: 16 }}>◩</span>
      </button>

      {/* Open App Buttons */}
      <div style={{ display: "flex", flex: 1, overflowX: "auto", overflowY: "hidden", marginLeft: 4, scrollbarWidth: "none" }}>
        {openApps.map((app) => (
          <button
            key={app.id}
            className={`taskbar-app-btn ${
              activeAppId === app.id && !app.isMinimized
                ? "taskbar-app-btn-active"
                : ""
            }`}
            onClick={() => handleAppClick(app.id)}
            style={{
              opacity: app.isMinimized ? 0.6 : 1,
            }}
            title={app.title}
          >
            <span style={{ fontSize: 14 }}>{app.icon}</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="system-tray hidden sm:flex" style={{ position: "relative", alignItems: "center", padding: "0 12px 0 8px", gap: 2 }}>
        <div style={{ color: "white", fontSize: 10, marginRight: 6, opacity: 0.8, cursor: "pointer", filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.8))" }}>
          {"<"}
        </div>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 44,
              padding: "8px 10px",
              width: 220,
              backgroundColor: "#FFFFE1",
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
              backgroundSize: "4px 4px",
              border: "1px solid black",
              borderRadius: 7,
              boxShadow: "3px 3px 6px rgba(0,0,0,0.4)",
              color: "black",
              fontFamily: "Tahoma, 'Segoe UI', sans-serif",
              zIndex: 50,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700 }}>{tooltip.label}</div>
            <div style={{ fontSize: 11, color: "#333", marginTop: 4, lineHeight: 1.4 }}>{tooltip.meta}</div>
          </div>
        )}

        {renderTrayButton(
          "Volume",
          "Volume control - sound output is available.",
          () => {},
          <span style={{ fontSize: 14 }}>🔊</span>
        )}
        {renderTrayButton(
          "Internet",
          "Network status - connected and ready.",
          () => {},
          <span style={{ fontSize: 14 }}>🌐</span>
        )}
        {renderTrayButton(
          "CRT Mode",
          isCrtEnabled ? "CRT effect is enabled." : "CRT effect is disabled.",
          onToggleCrt,
          <span style={{ fontSize: 13, fontWeight: 700 }}>CRT</span>,
          isCrtEnabled
        )}
        {renderTrayButton(
          "Notifications",
          isFullscreen ? "Fullscreen is active. Click for desktop notifications." : "Open notification center.",
          onToggleNotificationCenter,
          <span style={{ fontSize: 14 }}>🔔</span>
        )}
        {renderTrayButton(
          "Fullscreen",
          isFullscreen ? "Exit fullscreen mode." : "Enter fullscreen mode.",
          onToggleFullscreen,
          <span style={{ fontSize: 13, fontWeight: 700 }}>⛶</span>,
          isFullscreen
        )}

        <div style={{ textAlign: "right", marginLeft: 8, color: "white", fontSize: 13, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
          {time}
        </div>
      </div>
    </div>
  );
}

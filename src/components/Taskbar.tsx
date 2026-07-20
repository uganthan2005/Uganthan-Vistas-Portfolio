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
    } else if (activeAppId === id) {
      minimizeApp(id);
    } else {
      focusApp(id);
    }
  };

  const trayButtonStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    position: "relative",
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
        background: active ? "rgba(100, 170, 255, 0.24)" : trayButtonStyle.background,
        borderColor: active ? "rgba(120, 180, 255, 0.45)" : trayButtonStyle.borderColor,
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

      {/* Open App Buttons */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", marginLeft: 4 }}>
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
      <div className="system-tray" style={{ position: "relative" }}>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 44,
              padding: "8px 10px",
              borderRadius: 10,
              background: "rgba(10, 14, 22, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
              color: "white",
              width: 220,
              zIndex: 50,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700 }}>{tooltip.label}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4, lineHeight: 1.4 }}>{tooltip.meta}</div>
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

        <div style={{ textAlign: "right", marginLeft: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>{time}</div>
          <div style={{ fontSize: 10, opacity: 0.7 }}>{date}</div>
        </div>
      </div>
    </div>
  );
}

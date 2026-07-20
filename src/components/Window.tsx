"use client";

import React, { useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { useDesktopStore, AppInstance } from "@/store/useDesktopStore";

interface WindowProps {
  app: AppInstance;
  children: React.ReactNode;
}

export default function Window({ app, children }: WindowProps) {
  const {
    activeAppId,
    focusApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    restoreApp,
    updateAppPosition,
    updateAppSize,
  } = useDesktopStore();

  const rndRef = useRef<Rnd | null>(null);
  const isActive = activeAppId === app.id;
  const taskbarHeight = 44;

  const handleFocus = useCallback(() => {
    if (activeAppId !== app.id) {
      focusApp(app.id);
    }
  }, [activeAppId, app.id, focusApp]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeApp(app.id);
    },
    [app.id, closeApp]
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      minimizeApp(app.id);
    },
    [app.id, minimizeApp]
  );

  const handleMaximize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (app.isMaximized) {
        restoreApp(app.id);
      } else {
        maximizeApp(app.id);
      }
    },
    [app.id, app.isMaximized, maximizeApp, restoreApp]
  );

  if (app.isMinimized) return null;

  const windowStyle: React.CSSProperties = {
    zIndex: app.zIndex,
    animation: "windowOpen 0.2s ease",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  if (app.isMaximized) {
    return (
      <div
        className={isActive ? "aero-glass-active" : "aero-glass-inactive"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: `calc(100vh - ${taskbarHeight}px)`,
          zIndex: app.zIndex,
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
        }}
        onMouseDown={handleFocus}
      >
        <div
          className={`window-titlebar ${!isActive ? "window-titlebar-inactive" : ""}`}
          onDoubleClick={handleMaximize}
          style={{ borderRadius: 0 }}
        >
          <span style={{ fontSize: 16, marginRight: 4 }}>{app.icon}</span>
          <span className="window-titlebar-text">{app.title}</span>
          <div className="window-controls">
            <button className="window-btn" onClick={handleMinimize} title="Minimize">
              ─
            </button>
            <button className="window-btn" onClick={handleMaximize} title="Restore">
              ❐
            </button>
            <button className="window-btn window-btn-close" onClick={handleClose} title="Close">
              ✕
            </button>
          </div>
        </div>
        <div className="window-body" style={{ flex: 1, borderRadius: 0 }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Rnd
      ref={rndRef}
      style={windowStyle}
      className={isActive ? "aero-glass-active" : "aero-glass-inactive"}
      size={app.size}
      position={app.position}
      minWidth={320}
      minHeight={200}
      dragHandleClassName="window-titlebar-drag"
      bounds="parent"
      onDragStart={handleFocus}
      onDragStop={(_e, d) => {
        updateAppPosition(app.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        updateAppSize(app.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        updateAppPosition(app.id, position);
      }}
      onMouseDown={handleFocus}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <div
        className={`window-titlebar window-titlebar-drag ${!isActive ? "window-titlebar-inactive" : ""}`}
        onDoubleClick={handleMaximize}
      >
        <span style={{ fontSize: 16, marginRight: 4 }}>{app.icon}</span>
        <span className="window-titlebar-text">{app.title}</span>
        <div className="window-controls no-drag">
          <button className="window-btn" onClick={handleMinimize} title="Minimize">
            ─
          </button>
          <button className="window-btn" onClick={handleMaximize} title="Maximize">
            □
          </button>
          <button className="window-btn window-btn-close" onClick={handleClose} title="Close">
            ✕
          </button>
        </div>
      </div>
      <div className="window-body" style={{ height: "calc(100% - 32px)" }}>
        {children}
      </div>
    </Rnd>
  );
}

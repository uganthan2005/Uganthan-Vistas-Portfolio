"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
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
    openApps,
    isFlip3dOpen,
  } = useDesktopStore();

  const isActive = activeAppId === app.id;
  const taskbarHeight = 44;
  const controls = useAnimation();

  // Find index for Flip 3D
  const appIndex = openApps.findIndex((a) => a.id === app.id);
  const totalApps = openApps.length;

  const handleFocus = useCallback(() => {
    if (activeAppId !== app.id) {
      focusApp(app.id);
    }
  }, [activeAppId, app.id, focusApp]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      closeApp(app.id);
    },
    [app.id, closeApp]
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      minimizeApp(app.id);
    },
    [app.id, minimizeApp]
  );

  const handleMaximize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (app.isMaximized) {
        restoreApp(app.id);
      } else {
        maximizeApp(app.id);
      }
    },
    [app.id, app.isMaximized, maximizeApp, restoreApp]
  );

  // Apply Flip 3D animation
  useEffect(() => {
    if (isFlip3dOpen) {
      // Calculate 3D position
      const offset = totalApps - 1 - appIndex; // Reverse index so active is in front
      controls.start({
        x: `calc(50vw - ${app.size.width / 2}px - ${offset * 40}px)`,
        y: `calc(50vh - ${app.size.height / 2}px + ${offset * 30}px)`,
        rotateY: -25,
        rotateX: 5,
        scale: 0.8 - offset * 0.05,
        z: -offset * 100,
        opacity: 1 - offset * 0.15,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    } else {
      // Restore position
      controls.start({
        x: app.position.x,
        y: app.position.y,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        z: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 500, damping: 40 },
      });
    }
  }, [isFlip3dOpen, appIndex, totalApps, controls, app.position, app.size]);

  if (app.isMinimized) return null;

  if (app.isMaximized && !isFlip3dOpen) {
    return (
      <div
        className={`vista-window-frame ${isActive ? "active" : ""}`}
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
          padding: 0, // Maximize hides the thick glass padding around the body
        }}
        onMouseDown={handleFocus}
      >
        <div
          className="window-titlebar window-titlebar-drag"
          onDoubleClick={handleMaximize}
          style={{ borderRadius: 0 }}
        >
          <span style={{ fontSize: 16, marginRight: 4, zIndex: 2 }}>{app.icon}</span>
          <span className="window-titlebar-text" style={{ zIndex: 2 }}>{app.title}</span>
          <div className="window-controls" style={{ zIndex: 2 }}>
            <button className="window-btn" onClick={handleMinimize} onMouseDown={handleMinimize} title="Minimize">
              ─
            </button>
            <button className="window-btn" onClick={handleMaximize} onMouseDown={handleMaximize} title="Restore">
              ❐
            </button>
            <button className="window-btn window-btn-close" onClick={handleClose} onMouseDown={handleClose} title="Close">
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
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={controls}
      drag={!isFlip3dOpen}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={handleFocus}
      onDragEnd={(_e, info) => {
        // Update the store with the new position after dragging
        updateAppPosition(app.id, {
          x: app.position.x + info.offset.x,
          y: app.position.y + info.offset.y,
        });
      }}
      className={`vista-window-frame ${isActive && !isFlip3dOpen ? "active" : ""}`}
      style={{
        position: "absolute",
        width: app.size.width,
        height: app.size.height,
        zIndex: app.zIndex,
        display: "flex",
        flexDirection: "column",
        transformStyle: "preserve-3d",
        perspective: 1200,
        pointerEvents: isFlip3dOpen && !isActive ? "none" : "auto",
        cursor: isFlip3dOpen ? "pointer" : "default",
      }}
      onMouseDown={() => {
        handleFocus();
        if (isFlip3dOpen && isActive) {
          useDesktopStore.getState().toggleFlip3d();
        }
      }}
    >
      <div
        className="window-titlebar window-titlebar-drag"
        onDoubleClick={handleMaximize}
        style={{ cursor: isFlip3dOpen ? "pointer" : "grab" }}
      >
        <span style={{ fontSize: 16, marginRight: 4, zIndex: 2 }}>{app.icon}</span>
        <span className="window-titlebar-text" style={{ zIndex: 2 }}>{app.title}</span>
        <div className="window-controls no-drag" style={{ pointerEvents: isFlip3dOpen ? "none" : "auto", zIndex: 2 }}>
          <button className="window-btn" onClick={handleMinimize} onMouseDown={handleMinimize} title="Minimize">
            _
          </button>
          <button className="window-btn" onClick={handleMaximize} onMouseDown={handleMaximize} title="Maximize">
            □
          </button>
          <button className="window-btn window-btn-close" onClick={handleClose} onMouseDown={handleClose} title="Close">
            ✕
          </button>
        </div>
      </div>
      <div className="window-body" style={{ flex: 1, pointerEvents: isFlip3dOpen ? "none" : "auto" }}>
        {children}
      </div>
      
      {/* Basic Resize Handle */}
      {!isFlip3dOpen && (
        <div 
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 15,
            height: 15,
            cursor: "nwse-resize",
            zIndex: 10,
          }}
          // Basic resizing could be implemented here, but we rely on fixed size for now 
          // to keep the framer-motion implementation simple and focused on drag & Flip3D
        />
      )}
    </motion.div>
  );
}

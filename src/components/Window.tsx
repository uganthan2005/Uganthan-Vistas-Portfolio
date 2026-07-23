"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";
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
    openApps,
    isFlip3dOpen,
  } = useDesktopStore();

  const isActive = activeAppId === app.id;
  const taskbarHeight = 44;
  const controls = useAnimation();
  const dragControls = useDragControls();

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


  // Resize Handler
  const handleResizeStart = (e: React.PointerEvent, dir: string) => {
    if (app.isMaximized || isFlip3dOpen) return;
    e.stopPropagation();
    e.preventDefault();
    handleFocus();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = app.size.width;
    const startHeight = app.size.height;
    const startPosX = app.position.x;
    const startPosY = app.position.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (dir.includes('e')) newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
      if (dir.includes('s')) newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
      
      if (dir.includes('w')) {
        const deltaX = moveEvent.clientX - startX;
        newWidth = Math.max(300, startWidth - deltaX);
        if (newWidth > 300) newX = startPosX + deltaX;
      }
      if (dir.includes('n')) {
        const deltaY = moveEvent.clientY - startY;
        newHeight = Math.max(200, startHeight - deltaY);
        if (newHeight > 200) newY = startPosY + deltaY;
      }

      updateAppSize(app.id, { width: newWidth, height: newHeight });
      if (dir.includes('w') || dir.includes('n')) {
        updateAppPosition(app.id, { x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };


  if (app.isMaximized && !isFlip3dOpen) {
    return (
      <div
        className={`vista-window-frame ${isActive ? "active" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `calc(100% - ${taskbarHeight}px)`,
          zIndex: app.zIndex,
          display: app.isMinimized ? "none" : "flex",
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
      dragListener={false} // ONLY drag via dragControls (the titlebar)
      dragControls={dragControls}
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
        display: app.isMinimized ? "none" : "flex",
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
        onPointerDown={(e) => {
          if (!isFlip3dOpen) dragControls.start(e);
        }}
        style={{ cursor: isFlip3dOpen ? "pointer" : "grab", touchAction: "none" }}
      >
        <span style={{ fontSize: 16, marginRight: 4, zIndex: 2 }}>{app.icon}</span>
        <span className="window-titlebar-text" style={{ zIndex: 2 }}>{app.title}</span>
        <div className="window-controls no-drag" style={{ pointerEvents: isFlip3dOpen ? "none" : "auto", zIndex: 2 }} onPointerDown={(e) => e.stopPropagation()}>
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
      
      {/* Resize Handles */}
      {!isFlip3dOpen && (
        <>
          <div className="absolute top-0 left-0 w-full h-[6px] cursor-ns-resize z-10" onPointerDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 w-full h-[6px] cursor-ns-resize z-10" onPointerDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute top-0 left-0 w-[6px] h-full cursor-ew-resize z-10" onPointerDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 right-0 w-[6px] h-full cursor-ew-resize z-10" onPointerDown={(e) => handleResizeStart(e, 'e')} />
          <div className="absolute top-0 left-0 w-[12px] h-[12px] cursor-nwse-resize z-20" onPointerDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-[12px] h-[12px] cursor-nesw-resize z-20" onPointerDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-[12px] h-[12px] cursor-nesw-resize z-20" onPointerDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-[12px] h-[12px] cursor-nwse-resize z-20" onPointerDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}
    </motion.div>
  );
}

"use client";

import React, { useState, useCallback } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

interface DesktopIconProps {
  appType: string;
  label: string;
  icon: React.ReactNode;
}

export default function DesktopIcon({ appType, label, icon }: DesktopIconProps) {
  const openApp = useDesktopStore((s) => s.openApp);
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = useCallback(() => {
    setIsSelected(true);
    // On mobile devices, single click opens the app
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openApp(appType);
      setIsSelected(false);
    }
  }, [appType, openApp]);

  const handleDoubleClick = useCallback(() => {
    // Only double click on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      openApp(appType);
      setIsSelected(false);
    }
  }, [appType, openApp]);

  const handleBlur = useCallback(() => {
    setIsSelected(false);
  }, []);

  return (
    <div
      className={`desktop-icon ${isSelected ? "desktop-icon-selected" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      tabIndex={0}
    >
      <div className="desktop-icon-img">{icon}</div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
}

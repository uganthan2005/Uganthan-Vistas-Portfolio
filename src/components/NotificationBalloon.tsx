"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBalloon() {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after some time to mimic real OS behavior
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 50,
            right: 16,
            width: 320,
            // XP balloon style background with grid
            backgroundColor: "#FFFFE1",
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "4px 4px",
            border: "1px solid black",
            borderRadius: "7px",
            boxShadow: "3px 3px 6px rgba(0,0,0,0.4)",
            padding: "10px 14px",
            color: "black",
            fontFamily: "Tahoma, 'Segoe UI', sans-serif",
            zIndex: 9999,
          }}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              position: "absolute",
              top: 6,
              right: 8,
              background: "transparent",
              border: "none",
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
              color: "#555",
              fontWeight: "bold",
            }}
          >
            ×
          </button>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {/* Info Icon (CSS Recreated) */}
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fff 0%, #c3d9ff 100%)",
              border: "1px solid #7792c9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#003399",
              fontWeight: "bold",
              fontSize: 14,
              fontFamily: "'Times New Roman', serif",
              boxShadow: "inset -1px -1px 3px rgba(0,0,0,0.15), 1px 1px 2px rgba(0,0,0,0.2)"
            }}>
              i
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, textShadow: "0px 1px 0px rgba(255,255,255,0.5)" }}>
              Welcome to Uganthan Vistas
            </div>
          </div>

          {/* Body */}
          <div style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 10, paddingLeft: 2 }}>
            My portfolio, built as a Windows Vista desktop.<br/>
            - Double-click an icon to get started<br/>
            - Or open a program from the Start menu
          </div>

          {/* Footer */}
          <div style={{ fontSize: 12, color: "#777", textAlign: "center" }}>
            Tip: Right-click for context menus.
          </div>

          {/* Balloon Arrow (Border Trick) */}
          <div style={{
            position: "absolute",
            bottom: -14,
            right: 30, // Pointing towards system tray
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "14px solid #000",
          }} />
          <div style={{
            position: "absolute",
            bottom: -11,
            right: 31,
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "12px solid #FFFFE1",
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React from "react";

const notes = [
  {
    text: "🎯 Technical Head — TALOS 5.0: Successfully led 10 events & 5 workshops. Architected a full-stack registration portal for 2,000+ teams.",
    color: "#fff9c4",
  },
  {
    text: "⚔️ LeetCode Knight: Top 5.48% globally. 450+ problems solved. Max rating 1,861.",
    color: "#c8e6c9",
  },
  {
    text: "🎨 Graphic Designer @Asymmetric: End-to-end marketing assets for Tech Fiesta & Hacksymmetric.",
    color: "#bbdefb",
  },
];

export default function StickyNotes() {
  return (
    <div className="gadget-card" style={{ padding: 8 }}>
      <div className="gadget-title" style={{ padding: "8px 8px 4px" }}>
        Sticky Notes
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.map((note, i) => (
          <div
            key={i}
            style={{
              background: note.color,
              padding: "12px 14px",
              borderRadius: 4,
              fontSize: 11,
              lineHeight: 1.5,
              color: "#333",
              fontFamily: "'Segoe UI', sans-serif",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0.3 : -0.2}deg)`,
              borderLeft: "3px solid rgba(0,0,0,0.1)",
            }}
          >
            {note.text}
          </div>
        ))}
      </div>
    </div>
  );
}

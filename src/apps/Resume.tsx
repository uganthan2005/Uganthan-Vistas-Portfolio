"use client";

import React, { useMemo, useState } from "react";

export default function Resume() {
  const [zoom, setZoom] = useState(1);

  const viewerSize = useMemo(() => {
    const width = Math.round(760 * zoom);
    const height = Math.round(1040 * zoom);
    return { width, height };
  }, [zoom]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#10131a",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "10px 12px",
          background: "linear-gradient(180deg, #20283a 0%, #111827 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>My Resume</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            View, zoom, scroll, or download the PDF.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setZoom((value) => Math.max(0.75, value - 0.1))}
            style={buttonStyle}
            title="Zoom out"
          >
            −
          </button>
          <div
            style={{
              minWidth: 66,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom((value) => Math.min(2.2, value + 0.1))}
            style={buttonStyle}
            title="Zoom in"
          >
            +
          </button>
          <a
            href="/resume.pdf"
            download="UGANTHAN-M-Resume.pdf"
            style={{ ...buttonStyle, textDecoration: "none" }}
            title="Download resume"
          >
            ⭳
          </a>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#0b0f16",
          padding: 18,
        }}
      >
        <div
          style={{
            width: viewerSize.width,
            height: viewerSize.height,
            margin: "0 auto",
            boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
            borderRadius: 12,
            overflow: "hidden",
            background: "#111",
          }}
        >
          <iframe
            title="Resume PDF"
            src="/resume.pdf#view=FitH"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  fontWeight: 700,
};

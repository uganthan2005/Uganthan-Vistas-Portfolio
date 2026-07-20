"use client";

import React from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

export default function SecurityModal() {
  const { securityModal, hideSecurityModal } = useDesktopStore();

  if (!securityModal.isOpen) return null;

  const handleProceed = () => {
    if (securityModal.isDownload) {
      // Trigger file download
      const link = document.createElement("a");
      link.href = securityModal.targetUrl;
      link.download = securityModal.downloadFilename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(securityModal.targetUrl, "_blank", "noopener,noreferrer");
    }
    hideSecurityModal();
  };

  const handleKeepWorking = () => {
    hideSecurityModal();
  };

  return (
    <div className="security-modal-overlay" onClick={handleKeepWorking}>
      <div className="security-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="security-modal-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
          <span
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: 500,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Windows Security Alert
          </span>
        </div>

        {/* Body */}
        <div className="security-modal-body">
          {/* Warning Icon */}
          <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>⚠️</div>

          {/* Message */}
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "#333" }}>
            {securityModal.isDownload ? (
              <>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>
                  File Download Request
                </p>
                <p>
                  The application is requesting to download a file from the
                  system:
                </p>
                <p
                  style={{
                    background: "#f0f0f0",
                    padding: "6px 10px",
                    borderRadius: 4,
                    margin: "8px 0",
                    fontFamily: "Consolas, monospace",
                    fontSize: 12,
                    wordBreak: "break-all",
                  }}
                >
                  📄 {securityModal.downloadFilename}
                </p>
                <p style={{ color: "#666", fontSize: 12 }}>
                  Do you want to continue with this download?
                </p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>
                  External Application Access
                </p>
                <p>
                  You are about to leave the desktop environment and open an
                  external application to:
                </p>
                <p
                  style={{
                    background: "#f0f0f0",
                    padding: "6px 10px",
                    borderRadius: 4,
                    margin: "8px 0",
                    fontFamily: "Consolas, monospace",
                    fontSize: 12,
                    wordBreak: "break-all",
                  }}
                >
                  🌐 {securityModal.targetDomain}
                </p>
                <p style={{ color: "#666", fontSize: 12 }}>
                  Do you want to continue?
                </p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="security-modal-actions">
          <button className="modal-btn modal-btn-primary" onClick={handleKeepWorking}>
            Keep Working
          </button>
          <button className="modal-btn modal-btn-danger" onClick={handleProceed}>
            {securityModal.isDownload ? "Download File" : "Proceed anyway"}
          </button>
        </div>
      </div>
    </div>
  );
}

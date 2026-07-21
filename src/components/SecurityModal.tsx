"use client";

import React from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import AeroDialog from "./AeroDialog";

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

  const title = securityModal.isDownload ? "File Download" : "External Application Request";
  const icon = "warning";

  return (
    <AeroDialog
      title={title}
      icon={icon}
      onClose={handleKeepWorking}
      width={480}
      buttons={
        <>
          <button
            onClick={handleProceed}
            className="px-4 py-1 border border-[#999] rounded bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] hover:border-[#3399ff] hover:bg-[#eef6ff] shadow-sm text-black text-[13px] min-w-[80px]"
          >
            {securityModal.isDownload ? "Download" : "Proceed"}
          </button>
          <button
            onClick={handleKeepWorking}
            className="px-4 py-1 border border-[#0078d7] rounded bg-gradient-to-b from-[#e5f1fb] to-[#cbe4f7] shadow-[0_0_0_1px_#0078d7_inset] text-black text-[13px] min-w-[80px] focus:outline-none"
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-2 text-[14px]">
        <span className="font-semibold text-[15px] truncate pr-4 text-[#003399]">
          {securityModal.targetUrl}
        </span>
        <span>
          {securityModal.isDownload 
            ? "The application is requesting to download a file. Do you want to continue?"
            : "You are about to leave the desktop environment and open an external application. Do you want to continue?"}
        </span>
      </div>
    </AeroDialog>
  );
}

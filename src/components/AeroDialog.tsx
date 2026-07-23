import React, { useEffect, useState } from "react";

interface AeroDialogProps {
  title: string;
  icon?: "error" | "warning" | "info" | null;
  onClose?: () => void;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  width?: number;
}

export default function AeroDialog({
  title,
  icon,
  onClose,
  children,
  buttons,
  width = 450,
}: AeroDialogProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[1px]">
      <div 
        className="rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto"
        style={{ width, border: "4px solid rgba(130, 200, 140, 0.7)", background: "#fff", backdropFilter: "blur(10px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar (Green Aero Glass) */}
        <div 
          className="relative flex items-center h-9 px-4 shrink-0"
          style={{
            background: "linear-gradient(to bottom, #d2eec4 0%, #a8d597 45%, #88c273 50%, #7db966 100%)",
            borderBottom: "1px solid #7db966"
          }}
        >
          <div className="text-black font-sans text-sm drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] truncate pr-10">
            {title}
          </div>
          
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-1 top-1 w-[38px] h-[18px] rounded-tl-sm rounded-tr-sm rounded-bl-md rounded-br-md shadow-sm border border-white/50 flex items-center justify-center transition-all hover:brightness-110 active:brightness-90 group"
              style={{
                background: "linear-gradient(to bottom, #e49187 0%, #c14436 45%, #b42b1a 50%, #d4594c 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1L9 9M9 1L1 9" className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
              </svg>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="bg-white flex-1 px-6 pt-6 pb-8 flex">
          {icon && (
            <div className="mr-8 shrink-0 flex items-start">
              {icon === "error" && (
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-inner border border-red-800 shadow-[0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-br from-red-400 to-red-700 relative">
                  <div className="absolute inset-[2px] rounded-full border border-white/30" />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                  </svg>
                </div>
              )}
              {icon === "warning" && (
                <div className="w-12 h-12 flex items-center justify-center text-[44px] leading-none drop-shadow-md pb-3">
                  ⚠️
                </div>
              )}
              {icon === "info" && (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-inner border border-blue-800 shadow-[0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-br from-blue-300 to-blue-600 relative">
                  <div className="absolute inset-[2px] rounded-full border border-white/30" />
                  <span className="text-white font-serif font-bold text-[32px] drop-shadow-sm italic leading-none">i</span>
                </div>
              )}
            </div>
          )}
          <div className="flex-1 text-[14px] text-black font-sans leading-relaxed flex flex-col justify-center">
            {children}
          </div>
        </div>

        {/* Footer Buttons */}
        {buttons && (
          <div className="bg-[#f0f0f0] border-t border-[#dfdfdf] px-5 py-4 flex justify-end gap-3 shrink-0">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
}

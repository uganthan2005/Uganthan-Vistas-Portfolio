"use client";

import { useEffect } from "react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    // Show welcome for 2.5 seconds then transition to desktop
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-[#1b3a9a] flex flex-col relative select-none">
      {/* Background Texture/Grid (Simulated using CSS) */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      ></div>

      {/* Top Header Bar */}
      <div className="w-full h-16 bg-gradient-to-r from-[#001082] to-[#1231a4] shadow-md z-10 shrink-0"></div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full h-full relative z-10 items-center justify-center">
        <h1 
          className="text-white text-5xl font-sans italic tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] lowercase"
        >
          welcome
        </h1>
      </div>

      {/* Bottom Footer Bar */}
      <div className="w-full h-16 bg-gradient-to-r from-[#001082] to-[#1231a4] shadow-md z-10 shrink-0 border-t border-[#f7a249]"></div>
    </div>
  );
}

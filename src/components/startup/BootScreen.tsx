"use client";

import { useEffect } from "react";
import Image from "next/image";

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative cursor-none select-none">
      
      {/* Main Logo Container */}
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center space-x-16">
          <Image 
            src="/icons/Start-icon.png" 
            alt="Windows Logo" 
            width={96} 
            height={96}
            className="drop-shadow-lg"
            priority
          />
          
          <div className="flex flex-col justify-center">
            <h1 
              className="text-white text-4xl md:text-5xl tracking-tight"
              style={{ fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "italic" }}
            >
              Uganthan&apos;s<span className="font-light"> Portfolio</span>
            </h1>
            <p className="text-white/80 italic text-xl mt-1 tracking-wide">
              Student, AI engineer, Software developer, Graphic designer
            </p>
          </div>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="relative mt-8">
        <div className="w-[300px] h-6 border-2 border-[#b2b2b2] rounded-md bg-black p-[2px] overflow-hidden relative">
          {/* Animated segments */}
          <div className="absolute top-0 left-0 h-full flex gap-[2px] animate-xp-loading w-[100px]">
            <div className="h-full flex-1 bg-gradient-to-b from-[#7e9ae8] via-[#244dc0] to-[#7e9ae8] rounded-[1px]"></div>
            <div className="h-full flex-1 bg-gradient-to-b from-[#7e9ae8] via-[#244dc0] to-[#7e9ae8] rounded-[1px]"></div>
            <div className="h-full flex-1 bg-gradient-to-b from-[#7e9ae8] via-[#244dc0] to-[#7e9ae8] rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-8 flex flex-col text-white text-sm">
        <span>For the best experience</span>
        <span>Enter Full Screen (F11)</span>
      </div>

      <div className="absolute bottom-8 right-8 text-white font-bold text-xl md:text-2xl italic flex items-center">
        Portfolio<sup className="text-xs ml-1">®</sup>
      </div>

      {/* Loading Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes xp-loading {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(300px); }
        }
        .animate-xp-loading {
          animation: xp-loading 1.5s linear infinite;
        }
      `}} />
    </div>
  );
}

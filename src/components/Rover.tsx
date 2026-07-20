"use client";

import React, { useState } from "react";
import Image from "next/image";

const PROMPTS = [
  "Hi! I'm Rover. Need help finding something?",
  "Did you know Uganthan built this entirely in Next.js?",
  "Try typing 'matrix' in the Command Prompt!",
  "I miss the days of Windows XP...",
  "Click me again if you're bored!",
  "Make sure to check out the 3D Pinball game in the Start Menu.",
  "Type 'sudo hire uganthan' in the terminal for a surprise.",
  "I'm just a dog, but I think this portfolio is pawsome!",
];

export default function Rover() {
  const [promptIndex, setPromptIndex] = useState(0);

  const handleClick = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  };

  return (
    <div className="mt-auto pt-4 flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <div
        className="relative mb-2 p-3 text-xs text-gray-800 bg-[#ffffe1] border border-gray-400 rounded shadow-sm text-center w-[160px]"
        style={{
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
          fontFamily: "'Trebuchet MS', sans-serif",
        }}
      >
        {PROMPTS[promptIndex]}
        {/* Pointer of the speech bubble */}
        <div
          className="absolute w-3 h-3 bg-[#ffffe1] border-b border-r border-gray-400 transform rotate-45"
          style={{
            bottom: "-7px",
            left: "50%",
            marginLeft: "-6px",
          }}
        />
      </div>

      {/* Rover GIF */}
      <div 
        className="cursor-pointer hover:scale-105 transition-transform"
        onClick={handleClick}
        title="Click me!"
      >
        <Image
          src="/assets/rover.gif"
          alt="Rover the Search Dog"
          width={80}
          height={80}
          unoptimized
        />
      </div>
    </div>
  );
}

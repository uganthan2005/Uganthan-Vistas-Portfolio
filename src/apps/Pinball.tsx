"use client";

import React from "react";

export default function Pinball() {
  return (
    <div className="w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <iframe
        src="/pinball/index.html"
        title="3D Space Cadet Pinball"
        className="w-full h-full border-none"
        style={{ maxWidth: "600px", maxHeight: "430px" }}
        scrolling="no"
      />
    </div>
  );
}

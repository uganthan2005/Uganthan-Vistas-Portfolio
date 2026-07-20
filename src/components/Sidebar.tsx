"use client";

import React from "react";
import AnalogClock from "@/gadgets/AnalogClock";
import SkillsGauge from "@/gadgets/SkillsGauge";
import StickyNotes from "@/gadgets/StickyNotes";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <AnalogClock />
      <SkillsGauge />
      <StickyNotes />
    </div>
  );
}

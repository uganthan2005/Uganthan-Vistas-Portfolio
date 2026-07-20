"use client";

import React from "react";

interface SkillData {
  label: string;
  value: number;
  color: string;
}

const skills: SkillData[] = [
  { label: "Python", value: 90, color: "#3b82f6" },
  { label: "Next.js", value: 82, color: "#8b5cf6" },
  { label: "Supabase", value: 75, color: "#10b981" },
  { label: "C++", value: 78, color: "#f59e0b" },
  { label: "Docker", value: 70, color: "#06b6d4" },
];

function GaugeDial({ skill }: { skill: SkillData }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (skill.value / 100) * circumference * 0.75;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Background arc */}
        <circle
          cx="40"
          cy="44"
          r="36"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={0}
          transform="rotate(135, 40, 44)"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <circle
          cx="40"
          cy="44"
          r="36"
          fill="none"
          stroke={skill.color}
          strokeWidth="6"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={offset}
          transform="rotate(135, 40, 44)"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${skill.color}60)`,
            transition: "stroke-dashoffset 1s ease",
          }}
        />
        {/* Value text */}
        <text
          x="40"
          y="40"
          textAnchor="middle"
          fill="rgba(255,255,255,0.9)"
          fontSize="14"
          fontWeight="600"
          fontFamily="Segoe UI, sans-serif"
        >
          {skill.value}%
        </text>
      </svg>
      <span
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.7)",
          fontWeight: 500,
        }}
      >
        {skill.label}
      </span>
    </div>
  );
}

export default function SkillsGauge() {
  return (
    <div className="gadget-card">
      <div className="gadget-title">Resource Monitor — Skills</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          justifyItems: "center",
        }}
      >
        {skills.map((skill) => (
          <GaugeDial key={skill.label} skill={skill} />
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AnalogClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 220;
    const center = size / 2;
    const radius = center - 12;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Clock face
    const gradient = ctx.createRadialGradient(
      center, center, 0,
      center, center, radius
    );
    gradient.addColorStop(0, "rgba(30, 30, 40, 0.9)");
    gradient.addColorStop(0.85, "rgba(20, 20, 30, 0.95)");
    gradient.addColorStop(1, "rgba(10, 10, 15, 1)");
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100, 160, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const isMain = i % 3 === 0;
      const startR = radius - (isMain ? 18 : 12);
      const endR = radius - 6;
      ctx.beginPath();
      ctx.moveTo(
        center + startR * Math.cos(angle),
        center + startR * Math.sin(angle)
      );
      ctx.lineTo(
        center + endR * Math.cos(angle),
        center + endR * Math.sin(angle)
      );
      ctx.strokeStyle = isMain
        ? "rgba(200, 220, 255, 0.9)"
        : "rgba(150, 170, 200, 0.5)";
      ctx.lineWidth = isMain ? 2.5 : 1;
      ctx.stroke();
    }

    // Minute markers
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i * Math.PI) / 30 - Math.PI / 2;
      const r = radius - 6;
      ctx.beginPath();
      ctx.arc(
        center + r * Math.cos(angle),
        center + r * Math.sin(angle),
        1,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(100, 130, 170, 0.3)";
      ctx.fill();
    }

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Hour hand
    const hourAngle =
      ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + (radius * 0.5) * Math.cos(hourAngle),
      center + (radius * 0.5) * Math.sin(hourAngle)
    );
    ctx.strokeStyle = "rgba(200, 220, 255, 0.9)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // Minute hand
    const minuteAngle =
      ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + (radius * 0.7) * Math.cos(minuteAngle),
      center + (radius * 0.7) * Math.sin(minuteAngle)
    );
    ctx.strokeStyle = "rgba(180, 200, 240, 0.85)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Second hand
    const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + (radius * 0.8) * Math.cos(secondAngle),
      center + (radius * 0.8) * Math.sin(secondAngle)
    );
    ctx.strokeStyle = "rgba(100, 180, 255, 0.8)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100, 180, 255, 0.9)";
    ctx.fill();
  });

  return (
    <div className="gadget-card" style={{ padding: 8, textAlign: "center" }}>
      <div className="gadget-title">System Clock</div>
      <canvas
        ref={canvasRef}
        style={{
          width: 220,
          height: 220,
          margin: "0 auto",
          display: "block",
        }}
      />
    </div>
  );
}

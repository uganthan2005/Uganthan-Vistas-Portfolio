"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type Tool = "pencil" | "brush" | "eraser" | "fill" | "line" | "rectangle" | "ellipse";

interface Point {
  x: number;
  y: number;
}

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const TOOLS: { id: Tool; icon: string; label: string }[] = [
  { id: "pencil", icon: "✏️", label: "Pencil" },
  { id: "brush", icon: "🖌️", label: "Brush" },
  { id: "eraser", icon: "🧽", label: "Eraser" },
  { id: "fill", icon: "🪣", label: "Fill" },
  { id: "line", icon: "➖", label: "Line" },
  { id: "rectangle", icon: "▭", label: "Rectangle" },
  { id: "ellipse", icon: "⬭", label: "Ellipse" },
];

const COLOR_PALETTE = [
  // Row 1
  "#000000", "#FFFFFF", "#FF0000", "#FF8C00",
  "#FFFF00", "#00CC00", "#00CCCC", "#0000FF",
  // Row 2
  "#800080", "#FF69B4", "#8B4513", "#808080",
  "#8B0000", "#006400", "#00008B", "#000080",
];

/* ═══════════════════════════════════════════
   FLOOD FILL (scanline)
   ═══════════════════════════════════════════ */

function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: string,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Parse fill color
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 1;
  tempCanvas.height = 1;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.fillStyle = fillColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const fillRgb = tempCtx.getImageData(0, 0, 1, 1).data;

  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

  const startIdx = (sy * width + sx) * 4;
  const targetR = data[startIdx];
  const targetG = data[startIdx + 1];
  const targetB = data[startIdx + 2];
  const targetA = data[startIdx + 3];

  // Don't fill if the target color is the same as fill color
  if (
    targetR === fillRgb[0] &&
    targetG === fillRgb[1] &&
    targetB === fillRgb[2] &&
    targetA === fillRgb[3]
  ) {
    return;
  }

  const tolerance = 10;

  function matchesTarget(idx: number): boolean {
    return (
      Math.abs(data[idx] - targetR) <= tolerance &&
      Math.abs(data[idx + 1] - targetG) <= tolerance &&
      Math.abs(data[idx + 2] - targetB) <= tolerance &&
      Math.abs(data[idx + 3] - targetA) <= tolerance
    );
  }

  function setPixel(idx: number) {
    data[idx] = fillRgb[0];
    data[idx + 1] = fillRgb[1];
    data[idx + 2] = fillRgb[2];
    data[idx + 3] = 255;
  }

  const stack: [number, number][] = [[sx, sy]];
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const [cx, cy] = stack.pop()!;
    const pixelIdx = cy * width + cx;
    if (visited[pixelIdx]) continue;

    const dataIdx = pixelIdx * 4;
    if (!matchesTarget(dataIdx)) continue;

    // Scan left
    let leftX = cx;
    while (leftX > 0 && matchesTarget(((cy * width + leftX - 1) * 4))) {
      leftX--;
    }

    // Scan right
    let rightX = cx;
    while (rightX < width - 1 && matchesTarget(((cy * width + rightX + 1) * 4))) {
      rightX++;
    }

    // Fill the span
    for (let x = leftX; x <= rightX; x++) {
      const idx = (cy * width + x) * 4;
      setPixel(idx);
      visited[cy * width + x] = 1;

      // Check above
      if (cy > 0) {
        const abovePixel = cy - 1;
        const aboveIdx = (abovePixel * width + x) * 4;
        if (!visited[abovePixel * width + x] && matchesTarget(aboveIdx)) {
          stack.push([x, abovePixel]);
        }
      }

      // Check below
      if (cy < height - 1) {
        const belowPixel = cy + 1;
        const belowIdx = (belowPixel * width + x) * 4;
        if (!visited[belowPixel * width + x] && matchesTarget(belowIdx)) {
          stack.push([x, belowPixel]);
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function MsPaint() {
  /* ── State ── */
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPos, setCursorPos] = useState<Point>({ x: 0, y: 0 });

  /* ── Refs ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const overlayCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const startPointRef = useRef<Point>({ x: 0, y: 0 });
  const lastPointRef = useRef<Point>({ x: 0, y: 0 });

  /* ── Canvas Initialization & Resize ── */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!container || !canvas || !overlay) return;

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      // Only resize if dimensions actually changed
      if (canvas.width === w && canvas.height === h) return;

      // Save current image data before resizing
      let existingData: ImageData | null = null;
      const ctx = canvas.getContext("2d");
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        existingData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      canvas.width = w;
      canvas.height = h;
      overlay.width = w;
      overlay.height = h;

      const mainCtx = canvas.getContext("2d")!;
      const overCtx = overlay.getContext("2d")!;

      // Fill with white
      mainCtx.fillStyle = "#FFFFFF";
      mainCtx.fillRect(0, 0, w, h);

      // Restore previous content if available
      if (existingData) {
        mainCtx.putImageData(existingData, 0, 0);
      }

      ctxRef.current = mainCtx;
      overlayCtxRef.current = overCtx;
    };

    initCanvas();

    const observer = new ResizeObserver(() => {
      initCanvas();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  /* ── Drawing Helpers ── */
  const getCanvasPoint = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const getDrawColor = useCallback(() => {
    return selectedTool === "eraser" ? "#FFFFFF" : selectedColor;
  }, [selectedTool, selectedColor]);

  const getDrawSize = useCallback(() => {
    if (selectedTool === "brush") return brushSize * 2.5;
    if (selectedTool === "eraser") return brushSize * 3;
    return brushSize;
  }, [selectedTool, brushSize]);

  const drawLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      from: Point,
      to: Point,
      color: string,
      size: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    },
    []
  );

  /* ── Mouse Handlers ── */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = getCanvasPoint(e);
      const ctx = ctxRef.current;
      if (!ctx) return;

      setIsDrawing(true);
      startPointRef.current = point;
      lastPointRef.current = point;

      if (selectedTool === "fill") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        floodFill(ctx, point.x, point.y, selectedColor, canvas.width, canvas.height);
        setIsDrawing(false);
        return;
      }

      if (selectedTool === "pencil" || selectedTool === "brush" || selectedTool === "eraser") {
        // Draw a dot at the starting point
        ctx.beginPath();
        ctx.fillStyle = getDrawColor();
        ctx.arc(point.x, point.y, getDrawSize() / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (selectedTool === "line" || selectedTool === "rectangle" || selectedTool === "ellipse") {
        // Save canvas snapshot for shape preview
        const canvas = canvasRef.current;
        if (canvas) {
          snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }
    },
    [selectedTool, selectedColor, getCanvasPoint, getDrawColor, getDrawSize]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = getCanvasPoint(e);
      setCursorPos({ x: Math.round(point.x), y: Math.round(point.y) });

      if (!isDrawing) return;

      const ctx = ctxRef.current;
      const overlayCtx = overlayCtxRef.current;
      if (!ctx) return;

      if (selectedTool === "pencil" || selectedTool === "brush" || selectedTool === "eraser") {
        drawLine(ctx, lastPointRef.current, point, getDrawColor(), getDrawSize());
        lastPointRef.current = point;
        return;
      }

      // Shape tools — draw preview on overlay
      if (!overlayCtx) return;
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;

      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

      const start = startPointRef.current;
      overlayCtx.strokeStyle = selectedColor;
      overlayCtx.lineWidth = brushSize;
      overlayCtx.lineCap = "round";
      overlayCtx.lineJoin = "round";

      if (selectedTool === "line") {
        overlayCtx.beginPath();
        overlayCtx.moveTo(start.x, start.y);
        overlayCtx.lineTo(point.x, point.y);
        overlayCtx.stroke();
      } else if (selectedTool === "rectangle") {
        const w = point.x - start.x;
        const h = point.y - start.y;
        overlayCtx.beginPath();
        overlayCtx.strokeRect(start.x, start.y, w, h);
      } else if (selectedTool === "ellipse") {
        const cx = (start.x + point.x) / 2;
        const cy = (start.y + point.y) / 2;
        const rx = Math.abs(point.x - start.x) / 2;
        const ry = Math.abs(point.y - start.y) / 2;
        overlayCtx.beginPath();
        overlayCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        overlayCtx.stroke();
      }
    },
    [
      isDrawing,
      selectedTool,
      selectedColor,
      brushSize,
      getCanvasPoint,
      getDrawColor,
      getDrawSize,
      drawLine,
    ]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const ctx = ctxRef.current;
      const overlayCtx = overlayCtxRef.current;
      const overlay = overlayCanvasRef.current;
      if (!ctx) return;

      if (selectedTool === "line" || selectedTool === "rectangle" || selectedTool === "ellipse") {
        const point = getCanvasPoint(e);
        const start = startPointRef.current;

        // Restore snapshot first to remove any preview artifacts that bled through
        if (snapshotRef.current) {
          ctx.putImageData(snapshotRef.current, 0, 0);
        }

        // Draw final shape on main canvas
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (selectedTool === "line") {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        } else if (selectedTool === "rectangle") {
          const w = point.x - start.x;
          const h = point.y - start.y;
          ctx.beginPath();
          ctx.strokeRect(start.x, start.y, w, h);
        } else if (selectedTool === "ellipse") {
          const cx = (start.x + point.x) / 2;
          const cy = (start.y + point.y) / 2;
          const rx = Math.abs(point.x - start.x) / 2;
          const ry = Math.abs(point.y - start.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Clear overlay
        if (overlayCtx && overlay) {
          overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        }

        snapshotRef.current = null;
      }
    },
    [isDrawing, selectedTool, selectedColor, brushSize, getCanvasPoint]
  );

  const handleMouseLeave = useCallback(() => {
    if (isDrawing && (selectedTool === "pencil" || selectedTool === "brush" || selectedTool === "eraser")) {
      setIsDrawing(false);
    }
  }, [isDrawing, selectedTool]);

  /* ── Actions ── */
  const handleClear = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "painting.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  /* ── Cursor style based on tool ── */
  const getCursorStyle = (): string => {
    switch (selectedTool) {
      case "pencil":
        return "crosshair";
      case "brush":
        return "crosshair";
      case "eraser":
        return "cell";
      case "fill":
        return "cell";
      case "line":
      case "rectangle":
      case "ellipse":
        return "crosshair";
      default:
        return "default";
    }
  };

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */

  return (
    <div
      className="flex flex-col h-full w-full select-none"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", background: "#f0f0f0" }}
    >
      {/* ── Toolbar ── */}
      <div className="paint-toolbar">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`paint-tool-btn ${selectedTool === tool.id ? "paint-tool-btn-active" : ""}`}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        {/* Separator */}
        <div
          className="mx-1"
          style={{
            width: 1,
            height: 22,
            background: "#bbb",
          }}
        />

        {/* Brush Size */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-xs text-gray-600" style={{ fontSize: 11 }}>
            Size:
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 h-3"
            style={{ accentColor: "#4a90d9" }}
            title={`Brush size: ${brushSize}px`}
          />
          <span
            className="text-xs text-gray-600 tabular-nums"
            style={{ fontSize: 11, minWidth: 20, textAlign: "right" }}
          >
            {brushSize}px
          </span>
        </div>

        {/* Separator */}
        <div
          className="mx-1"
          style={{
            width: 1,
            height: 22,
            background: "#bbb",
          }}
        />

        {/* Clear & Save */}
        <button
          className="paint-tool-btn"
          onClick={handleClear}
          title="Clear Canvas"
          style={{ fontSize: 14 }}
        >
          🗑️
        </button>
        <button
          className="paint-tool-btn"
          onClick={handleSave}
          title="Save as PNG"
          style={{ fontSize: 14 }}
        >
          💾
        </button>
      </div>

      {/* ── Color Palette ── */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 flex-wrap"
        style={{
          background: "linear-gradient(180deg, #eaeaea 0%, #ddd 100%)",
          borderBottom: "1px solid #bbb",
        }}
      >
        {/* Current color preview */}
        <div
          className="mr-2 flex-shrink-0"
          style={{
            width: 28,
            height: 28,
            border: "2px solid #555",
            borderRadius: 3,
            background: selectedColor,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
          }}
          title={`Current color: ${selectedColor}`}
        />

        {/* Color swatches */}
        <div className="flex flex-wrap gap-0.5">
          {COLOR_PALETTE.slice(0, 8).map((color) => (
            <button
              key={color}
              className={`paint-color-swatch ${selectedColor === color ? "paint-color-swatch-active" : ""}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-0.5 ml-0.5">
          {COLOR_PALETTE.slice(8).map((color) => (
            <button
              key={color}
              className={`paint-color-swatch ${selectedColor === color ? "paint-color-swatch-active" : ""}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* ── Canvas Area ── */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{
          background: "#c0c0c0",
          borderTop: "1px solid #aaa",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ display: "block" }}
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0"
          style={{ display: "block", cursor: getCursorStyle() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* ── Status Bar ── */}
      <div
        className="flex items-center px-3 gap-4"
        style={{
          height: 22,
          background: "linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)",
          borderTop: "1px solid #bbb",
          fontSize: 11,
          color: "#555",
        }}
      >
        <span className="tabular-nums">
          {cursorPos.x}, {cursorPos.y}px
        </span>
        <span style={{ color: "#999" }}>|</span>
        <span className="capitalize">{selectedTool}</span>
        <span style={{ color: "#999" }}>|</span>
        <span>Size: {brushSize}px</span>
      </div>
    </div>
  );
}

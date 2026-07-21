"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type Tool = "free-select" | "select" | "eraser" | "fill" | "pick" | "magnifier" | "pencil" | "brush" | "airbrush" | "text" | "line" | "curve" | "rectangle" | "polygon" | "ellipse" | "round-rect";

interface Point {
  x: number;
  y: number;
}

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const TOOLS: { id: Tool; icon: string; label: string }[] = [
  { id: "free-select", icon: "⚝", label: "Free-Form Select" },
  { id: "select", icon: "⬚", label: "Select" },
  { id: "eraser", icon: "🧽", label: "Eraser" },
  { id: "fill", icon: "🪣", label: "Fill With Color" },
  { id: "pick", icon: "💧", label: "Pick Color" },
  { id: "magnifier", icon: "🔍", label: "Magnifier" },
  { id: "pencil", icon: "✏️", label: "Pencil" },
  { id: "brush", icon: "🖌️", label: "Brush" },
  { id: "airbrush", icon: "💨", label: "Airbrush" },
  { id: "text", icon: "A", label: "Text" },
  { id: "line", icon: "＼", label: "Line" },
  { id: "curve", icon: "〰", label: "Curve" },
  { id: "rectangle", icon: "▭", label: "Rectangle" },
  { id: "polygon", icon: "⬠", label: "Polygon" },
  { id: "ellipse", icon: "⬭", label: "Ellipse" },
  { id: "round-rect", icon: "▢", label: "Rounded Rectangle" },
];

const COLOR_PALETTE = [
  // Row 1
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080FF", "#004080", "#8000FF", "#804000",
  // Row 2
  "#FFFFFF", "#C0C0C0", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FFFF80", "#00FF80", "#80FFFF", "#8080FF", "#FF0080", "#FF8040",
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
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF"); // Right click color
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

      // Fill with white if no existing data
      if (!existingData) {
        mainCtx.fillStyle = "#FFFFFF";
        mainCtx.fillRect(0, 0, w, h);
      } else {
        mainCtx.fillStyle = "#FFFFFF";
        mainCtx.fillRect(0, 0, w, h); // Fill expanded areas with white
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

  const getDrawColor = useCallback((isRightClick: boolean = false) => {
    if (selectedTool === "eraser") return secondaryColor; // Eraser uses secondary color
    return isRightClick ? secondaryColor : selectedColor;
  }, [selectedTool, selectedColor, secondaryColor]);

  const getDrawSize = useCallback(() => {
    if (selectedTool === "brush") return brushSize * 2.5;
    if (selectedTool === "eraser") return brushSize * 4;
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

      const isRightClick = e.button === 2;
      setIsDrawing(true);
      startPointRef.current = point;
      lastPointRef.current = point;

      const currentColor = getDrawColor(isRightClick);

      if (selectedTool === "fill") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        floodFill(ctx, point.x, point.y, currentColor, canvas.width, canvas.height);
        setIsDrawing(false);
        return;
      }

      if (selectedTool === "pick") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
        const hex = "#" + ("000000" + ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6);
        if (isRightClick) {
          setSecondaryColor(hex.toUpperCase());
        } else {
          setSelectedColor(hex.toUpperCase());
        }
        setIsDrawing(false);
        return;
      }

      if (selectedTool === "pencil" || selectedTool === "brush" || selectedTool === "eraser") {
        ctx.beginPath();
        ctx.fillStyle = currentColor;
        ctx.arc(point.x, point.y, getDrawSize() / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (["line", "rectangle", "ellipse", "round-rect"].includes(selectedTool)) {
        const canvas = canvasRef.current;
        if (canvas) {
          snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }
    },
    [selectedTool, selectedColor, secondaryColor, getCanvasPoint, getDrawColor, getDrawSize]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = getCanvasPoint(e);
      setCursorPos({ x: Math.round(point.x), y: Math.round(point.y) });

      if (!isDrawing) return;

      const ctx = ctxRef.current;
      const overlayCtx = overlayCtxRef.current;
      if (!ctx) return;

      const isRightClick = e.buttons === 2;
      const currentColor = getDrawColor(isRightClick);

      if (selectedTool === "pencil" || selectedTool === "brush" || selectedTool === "eraser") {
        drawLine(ctx, lastPointRef.current, point, currentColor, getDrawSize());
        lastPointRef.current = point;
        return;
      }

      if (!overlayCtx) return;
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;

      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

      const start = startPointRef.current;
      overlayCtx.strokeStyle = currentColor;
      overlayCtx.fillStyle = currentColor;
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
      } else if (selectedTool === "round-rect") {
        const w = point.x - start.x;
        const h = point.y - start.y;
        overlayCtx.beginPath();
        overlayCtx.roundRect(start.x, start.y, w, h, 8);
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

      if (["line", "rectangle", "ellipse", "round-rect"].includes(selectedTool)) {
        const point = getCanvasPoint(e);
        const start = startPointRef.current;
        const isRightClick = e.button === 2;
        const currentColor = getDrawColor(isRightClick);

        if (snapshotRef.current) {
          ctx.putImageData(snapshotRef.current, 0, 0);
        }

        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
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
        } else if (selectedTool === "round-rect") {
          const w = point.x - start.x;
          const h = point.y - start.y;
          ctx.beginPath();
          ctx.roundRect(start.x, start.y, w, h, 8);
          ctx.stroke();
        }

        if (overlayCtx && overlay) {
          overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        }

        snapshotRef.current = null;
      }
    },
    [isDrawing, selectedTool, selectedColor, brushSize, getCanvasPoint, getDrawColor]
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

  /* ── Cursor style based on tool ── */
  const getCursorStyle = (): string => {
    switch (selectedTool) {
      case "pencil": return "crosshair";
      case "brush": return "crosshair";
      case "eraser": return "cell";
      case "fill": return "cell";
      case "pick": return "crosshair";
      case "magnifier": return "zoom-in";
      case "line":
      case "rectangle":
      case "ellipse":
      case "round-rect":
      case "polygon":
      case "curve":
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
      {/* ── 1. Top Menu Bar ── */}
      <div 
        className="flex items-center px-1"
        style={{ 
          height: 20, 
          background: "#ece9d8", 
          borderBottom: "1px solid #d4d0c8",
          fontSize: 11,
          color: "#000"
        }}
      >
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>F</u>ile</span>
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>E</u>dit</span>
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>V</u>iew</span>
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>I</u>mage</span>
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>C</u>olors</span>
        <span className="px-2 py-0.5 hover:bg-blue-100 hover:text-black cursor-pointer rounded-sm"><u>H</u>elp</span>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ background: "#d4d0c8" }}>
        {/* ── 2. Left Toolbar Column ── */}
        <div 
          className="flex flex-col items-center p-1"
          style={{ 
            width: 58, 
            background: "#d4d0c8",
            borderRight: "1px solid #808080"
          }}
        >
          {/* Tool Grid (2 cols) */}
          <div className="flex flex-wrap gap-0.5 justify-center" style={{ width: 50 }}>
            {TOOLS.map((tool) => {
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  title={tool.label}
                  style={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive ? "#d4d0c8" : "#d4d0c8",
                    border: isActive ? "1px solid #000" : "1px solid transparent",
                    boxShadow: isActive ? "inset 1px 1px 0px #fff, inset -1px -1px 0px #808080" : "inset -1px -1px 0px #404040, inset 1px 1px 0px #ffffff",
                    fontSize: 12,
                    padding: 0,
                    margin: 0,
                    outline: "none"
                  }}
                >
                  <span style={{ 
                    transform: isActive ? "translate(1px, 1px)" : "none",
                    filter: "grayscale(100%) contrast(200%)" // Mimic old pixel icons if emojis are used
                  }}>
                    {tool.icon}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Properties Box (Brush size etc) */}
          <div 
            className="mt-2 w-10 h-16 flex flex-col items-center justify-center gap-1"
            style={{ 
              background: "#fff",
              border: "1px solid #808080",
              boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff"
            }}
          >
            {/* Simple representation of brush size options */}
            <div 
              onClick={() => setBrushSize(2)} 
              style={{ width: 24, height: 8, background: brushSize === 2 ? "#000080" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <div style={{ width: 18, height: 2, background: brushSize === 2 ? "#fff" : "#000" }} />
            </div>
            <div 
              onClick={() => setBrushSize(4)} 
              style={{ width: 24, height: 8, background: brushSize === 4 ? "#000080" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <div style={{ width: 18, height: 4, background: brushSize === 4 ? "#fff" : "#000" }} />
            </div>
            <div 
              onClick={() => setBrushSize(8)} 
              style={{ width: 24, height: 8, background: brushSize === 8 ? "#000080" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <div style={{ width: 18, height: 8, background: brushSize === 8 ? "#fff" : "#000" }} />
            </div>
          </div>
        </div>

        {/* ── 3. Main Editor Area ── */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "#808080" }}>
          
          {/* Top Color Palette */}
          <div 
            className="flex items-center px-2 py-1"
            style={{ 
              height: 48,
              background: "#d4d0c8",
              borderBottom: "1px solid #808080",
              borderLeft: "1px solid #fff"
            }}
          >
            {/* Active Colors Box */}
            <div 
              className="relative mr-2"
              style={{ 
                width: 32, 
                height: 32, 
                background: "#d4d0c8",
                border: "1px solid #808080",
                boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff"
              }}
            >
              {/* Secondary Color (Background) */}
              <div 
                style={{
                  position: "absolute",
                  right: 2,
                  bottom: 2,
                  width: 14,
                  height: 14,
                  background: secondaryColor,
                  border: "1px solid #808080",
                  boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff"
                }}
              />
              {/* Primary Color (Foreground) */}
              <div 
                style={{
                  position: "absolute",
                  left: 2,
                  top: 2,
                  width: 14,
                  height: 14,
                  background: selectedColor,
                  border: "1px solid #808080",
                  boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff",
                  zIndex: 2
                }}
              />
            </div>

            {/* Swatches Grid */}
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {COLOR_PALETTE.slice(0, 14).map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    onContextMenu={(e) => { e.preventDefault(); setSecondaryColor(color); }}
                    style={{
                      width: 16,
                      height: 16,
                      background: color,
                      border: "1px solid #808080",
                      boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff"
                    }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex gap-0.5">
                {COLOR_PALETTE.slice(14).map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    onContextMenu={(e) => { e.preventDefault(); setSecondaryColor(color); }}
                    style={{
                      width: 16,
                      height: 16,
                      background: color,
                      border: "1px solid #808080",
                      boxShadow: "inset 1px 1px 0px #404040, 1px 1px 0px #fff"
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <div 
            className="flex-1 overflow-auto p-1 relative"
            style={{ 
              background: "#808080", 
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.5)",
              // Mimic the checkered transparent background (though canvas will fill white)
              backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
            }}
          >
            <div 
              ref={containerRef}
              style={{ 
                width: 800, // Fixed size canvas or min size, let's make it fill mostly but have clear bounds
                height: 600,
                background: "#fff",
                position: "relative",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.5)"
              }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ display: "block" }}
                onContextMenu={(e) => e.preventDefault()}
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0"
                style={{ display: "block", cursor: getCursorStyle() }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Bottom Status Bar ── */}
      <div 
        className="flex items-center px-2"
        style={{ 
          height: 22, 
          background: "#ece9d8", 
          borderTop: "1px solid #fff",
          fontSize: 11,
          color: "#000"
        }}
      >
        <div style={{ flex: 1, borderRight: "1px solid #d4d0c8", paddingRight: 8 }}>
          For Help, click Help Topics on the Help Menu.
        </div>
        <div style={{ width: 120, paddingLeft: 8, borderLeft: "1px solid #fff", borderRight: "1px solid #d4d0c8", paddingRight: 8 }}>
          {cursorPos.x}, {cursorPos.y}
        </div>
        <div style={{ width: 120, paddingLeft: 8, borderLeft: "1px solid #fff" }}>
          
        </div>
      </div>
    </div>
  );
}

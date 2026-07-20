"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

type GameState = "idle" | "playing" | "won" | "lost";

const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;

const NUMBER_COLORS: Record<number, string> = {
  1: "#0000FF",
  2: "#008000",
  3: "#FF0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

/* ═══════════════════════════════════════════
   BOARD GENERATION HELPERS
   ═══════════════════════════════════════════ */

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  );
}

function placeMines(
  board: Cell[][],
  safeRow: number,
  safeCol: number
): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;

  // Collect all safe positions (safe zone = the clicked cell + its 8 neighbors)
  const safeSet = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeRow + dr;
      const nc = safeCol + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        safeSet.add(`${nr},${nc}`);
      }
    }
  }

  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!newBoard[r][c].isMine && !safeSet.has(`${r},${c}`)) {
      newBoard[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].neighborCount = count;
    }
  }

  return newBoard;
}

/* ═══════════════════════════════════════════
   FLOOD FILL (CASCADE REVEAL)
   ═══════════════════════════════════════════ */

function floodReveal(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) continue;
    if (newBoard[r][c].isMine) continue;

    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }

  return newBoard;
}

function checkWin(board: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].isMine && !board[r][c].isRevealed) {
        return false;
      }
    }
  }
  return true;
}

function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map((row) =>
    row.map((cell) =>
      cell.isMine ? { ...cell, isRevealed: true } : cell
    )
  );
}

/* ═══════════════════════════════════════════
   LED DIGIT DISPLAY
   ═══════════════════════════════════════════ */

function LedDisplay({ value }: { value: number }) {
  const clamped = Math.max(-99, Math.min(999, value));
  const display = clamped < 0
    ? "-" + String(Math.abs(clamped)).padStart(2, "0")
    : String(clamped).padStart(3, "0");

  return (
    <div
      style={{
        background: "#000",
        color: "#FF0000",
        fontFamily: "'Consolas', 'Courier New', monospace",
        fontSize: 22,
        fontWeight: "bold",
        letterSpacing: 2,
        padding: "2px 4px",
        minWidth: 52,
        textAlign: "center",
        border: "1px solid #808080",
        borderRight: "1px solid #fff",
        borderBottom: "1px solid #fff",
        lineHeight: "26px",
      }}
    >
      {display}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINESWEEPER COMPONENT
   ═══════════════════════════════════════════ */

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timer, setTimer] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [clickedMine, setClickedMine] = useState<{ r: number; c: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Count flags for mine counter display
  const flagCount = board.reduce(
    (acc, row) => acc + row.reduce((a, cell) => a + (cell.isFlagged ? 1 : 0), 0),
    0
  );
  const minesRemaining = MINE_COUNT - flagCount;

  /* ─── Timer logic ────────────────────── */

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => (t < 999 ? t + 1 : t));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  /* ─── Reset ──────────────────────────── */

  const resetGame = useCallback(() => {
    stopTimer();
    setBoard(createEmptyBoard());
    setGameState("idle");
    setTimer(0);
    setIsMouseDown(false);
    setClickedMine(null);
  }, [stopTimer]);

  /* ─── Left click (reveal) ────────────── */

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState === "won" || gameState === "lost") return;

      const cell = board[row][col];
      if (cell.isRevealed || cell.isFlagged) return;

      let currentBoard = board;

      // First click: place mines (never on clicked cell or its neighbors)
      if (gameState === "idle") {
        currentBoard = placeMines(currentBoard, row, col);
        setGameState("playing");
        startTimer();
      }

      // Check if mine
      if (currentBoard[row][col].isMine) {
        const revealedBoard = revealAllMines(currentBoard);
        // Remove flags from non-mine cells (show wrong flags)
        const finalBoard = revealedBoard.map((r) =>
          r.map((c) => ({
            ...c,
            // Incorrect flags stay visible for display
          }))
        );
        setBoard(finalBoard);
        setGameState("lost");
        setClickedMine({ r: row, c: col });
        stopTimer();
        return;
      }

      // Reveal with flood fill
      const newBoard = floodReveal(currentBoard, row, col);
      setBoard(newBoard);

      // Check win
      if (checkWin(newBoard)) {
        // Auto-flag all remaining mines on win
        const wonBoard = newBoard.map((r) =>
          r.map((c) => (c.isMine ? { ...c, isFlagged: true } : c))
        );
        setBoard(wonBoard);
        setGameState("won");
        stopTimer();
      }
    },
    [board, gameState, startTimer, stopTimer]
  );

  /* ─── Right click (flag) ─────────────── */

  const handleCellRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameState === "won" || gameState === "lost" || gameState === "idle") return;

      const cell = board[row][col];
      if (cell.isRevealed) return;

      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      setBoard(newBoard);
    },
    [board, gameState]
  );

  /* ─── Smiley face ────────────────────── */

  const getSmiley = () => {
    if (gameState === "won") return "😎";
    if (gameState === "lost") return "💀";
    if (isMouseDown) return "😮";
    return "😊";
  };

  /* ─── Render a cell ──────────────────── */

  const renderCell = (cell: Cell, row: number, col: number) => {
    const isClickedMine = clickedMine?.r === row && clickedMine?.c === col;
    const size = 26;

    if (cell.isRevealed) {
      if (cell.isMine) {
        return (
          <div
            key={`${row}-${col}`}
            style={{
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isClickedMine ? "#FF0000" : "#c0c0c0",
              border: "1px solid #808080",
              fontSize: 14,
              lineHeight: 1,
              cursor: "default",
              boxSizing: "border-box",
            }}
          >
            💣
          </div>
        );
      }

      return (
        <div
          key={`${row}-${col}`}
          style={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#c0c0c0",
            border: "1px solid #808080",
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "'Segoe UI', Tahoma, sans-serif",
            color: cell.neighborCount > 0 ? NUMBER_COLORS[cell.neighborCount] : "transparent",
            cursor: "default",
            boxSizing: "border-box",
            lineHeight: 1,
          }}
        >
          {cell.neighborCount > 0 ? cell.neighborCount : ""}
        </div>
      );
    }

    // Unrevealed cell
    // If game is lost and cell is flagged but not a mine, show wrong flag
    const isWrongFlag = gameState === "lost" && cell.isFlagged && !cell.isMine;

    return (
      <div
        key={`${row}-${col}`}
        onMouseDown={() => {
          if (gameState !== "won" && gameState !== "lost") setIsMouseDown(true);
        }}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => handleCellRightClick(e, row, col)}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#c0c0c0",
          borderTop: "2px solid #fff",
          borderLeft: "2px solid #fff",
          borderRight: "2px solid #808080",
          borderBottom: "2px solid #808080",
          fontSize: 13,
          cursor: gameState === "won" || gameState === "lost" ? "default" : "pointer",
          boxSizing: "border-box",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {cell.isFlagged ? (isWrongFlag ? "❌" : "🚩") : ""}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#c0c0c0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        padding: 8,
        overflow: "auto",
      }}
    >
      {/* Outer raised border container */}
      <div
        style={{
          borderTop: "3px solid #fff",
          borderLeft: "3px solid #fff",
          borderRight: "3px solid #808080",
          borderBottom: "3px solid #808080",
          padding: 6,
          backgroundColor: "#c0c0c0",
        }}
      >
        {/* ═══ Top info bar (sunken panel) ═══ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderRight: "2px solid #fff",
            borderBottom: "2px solid #fff",
            padding: "4px 6px",
            marginBottom: 6,
            backgroundColor: "#c0c0c0",
          }}
        >
          {/* Mine counter */}
          <LedDisplay value={minesRemaining} />

          {/* Smiley reset button */}
          <button
            onClick={resetGame}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              width: 34,
              height: 34,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#c0c0c0",
              borderTop: "2px solid #fff",
              borderLeft: "2px solid #fff",
              borderRight: "2px solid #808080",
              borderBottom: "2px solid #808080",
              cursor: "pointer",
              outline: "none",
              padding: 0,
              lineHeight: 1,
            }}
            onMouseDownCapture={(e) => {
              const el = e.currentTarget;
              el.style.borderTop = "2px solid #808080";
              el.style.borderLeft = "2px solid #808080";
              el.style.borderRight = "2px solid #fff";
              el.style.borderBottom = "2px solid #fff";
            }}
            onMouseUpCapture={(e) => {
              const el = e.currentTarget;
              el.style.borderTop = "2px solid #fff";
              el.style.borderLeft = "2px solid #fff";
              el.style.borderRight = "2px solid #808080";
              el.style.borderBottom = "2px solid #808080";
            }}
            title="New Game"
          >
            {getSmiley()}
          </button>

          {/* Timer */}
          <LedDisplay value={timer} />
        </div>

        {/* ═══ Game grid (sunken panel) ═══ */}
        <div
          style={{
            borderTop: "3px solid #808080",
            borderLeft: "3px solid #808080",
            borderRight: "3px solid #fff",
            borderBottom: "3px solid #fff",
          }}
        >
          {board.map((row, rIdx) => (
            <div key={rIdx} style={{ display: "flex" }}>
              {row.map((cell, cIdx) => renderCell(cell, rIdx, cIdx))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

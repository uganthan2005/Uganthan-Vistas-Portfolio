"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import MatrixEffect from "@/components/MatrixEffect";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface OutputLine {
  id: number;
  text: string;
  /** If set, the line is a clickable link that triggers the security modal */
  linkUrl?: string;
}

/* ═══════════════════════════════════════════
   ASCII HEADER
   ═══════════════════════════════════════════ */

const ASCII_HEADER: string[] = [
  "",
  "  ╔══════════════════════════════════════════════════════════╗",
  "  ║                                                          ║",
  "  ║       █  █  █▀▀  █▀█  █▀█ ▀█▀ █  █  █▀█  █▄  █         ║",
  "  ║       █  █  █ ▄  █▀█  █ █  █  █▀▀█  █▀█  █ ▀▄█         ║",
  "  ║       ▀▀▀▀  ▀▀▀  ▀ ▀  ▀ ▀  ▀  ▀  ▀  ▀ ▀  ▀  ▀▀         ║",
  "  ║                                                          ║",
  "  ║              █▀█  █▀▀█  █▀▀█  ▀█▀  █▀▀  █▀▀█  █    █    ║",
  "  ║              █▀▀  █  █  █▀█▀   █   █▀   █  █  █    █    ║",
  "  ║              █    ▀▀▀▀  ▀  ▀▀   ▀   █    ▀▀▀▀  ▀▀▀  ▀▀▀  ║",
  "  ║                                                          ║",
  "  ║                  ▀▀▀  █▀▀█  █▀▀                          ║",
  "  ║                  █ █  ▀▀▀█  ▀▀█                          ║",
  "  ║                  ▀▀▀  ▀▀▀▀  ▀▀▀                          ║",
  "  ║                                                          ║",
  "  ║           UGANTHAN-M  PORTFOLIO  OS  [v1.0]              ║",
  "  ║                                                          ║",
  "  ╚══════════════════════════════════════════════════════════╝",
  "",
  '  Type "help" to see available commands.',
  "",
];

/* ═══════════════════════════════════════════
   COMMAND HANDLERS
   ═══════════════════════════════════════════ */

const HELP_OUTPUT: string[] = [
  "",
  "  Available commands:",
  "  ───────────────────────────────────────────────────────",
  "  help                 Display this help message",
  "  about                Learn more about Uganthan M",
  "  whoami               Display current user identity",
  "  resume               Download resume (PDF)",
  "  connect              Show contact & social links",
  "  projects             View project portfolio",
  "  matrix               Enter the Matrix",
  "  color <hex>          Change terminal text color",
  "  sudo hire uganthan   Elevate privileges and hire Uganthan",
  "  clear                Clear the terminal screen",
  "",
];

const ABOUT_OUTPUT: string[] = [
  "",
  "  Uganthan M — B.Tech AI & Data Science @ Chennai Institute of Technology",
  "               B.Sc Data Science @ IIT Madras",
  "",
  "  Passionate about building AI-powered tools, full-stack applications,",
  "  and beautiful user interfaces.",
  "",
  "  Currently exploring GenAI, RAG systems, and visual development",
  "  environments.",
  "",
];

interface ContactLink {
  label: string;
  url: string;
}

const CONTACT_LINKS: ContactLink[] = [
  { label: "Email", url: "mailto:uganthanmariappan@gmail.com" },
  { label: "GitHub", url: "https://github.com/uganthan2005" },
  { label: "LinkedIn", url: "https://linkedin.com/in/uganthanm" },
  { label: "LeetCode", url: "https://leetcode.com/u/uganthan_m/" },
  { label: "CodeChef", url: "https://www.codechef.com/users/uganthanmariappan" },
  { label: "Behance", url: "https://www.behance.net/uganthamariapp" },
  { label: "Letterboxd", url: "https://letterboxd.com/_Ben_10__/" },
];

const PROJECTS_OUTPUT: string[] = [
  "",
  "  ┌─────────────────────────────────────────────────────────────────┐",
  "  │  PROJECT PORTFOLIO                                              │",
  "  ├─────────────────────────────────────────────────────────────────┤",
  "  │                                                                 │",
  "  │  ► NodeCode IDE                                                 │",
  "  │    Visual development environment                               │",
  "  │    Tech: Next.js 15+, React Flow, ts-morph                      │",
  "  │                                                                 │",
  "  │  ► EchoLink                                                     │",
  "  │    Private Multi-Device Mesh Network                            │",
  "  │    Tech: C#/.NET 10, Tailscale, Go                              │",
  "  │                                                                 │",
  "  │  ► EEG Emotion Analysis                                         │",
  "  │    Deep Learning LSTM network                                   │",
  "  │    Tech: Python, TensorFlow                                     │",
  "  │                                                                 │",
  "  │  ► RAG Q&A System                                               │",
  "  │    PDF processing pipeline                                      │",
  "  │    Tech: Gemini, Supabase pgvector                              │",
  "  │                                                                 │",
  "  └─────────────────────────────────────────────────────────────────┘",
  "",
];



/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

let lineIdCounter = 0;
function nextId(): number {
  return ++lineIdCounter;
}

function textLines(lines: string[]): OutputLine[] {
  return lines.map((text) => ({ id: nextId(), text }));
}

export default function CommandPrompt() {
  const showSecurityModal = useDesktopStore((s) => s.showSecurityModal);
  const showDownloadModal = useDesktopStore((s) => s.showDownloadModal);

  const [output, setOutput] = useState<OutputLine[]>(() => textLines(ASCII_HEADER));
  const [input, setInput] = useState("");
  const [, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textColor, setTextColor] = useState("#cccccc");
  const [showMatrix, setShowMatrix] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  /* ── Focus input on mount & on click ── */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Execute command ── */
  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const cmd = trimmed.toLowerCase();

      // Echo the prompt + command
      const echoLine: OutputLine = { id: nextId(), text: `C:\\Users\\Uganthan> ${trimmed}` };

      let newLines: OutputLine[] = [echoLine];

      switch (cmd) {
        case "help":
          newLines = [...newLines, ...textLines(HELP_OUTPUT)];
          break;

        case "about":
          newLines = [...newLines, ...textLines(ABOUT_OUTPUT)];
          break;

        case "whoami":
          newLines = [
            ...newLines,
            { id: nextId(), text: "  Uganthan M — Student, AI engineer, Software developer, Graphic designer" },
            { id: nextId(), text: "" }
          ];
          break;

        case "sudo hire uganthan":
          newLines = [
            ...newLines,
            { id: nextId(), text: "  [sudo] authenticating..." },
            { id: nextId(), text: "  Access granted. Root privileges elevated." },
            { id: nextId(), text: "  Excellent choice! Connecting you to top talent..." },
            { id: nextId(), text: "" }
          ];
          break;

        case "matrix":
          setShowMatrix(true);
          return;

        case "resume": {
          newLines = [
            ...newLines,
            { id: nextId(), text: "" },
            { id: nextId(), text: "  Initiating resume download..." },
            { id: nextId(), text: "  ⚠  Windows Security: Verifying file source..." },
            { id: nextId(), text: "" },
          ];
          // Trigger download modal after a brief delay for visual effect
          setTimeout(() => {
            showDownloadModal("/resume.pdf", "UGANTHAN-M-Resume.pdf");
          }, 300);
          break;
        }

        case "connect": {
          const contactLines: OutputLine[] = [
            { id: nextId(), text: "" },
            { id: nextId(), text: "  ── Contact & Social Links ──" },
            { id: nextId(), text: "" },
          ];
          for (const link of CONTACT_LINKS) {
            contactLines.push({
              id: nextId(),
              text: `  ${link.label.padEnd(12)} ${link.url}`,
              linkUrl: link.url,
            });
          }
          contactLines.push({ id: nextId(), text: "" });
          newLines = [...newLines, ...contactLines];
          break;
        }

        case "projects":
          newLines = [...newLines, ...textLines(PROJECTS_OUTPUT)];
          break;

        case "clear":
          setOutput([]);
          return; // Don't append, just clear

        default:
          if (trimmed === "") {
            // Empty command — just add the echo
          } else if (cmd.startsWith("color ")) {
            const hex = cmd.split(" ")[1];
            if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
              setTextColor(hex);
              newLines = [...newLines, { id: nextId(), text: `  Terminal text color changed to ${hex}` }];
            } else {
              newLines = [...newLines, { id: nextId(), text: "  Invalid color format. Use hex (e.g. #00ff00)" }];
            }
          } else {
            newLines = [...newLines, { id: nextId(), text: `  '${trimmed}' is not recognized as an internal or external command,` }, { id: nextId(), text: "  operable program or batch file." }, { id: nextId(), text: "" }];
          }
          break;
      }

      setOutput((prev) => [...prev, ...newLines]);
    },
    [showDownloadModal],
  );

  /* ── Keyboard handler ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = input;
        executeCommand(cmd);

        // Add to history (skip empty and duplicates)
        if (cmd.trim()) {
          setHistory((prev) => {
            const filtered = prev.filter((h) => h !== cmd.trim());
            return [...filtered, cmd.trim()];
          });
        }

        setInput("");
        setHistoryIndex(-1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistory((prev) => {
          if (prev.length === 0) return prev;
          const newIndex =
            historyIndex === -1
              ? prev.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(prev[newIndex]);
          return prev;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistory((prev) => {
          if (prev.length === 0) return prev;
          if (historyIndex === -1) return prev;
          const newIndex = historyIndex + 1;
          if (newIndex >= prev.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(newIndex);
            setInput(prev[newIndex]);
          }
          return prev;
        });
      }
    },
    [input, historyIndex, executeCommand],
  );

  /* ── Handle link click ── */
  const handleLinkClick = useCallback(
    (url: string) => {
      showSecurityModal(url);
    },
    [showSecurityModal],
  );

  return (
    <div
      className="terminal-screen flex flex-col h-full select-text relative"
      ref={scrollRef}
      onClick={focusInput}
      style={{ color: textColor }}
    >
      {showMatrix && <MatrixEffect onComplete={() => setShowMatrix(false)} />}
      {/* ── Output Lines ── */}
      {output.map((line) => (
        <div key={line.id} className="whitespace-pre-wrap break-all">
          {line.linkUrl ? (
            <span>
              {"  "}
              {line.text.split(line.linkUrl)[0].trimStart().padEnd(13)}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLinkClick(line.linkUrl!);
                }}
                className="underline text-[#6cb6ff] hover:text-[#9dd3ff] cursor-pointer bg-transparent border-none p-0 font-[inherit] text-[inherit] text-left"
                style={{ fontSize: "inherit", fontFamily: "inherit" }}
              >
                {line.linkUrl}
              </button>
            </span>
          ) : (
            line.text
          )}
        </div>
      ))}

      {/* ── Input Line ── */}
      <div className="flex items-center shrink-0">
        <span className="whitespace-pre">C:\Users\Uganthan&gt; </span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal input"
          style={{ color: "inherit" }}
        />
        <span className="cursor-blink inline-block w-[8px] h-[16px] ml-px" style={{ backgroundColor: textColor }} />
      </div>
    </div>
  );
}

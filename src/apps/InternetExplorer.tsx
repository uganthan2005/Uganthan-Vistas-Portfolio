"use client";

import React, { useState } from "react";

/* ═══════════════════════════════════════════
   DATA – Projects
   ═══════════════════════════════════════════ */

interface ProjectTab {
  id: string;
  label: string;
  url: string;
  title: string;
  subtitle: string;
  description: string;
  tech: { name: string; color: string; bg: string }[];
  features: { text: string; highlight?: string }[];
}

const PROJECTS: ProjectTab[] = [
  {
    id: "nodecode",
    label: "NodeCode IDE",
    url: "http://projects.uganthan.dev/nodecode-ide",
    title: "NodeCode IDE",
    subtitle: "Visual Development Environment",
    description:
      "A bi-directional visual development environment that maps TypeScript codebases into interactive node graphs for real-time editing and AI-powered repository scaffolding.",
    tech: [
      { name: "Next.js 15+", color: "#fff", bg: "#000" },
      { name: "TypeScript", color: "#fff", bg: "#3178c6" },
      { name: "React Flow", color: "#fff", bg: "#ff0072" },
      { name: "Node.js", color: "#fff", bg: "#339933" },
      { name: "Prisma ORM", color: "#fff", bg: "#2d3748" },
      { name: "PostgreSQL", color: "#fff", bg: "#336791" },
      { name: "Docker", color: "#fff", bg: "#2496ed" },
      { name: "xterm.js", color: "#fff", bg: "#000" },
    ],
    features: [
      {
        text: "Single Source of Truth (SSoT) architecture using JSON schema and ts-morph for deterministic, corruption-free round-trip code synchronization",
        highlight: "SSoT Architecture",
      },
      {
        text: "Split-screen visual editor, WebSocket terminal, and two-stage AI pipeline for architecture-first code generation",
        highlight: "AI Pipeline",
      },
      {
        text: "70% faster onboarding: Reduced legacy codebase onboarding from weeks to hours with visual code mapping",
        highlight: "70% Faster",
      },
    ],
  },
  {
    id: "echolink",
    label: "EchoLink Mesh",
    url: "http://projects.uganthan.dev/echolink",
    title: "EchoLink Mesh Network",
    subtitle: "Private Multi-Device Mesh Networking",
    description:
      "Private multi-device mesh networking solution.",
    tech: [
      { name: "Avalonia", color: "#fff", bg: "#7b2bfc" },
      { name: "C#", color: "#fff", bg: "#239120" },
      { name: ".NET 10", color: "#fff", bg: "#512bd4" },
      { name: "SSH.NET", color: "#fff", bg: "#333" },
      { name: "Tailscale", color: "#fff", bg: "#0a1628" },
      { name: "Headscale", color: "#fff", bg: "#4a5568" },
      { name: "Go", color: "#fff", bg: "#00add8" },
    ],
    features: [
      {
        text: "C#/.NET 10 Macro engine supporting dual-mode (Terminal/GUI) execution on Windows and Linux, cutting administrative latency by 40%",
        highlight: "40% Latency Cut",
      },
      {
        text: "Real-time monitoring and camera sharing using asynchronous data streams with <100ms latency via WireGuard",
        highlight: "<100ms Latency",
      },
      {
        text: "Zero-trust P2P system using Tailscale and Go Android Bridge for 100% cloud-independent file and audio streaming",
        highlight: "Zero-Trust P2P",
      },
    ],
  },
  {
    id: "eeg",
    label: "EEG Analysis",
    url: "http://projects.uganthan.dev/eeg-analysis",
    title: "EEG Emotion Analysis",
    subtitle: "Deep Learning for EEG-Based Emotion Detection",
    description:
      "Deep learning model for EEG-based emotion detection.",
    tech: [
      { name: "Python", color: "#fff", bg: "#3776ab" },
      { name: "NumPy", color: "#fff", bg: "#4d77cf" },
      { name: "Pandas", color: "#fff", bg: "#150458" },
      { name: "Matplotlib", color: "#fff", bg: "#11557c" },
      { name: "MNE Python", color: "#fff", bg: "#c44e52" },
      { name: "Seaborn", color: "#fff", bg: "#444" },
      { name: "TensorFlow/Keras", color: "#fff", bg: "#ff6f00" },
      { name: "scikit-learn", color: "#fff", bg: "#f7931e" },
    ],
    features: [
      {
        text: "LSTM networks to capture temporal signal patterns",
        highlight: "LSTM Networks",
      },
      {
        text: "Data preprocessing and feature extraction pipelines for signal clarity",
        highlight: "Feature Extraction",
      },
      {
        text: "Benchmarked against KNN, Linear Regression, and other ML models",
        highlight: "ML Benchmarks",
      },
      {
        text: "~22% higher classification accuracy with LSTM over traditional approaches",
        highlight: "22% Higher Accuracy",
      },
    ],
  },
  {
    id: "rag",
    label: "RAG Q&A",
    url: "http://projects.uganthan.dev/rag-qa",
    title: "RAG Q&A System",
    subtitle: "End-to-End RAG Pipeline for Document Q&A",
    description:
      "End-to-end RAG pipeline for document-based Q&A.",
    tech: [
      { name: "Python", color: "#fff", bg: "#3776ab" },
      { name: "PyMuPDF", color: "#fff", bg: "#333" },
      { name: "Google Gemini API", color: "#fff", bg: "#4285f4" },
      { name: "Supabase", color: "#fff", bg: "#3ecf8e" },
      { name: "pgvector", color: "#fff", bg: "#336791" },
      { name: "NumPy", color: "#fff", bg: "#4d77cf" },
    ],
    features: [
      {
        text: "PDF extraction, chunking, and embedding using Gemini embeddings for semantic retrieval",
        highlight: "Semantic Retrieval",
      },
      {
        text: "Supabase pgvector for high-speed vector retrieval and contextually relevant search",
        highlight: "Vector Search",
      },
      {
        text: "Retrieval-augmented Q&A powered by Gemini LLM for context-grounded response generation",
        highlight: "RAG Pipeline",
      },
      {
        text: "~35% improvement in response precision and factual alignment",
        highlight: "35% More Precise",
      },
    ],
  },
];

/* ═══════════════════════════════════════════
   ICONS (inline SVG paths for crisp IE7 look)
   ═══════════════════════════════════════════ */

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7L9 12" stroke="#4a7cc9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2L10 7L5 12" stroke="#999" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M8 3L12 7L8 11" stroke="#4a7cc9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#f59e0b">
      <path d="M6 0l1.76 3.57L12 4.14 8.88 7.1l.74 4.3L6 9.27 2.38 11.4l.74-4.3L0 4.14l4.24-.57z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="shrink-0">
      <rect x="0.5" y="5.5" width="10" height="7" rx="1.5" fill="#f0f0f0" stroke="#999" />
      <path d="M3 5.5V3.5a2.5 2.5 0 015 0V5.5" stroke="#999" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   PROJECT PAGE COMPONENT
   ═══════════════════════════════════════════ */

function ProjectPage({ project }: { project: ProjectTab }) {
  return (
    <div className="ie-content custom-scrollbar" style={{ fontFamily: "var(--font-system)" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }}
          />
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "#16a34a" }}>
            Project Documentation
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#1a1a2e" }}>
          {project.title}
        </h1>
        <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
          {project.subtitle}
        </p>
      </div>

      {/* Description */}
      <div
        className="rounded-lg p-4 mb-6"
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%)",
          border: "1px solid #d0e0f0",
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
          {project.description}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: "#6b7280" }}
        >
          <span
            className="w-4 h-px"
            style={{ background: "#d1d5db" }}
          />
          Technology Stack
          <span
            className="flex-1 h-px"
            style={{ background: "#d1d5db" }}
          />
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t.name}
              className="inline-flex items-center rounded-full text-xs font-medium px-3 py-1"
              style={{
                background: t.bg,
                color: t.color,
                boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                lineHeight: "1.4",
              }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: "#6b7280" }}
        >
          <span
            className="w-4 h-px"
            style={{ background: "#d1d5db" }}
          />
          Key Features
          <span
            className="flex-1 h-px"
            style={{ background: "#d1d5db" }}
          />
        </h2>
        <ul className="space-y-3">
          {project.features.map((f, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg p-3"
              style={{
                background: i % 2 === 0 ? "#fafbfc" : "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <div className="shrink-0 mt-0.5">
                <StarIcon />
              </div>
              <div className="min-w-0">
                {f.highlight && (
                  <span
                    className="inline-block text-xs font-semibold rounded px-2 py-0.5 mb-1"
                    style={{
                      background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
                      color: "#3730a3",
                      border: "1px solid #c7d2fe",
                    }}
                  >
                    {f.highlight}
                  </span>
                )}
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {f.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div
        className="mt-8 pt-4 text-xs flex items-center justify-between"
        style={{ borderTop: "1px solid #e5e7eb", color: "#9ca3af" }}
      >
        <span>© 2025 Uganthan &middot; All rights reserved</span>
        <span className="flex items-center gap-1">
          <LockIcon />
          Trusted Site
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function InternetExplorer() {
  const [activeTab, setActiveTab] = useState(0);

  const current = PROJECTS[activeTab];

  return (
    <div className="flex flex-col h-full select-none" style={{ fontFamily: "var(--font-system)" }}>
      {/* ── Navigation Toolbar ── */}
      <div className="ie-toolbar">
        {/* Back */}
        <button
          className="ie-nav-btn"
          title="Back"
          onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : prev))}
        >
          <BackIcon />
        </button>

        {/* Forward */}
        <button
          className="ie-nav-btn"
          title="Forward"
          onClick={() => setActiveTab((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : prev))}
        >
          <ForwardIcon />
        </button>

        {/* URL Bar */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <LockIcon />
          </div>
          <input
            className="ie-url-bar"
            style={{ paddingLeft: 28 }}
            readOnly
            value={current.url}
          />
        </div>

        {/* Go */}
        <button className="ie-nav-btn" title="Go">
          <GoIcon />
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div className="ie-tab-bar">
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            className={`ie-tab ${i === activeTab ? "ie-tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-hidden">
        <ProjectPage project={current} />
      </div>
    </div>
  );
}

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
    url: "http://en.wikipedia.org/wiki/NodeCode_IDE",
    title: "NodeCode IDE",
    subtitle: "Visual Development Environment",
    description:
      "NodeCode IDE is a bi-directional visual development environment that maps TypeScript codebases into interactive node graphs for real-time editing and AI-powered repository scaffolding. Using a Single Source of Truth (SSoT) architecture, it ensures deterministic, corruption-free round-trip code synchronization.",
    tech: [
      { name: "Next.js 15+", color: "#fff", bg: "#000" },
      { name: "TypeScript", color: "#fff", bg: "#3178c6" },
      { name: "React Flow", color: "#fff", bg: "#ff0072" },
      { name: "Node.js", color: "#fff", bg: "#339933" },
      { name: "Prisma ORM", color: "#fff", bg: "#2d3748" },
      { name: "PostgreSQL", color: "#fff", bg: "#336791" },
      { name: "Docker", color: "#fff", bg: "#2496ed" },
    ],
    features: [
      { text: "Split-screen visual editor and WebSocket terminal." },
      { text: "Two-stage AI pipeline for architecture-first code generation." },
      { text: "70% faster onboarding by reducing legacy codebase mapping time." },
    ],
  },
  {
    id: "echolink",
    label: "EchoLink Mesh",
    url: "http://en.wikipedia.org/wiki/EchoLink_Mesh",
    title: "EchoLink Mesh Network",
    subtitle: "Private Multi-Device Mesh Networking",
    description:
      "EchoLink is a private multi-device mesh networking solution built on a zero-trust P2P system. It utilizes Tailscale and a Go Android Bridge for 100% cloud-independent file and audio streaming.",
    tech: [
      { name: "Avalonia", color: "#fff", bg: "#7b2bfc" },
      { name: "C#", color: "#fff", bg: "#239120" },
      { name: ".NET 10", color: "#fff", bg: "#512bd4" },
      { name: "Tailscale", color: "#fff", bg: "#0a1628" },
      { name: "Go", color: "#fff", bg: "#00add8" },
    ],
    features: [
      { text: "C#/.NET 10 Macro engine supporting dual-mode (Terminal/GUI) execution." },
      { text: "Real-time monitoring and camera sharing with <100ms latency via WireGuard." },
      { text: "Cuts administrative latency by 40%." },
    ],
  },
  {
    id: "eeg",
    label: "EEG Analysis",
    url: "http://en.wikipedia.org/wiki/EEG_Emotion_Analysis",
    title: "EEG Emotion Analysis",
    subtitle: "Deep Learning for EEG-Based Emotion Detection",
    description:
      "A deep learning model designed for EEG-based emotion detection. It implements LSTM networks to accurately capture temporal signal patterns and relies on robust data preprocessing and feature extraction pipelines for signal clarity.",
    tech: [
      { name: "Python", color: "#fff", bg: "#3776ab" },
      { name: "MNE Python", color: "#fff", bg: "#c44e52" },
      { name: "TensorFlow/Keras", color: "#fff", bg: "#ff6f00" },
      { name: "scikit-learn", color: "#fff", bg: "#f7931e" },
    ],
    features: [
      { text: "Benchmarked against KNN, Linear Regression, and other ML models." },
      { text: "~22% higher classification accuracy with LSTM over traditional approaches." },
    ],
  },
  {
    id: "rag",
    label: "RAG Q&A",
    url: "http://en.wikipedia.org/wiki/RAG_QA_System",
    title: "RAG Q&A System",
    subtitle: "End-to-End RAG Pipeline for Document Q&A",
    description:
      "An end-to-end Retrieval-Augmented Generation (RAG) pipeline for document-based Q&A. It performs PDF extraction, chunking, and embedding using Gemini embeddings, paired with Supabase pgvector for high-speed vector retrieval.",
    tech: [
      { name: "Python", color: "#fff", bg: "#3776ab" },
      { name: "Google Gemini API", color: "#fff", bg: "#4285f4" },
      { name: "Supabase", color: "#fff", bg: "#3ecf8e" },
      { name: "pgvector", color: "#fff", bg: "#336791" },
    ],
    features: [
      { text: "Retrieval-augmented Q&A powered by Gemini LLM for context-grounded response generation." },
      { text: "~35% improvement in response precision and factual alignment." },
    ],
  },
];

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="url(#blueGrad)" stroke="#1a4d8c" strokeWidth="1"/>
      <path d="M14 7L9 12L14 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="blueGrad" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ba1eb" />
          <stop offset="0.5" stopColor="#3578d6" />
          <stop offset="1" stopColor="#1e58a8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill="url(#grayGrad)" stroke="#666" strokeWidth="1"/>
      <path d="M7 5L11 9L7 13" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="grayGrad" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0f0f0" />
          <stop offset="1" stopColor="#b0b0b0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RefreshStopIcon() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#1e58a8" }}>↻</span>
      <span style={{ fontSize: 12, color: "#d9534f" }}>✖</span>
    </div>
  );
}

function GlobeIcon() {
  return <span style={{ fontSize: 14 }}>🌐</span>;
}

/* ═══════════════════════════════════════════
   WIKIPEDIA PROJECT PAGE
   ═══════════════════════════════════════════ */

function WikipediaContent({ project }: { project: ProjectTab }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#fff", fontFamily: "'Arial', sans-serif" }}>
      
      {/* ── Left Sidebar ── */}
      <div style={{ width: 160, backgroundColor: "#f6f6f6", borderRight: "1px solid #a7d7f9", padding: "20px 10px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Logo Placeholder */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#e0e0e0", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.1)" }}>
            🧩
          </div>
          <div style={{ marginTop: 8, textAlign: "center", fontFamily: "'Times New Roman', Times, serif" }}>
            <div style={{ fontSize: 18, letterSpacing: 1 }}>PROJECTPEDIA</div>
            <div style={{ fontSize: 10, fontStyle: "italic", color: "#555" }}>The Free Encyclopedia</div>
          </div>
        </div>

        {/* Sidebar Links */}
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#0645ad", lineHeight: 1.6 }}>
            <li>Main page</li>
            <li>Contents</li>
            <li>Featured content</li>
            <li>Current events</li>
            <li>Random article</li>
            <li>Donate</li>
          </ul>
        </div>
        
        <div>
          <div style={{ fontSize: 12, fontWeight: "bold", borderBottom: "1px solid #ccc", marginBottom: 4, color: "#333" }}>Interaction</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#0645ad", lineHeight: 1.6 }}>
            <li>About Projectpedia</li>
            <li>Community portal</li>
            <li>Recent changes</li>
            <li>Contact page</li>
            <li>Help</li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: "bold", borderBottom: "1px solid #ccc", marginBottom: 4, color: "#333" }}>Toolbox</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "#0645ad", lineHeight: 1.6 }}>
            <li>What links here</li>
            <li>Related changes</li>
          </ul>
        </div>
      </div>

      {/* ── Main Article Area ── */}
      <div className="custom-scrollbar" style={{ flex: 1, padding: "10px 20px", overflowY: "auto", position: "relative" }}>
        
        {/* Top Right Links */}
        <div style={{ position: "absolute", top: 10, right: 20, fontSize: 11, color: "#0645ad" }}>
          New features | 👤 Log in / create account
        </div>

        {/* Wiki Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #a7d7f9", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ padding: "4px 10px", backgroundColor: "#fff", border: "1px solid #a7d7f9", borderBottom: "none", fontSize: 12, fontWeight: "bold", color: "#000" }}>Project Page</div>
            <div style={{ padding: "4px 10px", backgroundColor: "#f6f6f6", border: "1px solid #a7d7f9", borderBottom: "none", fontSize: 12, color: "#0645ad" }}>Discussion</div>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", paddingBottom: 2 }}>
            <span style={{ fontSize: 12, color: "#000", fontWeight: "bold", marginRight: 8 }}>Read</span>
            <span style={{ fontSize: 12, color: "#0645ad", marginRight: 8 }}>View source</span>
            <span style={{ fontSize: 12, color: "#0645ad", marginRight: 8 }}>View history</span>
            <div style={{ display: "flex", border: "1px solid #aaa", background: "#fff", padding: "1px 4px", width: 140 }}>
              <input type="text" placeholder="Search" style={{ border: "none", outline: "none", fontSize: 12, flex: 1 }} />
              <span style={{ fontSize: 12, color: "#666" }}>🔍</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', serif", fontSize: 28, borderBottom: "1px solid #aaa", margin: "16px 0 10px", paddingBottom: 4, fontWeight: "normal" }}>
          Welcome to <span style={{ color: "#0645ad" }}>{project.title}</span>,
        </h1>
        <div style={{ fontSize: 13, marginBottom: 20 }}>
          the open-source project that <span style={{ color: "#0645ad" }}>anyone can review</span>.
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "6fr 4fr", gap: 20 }}>
          
          {/* Left Column: Description (Green Box) */}
          <div style={{ backgroundColor: "#f5fffa", border: "1px solid #a3d1a3", padding: 12 }}>
            <div style={{ backgroundColor: "#cef2e0", padding: "4px 8px", fontSize: 14, fontWeight: "bold", marginBottom: 12, border: "1px solid #a3d1a3" }}>
              About this project
            </div>
            
            <div style={{ display: "flex", gap: 16 }}>
              {/* Image Placeholder */}
              <div style={{ width: 120, height: 160, backgroundColor: "#e8e8e8", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 64, color: "#999" }}>🖼️</span>
              </div>
              
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#222" }}>
                <b>{project.title}</b> ({project.subtitle}) is a software project developed by Uganthan. <br/><br/>
                {project.description}
                <br/><br/>
                <i>Development context:</i> The project addresses specific challenges in its domain by utilizing modern architectural patterns and frameworks. It stands out due to its focused feature set and robust technology integrations.
              </div>
            </div>
          </div>

          {/* Right Column: Features & Tech (Blue Box) */}
          <div style={{ backgroundColor: "#f5faff", border: "1px solid #a3b0d1", padding: 12 }}>
            <div style={{ backgroundColor: "#cedff2", padding: "4px 8px", fontSize: 14, fontWeight: "bold", marginBottom: 12, border: "1px solid #a3b0d1" }}>
              Key Features & Tech Stack
            </div>
            
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "#222" }}>
              <b>Key Features:</b>
              <ul style={{ margin: "8px 0 16px", paddingLeft: 24, listStyleType: "square" }}>
                {project.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    <span style={{ color: "#0645ad" }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <b>Technology Stack:</b>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {project.tech.map((t, i) => (
                  <span key={i} style={{ 
                    background: t.bg, color: t.color, 
                    fontSize: 11, padding: "2px 6px", 
                    borderRadius: 2, border: "1px solid rgba(0,0,0,0.2)" 
                  }}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer spacing */}
        <div style={{ height: 40 }} />
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT - IE7 BROWSER FRAME
   ═══════════════════════════════════════════ */

export default function InternetExplorer() {
  const [activeTab, setActiveTab] = useState(0);
  const current = PROJECTS[activeTab];

  return (
    <div className="flex flex-col h-full select-none" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", backgroundColor: "#d9e4f1", border: "1px solid #7c9fce" }}>
      
      {/* ── 1. Top Toolbar Row (Back/Forward, Address, Search) ── */}
      <div style={{ 
        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px 6px",
        background: "linear-gradient(180deg, #e4effb 0%, #c1d5f0 50%, #abc1e8 50%, #c4d8f1 100%)",
        borderBottom: "1px solid #7c9fce"
      }}>
        {/* Back/Forward */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 8 }}>
          <button style={{ background: "transparent", border: "none", cursor: "pointer" }} onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : prev))}>
            <BackIcon />
          </button>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", marginLeft: -4 }} onClick={() => setActiveTab((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : prev))}>
            <ForwardIcon />
          </button>
        </div>

        {/* Address Bar */}
        <div style={{ 
          display: "flex", alignItems: "center", flex: 1, 
          background: "#fff", border: "1px solid #7c9fce", borderRadius: 2,
          height: 24, padding: "0 6px", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
        }}>
          <GlobeIcon />
          <input 
            type="text" 
            value={current.url} 
            readOnly 
            style={{ border: "none", outline: "none", flex: 1, fontSize: 12, paddingLeft: 6, color: "#333", backgroundColor: "transparent" }}
          />
          <RefreshStopIcon />
        </div>

        {/* Search Bar */}
        <div style={{ 
          display: "flex", alignItems: "center", width: 220,
          background: "#fff", border: "1px solid #7c9fce", borderRadius: 2,
          height: 24, padding: "0 6px", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
        }}>
          <input 
            type="text" 
            placeholder="Live Search" 
            style={{ border: "none", outline: "none", flex: 1, fontSize: 12, color: "#666" }}
          />
          <span style={{ fontSize: 12, color: "#1e58a8" }}>🔍</span>
        </div>
      </div>

      {/* ── 2. Tab & Command Bar Row ── */}
      <div style={{ 
        display: "flex", alignItems: "flex-end", padding: "0 12px",
        background: "linear-gradient(180deg, #f0f4fa 0%, #dce6f4 100%)",
        borderBottom: "1px solid #7c9fce",
        height: 32
      }}>
        {/* Favorites Star */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 6, marginRight: 16 }}>
          <span style={{ fontSize: 16, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}>⭐</span>
          <span style={{ fontSize: 14, color: "#3ba33b" }}>✚</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, flex: 1, overflow: "hidden" }}>
          {PROJECTS.map((p, i) => (
            <div 
              key={p.id}
              onClick={() => setActiveTab(i)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 16px 4px 12px",
                background: i === activeTab ? "linear-gradient(180deg, #f9fbfc 0%, #e2eaf4 100%)" : "linear-gradient(180deg, #e4effb 0%, #c1d5f0 100%)",
                border: "1px solid #7c9fce",
                borderBottom: i === activeTab ? "1px solid #e2eaf4" : "1px solid #7c9fce",
                borderRadius: "4px 4px 0 0",
                fontSize: 12,
                cursor: "pointer",
                color: "#222",
                maxWidth: 160,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxShadow: i === activeTab ? "0 -1px 2px rgba(0,0,0,0.05)" : "none",
                position: "relative",
                zIndex: i === activeTab ? 2 : 1,
                marginBottom: i === activeTab ? -1 : 0
              }}
            >
              <GlobeIcon />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
            </div>
          ))}
        </div>

        {/* Command Bar Icons (Right) */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 6, color: "#444", fontSize: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>🏠 <span style={{ fontSize: 8 }}>▼</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "#f39c12" }}>📶 <span style={{ fontSize: 8, color: "#444" }}>▼</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>🖨️ <span style={{ fontSize: 8 }}>▼</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>📄 Page <span style={{ fontSize: 8 }}>▼</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>⚙️ Tools <span style={{ fontSize: 8 }}>▼</span></span>
        </div>
      </div>

      {/* ── 3. Content Area (Wikipedia) ── */}
      <div style={{ flex: 1, backgroundColor: "#fff", borderLeft: "1px solid #7c9fce", borderRight: "1px solid #7c9fce", overflow: "hidden" }}>
        <WikipediaContent project={current} />
      </div>

      {/* ── 4. Bottom Status Bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "2px 12px",
        background: "linear-gradient(180deg, #f0f4fa 0%, #dce6f4 100%)",
        borderTop: "1px solid #7c9fce",
        fontSize: 11,
        color: "#333",
        height: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <GlobeIcon />
          Internet | Protected Mode: Off
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>🔍 100%</span>
          <span style={{ fontSize: 8 }}>▼</span>
        </div>
      </div>

    </div>
  );
}

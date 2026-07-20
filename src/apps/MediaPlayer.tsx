"use client";

import React, { useState } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

/* ═══════════════════════════════════════════
   PLAYLIST DATA
   ═══════════════════════════════════════════ */

interface Playlist {
  id: string;
  title: string;
  artist: string;
  url: string;
  gradientFrom: string;
  gradientTo: string;
}

const PLAYLISTS: Playlist[] = [
  {
    id: "daily-mix",
    title: "Daily Mix",
    artist: "Spotify",
    url: "https://open.spotify.com/playlist/54s8l4jDOgA9CsP0jZtBYl?si=f4739c5009d54c69",
    gradientFrom: "#7c3aed",
    gradientTo: "#2563eb",
  },
  {
    id: "chill-vibes",
    title: "Chill Vibes",
    artist: "Spotify",
    url: "https://open.spotify.com/playlist/0ypm6Khrgzc6Y0ZrjsIgUH?si=c1dae53c84f3463c",
    gradientFrom: "#0d9488",
    gradientTo: "#16a34a",
  },
  {
    id: "coding-flow",
    title: "Coding Flow",
    artist: "Various Artists",
    url: "https://open.spotify.com/playlist/3oaGjrR7ZoIJtC3cLkoF5W?si=1b2a00aaf5174919",
    gradientFrom: "#ea580c",
    gradientTo: "#dc2626",
  },
  {
    id: "lofi-beats",
    title: "Lo-Fi Beats",
    artist: "Lofi Girl",
    url: "#",
    gradientFrom: "#f59e0b",
    gradientTo: "#d946ef",
  },
  {
    id: "retro-synth",
    title: "Retro Synth",
    artist: "Synthwave",
    url: "#",
    gradientFrom: "#ec4899",
    gradientTo: "#8b5cf6",
  },
  {
    id: "night-drive",
    title: "Night Drive",
    artist: "Kavinsky",
    url: "#",
    gradientFrom: "#1e3a5f",
    gradientTo: "#0ea5e9",
  },
];

/* ═══════════════════════════════════════════
   ALBUM CARD
   ═══════════════════════════════════════════ */

function AlbumCard({ playlist }: { playlist: Playlist }) {
  const showSecurityModal = useDesktopStore((s) => s.showSecurityModal);

  const handleClick = () => {
    if (playlist.url !== "#") {
      showSecurityModal(playlist.url);
    }
  };

  return (
    <div 
      className="group" 
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        padding: "16px 8px",
        textAlign: "center",
      }}
    >
      {/* Album art with gradient + music note */}
      <div 
        style={{
          width: 110,
          height: 110,
          position: "relative",
          borderRadius: 4,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          overflow: "visible",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${playlist.gradientFrom} 0%, ${playlist.gradientTo} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: "48px",
              color: "rgba(255,255,255,0.8)",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              userSelect: "none",
            }}
          >
            ♫
          </span>
          {/* Glossy overlay */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "45%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
            borderRadius: "4px 4px 0 0",
          }} />
        </div>

        {/* Hover glow overlay */}
        <div
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 6,
            boxShadow: `0 0 15px ${playlist.gradientFrom}88`,
            zIndex: 1,
          }}
        />

        {/* Shadow/Reflection */}
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "5%",
            width: "90%",
            height: "24px",
            marginTop: "2px",
            background: `linear-gradient(135deg, ${playlist.gradientFrom} 0%, ${playlist.gradientTo} 100%)`,
            opacity: 0.15,
            filter: "blur(2px)",
            transform: "scaleY(-1)",
            borderRadius: "0 0 4px 4px",
            maskImage: "linear-gradient(to bottom, white 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, white 0%, transparent 100%)",
            zIndex: 0,
          }}
        />
      </div>

      {/* Title & Artist */}
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, color: "#222", fontFamily: "Segoe UI, sans-serif" }}>{playlist.title}</span>
        <span style={{ fontSize: 12, color: "#777", fontFamily: "Segoe UI, sans-serif" }}>{playlist.artist}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MEDIA PLAYER COMPONENT
   ═══════════════════════════════════════════ */

export default function MediaPlayer() {
  const [activeTab, setActiveTab] = useState("Library");

  const topTabs = ["Now Playing", "Library", "Rip", "Burn", "Sync"];

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      width: "100%", 
      height: "100%", 
      background: "#fff",
      fontFamily: "Segoe UI, Tahoma, sans-serif",
      userSelect: "none"
    }}>
      {/* ── Top Black Toolbar ── */}
      <div style={{
        height: 44,
        background: "linear-gradient(180deg, #444 0%, #1a1a1a 45%, #000 50%, #151515 100%)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
      }}>
        {/* Navigation Arrows */}
        <div style={{ display: "flex", gap: 4, marginRight: 24 }}>
          <button style={{ width: 28, height: 28, borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
            ⮜
          </button>
          <button style={{ width: 28, height: 28, borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
            ⮞
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
          {topTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "linear-gradient(180deg, #2a5a9c 0%, #153b75 45%, #0a2455 50%, #1e4b8f 100%)" : "transparent",
                border: "none",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                color: "white",
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                padding: "8px 20px",
                height: 36,
                cursor: "pointer",
                boxShadow: activeTab === tab ? "inset 0 1px 1px rgba(255,255,255,0.4), 0 0 10px rgba(100,180,255,0.4)" : "none",
                position: "relative",
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "45%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "6px 6px 0 0",
                }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Right side icons */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", color: "white", fontSize: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>🎧</span> Soundbuzz
          </div>
        </div>
      </div>

      {/* ── Secondary Gray Toolbar ── */}
      <div style={{
        height: 32,
        background: "linear-gradient(180deg, #f8f9fa 0%, #e2e6ea 100%)",
        borderBottom: "1px solid #c0c4c8",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        fontSize: 12,
        color: "#333",
      }}>
        <span style={{ fontSize: 14, marginRight: 8, color: "#666" }}>🎵</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Music <span style={{ color: "#888", fontSize: 10 }}>▶</span> Library <span style={{ color: "#888", fontSize: 10 }}>▶</span> Album
        </span>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>🪟</div>
          <div style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>⚙️</div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            background: "white", 
            border: "1px solid #b0b4b8", 
            borderRadius: 14, 
            padding: "2px 8px",
            width: 180,
          }}>
            <input 
              type="text" 
              placeholder="Search" 
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 12, fontStyle: "italic", color: "#666" }}
            />
            <span style={{ fontSize: 12, color: "#888" }}>🔍</span>
          </div>
        </div>
      </div>

      {/* ── Main Split Layout ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Left Sidebar */}
        <div style={{
          width: 220,
          background: "linear-gradient(90deg, #f0f4f8 0%, #e6ecf2 100%)",
          borderRight: "1px solid #d0d6dc",
          padding: "12px 0",
          overflowY: "auto",
        }}>
          <div style={{ padding: "4px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: "#888" }}>▼</span>
            <span style={{ fontSize: 14, color: "#666" }}>🎵</span>
            <span style={{ fontSize: 12, color: "#333" }}>Playlists</span>
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#666", fontStyle: "italic", cursor: "pointer" }}>Create Playlist</div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#666", cursor: "pointer" }}>Untitled Playlist</div>
          
          <div style={{ padding: "8px 16px 4px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 10, color: "#888" }}>▼</span>
            <span style={{ fontSize: 14, color: "#666" }}>🎵</span>
            <span style={{ fontSize: 12, color: "#333" }}>Library</span>
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>📅</span> Recently Added
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>👤</span> Artist
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.05)" }}>
             <span style={{ color: "#59b", fontSize: 14 }}>💿</span> Album
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>🎵</span> Songs
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>🎭</span> Genre
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>📆</span> Year
          </div>
          <div style={{ padding: "4px 16px 4px 38px", fontSize: 12, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
             <span style={{ color: "#777", fontSize: 14 }}>⭐</span> Rating
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white" }}>
          
          {/* Header Row */}
          <div style={{
            display: "flex",
            background: "#fff",
            borderBottom: "1px solid #e0e0e0",
            padding: "8px 12px",
            fontSize: 11,
            color: "#666",
            gap: 16,
          }}>
            <div style={{ width: 140 }}>Album</div>
            <div style={{ width: 120 }}>Album Artist</div>
            <div style={{ width: 80 }}>Genre</div>
            <div style={{ width: 80 }}>Release Year</div>
            <div style={{ width: 60 }}>Count</div>
            <div style={{ width: 60 }}>Length</div>
            <div style={{ width: 80 }}>Rating</div>
          </div>

          {/* Grid */}
          <div 
            className="custom-scrollbar"
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "24px 16px",
              alignContent: "start",
            }}
          >
            {PLAYLISTS.map((playlist) => (
              <AlbumCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Player Bar ── */}
      <div style={{
        height: 64,
        background: "linear-gradient(180deg, #628dc8 0%, #3567b5 45%, #18418b 50%, #2558aa 100%)",
        borderTop: "1px solid #7c9fce",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        color: "white",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
        position: "relative",
      }}>
        {/* Glass reflection on player bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: "45%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }} />

        {/* Left Controls (Shuffle/Repeat) */}
        <div style={{ display: "flex", gap: 16, width: 150, zIndex: 1 }}>
           <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 18, cursor: "pointer" }}>🔀</button>
           <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 18, cursor: "pointer" }}>🔁</button>
        </div>

        {/* Center Controls (Play/Pause) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, zIndex: 1 }}>
          <button style={{ 
            width: 32, height: 32, borderRadius: "50%", 
            background: "linear-gradient(180deg, #8ba8d1 0%, #5d81b8 100%)", 
            border: "1px solid rgba(255,255,255,0.4)", 
            color: "white", fontSize: 14, cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5)"
          }}>
            ⏮
          </button>
          
          {/* Big Play Button */}
          <button style={{ 
            width: 48, height: 48, borderRadius: "50%", 
            background: "radial-gradient(circle at 30% 30%, #5af 0%, #17a 60%, #036 100%)", 
            border: "2px solid rgba(255,255,255,0.8)", 
            color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4), inset 0 -4px 10px rgba(0, 200, 255, 0.6)"
          }}>
            <div style={{
              position: "absolute",
              top: 2, left: 10, right: 10, height: 16,
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }} />
            ▶
          </button>

          <button style={{ 
            width: 32, height: 32, borderRadius: "50%", 
            background: "linear-gradient(180deg, #8ba8d1 0%, #5d81b8 100%)", 
            border: "1px solid rgba(255,255,255,0.4)", 
            color: "white", fontSize: 14, cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5)"
          }}>
            ⏭
          </button>
        </div>

        {/* Right Controls (Volume) */}
        <div style={{ display: "flex", gap: 8, width: 150, justifyContent: "flex-end", alignItems: "center", zIndex: 1 }}>
           <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>🔊</span>
           <div style={{ 
             width: 60, height: 4, background: "rgba(0,0,0,0.3)", borderRadius: 2,
             border: "1px solid rgba(255,255,255,0.2)", position: "relative"
           }}>
             <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "60%", background: "linear-gradient(90deg, #66b2ff, #cce5ff)", borderRadius: 2 }} />
           </div>
        </div>
      </div>
    </div>
  );
}

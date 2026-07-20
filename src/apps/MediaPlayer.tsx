"use client";

import { useDesktopStore } from "@/store/useDesktopStore";

/* ═══════════════════════════════════════════
   PLAYLIST DATA
   ═══════════════════════════════════════════ */

interface Playlist {
  id: string;
  title: string;
  url: string;
  gradientFrom: string;
  gradientTo: string;
}

const PLAYLISTS: Playlist[] = [
  {
    id: "daily-mix",
    title: "Daily Mix",
    url: "https://open.spotify.com/playlist/54s8l4jDOgA9CsP0jZtBYl?si=f4739c5009d54c69",
    gradientFrom: "#7c3aed",
    gradientTo: "#2563eb",
  },
  {
    id: "chill-vibes",
    title: "Chill Vibes",
    url: "https://open.spotify.com/playlist/0ypm6Khrgzc6Y0ZrjsIgUH?si=c1dae53c84f3463c",
    gradientFrom: "#0d9488",
    gradientTo: "#16a34a",
  },
  {
    id: "coding-flow",
    title: "Coding Flow",
    url: "https://open.spotify.com/playlist/3oaGjrR7ZoIJtC3cLkoF5W?si=1b2a00aaf5174919",
    gradientFrom: "#ea580c",
    gradientTo: "#dc2626",
  },
  {
    id: "lofi-beats",
    title: "Lo-Fi Beats",
    url: "#",
    gradientFrom: "#f59e0b",
    gradientTo: "#d946ef",
  },
  {
    id: "retro-synth",
    title: "Retro Synth",
    url: "#",
    gradientFrom: "#ec4899",
    gradientTo: "#8b5cf6",
  },
  {
    id: "night-drive",
    title: "Night Drive",
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
    <div className="wmp-album group" onClick={handleClick}>
      {/* Album art with gradient + music note */}
      <div className="wmp-album-art">
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${playlist.gradientFrom} 0%, ${playlist.gradientTo} 100%)`,
          }}
        >
          <span
            className="select-none text-white/80 drop-shadow-lg transition-transform duration-200 group-hover:scale-110"
            style={{ fontSize: "48px", lineHeight: 1 }}
          >
            ♫
          </span>
        </div>

        {/* Hover glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[6px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            boxShadow: `0 0 24px ${playlist.gradientFrom}66, 0 8px 32px ${playlist.gradientTo}44`,
          }}
        />
      </div>

      {/* Reflection effect */}
      <div
        className="mx-auto overflow-hidden"
        style={{
          width: "90%",
          height: "24px",
          marginTop: "2px",
          background: `linear-gradient(135deg, ${playlist.gradientFrom} 0%, ${playlist.gradientTo} 100%)`,
          opacity: 0.12,
          filter: "blur(4px)",
          transform: "scaleY(-1)",
          borderRadius: "0 0 6px 6px",
          maskImage: "linear-gradient(to bottom, white 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, white 0%, transparent 100%)",
        }}
      />

      {/* Title */}
      <p className="wmp-album-title">{playlist.title}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MEDIA PLAYER COMPONENT
   ═══════════════════════════════════════════ */

export default function MediaPlayer() {
  return (
    <div className="wmp-container">
      {/* ── Header ── */}
      <div className="wmp-header">
        {/* WMP11 Icon */}
        <div
          className="flex shrink-0 items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background:
              "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
            boxShadow: "0 2px 8px rgba(249, 115, 22, 0.4)",
          }}
        >
          <span className="text-lg text-white drop-shadow-sm">🎵</span>
        </div>

        {/* Branding text */}
        <div className="flex flex-col">
          <span
            className="font-semibold leading-tight tracking-wide"
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.95)",
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            Windows Media Player
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            Library
          </span>
        </div>

        {/* Spotify badge */}
        <div
          className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: "rgba(30, 215, 96, 0.12)",
            border: "1px solid rgba(30, 215, 96, 0.2)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span
            style={{
              fontSize: "11px",
              color: "#1DB954",
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: 500,
            }}
          >
            Spotify
          </span>
        </div>
      </div>

      {/* ── Subheader / Now Playing bar ── */}
      <div
        className="flex items-center gap-3 px-5 py-2.5"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Segoe UI', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          My Playlists
        </span>
        <div
          className="mx-2 flex-1"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          {PLAYLISTS.length} playlists
        </span>
      </div>

      {/* ── Album Grid ── */}
      <div className="wmp-grid custom-scrollbar">
        {PLAYLISTS.map((playlist) => (
          <AlbumCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* ── Bottom transport bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Playback controls (decorative) */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{
              width: 28,
              height: 28,
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
              background: "transparent",
              border: "none",
              cursor: "default",
            }}
            aria-label="Previous"
          >
            ⏮
          </button>
          <button
            className="flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{
              width: 36,
              height: 36,
              color: "rgba(255,255,255,0.7)",
              fontSize: "18px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "default",
            }}
            aria-label="Play"
          >
            ▶
          </button>
          <button
            className="flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{
              width: 28,
              height: 28,
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
              background: "transparent",
              border: "none",
              cursor: "default",
            }}
            aria-label="Next"
          >
            ⏭
          </button>
        </div>

        {/* Seek bar (decorative) */}
        <div className="mx-4 flex flex-1 items-center gap-3">
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Segoe UI', sans-serif",
              minWidth: "32px",
            }}
          >
            0:00
          </span>
          <div
            className="relative flex-1 rounded-full"
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: "0%",
                background:
                  "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Segoe UI', sans-serif",
              minWidth: "32px",
              textAlign: "right",
            }}
          >
            0:00
          </span>
        </div>

        {/* Volume (decorative) */}
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            🔊
          </span>
          <div
            className="rounded-full"
            style={{
              width: "60px",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              position: "relative",
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: "70%",
                background: "rgba(255,255,255,0.35)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useDesktopStore } from "@/store/useDesktopStore";
import Window from "@/components/Window";
import Taskbar from "@/components/Taskbar";
import DesktopIcon from "@/components/DesktopIcon";

import SecurityModal from "@/components/SecurityModal";
import AeroDialog from "@/components/AeroDialog";
import StartMenu from "@/components/StartMenu";
import NotificationBalloon from "@/components/NotificationBalloon";
import { FaPowerOff } from "react-icons/fa";

/* Dynamic imports for apps to reduce initial bundle */
import dynamic from "next/dynamic";

const AboutMe = dynamic(() => import("@/apps/AboutMe"), { ssr: false });
const CommandPrompt = dynamic(() => import("@/apps/CommandPrompt"), {
  ssr: false,
});
const InternetExplorer = dynamic(() => import("@/apps/InternetExplorer"), {
  ssr: false,
});
const PhotoGallery = dynamic(() => import("@/apps/PhotoGallery"), {
  ssr: false,
});
const MediaPlayer = dynamic(() => import("@/apps/MediaPlayer"), {
  ssr: false,
});
const Minesweeper = dynamic(() => import("@/apps/Minesweeper"), {
  ssr: false,
});
const MsPaint = dynamic(() => import("@/apps/MsPaint"), { ssr: false });
const Pinball = dynamic(() => import("@/apps/Pinball"), { ssr: false });
const Resume = dynamic(() => import("@/apps/Resume"), { ssr: false });
const WindowsMail = dynamic(() => import("@/apps/WindowsMail"), { ssr: false });

/* ═══════════════════════════════════════════
   APP COMPONENT REGISTRY
   ═══════════════════════════════════════════ */
const APP_COMPONENTS: Record<string, React.ComponentType> = {
  aboutme: AboutMe,
  cmd: CommandPrompt,
  ie: InternetExplorer,
  gallery: PhotoGallery,
  mediaplayer: MediaPlayer,
  minesweeper: Minesweeper,
  mspaint: MsPaint,
  pinball: Pinball,
  resume: Resume,
  mail: WindowsMail,
};

/* ═══════════════════════════════════════════
   DESKTOP ICON DATA
   ═══════════════════════════════════════════ */
const DESKTOP_ICONS = [
  {
    appType: "aboutme",
    label: "About Me",
    icon: <img src="/icons/about.png" alt="About Me" width={48} height={48} />,
  },
  {
    appType: "cmd",
    label: "Command Prompt",
    icon: <div style={{ width: 48, height: 48, borderRadius: 8, background: "linear-gradient(180deg, #1d1f27, #090b0f)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 18, fontFamily: "Consolas, monospace" }}>C</div>,
  },
  {
    appType: "ie",
    label: "Internet Explorer",
    icon: <img src="/icons/Internet-explorer.png" alt="Internet Explorer" width={48} height={48} />,
  },
  {
    appType: "gallery",
    label: "Photo Gallery",
    icon: <img src="/icons/Photo-gallery.png" alt="Photo Gallery" width={48} height={48} />,
  },
  {
    appType: "mediaplayer",
    label: "Media Player",
    icon: <img src="/icons/media-player.png" alt="Media Player" width={48} height={48} />,
  },
  {
    appType: "minesweeper",
    label: "Minesweeper",
    icon: <img src="/icons/minesweeper.png" alt="Minesweeper" width={48} height={48} />,
  },
  {
    appType: "resume",
    label: "My Resume",
    icon: <img src="/icons/resume.png" alt="My Resume" width={48} height={48} />,
  },
  {
    appType: "mspaint",
    label: "Paint",
    icon: <img src="/icons/paint.png" alt="Paint" width={48} height={48} />,
  },
  {
    appType: "mail",
    label: "Contact Me",
    icon: <div style={{ fontSize: 36, width: 48, textAlign: "center" }}>📧</div>,
  },
];

function LoginScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#1e4fb8",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Image
        src="/wallpaper.png?v=login"
        alt="Login background"
        fill
        style={{ objectFit: "cover", opacity: 0.25, filter: "saturate(1.2)" }}
        priority
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,33,96,0.85) 0%, rgba(41,96,196,0.55) 50%, rgba(0,40,105,0.82) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 84, background: "rgba(0,0,0,0.2)" }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <button
            onClick={onContinue}
            style={{
              border: "none",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 128,
                height: 128,
                margin: "0 auto 14px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
                fontSize: 54,
                fontWeight: 700,
              }}
            >
              U
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5 }}>uganthan_m</div>
            <div style={{ fontSize: 13, opacity: 0.88, marginTop: 4 }}>Student, AI engineer, Software developer, Graphic designer</div>
            <div style={{ fontSize: 14, opacity: 0.82, marginTop: 22 }}>To begin, click uganthan_m to log in</div>
          </button>
        </div>
        <div
          style={{
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(0,0,0,0.2)",
            fontSize: 12,
          }}
        >
          <button
            onClick={() => window.location.reload()}
            style={{
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Restart
          </button>
          <div style={{ textAlign: "right", lineHeight: 1.4, maxWidth: 380 }}>
            After you log on, the system&apos;s yours to explore. Every detail has been designed with a purpose.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BOOT SCREEN
   ═══════════════════════════════════════════ */
function BootScreen({ onBoot }: { onBoot: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "welcome">("loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("welcome");
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "welcome") {
      // Synthesize a Vista-inspired startup chime using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.25;
        masterGain.connect(ctx.destination);

        // Ascending chord notes (C5, E5, G5, C6) with staggered timing
        const notes = [
          { freq: 523.25, start: 0, dur: 1.8 },    // C5
          { freq: 659.25, start: 0.15, dur: 1.6 },  // E5
          { freq: 783.99, start: 0.3, dur: 1.4 },   // G5
          { freq: 1046.5, start: 0.5, dur: 1.2 },   // C6
        ];

        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime + start);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + dur);
        });
      } catch {
        // Web Audio API not available
      }
      const timer = setTimeout(onBoot, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onBoot]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, #000428 0%, #004e92 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
      }}
    >
      {phase === "loading" ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 300, marginBottom: 8 }}>
            Windows<span style={{ fontWeight: 600 }}>Vista</span>
          </div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.6,
              marginBottom: 40,
              letterSpacing: 2,
            }}
          >
            PORTFOLIO EDITION
          </div>
          {/* Loading bar */}
          <div
            style={{
              width: 280,
              height: 6,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(progress, 100)}%`,
                height: "100%",
                background: "linear-gradient(90deg, #4a90d9, #67b8f7, #4a90d9)",
                borderRadius: 3,
                transition: "width 0.1s ease",
              }}
            />
          </div>
          <div
            style={{ fontSize: 11, opacity: 0.4, marginTop: 16 }}
          >
            Loading system components...
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            animation: "fadeIn 0.8s ease",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 300, marginBottom: 8 }}>
            Welcome
          </div>
          <div style={{ fontSize: 16, opacity: 0.7 }}>Uganthan M</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP COMPONENT
   ═══════════════════════════════════════════ */
type DesktopProps = {
  wallpaperVersion: number;
};

export default function Desktop({ wallpaperVersion }: DesktopProps) {
  const { openApps, hasBooted, setBoot, resetSession, closeStartMenu } = useDesktopStore();
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isTurnOffDialogOpen, setIsTurnOffDialogOpen] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [hasDismissedFullscreenPrompt, setHasDismissedFullscreenPrompt] =
    useState(false);
  const [isCrtEnabled, setIsCrtEnabled] = useState(true);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const wallpaperSrc = `/wallpaper.png?v=${wallpaperVersion}`;
  const notifications = [
    {
      title: "Fullscreen shortcut",
      body: "Press F11 to enter or exit fullscreen mode.",
      time: "Now",
    },
    {
      title: "Resume available",
      body: "Open My Resume from the start menu or desktop shortcut.",
      time: "Today",
    },
  ];

  const handleDesktopClick = useCallback(() => {
    closeStartMenu();
    setShowNotificationCenter(false);
  }, [closeStartMenu]);

  const handleBoot = useCallback(() => {
    setBoot();
  }, [setBoot]);

  const handleUserLogin = useCallback(() => {
    setHasLoggedIn(true);
    setHasDismissedFullscreenPrompt(false);
    setShowFullscreenPrompt(false);
  }, []);

  const setSessionState = useDesktopStore((s) => s.setSessionState);
  const sessionState = useDesktopStore((s) => s.sessionState);

  const handleLogOff = useCallback(() => {
    setShowNotificationCenter(false);
    setIsFullscreen(false);
    setIsCrtEnabled(true);
    setHasDismissedFullscreenPrompt(false);
    setShowFullscreenPrompt(false);
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    
    setSessionState("logged_out");
    resetSession();
  }, [setSessionState, resetSession]);

  const handleShutDown = useCallback(() => {
    setShowNotificationCenter(false);
    setIsTurnOffDialogOpen(true);
  }, []);

  const executeShutDown = useCallback(() => {
    setIsTurnOffDialogOpen(false);
    setIsFullscreen(false);
    setIsCrtEnabled(true);
    setHasDismissedFullscreenPrompt(false);
    setShowFullscreenPrompt(false);
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    
    // Play shutdown sound
    const audio = new Audio("/sounds/winxpshutdown.mp3");
    audio.play().catch(() => {});

    setIsShuttingDown(true);

    window.setTimeout(() => {
      resetSession();
      setHasLoggedIn(false);
      setIsShuttingDown(false);
    }, 2500);
  }, [resetSession]);

  const executeRestart = useCallback(() => {
    setIsTurnOffDialogOpen(false);
    resetSession();
    window.setTimeout(() => window.location.reload(), 250);
  }, [resetSession]);

  const syncFullscreenState = useCallback(() => {
    setIsFullscreen(document.fullscreenElement === shellRef.current);
  }, []);

  const enterFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell || document.fullscreenElement === shell) return;

    try {
      await shell.requestFullscreen();
      setHasDismissedFullscreenPrompt(true);
    } catch {
      // Ignore fullscreen failures; the prompt stays available.
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) return;

    try {
      await document.exitFullscreen();
    } catch {
      // Ignore exit failures.
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement === shellRef.current) {
      void exitFullscreen();
    } else {
      void enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  // Toggle sidebar with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault();

      }

      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      syncFullscreenState();
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [syncFullscreenState]);

  useEffect(() => {
    if (!hasBooted || isFullscreen || hasDismissedFullscreenPrompt) return;

    const timer = window.setTimeout(() => {
      setShowFullscreenPrompt(true);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [hasBooted, isFullscreen, hasDismissedFullscreenPrompt]);

  const shouldShowFullscreenPrompt =
    !isFullscreen && !hasDismissedFullscreenPrompt && showFullscreenPrompt;

  // We rely on the external StartupSequence now
  useEffect(() => {
    if (!hasBooted) setBoot();
  }, [hasBooted, setBoot]);

  return (
    <div
      ref={shellRef}
      className={`desktop-shell ${isCrtEnabled ? "crt-enabled" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
      onClick={handleDesktopClick}
    >
      {/* XP Bliss Wallpaper */}
      <Image
        src={wallpaperSrc}
        alt="Windows XP Bliss Wallpaper"
        fill
        style={{ objectFit: "cover" }}
        priority
        quality={90}
      />

      {/* Desktop Area (above taskbar, left of sidebar) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 44,
          transition: "right 0.3s ease",
        }}
      >
        {/* Desktop Icons */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 4,
            maxHeight: "calc(100% - 32px)",
            maxWidth: "calc(100vw - 32px)",
            overflowX: "auto",
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {DESKTOP_ICONS.map((icon) => (
            <DesktopIcon
              key={icon.appType}
              appType={icon.appType}
              label={icon.label}
              icon={icon.icon}
            />
          ))}
        </div>

        {/* Open Windows */}
        {openApps.map((app) => {
          const AppComponent = APP_COMPONENTS[app.appType];
          if (!AppComponent) return null;
          return (
            <Window key={app.id} app={app}>
              <AppComponent />
            </Window>
          );
        })}
      </div>



      {/* Fullscreen prompt */}
      {shouldShowFullscreenPrompt && (
        <AeroDialog
          title="Fullscreen Mode"
          icon="info"
          onClose={() => setHasDismissedFullscreenPrompt(true)}
          width={450}
          buttons={
            <>
              <button
                onClick={() => {
                  void enterFullscreen();
                }}
                className="px-4 py-1 border border-[#999] rounded bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] hover:border-[#3399ff] hover:bg-[#eef6ff] shadow-sm text-black text-[13px] min-w-[120px]"
              >
                Enter Fullscreen
              </button>
              <button
                onClick={() => setHasDismissedFullscreenPrompt(true)}
                className="px-4 py-1 border border-[#0078d7] rounded bg-gradient-to-b from-[#e5f1fb] to-[#cbe4f7] shadow-[0_0_0_1px_#0078d7_inset] text-black text-[13px] min-w-[120px] focus:outline-none"
              >
                Continue Windowed
              </button>
            </>
          }
        >
          <div className="mb-4">
            <div className="font-semibold mb-2 text-[15px]">Fullscreen mode recommended</div>
            For the best retro desktop experience, switch to fullscreen.
            You can also press F11 at any time to enter or exit fullscreen.
          </div>
        </AeroDialog>
      )}

      {/* Taskbar */}
      <Taskbar
        isFullscreen={isFullscreen}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={() => setIsCrtEnabled((current) => !current)}
        onToggleFullscreen={toggleFullscreen}
        onToggleNotificationCenter={() => setShowNotificationCenter((current) => !current)}
      />

      {showNotificationCenter && (
        <div
          style={{
            position: "fixed",
            right: 12,
            bottom: 56,
            zIndex: 9300,
            width: 320,
            backgroundColor: "#FFFFE1",
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            border: "1px solid black",
            borderRadius: 7,
            boxShadow: "3px 3px 6px rgba(0,0,0,0.4)",
            padding: "10px 14px",
            color: "black",
            fontFamily: "Tahoma, 'Segoe UI', sans-serif",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
               <div style={{
                 width: 22,
                 height: 22,
                 borderRadius: "50%",
                 background: "linear-gradient(135deg, #fff 0%, #c3d9ff 100%)",
                 border: "1px solid #7792c9",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 color: "#003399",
                 fontWeight: "bold",
                 fontSize: 14,
                 fontFamily: "'Times New Roman', serif",
                 boxShadow: "inset -1px -1px 3px rgba(0,0,0,0.15), 1px 1px 2px rgba(0,0,0,0.2)"
               }}>i</div>
               <div style={{ fontSize: 14, fontWeight: 700 }}>Notifications</div>
            </div>
            <button
              onClick={() => setShowNotificationCenter(false)}
              style={{ border: "none", background: "transparent", color: "#555", cursor: "pointer", fontSize: 16, fontWeight: "bold" }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.map((notification) => (
              <div
                key={notification.title}
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{notification.title}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{notification.time}</div>
                </div>
                <div style={{ fontSize: 12, color: "#333", marginTop: 4, lineHeight: 1.4 }}>{notification.body}</div>
              </div>
            ))}
          </div>

          {/* Balloon Arrow */}
          <div style={{
            position: "absolute",
            bottom: -14,
            right: 80,
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "14px solid #000",
          }} />
          <div style={{
            position: "absolute",
            bottom: -11,
            right: 81,
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "12px solid #FFFFE1",
          }} />
        </div>
      )}

      {/* Start Menu */}
      <StartMenu onLogOff={handleLogOff} onShutDown={handleShutDown} />

      {/* Notification Balloon */}
      <NotificationBalloon />

      {/* Security Modal */}
      <SecurityModal />



      {/* Shutdown Black Screen */}
      {isShuttingDown && (
        <div style={{ position: "fixed", inset: 0, background: "black", zIndex: 999999 }} />
      )}

      {/* Turn Off Computer XP Dialog */}
      {isTurnOffDialogOpen && (
        <div style={{
          position: "fixed", inset: 0, 
          background: "rgba(0,0,0,0.1)",
          backdropFilter: "grayscale(100%)",
          zIndex: 99999,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <AeroDialog
            title="Shut Down Windows"
            width={typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 32) : 400}
            buttons={
              <button 
                onClick={() => setIsTurnOffDialogOpen(false)}
                className="px-4 py-1 border border-[#0078d7] rounded bg-gradient-to-b from-[#e5f1fb] to-[#cbe4f7] shadow-[0_0_0_1px_#0078d7_inset] text-black text-[13px] min-w-[80px] focus:outline-none"
              >
                Cancel
              </button>
            }
          >
            <div className="flex justify-center gap-10 items-center py-8">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: 0.5 }}>
                <div className="w-12 h-12 rounded border border-[#a3a3a3] bg-gradient-to-b from-[#fcd34d] to-[#d97706] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-white text-2xl">
                  <FaPowerOff />
                </div>
                <span className="text-black text-[12px] mt-2 font-medium">Stand By</span>
              </div>
              <div onClick={executeShutDown} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                <div className="w-12 h-12 rounded border border-[#a3a3a3] bg-gradient-to-b from-[#f87171] to-[#dc2626] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-white text-2xl">
                  <FaPowerOff />
                </div>
                <span className="text-black text-[12px] mt-2 font-medium">Turn Off</span>
              </div>
              <div onClick={executeRestart} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                <div className="w-12 h-12 rounded border border-[#a3a3a3] bg-gradient-to-b from-[#4ade80] to-[#16a34a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-white text-2xl">
                  <span style={{ transform: "rotate(90deg)" }}><FaPowerOff /></span>
                </div>
                <span className="text-black text-[12px] mt-2 font-medium">Restart</span>
              </div>
            </div>
          </AeroDialog>
        </div>
      )}
    </div>
  );
}

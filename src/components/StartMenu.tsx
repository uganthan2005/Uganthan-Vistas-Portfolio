"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaBehance, FaEnvelope, FaInstagram, FaPowerOff, FaLock } from "react-icons/fa";
import { SiLetterboxd } from "react-icons/si";
import { useDesktopStore, APP_REGISTRY } from "@/store/useDesktopStore";

interface StartMenuProps {
  onLogOff: () => void;
  onShutDown: () => void;
}

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type QuickLaunch = {
  label: string;
  appType: string;
  iconPath?: string;
};

const socialBadgeStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  fontSize: 12,
  fontWeight: 700,
};

const QUICK_LAUNCHES: QuickLaunch[] = [
  { label: "My Projects", appType: "ie", iconPath: "/icons/Internet-explorer.png" },
  { label: "Contact Me", appType: "mail" },
  { label: "About Me", appType: "aboutme", iconPath: "/icons/about.png" },
  { label: "My Resume", appType: "resume", iconPath: "/icons/resume.png" },
  { label: "Media", appType: "mediaplayer", iconPath: "/icons/media-player.png" },
  { label: "Image Viewer", appType: "gallery", iconPath: "/icons/Photo-gallery.png" },
  { label: "Paint", appType: "mspaint", iconPath: "/icons/paint.png" },
  { label: "3D Pinball", appType: "pinball", iconPath: "/icons/pinball.png" },
  { label: "Command Prompt", appType: "cmd" },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/uganthan_vk?igsh=MXA2cWZremJjN3Z4cw==",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#E1306C"}}><FaInstagram size={28} /></span>,
  },
  {
    label: "GitHub",
    href: "https://github.com/uganthan2005",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#ffffff"}}><FaGithub size={28} /></span>,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/uganthanm",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#0077b5"}}><FaLinkedin size={28} /></span>,
  },
  {
    label: "Behance",
    href: "https://www.behance.net/uganthamariapp",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#053eff"}}><FaBehance size={28} /></span>,
  },
  {
    label: "Email",
    href: "mailto:uganthanmariappan@gmail.com",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#ffffff"}}><FaEnvelope size={28} /></span>,
  },
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/_Ben_10__/",
    icon: <span style={{...socialBadgeStyle, background: "transparent", border: "none", color: "#00E054"}}><SiLetterboxd size={28} /></span>,
  },
];

export default function StartMenu({ onLogOff, onShutDown }: StartMenuProps) {
  const { isStartMenuOpen, openApp, closeStartMenu, openApps } = useDesktopStore();
  const showSecurityModal = useDesktopStore((s) => s.showSecurityModal);

  const recentApps = Array.from(
    new Map(
      openApps
        .slice()
        .reverse()
        .map((app) => [app.appType, app])
    ).values()
  ).slice(0, 5);

  const handleLaunch = (appType: string) => {
    openApp(appType);
    closeStartMenu();
  };

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9400,
            }}
            onClick={closeStartMenu}
          />

          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="vista-window-frame"
            style={{
              position: "fixed",
              bottom: 44,
              left: 0,
              width: 380,
              height: 480,
              zIndex: 9998, /* Just under start button */
              display: "flex",
              padding: "4px", /* Glass border thickness */
              borderBottomLeftRadius: 0,
            }}
          >
            <div style={{
              flex: 1,
              display: "flex",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.5)",
              background: "white",
              position: "relative",
            }}>
              {/* Left Pane (White) */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", padding: "8px" }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {QUICK_LAUNCHES.map((item) => {
                    const app = APP_REGISTRY[item.appType];
                    return (
                      <button 
                        key={item.label} 
                        onClick={() => handleLaunch(item.appType)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: 4,
                          textAlign: "left",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(50, 150, 255, 0.15)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {item.iconPath ? (
                          <img src={item.iconPath} alt={item.label} width={32} height={32} />
                        ) : (
                          <span style={{ fontSize: 24, width: 32, textAlign: "center" }}>{app?.icon ?? "⬛"}</span>
                        )}
                        <div>
                          <div style={{ color: "#222", fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                          <div style={{ color: "#666", fontSize: 11 }}>{app?.title ?? item.label}</div>
                        </div>
                      </button>
                    );
                  })}
                  <hr style={{ margin: "8px 0", borderTop: "1px solid #ddd" }} />
                  {recentApps.map((app) => {
                    const registryEntry = APP_REGISTRY[app.appType];
                    return (
                      <button 
                        key={app.id} 
                        onClick={() => handleLaunch(app.appType)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: 4,
                          textAlign: "left",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(50, 150, 255, 0.15)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        {registryEntry?.iconPath ? (
                          <img src={registryEntry.iconPath} alt={registryEntry.title} width={32} height={32} />
                        ) : (
                          <span style={{ fontSize: 24, width: 32, textAlign: "center" }}>{app.icon}</span>
                        )}
                        <div>
                          <div style={{ color: "#222", fontSize: 13, fontWeight: 500 }}>{registryEntry?.title ?? app.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Search Bar Area */}
                <div style={{ padding: "8px 0 0 0", borderTop: "1px solid #ddd" }}>
                  <div style={{
                    background: "rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 12,
                    padding: "4px 12px",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    <input 
                      type="text" 
                      placeholder="Start Search" 
                      style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontStyle: "italic", color: "#333" }} 
                    />
                    <span style={{ opacity: 0.5 }}>🔍</span>
                  </div>
                </div>
              </div>

              {/* Right Pane (Dark Glass) */}
              <div style={{
                width: 140,
                background: "rgba(10, 20, 35, 0.8)",
                backdropFilter: "blur(10px)",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                padding: "40px 10px 10px 10px", /* Leave room for user picture */
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  {SOCIAL_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => showSecurityModal(link.href)}
                      style={{
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        color: "white",
                        padding: "6px",
                        fontSize: 12,
                        cursor: "pointer",
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.textShadow = "0 0 5px white";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.textShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                    </button>
                  ))}
                  <hr style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "8px 0" }} />
                  <button
                    onClick={() => handleLaunch("cmd")}
                    style={{
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      color: "white",
                      padding: "6px",
                      fontSize: 12,
                      cursor: "pointer",
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Control Panel
                  </button>
                  <button
                    onClick={() => handleLaunch("cmd")}
                    style={{
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      color: "white",
                      padding: "6px",
                      fontSize: 12,
                      cursor: "pointer",
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Computer
                  </button>
                </div>

                {/* Session Buttons */}
                <div style={{ display: "flex", gap: 4, marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
                   <button 
                     onClick={onShutDown}
                     title="Shut Down"
                     style={{ flex: 1, padding: "6px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4, color: "white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
                   ><FaPowerOff size={14} /></button>
                   <button 
                     onClick={onLogOff}
                     title="Lock"
                     style={{ flex: 1, padding: "6px", background: "rgba(200,50,50,0.6)", border: "1px solid rgba(255,50,50,0.4)", borderRadius: 4, color: "white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
                   ><FaLock size={14} /></button>
                </div>
              </div>
            </div>

            {/* User Picture Overlay */}
            <div style={{
              position: "absolute",
              top: -24,
              right: 28,
              width: 54,
              height: 54,
              borderRadius: 6,
              border: "2px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8)",
              overflow: "hidden",
              zIndex: 10,
              background: "black",
            }}>
              <Image src="/profile-picture.jpg" alt="Uganthan" fill className="object-cover" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

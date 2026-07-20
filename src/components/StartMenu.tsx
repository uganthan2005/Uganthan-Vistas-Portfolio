"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
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
  { label: "Contact Me", appType: "aboutme", iconPath: "/icons/about.png" },
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
    label: "GitHub",
    href: "https://github.com/uganthan2005",
    icon: <span style={socialBadgeStyle}>GH</span>,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/uganthanm",
    icon: <span style={socialBadgeStyle}>in</span>,
  },
  {
    label: "Behance",
    href: "https://www.behance.net/uganthamariapp",
    icon: <span style={socialBadgeStyle}>Be</span>,
  },
  {
    label: "Email",
    href: "mailto:uganthanmariappan@gmail.com",
    icon: <span style={socialBadgeStyle}>@</span>,
  },
];

export default function StartMenu({ onLogOff, onShutDown }: StartMenuProps) {
  const { isStartMenuOpen, openApp, closeStartMenu, openApps } = useDesktopStore();
  const showSecurityModal = useDesktopStore((s) => s.showSecurityModal);

  if (!isStartMenuOpen) return null;

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
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9400,
        }}
        onClick={closeStartMenu}
      />

      <div
        className="start-menu"
        style={{
          width: 720,
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          minHeight: 540,
          borderRadius: 18,
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, rgba(20,33,58,0.96) 0%, rgba(10,14,26,0.98) 100%)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, rgba(81,137,213,0.95), rgba(34,88,168,0.95))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 28,
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              }}
            >
              U
            </div>
            <div>
              <div style={{ color: "white", fontSize: 17, fontWeight: 700 }}>Uganthan M</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 4 }}>
                Visual Designer
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionLabel text="Social Profile" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {SOCIAL_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => showSecurityModal(link.href)}
                  title={link.label}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.22)",
                  }}
                >
                  {link.icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionLabel text="Session" />
            <button className="start-menu-action" onClick={onLogOff}>
              <span>⇢</span>
              <span>Log off</span>
            </button>
            <button className="start-menu-action danger" onClick={onShutDown}>
              <span>⏻</span>
              <span>Shut down</span>
            </button>
          </div>
        </div>

        <div
          style={{
            background: "rgba(25, 33, 52, 0.92)",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div style={{ padding: 18, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Welcome back</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 4 }}>
              Launch your projects, profile tools, and creative apps from here.
            </div>
          </div>

          <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, overflow: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionLabel text="Pinned" />
              {QUICK_LAUNCHES.map((item) => {
                const app = APP_REGISTRY[item.appType];
                return (
                  <button key={item.label} className="start-menu-item start-menu-card" onClick={() => handleLaunch(item.appType)}>
                    {item.iconPath ? (
                      <img src={item.iconPath} alt={item.label} width={28} height={28} style={{ borderRadius: 6 }} />
                    ) : (
                      <span style={{ width: 28, textAlign: "center", fontSize: 20 }}>{app?.icon ?? "⬛"}</span>
                    )}
                    <div style={{ minWidth: 0, textAlign: "left" }}>
                      <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 11, marginTop: 2 }}>
                        {app?.title ?? item.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionLabel text="Recently used" />
              {recentApps.length > 0 ? (
                recentApps.map((app) => {
                  const registryEntry = APP_REGISTRY[app.appType];
                  return (
                    <button key={app.id} className="start-menu-item start-menu-card" onClick={() => handleLaunch(app.appType)}>
                      {registryEntry?.iconPath ? (
                        <img src={registryEntry.iconPath} alt={registryEntry.title} width={28} height={28} style={{ borderRadius: 6 }} />
                      ) : (
                        <span style={{ width: 28, textAlign: "center", fontSize: 20 }}>{app.icon}</span>
                      )}
                      <div style={{ minWidth: 0, textAlign: "left" }}>
                        <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{registryEntry?.title ?? app.title}</div>
                        <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 11, marginTop: 2 }}>
                          {app.isMinimized ? "Minimized" : "Open"}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 12,
                  }}
                >
                  Recently used apps will appear here.
                </div>
              )}

              <SectionLabel text="Other" />
              <button className="start-menu-item start-menu-card" onClick={() => handleLaunch("cmd")}>
                <span style={{ width: 28, textAlign: "center", fontSize: 18 }}>⌘</span>
                <div>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Computer</div>
                  <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 11, marginTop: 2 }}>
                    System tools and command prompt
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase" }}>{text}</div>;
}

import { create } from "zustand";

/* ═══════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════ */

export interface AppInstance {
  id: string;
  appType: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface SecurityModalState {
  isOpen: boolean;
  targetUrl: string;
  targetDomain: string;
  /** If set, modal acts as a download warning instead of external link */
  isDownload?: boolean;
  downloadFilename?: string;
}

export interface DesktopState {
  openApps: AppInstance[];
  activeAppId: string | null;
  highestZIndex: number;
  securityModal: SecurityModalState;
  isStartMenuOpen: boolean;
  hasBooted: boolean;

  // Actions
  openApp: (appType: string) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  restoreApp: (id: string) => void;
  focusApp: (id: string) => void;
  updateAppPosition: (id: string, position: { x: number; y: number }) => void;
  updateAppSize: (id: string, size: { width: number; height: number }) => void;
  showSecurityModal: (url: string) => void;
  showDownloadModal: (url: string, filename: string) => void;
  hideSecurityModal: () => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  setBoot: () => void;
  resetSession: () => void;
}

/* ═══════════════════════════════════════════
   APP REGISTRY
   ═══════════════════════════════════════════ */

export interface AppConfig {
  appType: string;
  title: string;
  icon: string;
  iconPath?: string;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
}

export const APP_REGISTRY: Record<string, AppConfig> = {
  aboutme: {
    appType: "aboutme",
    title: "About Me — User Accounts",
    icon: "👤",
    iconPath: "/icons/about.png",
    defaultSize: { width: 860, height: 560 },
    defaultPosition: { x: 120, y: 60 },
  },
  cmd: {
    appType: "cmd",
    title: "Command Prompt",
    icon: "⬛",
    defaultSize: { width: 720, height: 450 },
    defaultPosition: { x: 180, y: 80 },
  },
  ie: {
    appType: "ie",
    title: "Internet Explorer",
    icon: "🌐",
    iconPath: "/icons/Internet-explorer.png",
    defaultSize: { width: 900, height: 580 },
    defaultPosition: { x: 100, y: 40 },
  },
  gallery: {
    appType: "gallery",
    title: "Windows Photo Gallery",
    icon: "🖼️",
    defaultSize: { width: 820, height: 520 },
    defaultPosition: { x: 140, y: 70 },
  },
  mediaplayer: {
    appType: "mediaplayer",
    title: "Windows Media Player",
    icon: "🎵",
    iconPath: "/icons/media-player.png",
    defaultSize: { width: 680, height: 480 },
    defaultPosition: { x: 200, y: 90 },
  },
  minesweeper: {
    appType: "minesweeper",
    title: "Minesweeper",
    icon: "💣",
    iconPath: "/icons/minesweeper.png",
    defaultSize: { width: 340, height: 420 },
    defaultPosition: { x: 300, y: 100 },
  },
  resume: {
    appType: "resume",
    title: "My Resume",
    icon: "📄",
    iconPath: "/icons/resume.png",
    defaultSize: { width: 920, height: 640 },
    defaultPosition: { x: 160, y: 50 },
  },
  mspaint: {
    appType: "mspaint",
    title: "Paint",
    icon: "🎨",
    iconPath: "/icons/paint.png",
    defaultSize: { width: 780, height: 520 },
    defaultPosition: { x: 160, y: 50 },
  },
  pinball: {
    appType: "pinball",
    title: "3D Pinball for Windows - Space Cadet",
    icon: "🕹️",
    iconPath: "/icons/pinball.png",
    defaultSize: { width: 620, height: 470 },
    defaultPosition: { x: 220, y: 70 },
  },
};

/* ═══════════════════════════════════════════
   STORE IMPLEMENTATION
   ═══════════════════════════════════════════ */

let instanceCounter = 0;

export const useDesktopStore = create<DesktopState>((set, get) => ({
  openApps: [],
  activeAppId: null,
  highestZIndex: 10,
  securityModal: {
    isOpen: false,
    targetUrl: "",
    targetDomain: "",
    isDownload: false,
    downloadFilename: "",
  },
  isStartMenuOpen: false,
  hasBooted: false,

  openApp: (appType: string) => {
    const config = APP_REGISTRY[appType];
    if (!config) return;

    const state = get();
    const newZ = state.highestZIndex + 1;
    instanceCounter++;
    const id = `${appType}-${instanceCounter}`;

    // Offset position slightly if an app of the same type is already open
    const sameTypeCount = state.openApps.filter(
      (a) => a.appType === appType
    ).length;
    const offset = sameTypeCount * 30;

    const newApp: AppInstance = {
      id,
      appType: config.appType,
      title: config.title,
      icon: config.icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: {
        x: config.defaultPosition.x + offset,
        y: config.defaultPosition.y + offset,
      },
      size: { ...config.defaultSize },
    };

    set({
      openApps: [...state.openApps, newApp],
      activeAppId: id,
      highestZIndex: newZ,
      isStartMenuOpen: false,
    });
  },

  closeApp: (id: string) => {
    set((state) => {
      const filtered = state.openApps.filter((a) => a.id !== id);
      return {
        openApps: filtered,
        activeAppId:
          state.activeAppId === id
            ? filtered.length > 0
              ? filtered[filtered.length - 1].id
              : null
            : state.activeAppId,
      };
    });
  },

  minimizeApp: (id: string) => {
    set((state) => ({
      openApps: state.openApps.map((a) =>
        a.id === id ? { ...a, isMinimized: true } : a
      ),
      activeAppId:
        state.activeAppId === id
          ? state.openApps.find((a) => a.id !== id && !a.isMinimized)?.id ??
            null
          : state.activeAppId,
    }));
  },

  maximizeApp: (id: string) => {
    set((state) => ({
      openApps: state.openApps.map((a) =>
        a.id === id ? { ...a, isMaximized: true } : a
      ),
    }));
  },

  restoreApp: (id: string) => {
    const state = get();
    const newZ = state.highestZIndex + 1;
    set({
      openApps: state.openApps.map((a) =>
        a.id === id
          ? { ...a, isMinimized: false, isMaximized: false, zIndex: newZ }
          : a
      ),
      activeAppId: id,
      highestZIndex: newZ,
    });
  },

  focusApp: (id: string) => {
    const state = get();
    const app = state.openApps.find((a) => a.id === id);
    if (!app) return;

    if (app.isMinimized) {
      get().restoreApp(id);
      return;
    }

    const newZ = state.highestZIndex + 1;
    set({
      openApps: state.openApps.map((a) =>
        a.id === id ? { ...a, zIndex: newZ } : a
      ),
      activeAppId: id,
      highestZIndex: newZ,
    });
  },

  updateAppPosition: (
    id: string,
    position: { x: number; y: number }
  ) => {
    set((state) => ({
      openApps: state.openApps.map((a) =>
        a.id === id ? { ...a, position } : a
      ),
    }));
  },

  updateAppSize: (
    id: string,
    size: { width: number; height: number }
  ) => {
    set((state) => ({
      openApps: state.openApps.map((a) =>
        a.id === id ? { ...a, size } : a
      ),
    }));
  },

  showSecurityModal: (url: string) => {
    let domain = "";
    try {
      domain = new URL(url).hostname;
    } catch {
      domain = url;
    }
    set({
      securityModal: {
        isOpen: true,
        targetUrl: url,
        targetDomain: domain,
        isDownload: false,
        downloadFilename: "",
      },
      isStartMenuOpen: false,
    });
  },

  showDownloadModal: (url: string, filename: string) => {
    set({
      securityModal: {
        isOpen: true,
        targetUrl: url,
        targetDomain: "local file system",
        isDownload: true,
        downloadFilename: filename,
      },
      isStartMenuOpen: false,
    });
  },

  hideSecurityModal: () => {
    set({
      securityModal: {
        isOpen: false,
        targetUrl: "",
        targetDomain: "",
        isDownload: false,
        downloadFilename: "",
      },
    });
  },

  toggleStartMenu: () => {
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen }));
  },

  closeStartMenu: () => {
    set({ isStartMenuOpen: false });
  },

  setBoot: () => {
    set({ hasBooted: true });
  },

  resetSession: () =>
    set({
      openApps: [],
      activeAppId: null,
      highestZIndex: 10,
      securityModal: {
        isOpen: false,
        targetUrl: "",
        targetDomain: "",
        isDownload: false,
        downloadFilename: "",
      },
      isStartMenuOpen: false,
      hasBooted: false,
    }),
}));

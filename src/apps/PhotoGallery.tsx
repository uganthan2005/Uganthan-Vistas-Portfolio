"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════
   DATA TYPES
   ═══════════════════════════════════════════ */

interface GalleryItem {
  id: string;
  title: string;
  gradient: string;
  folder: string;
  year: number;
  imageUrl?: string;
}

interface SidebarNode {
  id: string;
  label: string;
  icon: string | React.ReactNode;
  children?: SidebarNode[];
  isExpanded?: boolean;
}

/* ═══════════════════════════════════════════
   GALLERY DATA
   ═══════════════════════════════════════════ */

const GALLERY_ITEMS: GalleryItem[] = [
  // Events & Posters
  { id: "img-1", title: "Tech Fiesta Poster", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816176/techfiesta1_ws8zmh.png" },
  { id: "img-2", title: "Hacksymmetric Banner", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816210/hacksymmetric1_pcxuuf.png" },
  { id: "img-3", title: "Project Presentation", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816209/projectpresentation_ixy4la.png" },
  { id: "img-4", title: "Blend with Blender", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816160/blend-with-blender1_eiz4gi.png" },
  { id: "img-5", title: "Money Master Poster", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816150/money_master_poster_gz4dfh.png" },
  { id: "img-6", title: "Escape Room Poster", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816150/escaperoom_fklire.png" },
  { id: "img-7", title: "Reverse Coding", gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816143/reversecoding1_ndayzc.png" },

  // UI/UX & Creative
  { id: "img-8", title: "UI/UX Design", gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", folder: "design", year: 2026, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816191/ui_ux_srr78m.png" },
  { id: "img-9", title: "MED Design", gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816223/med_o2u0pt.png" },
  { id: "img-10", title: "DF2 Design", gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", folder: "design", year: 2024, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816198/df2_iua5cx.png" },
  { id: "img-11", title: "DP / Profile", gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", folder: "design", year: 2024, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816219/dp_rcej45.png" },
  { id: "img-12", title: "LED Graphic", gradient: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)", folder: "design", year: 2024, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816161/LED_jgfuqc.png" },

  // Marketing
  { id: "img-13", title: "General Banner", gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816154/banner_lt0ioj.png" },
  { id: "img-14", title: "Coupon Design", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816151/coupon_pxglxq.png" },
  { id: "img-15", title: "Sticker 3", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816161/sticker3_tosc9o.png" },
  { id: "img-16", title: "RCS", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816201/rcs_blwmpm.png" },
  { id: "img-17", title: "TK Flag Front", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816227/tk-flag-front_scnsei.png" },
  { id: "img-18", title: "TK Flag Back", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816206/tk-flag-back_kibews.png" },
  { id: "img-19", title: "Hacksymmetric 2", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816196/hacksymmetric_s18b68.png" },
  { id: "img-20", title: "Welcome Poster", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816167/welcome_xtyypy.png" },
  { id: "img-21", title: "Trap Poster", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816162/trap_gwflr1.png" },
  { id: "img-22", title: "Join Poster", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816157/join_qcc3se.png" },
  { id: "img-23", title: "Hackathon Poster", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816156/hack1_wqithi.png" },
  { id: "img-24", title: "Sticker 1", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816144/sticker1_czggaj.png" },
  { id: "img-25", title: "Sticker 5", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816144/sticker5_oasp0n.png" },
  { id: "img-26", title: "Sticker 4", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816143/sticker4_chn4ch.png" },
  { id: "img-27", title: "Sticker 2", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816143/sticker2_nxyiic.png" },
  { id: "img-28", title: "3D T-Shirt Mockup", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816140/3d-tshirt-mockup-customizable-design-template-0001-grK2w_siq4et.jpg" },
  { id: "img-29", title: "DevSpace", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "design", year: 2025, imageUrl: "https://res.cloudinary.com/dkvvu8tac/image/upload/q_auto,f_auto/v1784816190/devspc_fyif2o.png" },
];

/* ═══════════════════════════════════════════
   SIDEBAR TREE DATA
   ═══════════════════════════════════════════ */

const SIDEBAR_TREE: SidebarNode[] = [
  { id: "all", label: "All Pictures and Videos", icon: "🖼️" },
  { id: "recently_imported", label: "Recently Imported", icon: "🕒" },
  {
    id: "folders",
    label: "Folders",
    icon: "📁",
    isExpanded: true,
    children: [
      { id: "folder_pictures", label: "Pictures", icon: "📁", children: [
        { id: "design", label: "Designs", icon: "📁" }
      ]},
    ]
  },
  { 
    id: "tags", 
    label: "Tags", 
    icon: "🏷️", 
    isExpanded: true,
    children: [
      { id: "tag_create", label: "Create a New Tag", icon: "✏️" },
      { id: "tag_none", label: "Not Tagged", icon: "🏷️" },
      { id: "tag_design", label: "Design", icon: "🎨" },
      { id: "tag_event", label: "Event", icon: "📅" }
    ]
  },
  {
    id: "ratings",
    label: "Ratings",
    icon: "⭐",
    isExpanded: true,
    children: [
      { id: "rate_5", label: "⭐⭐⭐⭐⭐", icon: "⭐" },
      { id: "rate_4", label: "⭐⭐⭐⭐", icon: "⭐" },
      { id: "rate_unrated", label: "Not Rated", icon: "☆" },
    ]
  }
];

function collectFolderIds(node: SidebarNode): string[] {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectFolderIds(child));
    }
  }
  return ids;
}

function findNode(nodes: SidebarNode[], id: string): SidebarNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/* ═══════════════════════════════════════════
   FULLSCREEN VIEWER
   ═══════════════════════════════════════════ */

interface ViewerProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function FullscreenViewer({ items, currentIndex, onClose, onPrev, onNext }: ViewerProps) {
  const item = items[currentIndex];
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleRotate = useCallback(() => setRotation((r) => r + 90), []);
  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.25, 0.5)), []);

  if (!item) return null;

  const toolbarBtnStyle: React.CSSProperties = {
    width: 40, height: 36, border: "none", borderRadius: 4,
    background: "rgba(255,255,255,0.1)", color: "white", fontSize: 16,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 99999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ position: "absolute", top: 18, right: 24, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
        {currentIndex + 1} / {items.length}
      </div>

      <div style={{
        width: "70%", maxWidth: 680, height: "70%", maxHeight: 600, background: item.gradient,
        borderRadius: 8, boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
        transform: `rotate(${rotation}deg) scale(${zoom})`, transition: "transform 0.3s ease",
        overflow: "hidden", position: "relative"
      }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <>
            <span style={{ fontSize: 56, opacity: 0.3, color: "white" }}>🖼️</span>
            <span style={{ fontSize: 18, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.4)", fontWeight: 600 }}>
              {item.title}
            </span>
          </>
        )}
      </div>

      {currentIndex > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "white", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>
      )}
      {currentIndex < items.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "white", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <button style={toolbarBtnStyle} onClick={(e) => { e.stopPropagation(); onPrev(); }} disabled={currentIndex === 0}>◀</button>
        <button style={toolbarBtnStyle} onClick={(e) => { e.stopPropagation(); onNext(); }} disabled={currentIndex >= items.length - 1}>▶</button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />
        <button style={toolbarBtnStyle} onClick={(e) => { e.stopPropagation(); handleRotate(); }}>↻</button>
        <button style={toolbarBtnStyle} onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}>+</button>
        <button style={toolbarBtnStyle} onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}>−</button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />
        <button style={{ ...toolbarBtnStyle, background: "rgba(200,50,30,0.5)" }} onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function PhotoGallery() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("all");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(["tags", "ratings", "folders", "folder_pictures"])
  );
  
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Filter items based on selection
  const visibleItems = useMemo(() => {
    if (selectedNodeId === "all" || selectedNodeId === "recently_imported" || selectedNodeId.startsWith("date_") || selectedNodeId.startsWith("rate_") || selectedNodeId.startsWith("tag_")) {
      // For simplicity in this demo, "All Pictures" and non-folder filters just show everything, 
      // but if a specific year is clicked, filter by year.
      if (selectedNodeId.startsWith("date_")) {
        const year = parseInt(selectedNodeId.replace("date_", ""));
        return GALLERY_ITEMS.filter(item => item.year === year);
      }
      return GALLERY_ITEMS;
    }

    const node = findNode(SIDEBAR_TREE, selectedNodeId);
    if (!node) return GALLERY_ITEMS;
    const folderIds = collectFolderIds(node);
    return GALLERY_ITEMS.filter((item) => folderIds.includes(item.folder));
  }, [selectedNodeId]);

  // Group items by category
  const groupedItems = useMemo(() => {
    return [["All Designs", visibleItems]] as const;
  }, [visibleItems]);

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Keyboard support for viewer
  useEffect(() => {
    if (viewerIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setViewerIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
      if (e.key === "ArrowRight") setViewerIndex(prev => (prev !== null && prev < visibleItems.length - 1 ? prev + 1 : prev));
      if (e.key === "Escape") setViewerIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, visibleItems.length]);

  /* Sidebar Renderer */
  const renderTree = (nodes: SidebarNode[], depth: number = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNodeId === node.id;

      return (
        <div key={node.id}>
          <div 
            onClick={() => {
              setSelectedNodeId(node.id);
              setSelectedImageId(null);
            }}
            style={{
              display: "flex", alignItems: "center", padding: `2px 8px 2px ${8 + depth * 16}px`,
              cursor: "pointer", fontSize: 12, color: isSelected ? "#fff" : "#333",
              background: isSelected ? "#3399ff" : "transparent",
              userSelect: "none"
            }}
          >
            <div 
              onClick={(e) => { 
                if (hasChildren) {
                  e.stopPropagation(); 
                  toggleExpand(node.id); 
                }
              }}
              style={{ width: 14, textAlign: "center", color: isSelected ? "#fff" : "#888", cursor: hasChildren ? "pointer" : "default" }}
            >
              {hasChildren ? (isExpanded ? "◿" : "▷") : ""}
            </div>
            <span style={{ margin: "0 6px", fontSize: 14, filter: isSelected ? "brightness(1.5)" : "none" }}>{node.icon}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.label}</span>
          </div>
          {hasChildren && isExpanded && renderTree(node.children!, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Segoe UI', Tahoma, sans-serif", backgroundColor: "#f0f0f0", userSelect: "none" }}>
      
      {/* ── 1. Top Toolbar (Black Glass) ── */}
      <div style={{
        display: "flex", alignItems: "center", padding: "6px 12px",
        background: "linear-gradient(180deg, #333 0%, #111 40%, #000 50%, #222 100%)",
        borderBottom: "1px solid #000",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
        color: "#fff", fontSize: 12,
        height: 38
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 24 }}>
          <button style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(180deg, #1e58a8 0%, #0a3370 100%)", border: "1px solid #000", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⮜</button>
          <button style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(180deg, #555 0%, #333 100%)", border: "1px solid #000", color: "#999", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⮞</button>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>📄</span> File <span style={{ fontSize: 8 }}>▼</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>🪄</span> Fix</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>ℹ️</span> Info</div>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>🖨️</span> Print <span style={{ fontSize: 8 }}>▼</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>✉️</span> E-mail</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>🔥</span> Burn <span style={{ fontSize: 8 }}>▼</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>🎬</span> Make a Movie</div>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ fontSize: 14 }}>📂</span> Open <span style={{ fontSize: 8 }}>▼</span></div>
        </div>
      </div>

      {/* ── 2. Sub-Toolbar (Gray/White) ── */}
      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "4px 12px",
        background: "linear-gradient(180deg, #f0f4fa 0%, #dce6f4 100%)",
        borderBottom: "1px solid #aebac8",
        height: 32
      }}>
        <div style={{ 
          display: "flex", alignItems: "center", width: 220,
          background: "#fff", border: "1px solid #aebac8", borderRadius: 2,
          height: 22, padding: "0 6px", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)"
        }}>
          <input 
            type="text" 
            placeholder="Search" 
            style={{ border: "none", outline: "none", flex: 1, fontSize: 12, fontStyle: "italic", color: "#666" }}
          />
          <span style={{ fontSize: 12, color: "#1e58a8" }}>🔍</span>
        </div>
      </div>

      {/* ── 3. Main Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Sidebar */}
        <div className="custom-scrollbar" style={{ width: 220, background: "#f0f0f0", borderRight: "1px solid #ccc", overflowY: "auto", padding: "8px 0" }}>
          {renderTree(SIDEBAR_TREE)}
        </div>

        {/* Content Area */}
        <div className="custom-scrollbar" style={{ flex: 1, background: "#fff", overflowY: "auto", padding: "20px 30px", userSelect: "none" }}>
          
          {groupedItems.map(([year, items]) => (
            <div key={year} style={{ marginBottom: 40 }}>
              
              {/* Divider Header */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap", paddingRight: 8 }}>
                  {year} - {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #ccc 0%, rgba(204,204,204,0) 100%)" }} />
              </div>

              {/* Grid */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {items.map((item) => {
                  const isSelected = selectedImageId === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedImageId(item.id)}
                      onDoubleClick={() => {
                        const idx = visibleItems.findIndex(v => v.id === item.id);
                        if (idx !== -1) setViewerIndex(idx);
                      }}
                      style={{
                        padding: 8,
                        background: isSelected ? "rgba(51, 153, 255, 0.2)" : "transparent",
                        border: isSelected ? "1px solid #99d1ff" : "1px solid transparent",
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 140
                      }}
                    >
                      <div style={{
                        width: 120, height: 100,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        background: "transparent"
                      }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: 24, color: "rgba(0,0,0,0.1)" }}>🖼️</span>
                        )}
                      </div>
                      <div style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: "#333",
                        textAlign: "center",
                        wordBreak: "break-word",
                        lineHeight: 1.2
                      }}>
                        {item.title}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {visibleItems.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40, color: "#999", fontSize: 13 }}>
              There are no pictures or videos to display.
            </div>
          )}

        </div>
      </div>

      {/* ── 4. Bottom Status & Control Bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px",
        background: "linear-gradient(180deg, #1c3c5e 0%, #0c1d30 50%, #081421 51%, #0b1c2e 100%)",
        borderTop: "1px solid #000",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
        color: "#fff", fontSize: 11,
        height: 48
      }}>
        {/* Left Status Text */}
        <div style={{ width: 200, opacity: 0.8 }}>
          {visibleItems.length} items{selectedImageId ? ", 1 selected" : ""}
        </div>

        {/* Center Media Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, cursor: "pointer", opacity: 0.8 }}>🔍 <span style={{ fontSize: 8 }}>▼</span></span>
          <span style={{ fontSize: 16, cursor: "pointer", opacity: 0.8 }}>▦</span>
          
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />

          <button style={{ background: "transparent", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}>⏮</button>
          
          <div style={{ 
            width: 36, height: 36, borderRadius: "50%", 
            background: "linear-gradient(180deg, #4488ff 0%, #1155cc 100%)", 
            border: "2px solid #aaccff", boxShadow: "0 0 8px rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", marginLeft: 8, marginRight: 8
          }}>
            <span style={{ fontSize: 18, color: "#fff", marginLeft: 2 }}>▶</span>
          </div>

          <button style={{ background: "transparent", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}>⏭</button>
          
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />

          <span style={{ fontSize: 16, cursor: "pointer", opacity: 0.8 }}>↺</span>
          <span style={{ fontSize: 16, cursor: "pointer", opacity: 0.8 }}>↻</span>
          
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
          
          <span style={{ fontSize: 14, color: "#ff4444", cursor: "pointer" }}>❌</span>
        </div>

        {/* Right Spacer */}
        <div style={{ width: 200 }} />
      </div>

      {/* ── 5. Fullscreen Viewer ── */}
      {viewerIndex !== null && (
        <FullscreenViewer
          items={visibleItems}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onPrev={() => setViewerIndex(p => p! > 0 ? p! - 1 : p)}
          onNext={() => setViewerIndex(p => p! < visibleItems.length - 1 ? p! + 1 : p)}
        />
      )}

    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════
   DATA TYPES
   ═══════════════════════════════════════════ */

interface GalleryItem {
  id: string;
  title: string;
  gradient: string;
  folder: string;
}

interface FolderNode {
  id: string;
  label: string;
  icon: string;
  children?: FolderNode[];
}

/* ═══════════════════════════════════════════
   FOLDER TREE DATA
   ═══════════════════════════════════════════ */

const FOLDER_TREE: FolderNode[] = [
  {
    id: "all",
    label: "All Photos",
    icon: "🖼️",
    children: [
      {
        id: "asymmetric",
        label: "Asymmetric Designs",
        icon: "📁",
        children: [
          { id: "techfiesta", label: "Tech Fiesta", icon: "📁" },
          { id: "hacksymmetric", label: "Hacksymmetric", icon: "📁" },
        ],
      },
      {
        id: "events",
        label: "Event Assets",
        icon: "📁",
        children: [
          { id: "talos", label: "TALOS 5.0", icon: "📁" },
        ],
      },
      {
        id: "creative",
        label: "Creative Work",
        icon: "📁",
        children: [
          { id: "merchandise", label: "Merchandise", icon: "📁" },
          { id: "promovideos", label: "Promotional Videos", icon: "📁" },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════
   PLACEHOLDER GALLERY ITEMS
   ═══════════════════════════════════════════ */

const GALLERY_ITEMS: GalleryItem[] = [
  // Tech Fiesta
  { id: "tf-1", title: "Tech Fiesta Poster Design 1", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", folder: "techfiesta" },
  { id: "tf-2", title: "Tech Fiesta Banner", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", folder: "techfiesta" },
  { id: "tf-3", title: "Tech Fiesta Social Media", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", folder: "techfiesta" },
  { id: "tf-4", title: "Tech Fiesta Standee", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", folder: "techfiesta" },
  { id: "tf-5", title: "Tech Fiesta ID Card", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", folder: "techfiesta" },

  // Hacksymmetric
  { id: "hk-1", title: "Hacksymmetric Banner", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", folder: "hacksymmetric" },
  { id: "hk-2", title: "Hacksymmetric Logo Concept", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", folder: "hacksymmetric" },
  { id: "hk-3", title: "Hacksymmetric Certificate", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", folder: "hacksymmetric" },
  { id: "hk-4", title: "Hacksymmetric Social Post", gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", folder: "hacksymmetric" },
  { id: "hk-5", title: "Hacksymmetric Poster", gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", folder: "hacksymmetric" },
  { id: "hk-6", title: "Hacksymmetric Backdrop", gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", folder: "hacksymmetric" },

  // TALOS 5.0
  { id: "ta-1", title: "TALOS 5.0 Event Poster", gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", folder: "talos" },
  { id: "ta-2", title: "TALOS 5.0 Stage Banner", gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", folder: "talos" },
  { id: "ta-3", title: "TALOS 5.0 Invitation", gradient: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)", folder: "talos" },
  { id: "ta-4", title: "TALOS 5.0 Schedule Card", gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", folder: "talos" },
  { id: "ta-5", title: "TALOS 5.0 Highlights Reel", gradient: "linear-gradient(135deg, #f5576c 0%, #ff6f61 100%)", folder: "talos" },

  // Merchandise
  { id: "me-1", title: "T-Shirt Front Design", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", folder: "merchandise" },
  { id: "me-2", title: "T-Shirt Back Design", gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", folder: "merchandise" },
  { id: "me-3", title: "Sticker Pack Sheet", gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)", folder: "merchandise" },
  { id: "me-4", title: "Hoodie Mockup", gradient: "linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)", folder: "merchandise" },

  // Promotional Videos
  { id: "pv-1", title: "Promo Teaser Thumbnail", gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)", folder: "promovideos" },
  { id: "pv-2", title: "Event Recap Thumbnail", gradient: "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)", folder: "promovideos" },
  { id: "pv-3", title: "Workshop Intro Frame", gradient: "linear-gradient(135deg, #feada6 0%, #f5efef 100%)", folder: "promovideos" },
  { id: "pv-4", title: "Behind the Scenes Still", gradient: "linear-gradient(135deg, #a3bded 0%, #6991c7 100%)", folder: "promovideos" },
  { id: "pv-5", title: "Announcement Video Cover", gradient: "linear-gradient(135deg, #13547a 0%, #80d0c7 100%)", folder: "promovideos" },
];

/* ═══════════════════════════════════════════
   HELPER: Collect all folder IDs under a node
   ═══════════════════════════════════════════ */

function collectFolderIds(node: FolderNode): string[] {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectFolderIds(child));
    }
  }
  return ids;
}

function findNode(nodes: FolderNode[], id: string): FolderNode | null {
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
   FOLDER TREE ITEM COMPONENT
   ═══════════════════════════════════════════ */

interface FolderTreeItemProps {
  node: FolderNode;
  depth: number;
  selectedFolder: string;
  expandedFolders: Set<string>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

function FolderTreeItem({
  node,
  depth,
  selectedFolder,
  expandedFolders,
  onSelect,
  onToggleExpand,
}: FolderTreeItemProps) {
  const isActive = selectedFolder === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedFolders.has(node.id);

  return (
    <div>
      <div
        className={`gallery-folder-item ${isActive ? "gallery-folder-active" : ""}`}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) {
            onToggleExpand(node.id);
          }
        }}
      >
        {hasChildren && (
          <span
            style={{
              fontSize: 10,
              width: 14,
              textAlign: "center",
              color: "#888",
              flexShrink: 0,
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        {!hasChildren && <span style={{ width: 14, flexShrink: 0 }} />}
        <span style={{ fontSize: 14 }}>{node.icon}</span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isActive ? "#0058a3" : "#333",
          }}
        >
          {node.label}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFolder={selectedFolder}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   THUMBNAIL CARD COMPONENT
   ═══════════════════════════════════════════ */

interface ThumbnailProps {
  item: GalleryItem;
  onClick: () => void;
}

function Thumbnail({ item, onClick }: ThumbnailProps) {
  return (
    <div className="gallery-thumb" onClick={onClick}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: item.gradient,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: 10,
          position: "relative",
        }}
      >
        {/* Decorative icon overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            fontSize: 32,
            opacity: 0.3,
            color: "white",
          }}
        >
          🖼️
        </div>
        <span
          style={{
            fontSize: 11,
            color: "white",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            textAlign: "center",
            lineHeight: 1.3,
            fontWeight: 500,
            position: "relative",
            zIndex: 1,
          }}
        >
          {item.title}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FULLSCREEN VIEWER COMPONENT
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

  const handleRotate = useCallback(() => {
    setRotation((r) => r + 90);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
  }, []);

  if (!item) return null;

  const toolbarBtnStyle: React.CSSProperties = {
    width: 40,
    height: 36,
    border: "none",
    borderRadius: 4,
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 24,
          color: "rgba(255,255,255,0.6)",
          fontSize: 13,
          fontFamily: "var(--font-system)",
        }}
      >
        {currentIndex + 1} / {items.length}
      </div>

      {/* Main preview */}
      <div
        style={{
          width: "70%",
          maxWidth: 680,
          aspectRatio: "4 / 3",
          background: item.gradient,
          borderRadius: 8,
          boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          transform: `rotate(${rotation}deg) scale(${zoom})`,
          transition: "transform 0.3s ease",
        }}
      >
        <span style={{ fontSize: 56, opacity: 0.3, color: "white" }}>🖼️</span>
        <span
          style={{
            fontSize: 18,
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            fontWeight: 600,
            textAlign: "center",
            padding: "0 32px",
            fontFamily: "var(--font-system)",
          }}
        >
          {item.title}
        </span>
      </div>

      {/* Left / Right navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            fontSize: 22,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
        >
          ◀
        </button>
      )}
      {currentIndex < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            fontSize: 22,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
        >
          ▶
        </button>
      )}

      {/* Bottom Toolbar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 24px",
        }}
      >
        <button
          style={toolbarBtnStyle}
          title="Previous"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={currentIndex === 0}
        >
          ◀
        </button>
        <button
          style={toolbarBtnStyle}
          title="Next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={currentIndex >= items.length - 1}
        >
          ▶
        </button>

        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

        <button
          style={toolbarBtnStyle}
          title="Rotate"
          onClick={(e) => { e.stopPropagation(); handleRotate(); }}
        >
          ↻
        </button>
        <button
          style={toolbarBtnStyle}
          title="Zoom In"
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
        >
          +
        </button>
        <button
          style={toolbarBtnStyle}
          title="Zoom Out"
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
        >
          −
        </button>

        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

        <button style={toolbarBtnStyle} title="Slideshow">
          ▶
        </button>
        <button
          style={{ ...toolbarBtnStyle, background: "rgba(200,50,30,0.5)" }}
          title="Close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(232,17,35,0.8)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(200,50,30,0.5)"; }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PHOTO GALLERY COMPONENT
   ═══════════════════════════════════════════ */

export default function PhotoGallery() {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(["all", "asymmetric", "events", "creative"])
  );

  /* Compute visible items based on selected folder */
  const visibleItems = React.useMemo(() => {
    const node = findNode(FOLDER_TREE, selectedFolder);
    if (!node) return [];
    const folderIds = collectFolderIds(node);
    return GALLERY_ITEMS.filter((item) => folderIds.includes(item.folder));
  }, [selectedFolder]);

  const isViewerOpen = selectedImageIndex !== null;

  /* Toggle folder expansion */
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /* Viewer navigation */
  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev !== null && prev < visibleItems.length - 1 ? prev + 1 : prev
    );
  }, [visibleItems.length]);

  const handleCloseViewer = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  /* Keyboard navigation for viewer */
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Escape":
          handleCloseViewer();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isViewerOpen, handlePrev, handleNext, handleCloseViewer]);

  /* Folder label for display */
  const currentFolderNode = findNode(FOLDER_TREE, selectedFolder);
  const folderLabel = currentFolderNode?.label ?? "All Photos";

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "var(--font-system)" }}>
      {/* ── Left Pane: Folder Tree ── */}
      <div
        className="gallery-folder-tree custom-scrollbar"
        style={{
          width: 200,
          minWidth: 200,
          height: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "4px 8px 8px",
          }}
        >
          Folders
        </div>
        {FOLDER_TREE.map((node) => (
          <FolderTreeItem
            key={node.id}
            node={node}
            depth={0}
            selectedFolder={selectedFolder}
            expandedFolders={expandedFolders}
            onSelect={setSelectedFolder}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {/* ── Right Pane: Thumbnails Grid ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Breadcrumb / Header */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid #e0e0e0",
            background: "rgba(248,250,255,0.8)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>🖼️</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
            {folderLabel}
          </span>
          <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
            {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {visibleItems.length > 0 ? (
          <div className="gallery-grid custom-scrollbar" style={{ flex: 1 }}>
            {visibleItems.map((item, index) => (
              <Thumbnail
                key={item.id}
                item={item}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              color: "#aaa",
            }}
          >
            <span style={{ fontSize: 40 }}>📂</span>
            <span style={{ fontSize: 14 }}>This folder is empty</span>
          </div>
        )}
      </div>

      {/* ── Fullscreen Viewer Overlay ── */}
      {isViewerOpen && (
        <FullscreenViewer
          key={selectedImageIndex ?? 0}
          items={visibleItems}
          currentIndex={selectedImageIndex!}
          onClose={handleCloseViewer}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

interface OsLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function OsLink({ href, children, className, style }: OsLinkProps) {
  const showSecurityModal = useDesktopStore((s) => s.showSecurityModal);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showSecurityModal(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={{
        color: "#0066cc",
        textDecoration: "underline",
        cursor: "pointer",
        ...style,
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

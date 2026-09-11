// components/builder/LivePreview.tsx
"use client";

import React, { useState } from "react";
import { SiteConfig, SubPage } from "@/types/pageConfig";
import { CraftLivePreview } from "./craft/CraftLivePreview";
import { SocialIcons } from "@/components/builder/craft/SocialIcons";
import { saveSimpleState, syncCraftToSimple } from "@/lib/builderStorage";

// Theme size map matching CraftText
const themeSizeMap: Record<string, string> = {
  h1: "36px",
  h2: "28px",
  h3: "22px",
  h4: "18px",
  h5: "12px",
  h6: "10px",
  p: "14px",
};

const alignmentMap: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

interface LivePreviewProps {
  site: SiteConfig;
  setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
  activePage: SubPage;
  updateActivePage: (updatedFields: Partial<SubPage>) => void;
  isAddPanelOpen: boolean;
  setIsAddPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LivePreview({ 
  site, 
  setSite, 
  activePage: propActivePage, 
  updateActivePage,
  isAddPanelOpen, 
  setIsAddPanelOpen, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}: LivePreviewProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Dynamically resolve and sync active page state on the fly so contentBlocks are never stale
  const activePage = React.useMemo(() => {
    const basePage = site.pages.find((p) => p.slug === site.activePageSlug) || propActivePage;
    if (basePage.craftState && typeof basePage.craftState === "string") {
      return syncCraftToSimple(basePage.craftState, basePage);
    }
    return basePage;
  }, [site, site.activePageSlug, propActivePage]);

  // Wrapper that updates state and immediately triggers persistent storage safely
  const handleSiteUpdate = (newSite: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
    setSite((prev) => {
      const updated = typeof newSite === "function" ? newSite(prev) : newSite;
      saveSimpleState(updated);
      return updated;
    });
  };

  // If we are in advanced mode, render the fully featured CraftLivePreview workspace
  if (site.activeMode === "advanced") {
    return (
      <div className="flex-1 h-full flex flex-col relative overflow-hidden transition-all duration-300">
        <CraftLivePreview 
          site={site} 
          setSite={handleSiteUpdate} 
          activePage={activePage} 
          isAddPanelOpen={isAddPanelOpen}
          setIsAddPanelOpen={setIsAddPanelOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </div>
    );
  }

  // Otherwise, render your standard Simple mode view natively with ordered layout
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-start p-12 transition-colors duration-200 relative overflow-hidden overflow-y-auto"
      style={{ backgroundColor: activePage.backgroundColor, color: activePage.textColor }}
      onClick={() => setSelectedBlockId(null)}
    >
      {/* Top Nav Bar */}
      <div className="absolute top-6 flex gap-4 text-xs font-medium opacity-60 z-30">
        {site.pages.map((p) => (
          <button
            key={p.slug}
            onClick={(e) => {
              e.stopPropagation();
              handleSiteUpdate({ ...site, activePageSlug: p.slug });
            }}
            className={`hover:opacity-100 transition ${p.slug === activePage.slug ? "underline font-bold opacity-100" : ""}`}
          >
            {p.title} <span className="opacity-60 text-[10px]">({p.slug})</span>
          </button>
        ))}
      </div>

      {/* --- SIMPLE MODE VIEW (UNIFIED ORDERED STREAM) --- */}
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-black/20 shadow-2xl relative z-10 mt-12 mb-12">
        <div className="flex flex-col items-center gap-4 w-full">
          {activePage.contentBlocks && activePage.contentBlocks.length > 0 ? (
            activePage.contentBlocks.map((block: any) => {
              // 1. Avatar Block
              if (block.type === "avatar") {
                return (
                  <div key={block.id} className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold tracking-wider mx-auto">
                    {site.username ? site.username.slice(0, 2).toUpperCase() : "OP"}
                  </div>
                );
              }

              // 2. Profile Info Block
              if (block.type === "profile") {
                return (
                  <div key={block.id} className="space-y-2 w-full text-center">
                    <h2 className="text-2xl font-bold">@{site.username || "username"}</h2>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">Viewing: {activePage.title} ({activePage.slug})</p>
                    <p className="text-sm opacity-80 leading-relaxed pt-1">
                      {block.text && block.text.trim() !== "" ? block.text : "No bio provided."}
                    </p>
                    {activePage.slug === "/" && activePage.socials && activePage.socials.length > 0 && (
                      <div className="pt-2 flex justify-center">
                        <SocialIcons socials={activePage.socials} />
                      </div>
                    )}
                  </div>
                );
              }

              // 3. Link Card Block (with fixed style precedence)
              if (block.type === "link") {
                const styles = block.styles || {};
                const tag = styles.tag || "p";
                
                // If fontSize is default or missing, fall back to the tag's theme size (e.g. h1 = 36px)
                const rawFontSize = styles.fontSize && styles.fontSize !== "14px" 
                  ? styles.fontSize 
                  : (themeSizeMap[tag] || styles.fontSize || "14px");

                const resolvedLinkFontSize = 
                  typeof rawFontSize === "string" && rawFontSize.endsWith("px")
                    ? rawFontSize
                    : `${rawFontSize}px`;
                
                const styleOverrides: React.CSSProperties = {
                  fontFamily: styles.fontFamily || "inherit",
                  color: styles.textColor || undefined,
                  fontSize: resolvedLinkFontSize,
                  fontWeight: styles.fontWeight || undefined,
                  fontStyle: styles.fontStyle || undefined,
                  textAlign: styles.alignment || undefined,
                  textDecoration: styles.textDecoration || undefined,
                  textTransform: styles.textTransform as any || undefined,
                  letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
                  lineHeight: styles.lineHeight ? styles.lineHeight : undefined,
                };

                if (styles.effect === "shadow") {
                  styleOverrides.textShadow = `${styles.shadowX || 2}px ${styles.shadowY || 2}px ${styles.shadowBlur || 4}px ${styles.shadowColor || "rgba(0,0,0,0.6)"}`;
                } else if (styles.effect === "outline") {
                  const w = Number(styles.outlineWidth) || 1;
                  (styleOverrides as any).WebkitTextStroke = `${w * 2}px ${styles.outlineColor || "#ffffff"}`;
                  (styleOverrides as any).paintOrder = "stroke fill";
                } else if (styles.effect === "glow") {
                  styleOverrides.textShadow = `0 0 ${styles.glowSize || 10}px ${styles.glowColor || "#6366f1"}`;
                }

                const alignClass = alignmentMap[styles.alignment || "center"] || "text-center";

                return (
                  <a
                    key={block.id}
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styleOverrides}
                    className={`block w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/25 transition font-medium border border-white/5 shadow-sm ${alignClass} ${styles.className || ""}`}
                  >
                    {block.text}
                  </a>
                );
              }

              // 4. Text Block (Headings & Paragraphs)
              if (block.type === "text" && block.styles) {
                const { tag = "p", text, styles } = block;
                const alignClass = alignmentMap[styles.alignment || "left"] || "text-left";
                const resolvedFontSize = styles.fontSize || themeSizeMap[tag] || "14px";

                const styleOverrides: React.CSSProperties = {
                  fontFamily: styles.fontFamily || "inherit",
                  color: styles.textColor || undefined,
                  fontSize: resolvedFontSize,
                  fontWeight: styles.fontWeight || undefined,
                  fontStyle: styles.fontStyle || undefined,
                  textAlign: styles.alignment || undefined,
                  textDecoration: styles.textDecoration || undefined,
                  textTransform: styles.textTransform as any || undefined,
                  letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
                  lineHeight: styles.lineHeight ? styles.lineHeight : undefined,
                };

                if (styles.effect === "shadow") {
                  styleOverrides.textShadow = `${styles.shadowX || 2}px ${styles.shadowY || 2}px ${styles.shadowBlur || 4}px ${styles.shadowColor || "rgba(0,0,0,0.6)"}`;
                } else if (styles.effect === "outline") {
                  const w = Number(styles.outlineWidth) || 1;
                  (styleOverrides as any).WebkitTextStroke = `${w * 2}px ${styles.outlineColor || "#ffffff"}`;
                  (styleOverrides as any).paintOrder = "stroke fill";
                } else if (styles.effect === "glow") {
                  styleOverrides.textShadow = `0 0 ${styles.glowSize || 10}px ${styles.glowColor || "#6366f1"}`;
                }

                const isNumbered = ["decimal", "lower-alpha", "upper-roman"].includes(styles.listStyle);
                const listTag = isNumbered ? "ol" : "ul";
                const hasList = styles.listStyle && styles.listStyle !== "none";

                const contentNode = hasList ? (
                  React.createElement(
                    listTag,
                    {
                      style: { listStyleType: styles.listStyle, paddingLeft: "1.2rem" },
                      className: `w-full ${alignClass}`,
                    },
                    <li>{text}</li>
                  )
                ) : (
                  text
                );

                const wrappedContent = styles.linkUrl ? (
                  <a 
                    href={styles.linkUrl} 
                    target={styles.openInNewTab ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    className="hover:underline inline-block w-full"
                  >
                    {contentNode}
                  </a>
                ) : (
                  contentNode
                );

                const tagClassMap: Record<string, string> = {
                  h1: `font-black tracking-tight w-full ${alignClass} ${styles.className || ""}`,
                  h2: `font-bold tracking-tight w-full ${alignClass} ${styles.className || ""}`,
                  h3: `font-semibold w-full ${alignClass} ${styles.className || ""}`,
                  h4: `font-medium w-full ${alignClass} ${styles.className || ""}`,
                  h5: `font-medium w-full ${alignClass} ${styles.className || ""}`,
                  h6: `font-medium w-full ${alignClass} ${styles.className || ""}`,
                  p: `w-full ${alignClass} ${styles.className || "text-neutral-300"}`,
                };

                return React.createElement(
                  tag,
                  {
                    key: block.id,
                    style: styleOverrides,
                    className: tagClassMap[tag] || tagClassMap.p,
                  },
                  wrappedContent
                );
              }

              return null;
            })
          ) : (
            <p className="text-xs opacity-50 py-4 italic">No content blocks found on this page yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
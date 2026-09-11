// components/builder/craft/CraftLivePreview.tsx
"use client";

import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { CraftAvatar, CraftButton, CraftContainer, CraftText, CraftProfileInfo } from "./UserComponents";
import { SocialIcons } from "./SocialIcons"; 
import { SiteConfig, SubPage } from "@/types/pageConfig";
import React, { useEffect, useRef } from "react";
import { AddElementsPopout } from "./AddElementsPopout";
import { RenderIndicator } from "./RenderIndicator";
import { TopControls } from "./TopControls";
import { SettingsPanel } from "./SettingsPanel";
import { LayersTree } from "./LayersTree";
import { loadCraftState, debouncedSaveCraftState, syncCraftToSimple } from "@/lib/builderStorage";

interface CraftLivePreviewProps {
  site: SiteConfig;
  setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
  activePage: SubPage;
  isAddPanelOpen: boolean;
  setIsAddPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CraftLivePreview({ 
  site, 
  setSite, 
  activePage, 
  isAddPanelOpen, 
  setIsAddPanelOpen, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}: CraftLivePreviewProps) {
  return (
    <Editor resolver={{ CraftAvatar, CraftProfileInfo, CraftButton, CraftContainer, CraftText, SocialIcons }}> 
      <EditorContentManager 
        site={site} 
        setSite={setSite} 
        activePage={activePage} 
        isAddPanelOpen={isAddPanelOpen} 
        setIsAddPanelOpen={setIsAddPanelOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
    </Editor>
  );
}

function EditorContentManager({ 
  site, 
  setSite, 
  activePage, 
  isAddPanelOpen, 
  setIsAddPanelOpen, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}: any) {
  const { actions, query } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  const isMountedRef = useRef(false);

 // 1. Load saved state on mount or when page slug changes
  useEffect(() => {
    isMountedRef.current = false;
    
    loadCraftState(activePage.slug).then((savedJson) => {
      if (savedJson) {
        try {
          actions.deserialize(savedJson);
          
          // Instantly sync the loaded JSON to Simple mode state (text blocks, bio, links)
          const syncedPage = syncCraftToSimple(savedJson, activePage);
          setSite((prev: SiteConfig) => {
            const updatedPages = prev.pages.map((p: SubPage) => 
              p.slug === activePage.slug ? { ...syncedPage, craftState: savedJson } : p
            );
            return { ...prev, pages: updatedPages };
          });
        } catch (e) {
          console.error("Failed to parse Craft state:", e);
        }
      }
      isMountedRef.current = true;
    });
  }, [activePage.slug]);

  // 2. Safely debounce-save and sync to Simple mode when user makes changes
  const { nodes } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  useEffect(() => {
    if (!isMountedRef.current) return; // Skip during initial load/mode switch
    
    try {
      const jsonString = query.serialize();
      
      // Save raw craft state storage
      debouncedSaveCraftState(jsonString, activePage.slug);

      // Sync and persist craftState + parsed textBlocks/links into site config state
      const syncedPage = syncCraftToSimple(jsonString, activePage);
      
      setSite((prev: SiteConfig) => {
        const updatedPages = prev.pages.map((p: SubPage) => 
          p.slug === activePage.slug ? { ...syncedPage, craftState: jsonString } : p
        );
        return { ...prev, pages: updatedPages };
      });
    } catch (err) {
      console.error("Failed to serialize Craft state:", err);
    }
  }, [nodes, query, activePage.slug]);

  return (
    <div 
      className="flex h-full w-full relative overflow-hidden transition-colors duration-200 bg-neutral-950"
      style={{ backgroundColor: activePage.backgroundColor, color: activePage.textColor }}
    >
      {/* Left Toolbar */}
      <div className="w-16 border-r border-white/10 bg-neutral-900/90 backdrop-blur-xl p-3 flex flex-col items-center gap-4 z-40 shadow-2xl relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isAddPanelOpen) {
              actions.selectNode();
            }
            setIsAddPanelOpen(!isAddPanelOpen);
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg transition ${
            isAddPanelOpen ? "bg-indigo-600 text-white" : "bg-white/5 hover:bg-white/10 text-white"
          }`}
          title="Add Elements (+)"
        >
          +
        </button>

        {isAddPanelOpen && (
          <AddElementsPopout 
            onClose={() => setIsAddPanelOpen(false)} 
            onOpenChange={(isOpen: boolean) => setIsSidebarCollapsed(isOpen)}
          />
        )}
      </div>

      {/* Main Workspace */}
      <div 
        className="flex-1 flex flex-col items-center justify-start p-12 overflow-y-auto relative"
        onClick={() => actions.selectNode()}
      >
        <div className="absolute top-6 flex items-center justify-between w-full px-12 z-30" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-4 text-xs font-medium opacity-60">
            {site.pages.map((p: SubPage) => (
              <button
                key={p.slug}
                onClick={() => setSite({ ...site, activePageSlug: p.slug })}
                className={`hover:opacity-100 transition ${p.slug === activePage.slug ? "underline font-bold opacity-100" : ""}`}
              >
                {p.title} <span className="opacity-60 text-[10px]">({p.slug})</span>
              </button>
            ))}
          </div>
          <TopControls />
        </div>

        <div className="max-w-md w-full mt-16 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
          <div id="craft-canvas-container" className="relative">
            <Frame>
              <Element canvas is={CraftContainer} background="transparent" padding={15}>
                {/* Default starting elements if the canvas is completely empty */}
                <CraftAvatar username={site.username} />
                <CraftProfileInfo 
                  username={site.username} 
                  bio={activePage.bio && activePage.bio !== "No bio provided." ? activePage.bio : ""} 
                />
                <SocialIcons socials={site.socials || activePage.socials} />
              </Element>
            </Frame>
            <RenderIndicator />
          </div>
        </div>
      </div>

      {/* Right Inspector & Layers */}
      <div 
        className="border-l border-white/10 bg-neutral-900/90 backdrop-blur-xl flex flex-col z-30 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out w-80 opacity-100" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-80 flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-white/10">
            <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-400 block mb-1">Customize</span>
            <h3 className="text-sm font-bold tracking-tight text-white mb-4">Element Inspector</h3>
            <SettingsPanel />
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-400 block mb-1">Hierarchy</span>
            <h3 className="text-sm font-bold tracking-tight text-white mb-3">Layers</h3>
            <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-3 font-mono text-xs overflow-y-auto">
              <LayersTree />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
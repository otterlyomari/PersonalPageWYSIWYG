// components/builder/craft/AddElementsPopout.tsx
"use client";

import { useEditor, Element } from "@craftjs/core";
import { CraftAvatar, CraftLinkCard, CraftContainer, CraftText, CraftProfileInfo } from "./UserComponents";
import { useState, ReactElement, useEffect, useRef } from "react";

interface AddElementsPopoutProps {
  onClose: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

type CategoryType = "text" | "image" | "button" | "box" | "layout" | "social";

export function AddElementsPopout({ onClose, onOpenChange }: AddElementsPopoutProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Automatically collapse sidebar on mount, restore on unmount/close
  useEffect(() => {
    onOpenChange?.(true);
    return () => {
      onOpenChange?.(false);
    };
  }, [onOpenChange]);

  // Handle closing with a fast fade-out animation trigger
  const handleTriggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 100); // Matches the fast exit duration
  };

  const categories = [
    { id: "text", label: "Text", icon: "✍️" },
    { id: "image", label: "Image", icon: "🖼️" },
    { id: "button", label: "Button", icon: "🔘" },
    { id: "box", label: "Box & Strip", icon: "📦" },
    { id: "layout", label: "Profile", icon: "👤" },
  ];

  return (
    <div 
      style={{ minWidth: "480px", minHeight: "380px" }}
      className={`absolute left-16 top-0 w-[720px] h-[560px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl text-white resize transition-all transform ${
        isClosing 
          ? "opacity-0 scale-95 duration-75 ease-in" 
          : "opacity-100 scale-100 duration-300 ease-out animate-in fade-in zoom-in-95"
      }`}
    >
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/90 cursor-default select-none">
        <div className="flex items-center gap-6 flex-1">
          <h3 className="text-sm font-bold tracking-wide uppercase text-neutral-200">Add Elements</h3>
          
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs">🔍</span>
            <input 
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button 
          onClick={handleTriggerClose} 
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Category List */}
        <div className="w-52 border-r border-white/10 bg-black/20 p-3 space-y-1 overflow-y-auto">
          <span className="text-[9px] font-mono uppercase text-neutral-500 tracking-wider px-3 pb-1 block">Categories</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                activeCategory === cat.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-neutral-950/40">
          {activeCategory === "text" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider block mb-3">Themed Text — Headings</span>
                <div className="grid grid-cols-2 gap-3">
                  <PresetItem label="Add Heading 1" previewClass="text-2xl font-black" element={<CraftText text="Heading 1 Placeholder" tag="h1" className="text-2xl font-black" /> } onClose={handleTriggerClose} />
                  <PresetItem label="Add Heading 2" previewClass="text-xl font-bold" element={<CraftText text="Heading 2 Placeholder" tag="h2" className="text-xl font-bold" />} onClose={handleTriggerClose} />
                  <PresetItem label="Add Heading 3" previewClass="text-lg font-semibold" element={<CraftText text="Heading 3 Placeholder" tag="h3" className="text-lg font-semibold" />} onClose={handleTriggerClose} />
                  <PresetItem label="Add Heading 4" previewClass="text-base font-medium" element={<CraftText text="Heading 4 Placeholder" tag="h4" className="text-base font-medium" />} onClose={handleTriggerClose} />
                  <PresetItem label="Add Heading 5" previewClass="text-xs font-medium" element={<CraftText text="Heading 5 Placeholder" tag="h5" className="text-xs font-medium" />} onClose={handleTriggerClose} />
                  <PresetItem label="Add Heading 6" previewClass="text-[10px] font-medium" element={<CraftText text="Heading 6 Placeholder" tag="h6" className="text-[10px] font-medium" />} onClose={handleTriggerClose} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider block mb-3">Paragraphs & Titles</span>
                <div className="grid grid-cols-1 gap-2.5">
                  <PresetItem label="Paragraph (Medium Body Text)" previewClass="text-xs text-neutral-300" element={<CraftText text="Paragraph body content goes here..." tag="p" className="text-xs text-neutral-300" />} onClose={handleTriggerClose} />
                </div>
              </div>
            </div>
          )}

          {activeCategory === "layout" && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider block mb-3">Profile Components</span>
              <div className="grid grid-cols-1 gap-3">
                <PresetItem label="Profile Header Block" previewClass="text-sm font-bold" element={<CraftAvatar username="NewUser" />} onClose={handleTriggerClose} />
                <PresetItem label="Profile Header Block" previewClass="text-sm font-bold" element={<CraftProfileInfo username="@username" bio="Bio text content goes here..." />} onClose={handleTriggerClose} />
                <PresetItem label="Container Box Wrapper" previewClass="text-sm font-medium" element={<Element canvas is={CraftContainer} background="rgba(255,255,255,0.05)" padding={20} />} onClose={handleTriggerClose} />
              </div>
            </div>
          )}

          {activeCategory === "button" && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider block mb-3">Button Components</span>
              <div className="grid grid-cols-1 gap-3">
                <PresetItem label="Standard Link Card" previewClass="text-sm font-medium" element={<CraftLinkCard title="New Link Destination" url="https://..." />} onClose={handleTriggerClose} />
              </div>
            </div>
          )}

          {["image", "box"].includes(activeCategory) && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
              <span className="text-2xl">🚧</span>
              <p className="text-xs font-medium text-white capitalize">{activeCategory} Elements Preset</p>
              <p className="text-[11px] text-neutral-500">Presets for this category are ready to be linked to your custom user components.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

interface PresetItemProps {
  label: string;
  previewClass: string;
  element: ReactElement;
  onClose: () => void;
}

function PresetItem({ label, previewClass, element, onClose }: PresetItemProps) {
  const { connectors, query, actions } = useEditor();
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Enable native Craft.js drag-and-drop wiring using connectors.create
  useEffect(() => {
      if (itemRef.current) {
        try {
          connectors.create(itemRef.current, () => query.parseReactElement(element).toNodeTree());
        } catch (err) {
          console.error("Failed to bind drag connector:", err);
        }
      }
    }, [connectors, query, element]);

  const handleAddElement = () => {
    try {
      const nodeTree = query.parseReactElement(element).toNodeTree();
      const rootNode = nodeTree.nodes[nodeTree.rootNodeId];
      
      if (rootNode) {
        actions.add(rootNode, "ROOT");
      }
      onClose();
    } catch (error) {
      console.error("Failed to add element to Craft canvas:", error);
    }
  };

  return (
      <div
        ref={itemRef}
        onClick={handleAddElement}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          onClose(); // Close the popout once the drop/drag cycle fully wraps up!
        }}
        className={`p-4 rounded-xl bg-white/5 hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing transition flex flex-col gap-2 group ${
          isDragging ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
        title="Click to add or drag directly onto the canvas"
      >
        <span className={`text-neutral-100 group-hover:text-indigo-300 transition ${previewClass}`}>{label}</span>
        <span className="text-[9px] font-mono uppercase text-neutral-500">Drag or Click to Add</span>
      </div>
    );
}
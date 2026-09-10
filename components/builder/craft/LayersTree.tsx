// components/builder/craft/LayersTree.tsx
"use client";

import { useEditor } from "@craftjs/core";
import React, { useState, useEffect, useRef } from "react";

export function LayersTree() {
  const { nodes, actions, selectedId } = useEditor((state) => ({
    nodes: state.nodes,
    selectedId: state.events.selected.size > 0 ? Array.from(state.events.selected)[0] : null,
  }));

  const [contextMenu, setContextMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!nodes["ROOT"]) return null;

  const handleRenameSubmit = (id: string) => {
    if (tempName.trim()) {
      actions.setCustom(id, (custom: any) => {
        custom.userDefinedName = tempName.trim();
      });
    }
    setRenamingId(null);
    setContextMenu(null);
  };

  // Recursive tree node renderer
  const renderTreeNode = (id: string, depth = 0) => {
    const node = nodes[id];
    if (!node) return null;

    const isSelected = selectedId === id;
    const isRenaming = renamingId === id;

    const rawName = node.data.name || "";
    const baseName = node.data.custom?.userDefinedName || rawName.replace(/^Craft/, "").replace(/([A-Z])/g, " $1").trim();
    const childIds = node.data.nodes || [];

    return (
      <div key={id} className="flex flex-col select-none">
        <div
          onClick={() => actions.selectNode(id)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            actions.selectNode(id);
            
            // Calculate position relative to the tree container or viewport safely
            const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
            setContextMenu({
              id,
              top: e.clientY - containerRect.top,
              left: e.clientX - containerRect.left,
            });
          }}
          className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-[11px] transition ${
            isSelected ? "bg-indigo-600/30 text-white border border-indigo-500/40" : "text-neutral-300 hover:bg-white/5"
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 16)}px` }}
        >
          <div className="flex items-center gap-2 truncate flex-1">
            <span className="opacity-40 text-[9px]">{childIds.length > 0 ? "📂" : "📄"}</span>
            {isRenaming ? (
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => handleRenameSubmit(id)}
                onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(id)}
                onClick={(e) => e.stopPropagation()}
                className="bg-black/80 border border-indigo-500 rounded px-1 text-xs text-white outline-none w-full"
              />
            ) : (
              <span className="truncate font-medium">{baseName}</span>
            )}
          </div>
          <span className="text-[9px] opacity-30 font-mono ml-2">{id.slice(0, 4)}</span>
        </div>

        {/* Render Children Recursively */}
        {childIds.length > 0 && (
          <div className="flex flex-col space-y-1 mt-0.5 border-l border-white/5 ml-3 pl-1">
            {childIds.map((childId) => renderTreeNode(childId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="space-y-1 relative h-full">
      {renderTreeNode("ROOT")}

      {/* Context Menu Positioned Locally */}
      {contextMenu && (
        <div
          ref={menuRef}
          style={{ top: contextMenu.top, left: contextMenu.left }}
          className="absolute z-50 w-36 bg-neutral-900 border border-white/15 rounded-xl shadow-2xl py-1.5 text-xs text-white backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={() => {
              const node = nodes[contextMenu.id];
              const rawName = node?.data.name || "";
              setTempName(node?.data.custom?.userDefinedName || rawName.replace(/^Craft/, "").replace(/([A-Z])/g, " $1").trim());
              setRenamingId(contextMenu.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 transition flex items-center gap-2 text-neutral-200"
          >
            ✏️ Rename Layer
          </button>
          
          {contextMenu.id !== "ROOT" && (
            <button
              onClick={() => {
                actions.delete(contextMenu.id);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-red-500/20 text-red-400 transition flex items-center gap-2"
            >
              🗑️ Delete Layer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
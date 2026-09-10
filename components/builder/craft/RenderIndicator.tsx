// components/builder/craft/RenderIndicator.tsx
"use client";

import { useEditor } from "@craftjs/core";
import { useState, useEffect } from "react";

export function RenderIndicator() {
  const { active, name, dom, actions, parent } = useEditor((state) => {
    const [activeId] = state.events.selected;
    const currentSelectedNode = activeId ? state.nodes[activeId] : null;
    return {
      active: activeId,
      name: currentSelectedNode ? currentSelectedNode.data.name : null,
      dom: currentSelectedNode ? currentSelectedNode.dom : null,
      parent: currentSelectedNode && currentSelectedNode.data.parent ? currentSelectedNode.data.parent : null,
    };
  });

  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (dom) {
      const updatePosition = () => {
        const container = document.getElementById("craft-canvas-container");
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const domRect = dom.getBoundingClientRect();

        setCoords({
          top: domRect.top - containerRect.top,
          left: domRect.left - containerRect.left,
          width: domRect.width,
          height: domRect.height,
        });
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      
      const observer = new ResizeObserver(updatePosition);
      observer.observe(dom);

      return () => {
        window.removeEventListener("resize", updatePosition);
        observer.disconnect();
      };
    } else {
      setCoords(null);
    }
  }, [dom]);

  if (!active || !dom || !coords) return null;

  // Automatically clean up the name (e.g., CraftLinkCard -> Link Card)
  const rawName = name || "";
  const cleanName = rawName
    .replace(/^Craft/, "")
    .replace(/([A-Z])/g, " $1")
    .trim();

  return (
    <div 
      className="absolute pointer-events-none z-50 border-2 border-indigo-500 bg-indigo-500/5 rounded-xl transition-all duration-75"
      style={{
        top: coords.top - 4,
        left: coords.left - 4,
        width: coords.width + 8,
        height: coords.height + 8,
      }}
    >
      <div className="absolute -top-10 left-0 bg-indigo-600 text-white rounded-lg shadow-2xl px-3 py-1.5 flex items-center gap-3 pointer-events-auto text-xs font-medium">
        <span className="font-bold">{cleanName}</span>
        <div className="flex items-center gap-2 border-l border-indigo-400/50 pl-2">
          {parent && (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.selectNode(parent); }}
              className="hover:text-indigo-200 transition text-[10px]"
              title="Select Parent"
            >
              ⬆ Parent
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); actions.delete(active); }}
            className="hover:text-red-200 transition"
            title="Delete Component"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
// components/builder/craft/SettingsPanel.tsx
"use client";

import { useEditor } from "@craftjs/core";
import React from "react";

export function SettingsPanel() {
  const { active, selected, relatedToolbar } = useEditor((state) => {
    const [selectedId] = state.events.selected;
    const selectedNode = selectedId ? state.nodes[selectedId] : null;
    return {
      active: selectedId,
      selected: selectedNode,
      relatedToolbar: selectedNode && selectedNode.related && selectedNode.related.toolbar ? selectedNode.related.toolbar : null,
    };
  });

  if (!active || !selected) {
    return (
      <p className="text-xs opacity-40 italic py-2">Click any component on the canvas to configure properties.</p>
    );
  }

  // Automatically strip "Craft" and space out camel case (e.g. CraftLinkCard -> Link Card)
  const rawName = selected.data.name || "";
  const cleanName = rawName
    .replace(/^Craft/, "")
    .replace(/([A-Z])/g, " $1")
    .trim();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase opacity-50 block text-neutral-400">Selected</label>
        <p className="text-xs font-bold text-indigo-300">{cleanName}</p>
      </div>
      <div className="h-[1px] bg-white/10 my-2" />
      {relatedToolbar ? (
        React.createElement(relatedToolbar)
      ) : (
        <p className="text-xs opacity-50 italic">No customizable properties.</p>
      )}
    </div>
  );
}
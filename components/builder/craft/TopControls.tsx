// components/builder/craft/TopControls.tsx
"use client";

import { useEditor } from "@craftjs/core";

export function TopControls() {
  const { canUndo, canRedo, actions } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
      <button
        disabled={!canUndo}
        onClick={() => actions.history.undo()}
        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
      >
        Undo
      </button>
      <button
        disabled={!canRedo}
        onClick={() => actions.history.redo()}
        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
      >
        Redo
      </button>
    </div>
  );
}
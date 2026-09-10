// components/builder/ContextMenu.tsx
"use client";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEditProperties: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onEditProperties,
  onDelete,
  onBringForward,
  onSendBackward,
}: ContextMenuProps) {
  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        style={{ top: y, left: x }}
        className="absolute w-48 rounded-xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl py-1 text-xs text-white z-50 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onEditProperties();
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-indigo-600/50 flex items-center justify-between transition"
        >
          <span>Properties & Size</span>
          <span className="opacity-40 font-mono text-[10px]">⚙️</span>
        </button>
        <div className="h-[1px] bg-white/10 my-1" />
        <button
          onClick={() => {
            onBringForward();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-white/10 transition"
        >
          Bring Forward
        </button>
        <button
          onClick={() => {
            onSendBackward();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-white/10 transition"
        >
          Send Backward
        </button>
        <div className="h-[1px] bg-white/10 my-1" />
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 flex items-center justify-between transition font-medium"
        >
          <span>Delete Element</span>
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );
}
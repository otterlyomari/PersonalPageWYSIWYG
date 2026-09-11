"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface CraftContainerProps {
  background: string;
  padding: number;
  children?: React.ReactNode;
}

export const CraftContainer = ({ background, padding, children }: CraftContainerProps) => {
  const { connectors: { connect } } = useNode();
  
  return (
    <div 
      ref={(ref) => { if (ref) connect(ref); }} 
      style={{ background, padding: `${padding}px` }} 
      className="rounded-2xl border border-white/10 backdrop-blur-md bg-black/30 shadow-2xl min-h-[150px] space-y-3 transition-all"
    >
      {children}
    </div>
  );
};

const ContainerSettings = () => {
  const { actions: { setProp }, padding } = useNode((node) => ({
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Padding ({padding}px)</label>
        <input
          type="range"
          min="5"
          max="40"
          value={padding || 20}
          onChange={(e) => setProp((props: any) => (props.padding = Number(e.target.value)))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

CraftContainer.craft = {
  props: { background: "transparent", padding: 20 },
  rules: {
    canMoveIn: () => true,
  },
  related: {
    settings: ContainerSettings,
    toolbar: ContainerSettings,
  },
};
"use client";

import { useNode, Element } from "@craftjs/core";
import React from "react";
import { CraftText } from "./CraftText";

interface CraftButtonProps {
  url: string;
  openInNewTab: boolean;
  background: string;
  borderColor: string;
  borderRadius: string;
  children?: React.ReactNode;
}

export const CraftButton = ({
  url,
  openInNewTab,
  background,
  borderColor,
  borderRadius,
  children,
}: CraftButtonProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        background: background || "rgba(255, 255, 255, 0.1)",
        borderColor: borderColor || "rgba(255, 255, 255, 0.05)",
        borderRadius: borderRadius || "12px",
      }}
      className="w-full py-3 px-4 border shadow-sm cursor-pointer hover:opacity-90 transition flex items-center justify-center relative group"
    >
      {url ? (
        <a 
          href={url} 
          target={openInNewTab ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          className="w-full h-full flex items-center justify-center"
          onClick={(e) => e.preventDefault()}
        >
          {/* 
            Using <Element> registers this CraftText node into Craft.js's tree 
            so it officially becomes a child node visible in your Layers panel!
          */}
          <Element id="button-text" is={CraftText} text="Click Me" alignment="center" />
        </a>
      ) : (
        <Element id="button-text" is={CraftText} text="Click Me" alignment="center" />
      )}
    </div>
  );
};

const ButtonSettings = () => {
  const { actions: { setProp }, url, openInNewTab, background, borderColor, borderRadius } = useNode((node) => ({
    url: node.data.props.url,
    openInNewTab: node.data.props.openInNewTab,
    background: node.data.props.background,
    borderColor: node.data.props.borderColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="space-y-3 pb-6">
      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Destination URL</label>
        <input
          type="text"
          value={url || ""}
          onChange={(e) => setProp((props: any) => (props.url = e.target.value))}
          placeholder="https://example.com"
          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="btnNewTab"
          checked={openInNewTab || false}
          onChange={(e) => setProp((props: any) => (props.openInNewTab = e.target.checked))}
          className="rounded bg-neutral-950 border-white/10 accent-indigo-600 cursor-pointer"
        />
        <label htmlFor="btnNewTab" className="text-[10px] text-neutral-300 cursor-pointer select-none">
          Open link in new tab
        </label>
      </div>
    </div>
  );
};

CraftButton.craft = {
  props: {
    url: "https://example.com",
    openInNewTab: true,
    background: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
  },
  rules: {
    canMoveIn: (incomingNodes: any) => {
      return incomingNodes.every((node: any) => node.data.name === "CraftText");
    },
  },
  related: {
    settings: ButtonSettings,
    toolbar: ButtonSettings,
  },
};
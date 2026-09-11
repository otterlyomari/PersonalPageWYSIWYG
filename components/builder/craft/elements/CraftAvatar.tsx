"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface CraftAvatarProps {
  username: string;
}

export const CraftAvatar = ({ username }: CraftAvatarProps) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className="flex justify-center p-2 cursor-pointer group">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold tracking-wider border border-white/10 group-hover:border-indigo-500 transition">
        {username ? username.slice(0, 2).toUpperCase() : "OP"}
      </div>
    </div>
  );
};

const AvatarSettings = () => {
  const { actions: { setProp }, username } = useNode((node) => ({
    username: node.data.props.username,
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Username (for Initials)</label>
        <input
          type="text"
          value={username || ""}
          onChange={(e) => setProp((props: any) => (props.username = e.target.value))}
          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

CraftAvatar.craft = {
  props: { username: "username" },
  related: {
    settings: AvatarSettings,
    toolbar: AvatarSettings,
  },
};
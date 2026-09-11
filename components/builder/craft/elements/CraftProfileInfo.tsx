// components/builder/craft/UserComponents.tsx (or wherever CraftProfileInfo is defined)
"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface CraftProfileInfoProps {
  username?: string;
  bio?: string;
}

export const CraftProfileInfo = (_props: CraftProfileInfoProps) => {
  const { connectors: { connect, drag }, username, bio } = useNode((node) => ({
    username: node.data.props.username,
    bio: node.data.props.bio,
  }));

  // If bio is empty, undefined, or the old placeholder, treat it as empty
  const hasValidBio = bio && bio !== "No bio provided." && bio.trim() !== "";
  const displayBio = hasValidBio ? bio : "";

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} className="text-center space-y-1 p-2 cursor-pointer">
      <h2 className="text-2xl font-bold">@{username || "username"}</h2>
      <p className="text-sm opacity-80">{displayBio || "No bio provided."}</p>
    </div>
  );
};

const ProfileInfoSettings = () => {
  const { actions: { setProp }, bio } = useNode((node) => ({
    bio: node.data.props.bio,
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Bio</label>
        <textarea
          value={bio === "No bio provided." ? "" : (bio || "")}
          onChange={(e) => setProp((props: any) => (props.bio = e.target.value))}
          rows={2}
          placeholder="Enter your bio..."
          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>
    </div>
  );
};

CraftProfileInfo.craft = {
  props: { username: "username", bio: "" },
  related: {
    settings: ProfileInfoSettings,
    toolbar: ProfileInfoSettings,
  },
};
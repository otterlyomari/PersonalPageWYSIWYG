// components/builder/craft/CraftSocialIcons.tsx
"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface SocialLinkItem {
  id: string;
  url: string;
}

interface CraftSocialIconsProps {
  socials: SocialLinkItem[];
}

// Helper to detect platform and return Font Awesome 6 class string
function getSocialIconClass(url: string) {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("x.com")) return "fa-brands fa-x-twitter";
  if (lowerUrl.includes("twitter.com")) return "fa-brands fa-twitter";
  if (lowerUrl.includes("github.com")) return "fa-brands fa-github";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "fa-brands fa-youtube";
  if (lowerUrl.includes("instagram.com")) return "fa-brands fa-instagram";
  if (lowerUrl.includes("linkedin.com")) return "fa-brands fa-linkedin-in";
  if (lowerUrl.includes("discord.gg") || lowerUrl.includes("discord.com")) return "fa-brands fa-discord";
  if (lowerUrl.includes("twitch.tv")) return "fa-brands fa-twitch";
  if (lowerUrl.includes("tiktok.com")) return "fa-brands fa-tiktok";
  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) return "fa-brands fa-facebook-f";
  if (lowerUrl.includes("reddit.com")) return "fa-brands fa-reddit-alien";
  return "fa-solid fa-globe"; // Fallback generic globe icon
}

export const SocialIcons = ({ socials = [] }: CraftSocialIconsProps) => {
  // Safely handle useNode so it doesn't crash when rendered outside the Craft Editor context
  let connect = (node: HTMLElement) => node;
  let drag = (node: HTMLElement) => node;

  try {
    const nodeContext = useNode();
    connect = nodeContext.connectors.connect;
    drag = nodeContext.connectors.drag;
  } catch (e) {
    // Outside editor context - safe to ignore
  }

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className="flex items-center justify-center gap-3 cursor-pointer group"
    >
      {socials.length === 0 ? (
        <span className="text-xs text-neutral-500 italic">No social links added yet</span>
      ) : (
        socials.map((social) => {
          const iconClass = getSocialIconClass(social.url);
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white text-xs transition shadow-sm hover:scale-105"
              title={social.url}
              onClick={(e) => e.preventDefault()} // Prevent navigation while inside builder
            >
              <span className={`${iconClass} text-sm`} />
            </a>
          );
        })
      )}
    </div>
  );
};

// Inspector Controls Panel for Social Icons
const SocialIconsSettings = () => {
  const { actions: { setProp }, socials } = useNode((node) => ({
    socials: node.data.props.socials || [],
  }));

  const handleAddSocial = () => {
    const newSocial = { id: Date.now().toString(), url: "https://twitter.com/" };
    setProp((props: any) => {
      props.socials = [...(props.socials || []), newSocial];
    });
  };

  const handleUpdateSocial = (id: string, newUrl: string) => {
    setProp((props: any) => {
      props.socials = props.socials.map((s: SocialLinkItem) => 
        s.id === id ? { ...s, url: newUrl } : s
      );
    });
  };

  const handleDeleteSocial = (id: string) => {
    setProp((props: any) => {
      props.socials = props.socials.filter((s: SocialLinkItem) => s.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Social Profiles</label>
        <button
          onClick={handleAddSocial}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] font-medium transition text-white"
        >
          + Add Social
        </button>
      </div>

      <div className="space-y-2">
        {socials.map((social: SocialLinkItem) => (
          <div key={social.id} className="flex items-center gap-2">
            <input
              type="text"
              value={social.url}
              onChange={(e) => handleUpdateSocial(social.id, e.target.value)}
              placeholder="https://x.com/username"
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleDeleteSocial(social.id)}
              className="p-1.5 text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
        {socials.length === 0 && (
          <p className="text-[11px] text-neutral-500 italic">Click add to configure social accounts.</p>
        )}
      </div>
    </div>
  );
};

SocialIcons.craft = {
  props: { socials: [] },
  related: {
    settings: SocialIconsSettings,
    toolbar: SocialIconsSettings,
  },
};
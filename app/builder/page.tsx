// app/builder/page.tsx
"use client";

import { useState } from "react";
import { PageConfig } from "@/types/pageConfig";

export default function BuilderPage() {
  // Initial state for the user's page
  const [config, setConfig] = useState<PageConfig>({
    username: "otterlyomari",
    bio: "Minimalist creator and developer building web tools.",
    backgroundColor: "#0a0a0a",
    textColor: "#f5f5f5",
    links: [
      { id: "1", title: "GitHub", url: "https://github.com" },
      { id: "2", title: "Personal Website", url: "https://otterlyomari.github.io" },
    ],
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100 font-sans">
      
      {/* LEFT SIDE: Control Sidebar */}
      <div className="w-1/3 border-r border-neutral-800 p-6 flex flex-col gap-6 overflow-y-auto bg-neutral-950">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Page Editor</h1>
          <p className="text-xs text-neutral-400">Customize your space in real time.</p>
        </div>

        {/* Username Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-300">Username / Slug</label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Bio Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-300">Bio</label>
          <textarea
            value={config.bio}
            onChange={(e) => setConfig({ ...config, bio: e.target.value })}
            rows={3}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm focus:outline-none focus:border-neutral-650 resize-none"
          />
        </div>

        {/* Color Customization */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-300">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border border-neutral-800"
            />
            <span className="text-xs text-neutral-400 font-mono">{config.backgroundColor}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Live Preview Canvas */}
      <div 
        className="w-2/3 flex items-center justify-center p-8 transition-colors duration-200"
        style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
      >
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-black/20 shadow-2xl">
          
          {/* Avatar / Initials Placeholder */}
          <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold tracking-wider">
            {config.username ? config.username.slice(0, 2).toUpperCase() : "OP"}
          </div>

          {/* Username & Bio */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">@{config.username || "username"}</h2>
            <p className="text-sm opacity-80 leading-relaxed">{config.bio || "Your bio will appear here..."}</p>
          </div>

          {/* Links Section */}
          <div className="space-y-3 pt-2">
            {config.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium text-sm border border-white/5 shadow-sm"
              >
                {link.title}
              </a>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
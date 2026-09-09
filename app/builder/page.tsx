// app/builder/page.tsx
"use client";

import { useState } from "react";
import { SiteConfig, PageLink, SubPage } from "@/types/pageConfig";

export default function BuilderPage() {
  const [site, setSite] = useState<SiteConfig>({
    username: "otterlyomari",
    activeMode: "simple",
    activePageSlug: "/",
    pages: [
      {
        slug: "/",
        title: "Home",
        bio: "", // Exclusive to Home
        backgroundColor: "#0a0a0a",
        textColor: "#f5f5f5",
        links: [
        ],
        blocks: [],
      },
    ],
  });

  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const activePage = site.pages.find((p) => p.slug === site.activePageSlug) || site.pages[0];

  const updateActivePage = (updatedFields: Partial<SubPage>) => {
    const updatedPages = site.pages.map((p) =>
      p.slug === site.activePageSlug ? { ...p, ...updatedFields } : p
    );
    setSite({ ...site, pages: updatedPages });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    const newLink: PageLink = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl,
    };

    updateActivePage({
      links: [...activePage.links, newLink],
    });

    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleDeleteLink = (id: string) => {
    updateActivePage({
      links: activePage.links.filter((link) => link.id !== id),
    });
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;

    let formattedSlug = newPageSlug.trim();
    if (!formattedSlug.startsWith("/")) {
      formattedSlug = "/" + formattedSlug;
    }
    formattedSlug = formattedSlug.toLowerCase().replace(/\s+/g, "-");

    if (site.pages.some((p) => p.slug === formattedSlug)) {
      alert("A page with this slug already exists!");
      return;
    }

    const newSubPage: SubPage = {
      slug: formattedSlug,
      title: newPageTitle.trim(),
      backgroundColor: "#0a0a0a",
      textColor: "#f5f5f5",
      links: [],
      blocks: [],
    };

    setSite({
      ...site,
      pages: [...site.pages, newSubPage],
      activePageSlug: formattedSlug,
    });

    setNewPageTitle("");
    setNewPageSlug("");
  };

  const handleDeletePage = (slugToDelete: string) => {
    if (slugToDelete === "/") {
      alert("You cannot delete the root Home page.");
      return;
    }

    const remainingPages = site.pages.filter((p) => p.slug !== slugToDelete);
    setSite({
      ...site,
      pages: remainingPages,
      activePageSlug: "/",
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100 font-sans">
      
      {/* LEFT SIDE: Control Sidebar */}
      <div className="w-1/3 border-r border-neutral-800 p-6 flex flex-col gap-6 overflow-y-auto bg-neutral-950">
        
        {/* Top Header & Mode Switcher */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Page Editor</h1>
            <p className="text-xs text-neutral-400">Multi-page SaaS builder.</p>
          </div>
          
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setSite({ ...site, activeMode: "simple" })}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                site.activeMode === "simple" ? "bg-neutral-100 text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setSite({ ...site, activeMode: "advanced" })}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                site.activeMode === "advanced" ? "bg-neutral-100 text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Global Site Settings */}
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
          <label className="text-xs font-medium text-neutral-400">Global Username / Slug</label>
          <input
            type="text"
            value={site.username}
            onChange={(e) => setSite({ ...site, username: e.target.value })}
            className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Page Switcher & Creator Section */}
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
          <h2 className="text-sm font-semibold text-neutral-200">Your Pages</h2>
          
          <div className="flex flex-col gap-2">
            {site.pages.map((page) => (
              <div 
                key={page.slug}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                  site.activePageSlug === page.slug
                    ? "bg-neutral-100 text-neutral-950 border-neutral-100 font-medium"
                    : "bg-neutral-950 text-neutral-300 border-neutral-800"
                }`}
              >
                <button
                  onClick={() => setSite({ ...site, activePageSlug: page.slug })}
                  className="flex-1 text-left truncate"
                >
                  {page.title} <span className="opacity-60 text-[10px] font-mono">({page.slug})</span>
                </button>
                
                {page.slug !== "/" && (
                  <button
                    onClick={() => handleDeletePage(page.slug)}
                    className="text-red-400 hover:text-red-300 ml-2 px-1 text-xs"
                    title="Delete Page"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCreatePage} className="flex flex-col gap-2.5 pt-3 border-t border-neutral-800">
            <p className="text-xs font-medium text-neutral-400">Create New Sub-page</p>
            <input
              type="text"
              placeholder="Page Title (e.g. Projects)"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs focus:outline-none focus:border-neutral-600"
            />
            <input
              type="text"
              placeholder="Slug (e.g. /projects)"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs focus:outline-none focus:border-neutral-600 font-mono"
            />
            <button
              type="submit"
              className="mt-1 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-medium text-xs transition"
            >
              + Add New Page
            </button>
          </form>
        </div>

        {site.activeMode === "simple" ? (
          /* ================= SIMPLE MODE CONTROLS ================= */
          <div className="flex flex-col gap-6">
            
            {/* Page Specific Settings & Home-Only Bio */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
              <h2 className="text-sm font-semibold text-neutral-200">Editing: {activePage.title}</h2>
              
              {/* Bio input only shows when editing the Home page */}
              {site.activePageSlug === "/" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-400">
                    Profile Bio <span className="text-[10px] opacity-60">(Optional)</span>
                  </label>
                  <textarea
                    value={activePage.bio || ""}
                    onChange={(e) => updateActivePage({ bio: e.target.value })}
                    placeholder="Write a brief intro for your home page..."
                    rows={2}
                    className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs focus:outline-none focus:border-neutral-600 resize-none"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-neutral-400">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activePage.backgroundColor}
                    onChange={(e) => updateActivePage({ backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border border-neutral-800"
                  />
                  <span className="text-xs text-neutral-400 font-mono">{activePage.backgroundColor}</span>
                </div>
              </div>
            </div>

            {/* Link Management for Active Page */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
              <h2 className="text-sm font-semibold text-neutral-200">Links on {activePage.title}</h2>

              <div className="space-y-2">
                {activePage.links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
                    <div className="truncate pr-2">
                      <p className="font-medium text-neutral-200">{link.title}</p>
                      <p className="text-neutral-500 truncate">{link.url}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:text-red-300 px-2 py-1 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddLink} className="flex flex-col gap-2.5 pt-2 border-t border-neutral-800">
                <p className="text-xs font-medium text-neutral-400">Add Link to {activePage.title}</p>
                <input
                  type="text"
                  placeholder="Link Title"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs focus:outline-none focus:border-neutral-600"
                />
                <input
                  type="text"
                  placeholder="URL (https://...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs focus:outline-none focus:border-neutral-600"
                />
                <button
                  type="submit"
                  className="mt-1 py-2 rounded-lg bg-neutral-100 text-neutral-950 font-medium text-xs hover:bg-neutral-200 transition"
                >
                  Add Link
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* ================= ADVANCED MODE PLACEHOLDER ================= */
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-neutral-800 rounded-xl space-y-3">
            <h2 className="text-sm font-semibold text-neutral-300">Advanced Canvas ({activePage.title})</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Drag-and-drop grid blocks for this specific sub-page will render here.
            </p>
          </div>
        )}

      </div>

      {/* RIGHT SIDE: Live Preview Canvas */}
      <div 
        className="w-2/3 flex flex-col items-center justify-center p-8 transition-colors duration-200 relative"
        style={{ backgroundColor: activePage.backgroundColor, color: activePage.textColor }}
      >
        {/* Dynamic Preview Navigation Bar */}
        <div className="absolute top-6 flex gap-4 text-xs font-medium opacity-60">
          {site.pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSite({ ...site, activePageSlug: p.slug })}
              className={`hover:opacity-100 transition ${p.slug === activePage.slug ? "underline font-bold opacity-100" : ""}`}
            >
              {p.title} <span className="opacity-60 text-[10px]">({p.slug})</span>
            </button>
          ))}
        </div>

        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-black/20 shadow-2xl">
          
          <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold tracking-wider">
            {site.username ? site.username.slice(0, 2).toUpperCase() : "OP"}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">@{site.username || "username"}</h2>
            <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">Viewing: {activePage.title} ({activePage.slug})</p>
            
            {/* Bio renders exclusively on Home if present */}
            {site.activePageSlug === "/" && activePage.bio && activePage.bio.trim() !== "" && (
              <p className="text-sm opacity-80 leading-relaxed pt-1">{activePage.bio}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {activePage.links.length === 0 ? (
              <p className="text-xs opacity-50 py-4 italic">No links on this page yet.</p>
            ) : (
              activePage.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium text-sm border border-white/5 shadow-sm"
                >
                  {link.title}
                </a>
              ))
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
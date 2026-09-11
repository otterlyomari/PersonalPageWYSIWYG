// components/builder/ControlSidebar.tsx
"use client";

import { SiteConfig, SubPage } from "@/types/pageConfig";
import { loadCraftState } from "@/lib/builderStorage";
import { syncCraftToSimple } from "@/lib/builderStorage"; // Import your new extractor

interface SocialLinkItem {
  id: string;
  url: string;
}

interface ControlSidebarProps {
  site: SiteConfig;
  setSite: React.Dispatch<React.SetStateAction<SiteConfig>>;
  activePage: SubPage;
  updateActivePage: (updatedFields: Partial<SubPage>) => void;
  newLinkTitle: string;
  setNewLinkTitle: (val: string) => void;
  newLinkUrl: string;
  setNewLinkUrl: (val: string) => void;
  newPageTitle: string;
  setNewPageTitle: (val: string) => void;
  newPageSlug: string;
  setNewPageSlug: (val: string) => void;
  handleAddLink: (e: React.FormEvent) => void;
  handleDeleteLink: (id: string) => void;
  handleCreatePage: (e: React.FormEvent) => void;
  handleDeletePage: (slug: string) => void;
  isSidebarCollapsed?: boolean;
}

export function ControlSidebar({
  site,
  setSite,
  activePage,
  updateActivePage,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
  newPageTitle,
  setNewPageTitle,
  newPageSlug,
  setNewPageSlug,
  handleAddLink,
  handleDeleteLink,
  handleCreatePage,
  handleDeletePage,
  isSidebarCollapsed,
}: ControlSidebarProps) {

  // Handlers for managing home page socials from the sidebar
  const handleAddSidebarSocial = () => {
    const newSocial: SocialLinkItem = { id: Date.now().toString(), url: "https://twitter.com/" };
    const currentSocials = activePage.socials || [];
    updateActivePage({ socials: [...currentSocials, newSocial] });
  };

  const handleUpdateSidebarSocial = (id: string, newUrl: string) => {
    const currentSocials = activePage.socials || [];
    const updated = currentSocials.map((s) => s.id === id ? { ...s, url: newUrl } : s);
    updateActivePage({ socials: updated });
  };

  const handleDeleteSidebarSocial = (id: string) => {
    const currentSocials = activePage.socials || [];
    const updated = currentSocials.filter((s) => s.id !== id);
    updateActivePage({ socials: updated });
  };

  return (
    <div className={`border-r border-neutral-800 bg-neutral-950 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
      isSidebarCollapsed ? "w-0 opacity-0 p-0 border-r-0 pointer-events-none" : "w-1/3 p-6 gap-6 overflow-y-auto"
    }`}>
      {/* Inner fixed-width wrapper to prevent layout squishing during collapse animation */}
      <div className="w-[380px] flex flex-col gap-6 flex-shrink-0">
        
        {/* Top Header & Mode Switcher */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Page Editor</h1>
            <p className="text-xs text-neutral-400">Multi-page SaaS builder.</p>
          </div>
          
         <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={async () => {
                // If leaving advanced mode, sync canvas elements back to simple mode state first!
                if (site.activeMode === "advanced") {
                  const savedCraftJson = await loadCraftState(activePage.slug);
                  if (savedCraftJson) {
                    const updatedPage = syncCraftToSimple(savedCraftJson, activePage);
                    setSite((prev) => ({
                      ...prev,
                      activeMode: "simple",
                      pages: prev.pages.map((p) => p.slug === activePage.slug ? updatedPage : p)
                    }));
                    return;
                  }
                }
                setSite({ ...site, activeMode: "simple" });
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                site.activeMode === "simple" ? "bg-neutral-100 text-neutral-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              Simple
            </button>
            <button
              onClick={async () => {
                // When switching TO advanced mode, inject activePage.bio into the stored Craft JSON
                const storageKey = `craft_state_${activePage.slug}`;
                const savedCraftJson = await loadCraftState(activePage.slug);

                if (savedCraftJson) {
                  try {
                    const parsed = JSON.parse(savedCraftJson);
                    let modified = false;

                    const nodesObj = parsed.nodes || parsed;
                    Object.keys(nodesObj).forEach((nodeId) => {
                      const node = nodesObj[nodeId];
                      const name = node.name || node.data?.name || node.type?.resolvedName || node.data?.type?.resolvedName;
                      
                      if (name === "CraftProfileInfo") {
                        const props = node.props || node.data?.props;
                        if (props) {
                          const targetBio = activePage.bio || "";
                          if (props.bio !== targetBio) {
                            props.bio = targetBio;
                            modified = true;
                          }
                        }
                      }
                    });

                    if (modified) {
                      localStorage.setItem(storageKey, JSON.stringify(parsed));
                    }
                  } catch (e) {
                    console.error("Failed to sync bio to Craft state on mode switch:", e);
                  }
                }

                setSite({ ...site, activeMode: "advanced" });
              }}
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
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
              <h2 className="text-sm font-semibold text-neutral-200">Editing: {activePage.title}</h2>
              
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

            {/* Social Icons Section (Only displays on Home page "/") */}
            {site.activePageSlug === "/" && (
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-neutral-200">Social Profiles</h2>
                  <button
                    onClick={handleAddSidebarSocial}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[11px] font-medium transition text-white"
                  >
                    + Add Social
                  </button>
                </div>

                <div className="space-y-2">
                  {(activePage.socials || []).map((social) => (
                    <div key={social.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={social.url}
                        onChange={(e) => handleUpdateSidebarSocial(social.id, e.target.value)}
                        placeholder="https://x.com/username"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
                      />
                      <button
                        onClick={() => handleDeleteSidebarSocial(social.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!activePage.socials || activePage.socials.length === 0) && (
                    <p className="text-[11px] text-neutral-500 italic">No social links added to home yet.</p>
                  )}
                </div>
              </div>
            )}

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
          /* ================= ADVANCED MODE CONTROLS (CRAFT.JS INTEGRATED) ================= */
          <div className="flex flex-col gap-6">
            <>
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
            </>
            {/* Template Selector Trigger */}
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 space-y-3">
              <h2 className="text-sm font-semibold text-neutral-200">Layout & Templates</h2>
              <button
                onClick={() => {
                  alert("Template collection library coming soon! This will inject pre-built Craft.js nodes seamlessly.");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-medium text-xs flex items-center justify-between transition"
              >
                <span>Choose Template</span>
                <span className="text-[10px] opacity-60 font-mono">✨ Empty Collection</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
// app/builder/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SiteConfig, PageLink, SubPage } from "@/types/pageConfig";
import { ControlSidebar } from "@/components/builder/ControlSidebar";
import { LivePreview } from "@/components/builder/LivePreview";
import { loadCraftState, syncCraftToSimple } from "@/lib/builderStorage";

export default function BuilderPage() {
  const [site, setSite] = useState<SiteConfig>({
    username: "otterlyomari",
    activeMode: "simple",
    activePageSlug: "/",
    pages: [
      {
        slug: "/",
        title: "Home",
        bio: "",
        backgroundColor: "#0a0a0a",
        textColor: "#f5f5f5",
        links: [],
      },
    ],
  });

  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  
  // Lifted state to control main sidebar collapse when Advanced mode's Add Elements popout is open
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Hydrate saved Craft states into textBlocks for all pages on initial mount
  useEffect(() => {
    async function hydratePages() {
      const updatedPages = await Promise.all(
        site.pages.map(async (page) => {
          const savedJson = await loadCraftState(page.slug);
          if (savedJson) {
            // Sync text blocks, links, and bio from the saved Craft JSON
            const synced = syncCraftToSimple(savedJson, page);
            return {
              ...synced,
              craftState: savedJson,
            };
          }
          return page;
        })
      );

      setSite((prev) => ({
        ...prev,
        pages: updatedPages,
      }));
    }

    hydratePages();
  }, []);

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
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100 font-sans" onContextMenu={(e) => e.preventDefault()}>
      <ControlSidebar
        site={site}
        setSite={setSite}
        activePage={activePage}
        updateActivePage={updateActivePage}
        newLinkTitle={newLinkTitle}
        setNewLinkTitle={setNewLinkTitle}
        newLinkUrl={newLinkUrl}
        setNewLinkUrl={setNewLinkUrl}
        newPageTitle={newPageTitle}
        setNewPageTitle={setNewPageTitle}
        newPageSlug={newPageSlug}
        setNewPageSlug={setNewPageSlug}
        handleAddLink={handleAddLink}
        handleDeleteLink={handleDeleteLink}
        handleCreatePage={handleCreatePage}
        handleDeletePage={handleDeletePage}
        isSidebarCollapsed={site.activeMode === "advanced" && isSidebarCollapsed}
      />

      <LivePreview
        site={site}
        setSite={setSite}
        activePage={activePage}
        updateActivePage={updateActivePage}
        isAddPanelOpen={isAddPanelOpen}
        setIsAddPanelOpen={setIsAddPanelOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
    </div>
  );
}
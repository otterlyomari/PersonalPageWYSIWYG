// app/builder/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SiteConfig, PageLink, SubPage, ContentBlock } from "@/types/pageConfig";
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

    const linkId = Date.now().toString();
    const newLink: PageLink = {
      id: linkId,
      title: newLinkTitle,
      url: newLinkUrl,
    };

    const newContentBlock: ContentBlock = {
      id: linkId,
      type: "link" as const,
      text: newLinkTitle,
      url: newLinkUrl,
      styles: {},
    };

    let updatedCraftState = activePage.craftState;

    if (updatedCraftState && typeof updatedCraftState === "string") {
      try {
        const parsed = JSON.parse(updatedCraftState);
        const nodesObj = parsed.nodes || parsed;
        
        // Construct standard Craft.js node payload
        nodesObj[linkId] = {
          type: { resolvedName: "CraftButton" },
          isCanvas: false,
          props: {
            buttonText: newLinkTitle,
            url: newLinkUrl,
            id: linkId,
            linkId: linkId,
          },
          displayName: "CraftButton",
          custom: {},
          parent: "ROOT",
          hidden: false,
          nodes: [],
          linkedNodes: {},
        };

        // Attach node to ROOT container
        const rootNode = nodesObj["ROOT"]?.data ? nodesObj["ROOT"].data : nodesObj["ROOT"];
        if (rootNode) {
          if (!rootNode.nodes) rootNode.nodes = [];
          if (!rootNode.nodes.includes(linkId)) {
            rootNode.nodes.push(linkId);
          }
        }

        updatedCraftState = JSON.stringify(parsed);
        localStorage.setItem(`craft_state_${activePage.slug}`, updatedCraftState);
      } catch (err) {
        console.error("Failed to add CraftButton to Craft JSON state:", err);
      }
    } else {
      // Initialize fresh Craft state tree if none exists yet
      const initialCraft = {
        ROOT: {
          type: { resolvedName: "Container" },
          isCanvas: true,
          props: { background: activePage.backgroundColor || "#0a0a0a" },
          displayName: "Container",
          custom: {},
          hidden: false,
          nodes: [linkId],
          linkedNodes: {},
        },
        [linkId]: {
          type: { resolvedName: "CraftButton" },
          isCanvas: false,
          props: {
            buttonText: newLinkTitle,
            url: newLinkUrl,
            id: linkId,
            linkId: linkId,
          },
          displayName: "CraftButton",
          custom: {},
          parent: "ROOT",
          hidden: false,
          nodes: [],
          linkedNodes: {},
        }
      };
      updatedCraftState = JSON.stringify(initialCraft);
      localStorage.setItem(`craft_state_${activePage.slug}`, updatedCraftState);
    }

    const updatedLinks = [...(activePage.links || []), newLink];
    const updatedContentBlocks = [...(activePage.contentBlocks || []), newContentBlock];

    // Commit changes across all page properties to force re-render in LivePreview
    updateActivePage({
      links: updatedLinks,
      contentBlocks: updatedContentBlocks,
      craftState: updatedCraftState,
    });

    setNewLinkTitle("");
    setNewLinkUrl("");
  };

const handleDeleteLink = (id: string) => {
    let updatedCraftState = activePage.craftState;

    // 1. Prune the Craft.js JSON state first so the extractor sees it's gone
    if (updatedCraftState && typeof updatedCraftState === "string") {
      try {
        const parsed = JSON.parse(updatedCraftState);
        const nodesObj = parsed.nodes || parsed;
        
        // Find the node ID matching this link's ID (or node ID)
        const targetNodeId = Object.keys(nodesObj).find((nodeId) => {
          const node = nodesObj[nodeId];
          const name = node.name || node.data?.name || node.type?.resolvedName || node.data?.type?.resolvedName;
          const props = node.props || node.data?.props;
          return nodeId === id || props?.id === id || props?.linkId === id;
        });

        if (targetNodeId) {
          delete nodesObj[targetNodeId];

          // Remove references from parent nodes
          Object.keys(nodesObj).forEach((nodeId) => {
            const node = nodesObj[nodeId];
            const nodesList = node.nodes || node.data?.nodes;
            if (Array.isArray(nodesList)) {
              const index = nodesList.indexOf(targetNodeId);
              if (index > -1) nodesList.splice(index, 1);
            }
          });

          updatedCraftState = JSON.stringify(parsed);
          localStorage.setItem(`craft_state_${activePage.slug}`, updatedCraftState);
        }
      } catch (err) {
        console.error("Failed to prune node from Craft JSON state:", err);
      }
    }

    // 2. Filter out from activePage.links and contentBlocks
    const updatedLinks = activePage.links.filter((link) => link.id !== id);
    const updatedContentBlocks = (activePage.contentBlocks || []).filter(
      (block: any) => block.id !== id && block.linkId !== id
    );

    // 3. Run sync to ensure everything matches the new craftState
    const tempPage = { ...activePage, links: updatedLinks, contentBlocks: updatedContentBlocks, craftState: updatedCraftState };
    const finalSyncedPage = updatedCraftState ? syncCraftToSimple(updatedCraftState, tempPage) : tempPage;

    // 4. Commit to parent state
    updateActivePage({
      ...finalSyncedPage,
      links: updatedLinks,
      contentBlocks: updatedContentBlocks,
      craftState: updatedCraftState,
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
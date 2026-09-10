// lib/builderStorage.ts

const SIMPLE_STATE_KEY = "my_builder_simple_state";

import { ContentBlock, SubPage } from "@/types/pageConfig";
import { SiteConfig } from "@/types/pageConfig";

// 1. Async wrapper for simple state
export const loadSimpleState = async (defaultData: any) => {
  if (typeof window === "undefined") return defaultData;
  const saved = localStorage.getItem(SIMPLE_STATE_KEY);
  return saved ? JSON.parse(saved) : defaultData;
};

export const saveSimpleState = async (data: any): Promise<void> => {
  if (typeof window === "undefined") return;
  
  await new Promise((resolve) => setTimeout(resolve, 150));
  localStorage.setItem(SIMPLE_STATE_KEY, JSON.stringify(data));
};

// 2. Debounced async wrapper for Craft.js JSON state per page slug
let saveTimeout: NodeJS.Timeout;

export const debouncedSaveCraftState = (jsonString: string, slug: string = "/"): Promise<void> => {
  return new Promise((resolve) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(() => {
      if (typeof window !== "undefined") {
        const storageKey = `craft_state_${slug}`;
        localStorage.setItem(storageKey, jsonString);
      }
      resolve();
    }, 1000); // 1-second debounce window
  });
};

export const loadCraftState = async (slug: string = "/"): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  const storageKey = `craft_state_${slug}`;
  return localStorage.getItem(storageKey);
};

export function syncCraftToSimple(craftJsonString: string, currentActivePage: SubPage): SubPage {
  try {
    const parsedState = JSON.parse(craftJsonString);
    const nodes = parsedState.nodes || parsedState;

    const contentBlocks: ContentBlock[] = [];
    const extractedLinks: Array<{ id: string; title: string; url: string }> = [];
    let extractedBio = currentActivePage.bio;

    const visited = new Set<string>();

    function traverse(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes[nodeId];
      if (!node) return;

      const componentName = 
        node.name || 
        node.data?.name || 
        node.type?.resolvedName || 
        "Unknown";

      const props = node.props || node.data?.props || {};

      if (componentName === "CraftLinkCard") {
        if (props.title) {
          const linkItem = { id: nodeId, title: props.title, url: props.url || "#" };
          extractedLinks.push(linkItem);
          contentBlocks.push({
            id: nodeId,
            type: "link",
            text: props.title,
            url: props.url || "#",
          });
        }
      } else if (componentName === "CraftProfileInfo") {
        // Robust fallback checking props, then current page bio, defaulting to an empty string if nothing exists
        const bioValue = props.bio || props.text || currentActivePage.bio || "";
        if (bioValue.trim() !== "" && bioValue !== "No bio provided.") {
          extractedBio = bioValue;
        }
        contentBlocks.push({ id: nodeId, type: "profile", text: bioValue });
      } else if (componentName === "CraftAvatar") {
        contentBlocks.push({ id: nodeId, type: "avatar" });
      } else if (componentName === "SocialIcons") {
        contentBlocks.push({ id: nodeId, type: "socials" });
      } else if (componentName === "CraftText") {
        if (props.text) {
          contentBlocks.push({
            id: nodeId,
            type: "text",
            text: props.text,
            url: props.linkUrl,
            tag: props.tag || "p",
            styles: {
              fontFamily: props.fontFamily,
              alignment: props.alignment,
              textColor: props.textColor,
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              fontStyle: props.fontStyle,
              textDecoration: props.textDecoration,
              textTransform: props.textTransform,
              letterSpacing: props.letterSpacing,
              lineHeight: props.lineHeight,
              listStyle: props.listStyle,
              linkUrl: props.linkUrl,
              openInNewTab: props.openInNewTab,
              effect: props.effect,
              shadowColor: props.shadowColor,
              shadowBlur: props.shadowBlur,
              shadowX: props.shadowX,
              shadowY: props.shadowY,
              outlineColor: props.outlineColor,
              outlineWidth: props.outlineWidth,
              glowColor: props.glowColor,
              glowSize: props.glowSize,
              className: props.className,
            },
          });
          
          if (props.linkUrl && typeof props.linkUrl === "string" && props.linkUrl.trim() !== "") {
            extractedLinks.push({ id: nodeId, title: props.text, url: props.linkUrl });
          }
        }
      }

      // Traverse children in exact array sequence order
      const childIds = node.data?.nodes || node.nodes || [];
      childIds.forEach((childId: string) => {
        traverse(childId);
      });
    }

    if (nodes["ROOT"]) {
      traverse("ROOT");
    } else {
      Object.keys(nodes).forEach((nodeId) => traverse(nodeId));
    }

    return {
      ...currentActivePage,
      bio: extractedBio && extractedBio.trim() !== "" ? extractedBio : currentActivePage.bio,
      links: extractedLinks.length > 0 ? extractedLinks : currentActivePage.links,
      contentBlocks: contentBlocks.length > 0 ? contentBlocks : currentActivePage.contentBlocks,
    };
  } catch (err) {
    console.error("Failed to sync Craft state to Simple mode:", err);
    return currentActivePage;
  }
}

// Hydrate your initial site state on app boot
export async function hydrateSiteWithCraftData(site: SiteConfig): Promise<SiteConfig> {
  const updatedPages = await Promise.all(
    site.pages.map(async (page) => {
      const savedJson = await loadCraftState(page.slug);
      if (savedJson) {
        const syncedPage = syncCraftToSimple(savedJson, page);
        return {
          ...syncedPage,
          craftState: savedJson,
        };
      }
      return page;
    })
  );

  return {
    ...site,
    pages: updatedPages,
  };
}
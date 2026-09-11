// lib/builderStorage.ts

const SIMPLE_STATE_KEY = "my_builder_simple_state";

import { ContentBlock, SubPage } from "@/types/pageConfig";
import { SiteConfig } from "@/types/pageConfig";

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
    }, 1000);
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
    const skipNodeIds = new Set<string>();

    const getComponentName = (node: any) => 
      node?.name || 
      node?.data?.name || 
      node?.type?.resolvedName || 
      node?.data?.type?.resolvedName || 
      "Unknown";

    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];
      if (getComponentName(node) === "CraftButton") {
        const linkedNodes = node.linkedNodes || node.data?.linkedNodes || {};
        Object.values(linkedNodes).forEach((childId: any) => {
          if (typeof childId === "string") skipNodeIds.add(childId);
        });
        const standardNodes = node.nodes || node.data?.nodes || [];
        if (Array.isArray(standardNodes)) {
          standardNodes.forEach((childId: string) => skipNodeIds.add(childId));
        }
      }
    });

    function traverse(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes[nodeId];
      if (!node) return;

      const componentName = getComponentName(node);
      const props = node.props || node.data?.props || {};

if (componentName === "CraftButton") {
        let btnText = props.buttonText || props.text || "Click Me";
        let textStyles: any = { ...props };

        const allChildIds = [
          ...(node.nodes || node.data?.nodes || []),
          ...Object.values(node.linkedNodes || node.data?.linkedNodes || {})
        ];

        for (const childId of allChildIds) {
          if (typeof childId === "string" && nodes[childId]) {
            const childNode = nodes[childId];
            const childName = getComponentName(childNode);
            
            if (childName === "CraftText") {
              const cp = childNode.props || childNode.data?.props || {};
              if (cp.text) btnText = cp.text;
              
              textStyles = {
                ...textStyles,
                ...cp,
              };
              break;
            }
          }
        }

        // Explicitly resolve font size from child or parent fallback
        const rawSize = textStyles.fontSize || textStyles.size || textStyles.textSize || props.fontSize;
        if (rawSize !== undefined && rawSize !== null && rawSize !== "" && rawSize !== 0) {
          textStyles.fontSize = (typeof rawSize === "number" || !isNaN(Number(rawSize))) ? `${rawSize}px` : rawSize;
        }

        const btnUrl = props.url || "#";
        
        extractedLinks.push({ id: nodeId, title: btnText, url: btnUrl });
        contentBlocks.push({
          id: nodeId,
          type: "link",
          text: btnText,
          url: btnUrl,
          styles: textStyles,
        });
      } else if (componentName === "CraftProfileInfo") {
        // If the stored node bio is missing, empty, or the old placeholder, fallback to the current page bio
        const nodeBio = props.bio || props.text;
        const hasValidBio = nodeBio && nodeBio !== "No bio provided." && nodeBio.trim() !== "";
        
        const bioValue = hasValidBio ? nodeBio : (currentActivePage.bio || "");

        if (bioValue.trim() !== "") {
          extractedBio = bioValue;
        }
        
        // Ensure the node props themselves get updated with the clean bio value if it was a placeholder
        if (!hasValidBio && currentActivePage.bio && currentActivePage.bio.trim() !== "") {
          props.bio = currentActivePage.bio;
        }

        contentBlocks.push({ id: nodeId, type: "profile", text: bioValue });
      } else if (componentName === "CraftAvatar") {
        contentBlocks.push({ id: nodeId, type: "avatar" });
      } else if (componentName === "SocialIcons") {
        contentBlocks.push({ id: nodeId, type: "socials" });
      } else if (componentName === "CraftText") {
        if (!skipNodeIds.has(nodeId) && props.text) {
          const rawSize = props.fontSize || props.size || props.textSize;
          const normalizedFontSize = rawSize !== undefined && rawSize !== null && rawSize !== "" && rawSize !== 0
            ? (typeof rawSize === "number" || !isNaN(Number(rawSize)) ? `${rawSize}px` : rawSize)
            : undefined;

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
              fontSize: normalizedFontSize,
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

      const childIds = node.nodes || node.data?.nodes || [];
      childIds.forEach((childId: string) => {
        traverse(childId);
      });

      const linkedNodes = node.linkedNodes || node.data?.linkedNodes;
      if (linkedNodes) {
        Object.values(linkedNodes).forEach((linkedId: any) => {
          if (typeof linkedId === "string") traverse(linkedId);
        });
      }
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
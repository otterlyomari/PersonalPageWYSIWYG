// components/builder/craft/RenderCraftTree.tsx
"use client";

import React from "react";
import { CraftAvatar, CraftProfileInfo, CraftLinkCard, CraftContainer, CraftText } from "../builder/craft/UserComponents";
import { SocialIcons } from "../builder/craft/SocialIcons";

interface RenderCraftTreeProps {
  serializedData: string;
  siteData: any; // Fallback or extra context like site info
}

export function RenderCraftTree({ serializedData, siteData }: RenderCraftTreeProps) {
  if (!serializedData) return null;

  let nodes: Record<string, any>;
  try {
    nodes = JSON.parse(serializedData);
  } catch (e) {
    console.error("Failed to parse serialized craft state", e);
    return null;
  }

  // Component map matching your Craft resolver names
  const componentMap: Record<string, React.FC<any>> = {
    CraftContainer: CraftContainer,
    CraftAvatar: CraftAvatar,
    CraftProfileInfo: CraftProfileInfo,
    CraftLinkCard: CraftLinkCard,
    CraftText: CraftText,
    SocialIcons: SocialIcons,
  };

  // Recursive renderer function
  const renderNode = (id: string) => {
    const node = nodes[id];
    if (!node) return null;

    const Component = componentMap[node.resolvedName];
    if (!Component) return null;

    // Extract props saved in Craft.js node state
    const props = node.props || {};
    const childIds = node.nodes || [];

    // If the component has children (like a Container), render them inside
    if (childIds.length > 0) {
      return (
        <Component key={id} {...props}>
          {childIds.map((childId: string) => renderNode(childId))}
        </Component>
      );
    }

    return <Component key={id} {...props} />;
  };

  // Always start recursion from the ROOT node
  return <div className="w-full">{renderNode("ROOT")}</div>;
}
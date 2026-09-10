// types/pageConfig.ts

export interface PageLink {
  id: string;
  title: string;
  url: string;
}

export type BlockType = "hero" | "card" | "button" | "text" | "spacer" | "socials" | "container";

export interface CanvasBlock {
  id: string;
  type: BlockType;
  content: string;
  url?: string;
  width?: number | "full" | "auto" | "half";
  height?: number | "auto";
  position: { x: number; y: number };
  children?: CanvasBlock[]; // <--- Allows nesting blocks inside containers!
}

export interface SocialLink {
  id: string;
  url: string;
}

export interface ContentBlock {
  id: string;
  type: "text" | "link" | "profile" | "avatar" | "socials" ;
  text?: string;
  url?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  styles?: {
    fontFamily: string;
    alignment: "left" | "center" | "right" | "justify";
    textColor: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: "normal" | "italic";
    textDecoration: "none" | "underline" | "line-through";
    textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
    letterSpacing: string;
    lineHeight: string;
    listStyle: string;
    linkUrl: string;
    openInNewTab: boolean;
    effect: string;
    shadowColor: string;
    shadowBlur: string;
    shadowX: string;
    shadowY: string;
    outlineColor: string;
    outlineWidth: string;
    glowColor: string;
    glowSize: string;
    className?: string;
  };
}

export interface SubPage {
  slug: string;
  title: string;
  bio?: string;
  background?: string;
  textColor?: string;
  backgroundColor?: string;
  socials?: SocialLink[];
  craftState?: string;
  links: Array<{ id: string; title: string; url: string }>; // kept for backwards compatibility
  contentBlocks?: ContentBlock[]; // <--- Unified ordered list
  textBlocks?: Array<any>; // can keep as legacy fallback
}

export interface SiteConfig {
  username: string;
  activeMode: "simple" | "advanced";
  activePageSlug: string;
  pages: SubPage[];
}
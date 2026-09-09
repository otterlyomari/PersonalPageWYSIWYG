// types/pageConfig.ts

export interface PageLink {
  id: string;
  title: string;
  url: string;
}

export interface CanvasBlock {
  id: string;
  type: "text" | "image" | "button" | "spacer";
  content: string;
  position: { x: number; y: number };
}

export interface SubPage {
  slug: string;
  title: string;
  bio?: string; // <--- Bio lives here globally/exclusively for Home
  backgroundColor: string;
  textColor: string;
  links: PageLink[];
  blocks: CanvasBlock[];
}

export interface SiteConfig {
  username: string;
  activeMode: "simple" | "advanced";
  activePageSlug: string;
  pages: SubPage[];
}
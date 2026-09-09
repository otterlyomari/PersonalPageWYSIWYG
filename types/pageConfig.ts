// types/pageConfig.ts
export interface PageLink {
  id: string;
  title: string;
  url: string;
}

export interface PageConfig {
  username: string;
  bio: string;
  backgroundColor: string; // e.g., "bg-neutral-900" or a hex code
  textColor: string;
  links: PageLink[];
}
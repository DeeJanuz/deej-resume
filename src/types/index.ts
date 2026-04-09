export type PortfolioSectionId =
  | "resume"
  | "experience"
  | "projects"
  | "skills"
  | "about"
  | "businesses"
  | "contact";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: PortfolioSectionId;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isFullScreen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  preFullScreenPosition?: WindowPosition;
  preFullScreenSize?: WindowSize;
}

export interface WindowConfig {
  id: PortfolioSectionId;
  title: string;
  position: WindowPosition;
  size: WindowSize;
}

export type WindowAction =
  | { type: "OPEN_WINDOW"; payload: WindowConfig }
  | { type: "CLOSE_WINDOW"; payload: { id: PortfolioSectionId } }
  | { type: "MINIMIZE_WINDOW"; payload: { id: PortfolioSectionId } }
  | { type: "FOCUS_WINDOW"; payload: { id: PortfolioSectionId } }
  | {
      type: "MOVE_WINDOW";
      payload: { id: PortfolioSectionId; position: WindowPosition };
    }
  | {
      type: "RESIZE_WINDOW";
      payload: {
        id: PortfolioSectionId;
        size: WindowSize;
        position?: WindowPosition;
      };
    }
  | {
      type: "TOGGLE_FULLSCREEN";
      payload: {
        id: PortfolioSectionId;
        fullScreenPosition: WindowPosition;
        fullScreenSize: WindowSize;
      };
    };

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type DesktopItemKind = "document" | "folder" | "stack" | "contact";

export interface DesktopItemDefinition {
  id: PortfolioSectionId;
  label: string;
  iconLabel: string;
  kind: DesktopItemKind;
  accent: string;
  position: {
    top: string;
    left?: string;
    right?: string;
  };
}

export interface PortfolioMetric {
  value: string;
  label: string;
}

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioCard {
  title: string;
  eyebrow?: string;
  description: string;
  bullets?: readonly string[];
  links?: readonly PortfolioLink[];
  tags?: readonly string[];
}

export interface PortfolioDetailSection {
  title: string;
  eyebrow?: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly PortfolioLink[];
}

export interface PortfolioSection {
  id: PortfolioSectionId;
  title: string;
  windowTitle: string;
  eyebrow: string;
  intro: string;
  summary: string;
  sidebarNote: string;
  accent: string;
  heroGradient: string;
  metrics: readonly PortfolioMetric[];
  cards: readonly PortfolioCard[];
  detailSections?: readonly PortfolioDetailSection[];
  quickFacts: readonly string[];
  defaultWindow: {
    position: WindowPosition;
    size: WindowSize;
  };
}

export interface SiteProfile {
  name: string;
  title: string;
  location: string;
  availability: string;
  summary: string;
}

export interface PortfolioContentSource {
  siteProfile: SiteProfile;
  portfolioSections: readonly PortfolioSection[];
}

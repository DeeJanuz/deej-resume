export type PortfolioSectionId = "resume" | "ipod";
export type ResumeSectionId =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "about"
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
  isRestoring?: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  preFullScreenPosition?: WindowPosition;
  preFullScreenSize?: WindowSize;
  restoreOffset?: WindowPosition;
}

export interface WindowConfig {
  id: PortfolioSectionId;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  restoreOffset?: WindowPosition;
}

export type WindowAction =
  | { type: "OPEN_WINDOW"; payload: WindowConfig }
  | { type: "CLOSE_WINDOW"; payload: { id: PortfolioSectionId } }
  | { type: "MINIMIZE_WINDOW"; payload: { id: PortfolioSectionId } }
  | { type: "COMPLETE_RESTORE_ANIMATION"; payload: { id: PortfolioSectionId } }
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

export type DesktopItemKind = "document" | "folder" | "stack" | "contact" | "media";

export interface DesktopItemDefinition {
  id: PortfolioSectionId;
  label: string;
  iconLabel: string;
  kind: DesktopItemKind;
  accent: string;
}

export interface PortfolioMetric {
  value: string;
  label: string;
}

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioImage {
  src: string;
  alt: string;
  caption?: string;
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
  image?: PortfolioImage;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly PortfolioLink[];
}

export interface ResumeValuePillar {
  title: string;
  description: string;
}

export interface ResumeNavItem {
  id: ResumeSectionId;
  label: string;
}

export interface ResumeExecutiveSummary {
  eyebrow: string;
  title: string;
  intro: string;
  summary: string;
  accent: string;
  heroGradient: string;
  heroImage?: PortfolioImage;
  metrics: readonly PortfolioMetric[];
  valuePillars: readonly ResumeValuePillar[];
  quickFacts: readonly string[];
  primaryLinks?: readonly PortfolioLink[];
}

export interface ResumeContentSection {
  id: Exclude<ResumeSectionId, "summary">;
  navLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  summary: string;
  accent: string;
  heroGradient: string;
  heroImage?: PortfolioImage;
  metrics: readonly PortfolioMetric[];
  cards: readonly PortfolioCard[];
  detailSections?: readonly PortfolioDetailSection[];
  quickFacts: readonly string[];
}

export interface ResumeContent {
  id: PortfolioSectionId;
  desktopLabel: string;
  iconLabel: string;
  windowTitle: string;
  accent: string;
  executiveSummary: ResumeExecutiveSummary;
  navigation: readonly ResumeNavItem[];
  sections: readonly ResumeContentSection[];
  defaultWindow: {
    position: WindowPosition;
    size: WindowSize;
  };
}

export interface SiteProfile {
  name: string;
  title: string;
  location: string;
  summary: string;
}

export interface PortfolioContentSource {
  siteProfile: SiteProfile;
  resume: ResumeContent;
}

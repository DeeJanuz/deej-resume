import type {
  DesktopItemDefinition,
  PortfolioSection,
  PortfolioSectionId,
} from "@/types";
import {
  contentSource,
  portfolioSections,
  siteProfile,
} from "./portfolio-content-source";

export { contentSource, portfolioSections, siteProfile };

export const portfolioSectionsById = Object.fromEntries(
  portfolioSections.map((section) => [section.id, section]),
) as unknown as Record<PortfolioSectionId, PortfolioSection>;

export const desktopItems: readonly DesktopItemDefinition[] = [
  {
    id: "resume",
    label: "Resume.pdf",
    iconLabel: "PDF",
    kind: "document",
    accent: "#2f6b73",
    position: { top: "56px", right: "48px" },
  },
  {
    id: "experience",
    label: "Past Work",
    iconLabel: "EXP",
    kind: "folder",
    accent: "#3f5f48",
    position: { top: "166px", right: "36px" },
  },
  {
    id: "projects",
    label: "Projects",
    iconLabel: "PRJ",
    kind: "stack",
    accent: "#2d5f93",
    position: { top: "276px", right: "56px" },
  },
  {
    id: "skills",
    label: "Skills",
    iconLabel: "SKL",
    kind: "document",
    accent: "#8b6b2f",
    position: { top: "102px", left: "38px" },
  },
  {
    id: "about",
    label: "About Me",
    iconLabel: "ME",
    kind: "document",
    accent: "#9d6335",
    position: { top: "214px", left: "28px" },
  },
  {
    id: "businesses",
    label: "Businesses",
    iconLabel: "BIZ",
    kind: "folder",
    accent: "#7b4b45",
    position: { top: "330px", left: "44px" },
  },
  {
    id: "contact",
    label: "Contact.card",
    iconLabel: "CTA",
    kind: "contact",
    accent: "#4b5563",
    position: { top: "434px", right: "62px" },
  },
] as const;

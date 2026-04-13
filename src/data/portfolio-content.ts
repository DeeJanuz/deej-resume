import type {
  DesktopItemDefinition,
  PortfolioSection,
  PortfolioSectionId,
} from "@/types";
import {
  ambientTrack,
  contentSource,
  portfolioSections,
  siteProfile,
} from "./portfolio-content-source";

export { ambientTrack, contentSource, portfolioSections, siteProfile };

export const portfolioSectionsById = Object.fromEntries(
  portfolioSections.map((section) => [section.id, section]),
) as unknown as Record<PortfolioSectionId, PortfolioSection>;

export const desktopItems: readonly DesktopItemDefinition[] = [
  {
    id: "experience",
    label: "Past Work",
    iconLabel: "EXP",
    kind: "document",
    accent: "#3f5f48",
  },
  {
    id: "projects",
    label: "Projects",
    iconLabel: "PRJ",
    kind: "stack",
    accent: "#2d5f93",
  },
  {
    id: "skills",
    label: "Skills",
    iconLabel: "SKL",
    kind: "document",
    accent: "#8b6b2f",
  },
  {
    id: "about",
    label: "About Me",
    iconLabel: "ME",
    kind: "document",
    accent: "#9d6335",
  },
  {
    id: "personal",
    label: "Personal Details",
    iconLabel: "BIO",
    kind: "document",
    accent: "#8e5f52",
  },
  {
    id: "businesses",
    label: "Businesses",
    iconLabel: "BIZ",
    kind: "folder",
    accent: "#7b4b45",
  },
  {
    id: "contact",
    label: "Contact.card",
    iconLabel: "CTA",
    kind: "contact",
    accent: "#4b5563",
  },
] as const;

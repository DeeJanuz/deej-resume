import type { DesktopItemDefinition } from "@/types";
import { contentSource, resume, siteProfile } from "./portfolio-content-source";

export { contentSource, resume, siteProfile };

export const desktopItems: readonly DesktopItemDefinition[] = [
  {
    id: "resume",
    label: "Resume",
    iconLabel: "CV",
    kind: "document",
    accent: resume.accent,
  },
  {
    id: "ipod",
    label: "iPod",
    iconLabel: "iP",
    kind: "media",
    accent: "#234d73",
  },
  {
    id: "gabey-bird",
    label: "Gabey Bird",
    iconLabel: "GB",
    kind: "game",
    accent: "#4b7b38",
  },
  {
    id: "snek",
    label: "Snek",
    iconLabel: "SK",
    kind: "game",
    accent: "#17302e",
  },
] as const;

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
] as const;

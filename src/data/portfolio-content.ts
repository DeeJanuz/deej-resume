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
  {
    id: "mcpviews",
    label: "MCPViews",
    iconLabel: "MV",
    kind: "document",
    accent: "#277f78",
  },
  {
    id: "decidr-mcp",
    label: "DecidR MCP",
    iconLabel: "DR",
    kind: "document",
    accent: "#2d5f93",
  },
  {
    id: "ludflow",
    label: "Ludflow",
    iconLabel: "LF",
    kind: "document",
    accent: "#2f6b73",
  },
] as const;

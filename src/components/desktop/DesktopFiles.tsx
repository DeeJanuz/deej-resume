"use client";

import { useEffect, useMemo, useState } from "react";
import type { DesktopItemDefinition, DesktopItemKind, PortfolioSectionId } from "@/types";

interface DesktopFilesProps {
  items: readonly DesktopItemDefinition[];
  openIds: ReadonlySet<PortfolioSectionId>;
  onOpen: (id: PortfolioSectionId) => void;
}

interface GlyphProps {
  accent: string;
  iconLabel: string;
  isOpen: boolean;
}

const glyphRenderers: Record<DesktopItemKind, (props: GlyphProps) => React.ReactNode> = {
  folder: ({ accent, iconLabel, isOpen }) => (
    <div className="relative">
      <div
        className="absolute left-2 top-0 h-4 w-7 rounded-t-xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="relative mt-2 h-12 w-16 rounded-lg border border-white/55 shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, rgba(255,255,255,0.9) 220%)`,
          filter: isOpen ? "saturate(1.05)" : "none",
        }}
      />
      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.24em] text-white">
        {iconLabel}
      </div>
    </div>
  ),
  document: ({ accent, iconLabel, isOpen }) => (
    <div
      className="relative h-16 w-14 rounded-lg border border-white/65 bg-[rgba(255,255,255,0.88)] shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
      style={{ filter: isOpen ? "saturate(1.06)" : "none" }}
    >
      <div
        className="absolute inset-x-3 top-3 h-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-2xl rounded-tr-[20px] bg-[rgba(235,232,225,0.88)]" />
      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.18em] text-stone-700">
        {iconLabel}
      </div>
    </div>
  ),
  stack: ({ accent, iconLabel, isOpen }) => (
    <div
      className="relative h-16 w-14 rounded-lg border border-white/65 bg-[rgba(255,255,255,0.88)] shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
      style={{ filter: isOpen ? "saturate(1.06)" : "none" }}
    >
      <div
        className="absolute inset-x-3 top-3 h-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-2xl rounded-tr-[20px] bg-[rgba(235,232,225,0.88)]" />
      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.18em] text-stone-700">
        {iconLabel}
      </div>
    </div>
  ),
  contact: ({ accent, iconLabel, isOpen }) => (
    <div
      className="relative h-16 w-14 rounded-lg border border-white/65 bg-[rgba(255,255,255,0.88)] shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
      style={{ filter: isOpen ? "saturate(1.06)" : "none" }}
    >
      <div
        className="absolute inset-x-3 top-3 h-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-2xl rounded-tr-[20px] bg-[rgba(235,232,225,0.88)]" />
      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.18em] text-stone-700">
        {iconLabel}
      </div>
    </div>
  ),
};

const DESKTOP_ICON_TOP_START = 56;
const DESKTOP_ICON_LEFT_START = 34;
const DESKTOP_ICON_COLUMN_STEP = 92;
const DESKTOP_ICON_BUTTON_HEIGHT = 104;
const DESKTOP_ICON_ROW_STEP = 112;
const DESKTOP_ICON_BOTTOM_PADDING = 96;

function getMaxRowsPerColumn(viewportHeight: number) {
  const usableHeight =
    viewportHeight - DESKTOP_ICON_TOP_START - DESKTOP_ICON_BOTTOM_PADDING;

  return Math.max(
    1,
    Math.floor((usableHeight - DESKTOP_ICON_BUTTON_HEIGHT) / DESKTOP_ICON_ROW_STEP) + 1,
  );
}

function DesktopGlyph({
  item,
  isOpen,
}: {
  item: DesktopItemDefinition;
  isOpen: boolean;
}) {
  return glyphRenderers[item.kind]({ accent: item.accent, iconLabel: item.iconLabel, isOpen });
}

export function DesktopFiles({
  items,
  openIds,
  onOpen,
}: DesktopFilesProps) {
  const [viewportHeight, setViewportHeight] = useState(900);

  useEffect(() => {
    function updateViewportHeight() {
      setViewportHeight(window.innerHeight);
    }

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  const itemPositions = useMemo(() => {
    const maxRowsPerColumn = getMaxRowsPerColumn(viewportHeight);

    return items.map((item, index) => {
      const column = Math.floor(index / maxRowsPerColumn);
      const row = index % maxRowsPerColumn;

      return {
        id: item.id,
        top: `${DESKTOP_ICON_TOP_START + row * DESKTOP_ICON_ROW_STEP}px`,
        left: `${DESKTOP_ICON_LEFT_START + column * DESKTOP_ICON_COLUMN_STEP}px`,
      };
    });
  }, [items, viewportHeight]);

  return (
    <>
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const position = itemPositions[index];

        return (
          <button
            key={item.id}
            type="button"
            className="group absolute flex min-h-[104px] w-20 flex-col items-center justify-start gap-2 rounded-2xl p-2 text-center transition duration-200 hover:scale-[1.02] hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/70"
            style={{
              top: position?.top ?? `${DESKTOP_ICON_TOP_START}px`,
              left: position?.left ?? `${DESKTOP_ICON_LEFT_START}px`,
              backgroundColor: isOpen ? "rgba(255,255,255,0.18)" : "transparent",
            }}
            onClick={() => onOpen(item.id)}
          >
            <DesktopGlyph item={item} isOpen={isOpen} />
            <span className="min-h-[28px] text-[11px] font-medium leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </>
  );
}

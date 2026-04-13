"use client";

import { useEffect, useMemo, useState } from "react";
import { DesktopQuickLook } from "@/components/desktop/DesktopQuickLook";
import type {
  DesktopItemDefinition,
  DesktopItemKind,
  PortfolioSection,
  PortfolioSectionId,
} from "@/types";

interface DesktopFilesProps {
  items: readonly DesktopItemDefinition[];
  openIds: ReadonlySet<PortfolioSectionId>;
  portfolioSectionsById: Record<PortfolioSectionId, PortfolioSection>;
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
const DESKTOP_PREVIEW_TOP_MARGIN = 40;

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
  portfolioSectionsById,
  onOpen,
}: DesktopFilesProps) {
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 });
  const [previewId, setPreviewId] = useState<PortfolioSectionId | null>(null);

  useEffect(() => {
    function updateViewportSize() {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    }

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  const itemPositions = useMemo(() => {
    const maxRowsPerColumn = getMaxRowsPerColumn(viewportSize.height);

    return items.map((item, index) => {
      const column = Math.floor(index / maxRowsPerColumn);
      const row = index % maxRowsPerColumn;

      return {
        id: item.id,
        top: DESKTOP_ICON_TOP_START + row * DESKTOP_ICON_ROW_STEP,
        left: DESKTOP_ICON_LEFT_START + column * DESKTOP_ICON_COLUMN_STEP,
      };
    });
  }, [items, viewportSize.height]);

  const previewPosition = useMemo(() => {
    if (!previewId) {
      return null;
    }

    const iconPosition = itemPositions.find((position) => position.id === previewId);
    if (!iconPosition) {
      return null;
    }

    return {
      top: Math.min(
        Math.max(DESKTOP_PREVIEW_TOP_MARGIN, iconPosition.top - 8),
        viewportSize.height - 264,
      ),
      left: Math.min(iconPosition.left + 98, viewportSize.width - 320),
    };
  }, [itemPositions, previewId, viewportSize.height, viewportSize.width]);

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
              top: position?.top ?? DESKTOP_ICON_TOP_START,
              left: position?.left ?? DESKTOP_ICON_LEFT_START,
              backgroundColor: isOpen ? "rgba(255,255,255,0.18)" : "transparent",
            }}
            onClick={() => onOpen(item.id)}
            onMouseEnter={() => setPreviewId(item.id)}
            onMouseLeave={() => setPreviewId((current) => (current === item.id ? null : current))}
            onFocus={() => setPreviewId(item.id)}
            onBlur={() => setPreviewId((current) => (current === item.id ? null : current))}
          >
            <DesktopGlyph item={item} isOpen={isOpen} />
            <span className="min-h-[28px] text-[11px] font-medium leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {previewId && previewPosition ? (
        <DesktopQuickLook
          section={portfolioSectionsById[previewId]}
          top={previewPosition.top}
          left={previewPosition.left}
        />
      ) : null}
    </>
  );
}

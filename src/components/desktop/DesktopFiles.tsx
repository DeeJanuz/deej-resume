"use client";

import type { DesktopItemDefinition, PortfolioSectionId } from "@/types";

interface DesktopFilesProps {
  items: readonly DesktopItemDefinition[];
  openIds: ReadonlySet<PortfolioSectionId>;
  onOpen: (id: PortfolioSectionId) => void;
}

function DesktopGlyph({
  item,
  isOpen,
}: {
  item: DesktopItemDefinition;
  isOpen: boolean;
}) {
  if (item.kind === "folder") {
    return (
      <div className="relative">
        <div
          className="absolute left-2 top-0 h-4 w-7 rounded-t-xl"
          style={{ backgroundColor: item.accent }}
        />
        <div
          className="relative mt-2 h-12 w-16 rounded-lg border border-white/55 shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
          style={{
            background: `linear-gradient(180deg, ${item.accent} 0%, rgba(255,255,255,0.9) 220%)`,
            filter: isOpen ? "saturate(1.05)" : "none",
          }}
        />
        <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.24em] text-white">
          {item.iconLabel}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-16 w-14 rounded-lg border border-white/65 bg-[rgba(255,255,255,0.88)] shadow-[0_16px_30px_rgba(0,0,0,0.16)]"
      style={{ filter: isOpen ? "saturate(1.06)" : "none" }}
    >
      <div
        className="absolute inset-x-3 top-3 h-1.5 rounded-full"
        style={{ backgroundColor: item.accent }}
      />
      <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-2xl rounded-tr-[20px] bg-[rgba(235,232,225,0.88)]" />
      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold tracking-[0.18em] text-stone-700">
        {item.iconLabel}
      </div>
    </div>
  );
}

export function DesktopFiles({
  items,
  openIds,
  onOpen,
}: DesktopFilesProps) {
  return (
    <>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <button
            key={item.id}
            type="button"
            className="group absolute flex w-20 flex-col items-center gap-2 rounded-2xl p-2 text-center transition duration-200 hover:scale-[1.02] hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/70"
            style={{
              top: item.position.top,
              ...(item.position.left ? { left: item.position.left } : {}),
              ...(item.position.right ? { right: item.position.right } : {}),
              backgroundColor: isOpen ? "rgba(255,255,255,0.18)" : "transparent",
            }}
            onClick={() => onOpen(item.id)}
          >
            <DesktopGlyph item={item} isOpen={isOpen} />
            <span className="text-[11px] font-medium leading-tight text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </>
  );
}

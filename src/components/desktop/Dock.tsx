"use client";

import { useState } from "react";
import type { PortfolioSectionId, WindowState } from "@/types";

interface DockIconData {
  label: string;
  iconLabel: string;
  accent: string;
}

interface DockProps {
  windows: readonly WindowState[];
  iconData: Record<PortfolioSectionId, DockIconData>;
  onRestore: (id: PortfolioSectionId) => void;
  onFocus: (id: PortfolioSectionId) => void;
  onMinimize: (id: PortfolioSectionId) => void;
}

function lightenColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.45);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function Dock({ windows, iconData, onRestore, onFocus, onMinimize }: DockProps) {
  const [hoveredId, setHoveredId] = useState<PortfolioSectionId | null>(null);

  if (windows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2">
      <div className="glass-panel flex items-end gap-1.5 rounded-2xl px-3 py-1.5">
        {windows.map((win) => {
          const item = iconData[win.id];
          if (!item) return null;

          const isHovered = hoveredId === win.id;
          const isMinimized = win.isMinimized;
          const gradient = `linear-gradient(180deg, ${lightenColor(item.accent)} 0%, ${item.accent} 100%)`;

          return (
            <div key={win.id} className="relative flex flex-col items-center">
              {isHovered ? (
                <div className="absolute -top-9 rounded-full bg-[rgba(0,0,0,0.75)] px-3 py-1 text-[10px] font-semibold text-white whitespace-nowrap">
                  {item.label}
                </div>
              ) : null}

              <button
                type="button"
                aria-label={isMinimized ? `Restore ${item.label}` : win.isFocused ? `Minimize ${item.label}` : `Focus ${item.label}`}
                className="relative transition-transform duration-200"
                style={{
                  transform: isHovered ? "translateY(-4px) scale(1.08)" : "none",
                }}
                onClick={() => {
                  if (isMinimized) {
                    onRestore(win.id);
                  } else if (win.isFocused) {
                    onMinimize(win.id);
                  } else {
                    onFocus(win.id);
                  }
                }}
                onMouseEnter={() => setHoveredId(win.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative">
                  {isMinimized ? (
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 h-7 w-9 rounded-[4px] border border-white/40 bg-white/80 shadow-sm"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.9) 100%)",
                      }}
                    >
                      <div className="mx-1.5 mt-1.5 space-y-[2px]">
                        <div className="h-[2px] rounded-full bg-neutral-300/80 w-full" />
                        <div className="h-[2px] rounded-full bg-neutral-300/60 w-3/4" />
                      </div>
                    </div>
                  ) : null}
                  <div
                    data-dock-id={win.id}
                    className="relative flex h-12 w-12 items-center justify-center rounded-[12px] border border-white/55 text-xl font-bold text-white shadow-[0_14px_24px_rgba(0,0,0,0.16)]"
                    style={{ background: gradient }}
                  >
                    {item.iconLabel}
                  </div>
                </div>

                <span
                  className="absolute -bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neutral-700 transition-opacity"
                  style={{ opacity: isMinimized ? 0 : 1 }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

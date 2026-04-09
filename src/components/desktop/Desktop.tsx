"use client";

import { useCallback, useEffect, useState } from "react";
import { desktopItems, portfolioSectionsById } from "@/data/portfolio-content";
import { useWindowManager } from "@/hooks/useWindowManager";
import type { PortfolioSectionId } from "@/types";
import { DesktopFiles } from "./DesktopFiles";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { Wallpaper } from "./Wallpaper";
import { WindowContainer } from "./WindowContainer";

const iconData = Object.fromEntries(
  desktopItems.map((item) => [item.id, { label: item.label, iconLabel: item.iconLabel, accent: item.accent }])
) as Record<PortfolioSectionId, { label: string; iconLabel: string; accent: string }>;

function createWindowPayload(sectionId: PortfolioSectionId) {
  const section = portfolioSectionsById[sectionId];

  return {
    id: section.id,
    title: section.windowTitle,
    position: { ...section.defaultWindow.position },
    size: { ...section.defaultWindow.size },
  };
}

export function Desktop() {
  const { windows, dispatch } = useWindowManager();
  const [dockMinimizingId, setDockMinimizingId] = useState<PortfolioSectionId | null>(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      dispatch({
        type: "OPEN_WINDOW",
        payload: createWindowPayload("resume"),
      });
    }, 320);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [dispatch]);

  function openSection(sectionId: PortfolioSectionId) {
    dispatch({
      type: "OPEN_WINDOW",
      payload: createWindowPayload(sectionId),
    });
  }

  const onDockMinimizeComplete = useCallback(() => {
    setDockMinimizingId(null);
  }, []);

  const openIds = new Set(
    windows.filter((windowState) => windowState.isOpen && !windowState.isMinimized).map((windowState) => windowState.id)
  );

  const activeDockWindows = windows.filter((w) => w.isOpen || w.isMinimized);

  const orderedWindows = [...windows].sort(
    (left, right) => left.zIndex - right.zIndex
  );

  return (
    <div className="relative h-screen overflow-hidden" aria-label="Interactive portfolio desktop">
      <Wallpaper />
      <MenuBar onOpenPrimary={() => openSection("resume")} />

      <main className="relative h-full pt-10">
        <DesktopFiles items={desktopItems} openIds={openIds} onOpen={openSection} />

        {orderedWindows.map((windowState) => (
          <WindowContainer
            key={windowState.id}
            windowState={windowState}
            dockMinimizeRequested={dockMinimizingId === windowState.id}
            dispatch={dispatch}
            onDockMinimizeComplete={onDockMinimizeComplete}
          />
        ))}

        <Dock
          windows={activeDockWindows}
          iconData={iconData}
          onRestore={(id) => dispatch({ type: "OPEN_WINDOW", payload: createWindowPayload(id) })}
          onFocus={(id) => dispatch({ type: "FOCUS_WINDOW", payload: { id } })}
          onMinimize={(id) => setDockMinimizingId(id)}
        />
      </main>
    </div>
  );
}

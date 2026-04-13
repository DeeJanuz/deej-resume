"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AmbientPlayer } from "@/components/desktop/AmbientPlayer";
import { usePortfolioContent } from "@/components/dev/ContentDevContext";
import { desktopItems } from "@/data/portfolio-content";
import { useWindowManager } from "@/hooks/useWindowManager";
import type { PortfolioSectionId } from "@/types";
import { DesktopFiles } from "./DesktopFiles";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { Wallpaper } from "./Wallpaper";
import { WindowContainer } from "./WindowContainer";

const DEFAULT_WINDOW_WIDTH_RATIO = 0.8;
const DEFAULT_WINDOW_HEIGHT_RATIO = 0.8;
const WINDOW_HORIZONTAL_MARGIN = 24;
const WINDOW_TOP_MARGIN = 40;
const WINDOW_BOTTOM_MARGIN = 32;
const INITIAL_WINDOW_IDS: readonly PortfolioSectionId[] = ["experience", "about"];

const iconData = Object.fromEntries(
  desktopItems.map((item) => [item.id, { label: item.label, iconLabel: item.iconLabel, accent: item.accent }])
) as Record<PortfolioSectionId, { label: string; iconLabel: string; accent: string }>;

export function Desktop() {
  const { content, portfolioSectionsById, sectionIndexById } = usePortfolioContent();
  const { windows, dispatch } = useWindowManager();
  const [dockMinimizingId, setDockMinimizingId] = useState<PortfolioSectionId | null>(null);
  const hasOpenedInitialWindow = useRef(false);

  const createWindowPayload = useCallback(
    (sectionId: PortfolioSectionId) => {
      const section = portfolioSectionsById[sectionId];
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const size = {
        width: Math.min(
          Math.round(viewportWidth * DEFAULT_WINDOW_WIDTH_RATIO),
          viewportWidth - WINDOW_HORIZONTAL_MARGIN * 2,
        ),
        height: Math.min(
          Math.round(viewportHeight * DEFAULT_WINDOW_HEIGHT_RATIO),
          viewportHeight - WINDOW_TOP_MARGIN - WINDOW_BOTTOM_MARGIN,
        ),
      };
      const position = {
        x: Math.min(
          section.defaultWindow.position.x,
          Math.max(
            WINDOW_HORIZONTAL_MARGIN,
            viewportWidth - size.width - WINDOW_HORIZONTAL_MARGIN,
          ),
        ),
        y: Math.min(
          section.defaultWindow.position.y,
          Math.max(
            WINDOW_TOP_MARGIN,
            viewportHeight - size.height - WINDOW_BOTTOM_MARGIN,
          ),
        ),
      };

      return {
        id: section.id,
        title: section.windowTitle,
        position,
        size,
      };
    },
    [portfolioSectionsById],
  );

  useLayoutEffect(() => {
    if (hasOpenedInitialWindow.current) {
      return;
    }

    hasOpenedInitialWindow.current = true;
    INITIAL_WINDOW_IDS.forEach((sectionId) => {
      dispatch({
        type: "OPEN_WINDOW",
        payload: createWindowPayload(sectionId),
      });
    });
  }, [createWindowPayload, dispatch]);

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
      <MenuBar onOpenPrimary={() => openSection("experience")} />
      {content.ambientTrack ? <AmbientPlayer track={content.ambientTrack} /> : null}

      <main className="relative h-full pt-10">
        <DesktopFiles
          items={desktopItems}
          openIds={openIds}
          portfolioSectionsById={portfolioSectionsById}
          onOpen={openSection}
        />

        {orderedWindows.map((windowState) => (
          <WindowContainer
            key={windowState.id}
            windowState={windowState}
            section={portfolioSectionsById[windowState.id]}
            sectionIndex={sectionIndexById[windowState.id]}
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

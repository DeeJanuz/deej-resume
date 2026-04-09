"use client";

import { useEffect, useState } from "react";
import { PortfolioWindowContent } from "@/components/content/PortfolioWindowContent";
import { desktopItems, portfolioSectionsById } from "@/data/portfolio-content";
import { useWindowManager } from "@/hooks/useWindowManager";
import type { PortfolioSectionId } from "@/types";
import { DesktopFiles } from "./DesktopFiles";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { Wallpaper } from "./Wallpaper";
import { Window } from "@/components/window/Window";

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

        {orderedWindows.map((windowState) => {
          const section = portfolioSectionsById[windowState.id];

          return (
            <Window
              key={windowState.id}
              id={windowState.id}
              title={windowState.title}
              isOpen={windowState.isOpen}
              isFocused={windowState.isFocused}
              isMinimized={windowState.isMinimized}
              isFullScreen={windowState.isFullScreen}
              position={windowState.position}
              size={windowState.size}
              zIndex={windowState.zIndex}
              dockMinimizeRequested={dockMinimizingId === windowState.id}
              onClose={() => {
                dispatch({
                  type: "CLOSE_WINDOW",
                  payload: { id: windowState.id },
                });
              }}
              onMinimize={() => {
                dispatch({
                  type: "MINIMIZE_WINDOW",
                  payload: { id: windowState.id },
                });
                setDockMinimizingId(null);
              }}
              onFullScreen={() => {
                dispatch({
                  type: "TOGGLE_FULLSCREEN",
                  payload: {
                    id: windowState.id,
                    fullScreenPosition: { x: 0, y: 0 },
                    fullScreenSize: {
                      width: globalThis.innerWidth,
                      height: globalThis.innerHeight - 40,
                    },
                  },
                });
              }}
              onFocus={() => {
                dispatch({
                  type: "FOCUS_WINDOW",
                  payload: { id: windowState.id },
                });
              }}
              onMove={(position) => {
                dispatch({
                  type: "MOVE_WINDOW",
                  payload: { id: windowState.id, position },
                });
              }}
              onResize={(size, position) => {
                dispatch({
                  type: "RESIZE_WINDOW",
                  payload: { id: windowState.id, size, position },
                });
              }}
            >
              <PortfolioWindowContent section={section} />
            </Window>
          );
        })}

        <Dock
          windows={activeDockWindows}
          onRestore={(id) => dispatch({ type: "OPEN_WINDOW", payload: createWindowPayload(id) })}
          onFocus={(id) => dispatch({ type: "FOCUS_WINDOW", payload: { id } })}
          onMinimize={(id) => setDockMinimizingId(id)}
        />
      </main>
    </div>
  );
}

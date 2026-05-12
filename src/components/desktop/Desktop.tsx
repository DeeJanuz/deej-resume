"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IpodApp } from "@/components/desktop/IpodApp";
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
const INITIAL_WINDOW_IDS: readonly PortfolioSectionId[] = ["resume"];
const IPOD_WINDOW_WIDTH = 390;
const IPOD_WINDOW_HEIGHT = 690;

const iconData = Object.fromEntries(
  desktopItems.map((item) => [item.id, { label: item.label, iconLabel: item.iconLabel, accent: item.accent }])
) as Record<PortfolioSectionId, { label: string; iconLabel: string; accent: string }>;

export function Desktop() {
  const { resume } = usePortfolioContent();
  const { windows, dispatch } = useWindowManager();
  const [dockMinimizingId, setDockMinimizingId] = useState<PortfolioSectionId | null>(null);
  const hasOpenedInitialWindow = useRef(false);

  const createWindowPayload = useCallback(
    (sectionId: PortfolioSectionId) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (sectionId === "ipod") {
        const size = {
          width: Math.min(
            IPOD_WINDOW_WIDTH,
            Math.max(300, viewportWidth - WINDOW_HORIZONTAL_MARGIN * 2),
          ),
          height: Math.min(
            IPOD_WINDOW_HEIGHT,
            Math.max(520, viewportHeight - WINDOW_TOP_MARGIN - WINDOW_BOTTOM_MARGIN),
          ),
        };
        const position = {
          x: Math.max(
            WINDOW_HORIZONTAL_MARGIN,
            Math.min(
              viewportWidth - size.width - WINDOW_HORIZONTAL_MARGIN,
              viewportWidth - size.width - 36,
            ),
          ),
          y: Math.max(
            WINDOW_TOP_MARGIN,
            Math.min(
              72,
              viewportHeight - size.height - WINDOW_BOTTOM_MARGIN,
            ),
          ),
        };

        return {
          id: sectionId,
          title: "iPod",
          position,
          size,
        };
      }

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
          resume.defaultWindow.position.x,
          Math.max(
            WINDOW_HORIZONTAL_MARGIN,
            viewportWidth - size.width - WINDOW_HORIZONTAL_MARGIN,
          ),
        ),
        y: Math.min(
          resume.defaultWindow.position.y,
          Math.max(
            WINDOW_TOP_MARGIN,
            viewportHeight - size.height - WINDOW_BOTTOM_MARGIN,
          ),
        ),
      };

      return {
        id: sectionId,
        title: resume.windowTitle,
        position,
        size,
      };
    },
    [resume],
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

  function handleDesktopItemOpen(sectionId: PortfolioSectionId) {
    if (sectionId === "ipod") {
      const ipodWindow = windows.find((windowState) => windowState.id === "ipod");

      if (ipodWindow?.isOpen && !ipodWindow.isMinimized) {
        dispatch({
          type: "CLOSE_WINDOW",
          payload: { id: sectionId },
        });
        return;
      }
    }

    openSection(sectionId);
  }

  const handleDockRestore = useCallback(
    (sectionId: PortfolioSectionId, origin: { x: number; y: number }) => {
      const windowState = windows.find((candidate) => candidate.id === sectionId);
      const restoreOffset = windowState
        ? {
            x: origin.x - (windowState.position.x + windowState.size.width / 2),
            y: origin.y - (windowState.position.y + windowState.size.height / 2),
          }
        : undefined;

      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          ...createWindowPayload(sectionId),
          ...(restoreOffset ? { restoreOffset } : {}),
        },
      });
    },
    [createWindowPayload, dispatch, windows],
  );

  function handleIpodClose() {
    dispatch({
      type: "CLOSE_WINDOW",
      payload: { id: "ipod" },
    });
  }

  function handleIpodDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !floatingIpod) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    dispatch({ type: "FOCUS_WINDOW", payload: { id: "ipod" } });

    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startPosition = floatingIpod.position;
    const ipodSize = floatingIpod.size;

    function handlePointerMove(pointerEvent: PointerEvent) {
      const minX = WINDOW_HORIZONTAL_MARGIN;
      const maxX = Math.max(
        minX,
        window.innerWidth - ipodSize.width - WINDOW_HORIZONTAL_MARGIN,
      );
      const minY = WINDOW_TOP_MARGIN;
      const maxY = Math.max(
        minY,
        window.innerHeight - ipodSize.height - WINDOW_BOTTOM_MARGIN,
      );
      const nextX = Math.min(
        maxX,
        Math.max(minX, startPosition.x + pointerEvent.clientX - startClientX),
      );
      const nextY = Math.min(
        maxY,
        Math.max(minY, startPosition.y + pointerEvent.clientY - startClientY),
      );

      dispatch({
        type: "MOVE_WINDOW",
        payload: {
          id: "ipod",
          position: { x: nextX, y: nextY },
        },
      });
    }

    function handlePointerUp() {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
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
  const floatingIpod = orderedWindows.find(
    (windowState) =>
      windowState.id === "ipod" &&
      windowState.isOpen &&
      !windowState.isMinimized,
  );
  const framedWindows = orderedWindows.filter(
    (windowState) => windowState.id !== "ipod",
  );

  return (
    <div className="relative h-screen overflow-hidden" aria-label="Interactive portfolio desktop">
      <Wallpaper />
      <MenuBar onOpenPrimary={() => openSection("resume")} />

      <main className="relative h-full pt-10">
        <DesktopFiles
          items={desktopItems}
          openIds={openIds}
          resume={resume}
          onOpen={handleDesktopItemOpen}
        />

        {framedWindows.map((windowState) => (
          <WindowContainer
            key={windowState.id}
            windowState={windowState}
            resume={resume}
            dockMinimizeRequested={dockMinimizingId === windowState.id}
            dispatch={dispatch}
            onDockMinimizeComplete={onDockMinimizeComplete}
          />
        ))}

        {floatingIpod ? (
          <div
            className="absolute flex items-center justify-center"
            data-window-id="ipod"
            style={{
              left: floatingIpod.position.x,
              top: floatingIpod.position.y,
              width: floatingIpod.size.width,
              height: floatingIpod.size.height,
              zIndex: floatingIpod.zIndex,
            }}
            onPointerDown={() =>
              dispatch({ type: "FOCUS_WINDOW", payload: { id: "ipod" } })
            }
          >
            <IpodApp
              onClose={handleIpodClose}
              onDragStart={handleIpodDragStart}
            />
          </div>
        ) : null}

        <Dock
          windows={activeDockWindows}
          iconData={iconData}
          onRestore={handleDockRestore}
          onFocus={(id) => dispatch({ type: "FOCUS_WINDOW", payload: { id } })}
          onMinimize={(id) => setDockMinimizingId(id)}
        />
      </main>
    </div>
  );
}

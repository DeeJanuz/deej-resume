"use client";

import { useCallback } from "react";
import { PortfolioWindowContent } from "@/components/content/PortfolioWindowContent";
import { Window } from "@/components/window/Window";
import type { PortfolioSection, WindowAction, WindowState } from "@/types";

interface WindowContainerProps {
  windowState: WindowState;
  section: PortfolioSection;
  sectionIndex: number;
  dockMinimizeRequested: boolean;
  dispatch: React.Dispatch<WindowAction>;
  onDockMinimizeComplete: () => void;
}

export function WindowContainer({
  windowState,
  section,
  sectionIndex,
  dockMinimizeRequested,
  dispatch,
  onDockMinimizeComplete,
}: WindowContainerProps) {
  const onClose = useCallback(() => {
    dispatch({
      type: "CLOSE_WINDOW",
      payload: { id: windowState.id },
    });
  }, [dispatch, windowState.id]);

  const onMinimize = useCallback(() => {
    dispatch({
      type: "MINIMIZE_WINDOW",
      payload: { id: windowState.id },
    });
    onDockMinimizeComplete();
  }, [dispatch, windowState.id, onDockMinimizeComplete]);

  const onFullScreen = useCallback(() => {
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
  }, [dispatch, windowState.id]);

  const onFocus = useCallback(() => {
    dispatch({
      type: "FOCUS_WINDOW",
      payload: { id: windowState.id },
    });
  }, [dispatch, windowState.id]);

  const onMove = useCallback(
    (position: { x: number; y: number }) => {
      dispatch({
        type: "MOVE_WINDOW",
        payload: { id: windowState.id, position },
      });
    },
    [dispatch, windowState.id],
  );

  const onResize = useCallback(
    (size: { width: number; height: number }, position?: { x: number; y: number }) => {
      dispatch({
        type: "RESIZE_WINDOW",
        payload: { id: windowState.id, size, position },
      });
    },
    [dispatch, windowState.id],
  );

  return (
    <Window
      id={windowState.id}
      title={section.windowTitle}
      isOpen={windowState.isOpen}
      isFocused={windowState.isFocused}
      isMinimized={windowState.isMinimized}
      isFullScreen={windowState.isFullScreen}
      position={windowState.position}
      size={windowState.size}
      zIndex={windowState.zIndex}
      dockMinimizeRequested={dockMinimizeRequested}
      onClose={onClose}
      onMinimize={onMinimize}
      onFullScreen={onFullScreen}
      onFocus={onFocus}
      onMove={onMove}
      onResize={onResize}
    >
      <PortfolioWindowContent section={section} sectionIndex={sectionIndex} />
    </Window>
  );
}

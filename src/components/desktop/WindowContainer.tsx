"use client";

import { useCallback } from "react";
import { ResumeWindowContent } from "@/components/content/ResumeWindowContent";
import { Window } from "@/components/window/Window";
import type { ResumeContent, WindowAction, WindowState } from "@/types";

interface WindowContainerProps {
  windowState: WindowState;
  resume: ResumeContent;
  dockMinimizeRequested: boolean;
  dispatch: React.Dispatch<WindowAction>;
  onDockMinimizeComplete: () => void;
}

const MENU_BAR_HEIGHT = 25;

export function WindowContainer({
  windowState,
  resume,
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

  const onRestoreComplete = useCallback(() => {
    dispatch({
      type: "COMPLETE_RESTORE_ANIMATION",
      payload: { id: windowState.id },
    });
  }, [dispatch, windowState.id]);

  const onFullScreen = useCallback(() => {
    dispatch({
      type: "TOGGLE_FULLSCREEN",
      payload: {
        id: windowState.id,
        fullScreenPosition: { x: 0, y: MENU_BAR_HEIGHT },
        fullScreenSize: {
          width: globalThis.innerWidth,
          height: globalThis.innerHeight - MENU_BAR_HEIGHT,
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
      title={windowState.title}
      isOpen={windowState.isOpen}
      isFocused={windowState.isFocused}
      isMinimized={windowState.isMinimized}
      isFullScreen={windowState.isFullScreen}
      isRestoreRequested={Boolean(windowState.isRestoring)}
      restoreOffset={windowState.restoreOffset}
      position={windowState.position}
      size={windowState.size}
      zIndex={windowState.zIndex}
      dockMinimizeRequested={dockMinimizeRequested}
      onClose={onClose}
      onMinimize={onMinimize}
      onFullScreen={onFullScreen}
      onRestoreComplete={onRestoreComplete}
      onFocus={onFocus}
      onMove={onMove}
      onResize={onResize}
    >
      <ResumeWindowContent resume={resume} />
    </Window>
  );
}

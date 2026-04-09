"use client";

import { useReducer } from "react";
import type { WindowAction, WindowState } from "@/types";

function getMaxZIndex(windows: readonly WindowState[]): number {
  return windows.reduce((max, windowState) => Math.max(max, windowState.zIndex), 0);
}

function windowReducer(
  state: readonly WindowState[],
  action: WindowAction
): readonly WindowState[] {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const existingWindow = state.find((windowState) => windowState.id === action.payload.id);
      const nextZIndex = getMaxZIndex(state) + 1;

      if (existingWindow) {
        return state.map((windowState) =>
          windowState.id === action.payload.id
            ? {
                ...windowState,
                isOpen: true,
                isFocused: true,
                isMinimized: false,
                zIndex: nextZIndex,
              }
            : { ...windowState, isFocused: false }
        );
      }

      return [
        ...state.map((windowState) => ({ ...windowState, isFocused: false })),
        {
          id: action.payload.id,
          title: action.payload.title,
          isOpen: true,
          isFocused: true,
          isMinimized: false,
          isFullScreen: false,
          position: action.payload.position,
          size: action.payload.size,
          zIndex: nextZIndex,
        },
      ];
    }

    case "CLOSE_WINDOW":
      return state.map((windowState) =>
        windowState.id === action.payload.id
          ? { ...windowState, isOpen: false, isFocused: false }
          : windowState
      );

    case "MINIMIZE_WINDOW":
      return state.map((windowState) =>
        windowState.id === action.payload.id
          ? { ...windowState, isMinimized: true, isFocused: false }
          : windowState
      );

    case "FOCUS_WINDOW": {
      const nextZIndex = getMaxZIndex(state) + 1;
      return state.map((windowState) =>
        windowState.id === action.payload.id
          ? { ...windowState, isFocused: true, zIndex: nextZIndex }
          : { ...windowState, isFocused: false }
      );
    }

    case "MOVE_WINDOW":
      return state.map((windowState) =>
        windowState.id === action.payload.id
          ? { ...windowState, position: action.payload.position }
          : windowState
      );

    case "RESIZE_WINDOW":
      return state.map((windowState) =>
        windowState.id === action.payload.id
          ? {
              ...windowState,
              size: action.payload.size,
              ...(action.payload.position ? { position: action.payload.position } : {}),
            }
          : windowState
      );

    case "TOGGLE_FULLSCREEN":
      return state.map((windowState) => {
        if (windowState.id !== action.payload.id) return windowState;

        if (windowState.isFullScreen) {
          return {
            ...windowState,
            isFullScreen: false,
            position: windowState.preFullScreenPosition ?? windowState.position,
            size: windowState.preFullScreenSize ?? windowState.size,
            preFullScreenPosition: undefined,
            preFullScreenSize: undefined,
          };
        }

        return {
          ...windowState,
          isFullScreen: true,
          preFullScreenPosition: { ...windowState.position },
          preFullScreenSize: { ...windowState.size },
          position: action.payload.fullScreenPosition,
          size: action.payload.fullScreenSize,
        };
      });

    default:
      return state;
  }
}

export function useWindowManager() {
  const [windows, dispatch] = useReducer(windowReducer, []);

  return {
    windows,
    dispatch,
  };
}

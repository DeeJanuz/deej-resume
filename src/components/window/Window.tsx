"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { WindowPosition, WindowSize } from "@/types";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import { useWindowResize } from "@/hooks/useWindowResize";
import { TrafficLights } from "./TrafficLights";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isFullScreen: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  dockMinimizeRequested: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFullScreen: () => void;
  onFocus: () => void;
  onMove: (position: WindowPosition) => void;
  onResize: (size: WindowSize, position?: WindowPosition) => void;
  children: React.ReactNode;
}

const resizeHandles: readonly {
  direction: ResizeDirection;
  className: string;
  cursor: string;
}[] = [
  { direction: "n", className: "absolute -top-[3px] left-[8px] right-[8px] h-[6px]", cursor: "ns-resize" },
  { direction: "s", className: "absolute -bottom-[3px] left-[8px] right-[8px] h-[6px]", cursor: "ns-resize" },
  { direction: "w", className: "absolute -left-[3px] top-[8px] bottom-[8px] w-[6px]", cursor: "ew-resize" },
  { direction: "e", className: "absolute -right-[3px] top-[8px] bottom-[8px] w-[6px]", cursor: "ew-resize" },
  { direction: "nw", className: "absolute -left-[3px] -top-[3px] h-[12px] w-[12px] z-10", cursor: "nwse-resize" },
  { direction: "ne", className: "absolute -right-[3px] -top-[3px] h-[12px] w-[12px] z-10", cursor: "nesw-resize" },
  { direction: "sw", className: "absolute -left-[3px] -bottom-[3px] h-[12px] w-[12px] z-10", cursor: "nesw-resize" },
  { direction: "se", className: "absolute -right-[3px] -bottom-[3px] h-[12px] w-[12px] z-10", cursor: "nwse-resize" },
];

function computeDockOffset(windowEl: HTMLElement, windowId: string) {
  const dockIcon = document.querySelector(`[data-dock-id="${windowId}"]`);
  if (!dockIcon) return;
  const winRect = windowEl.getBoundingClientRect();
  const dockRect = dockIcon.getBoundingClientRect();
  const dx = dockRect.left + dockRect.width / 2 - (winRect.left + winRect.width / 2);
  const dy = dockRect.top + dockRect.height / 2 - (winRect.top + winRect.height / 2);
  windowEl.style.setProperty("--minimize-x", `${dx}px`);
  windowEl.style.setProperty("--minimize-y", `${dy}px`);
}

export function Window({
  id,
  title,
  isOpen,
  isFocused,
  isMinimized,
  isFullScreen,
  position,
  size,
  zIndex,
  dockMinimizeRequested,
  onClose,
  onMinimize,
  onFullScreen,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isFullScreenTransitioning, setIsFullScreenTransitioning] = useState(false);
  const wasMinimized = useRef(false);
  const prevFullScreen = useRef(isFullScreen);
  const skipOpenAnimation = useRef(false);
  const handleMinimizeRef = useRef<() => void>(null);

  const { handlePointerDown } = useWindowDrag({
    onMove,
    initialPosition: position,
  });
  const { handleResizePointerDown } = useWindowResize({
    onResize,
    size,
    position,
  });

  function handleClose() {
    skipOpenAnimation.current = false;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  }

  function handleMinimize() {
    if (isMinimizing) return;
    skipOpenAnimation.current = false;

    const el = windowRef.current;
    if (el) {
      computeDockOffset(el, id);
    }

    setIsMinimizing(true);
    window.setTimeout(() => {
      setIsMinimizing(false);
      onMinimize();
    }, 400);
  }

  handleMinimizeRef.current = handleMinimize;

  // Dock-triggered minimize via prop
  useEffect(() => {
    if (dockMinimizeRequested) {
      handleMinimizeRef.current?.();
    }
  }, [dockMinimizeRequested]);

  // Detect restore from minimized state
  useLayoutEffect(() => {
    if (wasMinimized.current && !isMinimized && isOpen) {
      const el = windowRef.current;
      if (el) {
        computeDockOffset(el, id);
      }
      skipOpenAnimation.current = true;
      setIsRestoring(true);
    }
    wasMinimized.current = isMinimized;
  }, [isMinimized, isOpen, id]);

  // Smooth fullscreen transition
  useEffect(() => {
    if (isFullScreen !== prevFullScreen.current) {
      prevFullScreen.current = isFullScreen;
      setIsFullScreenTransitioning(true);
      const timer = window.setTimeout(() => setIsFullScreenTransitioning(false), 300);
      return () => window.clearTimeout(timer);
    }
  }, [isFullScreen]);

  // Clear restore animation after it plays
  useEffect(() => {
    if (isRestoring) {
      const timer = window.setTimeout(() => setIsRestoring(false), 400);
      return () => window.clearTimeout(timer);
    }
  }, [isRestoring]);

  if ((!isOpen || isMinimized) && !isClosing && !isMinimizing) {
    return null;
  }

  const animationClass = isRestoring
    ? "window-restore"
    : isMinimizing
      ? "window-minimize"
      : isClosing
        ? "window-close"
        : skipOpenAnimation.current
          ? ""
          : "window-open";

  return (
    <div
      ref={windowRef}
      aria-label={title}
      className={`absolute flex flex-col ${animationClass}`}
      data-window-id={id}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        filter: isFocused ? "none" : "brightness(0.97)",
        ...(isFullScreenTransitioning
          ? { transition: "left 300ms cubic-bezier(0.16,1,0.3,1), top 300ms cubic-bezier(0.16,1,0.3,1), width 300ms cubic-bezier(0.16,1,0.3,1), height 300ms cubic-bezier(0.16,1,0.3,1)" }
          : {}),
      }}
      onPointerDown={onFocus}
    >
      {!isFullScreen && resizeHandles.map((handle) => (
        <div
          key={handle.direction}
          className={handle.className}
          style={{ cursor: handle.cursor }}
          onPointerDown={(event) => handleResizePointerDown(handle.direction, event)}
        />
      ))}

      <div
        className={`flex h-full flex-col overflow-hidden border border-black/10 bg-[rgba(246,246,246,0.97)] backdrop-blur-2xl ${isFullScreen ? "rounded-none shadow-none" : "rounded-[10px] shadow-[0_22px_70px_rgba(0,0,0,0.18)]"}`}
      >
        <div
          className="flex h-11 shrink-0 items-center px-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,246,246,0.95) 0%, rgba(236,236,236,0.95) 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
          onPointerDown={isFullScreen ? undefined : handlePointerDown}
        >
          <div
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            <TrafficLights onClose={handleClose} onMinimize={handleMinimize} onFullScreen={onFullScreen} />
          </div>
          <div className="flex flex-1 items-center justify-center px-6 font-[system-ui] text-[13px] font-medium text-neutral-500">
            <span className="truncate">{title}</span>
          </div>
          <div className="w-[52px]" />
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

interface UseWindowAnimationsOptions {
  windowRef: RefObject<HTMLDivElement | null>;
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isFullScreen: boolean;
  dockMinimizeRequested: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

interface UseWindowAnimationsReturn {
  animationClass: string;
  transitionStyle: React.CSSProperties;
  handleClose: () => void;
  handleMinimize: () => void;
  isVisible: boolean;
}

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

export function useWindowAnimations({
  windowRef,
  id,
  isOpen,
  isMinimized,
  isFullScreen,
  dockMinimizeRequested,
  onClose,
  onMinimize,
}: UseWindowAnimationsOptions): UseWindowAnimationsReturn {
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isFullScreenTransitioning, setIsFullScreenTransitioning] = useState(false);
  const wasMinimized = useRef(false);
  const prevFullScreen = useRef(isFullScreen);
  const skipOpenAnimation = useRef(false);
  const handleMinimizeRef = useRef<() => void>(null);

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

  useEffect(() => {
    if (dockMinimizeRequested) {
      handleMinimizeRef.current?.();
    }
  }, [dockMinimizeRequested]);

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
  }, [isMinimized, isOpen, id, windowRef]);

  useEffect(() => {
    if (isFullScreen !== prevFullScreen.current) {
      prevFullScreen.current = isFullScreen;
      setIsFullScreenTransitioning(true);
      const timer = window.setTimeout(() => setIsFullScreenTransitioning(false), 300);
      return () => window.clearTimeout(timer);
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (isRestoring) {
      const timer = window.setTimeout(() => setIsRestoring(false), 400);
      return () => window.clearTimeout(timer);
    }
  }, [isRestoring]);

  const isVisible = (isOpen && !isMinimized) || isClosing || isMinimizing;

  const animationClass = isRestoring
    ? "window-restore"
    : isMinimizing
      ? "window-minimize"
      : isClosing
        ? "window-close"
        : skipOpenAnimation.current
          ? ""
          : "window-open";

  const transitionStyle: React.CSSProperties = isFullScreenTransitioning
    ? { transition: "left 300ms cubic-bezier(0.16,1,0.3,1), top 300ms cubic-bezier(0.16,1,0.3,1), width 300ms cubic-bezier(0.16,1,0.3,1), height 300ms cubic-bezier(0.16,1,0.3,1)" }
    : {};

  return {
    animationClass,
    transitionStyle,
    handleClose,
    handleMinimize,
    isVisible,
  };
}

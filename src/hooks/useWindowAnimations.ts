"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const dockMinimizeHandled = useRef(false);
  const [shouldSkipOpenAnimation, setShouldSkipOpenAnimation] = useState(false);

  const handleClose = useCallback(() => {
    setShouldSkipOpenAnimation(false);
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  }, [onClose]);

  const handleMinimize = useCallback(() => {
    if (isMinimizing) return;
    setShouldSkipOpenAnimation(false);

    const el = windowRef.current;
    if (el) {
      computeDockOffset(el, id);
    }

    setIsMinimizing(true);
    window.setTimeout(() => {
      setIsMinimizing(false);
      onMinimize();
    }, 400);
  }, [id, isMinimizing, onMinimize, windowRef]);

  useEffect(() => {
    if (!dockMinimizeRequested) {
      dockMinimizeHandled.current = false;
      return;
    }

    if (dockMinimizeHandled.current) {
      return;
    }

    dockMinimizeHandled.current = true;
    const timer = window.setTimeout(() => {
      handleMinimize();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [dockMinimizeRequested, handleMinimize]);

  useLayoutEffect(() => {
    let frameId: number | null = null;

    if (wasMinimized.current && !isMinimized && isOpen) {
      const el = windowRef.current;
      if (el) {
        computeDockOffset(el, id);
      }
      frameId = window.requestAnimationFrame(() => {
        setShouldSkipOpenAnimation(true);
        setIsRestoring(true);
      });
    }
    wasMinimized.current = isMinimized;

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isMinimized, isOpen, id, windowRef]);

  useEffect(() => {
    let frameId: number | null = null;
    let timer: number | null = null;

    if (isFullScreen !== prevFullScreen.current) {
      prevFullScreen.current = isFullScreen;
      frameId = window.requestAnimationFrame(() => {
        setIsFullScreenTransitioning(true);
        timer = window.setTimeout(() => setIsFullScreenTransitioning(false), 300);
      });
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
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
        : shouldSkipOpenAnimation
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

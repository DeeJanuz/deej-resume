"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

interface UseWindowAnimationsOptions {
  windowRef: RefObject<HTMLDivElement | null>;
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isRestoreRequested: boolean;
  dockMinimizeRequested: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFullScreen: () => void;
  onRestoreComplete: () => void;
}

interface UseWindowAnimationsReturn {
  animationClass: string;
  handleClose: () => void;
  handleMinimize: () => void;
  handleFullScreen: () => void;
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
  isRestoreRequested,
  dockMinimizeRequested,
  onClose,
  onMinimize,
  onFullScreen,
  onRestoreComplete,
}: UseWindowAnimationsOptions): UseWindowAnimationsReturn {
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const dockMinimizeHandled = useRef(false);
  const pendingFullScreenRect = useRef<DOMRect | null>(null);
  const fullScreenFrame = useRef<number | null>(null);
  const fullScreenTimer = useRef<number | null>(null);
  const [shouldSkipOpenAnimation, setShouldSkipOpenAnimation] = useState(false);

  const clearFullScreenAnimation = useCallback(() => {
    pendingFullScreenRect.current = null;

    if (fullScreenFrame.current !== null) {
      window.cancelAnimationFrame(fullScreenFrame.current);
      fullScreenFrame.current = null;
    }

    if (fullScreenTimer.current !== null) {
      window.clearTimeout(fullScreenTimer.current);
      fullScreenTimer.current = null;
    }

    const el = windowRef.current;
    if (el) {
      el.style.transition = "";
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.style.willChange = "";
    }
  }, [windowRef]);

  const handleClose = useCallback(() => {
    clearFullScreenAnimation();
    setShouldSkipOpenAnimation(false);
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  }, [clearFullScreenAnimation, onClose]);

  const handleMinimize = useCallback(() => {
    if (isMinimizing) return;
    clearFullScreenAnimation();
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
  }, [clearFullScreenAnimation, id, isMinimizing, onMinimize, windowRef]);

  const handleFullScreen = useCallback(() => {
    const el = windowRef.current;
    if (el) {
      pendingFullScreenRect.current = el.getBoundingClientRect();
      if (fullScreenFrame.current !== null) {
        window.cancelAnimationFrame(fullScreenFrame.current);
        fullScreenFrame.current = null;
      }
      if (fullScreenTimer.current !== null) {
        window.clearTimeout(fullScreenTimer.current);
        fullScreenTimer.current = null;
      }
      el.style.transition = "";
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.style.willChange = "";
    }

    setShouldSkipOpenAnimation(true);
    onFullScreen();
  }, [onFullScreen, windowRef]);

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
    const firstRect = pendingFullScreenRect.current;
    const el = windowRef.current;

    if (!firstRect || !el) {
      return;
    }

    pendingFullScreenRect.current = null;
    const lastRect = el.getBoundingClientRect();
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    if (
      Math.abs(deltaX) < 0.5 &&
      Math.abs(deltaY) < 0.5 &&
      Math.abs(scaleX - 1) < 0.001 &&
      Math.abs(scaleY - 1) < 0.001
    ) {
      return;
    }

    el.style.transition = "none";
    el.style.transformOrigin = "top left";
    el.style.willChange = "transform";
    el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    void el.offsetHeight;

    fullScreenFrame.current = window.requestAnimationFrame(() => {
      fullScreenFrame.current = window.requestAnimationFrame(() => {
        fullScreenFrame.current = null;
        el.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "translate(0, 0) scale(1)";

        fullScreenTimer.current = window.setTimeout(() => {
          fullScreenTimer.current = null;
          el.style.transition = "";
          el.style.transform = "";
          el.style.transformOrigin = "";
          el.style.willChange = "";
        }, 340);
      });
    });
  });

  useEffect(() => clearFullScreenAnimation, [clearFullScreenAnimation]);

  useEffect(() => {
    if (!isRestoreRequested) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldSkipOpenAnimation(true);
      onRestoreComplete();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isRestoreRequested, onRestoreComplete]);

  const isVisible = (isOpen && !isMinimized) || isClosing || isMinimizing;

  const animationClass = isRestoreRequested
    ? "window-restore"
    : isMinimizing
      ? "window-minimize"
      : isClosing
        ? "window-close"
        : shouldSkipOpenAnimation
          ? ""
          : "window-open";

  return {
    animationClass,
    handleClose,
    handleMinimize,
    handleFullScreen,
    isVisible,
  };
}

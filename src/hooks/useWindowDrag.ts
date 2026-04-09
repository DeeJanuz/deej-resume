"use client";

import { useEffect, useRef } from "react";
import type { WindowPosition } from "@/types";

interface UseWindowDragOptions {
  onMove: (position: WindowPosition) => void;
  initialPosition: WindowPosition;
}

export function useWindowDrag({
  onMove,
  initialPosition,
}: UseWindowDragOptions) {
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(initialPosition);

  useEffect(() => {
    positionRef.current = initialPosition;
  }, [initialPosition]);

  function handlePointerDown(event: React.PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    offsetRef.current = {
      x: event.clientX - positionRef.current.x,
      y: event.clientY - positionRef.current.y,
    };

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    function handlePointerMove(moveEvent: PointerEvent) {
      if (!isDraggingRef.current) {
        return;
      }

      const nextX = Math.max(
        -window.innerWidth + 160,
        Math.min(window.innerWidth - 160, moveEvent.clientX - offsetRef.current.x)
      );
      const nextY = Math.max(
        28,
        Math.min(window.innerHeight - 160, moveEvent.clientY - offsetRef.current.y)
      );

      onMove({ x: nextX, y: nextY });
    }

    function handlePointerUp() {
      isDraggingRef.current = false;
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
    }

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
  }

  return {
    handlePointerDown,
  };
}

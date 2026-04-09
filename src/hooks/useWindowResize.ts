"use client";

import { useEffect, useRef } from "react";
import type { WindowPosition, WindowSize } from "@/types";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_WIDTH = 520;
const MIN_HEIGHT = 360;

interface UseWindowResizeOptions {
  onResize: (size: WindowSize, position?: WindowPosition) => void;
  size: WindowSize;
  position: WindowPosition;
}

export function useWindowResize({
  onResize,
  size,
  position,
}: UseWindowResizeOptions) {
  const sizeRef = useRef(size);
  const positionRef = useRef(position);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  function handleResizePointerDown(
    direction: ResizeDirection,
    event: React.PointerEvent
  ) {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = { ...sizeRef.current };
    const startPosition = { ...positionRef.current };

    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);

    function handlePointerMove(moveEvent: PointerEvent) {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let nextWidth = startSize.width;
      let nextHeight = startSize.height;
      let nextX = startPosition.x;
      let nextY = startPosition.y;
      let positionChanged = false;

      if (direction.includes("e")) {
        nextWidth = Math.max(MIN_WIDTH, startSize.width + deltaX);
      }

      if (direction.includes("w")) {
        const proposedWidth = startSize.width - deltaX;
        if (proposedWidth >= MIN_WIDTH) {
          nextWidth = proposedWidth;
          nextX = startPosition.x + deltaX;
        } else {
          nextWidth = MIN_WIDTH;
          nextX = startPosition.x + (startSize.width - MIN_WIDTH);
        }
        positionChanged = true;
      }

      if (direction.includes("s")) {
        nextHeight = Math.max(MIN_HEIGHT, startSize.height + deltaY);
      }

      if (direction.includes("n")) {
        const proposedHeight = startSize.height - deltaY;
        if (proposedHeight >= MIN_HEIGHT) {
          nextHeight = proposedHeight;
          nextY = startPosition.y + deltaY;
        } else {
          nextHeight = MIN_HEIGHT;
          nextY = startPosition.y + (startSize.height - MIN_HEIGHT);
        }
        positionChanged = true;
      }

      onResize(
        { width: nextWidth, height: nextHeight },
        positionChanged ? { x: nextX, y: nextY } : undefined
      );
    }

    function handlePointerUp() {
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
    }

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
  }

  return {
    handleResizePointerDown,
  };
}

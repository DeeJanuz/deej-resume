"use client";

import { useRef, type CSSProperties } from "react";
import type { ResizeDirection, WindowPosition, WindowSize } from "@/types";
import { useWindowAnimations } from "@/hooks/useWindowAnimations";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import { useWindowResize } from "@/hooks/useWindowResize";
import { TrafficLights } from "./TrafficLights";

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isFullScreen: boolean;
  isRestoreRequested: boolean;
  restoreOffset?: WindowPosition;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  dockMinimizeRequested: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFullScreen: () => void;
  onRestoreComplete: () => void;
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

export function Window({
  id,
  title,
  isOpen,
  isFocused,
  isMinimized,
  isFullScreen,
  isRestoreRequested,
  restoreOffset,
  position,
  size,
  zIndex,
  dockMinimizeRequested,
  onClose,
  onMinimize,
  onFullScreen,
  onRestoreComplete,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  const { animationClass, handleClose, handleMinimize, handleFullScreen, isVisible } =
    useWindowAnimations({
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
    });

  const { handlePointerDown } = useWindowDrag({
    onMove,
    initialPosition: position,
  });
  const { handleResizePointerDown } = useWindowResize({
    onResize,
    size,
    position,
  });

  if (!isVisible) {
    return null;
  }

  const restoreStyle =
    isRestoreRequested && restoreOffset
      ? ({
          "--minimize-x": `${restoreOffset.x}px`,
          "--minimize-y": `${restoreOffset.y}px`,
        } as CSSProperties)
      : {};

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
        filter: isFullScreen || isFocused ? "none" : "brightness(0.97)",
        ...restoreStyle,
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
            <TrafficLights
              onClose={handleClose}
              onMinimize={handleMinimize}
              onFullScreen={handleFullScreen}
            />
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

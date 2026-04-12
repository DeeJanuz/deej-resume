"use client";

import { useEffect, useState } from "react";
import { EditableText } from "@/components/dev/EditableText";
import { usePortfolioContent } from "@/components/dev/ContentDevContext";

interface MenuBarProps {
  onOpenPrimary: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MenuBar({ onOpenPrimary }: MenuBarProps) {
  const [now, setNow] = useState(() => new Date());
  const { content } = usePortfolioContent();
  const { siteProfile } = content;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[25px]">
      <div className="flex h-full items-center justify-between px-4" style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-4 font-[system-ui]">
          <button
            type="button"
            aria-label="Open primary past work window"
            onClick={onOpenPrimary}
            className="text-[14px] leading-none text-neutral-800 transition hover:text-neutral-950"
          >
            &#xF8FF;
          </button>
          <EditableText
            as="span"
            path={["siteProfile", "name"]}
            text={siteProfile.name}
            className="text-[13px] font-bold text-neutral-900"
          />
          <span className="hidden text-[13px] font-medium text-neutral-500 md:inline">
            File
          </span>
          <span className="hidden text-[13px] font-medium text-neutral-500 md:inline">
            View
          </span>
        </div>

        <div className="flex items-center gap-3 font-[system-ui] text-[13px] text-neutral-600">
          <EditableText
            as="span"
            path={["siteProfile", "location"]}
            text={siteProfile.location}
            className="hidden lg:inline"
          />
          <span className="hidden sm:inline">{formatDate(now)}</span>
          <span className="font-semibold">{formatTime(now)}</span>
        </div>
      </div>
    </header>
  );
}

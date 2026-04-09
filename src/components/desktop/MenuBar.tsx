"use client";

import { useEffect, useState } from "react";
import { siteProfile } from "@/data/portfolio-content";

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
          <span className="text-[14px] leading-none text-neutral-800">&#xF8FF;</span>
          <span className="text-[13px] font-bold text-neutral-900">
            {siteProfile.name}
          </span>
          <span className="hidden text-[13px] font-medium text-neutral-500 md:inline">
            File
          </span>
          <span className="hidden text-[13px] font-medium text-neutral-500 md:inline">
            View
          </span>
        </div>

        <div className="flex items-center gap-3 font-[system-ui] text-[13px] text-neutral-600">
          <span className="hidden lg:inline">{siteProfile.location}</span>
          <span className="hidden sm:inline">{formatDate(now)}</span>
          <span className="font-semibold">{formatTime(now)}</span>
        </div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import type { ResumeContent } from "@/types";

interface DesktopQuickLookProps {
  resume: ResumeContent;
  top: number;
  left: number;
}

function getPreviewCopy(resume: ResumeContent) {
  if (resume.executiveSummary.summary.length <= 132) {
    return resume.executiveSummary.summary;
  }

  return `${resume.executiveSummary.summary.slice(0, 129).trimEnd()}...`;
}

export function DesktopQuickLook({
  resume,
  top,
  left,
}: DesktopQuickLookProps) {
  const portrait = resume.executiveSummary.heroImage;

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none absolute z-20 w-[280px] rounded-lg border border-stone-200 bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.14)] quick-look-panel"
      style={{ top, left }}
    >
      <div className="flex items-center gap-3">
        {portrait ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone-100">
            <Image
              src={portrait.src}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              style={{ objectPosition: portrait.objectPosition ?? "center" }}
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-stone-950">
            {resume.windowTitle}
          </p>
          <p className="truncate text-[12px] text-stone-500">
            {resume.executiveSummary.title}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-5 text-stone-600">
        {getPreviewCopy(resume)}
      </p>
    </aside>
  );
}

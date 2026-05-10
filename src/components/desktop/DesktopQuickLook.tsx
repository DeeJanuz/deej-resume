"use client";

import { SectionPoster } from "@/components/content/SectionPoster";
import type { ResumeContent } from "@/types";
import { toRgba } from "@/components/content/sectionVisualUtils";

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
  const featuredMetric = resume.executiveSummary.metrics[0];

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none absolute z-20 w-[290px] overflow-hidden rounded-[28px] border border-white/45 bg-[rgba(255,255,255,0.74)] shadow-[0_22px_44px_rgba(8,15,31,0.16)] backdrop-blur-2xl quick-look-panel"
      style={{ top, left }}
    >
      <div className="p-3">
        <SectionPoster
          accent={resume.accent}
          title={resume.windowTitle}
          image={resume.executiveSummary.heroImage}
          metric={featuredMetric}
          artworkAlt={`${resume.windowTitle} quick look art`}
          forceGenerated
          className="aspect-[4/3]"
        />
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Quick Look
            </p>
            <p className="mt-2 text-lg font-semibold text-stone-900">
              {resume.windowTitle}
            </p>
          </div>

          {featuredMetric ? (
            <div
              className="rounded-2xl border px-3 py-2 text-right"
              style={{
                background: toRgba("#ffffff", 0.58),
                borderColor: toRgba(resume.accent, 0.16),
              }}
            >
              <div className="font-display text-2xl leading-none text-stone-900">
                {featuredMetric.value}
              </div>
              <div className="mt-1 max-w-[7rem] text-[10px] leading-4 text-stone-600">
                {featuredMetric.label}
              </div>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-700">
          {getPreviewCopy(resume)}
        </p>
      </div>
    </aside>
  );
}

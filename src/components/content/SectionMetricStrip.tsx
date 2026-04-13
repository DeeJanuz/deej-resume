"use client";

import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type { PortfolioMetric } from "@/types";
import { mixHex, toRgba } from "./sectionVisualUtils";

interface SectionMetricStripProps {
  accent: string;
  metrics: readonly PortfolioMetric[];
  pathPrefix: EditableContentPath;
}

export function SectionMetricStrip({
  accent,
  metrics,
  pathPrefix,
}: SectionMetricStripProps) {
  const visibleMetrics = metrics.slice(0, 3);

  if (visibleMetrics.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {visibleMetrics.map((metric, index) => (
        <div
          key={`${metric.value}-${metric.label}-${index}`}
          className="rounded-[20px] border px-4 py-4 shadow-[0_14px_28px_rgba(0,0,0,0.06)]"
          style={{
            background: `linear-gradient(180deg, ${toRgba("#ffffff", 0.82)} 0%, ${toRgba(mixHex(accent, "#ffffff", 0.76), 0.68)} 100%)`,
            borderColor: toRgba(accent, 0.14),
          }}
        >
          <EditableText
            as="div"
            path={[...pathPrefix, index, "value"]}
            text={metric.value}
            className="font-display text-3xl leading-none tracking-[-0.05em] text-stone-900"
          />
          <EditableText
            as="p"
            path={[...pathPrefix, index, "label"]}
            text={metric.label}
            className="mt-2 text-xs leading-5 text-stone-600"
          />
        </div>
      ))}
    </div>
  );
}

"use client";

import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type { PortfolioMetric } from "@/types";
import { toRgba } from "./sectionVisualUtils";

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
          className="rounded-lg border bg-stone-50 px-4 py-4"
          style={{
            borderColor: toRgba(accent, 0.18),
          }}
        >
          <EditableText
            as="div"
            path={[...pathPrefix, index, "value"]}
            text={metric.value}
            className="text-2xl font-semibold leading-none tracking-normal text-stone-950"
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

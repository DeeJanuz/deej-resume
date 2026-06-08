"use client";

import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type { PortfolioMetric, PortfolioSectionId } from "@/types";
import { toRgba } from "./sectionVisualUtils";

interface SectionMetricStripProps {
  accent: string;
  metrics: readonly PortfolioMetric[];
  pathPrefix: EditableContentPath;
  getMetricTargetId?: (
    metric: PortfolioMetric,
    index: number,
  ) => PortfolioSectionId | null;
  onOpenTarget?: (targetId: PortfolioSectionId) => void;
}

export function SectionMetricStrip({
  accent,
  metrics,
  pathPrefix,
  getMetricTargetId,
  onOpenTarget,
}: SectionMetricStripProps) {
  const visibleMetrics = metrics.slice(0, 3);

  if (visibleMetrics.length === 0) {
    return null;
  }

  return (
    <div className="resume-metric-strip mt-6 grid gap-3 sm:grid-cols-3">
      {visibleMetrics.map((metric, index) => {
        const targetId = getMetricTargetId?.(metric, index) ?? null;
        const className =
          "rounded-lg border bg-stone-50 px-4 py-4 text-left transition";
        const style = {
          borderColor: toRgba(accent, 0.18),
        };
        const metricContent = (
          <>
            <EditableText
              as="span"
              path={[...pathPrefix, index, "value"]}
              text={metric.value}
              className="block text-2xl font-semibold leading-none tracking-normal text-stone-950"
            />
            <EditableText
              as="span"
              path={[...pathPrefix, index, "label"]}
              text={metric.label}
              className="mt-2 block text-xs leading-5 text-stone-600"
            />
          </>
        );

        return targetId && onOpenTarget ? (
          <button
            key={`${metric.value}-${metric.label}-${index}`}
            type="button"
            aria-label={`Open ${metric.value} in the mock browser`}
            className={`${className} hover:border-stone-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6b73]/45`}
            style={style}
            onClick={() => onOpenTarget(targetId)}
          >
            {metricContent}
          </button>
        ) : (
          <div
            key={`${metric.value}-${metric.label}-${index}`}
            className={className}
            style={style}
          >
            {metricContent}
          </div>
        );
      })}
    </div>
  );
}

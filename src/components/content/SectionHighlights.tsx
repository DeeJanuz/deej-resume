"use client";

import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type { PortfolioMetric } from "@/types";

interface SectionHighlightsProps {
  items: readonly PortfolioMetric[];
  pathPrefix: EditableContentPath;
  className?: string;
}

export function SectionHighlights({
  items,
  pathPrefix,
  className = "",
}: SectionHighlightsProps) {
  return (
    <dl className={`resume-highlights ${className}`.trim()}>
      {items.map((item, index) => (
        <div key={`${item.value}-${index}`} className="resume-highlight">
          <dt className="font-display text-[1.15rem] font-semibold leading-snug text-stone-950">
            <EditableText as="span" path={[...pathPrefix, index, "value"]} text={item.value} />
          </dt>
          <dd className="mt-1.5 text-[13px] leading-5 text-stone-600">
            <EditableText as="span" path={[...pathPrefix, index, "label"]} text={item.label} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

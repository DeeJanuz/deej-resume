"use client";

import Image from "next/image";
import type { PortfolioImage, PortfolioMetric } from "@/types";
import {
  computeVisualSeed,
  getInitials,
  mixHex,
  toRgba,
} from "./sectionVisualUtils";

interface SectionPosterProps {
  accent: string;
  title: string;
  image?: PortfolioImage;
  metric?: PortfolioMetric;
  sizes?: string;
  artworkAlt?: string;
  forceGenerated?: boolean;
  className?: string;
}

export function SectionPoster({
  accent,
  title,
  image,
  metric,
  sizes = "(max-width: 768px) 100vw, 320px",
  artworkAlt,
  forceGenerated = false,
  className = "",
}: SectionPosterProps) {
  if (image && !forceGenerated) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100 ${className}`.trim()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="eager"
          sizes={sizes}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_70%,rgba(12,10,9,0.10)_100%)]" />
      </div>
    );
  }

  const seed = computeVisualSeed(`${title}:${metric?.value ?? ""}`);
  const initials = getInitials(title) || "DJ";
  const paleAccent = mixHex(accent, "#ffffff", 0.72);
  const deepAccent = mixHex(accent, "#111827", 0.22);
  const warmAccent = mixHex(accent, "#f5efe5", 0.58);
  const rotation = (seed % 18) - 9;
  const stripeOffset = seed % 120;

  return (
    <div
      role="img"
      aria-label={artworkAlt ?? `${title} poster art`}
      className={`relative overflow-hidden rounded-lg border border-stone-200 ${className}`.trim()}
      style={{
        background: `linear-gradient(145deg, ${paleAccent} 0%, ${warmAccent} 48%, ${deepAccent} 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(circle at 18% 20%, ${toRgba("#ffffff", 0.62)} 0, ${toRgba("#ffffff", 0)} 38%)`,
            `radial-gradient(circle at 82% 18%, ${toRgba(accent, 0.18)} 0, ${toRgba(accent, 0)} 42%)`,
            `linear-gradient(135deg, ${toRgba("#ffffff", 0.15)} 0%, ${toRgba("#ffffff", 0)} 60%)`,
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, ${toRgba("#ffffff", 0.18)} 0 2px, transparent 2px 22px)`,
          opacity: 0.75,
          transform: `translateX(${stripeOffset / 7}px) rotate(${rotation}deg) scale(1.15)`,
        }}
      />
      <div
        className="absolute -left-[12%] top-[18%] h-[42%] w-[55%] rounded-full blur-2xl"
        style={{ background: toRgba(accent, 0.28) }}
      />
      <div
        className="absolute bottom-[-8%] right-[-6%] h-[52%] w-[52%] rounded-full blur-2xl"
        style={{ background: toRgba(deepAccent, 0.34) }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="rounded-md border px-3 py-1 text-[10px] font-semibold uppercase tracking-normal text-stone-800"
            style={{
              background: toRgba("#ffffff", 0.55),
              borderColor: toRgba("#ffffff", 0.48),
            }}
          >
            {metric?.value ?? initials}
          </div>
          <div
            className="rounded-md border px-3 py-1 text-[10px] font-medium uppercase tracking-normal text-stone-700"
            style={{
              background: toRgba("#ffffff", 0.34),
              borderColor: toRgba("#ffffff", 0.3),
            }}
          >
            {metric?.label ?? "Portfolio"}
          </div>
        </div>

        <div className="relative">
          <div className="text-6xl font-semibold leading-none tracking-normal text-white/80">
            {initials}
          </div>
          <div className="mt-3 max-w-[12rem] text-xs leading-5 font-medium text-stone-800/80">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  portfolioSections,
  portfolioSectionsById,
  siteProfile,
} from "@/data/portfolio-content";
import type { PortfolioSectionId } from "@/types";

export default function MobileLanding() {
  const [activeSectionId, setActiveSectionId] =
    useState<PortfolioSectionId>("resume");
  const activeSection = portfolioSectionsById[activeSectionId];

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-stone-900">
      <section className="relative overflow-hidden px-4 pb-8 pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(247,241,232,0)_100%)]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            {siteProfile.location}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.9] text-stone-900">
            {siteProfile.name}
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-700">
            {siteProfile.title}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            {siteProfile.availability}
          </p>
        </div>
      </section>

      <div className="sticky top-0 z-20 border-y border-black/6 bg-[rgba(247,241,232,0.88)] px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {portfolioSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition"
              style={{
                backgroundColor:
                  section.id === activeSectionId ? section.accent : "rgba(255,255,255,0.72)",
                color: section.id === activeSectionId ? "#ffffff" : "#57534e",
              }}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.windowTitle}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <section
          className="rounded-[30px] border border-white/65 p-6 shadow-[0_22px_40px_rgba(38,22,12,0.08)]"
          style={{ background: activeSection.heroGradient }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-600">
            {activeSection.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] text-stone-900">
            {activeSection.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-700">
            {activeSection.intro}
          </p>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          {activeSection.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[22px] border border-black/5 bg-white/78 p-4 shadow-[0_14px_30px_rgba(34,22,12,0.05)]"
            >
              <div className="font-display text-3xl text-stone-900">
                {metric.value}
              </div>
              <div className="mt-2 text-sm text-stone-600">{metric.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-5 space-y-4">
          {activeSection.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[26px] border border-black/5 bg-white/82 p-5 shadow-[0_18px_36px_rgba(34,22,12,0.05)]"
            >
              {card.eyebrow ? (
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  {card.eyebrow}
                </p>
              ) : null}
              <h3 className="mt-3 text-xl font-semibold text-stone-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {card.description}
              </p>

              {card.bullets ? (
                <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: activeSection.accent }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {card.tags ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[rgba(245,238,228,0.9)] px-3 py-1 text-xs font-medium text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

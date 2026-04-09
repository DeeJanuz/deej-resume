"use client";

import type { PortfolioSection } from "@/types";

interface PortfolioWindowContentProps {
  section: PortfolioSection;
}

export function PortfolioWindowContent({
  section,
}: PortfolioWindowContentProps) {
  return (
    <div className="grid h-full min-h-0 md:grid-cols-[240px_1fr]">
      <aside className="hidden min-h-0 border-r border-black/6 bg-[rgba(246,246,246,0.95)] md:flex md:flex-col">
        <div className="border-b border-black/6 p-5">
          <div
            className="rounded-xl p-5 text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
            style={{ background: section.heroGradient }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-700">
              {section.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-none text-stone-900">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-700">
              {section.sidebarNote}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Inside this window
            </p>
            <ul className="mt-4 space-y-2">
              {section.cards.map((card) => (
                <li
                  key={card.title}
                  className="rounded-2xl border border-black/5 bg-white/70 px-3 py-2 text-sm font-medium text-stone-700 shadow-[0_8px_18px_rgba(0,0,0,0.04)]"
                >
                  {card.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Notes
            </p>
            <ul className="mt-4 space-y-3">
              {section.quickFacts.map((fact) => (
                <li key={fact} className="text-sm leading-6 text-stone-600">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col bg-[rgba(255,255,255,0.95)]">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/6 px-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-black/4 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-600">
              {section.eyebrow}
            </span>
            <span className="hidden text-xs text-stone-500 md:inline">
              Portfolio Preview
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/6 bg-white/75 px-3 py-1.5 text-xs text-stone-500 shadow-[0_10px_22px_rgba(0,0,0,0.05)]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: section.accent }}
            />
            Stub content ready for real details
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <section
              className="overflow-hidden rounded-xl border border-white/60 shadow-[0_24px_44px_rgba(0,0,0,0.08)]"
              style={{ background: section.heroGradient }}
            >
              <div className="border-b border-white/40 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-700">
                {section.windowTitle}
              </div>
              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-stone-700">
                  {section.eyebrow}
                </p>
                <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[0.95] text-stone-900 sm:text-5xl">
                  {section.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg">
                  {section.intro}
                </p>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              {section.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-black/5 bg-white/80 p-5 shadow-[0_16px_30px_rgba(0,0,0,0.05)]"
                >
                  <div className="text-3xl font-display text-stone-900">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-stone-600">
                    {metric.label}
                  </div>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-black/5 bg-white/70 p-6 shadow-[0_20px_44px_rgba(0,0,0,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Why this window matters
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
                {section.summary}
              </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {section.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-black/5 bg-white/80 p-6 shadow-[0_18px_36px_rgba(0,0,0,0.05)]"
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
                            style={{ backgroundColor: section.accent }}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {card.tags ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { EditableText } from "@/components/dev/EditableText";
import {
  usePortfolioContent,
  type EditableContentPath,
} from "@/components/dev/ContentDevContext";
import { PortfolioImageBlock } from "@/components/content/PortfolioImageBlock";
import { SectionMetricStrip } from "@/components/content/SectionMetricStrip";
import { SectionPoster } from "@/components/content/SectionPoster";
import type { PortfolioSection } from "@/types";

interface PortfolioWindowContentProps {
  section: PortfolioSection;
  sectionIndex: number;
}

function SectionLinks({
  accent,
  links,
  pathPrefix,
}: {
  accent: string;
  links: readonly { label: string; href: string }[];
  pathPrefix: EditableContentPath;
}) {
  const { isEditMode, isLocal } = usePortfolioContent();

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {links.map((link, index) =>
        isLocal && isEditMode ? (
          <span
            key={`${link.href}-${index}`}
            className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600"
            style={{ boxShadow: `inset 0 0 0 1px ${accent}20` }}
          >
            <EditableText
              as="span"
              path={[...pathPrefix, index, "label"]}
              text={link.label}
            />
          </span>
        ) : (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600 transition hover:-translate-y-0.5"
            style={{ boxShadow: `inset 0 0 0 1px ${accent}20` }}
          >
            {link.label}
          </a>
        ),
      )}
    </div>
  );
}

export function PortfolioWindowContent({
  section,
  sectionIndex,
}: PortfolioWindowContentProps) {
  const heroCallout = section.summary || section.sidebarNote;
  const heroCalloutPath = section.summary
    ? (["portfolioSections", sectionIndex, "summary"] as const)
    : (["portfolioSections", sectionIndex, "sidebarNote"] as const);
  const sectionTargetsRef = useRef<Record<string, HTMLElement | null>>({});
  const setSectionTarget =
    (targetId: string) => (element: HTMLElement | null) => {
      sectionTargetsRef.current[targetId] = element;
    };
  const scrollToTarget = (targetId: string) => {
    sectionTargetsRef.current[targetId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const outlineItems = [
    ...section.cards.map((card, cardIndex) => ({
      targetId: `card-${cardIndex}`,
      text: card.title,
      path: [
        "portfolioSections",
        sectionIndex,
        "cards",
        cardIndex,
        "title",
      ] as const,
    })),
    ...(section.detailSections?.map((detail, detailIndex) => ({
      targetId: `detail-${detailIndex}`,
      text: detail.title,
      path: [
        "portfolioSections",
        sectionIndex,
        "detailSections",
        detailIndex,
        "title",
      ] as const,
    })) ?? []),
  ];
  return (
    <div className="grid h-full min-h-0 md:grid-cols-[240px_1fr]">
      <aside className="hidden min-h-0 border-r border-black/6 bg-[rgba(246,246,246,0.95)] md:flex md:flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Inside this window
            </p>
            <ul className="mt-4 space-y-2">
              {outlineItems.map((item, index) => (
                <li
                  key={`${item.text}-${index}`}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-[0_8px_18px_rgba(0,0,0,0.04)]"
                >
                  <button
                    type="button"
                    onClick={() => scrollToTarget(item.targetId)}
                    className="w-full cursor-pointer px-3 py-2 text-left text-sm font-medium text-stone-700 transition hover:bg-black/[0.03] hover:text-stone-900 focus-visible:bg-black/[0.04] focus-visible:text-stone-900 focus-visible:outline-none"
                  >
                    <EditableText
                      as="span"
                      path={item.path}
                      text={item.text}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Notes
            </p>
            <ul className="mt-4 space-y-3">
              {section.quickFacts.map((fact, factIndex) => (
                <li
                  key={`${fact}-${factIndex}`}
                  className="text-sm leading-6 text-stone-600"
                >
                  <EditableText
                    as="span"
                    path={[
                      "portfolioSections",
                      sectionIndex,
                      "quickFacts",
                      factIndex,
                    ]}
                    text={fact}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col bg-[rgba(255,255,255,0.95)]">
        <div className="min-h-0 overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-6">
            <section
              className="overflow-hidden rounded-xl border border-white/60 shadow-[0_24px_44px_rgba(0,0,0,0.08)]"
              style={{ background: section.heroGradient }}
            >
              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <div className="grid gap-7 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
                  <div className="mx-auto w-full max-w-[320px] md:mx-0 md:max-w-none">
                    <SectionPoster
                      accent={section.accent}
                      title={section.title}
                      image={section.heroImage}
                      metric={section.metrics[0]}
                      sizes="(max-width: 768px) 280px, 320px"
                      className="aspect-square w-full"
                    />
                  </div>

                  <div className="md:self-center">
                    <EditableText
                      as="h1"
                      path={["portfolioSections", sectionIndex, "title"]}
                      text={section.title}
                      className="max-w-3xl font-display text-4xl leading-[0.95] text-stone-900 sm:text-5xl"
                    />
                    <EditableText
                      as="p"
                      path={["portfolioSections", sectionIndex, "intro"]}
                      text={section.intro}
                      className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg"
                    />

                    {heroCallout ? (
                      <div className="mt-5 max-w-3xl rounded-[22px] border border-white/55 bg-[rgba(255,255,255,0.5)] px-4 py-4 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                          Why It Matters
                        </p>
                        <EditableText
                          as="p"
                          path={heroCalloutPath}
                          text={heroCallout}
                          className="mt-2 text-sm leading-7 text-stone-700"
                        />
                      </div>
                    ) : null}

                    <SectionMetricStrip
                      accent={section.accent}
                      metrics={section.metrics}
                      pathPrefix={["portfolioSections", sectionIndex, "metrics"]}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {section.cards.map((card, cardIndex) => (
                <article
                  key={`${card.title}-${cardIndex}`}
                  ref={setSectionTarget(`card-${cardIndex}`)}
                  className="scroll-mt-4 rounded-xl border border-black/5 bg-white/80 p-6 shadow-[0_18px_36px_rgba(0,0,0,0.05)]"
                >
                  {card.eyebrow ? (
                    <EditableText
                      as="p"
                      path={[
                        "portfolioSections",
                        sectionIndex,
                        "cards",
                        cardIndex,
                        "eyebrow",
                      ]}
                      text={card.eyebrow}
                      className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                    />
                  ) : null}

                  <EditableText
                    as="h3"
                    path={[
                      "portfolioSections",
                      sectionIndex,
                      "cards",
                      cardIndex,
                      "title",
                    ]}
                    text={card.title}
                    className="mt-3 text-xl font-semibold text-stone-900"
                  />

                  <EditableText
                    as="p"
                    path={[
                      "portfolioSections",
                      sectionIndex,
                      "cards",
                      cardIndex,
                      "description",
                    ]}
                    text={card.description}
                    className="mt-3 text-sm leading-7 text-stone-600"
                  />

                  {card.bullets ? (
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                      {card.bullets.map((bullet, bulletIndex) => (
                        <li key={`${bullet}-${bulletIndex}`} className="flex gap-3">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: section.accent }}
                          />
                          <EditableText
                            as="span"
                            path={[
                              "portfolioSections",
                              sectionIndex,
                              "cards",
                              cardIndex,
                              "bullets",
                              bulletIndex,
                            ]}
                            text={bullet}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {card.links?.length ? (
                    <SectionLinks
                      accent={section.accent}
                      links={card.links}
                      pathPrefix={[
                        "portfolioSections",
                        sectionIndex,
                        "cards",
                        cardIndex,
                        "links",
                      ]}
                    />
                  ) : null}

                  {card.tags ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.tags.map((tag, tagIndex) => (
                        <span
                          key={`${tag}-${tagIndex}`}
                          className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600"
                        >
                          <EditableText
                            as="span"
                            path={[
                              "portfolioSections",
                              sectionIndex,
                              "cards",
                              cardIndex,
                              "tags",
                              tagIndex,
                            ]}
                            text={tag}
                          />
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>

            {section.detailSections?.length ? (
              <section className="space-y-4">
                {section.detailSections.map((detail, detailIndex) => (
                  <article
                    key={`${detail.title}-${detailIndex}`}
                    ref={setSectionTarget(`detail-${detailIndex}`)}
                    className="scroll-mt-4 rounded-xl border border-black/5 bg-white/80 p-6 shadow-[0_18px_36px_rgba(0,0,0,0.05)]"
                  >
                    {detail.eyebrow ? (
                      <EditableText
                        as="p"
                        path={[
                          "portfolioSections",
                          sectionIndex,
                          "detailSections",
                          detailIndex,
                          "eyebrow",
                        ]}
                        text={detail.eyebrow}
                        className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
                      />
                    ) : null}

                    <EditableText
                      as="h3"
                      path={[
                        "portfolioSections",
                        sectionIndex,
                        "detailSections",
                        detailIndex,
                        "title",
                      ]}
                      text={detail.title}
                      className="mt-3 text-2xl font-semibold text-stone-900"
                    />

                    {detail.image ? (
                      <div className="mt-5 max-w-3xl">
                        <PortfolioImageBlock
                          image={detail.image}
                          captionPath={[
                            "portfolioSections",
                            sectionIndex,
                            "detailSections",
                            detailIndex,
                            "image",
                            "caption",
                          ]}
                          sizes="(max-width: 768px) 100vw, 880px"
                        />
                      </div>
                    ) : null}

                    {detail.paragraphs?.map((paragraph, paragraphIndex) => (
                      <EditableText
                        key={`${paragraph}-${paragraphIndex}`}
                        as="p"
                        path={[
                          "portfolioSections",
                          sectionIndex,
                          "detailSections",
                          detailIndex,
                          "paragraphs",
                          paragraphIndex,
                        ]}
                        text={paragraph}
                        className="mt-4 max-w-4xl text-sm leading-7 text-stone-600"
                      />
                    ))}

                    {detail.bullets?.length ? (
                      <ul className="mt-5 space-y-2 text-sm leading-6 text-stone-600">
                        {detail.bullets.map((bullet, bulletIndex) => (
                          <li key={`${bullet}-${bulletIndex}`} className="flex gap-3">
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: section.accent }}
                            />
                            <EditableText
                              as="span"
                              path={[
                                "portfolioSections",
                                sectionIndex,
                                "detailSections",
                                detailIndex,
                                "bullets",
                                bulletIndex,
                              ]}
                              text={bullet}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {detail.links?.length ? (
                      <SectionLinks
                        accent={section.accent}
                        links={detail.links}
                        pathPrefix={[
                          "portfolioSections",
                          sectionIndex,
                          "detailSections",
                          detailIndex,
                          "links",
                        ]}
                      />
                    ) : null}
                  </article>
                ))}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

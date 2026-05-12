"use client";

import { useEffect, useRef, useState } from "react";
import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type {
  PortfolioLink,
  ResumeContent,
  ResumeContentSection,
} from "@/types";
import { PortfolioImageBlock } from "./PortfolioImageBlock";
import { SectionPoster } from "./SectionPoster";
import { SectionMetricStrip } from "./SectionMetricStrip";

interface SectionLinksProps {
  accent: string;
  links: readonly PortfolioLink[];
  pathPrefix: EditableContentPath;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  rootRef?: React.RefObject<HTMLElement | null>;
}

interface ResumeExecutiveSummaryHeroProps {
  resume: ResumeContent;
  rootRef?: React.RefObject<HTMLElement | null>;
}

interface ResumeSectionBodyProps {
  section: ResumeContentSection;
  sectionIndex: number;
  rootRef?: React.RefObject<HTMLElement | null>;
}

interface ResumeContentCardProps {
  section: ResumeContentSection;
  sectionIndex: number;
  card: ResumeContentSection["cards"][number];
  cardIndex: number;
  rootRef?: React.RefObject<HTMLElement | null>;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollWithinContainer(
  target: HTMLElement | null,
  container: HTMLElement | null,
) {
  if (!target || !container) {
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function SectionLinks({ accent, links, pathPrefix }: SectionLinksProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a
          key={`${link.href}-${link.label}-${index}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700 transition hover:border-stone-300 hover:bg-white"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}20` }}
        >
          <EditableText
            as="span"
            path={[...pathPrefix, index, "label"]}
            text={link.label}
          />
        </a>
      ))}
    </div>
  );
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  rootRef,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const frameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    if (isVisible) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: rootRef?.current ?? null,
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootRef]);

  return (
    <div
      ref={elementRef}
      className={`resume-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ResumeContentCard({
  section,
  sectionIndex,
  card,
  cardIndex,
  rootRef,
}: ResumeContentCardProps) {
  return (
    <ScrollReveal rootRef={rootRef} delay={cardIndex * 50}>
      <article className="rounded-lg border border-stone-200 bg-white p-5">
        {card.eyebrow ? (
          <EditableText
            as="p"
            path={["resume", "sections", sectionIndex, "cards", cardIndex, "eyebrow"]}
            text={card.eyebrow}
            className="text-[11px] font-semibold uppercase tracking-normal text-stone-500"
          />
        ) : null}

        <EditableText
          as="h3"
          path={["resume", "sections", sectionIndex, "cards", cardIndex, "title"]}
          text={card.title}
          className="mt-2 text-lg font-semibold leading-snug text-stone-950"
        />

        <EditableText
          as="p"
          path={[
            "resume",
            "sections",
            sectionIndex,
            "cards",
            cardIndex,
            "description",
          ]}
          text={card.description}
          className="mt-3 text-sm leading-7 text-stone-600"
        />

        {card.bullets?.length ? (
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
                    "resume",
                    "sections",
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
              "resume",
              "sections",
              sectionIndex,
              "cards",
              cardIndex,
              "links",
            ]}
          />
        ) : null}

        {card.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {card.tags.map((tag, tagIndex) => (
              <span
                key={`${tag}-${tagIndex}`}
              className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700"
              >
                <EditableText
                  as="span"
                  path={[
                    "resume",
                    "sections",
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
    </ScrollReveal>
  );
}

export function ResumeExecutiveSummaryHero({
  resume,
  rootRef,
}: ResumeExecutiveSummaryHeroProps) {
  const summary = resume.executiveSummary;
  const summaryHeroImage = summary.heroImage;

  return (
    <ScrollReveal rootRef={rootRef}>
      <section
        className="overflow-hidden rounded-lg border border-stone-200 bg-white"
        style={{ borderTop: `4px solid ${summary.accent}` }}
      >
        <div
          className={`grid gap-8 px-6 py-7 sm:px-8 sm:py-8 ${
            summaryHeroImage
              ? "xl:grid-cols-[minmax(0,1.35fr)_280px] xl:items-center"
              : ""
          }`.trim()}
        >
          <div>
            <EditableText
              as="p"
              path={["resume", "executiveSummary", "eyebrow"]}
              text={summary.eyebrow}
              className="text-[11px] font-semibold uppercase tracking-normal text-stone-500"
            />
            <EditableText
              as="h1"
              path={["resume", "executiveSummary", "title"]}
              text={summary.title}
              className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-[2.75rem]"
            />
            <EditableText
              as="p"
              path={["resume", "executiveSummary", "intro"]}
              text={summary.intro}
              className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg"
            />
            <div
              className="mt-5 border-l-2 pl-4"
              style={{ borderColor: summary.accent }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-normal text-stone-500">
                Why Teams Bring Me In
              </p>
              <EditableText
                as="p"
                path={["resume", "executiveSummary", "summary"]}
                text={summary.summary}
                className="mt-2 text-sm leading-7 text-stone-700"
              />
            </div>

            <SectionMetricStrip
              accent={summary.accent}
              metrics={summary.metrics}
              pathPrefix={["resume", "executiveSummary", "metrics"]}
            />
          </div>

          {summaryHeroImage ? (
            <div className="mx-auto w-full max-w-[280px]">
              <SectionPoster
                accent={summary.accent}
                title={summary.title}
                image={summaryHeroImage}
                metric={summary.metrics[0]}
                sizes="(max-width: 1280px) 280px, 320px"
                className="aspect-[4/5] w-full"
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-x-8 gap-y-5 border-t border-stone-200 px-6 py-6 sm:px-8 lg:grid-cols-2">
          {summary.valuePillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} rootRef={rootRef} delay={index * 60}>
              <article className="border-l-2 pl-4" style={{ borderColor: summary.accent }}>
                <EditableText
                  as="h2"
                  path={["resume", "executiveSummary", "valuePillars", index, "title"]}
                  text={pillar.title}
                  className="text-lg font-semibold text-stone-900"
                />
                <EditableText
                  as="p"
                  path={[
                    "resume",
                    "executiveSummary",
                    "valuePillars",
                    index,
                    "description",
                  ]}
                  text={pillar.description}
                  className="mt-2 text-sm leading-7 text-stone-700"
                />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-stone-200 px-6 py-6 sm:px-8 xl:flex-row xl:items-end xl:justify-between">
          <ul className="grid gap-3 text-sm leading-6 text-stone-700">
            {summary.quickFacts.map((fact, factIndex) => (
              <li key={`${fact}-${factIndex}`} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: summary.accent }}
                />
                <EditableText
                  as="span"
                  path={["resume", "executiveSummary", "quickFacts", factIndex]}
                  text={fact}
                />
              </li>
            ))}
          </ul>

          {summary.primaryLinks?.length ? (
            <SectionLinks
              accent={summary.accent}
              links={summary.primaryLinks}
              pathPrefix={["resume", "executiveSummary", "primaryLinks"]}
            />
          ) : null}
        </div>
      </section>
    </ScrollReveal>
  );
}

export function ResumeSectionBody({
  section,
  sectionIndex,
  rootRef,
}: ResumeSectionBodyProps) {
  const heroImage = section.heroImage;
  const desktopQuickFactColumns = section.quickFacts.reduce<Array<string[]>>(
    (columns, fact, factIndex) => {
      columns[factIndex % 2].push(fact);
      return columns;
    },
    [[], []],
  );
  const desktopCardColumns = section.cards.reduce<
    Array<Array<{ card: ResumeContentSection["cards"][number]; cardIndex: number }>>
  >(
    (columns, card, cardIndex) => {
      columns[cardIndex % 2].push({ card, cardIndex });
      return columns;
    },
    [[], []],
  );

  return (
    <section className="space-y-5">
      <ScrollReveal rootRef={rootRef}>
        <div
          className="overflow-hidden rounded-lg border border-stone-200 bg-white"
          style={{ borderTop: `4px solid ${section.accent}` }}
        >
          <div
            className={`grid gap-6 px-6 py-6 sm:px-8 sm:py-7 ${
              heroImage
                ? "lg:grid-cols-[minmax(0,1.25fr)_280px] lg:items-center"
                : ""
            }`.trim()}
          >
            <div>
              <EditableText
                as="p"
                path={["resume", "sections", sectionIndex, "eyebrow"]}
                text={section.eyebrow}
                className="text-[11px] font-semibold uppercase tracking-normal text-stone-500"
              />
              <EditableText
                as="h2"
                path={["resume", "sections", sectionIndex, "title"]}
                text={section.title}
                className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-4xl"
              />
              <EditableText
                as="p"
                path={["resume", "sections", sectionIndex, "intro"]}
                text={section.intro}
                className="mt-4 text-sm leading-7 text-stone-700 sm:text-base"
              />
              <EditableText
                as="p"
                path={["resume", "sections", sectionIndex, "summary"]}
                text={section.summary}
                className="mt-4 text-sm leading-7 text-stone-600"
              />
            </div>

            {heroImage ? (
              <div className="mx-auto w-full max-w-[280px]">
                <SectionPoster
                  accent={section.accent}
                  title={section.title}
                  image={heroImage}
                  metric={section.metrics[0]}
                  sizes="280px"
                  className="aspect-[4/3] w-full"
                />
              </div>
            ) : null}
          </div>

          {section.metrics.length > 0 ? (
            <div className="border-t border-white/55 px-6 py-6 sm:px-8">
              <SectionMetricStrip
                accent={section.accent}
                metrics={section.metrics}
                pathPrefix={["resume", "sections", sectionIndex, "metrics"]}
              />
            </div>
          ) : null}
        </div>
      </ScrollReveal>

      {section.quickFacts.length ? (
        <ScrollReveal rootRef={rootRef} delay={40}>
          <div className="rounded-lg border border-stone-200 bg-white px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-normal text-stone-500">
              In Brief
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700 sm:hidden">
              {section.quickFacts.map((fact, factIndex) => (
                <li key={`${fact}-${factIndex}`} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: section.accent }}
                  />
                  <EditableText
                    as="span"
                    path={["resume", "sections", sectionIndex, "quickFacts", factIndex]}
                    text={fact}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-4 hidden gap-6 sm:grid sm:grid-cols-2 sm:items-start">
              {desktopQuickFactColumns.map((column, columnIndex) => (
                <ul
                  key={`quick-facts-column-${columnIndex}`}
                  className="space-y-3 text-sm leading-6 text-stone-700"
                >
                  {column.map((fact, factIndex) => {
                    const originalIndex = columnIndex + factIndex * 2;

                    return (
                      <li key={`${fact}-${originalIndex}`} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: section.accent }}
                        />
                        <EditableText
                          as="span"
                          path={[
                            "resume",
                            "sections",
                            sectionIndex,
                            "quickFacts",
                            originalIndex,
                          ]}
                          text={fact}
                        />
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ) : null}

      <div className="space-y-4 lg:hidden">
        {section.cards.map((card, cardIndex) => (
          <ResumeContentCard
            key={`${card.title}-${cardIndex}`}
            section={section}
            sectionIndex={sectionIndex}
            card={card}
            cardIndex={cardIndex}
            rootRef={rootRef}
          />
        ))}
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-2 lg:items-start">
        {desktopCardColumns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="space-y-4">
            {column.map(({ card, cardIndex }) => (
              <ResumeContentCard
                key={`${card.title}-${cardIndex}`}
                section={section}
                sectionIndex={sectionIndex}
                card={card}
                cardIndex={cardIndex}
                rootRef={rootRef}
              />
            ))}
          </div>
        ))}
      </div>

      {section.detailSections?.length ? (
        <div className="space-y-4">
          {section.detailSections.map((detail, detailIndex) => (
            <ScrollReveal
              key={`${detail.title}-${detailIndex}`}
              rootRef={rootRef}
              delay={detailIndex * 40}
            >
              <article className="rounded-lg border border-stone-200 bg-white p-6">
                {detail.eyebrow ? (
                  <EditableText
                    as="p"
                    path={[
                      "resume",
                      "sections",
                      sectionIndex,
                      "detailSections",
                      detailIndex,
                      "eyebrow",
                    ]}
                    text={detail.eyebrow}
                    className="text-[11px] font-semibold uppercase tracking-normal text-stone-500"
                  />
                ) : null}

                <EditableText
                  as="h3"
                  path={[
                    "resume",
                    "sections",
                    sectionIndex,
                    "detailSections",
                    detailIndex,
                    "title",
                  ]}
                  text={detail.title}
                  className="mt-2 text-xl font-semibold leading-snug text-stone-950"
                />

                {detail.image ? (
                  <div className="mt-5 max-w-2xl">
                    <PortfolioImageBlock
                      image={detail.image}
                      captionPath={[
                        "resume",
                        "sections",
                        sectionIndex,
                        "detailSections",
                        detailIndex,
                        "image",
                        "caption",
                      ]}
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                  </div>
                ) : null}

                {detail.paragraphs?.map((paragraph, paragraphIndex) => (
                  <EditableText
                    key={`${paragraph}-${paragraphIndex}`}
                    as="p"
                    path={[
                      "resume",
                      "sections",
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
                            "resume",
                            "sections",
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
                      "resume",
                      "sections",
                      sectionIndex,
                      "detailSections",
                      detailIndex,
                      "links",
                    ]}
                  />
                ) : null}
              </article>
            </ScrollReveal>
          ))}
        </div>
      ) : null}
    </section>
  );
}

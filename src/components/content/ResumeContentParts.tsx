"use client";

import { useEffect, useRef, useState } from "react";
import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type {
  PortfolioLink,
  PortfolioMetric,
  PortfolioSectionId,
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
  onOpenProjectBrowser?: (targetId: PortfolioSectionId) => void;
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

const PROJECT_METRIC_TARGETS: Partial<Record<string, PortfolioSectionId>> = {
  Ludflow: "ludflow",
  MCPViews: "mcpviews",
  DecidR: "decidr-mcp",
};

function getProjectMetricTargetId(metric: PortfolioMetric) {
  return PROJECT_METRIC_TARGETS[metric.value] ?? null;
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
        threshold: 0.01,
        rootMargin: "0px 0px 60% 0px",
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
    <ScrollReveal rootRef={rootRef} delay={cardIndex * 25} className="h-full">
      <article className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-4">
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
          className="mt-2 text-base font-semibold leading-snug text-stone-950"
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
          className="mt-2.5 text-[13px] leading-6 text-stone-600"
        />

        {card.bullets?.length ? (
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-stone-600">
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
          className={`resume-summary-hero-grid grid gap-6 px-5 py-6 sm:px-6 sm:py-6 ${
            summaryHeroImage
              ? "resume-summary-hero-grid--with-image xl:grid-cols-[clamp(14rem,20vw,18rem)_minmax(0,1fr)] xl:items-center"
              : ""
          }`.trim()}
        >
          {summaryHeroImage ? (
            <div className="resume-summary-image-wrap mx-auto w-full max-w-[clamp(13rem,58vw,18rem)] xl:max-w-none">
              <SectionPoster
                accent={summary.accent}
                title={summary.title}
                image={summaryHeroImage}
                metric={summary.metrics[0]}
                sizes="(max-width: 767px) min(calc(100vw - 40px), 18rem), (max-width: 1279px) 18rem, min(20vw, 18rem)"
                className="w-full"
              />
            </div>
          ) : null}

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
              className="resume-summary-title mt-2.5 max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-[2.35rem]"
            />
            <EditableText
              as="p"
              path={["resume", "executiveSummary", "intro"]}
              text={summary.intro}
              className="resume-summary-intro mt-3 max-w-3xl text-[15px] leading-6 text-stone-700"
            />
          </div>
        </div>

        <div className="resume-summary-proof-row border-t border-stone-200 px-5 py-5 sm:px-6">
          <SectionMetricStrip
            accent={summary.accent}
            metrics={summary.metrics}
            pathPrefix={["resume", "executiveSummary", "metrics"]}
          />
        </div>

        {summary.valuePillars.length ? (
          <div className="resume-value-pillars grid gap-x-6 gap-y-4 border-t border-stone-200 px-5 py-5 sm:px-6 lg:grid-cols-2">
            {summary.valuePillars.map((pillar, index) => (
              <ScrollReveal key={pillar.title} rootRef={rootRef} delay={index * 30}>
                <article className="border-l-2 pl-4" style={{ borderColor: summary.accent }}>
                  <EditableText
                    as="h2"
                    path={["resume", "executiveSummary", "valuePillars", index, "title"]}
                    text={pillar.title}
                    className="text-base font-semibold text-stone-900"
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
                    className="mt-1.5 text-[13px] leading-6 text-stone-700"
                  />
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : null}

      </section>
    </ScrollReveal>
  );
}

export function ResumeSectionBody({
  section,
  sectionIndex,
  onOpenProjectBrowser,
  rootRef,
}: ResumeSectionBodyProps) {
  const heroImage = section.heroImage;
  const showHero = section.showHero !== false;
  const desktopQuickFactColumns = section.quickFacts.reduce<Array<string[]>>(
    (columns, fact, factIndex) => {
      columns[factIndex % 2].push(fact);
      return columns;
    },
    [[], []],
  );

  return (
    <section className="space-y-5">
      {showHero ? (
        <ScrollReveal rootRef={rootRef}>
          <div
            className="overflow-hidden rounded-lg border border-stone-200 bg-white"
            style={{ borderTop: `4px solid ${section.accent}` }}
          >
            <div
              className={`resume-section-hero-grid grid gap-5 px-5 py-5 sm:px-6 sm:py-6 ${
                heroImage
                  ? "resume-section-hero-grid--with-image lg:grid-cols-[minmax(0,1.2fr)_clamp(16rem,22vw,21rem)] lg:items-center"
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
                  className="resume-section-title mt-2.5 text-2xl font-semibold leading-tight tracking-normal text-stone-950 sm:text-3xl"
                />
                <EditableText
                  as="p"
                  path={["resume", "sections", sectionIndex, "intro"]}
                  text={section.intro}
                  className="resume-section-intro mt-3 text-[13px] leading-6 text-stone-700 sm:text-sm"
                />
                <EditableText
                  as="p"
                  path={["resume", "sections", sectionIndex, "summary"]}
                  text={section.summary}
                  className="mt-3 text-[13px] leading-6 text-stone-600"
                />
              </div>

              {heroImage ? (
                <div className="resume-section-image-wrap mx-auto w-full max-w-[clamp(16rem,68vw,21rem)] lg:max-w-none">
                  <SectionPoster
                    accent={section.accent}
                    title={section.title}
                    image={heroImage}
                    metric={section.metrics[0]}
                    sizes="(max-width: 767px) min(calc(100vw - 48px), 21rem), (max-width: 1023px) 21rem, min(22vw, 21rem)"
                    className="w-full"
                  />
                </div>
              ) : null}
            </div>

            {section.metrics.length > 0 ? (
              <div className="resume-section-metrics border-t border-white/55 px-5 py-5 sm:px-6">
                <SectionMetricStrip
                  accent={section.accent}
                  metrics={section.metrics}
                  pathPrefix={["resume", "sections", sectionIndex, "metrics"]}
                  getMetricTargetId={
                    section.id === "projects" ? getProjectMetricTargetId : undefined
                  }
                  onOpenTarget={onOpenProjectBrowser}
                />
              </div>
            ) : null}
          </div>
        </ScrollReveal>
      ) : null}

      {section.quickFacts.length ? (
        <ScrollReveal rootRef={rootRef} delay={20}>
          <div className="resume-quickfacts-card rounded-lg border border-stone-200 bg-white px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-normal text-stone-500">
              In Brief
            </p>
            <ul className="resume-quickfacts-single mt-3 space-y-2.5 text-[13px] leading-6 text-stone-700 sm:hidden">
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

            <div className="resume-quickfacts-columns mt-3 hidden gap-5 sm:grid sm:grid-cols-2 sm:items-start">
              {desktopQuickFactColumns.map((column, columnIndex) => (
                <ul
                  key={`quick-facts-column-${columnIndex}`}
                  className="space-y-2.5 text-[13px] leading-6 text-stone-700"
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

      <div className="resume-card-list space-y-4 lg:hidden">
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

      <div className="resume-card-columns hidden gap-4 lg:grid lg:grid-cols-2">
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

      {section.detailSections?.length ? (
        <div className="space-y-4">
          {section.detailSections.map((detail, detailIndex) => (
            <ScrollReveal
              key={`${detail.title}-${detailIndex}`}
              rootRef={rootRef}
              delay={detailIndex * 25}
            >
              <article className="resume-detail-card rounded-lg border border-stone-200 bg-white p-5">
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
                  className="mt-2 text-lg font-semibold leading-snug text-stone-950"
                />

                {detail.image ? (
                  <div className="resume-detail-image-wrap mt-5 max-w-2xl">
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
                    className="mt-3 max-w-4xl text-[13px] leading-6 text-stone-600"
                  />
                ))}

                {detail.bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-[13px] leading-6 text-stone-600">
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

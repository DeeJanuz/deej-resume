"use client";

import { useEffect, useRef, useState } from "react";
import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type {
  PortfolioLink,
  ResumeContent,
  ResumeContentSection,
  ResumeSectionId,
} from "@/types";
import { SectionPoster } from "./SectionPoster";
import { SectionMetricStrip } from "./SectionMetricStrip";
import { mixHex, toRgba } from "./sectionVisualUtils";

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
          className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600 transition hover:-translate-y-0.5"
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
      <article className="rounded-[24px] border border-black/5 bg-white/84 p-6 shadow-[0_16px_32px_rgba(0,0,0,0.05)]">
        {card.eyebrow ? (
          <EditableText
            as="p"
            path={["resume", "sections", sectionIndex, "cards", cardIndex, "eyebrow"]}
            text={card.eyebrow}
            className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
          />
        ) : null}

        <EditableText
          as="h3"
          path={["resume", "sections", sectionIndex, "cards", cardIndex, "title"]}
          text={card.title}
          className="mt-3 text-xl font-semibold text-stone-900"
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
                className="rounded-full border border-black/8 bg-[rgba(246,246,246,0.96)] px-3 py-1 text-xs font-medium text-stone-600"
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

function ResumeVectorGraphic({
  accent,
  variant,
  className = "",
}: {
  accent: string;
  variant: ResumeSectionId;
  className?: string;
}) {
  const pale = mixHex(accent, "#ffffff", 0.78);
  const deep = mixHex(accent, "#111827", 0.22);
  const mist = toRgba(accent, 0.18);

  if (variant === "summary") {
    return (
      <svg
        viewBox="0 0 320 240"
        className={`h-full w-full ${className}`.trim()}
        role="img"
        aria-label="Executive summary illustration"
      >
        <defs>
          <linearGradient id="summary-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={pale} />
            <stop offset="100%" stopColor={deep} />
          </linearGradient>
        </defs>
        <rect x="18" y="20" width="284" height="200" rx="32" fill="url(#summary-gradient)" />
        <circle cx="88" cy="84" r="42" fill={toRgba("#ffffff", 0.52)} />
        <circle cx="150" cy="112" r="62" fill={mist} />
        <circle cx="232" cy="88" r="30" fill={toRgba("#ffffff", 0.28)} />
        <path
          d="M56 164C88 138 122 124 160 124C206 124 238 143 270 184"
          fill="none"
          stroke={toRgba("#ffffff", 0.7)}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M68 190C98 160 124 150 160 150C202 150 226 166 256 198"
          fill="none"
          stroke={toRgba(accent, 0.62)}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "experience") {
    return (
      <svg
        viewBox="0 0 320 220"
        className={`h-full w-full ${className}`.trim()}
        role="img"
        aria-label="Experience illustration"
      >
        <rect x="28" y="26" width="92" height="148" rx="24" fill={toRgba("#ffffff", 0.72)} />
        <rect x="132" y="52" width="70" height="122" rx="22" fill={mist} />
        <rect x="214" y="84" width="78" height="90" rx="22" fill={toRgba(accent, 0.35)} />
        <path
          d="M52 176H284"
          stroke={toRgba(deep, 0.44)}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M58 74H90"
          stroke={toRgba(accent, 0.72)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M58 102H100"
          stroke={toRgba(accent, 0.46)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M58 130H84"
          stroke={toRgba(accent, 0.3)}
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "projects") {
    return (
      <svg
        viewBox="0 0 320 220"
        className={`h-full w-full ${className}`.trim()}
        role="img"
        aria-label="Projects illustration"
      >
        <circle cx="88" cy="108" r="28" fill={toRgba(accent, 0.52)} />
        <circle cx="160" cy="64" r="24" fill={mist} />
        <circle cx="234" cy="128" r="32" fill={toRgba("#ffffff", 0.6)} />
        <path
          d="M108 96L140 74"
          stroke={toRgba(deep, 0.44)}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M184 78L210 112"
          stroke={toRgba(deep, 0.44)}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M110 122L202 132"
          stroke={toRgba(accent, 0.62)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <rect x="44" y="156" width="232" height="20" rx="10" fill={toRgba("#ffffff", 0.56)} />
      </svg>
    );
  }

  if (variant === "skills") {
    return (
      <svg
        viewBox="0 0 320 220"
        className={`h-full w-full ${className}`.trim()}
        role="img"
        aria-label="Capabilities illustration"
      >
        {[
          [48, 56, 88],
          [48, 102, 124],
          [48, 148, 154],
          [188, 56, 74],
          [188, 102, 108],
          [188, 148, 138],
        ].map(([x, y, width]) => (
          <rect
            key={`${x}-${y}-${width}`}
            x={x}
            y={y}
            width={width}
            height="24"
            rx="12"
            fill={toRgba("#ffffff", 0.64)}
          />
        ))}
        <circle cx="138" cy="68" r="6" fill={toRgba(accent, 0.72)} />
        <circle cx="210" cy="114" r="6" fill={toRgba(accent, 0.72)} />
        <circle cx="132" cy="160" r="6" fill={toRgba(accent, 0.72)} />
      </svg>
    );
  }

  if (variant === "about") {
    return (
      <svg
        viewBox="0 0 320 220"
        className={`h-full w-full ${className}`.trim()}
        role="img"
        aria-label="About illustration"
      >
        <path
          d="M62 168C78 108 112 72 160 72C208 72 242 108 258 168"
          fill={toRgba("#ffffff", 0.64)}
        />
        <circle cx="160" cy="78" r="34" fill={mist} />
        <path
          d="M94 162C112 138 132 126 160 126C188 126 208 138 226 162"
          fill="none"
          stroke={toRgba(accent, 0.58)}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="84" cy="68" r="16" fill={toRgba("#ffffff", 0.34)} />
        <circle cx="244" cy="56" r="20" fill={toRgba("#ffffff", 0.28)} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 220"
      className={`h-full w-full ${className}`.trim()}
      role="img"
      aria-label="Contact illustration"
    >
      <rect x="42" y="48" width="236" height="136" rx="28" fill={toRgba("#ffffff", 0.68)} />
      <path
        d="M62 80L160 142L258 80"
        fill="none"
        stroke={toRgba(accent, 0.64)}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62 160L124 112"
        fill="none"
        stroke={toRgba(accent, 0.32)}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M258 160L196 112"
        fill="none"
        stroke={toRgba(accent, 0.32)}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ResumeExecutiveSummaryHero({
  resume,
  rootRef,
}: ResumeExecutiveSummaryHeroProps) {
  const summary = resume.executiveSummary;

  return (
    <ScrollReveal rootRef={rootRef}>
      <section
        className="overflow-hidden rounded-[28px] border border-white/65 shadow-[0_26px_48px_rgba(0,0,0,0.08)]"
        style={{ background: summary.heroGradient }}
      >
        <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8 xl:grid-cols-[minmax(0,1.35fr)_280px] xl:items-center">
          <div>
            <EditableText
              as="p"
              path={["resume", "executiveSummary", "eyebrow"]}
              text={summary.eyebrow}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500"
            />
            <EditableText
              as="h1"
              path={["resume", "executiveSummary", "title"]}
              text={summary.title}
              className="mt-4 max-w-3xl font-display text-4xl leading-[0.95] tracking-[-0.04em] text-stone-900 sm:text-5xl"
            />
            <EditableText
              as="p"
              path={["resume", "executiveSummary", "intro"]}
              text={summary.intro}
              className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg"
            />
            <div className="mt-5 rounded-[22px] border border-white/60 bg-[rgba(255,255,255,0.56)] px-4 py-4 shadow-[0_16px_30px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
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

          <div className="mx-auto w-full max-w-[280px]">
            <SectionPoster
              accent={summary.accent}
              title={summary.title}
              image={summary.heroImage}
              metric={summary.metrics[0]}
              sizes="(max-width: 1280px) 280px, 320px"
              className="resume-graphic-float aspect-[4/5] w-full"
            />
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/55 bg-[rgba(255,255,255,0.28)] px-6 py-6 sm:px-8 lg:grid-cols-2">
          {summary.valuePillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} rootRef={rootRef} delay={index * 60}>
              <article className="rounded-[22px] border border-white/60 bg-[rgba(255,255,255,0.5)] px-4 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
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

        <div className="flex flex-col gap-4 border-t border-white/55 px-6 py-6 sm:px-8 xl:flex-row xl:items-end xl:justify-between">
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
          className="overflow-hidden rounded-[28px] border border-black/5 bg-white/82 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
          style={{ backgroundImage: `${section.heroGradient}, linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.9))` }}
        >
          <div className="grid gap-6 px-6 py-6 sm:px-8 sm:py-7 lg:grid-cols-[minmax(0,1.3fr)_240px] lg:items-center">
            <div>
              <EditableText
                as="p"
                path={["resume", "sections", sectionIndex, "eyebrow"]}
                text={section.eyebrow}
                className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500"
              />
              <EditableText
                as="h2"
                path={["resume", "sections", sectionIndex, "title"]}
                text={section.title}
                className="mt-4 font-display text-3xl leading-[0.98] tracking-[-0.04em] text-stone-900 sm:text-4xl"
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

            <div className="mx-auto w-full max-w-[220px]">
              {section.heroImage ? (
                <SectionPoster
                  accent={section.accent}
                  title={section.title}
                  image={section.heroImage}
                  metric={section.metrics[0]}
                  sizes="220px"
                  className="resume-graphic-float aspect-[4/5] w-full"
                />
              ) : (
                <div className="resume-graphic-float rounded-[26px] border border-white/65 bg-[rgba(255,255,255,0.54)] p-5 shadow-[0_18px_32px_rgba(0,0,0,0.06)]">
                  <ResumeVectorGraphic accent={section.accent} variant={section.id} />
                </div>
              )}
            </div>
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
          <div className="rounded-[24px] border border-black/5 bg-[rgba(255,255,255,0.82)] px-6 py-5 shadow-[0_14px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
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
              <article className="rounded-[24px] border border-black/5 bg-white/84 p-6 shadow-[0_16px_32px_rgba(0,0,0,0.05)]">
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
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500"
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
                  className="mt-3 text-2xl font-semibold text-stone-900"
                />

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

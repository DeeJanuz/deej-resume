"use client";

import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { EditableText } from "@/components/dev/EditableText";
import type { EditableContentPath } from "@/components/dev/ContentDevContext";
import type {
  PortfolioCard,
  PortfolioDetailSection,
  PortfolioLink,
  PortfolioSectionId,
  ResumeContent,
  ResumeContentSection,
  SiteProfile,
} from "@/types";
import { PortfolioImageBlock } from "./PortfolioImageBlock";
import { SectionHighlights } from "./SectionHighlights";

type OpenProjectWindow = (targetId: PortfolioSectionId) => void;

interface ResumeSummaryProps {
  profile: SiteProfile;
  resume: ResumeContent;
}

interface ResumeSectionBodyProps {
  section: ResumeContentSection;
  sectionIndex: number;
  onOpenProjectBrowser?: OpenProjectWindow;
}

interface EntryActionsProps {
  links?: readonly PortfolioLink[];
  pathPrefix: EditableContentPath;
  preview?: {
    title: string;
    windowId: PortfolioSectionId;
    onOpen: OpenProjectWindow;
  };
}

interface EntryListProps {
  items: readonly string[];
  pathPrefix: EditableContentPath;
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

export function formatSectionNumber(sectionIndex: number) {
  return String(sectionIndex + 1).padStart(2, "0");
}

// Section colors flow through --accent so rules, markers, and links share one value.
function accentStyle(accent: string) {
  return { "--accent": accent } as CSSProperties;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function EntryBullets({ items, pathPrefix }: EntryListProps) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-6 text-stone-700">
      {items.map((bullet, bulletIndex) => (
        <EditableText
          key={`${bullet}-${bulletIndex}`}
          as="li"
          path={[...pathPrefix, bulletIndex]}
          text={bullet}
        />
      ))}
    </ul>
  );
}

function EntryTags({ items, pathPrefix }: EntryListProps) {
  return (
    <p className="resume-tags mt-3 leading-5 text-stone-500">
      {items.map((tag, tagIndex) => (
        <span key={`${tag}-${tagIndex}`}>
          {tagIndex > 0 ? <span aria-hidden="true"> · </span> : null}
          <EditableText as="span" path={[...pathPrefix, tagIndex]} text={tag} />
        </span>
      ))}
    </p>
  );
}

function EntryActions({ links, pathPrefix, preview }: EntryActionsProps) {
  if (!links?.length && !preview) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
      {preview ? (
        <button
          type="button"
          onClick={() => preview.onOpen(preview.windowId)}
          aria-label={`Open ${preview.title} preview window`}
          className="resume-preview-button"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="3" width="12" height="10" rx="1.5" />
            <path d="M2 6h12" />
          </svg>
          Preview
        </button>
      ) : null}
      {links?.map((link, index) => {
        const isExternal = isExternalHref(link.href);

        return (
          <a
            key={`${link.href}-${index}`}
            href={link.href}
            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
            className="resume-link"
          >
            <EditableText
              as="span"
              path={[...pathPrefix, index, "label"]}
              text={link.label}
            />
            {isExternal ? <span aria-hidden="true"> ↗</span> : null}
          </a>
        );
      })}
    </div>
  );
}

interface CardGroup {
  name?: string;
  entries: { card: PortfolioCard; cardIndex: number }[];
}

// Keep the original card index so inline-edit paths still point at the right card.
function groupCards(cards: readonly PortfolioCard[]) {
  const groups: CardGroup[] = [];

  cards.forEach((card, cardIndex) => {
    const group = groups.find((candidate) => candidate.name === card.group);

    if (group) {
      group.entries.push({ card, cardIndex });
    } else {
      groups.push({ name: card.group, entries: [{ card, cardIndex }] });
    }
  });

  return groups;
}

function ResumeEntry({
  card,
  pathPrefix,
  onOpenProjectBrowser,
}: {
  card: PortfolioCard;
  pathPrefix: EditableContentPath;
  onOpenProjectBrowser?: OpenProjectWindow;
}) {
  const preview =
    card.windowId && onOpenProjectBrowser
      ? {
          title: card.title,
          windowId: card.windowId,
          onOpen: onOpenProjectBrowser,
        }
      : undefined;

  return (
    <article className="resume-entry">
      <EditableText
        as="h3"
        path={[...pathPrefix, "title"]}
        text={card.title}
        className="font-display text-[1.3rem] font-semibold leading-tight text-stone-950"
      />
      {card.eyebrow ? (
        <EditableText
          as="p"
          path={[...pathPrefix, "eyebrow"]}
          text={card.eyebrow}
          className="mt-1 font-display text-[14px] italic text-stone-500"
        />
      ) : null}
      <EditableText
        as="p"
        path={[...pathPrefix, "description"]}
        text={card.description}
        className="mt-3 text-[14px] leading-[1.65] text-stone-700"
      />
      {card.bullets?.length ? (
        <EntryBullets items={card.bullets} pathPrefix={[...pathPrefix, "bullets"]} />
      ) : null}
      {card.tags?.length ? (
        <EntryTags items={card.tags} pathPrefix={[...pathPrefix, "tags"]} />
      ) : null}
      <EntryActions
        links={card.links}
        pathPrefix={[...pathPrefix, "links"]}
        preview={preview}
      />
    </article>
  );
}

function ResumeNote({
  detail,
  pathPrefix,
}: {
  detail: PortfolioDetailSection;
  pathPrefix: EditableContentPath;
}) {
  return (
    <aside className="resume-note">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <EditableText
          as="h3"
          path={[...pathPrefix, "title"]}
          text={detail.title}
          className="font-display text-[1.2rem] font-semibold italic leading-tight text-stone-950"
        />
        {detail.eyebrow ? (
          <EditableText
            as="p"
            path={[...pathPrefix, "eyebrow"]}
            text={detail.eyebrow}
            className="text-[13px] font-medium text-[var(--accent)]"
          />
        ) : null}
      </div>
      {detail.image ? (
        <div className="mt-4 max-w-xl">
          <PortfolioImageBlock
            image={detail.image}
            captionPath={[...pathPrefix, "image", "caption"]}
            sizes="(max-width: 768px) 100vw, 576px"
          />
        </div>
      ) : null}
      {detail.paragraphs?.map((paragraph, paragraphIndex) => (
        <EditableText
          key={`${paragraph}-${paragraphIndex}`}
          as="p"
          path={[...pathPrefix, "paragraphs", paragraphIndex]}
          text={paragraph}
          className="mt-3 text-[14px] leading-[1.65] text-stone-700"
        />
      ))}
      {detail.bullets?.length ? (
        <EntryBullets items={detail.bullets} pathPrefix={[...pathPrefix, "bullets"]} />
      ) : null}
      <EntryActions links={detail.links} pathPrefix={[...pathPrefix, "links"]} />
    </aside>
  );
}

export function ResumeSummary({ profile, resume }: ResumeSummaryProps) {
  const summary = resume.executiveSummary;
  const portrait = summary.heroImage;

  return (
    <header style={accentStyle(resume.accent)}>
      <div className="resume-masthead">
        <div className="min-w-0">
          <p className="flex flex-wrap gap-x-2 text-[13px] text-stone-500">
            <EditableText
              as="span"
              path={["siteProfile", "location"]}
              text={profile.location}
            />
            {summary.primaryLinks?.map((link, index) => (
              <Fragment key={`${link.href}-${index}`}>
                <span aria-hidden="true">·</span>
                <a href={link.href} className="resume-link">
                  <EditableText
                    as="span"
                    path={["resume", "executiveSummary", "primaryLinks", index, "label"]}
                    text={link.label}
                  />
                </a>
              </Fragment>
            ))}
          </p>
          <EditableText
            as="h1"
            path={["siteProfile", "name"]}
            text={profile.name}
            className="resume-name mt-4 font-display font-semibold text-stone-950"
          />
          <EditableText
            as="p"
            path={["resume", "executiveSummary", "title"]}
            text={summary.title}
            className="mt-3 font-display text-[1.35rem] italic leading-snug text-[var(--accent)]"
          />
        </div>

        {portrait ? (
          <figure className="resume-portrait relative shrink-0 overflow-hidden rounded-sm bg-stone-200 ring-1 ring-stone-900/10">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              loading="eager"
              sizes="(max-width: 640px) 128px, 184px"
              className="object-cover"
              style={{ objectPosition: portrait.objectPosition ?? "center" }}
            />
          </figure>
        ) : null}
      </div>

      <EditableText
        as="p"
        path={["resume", "executiveSummary", "intro"]}
        text={summary.intro}
        className="resume-lead mt-8 border-t border-stone-300 pt-6 text-stone-800"
      />

      {summary.metrics.length ? (
        <SectionHighlights
          className="mt-8"
          items={summary.metrics}
          pathPrefix={["resume", "executiveSummary", "metrics"]}
        />
      ) : null}
    </header>
  );
}

export function ResumeSectionBody({
  section,
  sectionIndex,
  onOpenProjectBrowser,
}: ResumeSectionBodyProps) {
  const sectionPath: EditableContentPath = ["resume", "sections", sectionIndex];
  const cardGroups = groupCards(section.cards);
  const firstNamedGroup = cardGroups.find((group) => group.name);

  return (
    <section className="resume-section" style={accentStyle(section.accent)}>
      <div className="resume-section-head">
        <span aria-hidden="true" className="resume-section-number">
          {formatSectionNumber(sectionIndex)}
        </span>
        <EditableText
          as="h2"
          path={[...sectionPath, "title"]}
          text={section.title}
          className="font-display text-[1.75rem] font-semibold leading-tight text-stone-950"
        />
      </div>

      {section.intro ? (
        <EditableText
          as="p"
          path={[...sectionPath, "intro"]}
          text={section.intro}
          className="resume-lead resume-lead--section mt-5 text-stone-800"
        />
      ) : null}
      {section.summary ? (
        <EditableText
          as="p"
          path={[...sectionPath, "summary"]}
          text={section.summary}
          className="mt-3 text-[14px] leading-[1.65] text-stone-600"
        />
      ) : null}

      {section.heroImage ? (
        <div className="mt-6 max-w-md">
          <PortfolioImageBlock
            image={section.heroImage}
            captionPath={[...sectionPath, "heroImage", "caption"]}
            sizes="(max-width: 768px) 100vw, 448px"
          />
        </div>
      ) : null}

      {section.metrics.length ? (
        <SectionHighlights
          className="mt-7"
          items={section.metrics}
          pathPrefix={[...sectionPath, "metrics"]}
        />
      ) : null}

      {cardGroups.length ? (
        <div className="mt-8">
          {cardGroups.map((group) => {
            const entries = (
              <div className="resume-entries">
                {group.entries.map(({ card, cardIndex }) => (
                  <ResumeEntry
                    key={`${card.title}-${cardIndex}`}
                    card={card}
                    pathPrefix={[...sectionPath, "cards", cardIndex]}
                    onOpenProjectBrowser={onOpenProjectBrowser}
                  />
                ))}
              </div>
            );

            if (!group.name) {
              return <Fragment key="ungrouped">{entries}</Fragment>;
            }

            return (
              <details
                key={group.name}
                className="resume-group"
                open={group === firstNamedGroup}
              >
                <summary className="resume-group-summary">
                  <svg
                    aria-hidden="true"
                    className="resume-group-chevron"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M4.5 2.5 8 6l-3.5 3.5" />
                  </svg>
                  <span className="font-display text-[1.15rem] font-semibold text-stone-950">
                    {group.name}
                  </span>
                  <span className="resume-group-names text-[13px] text-stone-500">
                    {group.entries.map(({ card }) => card.title).join(", ")}
                  </span>
                </summary>
                {entries}
              </details>
            );
          })}
        </div>
      ) : null}

      {section.detailSections?.length ? (
        <div className="mt-8 space-y-5">
          {section.detailSections.map((detail, detailIndex) => (
            <ResumeNote
              key={`${detail.title}-${detailIndex}`}
              detail={detail}
              pathPrefix={[...sectionPath, "detailSections", detailIndex]}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

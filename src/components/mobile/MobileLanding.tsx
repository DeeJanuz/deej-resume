"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { PortfolioImageBlock } from "@/components/content/PortfolioImageBlock";
import { EditableText } from "@/components/dev/EditableText";
import {
  usePortfolioContent,
  type EditableContentPath,
} from "@/components/dev/ContentDevContext";
import type { PortfolioSectionId } from "@/types";

const MOBILE_DESKTOP_BANNER_DISMISSED_KEY =
  "resume-site-mobile-desktop-banner-dismissed";
const MOBILE_DESKTOP_BANNER_EVENT =
  "resume-site-mobile-desktop-banner-change";

function subscribeToDesktopBannerDismissal(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === MOBILE_DESKTOP_BANNER_DISMISSED_KEY) {
      onStoreChange();
    }
  }

  function handleBannerChange() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(MOBILE_DESKTOP_BANNER_EVENT, handleBannerChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(MOBILE_DESKTOP_BANNER_EVENT, handleBannerChange);
  };
}

function getDesktopBannerDismissalSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return (
      window.localStorage.getItem(MOBILE_DESKTOP_BANNER_DISMISSED_KEY) ===
      "true"
    );
  } catch {
    return false;
  }
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
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((link, index) =>
        isLocal && isEditMode ? (
          <span
            key={`${link.href}-${index}`}
            className="rounded-full bg-[rgba(245,238,228,0.9)] px-3 py-1 text-xs font-medium text-stone-600"
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
            className="rounded-full bg-[rgba(245,238,228,0.9)] px-3 py-1 text-xs font-medium text-stone-600 transition hover:-translate-y-0.5"
            style={{ boxShadow: `inset 0 0 0 1px ${accent}20` }}
          >
            {link.label}
          </a>
        ),
      )}
    </div>
  );
}

export default function MobileLanding() {
  const { content, sectionIndexById } = usePortfolioContent();
  const { portfolioSections, siteProfile } = content;
  const [activeSectionId, setActiveSectionId] =
    useState<PortfolioSectionId>("about");
  const isDesktopBannerDismissed = useSyncExternalStore(
    subscribeToDesktopBannerDismissal,
    getDesktopBannerDismissalSnapshot,
    () => false,
  );
  const activeSection = useMemo(
    () =>
      portfolioSections.find((section) => section.id === activeSectionId) ??
      portfolioSections[0],
    [activeSectionId, portfolioSections],
  );
  const activeSectionIndex = sectionIndexById[activeSection.id];

  function dismissDesktopBanner() {
    try {
      window.localStorage.setItem(
        MOBILE_DESKTOP_BANNER_DISMISSED_KEY,
        "true",
      );
      window.dispatchEvent(new Event(MOBILE_DESKTOP_BANNER_EVENT));
    } catch {
      // Ignore storage failures and leave the banner visible.
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-stone-900">
      {!isDesktopBannerDismissed ? (
        <div className="px-4 pt-4">
          <div className="mx-auto flex max-w-2xl items-start justify-between gap-4 rounded-[24px] border border-black/8 bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_14px_28px_rgba(34,22,12,0.08)] backdrop-blur-xl">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Mobile View
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                This content is fully accessible on mobile, but the experience is
                optimized for desktop viewing.
              </p>
            </div>

            <button
              type="button"
              onClick={dismissDesktopBanner}
              aria-label="Dismiss mobile viewing notice"
              className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-black/5"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden px-4 pb-8 pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(247,241,232,0)_100%)]" />
        <div className="relative mx-auto max-w-2xl">
          <EditableText
            as="p"
            path={["siteProfile", "location"]}
            text={siteProfile.location}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500"
          />
          <EditableText
            as="h1"
            path={["siteProfile", "name"]}
            text={siteProfile.name}
            className="mt-4 font-sans text-[clamp(3rem,12vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-stone-900"
          />
          <EditableText
            as="p"
            path={["siteProfile", "title"]}
            text={siteProfile.title}
            className="mt-4 text-base leading-7 text-stone-700"
          />
          <EditableText
            as="p"
            path={["siteProfile", "summary"]}
            text={siteProfile.summary}
            className="mt-4 max-w-xl text-sm leading-7 text-stone-600"
          />
        </div>
      </section>

      <div className="sticky top-0 z-20 border-y border-black/6 bg-[rgba(247,241,232,0.88)] px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {portfolioSections.map((section, sectionIndex) => (
            <button
              key={section.id}
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition"
              style={{
                backgroundColor:
                  section.id === activeSectionId
                    ? section.accent
                    : "rgba(255,255,255,0.72)",
                color:
                  section.id === activeSectionId ? "#ffffff" : "#57534e",
              }}
              onClick={() => setActiveSectionId(section.id)}
            >
              <EditableText
                as="span"
                path={[
                  "portfolioSections",
                  sectionIndex,
                  "windowTitle",
                ]}
                text={section.windowTitle}
              />
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <section
          className="rounded-[30px] border border-white/65 p-6 shadow-[0_22px_40px_rgba(38,22,12,0.08)]"
          style={{ background: activeSection.heroGradient }}
        >
          {activeSection.heroImage ? (
            <div className="mb-5">
              <div className="relative h-28 w-28 overflow-hidden rounded-[24px] border border-white/65 bg-white/60 shadow-[0_16px_30px_rgba(34,22,12,0.12)]">
                <Image
                  src={activeSection.heroImage.src}
                  alt={activeSection.heroImage.alt}
                  fill
                  sizes="112px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          ) : null}

          <EditableText
            as="p"
            path={["portfolioSections", activeSectionIndex, "eyebrow"]}
            text={activeSection.eyebrow}
            className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-600"
          />
          <EditableText
            as="h2"
            path={["portfolioSections", activeSectionIndex, "title"]}
            text={activeSection.title}
            className="mt-3 font-display text-4xl leading-[0.95] text-stone-900"
          />
          <EditableText
            as="p"
            path={["portfolioSections", activeSectionIndex, "intro"]}
            text={activeSection.intro}
            className="mt-4 text-sm leading-7 text-stone-700"
          />
        </section>

        <section className="mt-5 space-y-4">
          {activeSection.cards.map((card, cardIndex) => (
            <article
              key={`${card.title}-${cardIndex}`}
              className="rounded-[26px] border border-black/5 bg-white/82 p-5 shadow-[0_18px_36px_rgba(34,22,12,0.05)]"
            >
              {card.eyebrow ? (
                <EditableText
                  as="p"
                  path={[
                    "portfolioSections",
                    activeSectionIndex,
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
                  activeSectionIndex,
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
                  activeSectionIndex,
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
                        style={{ backgroundColor: activeSection.accent }}
                      />
                      <EditableText
                        as="span"
                        path={[
                          "portfolioSections",
                          activeSectionIndex,
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
                  accent={activeSection.accent}
                  links={card.links}
                  pathPrefix={[
                    "portfolioSections",
                    activeSectionIndex,
                    "cards",
                    cardIndex,
                    "links",
                  ]}
                />
              ) : null}

              {card.tags ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={`${tag}-${tagIndex}`}
                      className="rounded-full bg-[rgba(245,238,228,0.9)] px-3 py-1 text-xs font-medium text-stone-600"
                    >
                      <EditableText
                        as="span"
                        path={[
                          "portfolioSections",
                          activeSectionIndex,
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

        {activeSection.detailSections?.length ? (
          <section className="mt-5 space-y-4">
            {activeSection.detailSections.map((detail, detailIndex) => (
              <article
                key={`${detail.title}-${detailIndex}`}
                className="rounded-[26px] border border-black/5 bg-white/82 p-5 shadow-[0_18px_36px_rgba(34,22,12,0.05)]"
              >
                {detail.eyebrow ? (
                  <EditableText
                    as="p"
                    path={[
                      "portfolioSections",
                      activeSectionIndex,
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
                    activeSectionIndex,
                    "detailSections",
                    detailIndex,
                    "title",
                  ]}
                  text={detail.title}
                  className="mt-3 text-xl font-semibold text-stone-900"
                />

                {detail.image ? (
                  <div className="mt-4">
                    <PortfolioImageBlock
                      image={detail.image}
                      captionPath={[
                        "portfolioSections",
                        activeSectionIndex,
                        "detailSections",
                        detailIndex,
                        "image",
                        "caption",
                      ]}
                      sizes="100vw"
                    />
                  </div>
                ) : null}

                {detail.paragraphs?.map((paragraph, paragraphIndex) => (
                  <EditableText
                    key={`${paragraph}-${paragraphIndex}`}
                    as="p"
                    path={[
                      "portfolioSections",
                      activeSectionIndex,
                      "detailSections",
                      detailIndex,
                      "paragraphs",
                      paragraphIndex,
                    ]}
                    text={paragraph}
                    className="mt-3 text-sm leading-7 text-stone-600"
                  />
                ))}

                {detail.bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
                    {detail.bullets.map((bullet, bulletIndex) => (
                      <li key={`${bullet}-${bulletIndex}`} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: activeSection.accent }}
                        />
                        <EditableText
                          as="span"
                          path={[
                            "portfolioSections",
                            activeSectionIndex,
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
                    accent={activeSection.accent}
                    links={detail.links}
                    pathPrefix={[
                      "portfolioSections",
                      activeSectionIndex,
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
      </main>
    </div>
  );
}

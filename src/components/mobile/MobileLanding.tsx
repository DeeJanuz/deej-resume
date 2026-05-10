"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EditableText } from "@/components/dev/EditableText";
import { usePortfolioContent } from "@/components/dev/ContentDevContext";
import type { ResumeSectionId } from "@/types";
import {
  ResumeExecutiveSummaryHero,
  ResumeSectionBody,
  scrollWithinContainer,
} from "@/components/content/ResumeContentParts";

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

export default function MobileLanding() {
  const { content, resume } = usePortfolioContent();
  const sectionRefs = useRef<Record<ResumeSectionId, HTMLElement | null>>({
    summary: null,
    experience: null,
    projects: null,
    skills: null,
    about: null,
    contact: null,
  });
  const [activeSectionId, setActiveSectionId] =
    useState<ResumeSectionId>("summary");
  const isDesktopBannerDismissed = useSyncExternalStore(
    subscribeToDesktopBannerDismissal,
    getDesktopBannerDismissalSnapshot,
    () => false,
  );

  const registerSection =
    (sectionId: ResumeSectionId) => (element: HTMLElement | null) => {
      sectionRefs.current[sectionId] = element;
    };

  useEffect(() => {
    const updateActiveSection = () => {
      const threshold = 140;
      let nextSectionId: ResumeSectionId = "summary";

      for (const item of resume.navigation) {
        const element = sectionRefs.current[item.id];
        if (element && element.getBoundingClientRect().top <= threshold) {
          nextSectionId = item.id;
        }
      }

      setActiveSectionId((current) =>
        current === nextSectionId ? current : nextSectionId,
      );
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [resume.navigation]);

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
                This content is fully accessible on mobile, but the desktop
                version still carries the full windowed experience.
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
            text={content.siteProfile.location}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500"
          />
          <EditableText
            as="h1"
            path={["siteProfile", "name"]}
            text={content.siteProfile.name}
            className="mt-4 font-sans text-[clamp(3rem,12vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-stone-900"
          />
        </div>
      </section>

      <div className="sticky top-0 z-20 border-y border-black/6 bg-[rgba(247,241,232,0.88)] px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {resume.navigation.map((item, index) => {
            const isActive = item.id === activeSectionId;

            return (
              <button
                key={item.id}
                type="button"
                className="rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition"
                style={{
                  backgroundColor: isActive
                    ? resume.accent
                    : "rgba(255,255,255,0.72)",
                  color: isActive ? "#ffffff" : "#57534e",
                }}
                onClick={() =>
                  scrollWithinContainer(sectionRefs.current[item.id], document.body)
                }
              >
                <EditableText
                  as="span"
                  path={["resume", "navigation", index, "label"]}
                  text={item.label}
                />
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <div ref={registerSection("summary")}>
          <ResumeExecutiveSummaryHero resume={resume} />
        </div>

        {resume.sections.map((section, index) => (
          <div key={section.id} ref={registerSection(section.id)}>
            <ResumeSectionBody section={section} sectionIndex={index} />
          </div>
        ))}
      </main>
    </div>
  );
}

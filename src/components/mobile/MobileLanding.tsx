"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { EditableText } from "@/components/dev/EditableText";
import { usePortfolioContent } from "@/components/dev/ContentDevContext";
import type { ResumeSectionId } from "@/types";
import {
  ResumeSectionBody,
  ResumeSummary,
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
    "open-source": null,
    consulting: null,
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
    <div className="resume-container resume-paper min-h-screen text-stone-900">
      {!isDesktopBannerDismissed ? (
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 bg-stone-50 px-5 py-3">
          <p className="text-[13px] leading-5 text-stone-600">
            This content is fully accessible on mobile, but the desktop version
            still carries the full windowed experience.
          </p>
          <button
            type="button"
            onClick={dismissDesktopBanner}
            aria-label="Dismiss mobile viewing notice"
            className="shrink-0 text-[13px] font-medium text-stone-500 underline underline-offset-[3px] transition hover:text-stone-900"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div
        ref={registerSection("summary")}
        className="mx-auto max-w-2xl px-5 pb-8 pt-8"
      >
        <ResumeSummary profile={content.siteProfile} resume={resume} />
      </div>

      <nav
        aria-label="Resume sections"
        className="sticky top-0 z-20 border-y border-stone-200 bg-[#fbfaf7]/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-2xl gap-5 overflow-x-auto px-5">
          {resume.navigation.map((item, index) => {
            const isActive = item.id === activeSectionId;
            const accent =
              resume.sections.find((section) => section.id === item.id)?.accent ??
              resume.accent;

            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                style={{ "--accent": accent } as CSSProperties}
                className={`shrink-0 whitespace-nowrap border-b-2 py-3 text-[13px] transition ${
                  isActive
                    ? "border-[var(--accent)] font-semibold text-stone-950"
                    : "border-transparent text-stone-500"
                }`}
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
      </nav>

      <main className="mx-auto max-w-2xl px-5 pb-16">
        {resume.sections.map((section, index) => (
          <div
            key={section.id}
            ref={registerSection(section.id)}
            className="scroll-mt-14"
          >
            <ResumeSectionBody section={section} sectionIndex={index} />
          </div>
        ))}
      </main>
    </div>
  );
}

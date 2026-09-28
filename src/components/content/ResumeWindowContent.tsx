"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePortfolioContent } from "@/components/dev/ContentDevContext";
import { EditableText } from "@/components/dev/EditableText";
import type {
  PortfolioSectionId,
  ResumeContent,
  ResumeSectionId,
} from "@/types";
import {
  ResumeSectionBody,
  ResumeSummary,
  formatSectionNumber,
  scrollWithinContainer,
} from "./ResumeContentParts";

interface ResumeWindowContentProps {
  resume: ResumeContent;
  onOpenProjectBrowser?: (targetId: PortfolioSectionId) => void;
}

export function ResumeWindowContent({
  resume,
  onOpenProjectBrowser,
}: ResumeWindowContentProps) {
  const { content } = usePortfolioContent();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const registerSection =
    (sectionId: ResumeSectionId) => (element: HTMLElement | null) => {
      sectionRefs.current[sectionId] = element;
    };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const updateActiveSection = () => {
      const threshold = scrollContainer.scrollTop + 132;
      let nextSectionId: ResumeSectionId = "summary";

      for (const item of resume.navigation) {
        const element = sectionRefs.current[item.id];
        if (element && element.offsetTop <= threshold) {
          nextSectionId = item.id;
        }
      }

      setActiveSectionId((current) =>
        current === nextSectionId ? current : nextSectionId,
      );
    };

    updateActiveSection();
    scrollContainer.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      scrollContainer.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [resume.navigation]);

  return (
    <div className="resume-container h-full min-h-0">
      <div className="resume-window-layout h-full min-h-0">
        <nav
          aria-label="Resume sections"
          className="resume-window-sidebar min-h-0 overflow-y-auto border-r border-stone-200 bg-[#f4f2ed] px-3 py-6"
        >
          <ul className="space-y-0.5">
            {resume.navigation.map((item, index) => {
              const isActive = item.id === activeSectionId;
              const sectionIndex = resume.sections.findIndex(
                (section) => section.id === item.id,
              );
              const accent =
                sectionIndex >= 0
                  ? resume.sections[sectionIndex].accent
                  : resume.accent;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() =>
                      scrollWithinContainer(
                        sectionRefs.current[item.id],
                        scrollContainerRef.current,
                      )
                    }
                    style={{ "--accent": accent } as CSSProperties}
                    className={`flex w-full items-baseline gap-2.5 border-l-2 py-1.5 pl-3 text-left text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                      isActive
                        ? "border-[var(--accent)] font-semibold text-stone-950"
                        : "border-transparent text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 font-display text-[12px] italic tabular-nums text-[var(--accent)]"
                    >
                      {sectionIndex >= 0 ? formatSectionNumber(sectionIndex) : ""}
                    </span>
                    <EditableText
                      as="span"
                      path={["resume", "navigation", index, "label"]}
                      text={item.label}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          ref={scrollContainerRef}
          className="resume-paper relative min-h-0 overflow-y-auto"
        >
          <div className="resume-document">
            <div ref={registerSection("summary")} className="scroll-mt-6">
              <ResumeSummary profile={content.siteProfile} resume={resume} />
            </div>

            {resume.sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                ref={registerSection(section.id)}
                className="scroll-mt-6"
              >
                <ResumeSectionBody
                  section={section}
                  sectionIndex={sectionIndex}
                  onOpenProjectBrowser={onOpenProjectBrowser}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

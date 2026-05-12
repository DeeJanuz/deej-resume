"use client";

import { useEffect, useRef, useState } from "react";
import { EditableText } from "@/components/dev/EditableText";
import type { ResumeContent, ResumeSectionId } from "@/types";
import {
  ResumeExecutiveSummaryHero,
  ResumeSectionBody,
  scrollWithinContainer,
} from "./ResumeContentParts";

interface ResumeWindowContentProps {
  resume: ResumeContent;
}

export function ResumeWindowContent({ resume }: ResumeWindowContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
    <div className="grid h-full min-h-0 md:grid-cols-[240px_1fr]">
      <aside className="hidden min-h-0 border-r border-stone-200 bg-stone-50 md:flex md:flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <EditableText
            as="p"
            path={["siteProfile", "name"]}
            text="Daenon Janis"
            className="text-[11px] font-semibold uppercase tracking-normal text-stone-500"
          />

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-normal text-stone-500">
              Navigate
            </p>
            <ul className="mt-4 space-y-2">
              {resume.navigation.map((item, index) => {
                const isActive = item.id === activeSectionId;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        scrollWithinContainer(
                          sectionRefs.current[item.id],
                          scrollContainerRef.current,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(47, 107, 115, 0.12)"
                          : "#ffffff",
                        borderColor: isActive
                          ? "rgba(47, 107, 115, 0.26)"
                          : "rgba(214,211,209,1)",
                        color: isActive ? "#1f4347" : "#57534e",
                      }}
                    >
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
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 flex-col bg-stone-50">
        <div ref={scrollContainerRef} className="min-h-0 overflow-y-auto">
          <div className="space-y-5 p-4 sm:p-6">
            <div ref={registerSection("summary")} className="scroll-mt-4">
              <ResumeExecutiveSummaryHero
                resume={resume}
                rootRef={scrollContainerRef}
              />
            </div>

            {resume.sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                ref={registerSection(section.id)}
                className="scroll-mt-4"
              >
                <ResumeSectionBody
                  section={section}
                  sectionIndex={sectionIndex}
                  rootRef={scrollContainerRef}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

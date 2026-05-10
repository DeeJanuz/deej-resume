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
      <aside className="hidden min-h-0 border-r border-black/6 bg-[rgba(246,246,246,0.95)] md:flex md:flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <EditableText
            as="p"
            path={["siteProfile", "name"]}
            text="Daenon Janis"
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-stone-500"
          />

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
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
                      className="w-full rounded-2xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(47, 107, 115, 0.12)"
                          : "rgba(255,255,255,0.74)",
                        borderColor: isActive
                          ? "rgba(47, 107, 115, 0.26)"
                          : "rgba(0,0,0,0.06)",
                        color: isActive ? "#1f4347" : "#57534e",
                        boxShadow: isActive
                          ? "0 10px 20px rgba(47, 107, 115, 0.10)"
                          : "0 8px 18px rgba(0,0,0,0.04)",
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

      <div className="flex min-h-0 flex-col bg-[rgba(255,255,255,0.95)]">
        <div ref={scrollContainerRef} className="min-h-0 overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-6">
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

"use client";

import { ContentDevProvider } from "@/components/dev/ContentDevContext";
import { ContentDevTool } from "@/components/dev/ContentDevTool";
import { Desktop } from "@/components/desktop/Desktop";
import MobileLanding from "@/components/mobile/MobileLanding";

export default function Home() {
  return (
    <ContentDevProvider>
      <div className="hidden h-screen overflow-hidden md:block">
        <Desktop />
      </div>
      <div className="md:hidden">
        <MobileLanding />
      </div>
      <ContentDevTool />
    </ContentDevProvider>
  );
}

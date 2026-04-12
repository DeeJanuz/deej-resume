"use client";

import type { ReactNode } from "react";
import { ContentDevProvider } from "@/components/dev/ContentDevContext";
import { ContentDevTool } from "@/components/dev/ContentDevTool";

export function PortfolioAppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ContentDevProvider>
      {children}
      <ContentDevTool />
    </ContentDevProvider>
  );
}

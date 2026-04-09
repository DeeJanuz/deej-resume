"use client";

import { Desktop } from "@/components/desktop/Desktop";
import MobileLanding from "@/components/mobile/MobileLanding";

export default function Home() {
  return (
    <>
      <div className="hidden h-screen overflow-hidden md:block">
        <Desktop />
      </div>
      <div className="md:hidden">
        <MobileLanding />
      </div>
    </>
  );
}

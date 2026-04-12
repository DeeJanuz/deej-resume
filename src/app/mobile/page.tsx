import type { Metadata } from "next";
import { PortfolioAppProviders } from "@/components/app/PortfolioAppProviders";
import MobileLanding from "@/components/mobile/MobileLanding";

export const metadata: Metadata = {
  title: "Daenon Janis | Mobile View",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MobilePage() {
  return (
    <PortfolioAppProviders>
      <MobileLanding />
    </PortfolioAppProviders>
  );
}

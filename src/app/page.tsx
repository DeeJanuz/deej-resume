import { PortfolioAppProviders } from "@/components/app/PortfolioAppProviders";
import { Desktop } from "@/components/desktop/Desktop";
import MobileLanding from "@/components/mobile/MobileLanding";

export default function Home() {
  return (
    <PortfolioAppProviders>
      <div className="hidden h-screen overflow-hidden md:block">
        <Desktop />
      </div>
      <div className="md:hidden">
        <MobileLanding />
      </div>
    </PortfolioAppProviders>
  );
}

import HeroSection from "@/components/marketing/HeroSection";
import WhyExists from "@/components/marketing/WhyExists";
import WhatIsTradelia from "@/components/marketing/WhatIsTradelia";
import FinalCTANew from "@/components/marketing/FinalCTANew";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main role="main">
        <HeroSection />
        <WhyExists />
        <WhatIsTradelia />
        <FinalCTANew />
      </main>
    </div>
  );
}
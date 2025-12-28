import HeroSection from "@/components/marketing/HeroSection";
import WhyExists from "@/components/marketing/WhyExists";
import Symptoms from "@/components/marketing/Symptoms";
import HowItWorksNew from "@/components/marketing/HowItWorksNew";
import ExampleReal from "@/components/marketing/ExampleReal";
import WhatYouGet from "@/components/marketing/WhatYouGet";
import ForWho from "@/components/marketing/ForWho";
import FinalCTANew from "@/components/marketing/FinalCTANew";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="relative">
        <HeroSection />
        <WhyExists />
        <Symptoms />
        <HowItWorksNew />
        <ExampleReal />
        <WhatYouGet />
        <ForWho />
        <FinalCTANew />
      </main>
    </div>
  );
}
import HeroSection from "@/components/marketing/HeroSection";
import WhyExists from "@/components/marketing/WhyExists";
import AIProblem from "@/components/marketing/AIProblem";
import Symptoms from "@/components/marketing/Symptoms";
import HowItWorksNew from "@/components/marketing/HowItWorksNew";
import ExampleReal from "@/components/marketing/ExampleReal";
import WhatYouGet from "@/components/marketing/WhatYouGet";
import ForWho from "@/components/marketing/ForWho";
import FinalCTANew from "@/components/marketing/FinalCTANew";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main role="main">
        <HeroSection />
        <WhyExists />
        <AIProblem />
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
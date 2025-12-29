import HeroSection from "@/components/marketing/HeroSection";
import WhyExists from "@/components/marketing/WhyExists";
import dynamic from 'next/dynamic';

// Lazy load non-critical sections for better performance
const WhatIsTradelia = dynamic(() => import("@/components/marketing/WhatIsTradelia"), {
  loading: () => <div className="section-spacing animate-pulse bg-muted/20 rounded-lg mx-4" />,
  ssr: true
});

const FinalCTANew = dynamic(() => import("@/components/marketing/FinalCTANew"), {
  loading: () => <div className="section-spacing animate-pulse bg-muted/20 rounded-lg mx-4" />,
  ssr: true
});

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
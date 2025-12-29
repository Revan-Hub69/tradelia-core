import HeroSection from "@/components/marketing/HeroSection";
import WhyExists from "@/components/marketing/WhyExists";
import WhatIsTradelia from "@/components/marketing/WhatIsTradelia";
import { FearGreedCompact } from "@/components/indicators/fear-greed-compact";
import ForWho from "@/components/marketing/ForWho";
import FinalCTANew from "@/components/marketing/FinalCTANew";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main role="main">
        <HeroSection />
        <WhyExists />
        <WhatIsTradelia />
        
        {/* Esempio Reale - Indice Paura & Avidità */}
        <section className="py-12 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Esempio Reale: Come Funziona</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ecco come Tradelia trasforma un semplice numero in educazione antifuffa. 
                Niente promesse, solo comprensione.
              </p>
            </div>
            
            <FearGreedCompact value={24} classification="extreme_fear" />
          </div>
        </section>
        
        <ForWho />
        <FinalCTANew />
      </main>
    </div>
  );
}
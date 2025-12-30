import HeroSection from "@/components/marketing/HeroSection";
import DashboardPreview from "@/components/marketing/DashboardPreview";
import IntentionDriven from "@/components/marketing/IntentionDriven";
import DynamicDashboard from "@/components/marketing/DynamicDashboard";
import ContextualMicroLearning from "@/components/marketing/ContextualMicroLearning";
import ErrorReduction from "@/components/marketing/ErrorReduction";
import WhatTradeliaDoesNew from "@/components/marketing/WhatTradeliaDoesNew";
import Methodology from "@/components/marketing/Methodology";
import FinalCTANew from "@/components/marketing/FinalCTANew";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main role="main">
        {/* Hero Section - Dashboard Dinamica */}
        <HeroSection />
        
        {/* Cosa trovi nella dashboard */}
        <DashboardPreview />
        
        {/* Principio Intention-Driven */}
        <IntentionDriven />
        
        {/* Dashboard Dinamica */}
        <DynamicDashboard />
        
        {/* Micro-learning Contestuale */}
        <ContextualMicroLearning />
        
        {/* Riduzione Errori */}
        <ErrorReduction />
        
        {/* Cosa fa e cosa non fa */}
        <WhatTradeliaDoesNew />
        
        {/* Metodo e Trasparenza */}
        <Methodology />
        
        {/* CTA Finale */}
        <FinalCTANew />
      </main>
    </div>
  );
}
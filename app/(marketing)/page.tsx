import HeroProblem from "@/components/marketing/HeroProblem";
import WhyWeFail from "@/components/marketing/WhyWeFail";
import AssetClasses from "@/components/marketing/AssetClasses";
import AcademicRigour from "@/components/marketing/AcademicRigour";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="relative">
        <HeroProblem />
        <WhyWeFail />
        <AssetClasses />
        <AcademicRigour />
        <FinalCTA />
      </main>
    </div>
  );
}
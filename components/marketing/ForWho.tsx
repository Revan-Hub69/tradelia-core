import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"

export default function ForWho() {
  return (
    <SectionLayout background="white">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Per chi è"
        />
        <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
          <p>
            <strong className="text-foreground">Per chi è esposto all'hype crypto</strong><br />
            <strong className="text-foreground">Per chi è confuso ma curioso</strong><br />
            <strong className="text-foreground">Per chi vuole capire prima di fidarsi</strong>
          </p>
          <p className="text-base">
            Non serve esperienza. Non serve investire.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"

export default function ForWho() {
  return (
    <SectionLayout background="white">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Per chi è"
        />
        <div className="text-base text-foreground leading-relaxed space-y-4">
          <p>
            <strong className="font-semibold">Per chi è esposto all'hype crypto</strong><br />
            <strong className="font-semibold">Per chi è confuso ma curioso</strong><br />
            <strong className="font-semibold">Per chi vuole capire prima di fidarsi</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Non serve esperienza. Non serve investire.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

import { Badge } from "@/components/ui/badge";
import { EconomicsIcon } from "@/components/icons/economics-icon";
import { MicrostructureIcon } from "@/components/icons/microstructure-icon";
import { BrainIcon } from "@/components/icons/brain-icon";

interface AcademicRigourProps {
  className?: string;
}

export default function AcademicRigour({ className }: AcademicRigourProps) {
  const disciplines = [
    {
      title: "Economia Finanziaria",
      desc: "Teoria dei portafogli, analisi del rischio e pricing dei titoli",
      icon: EconomicsIcon,
      color: "from-blue-500/10 to-blue-500/5"
    },
    {
      title: "Market Microstructure", 
      desc: "Contesto operativo, liquidità e meccanismi di formazione dei prezzi",
      icon: MicrostructureIcon,
      color: "from-purple-500/10 to-purple-500/5"
    },
    {
      title: "Behavioral Finance",
      desc: "Riconoscimento e riduzione sistematica dei bias cognitivi",
      icon: BrainIcon,
      color: "from-green-500/10 to-green-500/5"
    }
  ];

  return (
    <section className={`py-32 bg-muted/20 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-6 mb-20">
          <Badge variant="outline" className="text-sm">Metodologia</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Solidità Accademica</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Approccio basato su discipline accademiche consolidate e verificabili.
            Nessuna promessa, solo metodo.
          </p>
        </div>
        
        <div className="grid gap-12 md:grid-cols-3">
          {disciplines.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className="text-center space-y-6 group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                  <IconComponent className="h-10 w-10 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                
                <div className={`h-1 w-12 mx-auto rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
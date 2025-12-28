import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AssetClassesProps {
  className?: string;
}

export default function AssetClasses({ className }: AssetClassesProps) {
  const assets = [
    {
      name: "Crypto",
      desc: "Custodia e liquidità prima del prezzo",
      color: "from-orange-500/20 to-red-500/20",
      href: "/dashboard/crypto",
      badge: "Nuovo",
      features: ["Custodia", "Liquidità", "Regulatory"]
    },
    {
      name: "FX", 
      desc: "Regime tassi e driver dominanti",
      color: "from-blue-500/20 to-cyan-500/20",
      href: "/dashboard/fx",
      badge: null,
      features: ["Tassi", "Macro", "Correlazioni"]
    },
    {
      name: "Equity",
      desc: "Regime di mercato e coerenza evidenze", 
      color: "from-green-500/20 to-emerald-500/20",
      href: "/dashboard/equity",
      badge: null,
      features: ["Regimi", "Valutazione", "Ciclicità"]
    },
    {
      name: "Commodities",
      desc: "Ciclicità fisica e vincoli offerta",
      color: "from-amber-500/20 to-yellow-500/20", 
      href: "/dashboard/commodities",
      badge: null,
      features: ["Supply/Demand", "Stagionalità", "Geopolitica"]
    }
  ];

  return (
    <section id="assets" className={`py-32 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-6 mb-20">
          <Badge variant="secondary" className="text-sm">Asset Classes</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Ogni asset richiede un modello mentale diverso</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Seleziona il contesto corretto per il tuo percorso educativo. Ogni mercato ha le sue regole, 
            la sua liquidità e i suoi driver fondamentali.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {assets.map((asset) => (
            <Card key={asset.name} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50">
              <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{asset.name}</CardTitle>
                  {asset.badge && (
                    <Badge variant="premium" className="text-xs">
                      {asset.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">{asset.desc}</CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  {asset.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                  <Link href={asset.href}>
                    Esplora Dashboard
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
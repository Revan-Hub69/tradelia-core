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
      desc: "Inizia qui: Bitcoin, Ethereum e come non perdere tutto",
      color: "from-orange-500/20 to-red-500/20",
      href: "/dashboard/crypto",
      badge: "Inizia Qui",
      features: ["Custodia sicura", "Quando comprare", "Evitare truffe"]
    },
    {
      name: "Azioni", 
      desc: "Dopo le crypto: investire in azioni senza farsi fregare",
      color: "from-green-500/20 to-emerald-500/20",
      href: "/dashboard/equity",
      badge: null,
      features: ["Valutare aziende", "Quando vendere", "Gestire rischio"]
    },
    {
      name: "Forex",
      desc: "Livello avanzato: capire le valute e i tassi",
      color: "from-blue-500/20 to-cyan-500/20",
      href: "/dashboard/fx",
      badge: null,
      features: ["Coppie valutarie", "Tassi interesse", "Timing giusto"]
    },
    {
      name: "Materie Prime",
      desc: "Per esperti: oro, petrolio e commodities",
      color: "from-amber-500/20 to-yellow-500/20", 
      href: "/dashboard/commodities",
      badge: null,
      features: ["Domanda/Offerta", "Stagionalità", "Quando entrare"]
    }
  ];

  return (
    <section id="assets" className={`py-32 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-6 mb-20">
          <Badge variant="secondary" className="text-sm">Inizia dalle Crypto</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Parti dalle crypto, poi esplora gli altri mercati</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            La maggior parte inizia dalle crypto. Impara le basi qui, poi applica lo stesso metodo 
            ad azioni, forex e materie prime.
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
                    Inizia a Imparare
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
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Tradelia</h1>
        <p className="text-muted-foreground">
          Seleziona una sezione per esplorare i contenuti educativi. Metodo rigoroso senza segnali operativi.
        </p>
      </div>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Tradelia</CardTitle>
          <CardDescription>
            Seleziona una sezione per esplorare i contenuti educativi. Metodo rigoroso senza segnali operativi.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild><Link href="/dashboard/crypto">Crypto</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/fx">FX</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/equity">Equity</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/commodities">Commodities</Link></Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Percorsi</CardTitle>
            <CardDescription>Unità brevi e verificabili per orizzonte temporale.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary"><Link href="/dashboard/paths/long-term">Vai ai percorsi</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Libreria</CardTitle>
            <CardDescription>Indicatori e concetti con esempi e limiti.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary"><Link href="/dashboard/library">Apri libreria</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metodo</CardTitle>
            <CardDescription>Note metodologiche e fonti accademiche.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary"><Link href="/dashboard/about">Leggi il metodo</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

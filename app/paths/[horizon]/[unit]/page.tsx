import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPathBySlug, getUnit, pathOverviews } from "@/data/paths";

export function generateStaticParams() {
  return pathOverviews.flatMap((path) =>
    path.units.map((unit) => ({ horizon: path.slug, unit: unit.slug }))
  );
}

export default function UnitPage({
  params,
}: {
  params: { horizon: string; unit: string };
}) {
  const path = getPathBySlug(params.horizon);
  const unit = getUnit(params.horizon, params.unit);

  if (!path || !unit) {
    return notFound();
  }

  return (
    <AppShell
      title={`${path.title} · ${unit.title}`}
      subtitle={unit.summary}
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Orizzonte: {path.title}
          </Badge>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/paths/${path.slug}`}>Percorso</Link>
          </Button>
        </div>
      }
    >
      <Alert variant="destructive">
        <AlertTitle>Errore comune</AlertTitle>
        <AlertDescription>{unit.error}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Regola chiave</CardTitle>
          <CardDescription>Principio operativo da applicare in modo costante.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{unit.rule}</p>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="text-base font-semibold">Come verificarla</h2>
          <p className="text-sm text-muted-foreground">
            Checklist statica per validare la regola prima e dopo l'operatività.
          </p>
        </div>
        <div className="space-y-3 px-6 py-4">
          {unit.checklist.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Esempio pratico</CardTitle>
          <CardDescription>Illustrazione concisa per contestualizzare la regola.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{unit.example}</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Unità focalizzata su prevenzione errori, non su segnali operativi.
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm">Approfondisci</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Fonti rapide</SheetTitle>
                <SheetDescription>
                  Riferimenti di studio per consolidare la regola e valutarne i limiti.
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 text-muted-foreground">Documenti suggeriti:</p>
                  <ul className="list-disc space-y-2 pl-4 text-foreground">
                    {unit.sources.map((source) => (
                      <li key={source}>{source}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md bg-muted p-3 text-muted-foreground">
                  Nota: le fonti sono selezionate per uso educativo. Nessuna indicazione di trading.
                </div>
                <SheetClose asChild>
                  <Button variant="secondary" className="w-full">
                    Chiudi
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild variant="outline" size="sm">
            <Link href={`/paths/${path.slug}`}>Torna al percorso</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

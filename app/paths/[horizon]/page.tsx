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
import { Progress } from "@/components/ui/progress";
import { getPathBySlug, pathOverviews } from "@/data/paths";

export function generateStaticParams() {
  return pathOverviews.map((path) => ({ horizon: path.slug }));
}

export default function HorizonPage({
  params,
}: {
  params: { horizon: string };
}) {
  const path = getPathBySlug(params.horizon);

  if (!path) {
    return notFound();
  }

  const averageCompletion = Math.round(
    path.units.reduce((acc, unit) => acc + unit.completion, 0) / path.units.length
  );

  return (
    <AppShell
      title={path.title}
      subtitle={path.description}
      actions={
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-muted-foreground">
            <span>Avanzamento</span>
            <Progress value={averageCompletion} className="w-32" />
            <span className="text-xs font-medium text-foreground">{averageCompletion}%</span>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/">Torna alla home</Link>
          </Button>
        </div>
      }
    >
      {path.riskNote ? (
        <Alert variant="destructive">
          <AlertTitle>Nota di rischio</AlertTitle>
          <AlertDescription>{path.riskNote}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {path.units.map((unit) => (
          <Card key={unit.slug}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>{unit.title}</CardTitle>
                  <CardDescription>{unit.summary}</CardDescription>
                </div>
                <Badge variant="secondary">Unità</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1 text-sm">
                <span className="text-muted-foreground">Avanzamento unità</span>
                <div className="flex items-center gap-2">
                  <Progress value={unit.completion} className="w-32" />
                  <span className="text-xs font-medium text-foreground">{unit.completion}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Errori tipici trattati: {unit.error}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/paths/${path.slug}/${unit.slug}`}>Apri unità</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

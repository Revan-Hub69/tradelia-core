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
import { getLibraryEntry, libraryEntries } from "@/data/library";

export function generateStaticParams() {
  return libraryEntries.map((entry) => ({ slug: entry.slug }));
}

export default function LibraryEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getLibraryEntry(params.slug);

  if (!entry) {
    return notFound();
  }

  return (
    <AppShell
      title={entry.title}
      subtitle={entry.summary}
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Indicatore</Badge>
          <Button asChild variant="secondary" size="sm">
            <Link href="/library">Libreria</Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Definizione</CardTitle>
          <CardDescription>Descrizione neutrale dell&#39;indicatore.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">{entry.definition}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quando ha senso</CardTitle>
            <CardDescription>Contesti in cui l&#39;indicatore supporta decisioni migliori.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
              {entry.whenUseful.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quando è fuorviante</CardTitle>
            <CardDescription>Situazioni in cui le letture possono ingannare.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
              {entry.whenMisleading.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Fonti accademiche</CardTitle>
          <CardDescription>Riferimenti per approfondire metodologia e limiti.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-foreground">
            {entry.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertTitle>Nota educativa AI</AlertTitle>
        <AlertDescription>{entry.aiNote}</AlertDescription>
      </Alert>
    </AppShell>
  );
}

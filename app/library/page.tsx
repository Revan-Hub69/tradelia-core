import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { libraryEntries } from "@/data/library";

export default function LibraryPage() {
  return (
    <AppShell
      title="Libreria indicatori"
      subtitle="Concetti essenziali per valutare segnali e contesto senza sostituire il giudizio critico."
      actions={
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard/paths/long-term">Vai ai percorsi</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {libraryEntries.map((entry) => (
          <Card key={entry.slug}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription>{entry.summary}</CardDescription>
              </div>
              <Badge variant="secondary">Indicatore</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Fonti: {entry.sources.length}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/library/${entry.slug}`}>Apri scheda</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

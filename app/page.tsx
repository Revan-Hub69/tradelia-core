import Link from "next/link";

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
import { pathOverviews } from "@/data/paths";

export default function HomePage() {
  return (
    <AppShell
      title="Home"
      subtitle="Seleziona l'orizzonte e accedi a percorsi mirati sugli errori da evitare."
      actions={
        <Button asChild variant="secondary" size="sm">
          <Link href="/paths/long-term">Inizia dal tuo orizzonte</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {pathOverviews.map((path) => (
          <Card key={path.slug}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle>{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </div>
              <Badge variant={path.riskNote ? "secondary" : "default"}>
                {path.riskNote ? "Attenzione" : "Percorso"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {path.riskNote ? (
                <Alert variant="destructive">
                  <AlertTitle>Rischio elevato</AlertTitle>
                  <AlertDescription>{path.riskNote}</AlertDescription>
                </Alert>
              ) : null}
              <p className="text-sm text-muted-foreground">
                Unità previste: {path.units.length}. Focus su errori ricorrenti, verifiche operative e casi pratici.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/paths/${path.slug}`}>Apri percorso</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

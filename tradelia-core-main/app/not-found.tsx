import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Contenuto non disponibile</h1>
        <p className="text-sm text-muted-foreground">
          La risorsa richiesta non è presente nel percorso educativo.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Torna alla home</Link>
      </Button>
    </div>
  );
}

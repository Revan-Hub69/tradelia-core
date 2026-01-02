import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[60rem] flex-col justify-center gap-4 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-primary">Contenuto non disponibile</h1>
        <p className="text-sm text-muted-foreground">
          La risorsa richiesta non è presente.
        </p>
      </div>
      <Link href="/" className="text-sm text-primary underline underline-offset-4">
        Torna alla home
      </Link>
    </div>
  );
}

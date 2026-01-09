/**
 * App Layout (Redirect Only) - Tradelia 2026
 * 
 * Questo layout è minimale perché le route sotto app/(app)/
 * reindirizzano alla versione localizzata app/[locale]/(app)/
 */

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

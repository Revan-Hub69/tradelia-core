import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tradelia | Fondazione educativa",
  description:
    "Piattaforma educativa per decisioni finanziarie più consapevoli e gestione del rischio disciplinata.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-muted/20 text-foreground antialiased">{children}</body>
    </html>
  );
}

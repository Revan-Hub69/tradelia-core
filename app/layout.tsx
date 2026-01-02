import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tradelia.org'),
  title: {
    default: "Tradelia | Verifica decisionale",
    template: "%s | Tradelia"
  },
  description: "Sistema che verifica la compatibilità tra necessità dell'utente e caratteristiche reali di broker, wallet, exchange e conti deposito, con fonti ufficiali.",
  keywords: [
    "compatibilità finanziaria",
    "broker",
    "exchange",
    "wallet",
    "conti deposito",
    "risk management",
    "decision science",
    "MiFID",
    "due diligence",
    "fintech"
  ],
  authors: [{ name: "Tradelia Team" }],
  creator: "Tradelia",
  publisher: "Tradelia",
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="it">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

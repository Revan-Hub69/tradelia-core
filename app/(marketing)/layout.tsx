import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tradelia.org"),
  title: {
    default: "Tradelia | Verifica decisionale",
    template: "%s | Tradelia"
  },
  description:
    "Sistema che verifica la compatibilità tra necessità dell'utente e caratteristiche reali di broker, wallet, exchange e conti deposito, con fonti ufficiali.",
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
};

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return children;
}

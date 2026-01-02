import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tradelia.org"),
  title: {
    default: "Tradelia | Verifica decisionale",
    template: "%s | Tradelia",
  },
  description:
    "Sistema che verifica la compatibilita tra obiettivi dichiarati e caratteristiche reali di broker, wallet, exchange, conti deposito e strumenti di pagamento.",
  keywords: [
    "compatibilita finanziaria",
    "broker",
    "exchange",
    "wallet",
    "conti deposito",
    "strumenti di pagamento",
    "risk management",
    "decision science",
    "MiFID",
    "due diligence",
    "fintech",
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

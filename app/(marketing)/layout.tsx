import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.org",
    title: "Tradelia | Verifica decisionale",
    description:
      "Sistema che verifica la compatibilità tra necessità dell'utente e caratteristiche reali di broker, wallet, exchange e conti deposito.",
    siteName: "Tradelia",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tradelia - Sistema di verifica decisionale"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia | Verifica decisionale",
    description:
      "Sistema che verifica la compatibilità tra necessità dell'utente e caratteristiche reali di broker, wallet, exchange e conti deposito.",
    images: ["/og.png"],
    creator: "@tradelia"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ]
  },
  manifest: "/site.webmanifest",
};

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}

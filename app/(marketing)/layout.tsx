import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL('https://tradelia.com'),
  title: {
    default: "Tradelia | Fondazione educativa",
    template: "%s | Tradelia"
  },
  description: "Piattaforma educativa per decisioni finanziarie più consapevoli e gestione del rischio disciplinata. Metodo, non segnali.",
  keywords: [
    "educazione finanziaria", 
    "gestione rischio", 
    "trading", 
    "investimenti", 
    "analisi tecnica", 
    "economia", 
    "finanza comportamentale"
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
    url: "https://tradelia.com",
    title: "Tradelia | Fondazione educativa",
    description: "Piattaforma educativa per decisioni finanziarie più consapevoli e gestione del rischio disciplinata.",
    siteName: "Tradelia",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tradelia - Piattaforma educativa finanziaria"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia | Fondazione educativa",
    description: "Piattaforma educativa per decisioni finanziarie più consapevoli e gestione del rischio disciplinata.",
    images: ["/og.png"],
    creator: "@tradelia"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
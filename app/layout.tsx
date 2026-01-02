import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, ibmPlexSans } from "@/lib/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tradelia.org"),
  title: {
    default: "Tradelia | Verifica decisionale",
    template: "%s | Tradelia",
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
    "fintech",
  ],
  authors: [{ name: "Tradelia Team" }],
  creator: "Tradelia",
  publisher: "Tradelia",
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
        alt: "Tradelia - Sistema di verifica decisionale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia | Verifica decisionale",
    description:
      "Sistema che verifica la compatibilità tra necessità dell'utente e caratteristiche reali di broker, wallet, exchange e conti deposito.",
    images: ["/og.png"],
    creator: "@tradelia",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: "https://tradelia.org",
    languages: {
      "it-IT": "https://tradelia.org",
    },
  },
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("tradelia-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "light" || stored === "dark" ? stored : (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${ibmPlexSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-muted/20 text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

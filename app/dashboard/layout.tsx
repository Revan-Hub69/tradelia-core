import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { DashboardFooter } from "@/components/dashboard-footer";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Tradelia - Educazione Finanziaria",
    template: "%s | Dashboard Tradelia"
  },
  description: "Dashboard educativa Tradelia: percorsi di apprendimento, misuratori di contesto, libreria truffe e strumenti per decisioni finanziarie consapevoli.",
  keywords: [
    "dashboard educativa",
    "educazione finanziaria", 
    "crypto educazione",
    "gestione rischio",
    "antifuffa",
    "microlearning",
    "truffe crypto"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Dashboard Educativa | Tradelia",
    description: "Strumenti educativi per decisioni finanziarie consapevoli e gestione disciplinata del rischio.",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard Educativa | Tradelia",
    description: "Strumenti educativi per decisioni finanziarie consapevoli e gestione disciplinata del rischio.",
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {children}
      </main>
      <DashboardFooter />
    </>
  );
}
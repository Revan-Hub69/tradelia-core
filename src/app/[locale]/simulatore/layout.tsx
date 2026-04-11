import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/simulatore.css';

export const metadata: Metadata = {
  title: 'Simulatore | Tradelia',
  description:
    'Simula costi, esposizione reale e score strumenti finanziari — futures, CFD, ETF, crypto.',
  robots: { index: true, follow: true },
};

export default function SimulatoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* General Sans via Fontshare */}
      <link
        rel="preconnect"
        href="https://api.fontshare.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        rel="stylesheet"
      />
      {/* Geist Mono via Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div className="sim-root">
        {children}
      </div>
    </>
  );
}

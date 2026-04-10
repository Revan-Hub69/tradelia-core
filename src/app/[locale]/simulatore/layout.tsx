import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Simulatore | Tradelia',
  description:
    'Simula costi, esposizione reale e score strumenti finanziari — futures, CFD, ETF, crypto.',
  robots: { index: true, follow: true },
};

/**
 * Layout standalone del Simulatore.
 * Nessun header/footer della landing — UI propria dedicata.
 */
export default function SimulatoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sim-root" data-theme="dark">
      {children}
    </div>
  );
}

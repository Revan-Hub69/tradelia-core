import type { Metadata } from 'next';
import '@/styles/simulatore.css';

export const metadata: Metadata = {
  title: 'Simulatore — Tradelia',
  description: 'Confronta strumenti finanziari per la tua esposizione target. Analisi costi, fattibilità e score comparativo.',
  openGraph: {
    title: 'Simulatore Tradelia',
    description: 'Trova lo strumento ottimale per la tua esposizione.',
    type: 'website',
  },
};

export default function SimulatoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Forza html+body a occupare esattamente il viewport e blocca
        lo scroll esterno — scoped solo a questa route.
        Senza questo, height:100% su .sim-main non ha un antenato
        con altezza fissa e il contenuto sfonda il viewport.
      */}
      <style>{`
        html:has(.sim-root),
        html:has(.sim-root) body {
          height: 100%;
          overflow: hidden;
        }
        @media (max-width: 860px) {
          html:has(.sim-root),
          html:has(.sim-root) body {
            height: auto;
            overflow: auto;
          }
        }
      `}</style>
      <div data-theme="dark" className="sim-root">
        {children}
      </div>
    </>
  );
}

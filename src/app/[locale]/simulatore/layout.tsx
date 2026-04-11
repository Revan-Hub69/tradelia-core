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
    <div data-theme="dark" className="sim-root">
      {children}
    </div>
  );
}

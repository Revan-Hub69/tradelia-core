'use client';

import { FadeIn } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const brokers = [
  'Interactive Brokers', 'DEGIRO', 'eToro', 'XTB', 'Plus500',
  'IC Markets', 'Pepperstone', 'OANDA', 'IG', 'Saxo Bank',
  'TD Ameritrade', 'Charles Schwab', 'Fidelity', 'TradeStation',
  'Binance', 'Coinbase', 'Kraken', 'Fineco', 'Directa', 'Banca Sella',
];

export const BrokerTicker = () => {
  const items = [...brokers, ...brokers];

  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-muted/10 py-8 sm:py-10">
      <SectionContainer size="wide">
        <FadeIn>
          <div className="mb-6 text-center sm:mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
              Broker analizzati
            </p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              50+ broker
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-muted/10 to-transparent sm:w-32 lg:w-48" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-muted/10 to-transparent sm:w-32 lg:w-48" />

          <div className="flex animate-scroll gap-x-6 sm:gap-x-10">
            {items.map((broker, i) => (
              <span
                key={i}
                className="shrink-0 whitespace-nowrap text-sm font-medium text-muted-foreground/80 transition-colors duration-200 hover:text-foreground sm:text-base"
              >
                {broker}
              </span>
            ))}
          </div>
        </div>
      </SectionContainer>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 50s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

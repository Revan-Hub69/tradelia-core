'use client';

import { FadeIn } from '@/components/ui/scroll-animations';

const brokers = [
  'Interactive Brokers', 'DEGIRO', 'eToro', 'XTB', 'Plus500',
  'IC Markets', 'Pepperstone', 'OANDA', 'IG', 'Saxo Bank',
  'TD Ameritrade', 'Charles Schwab', 'Fidelity', 'TradeStation',
  'Binance', 'Coinbase', 'Kraken', 'Fineco', 'Directa', 'Banca Sella',
];

export const BrokerTicker = () => {
  const items = [...brokers, ...brokers];

  return (
    <section className="relative overflow-hidden border-t border-border/30 bg-background py-8 sm:py-10">
      <FadeIn>
        <div className="mb-5 flex items-center justify-center gap-4 sm:mb-6">
          <span className="inline-block h-px w-8 bg-border/60" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
            Broker analizzati
          </p>
          <span className="inline-block h-px w-8 bg-border/60" />
        </div>
      </FadeIn>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40 lg:w-56" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40 lg:w-56" />

        <div className="flex animate-scroll gap-x-8 sm:gap-x-12">
          {items.map((broker, i) => (
            <span
              key={i}
              className="shrink-0 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40 transition-colors duration-200 hover:text-muted-foreground/70 sm:text-xs"
            >
              {broker}
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

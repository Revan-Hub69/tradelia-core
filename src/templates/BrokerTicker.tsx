'use client';

import { FadeIn } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const brokers = [
  { name: 'Interactive Brokers', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
  { name: 'DEGIRO', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { name: 'eToro', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  { name: 'XTB', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  { name: 'Plus500', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  { name: 'IC Markets', color: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  { name: 'Pepperstone', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  { name: 'OANDA', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  { name: 'IG', color: 'bg-rose-500/15 text-rose-400 border-rose-500/20' },
  { name: 'Saxo Bank', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  { name: 'TD Ameritrade', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
  { name: 'Charles Schwab', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { name: 'Fidelity', color: 'bg-green-500/15 text-green-400 border-green-500/20' },
  { name: 'TradeStation', color: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
  { name: 'Binance', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  { name: 'Coinbase', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { name: 'Kraken', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  { name: 'Fineco', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { name: 'Directa', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  { name: 'Banca Sella', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
];

const BrokerBadge = ({ name, color }: { name: string; color: string }) => (
  <div className={`flex shrink-0 items-center gap-2.5 rounded-full border ${color} bg-opacity-10 px-4 py-2 sm:px-5 sm:py-2.5`}>
    <span className="whitespace-nowrap text-xs font-semibold tracking-wide sm:text-sm">{name}</span>
  </div>
);

export const BrokerTicker = () => (
  <section className="border-t border-border/40 bg-slate-950/50 py-10 sm:py-12 lg:py-14">
    <SectionContainer size="wide">
      <FadeIn>
        <div className="mb-6 text-center sm:mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 sm:text-xs sm:tracking-[0.24em]">
            Broker analizzati
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            50+ broker
          </p>
        </div>
      </FadeIn>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24 lg:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24 lg:w-32" />

        <div className="flex animate-marquee gap-3 sm:gap-4">
          {[...brokers, ...brokers, ...brokers].map((broker, i) => (
            <BrokerBadge key={i} {...broker} />
          ))}
        </div>
      </div>
    </SectionContainer>

    <style jsx global>{`
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-33.333%);
        }
      }
      .animate-marquee {
        animation: marquee 45s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}</style>
  </section>
);

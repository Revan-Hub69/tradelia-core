'use client';

import { ArrowRight, BarChart3, Shield, Zap, Target, TrendingUp, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const accentMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

type TileDef = {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  accent: keyof typeof accentMap;
};

const BentoTile = ({ icon, titleKey, descKey, accent }: TileDef) => {
  // @ts-ignore
  const t = useTranslations('FeatureBento') as (key: string) => string;
  const colors = accentMap[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70 hover:bg-card/80 hover:shadow-lg sm:rounded-[20px]">
      <div className={`absolute -right-6 -top-6 size-24 rounded-full ${colors.bg} opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150`} />
      <div className={`inline-flex size-10 items-center justify-center rounded-xl ${colors.bg} ${colors.text} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        {t(titleKey)}
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {t(descKey)}
      </p>
      <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${colors.text} opacity-0 transition-all duration-300 group-hover:opacity-100`}>
        <span>{t('learn_more')}</span>
        <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
};

const tiles: TileDef[] = [
  { icon: <BarChart3 className="size-5" />, titleKey: 'tile1_title', descKey: 'tile1_desc', accent: 'blue' },
  { icon: <Zap className="size-5" />, titleKey: 'tile2_title', descKey: 'tile2_desc', accent: 'amber' },
  { icon: <Target className="size-5" />, titleKey: 'tile3_title', descKey: 'tile3_desc', accent: 'emerald' },
  { icon: <Shield className="size-5" />, titleKey: 'tile4_title', descKey: 'tile4_desc', accent: 'purple' },
  { icon: <TrendingUp className="size-5" />, titleKey: 'tile5_title', descKey: 'tile5_desc', accent: 'rose' },
  { icon: <Globe className="size-5" />, titleKey: 'tile6_title', descKey: 'tile6_desc', accent: 'cyan' },
];

export const FeatureBento = () => {
  // @ts-ignore
  const t = useTranslations('FeatureBento') as (key: string) => string;

  return (
    <section className="border-t border-border/40 py-14 sm:py-16 lg:py-20 xl:py-24">
      <SectionContainer size="wide">
        <FadeIn>
          <div className="text-center">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:tracking-[0.24em]">
              {t('eyebrow')}
            </p>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={80} className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <BentoTile key={tile.titleKey} {...tile} />
          ))}
        </StaggerChildren>
      </SectionContainer>
    </section>
  );
};

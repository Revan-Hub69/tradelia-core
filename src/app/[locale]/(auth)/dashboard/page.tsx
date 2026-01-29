import { getTranslations } from 'next-intl/server';

import { DynamicIcon, type IconName } from '@/components/icons';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { Link } from '@/libs/i18nNavigation';

type QuickLink = {
  id: 'challenges' | 'my-challenges' | 'signals';
  href: string;
  icon: IconName;
  titleKey: 'nav_challenges' | 'nav_my_challenges' | 'nav_signals';
  descKey: 'nav_challenges_desc' | 'nav_my_challenges_desc' | 'nav_signals_desc';
};

const quickLinks: QuickLink[] = [
  {
    id: 'challenges',
    href: '/dashboard/challenges',
    icon: 'ChallengesIcon',
    titleKey: 'nav_challenges',
    descKey: 'nav_challenges_desc',
  },
  {
    id: 'my-challenges',
    href: '/dashboard/my-challenges',
    icon: 'MyChartsIcon',
    titleKey: 'nav_my_challenges',
    descKey: 'nav_my_challenges_desc',
  },
  {
    id: 'signals',
    href: '/dashboard/signals',
    icon: 'SignalsIcon',
    titleKey: 'nav_signals',
    descKey: 'nav_signals_desc',
  },
];

const DashboardIndexPage = async () => {
  const t = await getTranslations('Dashboard');

  return (
    <PageTransitionWrapper>
      <div className="mx-auto max-w-screen-xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t('overview_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('overview_description')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map(link => (
            <Link
              key={link.id}
              href={link.href}
              className="card-ios-26 group flex h-full flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <DynamicIcon name={link.icon} size={24} variant="premium" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{t(link.titleKey)}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t(link.descKey)}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true">
                  &rarr;
                </div>
              </div>
              <div className="mt-6 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {t('overview_cta')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default DashboardIndexPage;

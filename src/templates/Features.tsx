import { useTranslations } from 'next-intl';

import { Background } from '@/components/Background';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('Features');

  const paths = [
    {
      color: 'bg-yellow-500',
      title: t('feature1_title'),
      description: t('feature1_description'),
    },
    {
      color: 'bg-blue-500',
      title: t('feature2_title'),
      description: t('feature2_description'),
    },
    {
      color: 'bg-green-500',
      title: t('feature3_title'),
      description: t('feature3_description'),
    },
    {
      color: 'bg-red-500',
      title: t('feature4_title'),
      description: t('feature4_description'),
    },
  ];

  return (
    <Background>
      <Section
        id="percorsi"
        subtitle={t('section_subtitle')}
        title={t('section_title')}
        description={t('section_description')}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {paths.map((path, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Color indicator */}
              <div className={`absolute left-0 top-0 h-full w-1 ${path.color}`} />

              <div className="pl-4">
                <h3 className="text-xl font-semibold">{path.title}</h3>
                <p className="mt-2 text-muted-foreground">{path.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Base path note */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prima di scegliere un percorso, completa il
          {' '}
          <span className="font-medium text-foreground">Percorso Base gratuito</span>
          .
        </p>
      </Section>
    </Background>
  );
};

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SimulatoreLink() {
  const { locale } = useRouter();
  const t = useTranslations();

  return (
    <Link
      href={`/${locale}/simulatore`}
      className="inline-flex items-center gap-2 text-sm font-medium text-tradeblue hover:text-tradeblue-600 transition-colors"
    >
      {t('nav_simulator')}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
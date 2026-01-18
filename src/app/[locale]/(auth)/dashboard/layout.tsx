import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
  // Simplified layout - main dashboard logic moved to page component
  // This maintains the existing Next.js app router structure while
  // allowing the new dashboard architecture to handle the UI
  
  return (
    <div className="min-h-screen bg-background">
      {props.children}
    </div>
  );
}

export const dynamic = 'force-dynamic';

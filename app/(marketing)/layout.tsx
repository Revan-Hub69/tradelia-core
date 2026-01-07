import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageSelector';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import AuthModal from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'Tradelia - Dashboard dinamica che evita gli errori nel mondo crypto',
  description: 'Dashboard dinamica che evita gli errori nel mondo crypto. Verifica la coerenza dei tuoi strumenti di trading.',
  openGraph: {
    title: 'Tradelia - Dashboard dinamica che evita gli errori nel mondo crypto',
    description: 'Dashboard dinamica che evita gli errori nel mondo crypto. Verifica la coerenza dei tuoi strumenti di trading.',
    url: 'https://tradelia.com',
    siteName: 'Tradelia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tradelia - Dashboard dinamica che evita gli errori nel mondo crypto',
    description: 'Dashboard dinamica che evita gli errori nel mondo crypto. Verifica la coerenza dei tuoi strumenti di trading.',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardModalProvider>
        <Header />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
        <AuthModal />
      </DashboardModalProvider>
    </LanguageProvider>
  );
}

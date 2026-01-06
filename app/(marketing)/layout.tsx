import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageSelector';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import AuthModal from '@/components/AuthModal';

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

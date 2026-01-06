import { LanguageProvider } from '@/components/LanguageSelector';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import AuthModal from '@/components/AuthModal';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardModalProvider>
        {children}
        <AuthModal />
      </DashboardModalProvider>
    </LanguageProvider>
  );
}

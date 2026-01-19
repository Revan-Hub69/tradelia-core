import { getTranslations } from 'next-intl/server';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PWABottomNavigationSimple } from '@/components/navigation/PWABottomNavigationSimple';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { SkipLinks } from '@/components/accessibility/SkipLinks';
import { NavigationProvider } from '@/components/navigation/NavigationProvider';
import { ResponsiveDebug } from '@/components/debug/ResponsiveDebug';

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
  return (
    <NavigationProvider>
      <div className="layout-stable bg-background">
        <SkipLinks />
        
        {/* Sidebar Navigation - Tablet and Desktop (768px+) */}
        <SidebarNavigation className="layout-sidebar" />
        
        {/* Header - Always visible */}
        <DashboardHeader 
          variant="home"
          showScrollShadow={true}
          className="layout-header"
        />
        
        {/* Header Navigation - Tablet only (768px-1023px) */}
        {/* REMOVED: Header navigation replaced with sidebar for better UX */}
        
        {/* Main Content */}
        <main 
          id="main-content" 
          className="layout-main content-stable px-4 py-6"
        >
          {props.children}
        </main>
        
        {/* Bottom Navigation - Mobile only (< 768px) */}
        <PWABottomNavigationSimple className="layout-nav" />
        
        {/* Command Palette - Desktop feature */}
        <CommandPalette />
        
        {/* Responsive Debug - Development only */}
        <ResponsiveDebug />
      </div>
    </NavigationProvider>
  );
}

export const dynamic = 'force-dynamic';

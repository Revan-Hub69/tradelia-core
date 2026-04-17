import type { ReactNode } from 'react';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { LandingFooter } from '@/templates/LandingFooter';
import { Navbar } from '@/templates/Navbar';

type PublicShellProps = {
  children: ReactNode;
  containerSize?: 'content' | 'wide';
};

export const PublicShell = ({ children, containerSize = 'content' }: PublicShellProps) => {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_38%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background))_40%,hsl(var(--muted)/0.25))]"
      >
        <SectionContainer size={containerSize} className="py-14 sm:py-16 lg:py-20">
          {children}
        </SectionContainer>
      </main>
      <LandingFooter />
    </>
  );
};

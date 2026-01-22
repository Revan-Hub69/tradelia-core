/*
 * SIGNATURE ICONS TEST PAGE - Tradelia Signature 2026
 *
 * Pagina di test per il nuovo sistema signature di icone
 * Basato su ricerche approfondite Apple iOS 26 + Linear + Best Practices 2026
 * Accessibile solo in development
 */

import React from 'react';

import { SignatureIconShowcase } from '@/components/icons/unified';

export default function IconsTestPage() {
  // Solo in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Page available only in development</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <SignatureIconShowcase />
    </div>
  );
}

export const metadata = {
  title: 'Signature Icons Test - Tradelia 2026',
  description: 'Test page for signature icon system - memorable, professional, innovative',
};

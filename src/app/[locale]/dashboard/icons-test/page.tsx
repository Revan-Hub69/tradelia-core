/*
 * ICONS TEST PAGE - Tradelia Premium 2026
 *
 * Pagina di test per le nuove icone premium
 * Accessibile solo in development
 */

import React from 'react';

import { PremiumIconShowcase } from '@/components/icons/premium/PremiumIconShowcase';

export default function IconsTestPage() {
  // Solo in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Page available only in development</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PremiumIconShowcase />
    </div>
  );
}

export const metadata = {
  title: 'Icons Test - Tradelia',
  description: 'Test page for premium icons',
};
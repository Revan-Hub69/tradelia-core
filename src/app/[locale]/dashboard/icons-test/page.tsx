/*
 * ICONS TEST PAGE - Tradelia Refined 2026
 *
 * Pagina di test per le nuove icone raffinate
 * Accessibile solo in development
 */

import React from 'react';

import { RefinedIconShowcase } from '@/components/icons/refined/RefinedIconShowcase';

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
      <RefinedIconShowcase />
    </div>
  );
}

export const metadata = {
  title: 'Refined Icons Test - Tradelia',
  description: 'Test page for refined and elegant icons',
};
'use client';

import {
  ContentCard,
  GlassCard,
  HeroBanner,
  SignatureShape,
  SupportingElement,
  TradelliaGlass,
} from './index';

/**
 * Signature Showcase Component
 *
 * Demonstrates consistent application of Tradelia's signature visual elements
 * Use this as reference for implementing signature design across components
 */

export function SignatureShowcase() {
  return (
    <div className="space-y-8 p-8">
      {/* Hero Section - Primary Weight */}
      <HeroBanner className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Tradelia Signature Design</h1>
        <p className="text-lg opacity-90">Enterprise memorable with soul</p>
      </HeroBanner>

      {/* Glass Components Showcase */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard variant="primary" interactive>
          <h3 className="mb-2 font-semibold">Primary Glass Card</h3>
          <p className="text-sm opacity-80">Hero elements with signature treatments</p>
        </GlassCard>

        <GlassCard variant="secondary" interactive>
          <h3 className="mb-2 font-semibold">Secondary Glass Card</h3>
          <p className="text-sm opacity-80">Important supporting content</p>
        </GlassCard>

        <GlassCard variant="tertiary" interactive>
          <h3 className="mb-2 font-semibold">Tertiary Glass Card</h3>
          <p className="text-sm opacity-80">Background supporting elements</p>
        </GlassCard>
      </div>

      {/* Signature Shapes Showcase */}
      <ContentCard>
        <h2 className="mb-4 text-xl font-semibold">Signature Shapes</h2>
        <div className="flex flex-wrap gap-4">
          <SignatureShape shape="pill" variant="primary">
            Tradelia Pill
          </SignatureShape>

          <SignatureShape shape="notch" variant="secondary">
            Tradelia Notch
          </SignatureShape>

          <SignatureShape shape="cut" variant="accent">
            Tradelia Cut
          </SignatureShape>
        </div>
      </ContentCard>

      {/* Visual Hierarchy Showcase */}
      <div className="space-y-4">
        <SupportingElement>
          <h3 className="mb-2 font-medium">Visual Hierarchy System</h3>
          <p className="text-sm opacity-80">
            Consistent visual weight creates clear information hierarchy without reading
          </p>
        </SupportingElement>
      </div>

      {/* Raw Glass Surface */}
      <TradelliaGlass variant="modal" className="p-6">
        <h3 className="mb-2 font-semibold">Raw Tradelia Glass</h3>
        <p className="text-sm opacity-80">
          Base glass component with signature micro-grain texture and brand highlight
        </p>
      </TradelliaGlass>
    </div>
  );
}

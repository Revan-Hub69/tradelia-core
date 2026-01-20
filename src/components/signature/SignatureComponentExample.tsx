/**
 * SIGNATURE COMPONENT EXAMPLE - Enterprise 2026
 *
 * Showcase completo del Tradelia Signature Component
 * Dimostra tutte le varianti, forme, texture e interazioni
 */

import {
  Award,
  BookOpen,
  Crown,
  Heart,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import {
  TradeliaAccentButton,
  TradeliaAchievementBadge,
  TradeliaGhostAction,
  type TradeliaInteraction,
  TradeliaPremiumCard,
  TradeliaPrimaryButton,
  type TradeliaShape,
  TradeliaSignatureComponent,
  type TradeliaSize,
  type TradeliaTexture,
  type TradeliaVariant,
} from './TradeliaSignatureComponent';

// ============================================================================
// SIGNATURE COMPONENT EXAMPLE
// ============================================================================

export const SignatureComponentExample: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('variants');

  const variants: TradeliaVariant[] = ['primary', 'accent', 'secondary', 'premium', 'danger', 'ghost'];
  const sizes: TradeliaSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'hero'];
  const shapes: TradeliaShape[] = ['standard', 'pill', 'square', 'circle', 'diamond'];
  const textures: TradeliaTexture[] = ['smooth', 'grain', 'glass', 'metal', 'fabric'];
  const interactions: TradeliaInteraction[] = ['none', 'hover', 'press', 'signature', 'magnetic'];

  return (
    <div className="signature-component-example space-y-12 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Tradelia Signature Component
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
          Il componente signature che è istantaneamente riconoscibile come "Tradelia" -
          basato su ricerca 2026 per Visual Brand Language e signature forms.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: 'variants', label: 'Varianti', icon: <Star className="size-4" /> },
          { id: 'sizes', label: 'Dimensioni', icon: <TrendingUp className="size-4" /> },
          { id: 'shapes', label: 'Forme', icon: <Shield className="size-4" /> },
          { id: 'textures', label: 'Texture', icon: <Sparkles className="size-4" /> },
          { id: 'interactions', label: 'Interazioni', icon: <Zap className="size-4" /> },
          { id: 'presets', label: 'Preset', icon: <Crown className="size-4" /> },
        ].map(tab => (
          <TradeliaGhostAction
            key={tab.id}
            size="sm"
            onClick={() => setSelectedDemo(tab.id)}
            className={selectedDemo === tab.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
            icon={tab.icon}
          >
            {tab.label}
          </TradeliaGhostAction>
        ))}
      </div>

      {/* Demo Sections */}
      {selectedDemo === 'variants' && (
        <section className="space-y-6">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Varianti Signature
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {variants.map(variant => (
              <div key={variant} className="space-y-3 text-center">
                <TradeliaSignatureComponent
                  variant={variant}
                  size="lg"
                  texture="grain"
                  interaction="signature"
                  onSignatureMoment="lesson-complete"
                  className="w-full"
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </TradeliaSignatureComponent>
                <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  {variant}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDemo === 'sizes' && (
        <section className="space-y-6">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Dimensioni Signature
          </h3>
          <div className="flex flex-wrap items-end justify-center gap-4">
            {sizes.map(size => (
              <div key={size} className="space-y-2 text-center">
                <TradeliaSignatureComponent
                  variant="primary"
                  size={size}
                  texture="grain"
                  interaction="hover"
                  icon={<Target className="size-4" />}
                >
                  {size.toUpperCase()}
                </TradeliaSignatureComponent>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {size}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDemo === 'shapes' && (
        <section className="space-y-6">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Forme Signature
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {shapes.map(shape => (
              <div key={shape} className="space-y-3 text-center">
                <TradeliaSignatureComponent
                  variant="accent"
                  size="lg"
                  shape={shape}
                  texture="glass"
                  interaction="magnetic"
                  className="mx-auto"
                  icon={<Award className="size-5" />}
                >
                  {shape !== 'circle' && shape !== 'diamond' && shape !== 'square' ? shape : ''}
                </TradeliaSignatureComponent>
                <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  {shape}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDemo === 'textures' && (
        <section className="space-y-6">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Texture Signature
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {textures.map(texture => (
              <div key={texture} className="space-y-3 text-center">
                <TradeliaSignatureComponent
                  variant="secondary"
                  size="lg"
                  texture={texture}
                  interaction="hover"
                  className="h-24 w-full"
                  icon={<Sparkles className="size-5" />}
                >
                  {texture.charAt(0).toUpperCase() + texture.slice(1)}
                </TradeliaSignatureComponent>
                <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  {texture}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDemo === 'interactions' && (
        <section className="space-y-6">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Interazioni Signature
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {interactions.map(interaction => (
              <div key={interaction} className="space-y-3 text-center">
                <TradeliaSignatureComponent
                  variant="primary"
                  size="lg"
                  texture="grain"
                  interaction={interaction}
                  onSignatureMoment={interaction === 'signature' ? 'achievement-unlock' : undefined}
                  className="w-full"
                  icon={<Zap className="size-5" />}
                >
                  {interaction.charAt(0).toUpperCase() + interaction.slice(1)}
                </TradeliaSignatureComponent>
                <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  {interaction}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedDemo === 'presets' && (
        <section className="space-y-8">
          <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Componenti Preset
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Primary Button */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Primary Button</h4>
              <TradeliaPrimaryButton
                size="lg"
                icon={<BookOpen className="size-5" />}
                onSignatureMoment="lesson-complete"
              >
                Inizia Lezione
              </TradeliaPrimaryButton>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Azioni principali con signature moment
              </p>
            </div>

            {/* Accent Button */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Accent Button</h4>
              <TradeliaAccentButton
                size="lg"
                icon={<Heart className="size-5" />}
                badge="3"
                onSignatureMoment="streak-milestone"
              >
                Completa Streak
              </TradeliaAccentButton>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Successi e completamenti
              </p>
            </div>

            {/* Premium Card */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Premium Card</h4>
              <TradeliaPremiumCard
                size="lg"
                icon={<Crown className="size-5" />}
                className="h-20 w-full"
              >
                Premium Content
              </TradeliaPremiumCard>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contenuti premium con texture metal
              </p>
            </div>

            {/* Achievement Badge */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Achievement Badge</h4>
              <div className="flex justify-center">
                <TradeliaAchievementBadge
                  icon={<Award className="size-4" />}
                >
                  Master
                </TradeliaAchievementBadge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Badge achievement con forma diamond
              </p>
            </div>

            {/* Ghost Action */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Ghost Action</h4>
              <TradeliaGhostAction
                size="lg"
                icon={<Shield className="size-5" />}
              >
                Azione Secondaria
              </TradeliaGhostAction>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Azioni sottili e secondarie
              </p>
            </div>

            {/* Loading State */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Loading State</h4>
              <TradeliaSignatureComponent
                variant="primary"
                size="lg"
                texture="grain"
                loading
              >
                Caricamento...
              </TradeliaSignatureComponent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stato di caricamento integrato
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Real-world Examples */}
      <section className="space-y-6">
        <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Esempi Reali in Tradelia
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Learning Dashboard */}
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Learning Dashboard
            </h4>
            <div className="space-y-3">
              <TradeliaPrimaryButton
                size="md"
                icon={<BookOpen className="size-4" />}
                onSignatureMoment="lesson-complete"
                className="w-full"
              >
                Continua Lezione: Crypto Basics
              </TradeliaPrimaryButton>

              <div className="flex gap-2">
                <TradeliaAccentButton
                  size="sm"
                  icon={<Target className="size-4" />}
                  badge="7"
                  onSignatureMoment="streak-milestone"
                >
                  Streak
                </TradeliaAccentButton>

                <TradeliaAchievementBadge
                  icon={<Award className="size-4" />}
                >
                  Pro
                </TradeliaAchievementBadge>
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Trading Interface
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <TradeliaSignatureComponent
                  variant="accent"
                  size="md"
                  texture="glass"
                  interaction="signature"
                  onSignatureMoment="perfect-score"
                  className="flex-1"
                >
                  BUY
                </TradeliaSignatureComponent>

                <TradeliaSignatureComponent
                  variant="danger"
                  size="md"
                  texture="glass"
                  interaction="press"
                  className="flex-1"
                >
                  SELL
                </TradeliaSignatureComponent>
              </div>

              <TradeliaPremiumCard
                size="sm"
                icon={<Crown className="size-4" />}
                className="w-full"
              >
                Premium Analytics
              </TradeliaPremiumCard>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="space-y-6 rounded-xl bg-gray-50 p-8 dark:bg-gray-900">
        <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Caratteristiche Tecniche 2026
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
              <Shield className="size-5 text-blue-500" />
              Visual Brand Language
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Signature "Tradelia Notch" (angolo tagliato)</li>
              <li>• Micro-grain texture con highlight lines</li>
              <li>• Deep Blue + Emerald gradient system</li>
              <li>• Forme riconoscibili (diamond, pill, cut)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
              <Zap className="size-5 text-emerald-500" />
              Signature Interactions
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Elastic bounce con controlled imperfection</li>
              <li>• Magnetic attraction effects</li>
              <li>• Haptic-like visual feedback</li>
              <li>• Integration con signature moments</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
              <Sparkles className="size-5 text-amber-500" />
              Texture System
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Grain: Micro-texture con pattern signature</li>
              <li>• Glass: Morphism con signature blur</li>
              <li>• Metal: Animated shine per premium</li>
              <li>• Fabric: Soft texture per comfort</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
              <TrendingUp className="size-5 text-purple-500" />
              Performance & A11y
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• GPU acceleration per 60fps</li>
              <li>• Battery-aware optimizations</li>
              <li>• WCAG 2.1 AA compliant</li>
              <li>• Prefers-reduced-motion support</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignatureComponentExample;

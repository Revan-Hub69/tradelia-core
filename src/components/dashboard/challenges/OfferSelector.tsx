'use client';

/**
 * OFFER SELECTOR - Program Card Component
 *
 * Gestisce la selezione delle offer (account sizes) per un program.
 * Pattern: Select (desktop) → Bottom Sheet (mobile)
 *
 * Features:
 * - Desktop: Select dropdown
 * - Mobile: Bottom sheet con radio group
 * - Default selection: user preference > lowest fee > featured
 * - Mostra: size, fee, currency, refundable status
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import { ChevronDownIcon } from './PremiumIcons';

type Offer = {
  id: string;
  offer_name: string;
  account_size: number;
  account_currency: string;
  entry_fee: number | null;
  fee_currency: string | null;
  refundable: boolean;
  is_featured?: boolean;
  display_order: number;
};

type OfferSelectorProps = {
  offers: Offer[];
  selectedOfferId: string;
  onSelect: (offerId: string) => void;
  className?: string;
};

export function OfferSelector({
  offers,
  selectedOfferId,
  onSelect,
  className,
}: OfferSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleSelect = (offerId: string) => {
    onSelect(offerId);
    setIsOpen(false);
  };

  const formatSize = (size: number) => {
    if (size >= 1000) {
      return `$${(size / 1000).toFixed(0)}K`;
    }
    return `$${size.toLocaleString()}`;
  };

  const formatFee = (offer: Offer) => {
    if (offer.entry_fee === null || offer.entry_fee === 0) {
      return 'FREE';
    }
    return `${offer.fee_currency}${offer.entry_fee}`;
  };

  return (
    <>
      {/* Desktop: Select Dropdown */}
      <div className={cn('hidden lg:block', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-muted/50"
          type="button"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">
                {selectedOffer ? formatSize(selectedOffer.account_size) : 'Select offer'}
                {selectedOffer && (
                  <>
                    {' '}
                    <span className="text-muted-foreground">@</span>
                    {' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon
              size={16}
              className={cn(
                'shrink-0 text-muted-foreground transition-transform',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsOpen(false)}
                aria-label="Close offer selector"
                tabIndex={-1}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border/50 bg-background shadow-xl"
                role="listbox"
                style={{ transformOrigin: 'top center' }}
              >
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {offers.map(offer => (
                    <button
                      key={offer.id}
                      onClick={() => handleSelect(offer.id)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        offer.id === selectedOfferId
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted',
                      )}
                      type="button"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">
                          {formatSize(offer.account_size)}
                          {' '}
                          <span className="text-muted-foreground">@</span>
                          {' '}
                          {formatFee(offer)}
                        </div>
                        {offer.refundable && (
                          <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                            Refundable
                          </div>
                        )}
                      </div>
                      {offer.is_featured && (
                        <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Button + Bottom Sheet */}
      <div className={cn('lg:hidden', className)}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-left transition-all active:scale-[0.98]"
          type="button"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">
                {selectedOffer ? formatSize(selectedOffer.account_size) : 'Select offer'}
                {selectedOffer && (
                  <>
                    {' '}
                    <span className="text-muted-foreground">@</span>
                    {' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon size={16} className="shrink-0 text-muted-foreground" />
          </div>
        </button>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-hidden rounded-t-[32px] bg-background shadow-2xl"
              >
                {/* Handle */}
                <div className="flex justify-center py-3">
                  <div className="h-1 w-12 rounded-full bg-muted-foreground/20" />
                </div>

                {/* Header */}
                <div className="border-b border-border/50 px-6 pb-4">
                  <h3 className="text-lg font-bold">Select Account Size</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose your preferred account size
                  </p>
                </div>

                {/* Options */}
                <div className="max-h-[60vh] overflow-y-auto p-4">
                  <div className="space-y-2">
                    {offers.map(offer => (
                      <button
                        key={offer.id}
                        onClick={() => handleSelect(offer.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                          offer.id === selectedOfferId
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 active:scale-[0.98]',
                        )}
                        type="button"
                      >
                        {/* Radio */}
                        <div
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            offer.id === selectedOfferId
                              ? 'border-primary'
                              : 'border-muted-foreground/30',
                          )}
                        >
                          {offer.id === selectedOfferId && (
                            <div className="size-2.5 rounded-full bg-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {formatSize(offer.account_size)}
                            </span>
                            <span className="text-muted-foreground">@</span>
                            <span className="font-semibold">{formatFee(offer)}</span>
                            {offer.is_featured && (
                              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                                Popular
                              </span>
                            )}
                          </div>
                          {offer.refundable && (
                            <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                              ✓ Refundable on first payout
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

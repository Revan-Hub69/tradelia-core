'use client';

/**
 * OFFER SELECTOR - Tradelia Design System 2026 Edition
 *
 * Gestisce la selezione delle offer (account sizes) per un program.
 * Pattern: Select (desktop) → Bottom Sheet (mobile)
 *
 * Features:
 * - Desktop: Select dropdown con design Tradelia
 * - Mobile: Bottom sheet con radio group
 * - Default selection: user preference > lowest fee > featured
 * - Mostra: size, fee, currency, refundable status
 * - Palette: Blu e grigi-celesti Tradelia
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import { ChevronDownIcon } from '@/components/icons/unified';

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
  onSelectAction: (offerId: string) => void;
  className?: string;
};

export function OfferSelector({
  offers,
  selectedOfferId,
  onSelectAction,
  className,
}: OfferSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleSelect = (offerId: string) => {
    onSelectAction(offerId);
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
          className="group relative w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800"
          type="button"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedOffer ? formatSize(selectedOffer.account_size) : 'Select offer'}
                {selectedOffer && (
                  <>
                    {' '}
                    <span className="text-slate-400">@</span>
                    {' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 text-xs text-sky-600 dark:text-sky-400">
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon
              size={16}
              className={cn(
                'shrink-0 text-slate-400 transition-transform',
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
                className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
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
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                      type="button"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatSize(offer.account_size)}
                          {' '}
                          <span className="text-slate-400">@</span>
                          {' '}
                          {formatFee(offer)}
                        </div>
                        {offer.refundable && (
                          <div className="mt-0.5 text-xs text-sky-600 dark:text-sky-400">
                            Refundable
                          </div>
                        )}
                      </div>
                      {offer.is_featured && (
                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-all active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900"
          type="button"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedOffer ? formatSize(selectedOffer.account_size) : 'Select offer'}
                {selectedOffer && (
                  <>
                    {' '}
                    <span className="text-slate-400">@</span>
                    {' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 text-xs text-sky-600 dark:text-sky-400">
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon size={16} className="shrink-0 text-slate-400" />
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
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[101] max-h-[80vh] overflow-hidden rounded-t-[32px] bg-white shadow-2xl dark:bg-slate-900"
              >
                {/* Handle */}
                <div className="flex justify-center py-3">
                  <div className="h-1 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>

                {/* Header */}
                <div className="border-b border-slate-200 px-6 pb-4 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Select Account Size</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                            ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/30'
                            : 'border-slate-200 active:scale-[0.98] dark:border-slate-700',
                        )}
                        type="button"
                      >
                        {/* Radio */}
                        <div
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            offer.id === selectedOfferId
                              ? 'border-blue-500 dark:border-blue-400'
                              : 'border-slate-300 dark:border-slate-600',
                          )}
                        >
                          {offer.id === selectedOfferId && (
                            <div className="size-2.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatSize(offer.account_size)}
                            </span>
                            <span className="text-slate-400">@</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{formatFee(offer)}</span>
                            {offer.is_featured && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                Popular
                              </span>
                            )}
                          </div>
                          {offer.refundable && (
                            <div className="mt-1 text-xs text-sky-600 dark:text-sky-400">
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

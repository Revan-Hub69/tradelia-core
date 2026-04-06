'use client';

/**
 * OFFER SELECTOR - Tradelia Design System 2026
 * Single institutional accent, no Unicode symbols, no gradient
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

export function OfferSelector({ offers, selectedOfferId, onSelectAction, className }: OfferSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOffer = offers.find(o => o.id === selectedOfferId) || offers[0];

  const handleSelect = (offerId: string) => {
    onSelectAction(offerId);
    setIsOpen(false);
  };

  const formatSize = (size: number) => {
    if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`;
    return `$${size.toLocaleString()}`;
  };

  const formatFee = (offer: Offer) => {
    if (offer.entry_fee === null || offer.entry_fee === 0) return 'FREE';
    return `${offer.fee_currency}${offer.entry_fee}`;
  };

  return (
    <>
      {/* Desktop */}
      <div className={cn('hidden lg:block', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          type="button"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedOffer ? formatSize(selectedOffer.account_size) : 'Select offer'}
                {selectedOffer && (
                  <>
                    {' '}<span className="text-slate-400">@</span>{' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-[#1E7D4F] dark:text-[#5AB585]">
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon
              size={16}
              className={cn('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsOpen(false)}
                aria-label="Close offer selector"
                tabIndex={-1}
              />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/8 dark:border-slate-700 dark:bg-slate-900"
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
                          ? 'bg-[#EEF3FD] text-[#1B62E8] dark:bg-[#1B62E8]/10 dark:text-[#6B9FF5]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                      type="button"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatSize(offer.account_size)}{' '}
                          <span className="text-slate-400">@</span>{' '}
                          {formatFee(offer)}
                        </div>
                        {offer.refundable && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-[#1E7D4F] dark:text-[#5AB585]">
                            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Refundable
                          </div>
                        )}
                      </div>
                      {offer.is_featured && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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

      {/* Mobile */}
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
                    {' '}<span className="text-slate-400">@</span>{' '}
                    {formatFee(selectedOffer)}
                  </>
                )}
              </div>
              {selectedOffer?.refundable && (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-[#1E7D4F] dark:text-[#5AB585]">
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Refundable
                </div>
              )}
            </div>
            <ChevronDownIcon size={16} className="shrink-0 text-slate-400" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[101] max-h-[80vh] overflow-hidden rounded-t-[24px] bg-white shadow-2xl shadow-black/20 dark:bg-slate-900"
              >
                <div className="flex justify-center py-3">
                  <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="border-b border-slate-100 px-6 pb-4 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Select Account Size</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Choose your preferred account size</p>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-4">
                  <div className="space-y-2">
                    {offers.map(offer => (
                      <button
                        key={offer.id}
                        onClick={() => handleSelect(offer.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
                          offer.id === selectedOfferId
                            ? 'border-[#1B62E8]/30 bg-[#EEF3FD] dark:border-[#1B62E8]/30 dark:bg-[#1B62E8]/10'
                            : 'border-slate-200 active:scale-[0.98] dark:border-slate-700',
                        )}
                        type="button"
                      >
                        <div className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                          offer.id === selectedOfferId
                            ? 'border-[#1B62E8] bg-[#1B62E8]'
                            : 'border-slate-300 dark:border-slate-600',
                        )}>
                          {offer.id === selectedOfferId && (
                            <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatSize(offer.account_size)}
                            </span>
                            <span className="text-slate-400">@</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{formatFee(offer)}</span>
                            {offer.is_featured && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Popular
                              </span>
                            )}
                          </div>
                          {offer.refundable && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-[#1E7D4F] dark:text-[#5AB585]">
                              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                              Refundable on first payout
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

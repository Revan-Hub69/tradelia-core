'use client';

import { cn } from '@/utils/Helpers';

import { type AssetId, ASSETS } from '../data/assets';

type AssetSwitcherProps = {
  value: AssetId;
  onSelectAction: (id: AssetId) => void;
};

/**
 * AssetSwitcher: pills compatti nell'header del wizard per switchare
 * tra categorie asset. Gli asset non disponibili mostrano badge "Presto".
 */
export function AssetSwitcher({ value, onSelectAction }: AssetSwitcherProps) {
  return (
    <div className="scrollbar-none flex items-center gap-1 overflow-x-auto">
      {ASSETS.map((asset) => {
        const active = asset.id === value;
        const Icon = asset.icon;
        return (
          <button
            key={asset.id}
            type="button"
            onClick={() => asset.available && onSelectAction(asset.id)}
            disabled={!asset.available}
            className={cn(
              'group relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : asset.available
                  ? 'border border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  : 'cursor-not-allowed border border-border/40 bg-muted/30 text-muted-foreground/60',
            )}
            aria-pressed={active}
            aria-label={asset.available ? `Passa a ${asset.label}` : `${asset.label} — in arrivo`}
          >
            <Icon className={cn('size-3', active ? '' : asset.color)} />
            <span>{asset.label}</span>
            {!asset.available && (
              <span className="ml-0.5 rounded-full bg-primary/10 px-1 py-px text-[8px] font-semibold uppercase tracking-wider text-primary">
                Presto
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

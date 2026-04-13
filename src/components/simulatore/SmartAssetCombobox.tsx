'use client';

import React, {
  useState, useRef, useEffect, useId, useCallback,
} from 'react';

import { AssetOption, ALL_ASSETS, getAssetsByQuery, getPopularAssets } from '@/data/simulator/assets';

interface Props {
  value: string | null;
  onChange: (v: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showPopular?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function SmartAssetCombobox({
  value,
  onChange,
  placeholder = 'Cerca asset, azioni, crypto...',
  disabled = false,
  showPopular = true,
  loading = false,
  error = null,
}: Props) {
  const id           = useId();
  const listId       = `${id}-list`;
  const inputRef     = useRef<HTMLInputElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState(-1);
  const [popularAssets, setPopularAssets] = useState<AssetOption[]>([]);

  // Load popular assets on mount
  useEffect(() => {
    if (showPopular) {
      setPopularAssets(getPopularAssets(8));
    }
  }, [showPopular]);

  // Get all assets or search results
  const allAssets = ALL_ASSETS.map(asset => ({
    value: asset.id,
    label: asset.label,
    symbol: asset.symbol,
    category: asset.category
  }));

  // Opzioni filtrate
  const filtered = query.trim()
    ? getAssetsByQuery(query).map(asset => ({
        value: asset.id,
        label: asset.label,
        symbol: asset.symbol,
        category: asset.category
      }))
    : (showPopular ? popularAssets : allAssets);

  // Raggruppa per category
  const grouped = filtered.reduce<Record<string, AssetOption[]>>((acc, o) => {
    (acc[o.category] ??= []).push(o);
    return acc;
  }, {});

  // Lista flat degli asset filtrati (per keyboard nav)
  const flat = filtered.map(o => o.value);

  // Chiude se click fuori
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Scroll item attivo in view
  useEffect(() => {
    if (activeI < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-idx="${activeI}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeI]);

  const openDropdown = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    setActiveI(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveI(-1);
  }, []);

  const select = (v: string) => {
    onChange(v);
    close();
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault(); openDropdown();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveI(i => Math.min(i + 1, flat.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveI(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeI >= 0 && flat[activeI]) select(flat[activeI]!);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
    }
  };

  // Format category labels for display
  const categoryLabels: Record<string, string> = {
    forex: 'Forex',
    crypto: 'Criptovalute',
    equity: 'Azioni',
    index: 'Indici',
    commodity: 'Materie Prime'
  };

  return (
    <div
      ref={containerRef}
      className={`sim-combobox${
        open     ? ' sim-combobox--open'     : ''
      }${
        disabled ? ' sim-combobox--disabled' : ''
      }`}
      onKeyDown={onKeyDown}
    >
       {/* ── TRIGGER ── */}
       <button
         type="button"
         className={`sim-combobox__trigger${
           loading ? ' sim-combobox--loading' : ''
         }${
           error ? ' sim-combobox--error' : ''
         }`}
         aria-haspopup="listbox"
         aria-expanded={open}
         aria-controls={open ? listId : undefined}
         aria-label={value ? `Asset selezionato: ${value}` : placeholder}
         disabled={disabled || loading}
         onClick={() => open ? close() : openDropdown()}
       >
         {loading ? (
           <div className="sim-combobox__loading">
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sim-combobox__loading-spinner">
               <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
               <path d="M8 4v4a1 1 0 01-1 1H5a1 1 0 010-2h2V5a1 1 0 012 0v1a1 1 0 01-1 1H5a1 1 0 010-2h2V4z" fill="currentColor"/>
             </svg>
             <span className="sim-combobox__loading-text">Caricamento...</span>
           </div>
         ) : error ? (
           <div className="sim-combobox__error">
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sim-combobox__error-icon">
               <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.423.14c-1.287-.836-2.726.038-2.726.038l-.45 6.183a.27.27 0 00.098.217l6.498.438c.342.023.701-.094.944-.302l1.806-3.663a.27.27 0 00-.112-.29L8 2.748zM8 15C4.411 15 1 11.589 1 8s3.411-7 7-7 7 3.411 7 7-3.411 7-7 7zm0-10c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm0 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
             </svg>
             <span className="sim-combobox__error-text">{error}</span>
           </div>
         ) : open ? (
           <input
             ref={inputRef}
             className="sim-combobox__search"
             type="text"
             value={query}
             placeholder={placeholder}
             autoComplete="off"
             spellCheck={false}
             onChange={e => { setQuery(e.target.value); setActiveI(-1); }}
             onClick={e => e.stopPropagation()}
             aria-autocomplete="list"
             aria-controls={listId}
             aria-activedescendant={
               activeI >= 0 ? `${id}-opt-${activeI}` : undefined
             }
           />
         ) : (
           <span className={`sim-combobox__value${
             !value ? ' sim-combobox__value--placeholder' : ''
           }`}>
             {value ?? placeholder}
           </span>
         )}

        <span className="sim-combobox__actions" aria-hidden="true">
          {value && !open && (
            <span
              className="sim-combobox__clear"
              role="button"
              aria-label="Rimuovi selezione"
              tabIndex={-1}
              onMouseDown={clear}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          )}
          <span className={`sim-combobox__chevron${open ? ' sim-combobox__chevron--up' : ''}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 3.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </span>
      </button>

      {/* ── DROPDOWN ── */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Asset disponibili"
          className="sim-combobox__list"
        >
          {flat.length === 0 ? (
            <li className="sim-combobox__empty" role="presentation">
              Nessun asset trovato
            </li>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <React.Fragment key={category}>
                {Object.keys(grouped).length > 1 && (
                  <li className="sim-combobox__group-label" role="presentation">
                    {categoryLabels[category] || category}
                  </li>
                )}
                {items.map(item => {
                  const globalIdx = flat.indexOf(item.value);
                  return (
                    <li
                      key={item.value}
                      id={`${id}-opt-${globalIdx}`}
                      role="option"
                      data-idx={globalIdx}
                      aria-selected={value === item.value}
                      className={`sim-combobox__option${
                        value    === item.value     ? ' sim-combobox__option--selected' : ''
                      }${
                        activeI  === globalIdx ? ' sim-combobox__option--active'   : ''
                      }`}
                      onMouseEnter={() => setActiveI(globalIdx)}
                      onMouseDown={e => { e.preventDefault(); select(item.value); }}
                    >
                      <div className="sim-combobox__option-content">
                        <div className="sim-combobox__option-main">
                          <span className="sim-combobox__option-symbol">{item.symbol}</span>
                          <span className="sim-combobox__option-label">{item.label}</span>
                        </div>
                        <span className="sim-combobox__option-id">{item.value}</span>
                      </div>
                      {value === item.value && (
                        <svg className="sim-combobox__check" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </li>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
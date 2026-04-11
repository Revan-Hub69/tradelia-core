'use client';

import React, {
  useState, useRef, useEffect, useId, useCallback,
} from 'react';
import { createPortal } from 'react-dom';

export interface AssetOption {
  value: string;
  group: string;
}

interface Props {
  options: AssetOption[];
  value: string | null;
  onChange: (v: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AssetCombobox({
  options,
  value,
  onChange,
  placeholder = 'Cerca asset…',
  disabled = false,
}: Props) {
  const id           = useId();
  const listId       = `${id}-list`;
  const inputRef     = useRef<HTMLInputElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // isMounted: true solo dopo hydration lato client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState(-1);
  const [coords,  setCoords]  = useState({ top: 0, left: 0, width: 0 });

  const filtered = query.trim()
    ? options.filter(o =>
        o.value.toLowerCase().includes(query.toLowerCase()) ||
        o.group.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const grouped = filtered.reduce<Record<string, string[]>>((acc, o) => {
    (acc[o.group] ??= []).push(o.value);
    return acc;
  }, {});

  const flat = filtered.map(o => o.value);

  // Calcola coordinate dal trigger — senza scrollY perché il layout
  // usa height:100dvh overflow:hidden (scroll interno, non body)
  const calcCoords = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.bottom, left: r.left, width: r.width });
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!containerRef.current?.contains(t) && !listRef.current?.contains(t)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Scroll active item
  useEffect(() => {
    if (activeI < 0 || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-idx="${activeI}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeI]);

  // Reposition on scroll/resize mentre dropdown è aperto
  useEffect(() => {
    if (!open) return;
    calcCoords();
    window.addEventListener('scroll', calcCoords, true);
    window.addEventListener('resize', calcCoords);
    return () => {
      window.removeEventListener('scroll', calcCoords, true);
      window.removeEventListener('resize', calcCoords);
    };
  }, [open, calcCoords]);

  const close = useCallback(() => {
    setOpen(false); setQuery(''); setActiveI(-1);
  }, []);

  const openDropdown = () => {
    if (disabled) return;
    calcCoords();
    setOpen(true); setQuery(''); setActiveI(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const select = (v: string) => { onChange(v); close(); };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    onChange(null); close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault(); openDropdown();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActiveI(i => Math.min(i + 1, flat.length - 1)); break;
      case 'ArrowUp':   e.preventDefault(); setActiveI(i => Math.max(i - 1, 0)); break;
      case 'Enter':     e.preventDefault(); if (activeI >= 0 && flat[activeI]) select(flat[activeI]!); break;
      case 'Escape':    e.preventDefault(); close(); break;
      case 'Tab':       close(); break;
    }
  };

  const dropdown = (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      aria-label="Asset disponibili"
      className="sim-combobox__list"
      style={{
        position: 'fixed',         // fixed: relativo al viewport, ignora scroll
        top:   coords.top,
        left:  coords.left,
        width: coords.width,
        zIndex: 9999,
      }}
    >
      {flat.length === 0 ? (
        <li className="sim-combobox__empty" role="presentation">Nessun asset trovato</li>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <React.Fragment key={group}>
            {Object.keys(grouped).length > 1 && (
              <li className="sim-combobox__group-label" role="presentation">{group}</li>
            )}
            {items.map(item => {
              const idx = flat.indexOf(item);
              return (
                <li
                  key={item}
                  id={`${id}-opt-${idx}`}
                  role="option"
                  data-idx={idx}
                  aria-selected={value === item}
                  style={{ cursor: 'pointer' }}
                  className={[
                    'sim-combobox__option',
                    value   === item ? 'sim-combobox__option--selected' : '',
                    activeI === idx  ? 'sim-combobox__option--active'   : '',
                  ].filter(Boolean).join(' ')}
                  onMouseEnter={() => setActiveI(idx)}
                  onMouseDown={e => { e.preventDefault(); select(item); }}
                >
                  <span className="sim-combobox__option-text">{item}</span>
                  {value === item && (
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
  );

  return (
    <div
      ref={containerRef}
      className={[
        'sim-combobox',
        open     ? 'sim-combobox--open'     : '',
        disabled ? 'sim-combobox--disabled' : '',
      ].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
    >
      {/* TRIGGER */}
      <button
        ref={triggerRef}
        type="button"
        className="sim-combobox__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={value ? `Asset selezionato: ${value}` : placeholder}
        disabled={disabled}
        onClick={() => open ? close() : openDropdown()}
      >
        {open ? (
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
            aria-activedescendant={activeI >= 0 ? `${id}-opt-${activeI}` : undefined}
          />
        ) : (
          <span className={`sim-combobox__value${!value ? ' sim-combobox__value--placeholder' : ''}`}>
            {value ?? placeholder}
          </span>
        )}
        <span className={`sim-combobox__chevron${open ? ' sim-combobox__chevron--up' : ''}`} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 3.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* CLEAR: badge rosso top-right, position:absolute sul container */}
      {value && !open && (
        <button
          type="button"
          className="sim-combobox__clear"
          aria-label="Rimuovi selezione asset"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onMouseDown={clear}
          onClick={clear}
        >
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <path d="M1 1l5 5M6 1L1 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* PORTAL: montato solo dopo hydration lato client */}
      {open && isMounted && createPortal(dropdown, document.body)}
    </div>
  );
}

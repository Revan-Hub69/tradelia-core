'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Importato dinamicamente senza SSR:
// - non tocca mai il server
// - document.body disponibile garantito
// - nessun hydration mismatch
const ComboboxPortal = dynamic(
  () => import('./ComboboxPortal').then(m => m.ComboboxPortal),
  { ssr: false }
);

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
  options, value, onChange,
  placeholder = 'Cerca asset…',
  disabled = false,
}: Props) {
  const id         = useId();
  const inputRef   = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState(-1);
  const [coords,  setCoords]  = useState({ top: 0, left: 0, width: 0 });

  /* ── Filtered + grouped ───────────────────────────────────────── */
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

  /* ── Coords ────────────────────────────────────────────────────── */
  const calcCoords = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    // position:fixed → usa clientRect direttamente (viewport coords)
    setCoords({ top: r.bottom, left: r.left, width: r.width });
  }, []);

  /* ── Close on outside click ─────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      // Controlla sia il trigger che il portaled list (che è in body)
      const inTrigger = containerRef.current?.contains(t);
      const inList    = document.getElementById(`${id}-list`)?.contains(t);
      if (!inTrigger && !inList) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, id]);

  /* ── Reposition ────────────────────────────────────────────────────── */
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

  /* ── Handlers ──────────────────────────────────────────────────────── */
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
      {/* ── TRIGGER ── */}
      <button
        ref={triggerRef}
        type="button"
        className="sim-combobox__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
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
            aria-controls={`${id}-list`}
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

      {/* ── CLEAR badge rosso top-right ── */}
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

      {/* ── PORTAL DROPDOWN (solo client, ssr:false) ── */}
      {open && (
        <ComboboxPortal
          id={id}
          flat={flat}
          grouped={grouped}
          value={value}
          activeI={activeI}
          coords={coords}
          onSelect={select}
          onMouseEnter={setActiveI}
        />
      )}
    </div>
  );
}

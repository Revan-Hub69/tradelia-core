'use client';

import React, {
  useState, useRef, useEffect, useId, useCallback,
} from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState(-1);

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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (activeI < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(`[data-idx="${activeI}"]`);
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

  const select = (v: string) => { onChange(v); close(); };

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
      className={`sim-combobox${open ? ' sim-combobox--open' : ''}${disabled ? ' sim-combobox--disabled' : ''}`}
      onKeyDown={onKeyDown}
    >
      {/* TRIGGER */}
      <button
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

      {/* DROPDOWN — nel flow normale, senza portal */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Asset disponibili"
          className="sim-combobox__list"
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
                  const globalIdx = flat.indexOf(item);
                  return (
                    <li
                      key={item}
                      id={`${id}-opt-${globalIdx}`}
                      role="option"
                      data-idx={globalIdx}
                      aria-selected={value === item}
                      className={`sim-combobox__option${value === item ? ' sim-combobox__option--selected' : ''}${activeI === globalIdx ? ' sim-combobox__option--active' : ''}`}
                      onMouseEnter={() => setActiveI(globalIdx)}
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
      )}
    </div>
  );
}

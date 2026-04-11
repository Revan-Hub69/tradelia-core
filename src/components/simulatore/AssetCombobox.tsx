'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

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
  placeholder = 'Cerca asset\u2026',
  disabled = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState<number | null>(null);

  /* \u2500\u2500 Filtered + grouped \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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

  /* \u2500\u2500 Open/close \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  const openDropdown = () => {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    setActiveI(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveI(null);
  }, []);

  /* \u2500\u2500 Chiudi su click fuori \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, closeDropdown]);

  /* \u2500\u2500 Keyboard navigation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveI(i => i === null ? 0 : Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveI(i => i === null ? flat.length - 1 : Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeI !== null && flat[activeI]) select(flat[activeI]!);
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  };

  /* \u2500\u2500 Handlers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  const select = useCallback((v: string) => {
    onChange(v);
    closeDropdown();
  }, [onChange, closeDropdown]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(null);
    closeDropdown();
  };

  return (
    <div
      ref={containerRef}
      className={[
        'sim-combobox',
        open     ? 'sim-combobox--open'     : '',
        disabled ? 'sim-combobox--disabled' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* \u2500\u2500 TRIGGER \u2500\u2500 */}
      <button
        type="button"
        className="sim-combobox__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value ? `Asset selezionato: ${value}` : placeholder}
        disabled={disabled}
        onClick={open ? closeDropdown : openDropdown}
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
            onChange={e => { setQuery(e.target.value); setActiveI(null); }}
            onClick={e => e.stopPropagation()}
            onKeyDown={onKeyDown}
          />
        ) : (
          <span className={`sim-combobox__value${!value ? ' sim-combobox__value--placeholder' : ''}`}>
            {value ?? placeholder}
          </span>
        )}
        <span
          className={`sim-combobox__chevron${open ? ' sim-combobox__chevron--up' : ''}`}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 3.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* \u2500\u2500 CLEAR badge rosso \u2500\u2500 */}
      {value && !open && (
        <button
          type="button"
          className="sim-combobox__clear"
          aria-label="Rimuovi selezione asset"
          tabIndex={0}
          onMouseDown={clear}
          onClick={clear}
        >
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <path d="M1 1l5 5M6 1L1 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* \u2500\u2500 DROPDOWN inline (position:absolute) \u2500\u2500 */}
      {open && (
        <ul
          className="sim-combobox__list"
          role="listbox"
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
                      role="option"
                      aria-selected={value === item}
                      className={[
                        'sim-combobox__option',
                        value   === item ? 'sim-combobox__option--selected' : '',
                        activeI === idx  ? 'sim-combobox__option--active'   : '',
                      ].filter(Boolean).join(' ')}
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

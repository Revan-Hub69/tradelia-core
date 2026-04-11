'use client';

import React, { useId, useRef, useState, useCallback, useEffect } from 'react';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useListNavigation,
  FloatingPortal,
  FloatingFocusManager,
  offset,
  flip,
  size,
  autoUpdate,
} from '@floating-ui/react';

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
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<Array<HTMLElement | null>>([]);

  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [activeI, setActiveI] = useState<number | null>(null);

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

  /* ── Floating UI ───────────────────────────────────────────────── */
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (o) => {
      setOpen(o);
      if (!o) { setQuery(''); setActiveI(null); }
    },
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    middleware: [
      offset(2),
      flip({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  const click    = useClick(context, { enabled: !disabled });
  const dismiss  = useDismiss(context);
  const role     = useRole(context, { role: 'listbox' });
  const listNav  = useListNavigation(context, {
    listRef,
    activeIndex: activeI,
    onNavigate: setActiveI,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } =
    useInteractions([click, dismiss, role, listNav]);

  /* ── Open: focus search input ────────────────────────────────────── */
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  /* ── Handlers ────────────────────────────────────────────────────── */
  const select = useCallback((v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
    setActiveI(null);
  }, [onChange]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(null);
    setOpen(false);
    setQuery('');
    setActiveI(null);
  };

  return (
    <div
      className={[
        'sim-combobox',
        open     ? 'sim-combobox--open'     : '',
        disabled ? 'sim-combobox--disabled' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* ── TRIGGER ── */}
      <button
        ref={refs.setReference}
        type="button"
        className="sim-combobox__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value ? `Asset selezionato: ${value}` : placeholder}
        disabled={disabled}
        {...getReferenceProps()}
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
            onKeyDown={e => {
              if (e.key === 'Enter' && activeI !== null && flat[activeI]) {
                e.preventDefault();
                select(flat[activeI]!);
              }
              if (e.key === 'Escape') {
                setOpen(false); setQuery(''); setActiveI(null);
              }
            }}
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

      {/* ── CLEAR badge rosso — position:absolute top-right del container ── */}
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

      {/* ── DROPDOWN via FloatingPortal (renderizzato in body, position fixed) ── */}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={inputRef}>
            <ul
              ref={refs.setFloating}
              className="sim-combobox__list"
              style={floatingStyles}
              {...getFloatingProps()}
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
                          ref={el => { listRef.current[idx] = el; }}
                          role="option"
                          aria-selected={value === item}
                          tabIndex={activeI === idx ? 0 : -1}
                          className={[
                            'sim-combobox__option',
                            value   === item ? 'sim-combobox__option--selected' : '',
                            activeI === idx  ? 'sim-combobox__option--active'   : '',
                          ].filter(Boolean).join(' ')}
                          style={{ cursor: 'pointer' }}
                          {...getItemProps({
                            onClick: () => select(item),
                          })}
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
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}

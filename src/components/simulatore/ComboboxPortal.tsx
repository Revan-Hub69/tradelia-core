'use client';
// ComboboxPortal.tsx
// Importato con next/dynamic ssr:false — mai eseguito lato server.
// Monta il dropdown direttamente in document.body via createPortal.
// position:fixed = relativo al viewport, immune a overflow:hidden del panel.

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalDropdownProps {
  id: string;
  flat: string[];
  grouped: Record<string, string[]>;
  value: string | null;
  activeI: number;
  coords: { top: number; left: number; width: number };
  onSelect: (v: string) => void;
  onMouseEnter: (i: number) => void;
}

export function ComboboxPortal({
  id, flat, grouped, value, activeI, coords, onSelect, onMouseEnter,
}: PortalDropdownProps) {
  const ref = useRef<HTMLUListElement>(null);

  // Scroll active item into view
  useEffect(() => {
    if (activeI < 0 || !ref.current) return;
    ref.current
      .querySelector<HTMLElement>(`[data-idx="${activeI}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeI]);

  const list = (
    <ul
      ref={ref}
      id={`${id}-list`}
      role="listbox"
      aria-label="Asset disponibili"
      className="sim-combobox__list"
      style={{
        position: 'fixed',
        top:    coords.top,
        left:   coords.left,
        width:  coords.width,
        zIndex: 9999,
        margin: 0,
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
              const isActive   = activeI === idx;
              const isSelected = value   === item;
              return (
                <li
                  key={item}
                  id={`${id}-opt-${idx}`}
                  role="option"
                  data-idx={idx}
                  aria-selected={isSelected}
                  className={[
                    'sim-combobox__option',
                    isSelected ? 'sim-combobox__option--selected' : '',
                    isActive   ? 'sim-combobox__option--active'   : '',
                  ].filter(Boolean).join(' ')}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => onMouseEnter(idx)}
                  onMouseDown={e => { e.preventDefault(); onSelect(item); }}
                >
                  <span className="sim-combobox__option-text">{item}</span>
                  {isSelected && (
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

  return createPortal(list, document.body);
}

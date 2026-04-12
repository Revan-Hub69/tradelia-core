import { useRef, useCallback, useEffect } from 'react';

/**
 * Roving tabindex per un gruppo di opzioni (pattern WAI-ARIA radiogroup).
 *
 * Uso:
 *   const { getItemProps } = useRovingTabIndex(ids, selectedId, onChange);
 *   <div role="radiogroup" ...>
 *     {ids.map(id => <button {...getItemProps(id)} />)}
 *   </div>
 *
 * Tasti supportati:
 *   ArrowRight / ArrowDown  → prossimo
 *   ArrowLeft  / ArrowUp    → precedente
 *   Home                    → primo
 *   End                     → ultimo
 *   Space / Enter           → seleziona
 */
export function useRovingTabIndex<T extends string>(
  ids: T[],
  selected: T | null,
  onChange: (id: T) => void,
) {
  // ref map: id → HTMLElement
  const refs = useRef<Map<T, HTMLElement>>(new Map());

  // Quale id ha tabIndex=0: il selezionato, o il primo disponibile
  const focusableId = selected ?? ids[0] ?? null;

  const setRef = useCallback(
    (id: T) => (el: HTMLElement | null) => {
      if (el) refs.current.set(id, el);
      else refs.current.delete(id);
    },
    [],
  );

  const focusItem = useCallback((id: T) => {
    refs.current.get(id)?.focus();
  }, []);

  const getItemProps = useCallback(
    (id: T) => ({
      ref: setRef(id),
      role: 'radio' as const,
      'aria-checked': selected === id,
      tabIndex: id === focusableId ? 0 : -1,
      onKeyDown: (e: React.KeyboardEvent) => {
        const idx = ids.indexOf(id);
        if (idx === -1) return;

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown': {
            e.preventDefault();
            const next = ids[(idx + 1) % ids.length];
            onChange(next);
            // focus dopo re-render
            setTimeout(() => focusItem(next), 0);
            break;
          }
          case 'ArrowLeft':
          case 'ArrowUp': {
            e.preventDefault();
            const prev = ids[(idx - 1 + ids.length) % ids.length];
            onChange(prev);
            setTimeout(() => focusItem(prev), 0);
            break;
          }
          case 'Home': {
            e.preventDefault();
            const first = ids[0];
            onChange(first);
            setTimeout(() => focusItem(first), 0);
            break;
          }
          case 'End': {
            e.preventDefault();
            const last = ids[ids.length - 1];
            onChange(last);
            setTimeout(() => focusItem(last), 0);
            break;
          }
          case ' ':
          case 'Enter': {
            e.preventDefault();
            onChange(id);
            break;
          }
        }
      },
    }),
    [ids, selected, focusableId, onChange, setRef, focusItem],
  );

  return { getItemProps };
}

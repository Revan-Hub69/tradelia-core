import { useRef, useCallback } from 'react';

/**
 * WAI-ARIA roving tabindex per gruppi radio (chip group).
 *
 * - Il chip selezionato (o il primo se nessuno) ha tabIndex=0.
 * - Gli altri hanno tabIndex=-1.
 * - ArrowRight / ArrowDown → chip successivo (wraps).
 * - ArrowLeft  / ArrowUp   → chip precedente (wraps).
 * - Home → primo chip.
 * - End  → ultimo chip.
 * - Space / Enter → seleziona il chip focalizzato.
 *
 * Uso:
 *   const { getItemProps } = useRovingTabIndex(ids, value, onChange);
 *   <button {...getItemProps(id)} />
 */
export function useRovingTabIndex<T extends string>(
  items: T[],
  value: T | null,
  onChange: (v: T) => void,
) {
  // indice del chip che ha tabIndex=0 (focus "virtuale" nel gruppo)
  const focusIdx = useRef<number>(
    value ? Math.max(0, items.indexOf(value)) : 0,
  );

  // Sposta il focus reale al chip indicato dall'indice
  const focusItem = useCallback(
    (idx: number, groupEl: HTMLElement) => {
      focusIdx.current = idx;
      const chips = groupEl.querySelectorAll<HTMLElement>('[role="radio"]');
      chips[idx]?.focus();
    },
    [],
  );

  const getItemProps = useCallback(
    (id: T) => {
      const idx     = items.indexOf(id);
      const isValue = value === id;
      // tabIndex=0 sul selezionato oppure sul primo se nessuno è selezionato
      const isTabbable = value ? isValue : idx === 0;

      return {
        role:          'radio' as const,
        'aria-checked': isValue,
        tabIndex:       isTabbable ? 0 : -1,

        onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
          const group = e.currentTarget.closest<HTMLElement>('[role="radiogroup"]');
          if (!group) return;

          const len = items.length;
          let next  = idx;

          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
              e.preventDefault();
              next = (idx + 1) % len;
              break;
            case 'ArrowLeft':
            case 'ArrowUp':
              e.preventDefault();
              next = (idx - 1 + len) % len;
              break;
            case 'Home':
              e.preventDefault();
              next = 0;
              break;
            case 'End':
              e.preventDefault();
              next = len - 1;
              break;
            case ' ':
            case 'Enter':
              e.preventDefault();
              onChange(id);
              return;
            default:
              return;
          }

          focusItem(next, group);
          // Seleziona automaticamente mentre si naviga con le frecce
          // (comportamento standard radiogroup ARIA)
          onChange(items[next]);
        },

        onClick() {
          focusIdx.current = idx;
          onChange(id);
        },
      } as const;
    },
    [items, value, onChange, focusItem],
  );

  return { getItemProps };
}

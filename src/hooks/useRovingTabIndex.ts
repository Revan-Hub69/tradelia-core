import { useRef, useCallback } from 'react';

/**
 * WAI-ARIA roving tabindex per gruppi radio (chip group).
 *
 * - Il chip selezionato (o il primo se nessuno) ha tabIndex=0.
 * - Gli altri hanno tabIndex=-1.
 * - ArrowRight / ArrowDown → sposta focus al chip successivo (wraps).
 * - ArrowLeft  / ArrowUp   → sposta focus al chip precedente (wraps).
 * - Home → primo chip.  End → ultimo chip.
 * - Space / Enter → seleziona il chip focalizzato (chiama onChange).
 *
 * IMPORTANTE: le frecce spostano SOLO il focus, NON selezionano.
 * Questo evita che la navigazione triggeri il motore di calcolo
 * e faccia comparire sezioni intermedie mentre si scorre.
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
  const focusIdx = useRef<number>(
    value ? Math.max(0, items.indexOf(value)) : 0,
  );

  const focusItem = useCallback(
    (idx: number, groupEl: HTMLElement) => {
      focusIdx.current = idx;
      // Aggiorna tabIndex manualmente: 0 sul chip destinazione, -1 sugli altri
      const chips = groupEl.querySelectorAll<HTMLElement>('[role="radio"]');
      chips.forEach((chip, i) => {
        chip.tabIndex = i === idx ? 0 : -1;
      });
      chips[idx]?.focus();
    },
    [],
  );

  const getItemProps = useCallback(
    (id: T) => {
      const idx      = items.indexOf(id);
      const isValue  = value === id;
      const isTabbable = value ? isValue : idx === 0;

      return {
        role:           'radio' as const,
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
              focusItem(next, group);
              break;
            case 'ArrowLeft':
            case 'ArrowUp':
              e.preventDefault();
              next = (idx - 1 + len) % len;
              focusItem(next, group);
              break;
            case 'Home':
              e.preventDefault();
              focusItem(0, group);
              break;
            case 'End':
              e.preventDefault();
              focusItem(len - 1, group);
              break;
            case ' ':
            case 'Enter':
              e.preventDefault();
              onChange(id);
              break;
            default:
              break;
          }
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

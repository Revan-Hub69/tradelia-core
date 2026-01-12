/**
 * useRovingTabindex Hook - Tradelia 2026
 * 
 * Implements roving tabindex pattern for keyboard navigation in lists/grids.
 * Arrow keys move focus, only active item is in tab order.
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/roving-tabindex/
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseRovingTabindexOptions {
  /** Navigation orientation */
  orientation: 'horizontal' | 'vertical' | 'both'
  /** Loop around when reaching ends */
  loop?: boolean
  /** Initial active index */
  initialIndex?: number
  /** Callback when Enter or Space is pressed on an item */
  onSelect?: (index: number) => void
}

interface ItemProps<T extends HTMLElement> {
  ref: (el: T | null) => void
  tabIndex: number
  onKeyDown: (e: React.KeyboardEvent<T>) => void
  'data-roving-index': number
}

export function useRovingTabindex<T extends HTMLElement>(
  itemCount: number,
  options: UseRovingTabindexOptions
) {
  const { orientation, loop = true, initialIndex = 0, onSelect } = options
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const itemRefs = useRef<(T | null)[]>([])

  // Ensure refs array is correct size
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount)
  }, [itemCount])

  // Focus active item when index changes
  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex]
    if (activeItem && document.activeElement !== activeItem) {
      activeItem.focus()
    }
  }, [activeIndex])

  const moveFocus = useCallback((direction: 'next' | 'prev' | 'first' | 'last') => {
    setActiveIndex(current => {
      if (itemCount === 0) return current

      switch (direction) {
        case 'first':
          return 0
        case 'last':
          return itemCount - 1
        case 'next': {
          const next = current + 1
          if (next >= itemCount) {
            return loop ? 0 : current
          }
          return next
        }
        case 'prev': {
          const prev = current - 1
          if (prev < 0) {
            return loop ? itemCount - 1 : current
          }
          return prev
        }
        default:
          return current
      }
    })
  }, [itemCount, loop])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<T>, index: number) => {
    const isHorizontal = orientation === 'horizontal' || orientation === 'both'
    const isVertical = orientation === 'vertical' || orientation === 'both'

    let handled = false

    switch (e.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          moveFocus('next')
          handled = true
        }
        break
      case 'ArrowLeft':
        if (isHorizontal) {
          moveFocus('prev')
          handled = true
        }
        break
      case 'ArrowDown':
        if (isVertical) {
          moveFocus('next')
          handled = true
        }
        break
      case 'ArrowUp':
        if (isVertical) {
          moveFocus('prev')
          handled = true
        }
        break
      case 'Home':
        moveFocus('first')
        handled = true
        break
      case 'End':
        moveFocus('last')
        handled = true
        break
      case 'Enter':
      case ' ': // Space key
        if (onSelect) {
          onSelect(index)
          handled = true
        }
        break
    }

    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [orientation, moveFocus, onSelect])

  const getItemProps = useCallback((index: number, disabled = false): ItemProps<T> => ({
    ref: (el: T | null) => {
      itemRefs.current[index] = el
    },
    tabIndex: disabled ? -1 : (index === activeIndex ? 0 : -1),
    onKeyDown: (e: React.KeyboardEvent<T>) => {
      if (!disabled) {
        handleKeyDown(e, index)
      }
    },
    'data-roving-index': index,
  }), [activeIndex, handleKeyDown])

  const focusItem = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setActiveIndex(index)
    }
  }, [itemCount])

  return {
    activeIndex,
    setActiveIndex,
    getItemProps,
    focusItem,
    focusFirst: () => moveFocus('first'),
    focusLast: () => moveFocus('last'),
  }
}

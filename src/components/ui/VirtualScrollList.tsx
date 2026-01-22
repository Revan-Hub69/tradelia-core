/*
 * VIRTUAL SCROLL LIST - PHASE 3B IMPLEMENTATION
 * 
 * Tier 1 Research Implementation:
 * - @tanstack/react-virtual (TanStack Official)
 * - LogRocket Deep Dive patterns
 * - 60 FPS performance with unlimited data
 * - Dynamic heights with measurement
 * 
 * Expected Impact: 60 FPS scrolling, unlimited data support
 */

'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, forwardRef, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

// ✅ TIER 1: Virtual scroll props interface
export interface VirtualScrollItem {
  id: string;
  content: ReactNode;
  estimatedHeight?: number;
}

export interface VirtualScrollListProps {
  items: VirtualScrollItem[];
  height: number;
  estimateSize?: (index: number) => number;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  gap?: number;
}

// ✅ TIER 1: Virtual scroll implementation based on TanStack research
export const VirtualScrollList = forwardRef<HTMLDivElement, VirtualScrollListProps>(({
  items,
  height,
  estimateSize = () => 80, // Default estimate based on research
  overscan = 5, // Buffer items for smooth scrolling
  className,
  itemClassName,
  gap = 0,
}, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // ✅ TIER 1: TanStack Virtual configuration
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    // ✅ TIER 1: Dynamic height measurement for variable content
    measureElement: (element) => {
      if (!element) return estimateSize(0);
      return element.getBoundingClientRect().height;
    },
  });

  return (
    <div
      ref={ref}
      className={cn(
        // ✅ TIER 1: Required CSS for virtual scrolling
        'overflow-auto',
        className,
      )}
      style={{
        height: `${height}px`,
      }}
    >
      <div
        ref={parentRef}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) return null;

          return (
            <div
              key={item.id}
              data-index={virtualItem.index} // ✅ TIER 1: Required for measurement
              ref={rowVirtualizer.measureElement} // ✅ TIER 1: Required for measurement
              className={cn(
                // Base positioning styles
                'absolute top-0 left-0 w-full',
                itemClassName,
              )}
              style={{
                // ✅ TIER 1: Positioning with transform for performance
                transform: `translateY(${virtualItem.start + (gap * virtualItem.index)}px)`,
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualScrollList.displayName = 'VirtualScrollList';

// ✅ TIER 1: Hook for virtual scroll state management
export const useVirtualScrollState = (itemCount: number) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return {
    parentRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  };
};

// ✅ TIER 1: Performance optimized virtual list for large datasets
export interface VirtualListProps<T> {
  data: T[];
  height: number;
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualList<T extends { id: string }>({
  data,
  height,
  itemHeight,
  renderItem,
  className,
  onScroll,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: typeof itemHeight === 'function' ? itemHeight : () => itemHeight,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height: `${height}px` }}
      onScroll={(e) => {
        onScroll?.(e.currentTarget.scrollTop);
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = data[virtualItem.index];
          if (!item) return null;

          return (
            <div
              key={item.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
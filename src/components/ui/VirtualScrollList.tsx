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
import { forwardRef, type ReactNode, useRef } from 'react';

import { cn } from '@/utils/Helpers';

export type VirtualScrollItem = {
  id: string;
  content: ReactNode;
  estimatedHeight?: number;
};

export type VirtualScrollListProps = {
  items: VirtualScrollItem[];
  height: number;
  estimateSize?: (index: number) => number;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  gap?: number;
};

const defaultEstimateSize = () => 80;
const defaultOverscan = 5;

export const VirtualScrollList = forwardRef<HTMLDivElement, VirtualScrollListProps>(({
  items,
  height,
  estimateSize = defaultEstimateSize,
  overscan = defaultOverscan,
  className,
  itemClassName,
  gap = 0,
}, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    measureElement: (element) => {
      if (!element) {
        return estimateSize(0);
      }
      return element.getBoundingClientRect().height;
    },
  });

  return (
    <div
      ref={ref}
      className={cn('overflow-auto', className)}
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
          if (!item) {
            return null;
          }

          return (
            <div
              key={item.id}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              className={cn('absolute top-0 left-0 w-full', itemClassName)}
              style={{
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

export type VirtualListProps<T> = {
  data: T[];
  height: number;
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
};

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
          if (!item) {
            return null;
          }

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

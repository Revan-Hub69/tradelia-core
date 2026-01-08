/**
 * Card Grid Component - Tradelia 2026
 * 
 * Griglia di card con drag & drop e gestione stati
 * Segue i principi Tradelia 2026: funzionalità senza fronzoli
 */

import { forwardRef, useCallback } from 'react';
import { useRobustDragDrop } from '@/features/widget-reorder';
import { SummaryCard } from './SummaryCard';
import { DetailCard } from './DetailCard';
import { ActionCard } from './ActionCard';
import { WarningCard } from './WarningCard';
import { EducationalCard } from './EducationalCard';
import { cn } from '@/shared/ui/utils';
import type { CardData, SummaryCardData, DetailCardData, ActionCardData, WarningCardData, EducationalCardData } from '@/entities/card';

interface CardGridProps {
  cards: CardData[];
  onReorder?: (fromId: string, toId: string) => void;
  onCardAction?: (cardId: string, action: string, data?: any) => void;
  isDraggable?: boolean;
  className?: string;
}

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ 
    cards, 
    onReorder, 
    onCardAction,
    isDraggable = false,
    className 
  }, ref) => {
    
    const handleReorder = useCallback((fromId: string, toId: string) => {
      onReorder?.(fromId, toId);
    }, [onReorder]);

    const {
      dragState,
      handleDragStart,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
      handleDragEnd,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      isDraggedItem,
      isDropTarget
    } = useRobustDragDrop({
      onReorder: handleReorder,
      onDragStart: (id) => onCardAction?.(id, 'dragStart'),
      onDragEnd: () => onCardAction?.('', 'dragEnd')
    });

    const renderCard = (card: CardData) => {
      const baseProps = {
        key: card.id,
        data: card,
        isDraggable,
        onRetry: () => onCardAction?.(card.id, 'retry'),
        onToggleExpand: () => onCardAction?.(card.id, 'toggleExpand'),
        className: cn(
          // Drag & drop visual feedback
          isDraggedItem(card.id) && 'opacity-50 scale-105 z-10',
          isDropTarget(card.id) && 'ring-2 ring-primary/60 ring-offset-2',
          dragState.isDragging && !isDraggedItem(card.id) && 'transition-all duration-200'
        ),
        // Drag & drop event handlers
        ...(isDraggable && {
          draggable: true,
          onDragStart: (e: React.DragEvent) => handleDragStart(card.id, e),
          onDragOver: handleDragOver,
          onDragEnter: (e: React.DragEvent) => handleDragEnter(card.id, e),
          onDragLeave: handleDragLeave,
          onDrop: (e: React.DragEvent) => handleDrop(card.id, e),
          onDragEnd: handleDragEnd,
          onTouchStart: (e: React.TouchEvent) => handleTouchStart(card.id, e),
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd
        })
      };

      switch (card.type) {
        case 'summary':
          return <SummaryCard {...baseProps} data={card as SummaryCardData} />;
        case 'detail':
          return <DetailCard {...baseProps} data={card as DetailCardData} />;
        case 'action':
          return <ActionCard {...baseProps} data={card as ActionCardData} />;
        case 'warning':
          return <WarningCard {...baseProps} data={card as WarningCardData} />;
        case 'educational':
          return <EducationalCard {...baseProps} data={card as EducationalCardData} />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Grid responsive seguendo Tradelia 2026
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          // Auto-fit per card di dimensioni diverse
          'auto-rows-min',
          className
        )}
      >
        {cards.map(renderCard)}
      </div>
    );
  }
);

CardGrid.displayName = 'CardGrid';
/**
 * Card Grid Widget Types - Tradelia 2026
 */

import type { CardEntity } from '../../entities/card/types';

export interface CardGridWidgetProps {
  cards: CardEntity[];
  onCardReorder?: (cards: CardEntity[]) => void;
  onCardSelect?: (card: CardEntity) => void;
  className?: string;
  draggable?: boolean;
}

export interface CardGridConfig {
  columns: number;
  gap: number;
  cardMinHeight: number;
  cardMaxHeight: number;
  enableDragDrop: boolean;
}
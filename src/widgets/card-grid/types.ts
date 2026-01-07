/**
 * Card Grid Widget Types - Tradelia 2026
 */

import type { Card } from '../../entities/card/types';

export interface CardGridWidgetProps {
  cards: Card[];
  onCardReorder?: (cards: Card[]) => void;
  onCardSelect?: (card: Card) => void;
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
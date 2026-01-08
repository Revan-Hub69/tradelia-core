/**
 * Card Grid Widget Types - Tradelia 2026
 */

import type { CardData } from '../../entities/card/types';

export interface CardGridWidgetProps {
  cards: CardData[];
  onCardReorder?: (cards: CardData[]) => void;
  onCardSelect?: (card: CardData) => void;
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
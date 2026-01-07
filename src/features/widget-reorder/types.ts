/**
 * Widget Reorder Feature Types - Tradelia 2026
 */

export interface DragDropConfig {
  enabled: boolean;
  longPressDuration: number;
  hapticFeedback: boolean;
  visualFeedback: boolean;
}

export interface DragState {
  draggedItem: string | null;
  dropTarget: string | null;
  isDragging: boolean;
}

export interface TouchState {
  startY: number;
  startX: number;
  currentElement: HTMLElement | null;
  isLongPress: boolean;
  longPressTimer: NodeJS.Timeout | null;
}
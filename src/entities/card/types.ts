/**
 * Card Entity Types - Tradelia 2026
 * 
 * Definizioni di tipi per il sistema di card avanzato
 */

export type CardType = 'summary' | 'detail' | 'action' | 'warning' | 'educational';

export type DataFreshness = 'fresh' | 'stale' | 'offline' | 'error';

export interface BaseCardData {
  id: string;
  type: CardType;
  title: string;
  subtitle?: string;
  lastUpdated?: Date;
  dataSource?: string;
  freshness?: DataFreshness;
}

export interface BaseCardProps extends BaseCardData {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  isDraggable?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onReorder?: (fromId: string, toId: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface SummaryCardData extends BaseCardData {
  type: 'summary';
  value: string | number;
  change?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
  trend?: Array<{ date: string; value: number }>;
}

export interface DetailCardData extends BaseCardData {
  type: 'detail';
  sections: Array<{
    title: string;
    content: React.ReactNode;
  }>;
}

export interface ActionCardData extends BaseCardData {
  type: 'action';
  actions: Array<{
    id: string;
    label: string;
    variant: 'primary' | 'secondary' | 'outline';
    onClick: () => void;
    isLoading?: boolean;
  }>;
}

export interface WarningCardData extends BaseCardData {
  type: 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actions?: Array<{
    id: string;
    label: string;
    onClick: () => void;
  }>;
}

export interface EducationalCardData extends BaseCardData {
  type: 'educational';
  content: {
    summary: string;
    details?: string;
    links?: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  };
}

export type CardData = 
  | SummaryCardData 
  | DetailCardData 
  | ActionCardData 
  | WarningCardData 
  | EducationalCardData;

// Drag & Drop types
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
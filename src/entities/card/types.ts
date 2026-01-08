/**
 * Card Entity Types - Tradelia 2026
 */

export type CardType = 'summary' | 'detail' | 'action' | 'warning' | 'educational';

/**
 * CardEntity - Entità di business per le card della dashboard
 * Nota: Rinominato da "Card" per evitare conflitto con il componente UI Card
 */
export interface CardEntity {
  id: string;
  type: CardType;
  title: string;
  subtitle?: string;
  content: CardContent;
  metadata: CardMetadata;
  state: CardState;
  permissions: CardPermissions;
}

export interface CardContent {
  data: Record<string, any>;
  lastUpdated: Date;
  dataSource?: string;
  freshness: 'fresh' | 'stale' | 'unknown';
}

export interface CardMetadata {
  order: number;
  isVisible: boolean;
  isExpandable: boolean;
  isDraggable: boolean;
  size: 'small' | 'medium' | 'large';
  category: string;
  tags: string[];
}

export interface CardState {
  isLoading: boolean;
  isExpanded: boolean;
  isError: boolean;
  errorMessage?: string;
  retryCount: number;
  lastRetryAt?: Date;
}

export interface CardPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReorder: boolean;
}
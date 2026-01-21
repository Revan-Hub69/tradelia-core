/**
 * UI PRIMITIVES - Signature Primitives v1
 * 
 * Foundation layer per dashboard UI
 * 
 * REGOLE:
 * - Zero side effects globali
 * - Server-safe (tranne UiPanel che usa 'use client')
 * - Solo CSS + tokens
 * - Aria compliant
 */

export { UiSurface, type UiSurfaceProps, type UiSurfaceVariant } from './UiSurface';
export { UiButton, type UiButtonProps } from './UiButton';
export { UiIconButton, type UiIconButtonProps } from './UiIconButton';
export { UiNavItem, type UiNavItemProps } from './UiNavItem';
export { UiPanel, type UiPanelProps } from './UiPanel';
export { UiStatusChip, type UiStatusChipProps, type UiStatusChipVariant } from './UiStatusChip';

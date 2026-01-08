/**
 * Robust Drag & Drop Hook - Tradelia 2026
 * 
 * Hook per drag & drop con fallback touch per iOS Safari
 */

import { useState, useCallback, useRef } from 'react';
import type { DragState, TouchState } from '@/entities/card';

interface UseRobustDragDropProps {
  onReorder: (fromId: string, toId: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

export function useRobustDragDrop({ 
  onReorder, 
  onDragStart, 
  onDragEnd 
}: UseRobustDragDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggedItem: null,
    dropTarget: null,
    isDragging: false
  });
  
  const touchState = useRef<TouchState>({
    startY: 0,
    startX: 0,
    currentElement: null,
    isLongPress: false,
    longPressTimer: null
  });

  // HTML5 Drag & Drop (desktop)
  const handleDragStart = useCallback((id: string, event: React.DragEvent) => {
    setDragState(prev => ({ ...prev, draggedItem: id, isDragging: true }));
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
    onDragStart?.(id);
  }, [onDragStart]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((id: string, event: React.DragEvent) => {
    event.preventDefault();
    if (dragState.draggedItem && dragState.draggedItem !== id) {
      setDragState(prev => ({ ...prev, dropTarget: id }));
    }
  }, [dragState.draggedItem]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // Only clear drop target if we're leaving the card entirely
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragState(prev => ({ ...prev, dropTarget: null }));
    }
  }, []);

  const handleDrop = useCallback((id: string, event: React.DragEvent) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text/plain');
    
    if (draggedId && draggedId !== id) {
      onReorder(draggedId, id);
    }
    
    setDragState({
      draggedItem: null,
      dropTarget: null,
      isDragging: false
    });
    onDragEnd?.();
  }, [onReorder, onDragEnd]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedItem: null,
      dropTarget: null,
      isDragging: false
    });
    onDragEnd?.();
  }, [onDragEnd]);

  // Touch events (mobile fallback)
  const handleTouchStart = useCallback((id: string, event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    
    const element = event.currentTarget as HTMLElement;
    
    touchState.current = {
      startY: touch.clientY,
      startX: touch.clientX,
      currentElement: element,
      isLongPress: false,
      longPressTimer: setTimeout(() => {
        touchState.current.isLongPress = true;
        setDragState(prev => ({ ...prev, draggedItem: id, isDragging: true }));
        onDragStart?.(id);
        
        // Haptic feedback on supported devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        // Add visual feedback
        element.style.transform = 'scale(1.05)';
        element.style.zIndex = '1000';
        element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      }, 500) // 500ms long press
    };
  }, [onDragStart]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    
    if (!touchState.current.isLongPress) {
      // Check if we should cancel long press (user is scrolling)
      const deltaY = Math.abs(touch.clientY - touchState.current.startY);
      const deltaX = Math.abs(touch.clientX - touchState.current.startX);
      
      if (deltaY > 10 || deltaX > 10) {
        if (touchState.current.longPressTimer) {
          clearTimeout(touchState.current.longPressTimer);
          touchState.current.longPressTimer = null;
        }
      }
      return;
    }
    
    event.preventDefault();
    
    // Move the dragged element
    if (touchState.current.currentElement) {
      touchState.current.currentElement.style.position = 'fixed';
      touchState.current.currentElement.style.left = `${touch.clientX - 50}px`;
      touchState.current.currentElement.style.top = `${touch.clientY - 50}px`;
      touchState.current.currentElement.style.pointerEvents = 'none';
    }
    
    // Find element below touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = elementBelow?.closest('[data-card-id]') as HTMLElement;
    
    if (cardElement) {
      const targetId = cardElement.dataset.cardId;
      if (targetId && targetId !== dragState.draggedItem) {
        setDragState(prev => ({ ...prev, dropTarget: targetId }));
      }
    }
  }, [dragState.draggedItem]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
    }
    
    // Reset element styles
    if (touchState.current.currentElement) {
      touchState.current.currentElement.style.transform = '';
      touchState.current.currentElement.style.zIndex = '';
      touchState.current.currentElement.style.boxShadow = '';
      touchState.current.currentElement.style.position = '';
      touchState.current.currentElement.style.left = '';
      touchState.current.currentElement.style.top = '';
      touchState.current.currentElement.style.pointerEvents = '';
    }
    
    // Execute reorder if valid
    if (touchState.current.isLongPress && dragState.draggedItem && dragState.dropTarget) {
      onReorder(dragState.draggedItem, dragState.dropTarget);
    }
    
    // Reset state
    setDragState({
      draggedItem: null,
      dropTarget: null,
      isDragging: false
    });
    
    touchState.current = {
      startY: 0,
      startX: 0,
      currentElement: null,
      isLongPress: false,
      longPressTimer: null
    };
    
    onDragEnd?.();
  }, [dragState.draggedItem, dragState.dropTarget, onReorder, onDragEnd]);

  return {
    dragState,
    // HTML5 Drag & Drop handlers
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    // State helpers
    isDragging: dragState.isDragging,
    isDraggedItem: (id: string) => dragState.draggedItem === id,
    isDropTarget: (id: string) => dragState.dropTarget === id
  };
}
'use client';

import { useEffect, useRef } from 'react';

interface UseFadeInObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook riutilizzabile per animazioni fade-in con IntersectionObserver
 * Best practices: cleanup automatico, performance ottimizzata
 */
export function useFadeInObserver(options: UseFadeInObserverOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Cleanup precedente observer se esiste
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions: IntersectionObserverInit = {
      threshold,
      rootMargin
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Se triggerOnce è true, smetti di osservare questo elemento
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          // Se triggerOnce è false, rimuovi la classe quando esce dal viewport
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);

    // Osserva tutti gli elementi con classe fade-in-section
    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  // Funzione per osservare manualmente un elemento
  const observeElement = (element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  // Funzione per smettere di osservare un elemento
  const unobserveElement = (element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  };

  return {
    observeElement,
    unobserveElement
  };
}
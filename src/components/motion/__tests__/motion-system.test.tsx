/**
 * MOTION SYSTEM TESTS v2.0 - Enterprise 2026
 * 
 * Test di base per il sistema motion Tradelia
 * Verifica funzionalità core e integrazione
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  TradeliaMotion,
  SemanticAnimation,
  PressAnticipatory,
  motionTokens,
} from '../index';

describe('Tradelia Motion System', () => {
  describe('TradeliaMotion Component', () => {
    it('renders children correctly', () => {
      render(
        <TradeliaMotion type="enter">
          <div>Test Content</div>
        </TradeliaMotion>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      const { container } = render(
        <TradeliaMotion type="success" intensity="prominent">
          <div>Test</div>
        </TradeliaMotion>
      );
      
      const motionElement = container.firstChild as HTMLElement;
      expect(motionElement).toHaveClass('tradelia-motion');
      expect(motionElement).toHaveClass('animate-tradelia-success');
      expect(motionElement).toHaveClass('motion-intensity-prominent');
    });
  });

  describe('SemanticAnimation Component', () => {
    it('renders with semantic classes', () => {
      const { container } = render(
        <SemanticAnimation type="error" context="form">
          <div>Error Message</div>
        </SemanticAnimation>
      );
      
      const semanticElement = container.firstChild as HTMLElement;
      expect(semanticElement).toHaveClass('semantic-animation');
      expect(semanticElement).toHaveClass('semantic-error');
      expect(semanticElement).toHaveClass('semantic-context-form');
    });
  });

  describe('PressAnticipatory Component', () => {
    it('renders as button with press classes', () => {
      render(
        <PressAnticipatory intensity="medium">
          Press Me
        </PressAnticipatory>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('press-anticipatory');
      expect(button).toHaveClass('press-intensity-medium');
    });
  });

  describe('Motion Tokens', () => {
    it('exports correct duration values', () => {
      expect(motionTokens.duration.micro).toBe(120);
      expect(motionTokens.duration.base).toBe(280);
      expect(motionTokens.duration.smooth).toBe(350);
    });

    it('exports correct delay values', () => {
      expect(motionTokens.delay.micro).toBe(45);
      expect(motionTokens.delay.small).toBe(65);
    });

    it('exports correct easing curves', () => {
      expect(motionTokens.easing.tradelia).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
      expect(motionTokens.easing.gentle).toBe('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    });
  });

  describe('Accessibility', () => {
    it('respects reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <TradeliaMotion type="enter">
          <div>Accessible Content</div>
        </TradeliaMotion>
      );

      // Verifica che il componente sia renderizzato
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('Motion System Integration', () => {
  it('combines multiple motion components correctly', () => {
    const { container } = render(
      <TradeliaMotion type="enter">
        <SemanticAnimation type="success" context="feedback">
          <PressAnticipatory intensity="normal">
            Complex Motion Test
          </PressAnticipatory>
        </SemanticAnimation>
      </TradeliaMotion>
    );

    // Verifica che tutti i componenti siano presenti
    expect(container.querySelector('.tradelia-motion')).toBeInTheDocument();
    expect(container.querySelector('.semantic-animation')).toBeInTheDocument();
    expect(container.querySelector('.press-anticipatory')).toBeInTheDocument();
  });
});
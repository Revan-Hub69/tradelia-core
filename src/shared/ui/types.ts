/**
 * Shared UI Types - Tradelia 2026
 * 
 * Definizioni di tipi per i componenti UI condivisi
 */

import type React from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string | undefined;
  children?: React.ReactNode;
}

// Button component types
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

// Input component types
export interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

// Card component types
export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary';
  interactive?: boolean;
  loading?: boolean;
}

// Badge component types
export interface BadgeProps 
  extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default';
}

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Accessibility types
export interface A11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: string;
}
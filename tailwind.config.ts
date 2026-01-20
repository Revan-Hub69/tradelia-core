/* eslint-disable ts/no-require-imports */
import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Tradelia semantic colors
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Spacing scale 4px base (già default Tailwind, ma esplicito)
      spacing: {
        '4.5': '1.125rem', // 18px
        '13': '3.25rem',   // 52px
        '15': '3.75rem',   // 60px
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
      },
      // Font sizes con line-height ottimizzato
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Animazione XP gain (usare solo in Fase F)
        'xp-pop': {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'xp-pop': 'xp-pop 0.3s ease-out',
      },
      // Tradelia signature utilities
      utilities: {
        '.shape-tradelia-pill': {
          'border-radius': '24px',
          'position': 'relative',
        },
        '.shape-tradelia-notch': {
          'border-radius': '16px',
          'clip-path': 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
        },
        '.shape-tradelia-cut': {
          'border-radius': '12px',
          'position': 'relative',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'top': '-1px',
            'right': '-1px',
            'width': '8px',
            'height': '8px',
            'background': 'var(--background)',
            'clip-path': 'polygon(0 0, 100% 100%, 0 100%)',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Add signature utilities plugin
    function({ addUtilities }) {
      addUtilities({
        '.weight-primary': {
          'background': 'var(--weight-primary-bg)',
          'border': 'var(--weight-primary-border)',
          'box-shadow': 'var(--weight-primary-shadow)',
        },
        '.weight-secondary': {
          'background': 'var(--weight-secondary-bg)',
          'border': 'var(--weight-secondary-border)',
          'box-shadow': 'var(--weight-secondary-shadow)',
        },
        '.weight-tertiary': {
          'background': 'var(--weight-tertiary-bg)',
          'border': 'var(--weight-tertiary-border)',
          'box-shadow': 'var(--weight-tertiary-shadow)',
        },
        '.glass-tradelia': {
          'background': 'var(--glass-tradelia-bg)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          'border': '1px solid var(--glass-tradelia-border)',
          'background-image': 'var(--texture-grain)',
          'background-size': 'var(--texture-size)',
          'box-shadow': 'inset 0 1px 0 var(--glass-tradelia-highlight), var(--glass-tradelia-shadow)',
        },
      });
    },
  ],
} satisfies Config;

export default config;

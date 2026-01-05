import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        logo: "hsl(var(--logo))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
          glass: "hsl(var(--surface-glass))",
        },
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        snug: "-0.015em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        'extra-tight': '1.1',
        'tight': '1.2',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.6',
        'loose': '1.8',
      },
      maxWidth: {
        "2xl": "672px",
        "content": "65ch",
        "prose": "75ch",
      },
      fontSize: {
        // Display sizes - Ultra premium
        "6xl": ["4rem", { lineHeight: "1.05", letterSpacing: "-0.05em", fontWeight: "700" }],      // 64px Display
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],      // 48px H1
        "4xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "600" }],  // 36px H2
        "3xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }], // 30px H3
        "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "500" }],   // 24px H4
        "xl": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "500" }],   // 20px H5
        // Body sizes - Ottimizzati per leggibilità
        "lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "0em" }],  // 18px Large body
        "base": ["1rem", { lineHeight: "1.6", letterSpacing: "0em" }],    // 16px Body
        "sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],  // 14px Small
        "xs": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.025em" }],   // 12px Caption
        "2xs": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.05em" }], // 11px Micro
      },
      spacing: {
        // Micro spacing - Precisione premium
        "0.5": "0.125rem",  // 2px
        "1.5": "0.375rem",  // 6px
        "2.5": "0.625rem",  // 10px
        "3.5": "0.875rem",  // 14px
        "4.5": "1.125rem",  // 18px
        "5.5": "1.375rem",  // 22px
        "6.5": "1.625rem",  // 26px
        "7.5": "1.875rem",  // 30px
        // Section spacing premium
        "12": "3rem",   // section-sm py-12
        "16": "4rem",   // section-sm sm:py-16
        "18": "4.5rem",  // section-md py-18
        "20": "5rem",   // section-lg py-20
        "24": "6rem",   // section-md sm:py-24
        "28": "7rem",   // section-xl py-28
        "32": "8rem",   // section-lg sm:py-32
        "36": "9rem",   // section-xl sm:py-36
        "40": "10rem",  // section-2xl py-40
        "44": "11rem",  // section-2xl sm:py-44
        "48": "12rem",  // section-3xl py-48
        // Header height premium
        "14": "3.5rem", // 56px header height
        "15": "3.75rem", // 60px premium header
        "17": "4.25rem", // 68px large header
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-down': 'fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(var(--primary) / 0.5)' },
          '100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.8), 0 0 30px hsl(var(--primary) / 0.4)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionDuration: {
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "300": "300ms",
        "500": "500ms",
        "700": "700ms",
        "1000": "1000ms",
      },
      transitionTimingFunction: {
        'subtle': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.6, 1)',
        'bounce-subtle': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      borderRadius: {
        'none': '0px',
        'sm': '0.25rem',   // 4px
        DEFAULT: '0.375rem', // 6px default radius
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
        'full': '9999px',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(var(--primary) / 0.3)',
        'glow-lg': '0 0 40px rgb(var(--primary) / 0.4)',
        'premium': '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      minHeight: {
        "44": "2.75rem", // 44px minimum touch target
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Breakpoint per print
        'print': { 'raw': 'print' },
        // Breakpoint per reduced motion
        'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
        'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
      },
    },
  },
  plugins: [],
};

export default config;
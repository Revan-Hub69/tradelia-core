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
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
      },
      letterSpacing: {
        tight: "-0.02em",
        snug: "-0.01em",
      },
      maxWidth: {
        "2xl": "672px",
      },
      fontSize: {
        // Headline sizes
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],      // 48px H1
        "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],  // 36px H2
        "3xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }], // 30px H3
        "2xl": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],   // 24px
        "xl": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],   // 20px
        // Body sizes
        "lg": ["1.125rem", { lineHeight: "1.5" }],  // 18px
        "base": ["1rem", { lineHeight: "1.6" }],    // 16px
        "sm": ["0.875rem", { lineHeight: "1.5" }],  // 14px
        "xs": ["0.75rem", { lineHeight: "1.4" }],   // 12px
      },
      spacing: {
        // Section spacing dalle linee guida
        "12": "3rem",   // section-sm py-12
        "16": "4rem",   // section-sm sm:py-16
        "20": "5rem",   // section-lg py-20
        "24": "6rem",   // section-md sm:py-24
        "32": "8rem",   // section-lg sm:py-32
        // Header height
        "14": "3.5rem", // 56px header height
      },
      transitionDuration: {
        "150": "150ms",
      },
      transitionTimingFunction: {
        subtle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      borderRadius: {
        DEFAULT: "0.375rem", // 6px default radius
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
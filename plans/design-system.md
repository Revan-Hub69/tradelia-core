# Tradelia Design System 2026

## Overview
Tradelia is an innovative, refined, and reliable educational platform that helps newcomers to crypto avoid common mistakes by verifying coherence between investment goals and financial instruments. The design system emphasizes trust, clarity, safety, and user education.

## Core Principles
- **Education**: Clear, informative design that helps users understand crypto risks
- **Safety**: Emphasize caution and coherence over excitement
- **Neutrality**: Avoid hype, focus on objective analysis
- **Trust**: Build confidence through transparency and reliability
- **Simplicity**: Reduce cognitive load for newcomers
- **Responsiveness**: Accessible on all devices
- **Accessibility**: Inclusive design for diverse users

## Color Palette

### Primary Colors (HSL)
- **Background**: `hsl(220 15% 8%)` (Dark mode default)
- **Foreground**: `hsl(220 10% 95%)`
- **Primary**: `hsl(210 30% 65%)` - Trustworthy blue
- **Success**: `hsl(142 76% 36%)` - Coherent/positive
- **Warning**: `hsl(38 92% 50%)` - Needs attention
- **Error**: `hsl(0 84% 60%)` - Incoherent/high risk
- **Muted**: `hsl(220 15% 15%)`
- **Border**: `hsl(220 15% 20%)`

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, hsl(210 30% 65%) 0%, hsl(220 25% 55%) 100%)`
- **Background Gradient**: `radial-gradient(circle at top, hsl(220 20% 12%) 0%, hsl(220 15% 8%) 100%)`
- **Card Gradient**: `linear-gradient(145deg, hsl(220 15% 12%) 0%, hsl(220 15% 10%) 100%)`

### Light Mode (Alternative)
- **Background**: `hsl(0 0% 99%)`
- **Foreground**: `hsl(220 15% 12%)`
- **Primary**: `hsl(210 25% 55%)`

## Typography

### Font Family
- **Primary**: Inter (Google Fonts) - Modern, highly legible
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes & Line Heights
- **H1**: 48px / 1.1 (3rem)
- **H2**: 36px / 1.2 (2.25rem)
- **H3**: 24px / 1.3 (1.5rem)
- **Body Large**: 18px / 1.5 (1.125rem)
- **Body**: 16px / 1.6 (1rem)
- **Body Small**: 14px / 1.5 (0.875rem)
- **Caption**: 12px / 1.4 (0.75rem)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing System

### Section Spacing
- **Small**: 48px (3rem)
- **Medium**: 64px (4rem)
- **Large**: 96px (6rem)
- **Extra Large**: 128px (8rem)

### Component Spacing
- **Tight**: 8px (0.5rem)
- **Normal**: 16px (1rem)
- **Loose**: 24px (1.5rem)
- **Extra Loose**: 32px (2rem)

## Components

### Buttons
- **Primary**: Gradient background, white text, rounded corners (6px), shadow
- **Secondary**: Outlined, primary color border
- **Ghost**: Transparent background, hover effects
- **States**: Hover (brightness +10%), Active (scale 0.98), Disabled (opacity 0.5)

### Cards
- **Background**: Subtle gradient or solid dark
- **Border**: 1px border-border
- **Shadow**: Soft shadow on hover
- **Radius**: 8px
- **Padding**: 24px

### Forms
- **Inputs**: Dark background, border on focus
- **Labels**: Above inputs, muted color
- **Validation**: Green check, red X icons

### Navigation
- **Header**: Sticky, blurred background (backdrop-blur)
- **Links**: Smooth transitions, underline on hover
- **Active State**: Primary color

## Animations & Effects

### Micro-interactions
- **Hover**: Scale 1.02, brightness +5%
- **Click**: Scale 0.98, ripple effect
- **Focus**: Glow effect with primary color

### Page Transitions
- **Fade In**: Opacity 0 to 1, translateY 20px to 0
- **Stagger**: Elements appear sequentially

### Loading States
- **Skeleton**: Pulsing background
- **Spinner**: Smooth rotation with easing

### Advanced Effects
- **Glassmorphism**: Backdrop blur, semi-transparent backgrounds
- **Parallax**: Subtle background movement on scroll
- **Particles**: Floating elements for hero sections

## Backgrounds & Textures

### Patterns
- **Subtle Grid**: 1px lines, very low opacity
- **Dot Matrix**: Small dots for texture
- **Geometric**: Hexagons or triangles for modern feel

### Images
- **Hero Background**: Educational illustrations showing coherence concepts
- **Icons**: Clear, understandable icons for financial concepts
- **Diagrams**: Simple charts and graphs for explanations

## Responsiveness

### Breakpoints
- **Mobile**: 0-639px
- **Tablet**: 640-1023px
- **Desktop**: 1024px+

### Layout Adjustments
- **Mobile**: Single column, stacked navigation
- **Tablet**: Two columns where appropriate
- **Desktop**: Full layout with sidebars if needed

### Touch Targets
- **Minimum**: 44px height
- **Comfortable**: 48px+

## Security & Trust Signals

### Visual Cues
- **SSL Badge**: Lock icon in footer
- **Trust Indicators**: "Secure", "Encrypted" badges
- **Compliance**: Regulatory mentions

### Color Psychology
- **Green**: Coherent, safe choices
- **Orange**: Warning, review needed
- **Red**: Incoherent, high risk
- **Blue**: Trust, reliability, education

## Implementation Guidelines

### CSS Architecture
- **Tailwind**: Utility-first with custom components
- **CSS Variables**: For theming
- **Dark Mode**: Class-based switching

### Performance
- **Optimize Animations**: Use transform and opacity
- **Lazy Loading**: Images and components
- **Bundle Splitting**: Code splitting for routes

### Accessibility
- **Contrast Ratio**: 4.5:1 minimum
- **Focus Indicators**: Visible focus rings
- **Screen Readers**: Proper ARIA labels
- **Reduced Motion**: Respect user preferences

## Brand Assets

### Logo
- **Primary**: Tradelia wordmark with geometric icon
- **Icon**: Scalable SVG with primary color
- **Variations**: Light and dark versions

### Icons
- **Style**: Outline, 1.5px stroke
- **Set**: Custom icons for trading, security, verification

This design system provides a foundation for building a world-class crypto platform that balances innovation with reliability.
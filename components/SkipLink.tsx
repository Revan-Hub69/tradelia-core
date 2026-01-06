/**
 * Skip Link Component
 * Allows keyboard users to skip navigation and jump to main content
 * WCAG 2.4.1 - Bypass Blocks (Level A)
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Vai al contenuto principale
    </a>
  );
}

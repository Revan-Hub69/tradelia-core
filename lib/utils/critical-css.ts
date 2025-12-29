// Critical CSS utilities for above-the-fold content
export const criticalCSS = `
  /* Critical styles for above-the-fold content */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .heading-hero {
    font-size: clamp(2.25rem, 1.9rem + 1.75vw, 2.75rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .text-body-large {
    font-size: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }
  
  /* Reduce layout shift */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export function injectCriticalCSS() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }
}
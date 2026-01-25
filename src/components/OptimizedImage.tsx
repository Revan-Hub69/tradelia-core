/**
 * OptimizedImage Component - Performance P0
 *
 * Wrapper around next/image with performance best practices:
 * - Automatic sizes attribute
 * - Lazy loading by default (priority for above-fold)
 * - Aspect ratio preservation (prevents CLS)
 * - Blur placeholder support
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 *   priority // For LCP image
 * />
 * ```
 */

import Image, { type ImageProps } from 'next/image';

type OptimizedImageProps = ImageProps & {
  /**
   * Whether this is the LCP (Largest Contentful Paint) image
   * Sets priority and optimizes loading
   */
  isLCP?: boolean;
};

export const OptimizedImage = ({
  isLCP = false,
  priority,
  sizes,
  ...props
}: OptimizedImageProps) => {
  // Auto-generate sizes if not provided
  const autoSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  return (
    <Image
      {...props}
      priority={isLCP || priority}
      sizes={autoSizes}
      // Prevent layout shift with aspect ratio
      style={{
        ...props.style,
        width: '100%',
        height: 'auto',
      }}
    />
  );
};

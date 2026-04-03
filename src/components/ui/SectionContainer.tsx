import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/Helpers';

type SectionContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'content' | 'wide';
};

const sizeClasses = {
  content: 'max-w-4xl xl:max-w-5xl 2xl:max-w-6xl',
  wide: 'max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem]',
} as const;

export const SectionContainer = ({
  size = 'wide',
  className,
  ...props
}: SectionContainerProps) => (
  <div
    className={cn(
      'mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-10',
      sizeClasses[size],
      className,
    )}
    {...props}
  />
);

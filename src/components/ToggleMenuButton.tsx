import { type ForwardedRef, forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/Helpers';

/**
 * Hamburger menu toggle button with animated transition to X
 */
const ToggleMenuButtonInternal = (
  props: {
    onClick?: () => void;
    isOpen?: boolean;
  },
  ref?: ForwardedRef<HTMLButtonElement>,
) => {
  const { isOpen = false, onClick, ...rest } = props;

  return (
    <Button
      className="relative size-10 p-2 focus-visible:ring-offset-0"
      variant="ghost"
      ref={ref}
      onClick={onClick}
      aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
      aria-expanded={isOpen}
      {...rest}
    >
      <div className="flex size-6 flex-col items-center justify-center">
        {/* Top line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5',
          )}
        />
        {/* Middle line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'opacity-0' : 'opacity-100',
          )}
        />
        {/* Bottom line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300',
            isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5',
          )}
        />
      </div>
    </Button>
  );
};

const ToggleMenuButton = forwardRef(ToggleMenuButtonInternal);

export { ToggleMenuButton };

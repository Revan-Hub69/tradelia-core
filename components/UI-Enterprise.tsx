'use client';

import { ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Ultra Premium Section Component
interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'hero' | 'xl' | 'lg' | 'md' | 'sm';
  background?: 'default' | 'muted' | 'gradient' | 'mesh';
}

export const Section = ({ 
  children, 
  className = '', 
  id, 
  variant = 'md',
  background = 'default' 
}: SectionProps) => {
  const variantClasses = {
    hero: 'section-hero',
    xl: 'section-xl',
    lg: 'section-lg',
    md: 'section-md', 
    sm: 'section-sm'
  };

  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/30',
    gradient: 'bg-gradient-primary',
    mesh: 'bg-gradient-mesh'
  };

  return (
    <section 
      className={cn(
        variantClasses[variant],
        backgroundClasses[background],
        'relative overflow-hidden',
        className
      )}
      id={id}
    >
      {children}
    </section>
  );
};

// Ultra Premium Container Component
interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  center?: boolean;
  className?: string;
}

export const Container = ({ 
  children, 
  size = 'lg', 
  center = false, 
  className = '' 
}: ContainerProps) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl', 
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl'
  };
  
  return (
    <div className={cn(
      sizes[size],
      'mx-auto px-6 sm:px-8 lg:px-12',
      center && 'text-center',
      className
    )}>
      {children}
    </div>
  );
};

// Ultra Premium Card Component
const cardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'rounded-xl border border-border/20 bg-surface p-6',
        premium: 'card-premium',
        glass: 'card-glass',
        elevated: 'rounded-2xl border border-border/10 bg-surface-elevated p-8 shadow-xl',
        glow: 'card-premium card-glow',
      },
      interactive: {
        true: 'card-interactive cursor-pointer',
        false: '',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      }
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      size: 'md',
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant, interactive, size, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, interactive, size }), className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// Ultra Premium Button Component
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'btn-premium text-white shadow-lg hover:shadow-xl',
        secondary: 'btn-glass text-foreground hover:text-primary',
        outline: 'rounded-xl border-2 border-primary/20 bg-transparent px-6 py-3 text-primary hover:border-primary/40 hover:bg-primary/5',
        ghost: 'rounded-lg px-4 py-2 text-foreground hover:bg-muted/50',
        gradient: 'rounded-xl bg-gradient-primary px-8 py-4 text-white shadow-lg hover:scale-105 hover:shadow-xl',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant, size, href, onClick, className, disabled, type = 'button', ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    
    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...props}
        >
          {children}
        </a>
      );
    }
    
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Ultra Premium Badge Component
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-error/10 text-error border border-error/20',
        glass: 'bg-surface-glass/60 backdrop-blur-sm border border-border/20 text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, variant, size, className }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  );
};

// Ultra Premium Grid Component
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Grid = ({ children, cols = 3, gap = 'lg', className }: GridProps) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  };

  return (
    <div className={cn('grid', colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
};

// Ultra Premium Gradient Text Component
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'rainbow';
}

export const GradientText = ({ children, className, variant = 'primary' }: GradientTextProps) => {
  const variants = {
    primary: 'text-gradient-primary',
    secondary: 'bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent',
    rainbow: 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
};

// Ultra Premium Separator Component
interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = ({ 
  className, 
  orientation = 'horizontal', 
  decorative = true 
}: SeparatorProps) => {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
    />
  );
};

// Ultra Premium Stats Component
interface StatsProps {
  value: string | number;
  label: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const Stats = ({ value, label, description, trend, className }: StatsProps) => {
  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className={cn('text-center', className)}>
      <div className="text-4xl font-bold text-foreground mb-2">
        {value}
      </div>
      <div className="text-sm font-medium text-muted-foreground mb-1">
        {label}
      </div>
      {description && (
        <div className={cn('text-xs', trend ? trendColors[trend] : 'text-muted-foreground')}>
          {description}
        </div>
      )}
    </div>
  );
};
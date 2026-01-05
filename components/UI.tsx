import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'lg' | 'md' | 'sm';
  background?: 'default' | 'muted';
}

export const Section = ({ 
  children, 
  className = '', 
  id, 
  variant = 'md',
  background = 'default' 
}: SectionProps) => {
  const variantClasses = {
    lg: 'section-lg',
    md: 'section-md', 
    sm: 'section-sm'
  };

  const baseClasses = `${variantClasses[variant]} ${className}`;
  
  const style: React.CSSProperties = {
    backgroundColor: background === 'muted' ? 'hsl(var(--muted) / 0.3)' : 'hsl(var(--background))',
    borderTop: background === 'muted' ? '1px solid hsl(var(--border) / 0.5)' : undefined
  };

  return (
    <section 
      className={baseClasses}
      id={id}
      style={style}
    >
      {children}
    </section>
  );
};

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container = ({ children, size = 'md', center = false }: ContainerProps) => {
  const sizes = {
    sm: 'max-w-xl',
    md: 'max-w-2xl',
    lg: 'max-w-4xl', 
    xl: 'max-w-6xl'
  };
  
  const centerClass = center ? 'text-center' : '';
  
  return (
    <div className={`${sizes[size]} mx-auto px-6 sm:px-8 ${centerClass}`}>
      {children}
    </div>
  );
};

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card = ({ 
  children, 
  variant = 'default', 
  interactive = false, 
  className = '', 
  style 
}: CardProps) => {
  const baseClasses = interactive ? 'card-interactive' : 'rounded border border-border/50 bg-background p-5';
  
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border) / 0.5)'
    },
    success: {
      backgroundColor: 'hsl(120 60% 97%)',
      borderColor: 'hsl(120 60% 85%)'
    },
    warning: {
      backgroundColor: 'hsl(45 60% 97%)', 
      borderColor: 'hsl(45 60% 85%)'
    },
    error: {
      backgroundColor: 'hsl(0 60% 97%)',
      borderColor: 'hsl(0 60% 85%)'
    }
  };
  
  return (
    <div 
      className={`${baseClasses} ${className}`}
      style={{
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </div>
  );
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({ 
  children, 
  href, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}: ButtonProps) => {
  const sizes = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-10 px-6 text-base',
    lg: 'h-10 px-6 text-base'
  };
  
  const baseClasses = `inline-flex items-center justify-center gap-2 font-medium rounded transition-subtle ${sizes[size]} ${className}`;
  
  const getStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'hsl(var(--foreground))',
          color: 'hsl(var(--background))'
        };
      case 'secondary':
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--foreground))'
        };
      case 'outline':
        return {
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))'
        };
      default:
        return {};
    }
  };
  
  if (href) {
    return (
      <a href={href} className={baseClasses} style={getStyle()}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={baseClasses} style={getStyle()}>
      {children}
    </button>
  );
};
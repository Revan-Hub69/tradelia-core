import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Section = ({ children, className = '', id }: SectionProps) => (
  <section className={`py-20 ${className}`} id={id}>
    {children}
  </section>
);

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container = ({ children, size = 'lg', center = false }: ContainerProps) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-5xl',
    xl: 'max-w-6xl'
  };
  
  return (
    <div className={`${sizes[size]} mx-auto px-6 ${center ? 'text-center' : ''}`}>
      {children}
    </div>
  );
};

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  style?: React.CSSProperties;
}

export const Card = ({ children, variant = 'default', className = '', style }: CardProps) => {
  const variants = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200', 
    error: 'bg-red-50 border-red-200'
  };
  
  return (
    <div className={`border-2 rounded-2xl p-8 ${variants[variant]} ${className}`} style={style}>
      {children}
    </div>
  );
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({ children, href, onClick, variant = 'primary', size = 'md', className = '' }: ButtonProps) => {
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100'
  };
  
  const sizes = {
    sm: 'px-6 py-2 text-base',
    md: 'px-12 py-4 text-xl', 
    lg: 'px-16 py-6 text-2xl'
  };
  
  const baseClasses = `inline-flex items-center gap-3 font-bold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return <a href={href} className={baseClasses}>{children}</a>;
  }
  
  return <button onClick={onClick} className={baseClasses}>{children}</button>;
};
import React from 'react';

interface BadgeIconProps {
  className?: string;
  size?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ 
  className = '', 
  size = 24,
  rarity = 'common'
}) => {
  const getGradient = () => {
    switch (rarity) {
      case 'legendary':
        return 'url(#legendary-gradient)';
      case 'epic':
        return 'url(#epic-gradient)';
      case 'rare':
        return 'url(#rare-gradient)';
      default:
        return 'url(#common-gradient)';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="common-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="rare-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="epic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="legendary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      
      <path
        d="M12 2L15.5 8.5L22 9.5L17.5 14.5L18.5 21L12 18L5.5 21L6.5 14.5L2 9.5L8.5 8.5L12 2Z"
        fill={getGradient()}
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="white"
        fillOpacity="0.9"
      />
      
      <path
        d="M10.5 12L11.5 13L13.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
import React from 'react';

interface AchievementIconProps {
  className?: string;
  size?: number;
  progress?: number; // 0-100
}

export const AchievementIcon: React.FC<AchievementIconProps> = ({ 
  className = '', 
  size = 24,
  progress = 0
}) => {
  const circumference = 2 * Math.PI * 8; // radius = 8
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
        <linearGradient id="achievement-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="2"
      />
      
      {/* Progress ring */}
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="url(#achievement-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 12 12)"
      />
      
      {/* Center target */}
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
      />
      
      {/* Inner circle */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="white"
      />
    </svg>
  );
};
import React from 'react';

interface XPIconProps {
  className?: string;
  size?: number;
}

export const XPIcon: React.FC<XPIconProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="white"
      />
    </svg>
  );
};
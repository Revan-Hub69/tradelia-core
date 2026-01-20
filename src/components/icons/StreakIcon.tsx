import React from 'react';

type StreakIconProps = {
  className?: string;
  size?: number;
};

export const StreakIcon: React.FC<StreakIconProps> = ({
  className = '',
  size = 24,
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
      <path
        d="M12 2L15.09 8.26L22 9L17 14.74L18.18 22L12 18.27L5.82 22L7 14.74L2 9L8.91 8.26L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6L13.5 10.5L18 11L15 14.5L15.75 19L12 16.5L8.25 19L9 14.5L6 11L10.5 10.5L12 6Z"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * SECTION HEADER - Enterprise Drawer Component 2026
 *
 * Professional section header with SVG icon system
 * NO EMOJI - Pure enterprise design
 *
 * Design System:
 * - Icon container: 40px with 12px radius
 * - Icon size: 20px with 2px stroke
 * - Typography: 18px font, 700 weight
 * - Spacing: 24px margin bottom
 */

import type { ReactNode } from 'react';

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  iconColor?: 'primary' | 'green' | 'amber' | 'blue' | 'orange' | 'purple' | 'red';
};

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function SectionHeader({ icon, title, iconColor = 'primary' }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3 lg:mb-6">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10 lg:size-11 ${iconColorClasses[iconColor]}`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold leading-tight sm:text-lg lg:text-xl">{title}</h3>
    </div>
  );
}

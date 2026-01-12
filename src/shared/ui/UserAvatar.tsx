/**
 * UserAvatar Component - Tradelia 2026
 * 
 * Reusable avatar component with:
 * - Image support (Google OAuth, custom)
 * - Generated initials fallback
 * - Consistent color based on name hash
 * - Multiple sizes
 * - Accessibility compliant
 */

import { memo, useMemo } from 'react'

// Avatar color palette - accessible contrast ratios
const AVATAR_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
  'from-indigo-500 to-indigo-600',
  'from-rose-500 to-rose-600',
] as const

// Size variants
const SIZES = {
  sm: { container: 'w-8 h-8', text: 'text-xs', border: 'border' },
  md: { container: 'w-12 h-12', text: 'text-sm', border: 'border-2' },
  lg: { container: 'w-16 h-16', text: 'text-xl', border: 'border-2' },
  xl: { container: 'w-24 h-24', text: 'text-2xl', border: 'border-3' },
} as const

type AvatarSize = keyof typeof SIZES

interface UserAvatarProps {
  /** User's display name for initials and color generation */
  name: string
  /** Optional image URL (Google photo, custom avatar) */
  imageUrl?: string | null | undefined
  /** Size variant */
  size?: AvatarSize
  /** Additional CSS classes */
  className?: string
}

/**
 * Generate initials from name
 * - "John Doe" -> "JD"
 * - "john_doe" -> "JD"
 * - "john" -> "JO"
 */
function getInitials(name: string): string {
  if (!name?.trim()) return '?'
  
  const cleaned = name.trim()
  const parts = cleaned.split(/[\s_-]+/).filter(Boolean)
  
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  }
  
  return cleaned.substring(0, 2).toUpperCase()
}

/**
 * Generate consistent color based on name hash
 * Same name always produces same color
 */
function getAvatarColor(name: string): string {
  if (!name) return AVATAR_COLORS[0]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]
}

/**
 * UserAvatar - Displays user avatar with image or generated initials
 */
export const UserAvatar = memo(function UserAvatar({
  name,
  imageUrl,
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const sizeStyles = SIZES[size]
  
  const initials = useMemo(() => getInitials(name), [name])
  const colorClass = useMemo(() => getAvatarColor(name || ''), [name])
  
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={`Avatar di ${name}`}
        className={`${sizeStyles.container} rounded-full object-cover ${sizeStyles.border} border-border ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    )
  }
  
  return (
    <div
      className={`${sizeStyles.container} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center ${sizeStyles.border} border-white/20 ${className}`}
      role="img"
      aria-label={`Avatar di ${name}`}
    >
      <span className={`${sizeStyles.text} font-bold text-white select-none`}>
        {initials}
      </span>
    </div>
  )
})

// Export utilities for external use
export { getInitials, getAvatarColor, AVATAR_COLORS, SIZES }
export type { UserAvatarProps, AvatarSize }

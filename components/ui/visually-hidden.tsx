import * as React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Visually hides content while keeping it accessible to screen readers
 * Follows WCAG guidelines for accessible hiding
 */
export function VisuallyHidden({ 
  className, 
  children, 
  ...props 
}: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

VisuallyHidden.displayName = "VisuallyHidden"
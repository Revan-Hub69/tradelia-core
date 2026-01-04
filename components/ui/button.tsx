import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline"
  size?: "default" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center rounded font-medium transition-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-underline",
      {
        "bg-foreground text-background hover:bg-foreground/90": variant === "default",
        "border border-border/50 bg-background hover:bg-muted/30 text-foreground": variant === "outline",
        "h-10 px-6 text-sm": size === "default" || size === "lg",
      },
      className
    )
    
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(buttonClasses, (children as React.ReactElement).props.className)
      })
    }
    
    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
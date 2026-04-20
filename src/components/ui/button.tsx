import * as React from "react"
import { type LucideIcon } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'right', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-brand-2nd text-white hover:opacity-90',
      outline: 'border border-muted bg-white text-foreground hover:bg-muted/50',
      ghost: 'text-foreground hover:bg-muted/50'
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="mr-2 h-4 w-4" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4" />}
      </button>
    )
  }
)
Button.displayName = "Button"

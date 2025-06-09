import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
          "hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/25",
          "shadow-md border border-primary-400/20",
        ],
        secondary: [
          "bg-gray-800 text-gray-100 border border-gray-700",
          "hover:bg-gray-700 hover:border-gray-600 hover:shadow-md",
          "shadow-sm",
        ],
        accent: [
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
          "hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:shadow-accent-500/25",
          "shadow-md border border-accent-400/20",
        ],
        success: [
          "bg-gradient-to-r from-green-500 to-green-600 text-white",
          "hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25",
          "shadow-md border border-green-400/20",
        ],
        warning: [
          "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900",
          "hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/25",
          "shadow-md border border-yellow-400/20",
        ],
        danger: [
          "bg-gradient-to-r from-red-500 to-red-600 text-white",
          "hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25",
          "shadow-md border border-red-400/20",
        ],
        outline: [
          "border-2 border-gray-700 bg-transparent text-gray-200",
          "hover:bg-gray-800 hover:border-gray-600 hover:text-gray-100",
          "shadow-sm hover:shadow-md",
        ],
        ghost: [
          "text-gray-300 bg-transparent",
          "hover:bg-gray-800/50 hover:text-gray-100",
          "hover:shadow-sm",
        ],
        glass: [
          "bg-white/5 border border-white/10 text-gray-100 backdrop-blur-md",
          "hover:bg-white/10 hover:border-white/20",
          "shadow-lg hover:shadow-xl",
        ],
        premium: [
          "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white",
          "hover:from-purple-600 hover:via-pink-600 hover:to-purple-700",
          "hover:shadow-xl hover:shadow-purple-500/30 animate-shimmer",
          "shadow-lg border border-purple-400/30",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-lg",
        lg: "rounded-2xl",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
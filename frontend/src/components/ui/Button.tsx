import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    children,
    leftIcon,
    rightIcon,
    disabled,
    asChild = false,
    ...props 
  }, ref) => {
    
    const baseClasses = "btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary", 
      outline: "btn-outline",
      ghost: "btn-ghost",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    };
    
    const sizes = {
      sm: "btn-sm",
      md: "btn-md", 
      lg: "btn-lg"
    };

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: classes,
        ...props
      });
    }
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        
        {children}
        
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

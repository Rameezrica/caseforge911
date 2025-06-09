import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'gradient' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  shimmer?: boolean;
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
    glow = false,
    shimmer = false,
    disabled,
    ...props 
  }, ref) => {
    
    const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
    
    const variants = {
      primary: "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg hover:shadow-xl focus:ring-brand-500 transform hover:scale-105",
      secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-glass hover:bg-white/20 focus:ring-white/50 transform hover:scale-105",
      ghost: "text-dark-300 hover:text-white hover:bg-white/10 focus:ring-white/50",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-glass hover:bg-white/15 focus:ring-white/50",
      gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-purple-500 transform hover:scale-105",
      danger: "bg-gradient-to-r from-error-600 to-error-500 text-white shadow-lg hover:shadow-xl focus:ring-error-500 transform hover:scale-105"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg"
    };
    
    const glowClasses = glow ? (variant === 'primary' ? "shadow-neon" : "shadow-glow") : "";
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: variant === 'ghost' ? 1 : 1.05 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
        {...props}
      >
        {/* Shimmer Effect */}
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full animate-shimmer" />
        )}
        
        {/* Glow Effect */}
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm animate-pulse" />
        )}
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : leftIcon ? (
            leftIcon
          ) : null}
          
          {children}
          
          {!loading && rightIcon && rightIcon}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
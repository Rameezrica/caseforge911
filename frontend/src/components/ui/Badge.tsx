import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', glow = false, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-dark-700 text-dark-200 border border-dark-600",
      primary: "bg-gradient-to-r from-brand-600 to-brand-500 text-white border border-brand-500/30",
      secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
      success: "bg-gradient-to-r from-success-600 to-success-500 text-white border border-success-500/30",
      warning: "bg-gradient-to-r from-warning-600 to-warning-500 text-white border border-warning-500/30",
      error: "bg-gradient-to-r from-error-600 to-error-500 text-white border border-error-500/30",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white"
    };
    
    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base"
    };
    
    const glowClasses = glow ? "shadow-neon" : "";
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full transition-all duration-300",
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
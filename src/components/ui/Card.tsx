import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'premium' | 'interactive' | 'floating';
  children: React.ReactNode;
  glow?: boolean;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, glow = false, hover = true, ...props }, ref) => {
    
    const variants = {
      default: "bg-dark-800 border border-dark-700 rounded-xl shadow-lg",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-glass",
      premium: "bg-gradient-to-br from-dark-800/50 to-dark-900/50 backdrop-blur-md border border-white/10 rounded-xl shadow-premium",
      interactive: "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-glass cursor-pointer hover:shadow-premium hover:border-brand-500/50 group",
      floating: "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-glass floating"
    };
    
    const hoverEffect = hover && variant !== 'floating' ? "hover:shadow-xl hover:transform hover:scale-105 transition-all duration-500" : "";
    const glowEffect = glow ? "shadow-neon" : "";
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          variants[variant],
          hoverEffect,
          glowEffect,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={hover && variant !== 'floating' ? { scale: 1.02 } : {}}
        {...props}
      >
        {/* Glow overlay for glass effect */}
        {(variant === 'glass' || variant === 'premium' || variant === 'interactive') && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        
        {/* Interactive hover overlay */}
        {variant === 'interactive' && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:to-brand-500/5 transition-all duration-500 pointer-events-none" />
        )}
        
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export { Card };
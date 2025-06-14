import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  children: React.ReactNode;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, hover = false, ...props }, ref) => {
    
    const variants = {
      default: "card",
      interactive: "card card-interactive"
    };
    
    const hoverEffect = hover ? "card-hover" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          hoverEffect,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };

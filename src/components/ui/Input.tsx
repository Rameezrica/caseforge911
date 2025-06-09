import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'floating';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, variant = 'default', ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    
    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);
    
    const variants = {
      default: "bg-dark-700 border border-dark-600 text-dark-50",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
      floating: "bg-transparent border-b border-dark-600 text-dark-50 rounded-none"
    };
    
    const focusVariants = {
      default: "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
      glass: "focus:ring-2 focus:ring-white/50 focus:border-white/50",
      floating: "focus:border-brand-500"
    };
    
    return (
      <div className="space-y-2">
        {label && variant !== 'floating' && (
          <label className="block text-sm font-medium text-dark-200">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Floating Label */}
          {label && variant === 'floating' && (
            <motion.label
              className={cn(
                "absolute left-0 transition-all duration-200 pointer-events-none",
                focused || hasValue
                  ? "text-xs text-brand-400 -top-2"
                  : "text-dark-400 top-3"
              )}
              animate={{
                fontSize: focused || hasValue ? '0.75rem' : '1rem',
                y: focused || hasValue ? -8 : 0,
                color: focused ? '#6366f1' : '#94a3b8'
              }}
            >
              {label}
            </motion.label>
          )}
          
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
              {leftIcon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            className={cn(
              "w-full px-3 py-3 rounded-lg transition-all duration-200 focus:outline-none placeholder-dark-400",
              variants[variant],
              focusVariants[variant],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              variant === 'floating' && "pt-6 pb-2",
              error && "border-error-500 focus:ring-error-500 focus:border-error-500",
              className
            )}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
          
          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400">
              {rightIcon}
            </div>
          )}
          
          {/* Focus Ring for Glass Variant */}
          {variant === 'glass' && focused && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-white/30 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.p
            className="text-error-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
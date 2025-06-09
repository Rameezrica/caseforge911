import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'default' | 'brain' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = "",
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brainVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotateY: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {variant === 'brain' ? (
        <motion.div
          className={`${sizeClasses[size]} text-brand-500 flex items-center justify-center`}
          variants={brainVariants}
          animate="animate"
        >
          <Brain className="h-full w-full" />
        </motion.div>
      ) : variant === 'pulse' ? (
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-brand-500 to-purple-600 rounded-full`}
          variants={pulseVariants}
          animate="animate"
        />
      ) : (
        <motion.div
          variants={spinVariants}
          animate="animate"
        >
          <Loader2 className={`${sizeClasses[size]} text-brand-500`} />
        </motion.div>
      )}
      
      {text && (
        <motion.p 
          className={`text-dark-300 mt-3 ${textSizeClasses[size]} text-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
      
      {/* Loading dots animation */}
      {text && (
        <div className="flex space-x-1 mt-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 bg-brand-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface ButtonProps {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  to,
  icon = <Calendar className="h-5 w-5 mr-2" />,
  children,
  className = '',
  disabled = false,
  onClick
}) => {
  // Debounce click handler to prevent multiple rapid clicks
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      try {
        onClick(e);
      } catch (error) {
        console.error('Button click error:', error);
      }
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`
        inline-flex items-center px-6 py-3 
        ${disabled 
          ? 'bg-dark-600 cursor-not-allowed opacity-60' 
          : 'bg-emerald-500 hover:bg-emerald-600'
        }
        text-dark-900 rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        ${className}
      `}
      aria-disabled={disabled}
      role="button"
    >
      {icon}
      {children}
    </Link>
  );
};

export default Button;
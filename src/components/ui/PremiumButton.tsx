import React from 'react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  ariaLabel?: string;
}

const variantStyles = {
  primary: 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-dark-50 border border-emerald-600',
  secondary: 'bg-dark-800 hover:bg-dark-700 active:bg-dark-900 text-dark-200 border border-dark-700',
  danger: 'bg-rose-700 hover:bg-rose-600 active:bg-rose-800 text-dark-50 border border-rose-600',
  disabled: 'bg-dark-700 text-dark-400 cursor-not-allowed',
};

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  className = '',
  ariaLabel,
  ...props
}) => {
  const base = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 outline-none focus:outline-none shadow-sm';
  const style = disabled
    ? variantStyles.disabled
    : variantStyles[variant] || variantStyles.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${style} ${className}`}
      tabIndex={0}
      aria-label={ariaLabel}
      style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default PremiumButton; 
import React from 'react';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ children, className = '', style, onClick, ...props }) => {
  return (
    <div
      className={`bg-dark-900 border border-dark-700 rounded-xl shadow-md p-6 font-sans text-dark-100 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}`}
      style={{ ...(style || {}), fontFamily: 'Inter, Roboto, sans-serif' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default PremiumCard; 
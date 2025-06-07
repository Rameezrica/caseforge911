import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-dark-800 rounded-xl border border-dark-700 p-6 mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-50 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-dark-400">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
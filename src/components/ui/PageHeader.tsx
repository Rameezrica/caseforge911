import React from 'react';
import { Button } from './button';

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actionLabel, onAction, actionIcon }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    {actionLabel && (
      <Button onClick={onAction}>
        {actionIcon}
        {actionIcon ? <span className="ml-2">{actionLabel}</span> : actionLabel}
      </Button>
    )}
  </div>
); 
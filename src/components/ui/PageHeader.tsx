import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  onBack?: () => void;
}

export function PageHeader({ 
  title, 
  actionLabel, 
  actionIcon, 
  onAction,
  onBack 
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="flex items-center gap-2"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
} 
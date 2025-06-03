import React from 'react';

export const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="bg-card rounded-lg shadow border border-border overflow-hidden">{children}</div>
); 
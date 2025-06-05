declare module './Sidebar' {
  import * as React from 'react';
  const Sidebar: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>>;
  export default Sidebar;
} 
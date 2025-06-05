declare module '../../reactbits/src/components/navs/*.jsx' {
  import * as React from 'react';
  const Component: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>>;
  export default Component;
}

declare module '../components/ui/PremiumCard' {
  import * as React from 'react';
  const PremiumCard: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>>;
  export default PremiumCard;
}

declare module '../../reactbits/src/components/navs/Sidebar' {
  import * as React from 'react';
  const Sidebar: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>>;
  export default Sidebar;
} 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDomain } from '../../context/DomainContext';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  MessageSquare, 
  Calendar,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Calculator,
  Brain,
  Users,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { selectedDomain, setSelectedDomain } = useDomain();

  const getDomainIcon = (domainName: string) => {
    switch (domainName) {
      case 'Finance & Investment':
        return <Calculator className="h-5 w-5" />;
      case 'Strategy & Consulting':
        return <Brain className="h-5 w-5" />;
      case 'Operations & Supply Chain':
        return <Target className="h-5 w-5" />;
      case 'Marketing & Growth':
        return <BarChart3 className="h-5 w-5" />;
      case 'Data Analytics':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getColorClasses = (domainName: string) => {
    const colorMap = {
      'Finance & Investment': 'text-green-500',
      'Strategy & Consulting': 'text-purple-500',
      'Operations & Supply Chain': 'text-blue-500',
      'Marketing & Growth': 'text-orange-500',
      'Data Analytics': 'text-cyan-500'
    };
    return colorMap[domainName as keyof typeof colorMap] || 'text-blue-500';
  };

  const mainNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Problems',
      href: '/problems',
      icon: BookOpen,
      current: location.pathname === '/problems' || location.pathname.startsWith('/problem/')
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      current: location.pathname === '/leaderboard' || location.pathname.includes('/leaderboard')
    },
    {
      name: 'Community',
      href: '/community',
      icon: MessageSquare,
      current: location.pathname === '/community'
    },
    {
      name: 'Study Plans',
      href: '/study-plans',
      icon: Target,
      current: location.pathname === '/study-plans'
    },
    {
      name: 'Contests',
      href: '/contests',
      icon: Calendar,
      current: location.pathname === '/contests'
    }
  ];

  const bottomNavItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-20 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-dark-700">
        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-dark-900 font-bold text-lg">C</span>
        </div>
      </div>

      {/* Domain Indicator */}
      {selectedDomain && (
        <div className="flex flex-col items-center py-4 border-b border-dark-700">
          <div className={`p-2 rounded-lg bg-dark-700 ${getColorClasses(selectedDomain)}`}>
            {getDomainIcon(selectedDomain)}
          </div>
          <div className="text-xs text-dark-400 mt-1 text-center leading-tight max-w-16">
            {selectedDomain.split(' ')[0]}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-2 px-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-xs transition-colors duration-200 ${
                item.current
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
              }`}
              title={item.name}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-center leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Domain Switcher */}
      <div className="border-t border-dark-700 p-2">
        <button
          onClick={() => setSelectedDomain(null)}
          className="w-full flex flex-col items-center justify-center p-3 rounded-lg text-xs text-dark-400 hover:text-dark-200 hover:bg-dark-700 transition-colors duration-200"
          title="Switch Domain"
        >
          <RefreshCw className="h-5 w-5 mb-1" />
          <span className="text-center leading-tight">Switch</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-dark-700 p-2">
        <div className="space-y-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-xs transition-colors duration-200 ${
                item.current
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
              }`}
              title={item.name}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-center leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
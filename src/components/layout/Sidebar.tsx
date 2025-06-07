import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Trophy, Users, User, 
  Target, BarChart3, Calendar, 
  Code, Layers, Zap, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Problems', path: '/problems' },
    { icon: Target, label: 'Study Plans', path: '/study-plans' },
    { icon: Trophy, label: 'Contests', path: '/contests' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-dark-900 border-r border-dark-700 flex flex-col items-center py-6 z-50">
      <Link to="/" className="mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Layers className="h-6 w-6 text-white" />
        </div>
      </Link>

      <nav className="flex flex-col space-y-2 w-full">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center justify-center h-12 w-12 mx-auto rounded-xl transition-all duration-200
                ${active 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                }
              `}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              
              <div className="absolute left-full ml-4 px-3 py-2 bg-dark-800 text-dark-200 text-sm rounded-lg border border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-dark-800 border-l border-t border-dark-700 rotate-45"></div>
              </div>

              {active && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center">
          <Zap className="h-4 w-4 text-dark-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
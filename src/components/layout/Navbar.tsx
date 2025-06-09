import React, { useState } from 'react';
import { Link, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { 
  Briefcase, Search, Clock, Menu, X,
  Home, BookOpen, Trophy, Users, User, 
  Target, BarChart3, Calendar, 
  Code, Layers, Zap, ChevronRight
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Problems', path: '/problems' },
    { icon: Target, label: 'Study Plans', path: '/study-plans' },
    { icon: Trophy, label: 'Contests', path: '/contests' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/problems?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isSolver = matchPath('/solve/:id', location.pathname);

  if (isSolver) {
    const match = location.pathname.match(/\/solve\/(.+)$/);
    const problemId = match ? match[1] : '';
    return (
      <nav className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-100">CaseForge</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-300 px-3 py-1.5 rounded-lg bg-gray-800/50">
                <Clock className="h-5 w-5 mr-2 text-primary-400" />
                <span className="font-medium">Solving Mode</span>
              </div>
              <button
                onClick={() => navigate(`/problem/${problemId}`)}
                className="px-4 py-2 text-gray-300 hover:text-gray-100 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-200 hover:bg-gray-800/50"
              >
                Back to Problem
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const showSearch = location.pathname !== '/';

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-100">CaseForge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group
                    ${active 
                      ? 'text-primary-300 bg-primary-500/20 shadow-md border border-primary-500/30' 
                      : 'text-gray-300 hover:text-gray-100 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side - Search, Theme, Profile */}
          <div className="flex items-center space-x-4">
            {showSearch && (
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </form>
            )}
            
            <ThemeToggle />

            <Link
              to="/profile"
              className={`
                flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${isActive('/profile')
                  ? 'text-primary-300 bg-primary-500/20 border border-primary-500/30' 
                  : 'text-gray-200 hover:text-gray-100 hover:bg-white/5'
                }
              `}
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform duration-200">
                U
              </div>
              <span className="hidden lg:block">Profile</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                      ${active 
                        ? 'text-primary-300 bg-primary-500/20 border border-primary-500/30' 
                        : 'text-gray-300 hover:text-gray-100 hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {showSearch && (
                <form onSubmit={handleSearch} className="pt-2 sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
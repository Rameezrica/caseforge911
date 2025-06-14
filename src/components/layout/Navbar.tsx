import React, { useState } from 'react';
import { Link, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { 
  Search, Menu, X,
  Home, BookOpen, Trophy, Users, User, 
  Target, BarChart3, Calendar, 
  ChevronDown, LogIn, UserPlus, 
  LogOut, Gauge, Settings
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Problems', path: '/problems' },
    { icon: Target, label: 'Study Plans', path: '/study-plans' },
    { icon: Trophy, label: 'Contests', path: '/contests' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard' },
  ];

  const userMenuItems = [
    { icon: Gauge, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/problems?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
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
      <nav className="sticky top-0 z-50 w-full border-b border-win11-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 elevation-1">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground elevation-1">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold text-foreground">CaseForge</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-win11-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Solving Mode</span>
              </div>
              <button
                onClick={() => navigate(`/problem/${problemId}`)}
                className="btn btn-outline btn-sm"
              >
                Back to Problem
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const showSearch = location.pathname !== '/' || isAuthenticated;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-win11-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 elevation-1">
      <div className="container">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group transition-all duration-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground elevation-1 group-hover:elevation-2 transition-all duration-200">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">CaseForge</span>
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
                    nav-item group
                    ${active 
                      ? 'active' 
                      : 'text-win11-gray-600 hover:text-foreground hover:bg-win11-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 transition-colors duration-200" />
                  <span className="transition-colors duration-200">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Search, Theme, Auth */}
          <div className="flex items-center space-x-3">
            {showSearch && (
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-win11-gray-500 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-9 w-64 bg-win11-gray-50 border-win11-gray-200 focus:bg-background transition-colors duration-200"
                />
              </form>
            )}
            
            <ThemeToggle />

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium rounded-lg px-3 py-2 transition-all duration-200 hover:bg-win11-gray-100 hover:elevation-1"
                >
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium elevation-1">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block text-foreground">{user?.username}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-win11-gray-200 bg-background p-2 text-foreground elevation-3 animate-win11-scale-in">
                    <div className="px-3 py-2 text-sm text-win11-gray-600">
                      <p className="font-medium text-foreground">{user?.full_name || user?.username}</p>
                      <p className="truncate text-win11-gray-500">{user?.email}</p>
                    </div>
                    <div className="h-px bg-win11-gray-200 my-2" />
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-win11-gray-100 text-foreground"
                      >
                        <item.icon className="h-4 w-4 text-win11-gray-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <div className="h-px bg-win11-gray-200 my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm text-red-600 transition-all duration-200 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span className="hidden lg:block">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden lg:block">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-win11-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-win11-gray-200 bg-background animate-win11-fade-in">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200
                      ${active 
                        ? 'bg-win11-light-blue text-primary' 
                        : 'text-win11-gray-600 hover:text-foreground hover:bg-win11-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Auth items for mobile */}
              <div className="border-t border-win11-gray-200 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-win11-gray-600 hover:text-foreground hover:bg-win11-gray-100 transition-all duration-200"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-win11-gray-600 hover:text-foreground hover:bg-win11-gray-100 transition-all duration-200"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium bg-primary text-primary-foreground hover:brightness-105 transition-all duration-200"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
              
              {showSearch && (
                <form onSubmit={handleSearch} className="pt-3 sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-win11-gray-500 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-9 w-full bg-win11-gray-50 border-win11-gray-200 focus:bg-background transition-colors duration-200"
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
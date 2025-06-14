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
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">CaseForge</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-muted-foreground">
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

  const showSearch = location.pathname !== '/';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">CaseForge</span>
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
                    flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${active 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Search, Theme, Auth */}
          <div className="flex items-center space-x-3">
            {showSearch && (
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-8 w-64"
                />
              </form>
            )}
            
            <ThemeToggle />

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block">{user?.username}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-fade-in">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{user?.full_name || user?.username}</p>
                      <p className="truncate">{user?.email}</p>
                    </div>
                    <div className="h-px bg-border my-1" />
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
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
                  <LogIn className="mr-1 h-4 w-4" />
                  <span className="hidden lg:block">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  <span className="hidden lg:block">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
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
          <div className="md:hidden border-t bg-background">
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
                      flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors
                      ${active 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Auth items for mobile */}
              <div className="border-t pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
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
                      className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
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
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground transition-colors"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
              
              {showSearch && (
                <form onSubmit={handleSearch} className="pt-2 sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-8 w-full"
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

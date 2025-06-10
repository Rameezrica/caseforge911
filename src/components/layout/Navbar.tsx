import React, { useState } from 'react';
import { Link, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Clock, Menu, X,
  Home, BookOpen, Trophy, Users, User, 
  Target, BarChart3, Calendar, 
  Code, Layers, Zap, ChevronRight,
  Brain, LogIn, UserPlus, Settings,
  LogOut, Gauge
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', gradient: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, label: 'Problems', path: '/problems', gradient: 'from-emerald-500 to-teal-500' },
    { icon: Target, label: 'Study Plans', path: '/study-plans', gradient: 'from-purple-500 to-pink-500' },
    { icon: Trophy, label: 'Contests', path: '/contests', gradient: 'from-yellow-500 to-orange-500' },
    { icon: Users, label: 'Community', path: '/community', gradient: 'from-indigo-500 to-purple-500' },
    { icon: BarChart3, label: 'Leaderboard', path: '/leaderboard', gradient: 'from-red-500 to-pink-500' },
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
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container-lg">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-neon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CaseForge
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-dark-400">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Solving Mode</span>
              </div>
              <Button
                variant="glass"
                onClick={() => navigate(`/problem/${problemId}`)}
              >
                Back to Problem
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  const showSearch = location.pathname !== '/';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container-lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-neon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Brain className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CaseForge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${active 
                        ? 'text-white' 
                        : 'text-dark-300 hover:text-white'
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className={`relative z-10 p-1 rounded-lg ${active ? `bg-gradient-to-br ${item.gradient} shadow-lg` : ''}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side - Search, Theme, Profile */}
          <div className="flex items-center space-x-4">
            {showSearch && (
              <motion.form 
                onSubmit={handleSearch} 
                className="relative hidden sm:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </motion.form>
            )}
            
            <ThemeToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/profile"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive('/profile')
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white' 
                    : 'text-dark-200 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  U
                </div>
                <span className="hidden lg:block">Profile</span>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-dark-900/95 backdrop-blur-xl"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200
                          ${active 
                            ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white' 
                            : 'text-dark-300 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <div className={`p-1 rounded-lg ${active ? `bg-gradient-to-br ${item.gradient} shadow-lg` : ''}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {showSearch && (
                  <motion.form 
                    onSubmit={handleSearch} 
                    className="pt-2 sm:hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigationItems.length * 0.1 }}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </motion.form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
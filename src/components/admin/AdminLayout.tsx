import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2,
  MessageSquare,
  Tag
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAdmin } from '../../hooks/useAdmin';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout, admin } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/problems', icon: <BookOpen className="h-5 w-5" />, label: 'Problems' },
    { path: '/admin/users', icon: <Users className="h-5 w-5" />, label: 'Users' },
    { path: '/admin/solutions', icon: <MessageSquare className="h-5 w-5" />, label: 'Solutions' },
    { path: '/admin/categories', icon: <Tag className="h-5 w-5" />, label: 'Categories' },
    { path: '/admin/analytics', icon: <BarChart2 className="h-5 w-5" />, label: 'Analytics' },
    { path: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">CaseForge Admin</h1>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {admin?.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{admin?.name}</p>
                <p className="text-xs text-muted-foreground">{admin?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-200 ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}; 
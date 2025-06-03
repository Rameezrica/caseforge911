import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Menu } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-20 bg-dark-800 border-r border-dark-700 flex flex-col items-center py-4 fixed h-screen left-0 top-0">
      <button className="p-3 mb-8 hover:bg-dark-700 rounded-lg">
        <Menu className="h-6 w-6 text-dark-400" />
      </button>
      
      <div className="flex flex-col items-center space-y-6">
        <Link
          to="/"
          className={`p-3 rounded-lg flex flex-col items-center ${
            isActive('/') ? 'text-emerald-500' : 'text-dark-400 hover:text-dark-50'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/problems"
          className={`p-3 rounded-lg flex flex-col items-center ${
            isActive('/problems') ? 'text-emerald-500' : 'text-dark-400 hover:text-dark-50'
          }`}
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-xs mt-1">Problems</span>
        </Link>

        <Link
          to="/community"
          className={`p-3 rounded-lg flex flex-col items-center ${
            isActive('/community') ? 'text-emerald-500' : 'text-dark-400 hover:text-dark-50'
          }`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs mt-1">Community</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
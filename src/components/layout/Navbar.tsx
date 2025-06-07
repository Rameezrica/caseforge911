import React, { useState } from 'react';
import { Link, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { Briefcase, Search, Clock } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/problems?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isSolver = matchPath('/solve/:id', location.pathname);

  if (isSolver) {
    const match = location.pathname.match(/\/solve\/(.+)$/);
    const problemId = match ? match[1] : '';
    return (
      <nav className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-dark-50">CaseForge</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-dark-400">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Solving Mode</span>
              </div>
              <button
                onClick={() => navigate(`/problem/${problemId}`)}
                className="px-4 py-2 text-dark-400 hover:text-dark-200 border border-dark-600 rounded-lg"
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
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-dark-50">CaseForge</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {showSearch && (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </form>
            )}
            
            <ThemeToggle />

            <Link
              to="/profile"
              className="flex items-center space-x-2 text-dark-200 hover:text-dark-50"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-dark-900 font-bold">
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
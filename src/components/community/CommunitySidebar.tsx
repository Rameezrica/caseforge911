import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Award, MessageSquare, Calendar, Plus } from 'lucide-react';

const categories = [
  { name: 'All', icon: <MessageSquare className="h-4 w-4" /> },
  { name: 'Q&A', icon: <MessageSquare className="h-4 w-4" /> },
  { name: 'Showcase', icon: <Award className="h-4 w-4" /> },
  { name: 'Events', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Resources', icon: <TrendingUp className="h-4 w-4" /> },
];

const CommunitySidebar: React.FC = () => {
  return (
    <aside className="sticky top-8 w-72 bg-dark-800 rounded-xl border border-dark-700 p-6 space-y-8 hidden lg:block">
      {/* Community Stats */}
      <div>
        <h2 className="text-lg font-semibold text-dark-50 mb-2">Community</h2>
        <div className="flex justify-between text-dark-400 text-sm mb-1">
          <span>Members</span>
          <span>12,500</span>
        </div>
        <div className="flex justify-between text-dark-400 text-sm mb-1">
          <span>Posts</span>
          <span>2,340</span>
        </div>
        <div className="flex justify-between text-dark-400 text-sm">
          <span>Online</span>
          <span>320</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.name === 'All' ? '/community' : `/community/category/${cat.name.toLowerCase()}`}
            className="flex items-center px-3 py-2 rounded-lg text-dark-200 hover:bg-dark-700 transition-colors duration-200"
          >
            {cat.icon}
            <span className="ml-2">{cat.name}</span>
          </Link>
        ))}
      </nav>

      {/* Leaderboard Preview */}
      <div>
        <h3 className="text-md font-semibold text-dark-50 mb-2 flex items-center">
          <Award className="h-4 w-4 mr-2 text-amber-400" /> Leaderboard
        </h3>
        <ul className="space-y-1 text-sm">
          <li className="flex justify-between text-dark-200"><span>morgan_lee</span><span>42</span></li>
          <li className="flex justify-between text-dark-200"><span>alex_johnson</span><span>27</span></li>
          <li className="flex justify-between text-dark-200"><span>sarah_chen</span><span>15</span></li>
        </ul>
        <Link to="/community/leaderboard" className="block mt-2 text-emerald-500 hover:underline text-xs">View full leaderboard</Link>
      </div>

      {/* Call to Action */}
      <Link
        to="/community/new"
        className="flex items-center justify-center mt-4 px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-400 font-medium"
      >
        <Plus className="h-4 w-4 mr-2" /> New Post
      </Link>
    </aside>
  );
};

export default CommunitySidebar; 
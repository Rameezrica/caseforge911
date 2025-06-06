import React from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../../services/api';
import { 
  Clock, 
  Building, 
  Star, 
  Users,
  TrendingUp,
  CheckCircle,
  Play
} from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  viewMode?: 'grid' | 'list';
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, viewMode = 'grid' }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      case 'Hard':
        return 'bg-red-900 text-red-200 border-red-700';
      default:
        return 'bg-dark-700 text-dark-200 border-dark-600';
    }
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/problem/${problem.id}`}
        className="block bg-dark-800 border border-dark-700 rounded-lg p-4 hover:border-dark-600 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-dark-50 hover:text-emerald-400">
                {problem.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-dark-400 mb-2">
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {problem.company || 'General'}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {problem.time_limit || 60} min
              </span>
              <span className="text-dark-500">•</span>
              <span>{problem.category}</span>
            </div>
            
            <p className="text-dark-400 text-sm">
              {truncateDescription(problem.description.replace(/\*\*/g, ''), 150)}
            </p>
          </div>
          
          <div className="ml-4 flex items-center gap-2">
            <button className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <Play className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/problem/${problem.id}`}
      className="block bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200 h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="text-xs text-dark-500">
          {problem.domain}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-dark-50 mb-3 hover:text-emerald-400 transition-colors">
        {problem.title}
      </h3>

      {/* Category & Company */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-dark-700 text-dark-300 rounded-md text-xs">
          {problem.category}
        </span>
        {problem.company && (
          <span className="flex items-center text-xs text-dark-400">
            <Building className="h-3 w-3 mr-1" />
            {problem.company}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-dark-400 text-sm mb-4 line-clamp-3">
        {truncateDescription(problem.description.replace(/\*\*/g, ''), 120)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs text-dark-500">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {problem.time_limit || 60} min
          </span>
          <span className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            0 solved
          </span>
        </div>
        
        <button className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          <Play className="h-3 w-3" />
        </button>
      </div>
    </Link>
  );
};

export default ProblemCard;
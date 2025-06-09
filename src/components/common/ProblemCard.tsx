import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award, ChevronRight, Zap, Star } from 'lucide-react';
import { Problem } from '../../types';
import DifficultyBadge from './DifficultyBadge';

type ViewMode = 'grid' | 'list';

interface ProblemCardProps {
  problem: Problem;
  viewMode: ViewMode;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, viewMode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/problem/${problem.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className="card-modern p-6 interaction-full cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-100 group-hover:text-primary-300 transition-colors">
                {problem.title}
              </h3>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            
            <p className="text-gray-300 line-clamp-2 mb-4 leading-relaxed">
              {problem.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-1.5 rounded-lg bg-gray-800/50">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-medium">{problem.timeLimit} min</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-1.5 rounded-lg bg-gray-800/50">
                  <Users className="h-4 w-4" />
                </div>
                <span className="font-medium">{problem.solvedCount || 0} solved</span>
              </div>
              
              {problem.averageScore && (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="p-1.5 rounded-lg bg-gray-800/50">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{problem.averageScore}% avg</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-6 flex items-center">
            <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
              <ChevronRight className="h-5 w-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="card-modern p-6 interaction-full cursor-pointer group relative overflow-hidden"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{problem.timeLimit} min</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
          {problem.title}
        </h3>
        
        <p className="text-gray-300 line-clamp-3 mb-6 leading-relaxed">
          {problem.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="p-1 rounded bg-gray-800/50">
                <Users className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium">{problem.solvedCount || 0}</span>
            </div>
            
            {problem.averageScore && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-1 rounded bg-gray-800/50">
                  <Star className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">{problem.averageScore}%</span>
              </div>
            )}
          </div>
          
          <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors group-hover:scale-110 transform duration-200">
            <Zap className="h-4 w-4 text-primary-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
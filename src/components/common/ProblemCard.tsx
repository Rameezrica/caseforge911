import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award, ChevronRight } from 'lucide-react';
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
        className="bg-dark-800 border border-dark-700 rounded-xl p-4 hover:border-emerald-500/50 transition-colors duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-dark-50">{problem.title}</h3>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <p className="text-dark-400 line-clamp-2 mb-3">{problem.description}</p>
            <div className="flex items-center gap-4 text-sm text-dark-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{problem.timeLimit} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{problem.solvedCount ?? 0} solved</span>
              </div>
              {problem.averageScore && (
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{problem.averageScore}% avg</span>
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-dark-400" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <DifficultyBadge difficulty={problem.difficulty} />
        <div className="flex items-center gap-1 text-dark-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{problem.timeLimit} min</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-dark-50 mb-2 line-clamp-2">{problem.title}</h3>
      <p className="text-dark-400 line-clamp-3 mb-4">{problem.description}</p>

      <div className="flex items-center justify-between text-sm text-dark-400">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{problem.solvedCount ?? 0} solved</span>
        </div>
        {problem.averageScore && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{problem.averageScore}% avg</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;
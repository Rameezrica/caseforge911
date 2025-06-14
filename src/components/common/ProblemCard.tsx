import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award, ChevronRight } from 'lucide-react';
import { Problem } from '../../types';
import DifficultyBadge from './DifficultyBadge';
import { Card } from '../ui/Card';

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
      <Card
        className="p-4 card-interactive"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <p className="text-muted-foreground truncate-2 mb-3">{problem.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{problem.timeLimit} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{problem.solvedCount || 0} solved</span>
              </div>
              {problem.averageScore && (
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{problem.averageScore}% avg</span>
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-6 card-interactive"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <DifficultyBadge difficulty={problem.difficulty} />
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{problem.timeLimit} min</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 truncate-2">{problem.title}</h3>
      <p className="text-muted-foreground truncate-3 mb-4">{problem.description}</p>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{problem.solvedCount || 0} solved</span>
        </div>
        {problem.averageScore && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{problem.averageScore}% avg</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProblemCard;
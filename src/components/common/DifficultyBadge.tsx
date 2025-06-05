import React from 'react';
import { Star } from 'lucide-react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Hard':
        return 'bg-orange-500/20 text-orange-500';
      case 'Expert':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-dark-700 text-dark-300';
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      default: // md
        return 'text-sm px-2.5 py-0.5';
    }
  };

  const getStarCount = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 1;
      case 'Medium':
        return 2;
      case 'Hard':
        return 3;
      case 'Expert':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className={`inline-flex items-center rounded-full ${getDifficultyColor(difficulty)} ${getSizeClasses(size)}`}>
      {Array.from({ length: getStarCount(difficulty) }).map((_, index) => (
        <Star key={index} className="h-3 w-3 fill-current mr-0.5" />
      ))}
      <span className="font-medium ml-0.5">{difficulty}</span>
    </div>
  );
};

export default DifficultyBadge;
import React from 'react';
import { Difficulty } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const getColorClasses = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-md px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };

  return (
    <span 
      className={`font-medium rounded-full inline-flex items-center justify-center ${getColorClasses()} ${getSizeClasses()}`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
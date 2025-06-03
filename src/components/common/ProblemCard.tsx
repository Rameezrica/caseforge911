import React from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../../types';
import { Star, Users, Clock, TrendingUp, BookOpen, Award } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const getDifficultyColor = () => {
    switch (problem.difficulty) {
      case 'Easy':
        return 'bg-emerald-900 text-emerald-200';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-200';
      case 'Hard':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-dark-700 text-dark-200';
    }
  };

  return (
    <Link 
      to={`/problem/${problem.id}`}
      className="block bg-dark-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-dark-700 hover:border-dark-600"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`${getDifficultyColor()} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                {problem.difficulty}
              </span>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">4.8</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-dark-50">{problem.title}</h3>
          </div>
        </div>
        
        <p className="text-dark-300 text-sm mb-4 line-clamp-2">{problem.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-dark-400">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{problem.category}</span>
          </div>
          <div className="flex items-center text-dark-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>{problem.timeLimit} min</span>
          </div>
          <div className="flex items-center text-dark-400">
            <Users className="h-4 w-4 mr-1" />
            <span>2.5k solved</span>
          </div>
          <div className="flex items-center text-dark-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{problem.successRate}% success</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-dark-700 text-dark-200 rounded-full px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-dark-400">
            <Award className="h-4 w-4 mr-1" />
            <span>Top companies</span>
          </div>
          <button className="text-emerald-500 hover:text-emerald-400 font-medium">
            Start Solving
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
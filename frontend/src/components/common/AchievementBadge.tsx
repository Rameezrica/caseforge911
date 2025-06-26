import React from 'react';
import { Achievement } from '../../types';
import { Award, Briefcase, TrendingUp, Circle, Users, Star } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, earned = true }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'briefcase':
        return <Briefcase className="h-6 w-6" />;
      case 'trending-up':
        return <TrendingUp className="h-6 w-6" />;
      case 'circle':
        return <Circle className="h-6 w-6" />;
      case 'users':
        return <Users className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div 
      className={`flex items-center p-3 rounded-lg ${
        earned 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' 
          : 'bg-gray-100 border border-gray-200 opacity-60'
      }`}
    >
      <div className={`rounded-full p-2 mr-3 ${
        earned 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' 
          : 'bg-gray-300 text-gray-500'
      }`}>
        {getIcon()}
      </div>
      <div>
        <h4 className={`font-medium text-sm ${earned ? 'text-blue-800' : 'text-gray-600'}`}>
          {achievement.name}
        </h4>
        <p className={`text-xs ${earned ? 'text-blue-600' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
        {earned && achievement.earnedOn && (
          <p className="text-xs text-blue-500 mt-1">Earned on {new Date(achievement.earnedOn).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
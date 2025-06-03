import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, TrendingUp, PackageCheck, BarChart, LightbulbIcon, Database
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  count: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, count }) => {
  const getCategoryInfo = () => {
    switch (category) {
      case 'Strategy & Consulting':
        return {
          icon: <Briefcase className="h-8 w-8" />,
          color: 'from-blue-500 to-blue-600',
          textColor: 'text-blue-100'
        };
      case 'Finance & Investment':
        return {
          icon: <TrendingUp className="h-8 w-8" />,
          color: 'from-green-500 to-green-600',
          textColor: 'text-green-100'
        };
      case 'Operations & Supply Chain':
        return {
          icon: <PackageCheck className="h-8 w-8" />,
          color: 'from-orange-500 to-orange-600',
          textColor: 'text-orange-100'
        };
      case 'Marketing & Growth':
        return {
          icon: <BarChart className="h-8 w-8" />,
          color: 'from-purple-500 to-purple-600',
          textColor: 'text-purple-100'
        };
      case 'Entrepreneurship':
        return {
          icon: <LightbulbIcon className="h-8 w-8" />,
          color: 'from-yellow-500 to-yellow-600',
          textColor: 'text-yellow-100'
        };
      case 'Data Analysis & Business Intelligence':
        return {
          icon: <Database className="h-8 w-8" />,
          color: 'from-indigo-500 to-indigo-600',
          textColor: 'text-indigo-100'
        };
      default:
        return {
          icon: <Briefcase className="h-8 w-8" />,
          color: 'from-gray-500 to-gray-600',
          textColor: 'text-gray-100'
        };
    }
  };

  const { icon, color, textColor } = getCategoryInfo();

  return (
    <Link 
      to={`/problems?category=${encodeURIComponent(category)}`}
      className="flex flex-col items-center bg-gradient-to-br rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
      style={{ height: '180px' }}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${color}`}>
        <div className="mb-4">
          {icon}
        </div>
        <h3 className={`text-center font-semibold ${textColor} mb-1`}>
          {category}
        </h3>
        <p className={`text-sm font-medium ${textColor} opacity-90`}>
          {count} problems
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
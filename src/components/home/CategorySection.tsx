import React from 'react';
import { Link } from 'react-router-dom';
import { problems } from '../../data/mockData';
import { Category } from '../../types';
import CategoryCard from '../common/CategoryCard';

const CategorySection: React.FC = () => {
  // Count problems by category
  const categories: Category[] = [
    'Strategy & Consulting',
    'Finance & Investment',
    'Operations & Supply Chain',
    'Marketing & Growth',
    'Entrepreneurship',
    'Data Analysis & Business Intelligence'
  ];
  
  const getCategoryCount = (category: Category) => {
    return problems.filter(problem => problem.category === category).length;
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Case Categories
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Build expertise across all business domains with our diverse case library
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category}
              category={category}
              count={getCategoryCount(category)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/problems" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View All Problems
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
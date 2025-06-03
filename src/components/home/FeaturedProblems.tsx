import React from 'react';
import ProblemCard from '../common/ProblemCard';
import { Link } from 'react-router-dom';
import { problems } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

const FeaturedProblems: React.FC = () => {
  // Get 3 problems to feature (in a real app, you might want to curate these)
  const featuredProblems = problems.slice(0, 3);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Cases
            </h2>
            <p className="text-lg text-gray-600">
              Start with these popular business challenges
            </p>
          </div>
          <Link 
            to="/problems" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProblems;
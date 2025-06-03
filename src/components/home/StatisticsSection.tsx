import React from 'react';
import { siteStats } from '../../data/mockData';
import { Users, BookOpen, Award, Zap } from 'lucide-react';

const StatisticsSection: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Join the Business Case Revolution
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {siteStats.totalProblems}
            </div>
            <p className="text-gray-600 font-medium">Business Cases</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {siteStats.totalUsers.toLocaleString()}
            </div>
            <p className="text-gray-600 font-medium">Active Users</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {siteStats.totalProblemsSolved.toLocaleString()}
            </div>
            <p className="text-gray-600 font-medium">Solutions Submitted</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-100 rounded-full mb-4">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {siteStats.activeCommunityMembers.toLocaleString()}
            </div>
            <p className="text-gray-600 font-medium">Community Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AchievementBadge from '../components/common/AchievementBadge';
import { 
  User, Settings, BookOpen, BarChart2, Award, CheckCircle,
  TrendingUp, Calendar, ArrowRight, ExternalLink 
} from 'lucide-react';
import { achievements } from '../data/mockData';

const ProfilePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Profile - CaseForge';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="bg-blue-800 h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-blue-700">
                {/* Placeholder for user initials */}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Placeholder Name</h1>
              <div className="flex flex-wrap items-center text-blue-100 gap-y-2">
                <span className="flex items-center mr-4">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {/* Placeholder for problems solved */} problems solved
                </span>
                {/* Placeholder for university */}
                <span className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {/* Placeholder for joined date */}
                </span>
              </div>
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
              <Link 
                to="/profile/edit" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-600"
              >
                <Settings className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Problems</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {/* Placeholder for problems solved */}
                </div>
                <p className="text-sm text-gray-600">
                  {/* Placeholder for problems solved text */}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {/* Placeholder for achievements */}
                </div>
                <p className="text-sm text-gray-600">
                  {/* Placeholder for achievements text */}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Streak</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  7
                </div>
                <p className="text-sm text-gray-600">
                  Current day streak
                </p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Link 
                  to="/profile/activity" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Yesterday</div>
                    <p className="mt-1 text-gray-900">
                      Solved <Link to="/problem/2" className="text-blue-600 hover:text-blue-800 font-medium">
                        Tech Startup Market Entry Strategy
                      </Link>
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">3 days ago</div>
                    <p className="mt-1 text-gray-900">
                      Commented on <Link to="/solution/2" className="text-blue-600 hover:text-blue-800 font-medium">
                        Morgan's solution
                      </Link> for Coffee Shop Pricing Strategy
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">1 week ago</div>
                    <p className="mt-1 text-gray-900">
                      Earned the <span className="font-medium">Strategy Expert</span> achievement
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress by Category */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress by Category</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Strategy & Consulting</span>
                    <span className="text-sm font-medium text-gray-700">10/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Finance & Investment</span>
                    <span className="text-sm font-medium text-gray-700">8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Operations & Supply Chain</span>
                    <span className="text-sm font-medium text-gray-700">5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Marketing & Growth</span>
                    <span className="text-sm font-medium text-gray-700">4/8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                <Link 
                  to="/profile/achievements" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {/* Placeholder for achievements */}
                {/* Next achievement to earn */}
                {/* Placeholder for next achievement */}
              </div>
            </div>
            
            {/* Suggested Problems */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Cases</h2>
              
              <div className="space-y-4">
                <Link 
                  to="/problem/3" 
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <h3 className="font-medium text-gray-900 mb-1">Airline Recovery Strategy</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                      Hard
                    </span>
                    <span>Operations & Supply Chain</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">View problem</span>
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </div>
                </Link>
                
                <Link 
                  to="/problem/5" 
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <h3 className="font-medium text-gray-900 mb-1">Tech Company Merger Analysis</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                      Hard
                    </span>
                    <span>Finance & Investment</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">View problem</span>
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </div>
                </Link>
              </div>
              
              <div className="mt-4">
                <Link 
                  to="/problems" 
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
                >
                  View all problems
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
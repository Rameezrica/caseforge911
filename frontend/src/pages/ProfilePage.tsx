import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, BookOpen, BarChart2, Award, CheckCircle,
  TrendingUp, Calendar, ArrowRight, ExternalLink 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Profile - CaseForge';
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <div className="bg-dark-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="bg-emerald-500 h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold text-dark-900 border-4 border-emerald-400">
                AJ
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-50 mb-2">Alex Johnson</h1>
              <div className="flex flex-wrap items-center text-dark-400 gap-y-2">
                <span className="flex items-center mr-4">
                  <BookOpen className="h-4 w-4 mr-1" />
                  27 problems solved
                </span>
                <span className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined March 2024
                </span>
              </div>
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
              <Link 
                to="/profile/edit" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-50 bg-dark-700 hover:bg-dark-600"
              >
                <Settings className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-emerald-500 mr-2" />
                  <h3 className="text-lg font-semibold text-dark-50">Problems</h3>
                </div>
                <div className="text-3xl font-bold text-dark-50 mb-2">
                  27
                </div>
                <p className="text-sm text-dark-400">
                  Solved this month
                </p>
              </div>
              
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-emerald-500 mr-2" />
                  <h3 className="text-lg font-semibold text-dark-50">Badges</h3>
                </div>
                <div className="text-3xl font-bold text-dark-50 mb-2">
                  5
                </div>
                <p className="text-sm text-dark-400">
                  Achievements earned
                </p>
              </div>
              
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                  <h3 className="text-lg font-semibold text-dark-50">Streak</h3>
                </div>
                <div className="text-3xl font-bold text-dark-50 mb-2">
                  7
                </div>
                <p className="text-sm text-dark-400">
                  Current day streak
                </p>
              </div>
            </div>
            
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-50">Recent Activity</h2>
                <Link 
                  to="/profile/activity" 
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400">Yesterday</div>
                    <p className="mt-1 text-dark-200">
                      Solved <Link to="/problem/2" className="text-emerald-500 hover:text-emerald-400 font-medium">
                        Tech Startup Market Entry Strategy
                      </Link>
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-900 flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-400">1 week ago</div>
                    <p className="mt-1 text-dark-200">
                      Earned the <span className="font-medium">Strategy Expert</span> achievement
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-dark-50 mb-6">Progress by Category</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-dark-300">Strategy & Consulting</span>
                    <span className="text-sm font-medium text-dark-300">10/15</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '66.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-dark-300">Finance & Investment</span>
                    <span className="text-sm font-medium text-dark-300">8/12</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '66.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-dark-300">Operations & Supply Chain</span>
                    <span className="text-sm font-medium text-dark-300">5/10</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-dark-300">Marketing & Growth</span>
                    <span className="text-sm font-medium text-dark-300">4/8</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-dark-50">Achievements</h2>
                <Link 
                  to="/profile/achievements" 
                  className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-dark-700 rounded-lg">
                  <div className="rounded-full p-2 mr-3 bg-yellow-500 text-dark-900">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-dark-50">Strategy Expert</h4>
                    <p className="text-xs text-dark-400">Solved 10 strategy cases</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-dark-50 mb-4">Recommended Cases</h2>
              
              <div className="space-y-4">
                <Link 
                  to="/problem/3" 
                  className="block p-4 border border-dark-600 rounded-lg hover:bg-dark-700 transition-colors duration-200"
                >
                  <h3 className="font-medium text-dark-50 mb-1">Airline Recovery Strategy</h3>
                  <div className="flex items-center text-sm text-dark-400 mb-2">
                    <span className="bg-red-900 text-red-200 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                      Hard
                    </span>
                    <span>Operations & Supply Chain</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-500">View problem</span>
                    <ExternalLink className="h-4 w-4 text-emerald-500" />
                  </div>
                </Link>
                
                <Link 
                  to="/problem/5" 
                  className="block p-4 border border-dark-600 rounded-lg hover:bg-dark-700 transition-colors duration-200"
                >
                  <h3 className="font-medium text-dark-50 mb-1">Tech Company Merger Analysis</h3>
                  <div className="flex items-center text-sm text-dark-400 mb-2">
                    <span className="bg-red-900 text-red-200 rounded-full px-2 py-0.5 text-xs font-medium mr-2">
                      Hard
                    </span>
                    <span>Finance & Investment</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-500">View problem</span>
                    <ExternalLink className="h-4 w-4 text-emerald-500" />
                  </div>
                </Link>
              </div>
              
              <div className="mt-4">
                <Link 
                  to="/problems" 
                  className="block text-center text-emerald-500 hover:text-emerald-400 text-sm font-medium py-2"
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
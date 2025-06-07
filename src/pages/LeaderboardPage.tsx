import React, { useEffect, useState } from 'react';
import { leaderboard } from '../data/mockData';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');
  const [category, setCategory] = useState<'all' | 'problems' | 'solutions' | 'community'>('all');
  
  useEffect(() => {
    document.title = 'Leaderboard - CaseForge';
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-600 font-medium">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <div className="bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-dark-50 mb-4">Leaderboard</h1>
          <p className="text-xl text-dark-400 max-w-2xl mx-auto">
            See how you stack up against other business case solvers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Timeframe</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeframe('all-time')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    timeframe === 'all-time'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    timeframe === 'monthly'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    timeframe === 'weekly'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Category</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCategory('all')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    category === 'all'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setCategory('problems')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    category === 'problems'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  Problems Solved
                </button>
                <button
                  onClick={() => setCategory('solutions')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    category === 'solutions'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  Best Solutions
                </button>
                <button
                  onClick={() => setCategory('community')}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    category === 'community'
                      ? 'bg-emerald-500 text-dark-900 font-medium'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  Community
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Problems Solved
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  University
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Achievement
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {leaderboard.map((user) => (
                <tr key={user.userId} className="hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-dark-900 font-medium">{user.userName.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-dark-50">{user.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-200">
                    {user.problemsSolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-400">
                    {user.rank === 1 && "Harvard Business School"}
                    {user.rank === 2 && "Stanford GSB"}
                    {user.rank === 3 && "Wharton"}
                    {user.rank > 3 && "University"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.rank <= 3 ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200">
                        Top Performer
                      </span>
                    ) : user.rank <= 5 ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900 text-emerald-200">
                        Rising Star
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-dark-700 text-dark-300">
                        Case Solver
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-dark-400 mb-4">
            Rankings are updated daily. Keep solving problems to improve your position!
          </p>
          <a 
            href="#" 
            className="inline-flex items-center text-emerald-500 hover:text-emerald-400"
          >
            <Trophy className="h-4 w-4 mr-1" />
            View historical rankings
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
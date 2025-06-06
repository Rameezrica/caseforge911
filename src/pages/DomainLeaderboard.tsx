import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDomain } from '../context/DomainContext';
import { apiService, LeaderboardEntry, DomainStats } from '../services/api';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Filter,
  Users
} from 'lucide-react';

const DomainLeaderboard: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const { selectedDomain } = useDomain();
  const currentDomain = domain || selectedDomain;
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [domainStats, setDomainStats] = useState<DomainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    if (currentDomain) {
      fetchLeaderboardData();
    }
  }, [currentDomain, timeFilter]);

  const fetchLeaderboardData = async () => {
    if (!currentDomain) return;
    
    try {
      setLoading(true);
      const [leaderboardData, stats] = await Promise.all([
        apiService.getDomainLeaderboard(currentDomain, 100),
        apiService.getDomainStats(currentDomain)
      ]);

      setLeaderboard(leaderboardData.leaderboard);
      setDomainStats(stats);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentDomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Domain Not Found</h1>
          <p className="text-dark-400">Please select a valid domain.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />;
    return <Trophy className="h-5 w-5 text-dark-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
    if (rank <= 10) return 'bg-emerald-500/20 text-emerald-400';
    return 'bg-dark-700 text-dark-300';
  };

  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'text-green-500',
      purple: 'text-purple-500',
      blue: 'text-blue-500',
      orange: 'text-orange-500',
      cyan: 'text-cyan-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-blue-500';
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-50 mb-2">
                {currentDomain} Leaderboard
              </h1>
              <p className="text-dark-400">
                Top performers in {currentDomain.toLowerCase()} case studies
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-dark-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as 'all' | 'week' | 'month')}
                  className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-dark-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Total Participants</p>
                  <p className="text-2xl font-bold text-dark-50">{leaderboard.length}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Problems Available</p>
                  <p className="text-2xl font-bold text-dark-50">{domainStats?.total_problems || 0}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Solutions Submitted</p>
                  <p className="text-2xl font-bold text-dark-50">{domainStats?.total_solutions || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Top Score</p>
                  <p className="text-2xl font-bold text-dark-50">
                    {leaderboard.length > 0 ? leaderboard[0].total_score : 0}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <div className="flex items-end justify-center gap-8 mb-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30 rounded-xl p-6 mb-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-dark-900">2</span>
                  </div>
                  <h3 className="font-bold text-dark-50 mb-1">{leaderboard[1].username}</h3>
                  <p className="text-sm text-dark-400 mb-2">{leaderboard[1].level_title}</p>
                  <p className="text-lg font-bold text-gray-400">{leaderboard[1].total_score}</p>
                  <p className="text-xs text-dark-500">{leaderboard[1].problems_solved} solved</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-8 mb-4 transform scale-110">
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-dark-900">1</span>
                  </div>
                  <h3 className="font-bold text-dark-50 mb-1 text-lg">{leaderboard[0].username}</h3>
                  <p className="text-sm text-dark-400 mb-2">{leaderboard[0].level_title}</p>
                  <p className="text-xl font-bold text-yellow-500">{leaderboard[0].total_score}</p>
                  <p className="text-xs text-dark-500">{leaderboard[0].problems_solved} solved</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 mb-4">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-bold text-dark-50 mb-1">{leaderboard[2].username}</h3>
                  <p className="text-sm text-dark-400 mb-2">{leaderboard[2].level_title}</p>
                  <p className="text-lg font-bold text-orange-500">{leaderboard[2].total_score}</p>
                  <p className="text-xs text-dark-500">{leaderboard[2].problems_solved} solved</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
          <div className="p-6 border-b border-dark-700">
            <h2 className="text-xl font-bold text-dark-50">Full Rankings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Problems</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {leaderboard.map((entry) => (
                  <tr key={entry.user_id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadge(entry.rank)}`}>
                          {entry.rank <= 3 ? '' : entry.rank}
                        </span>
                        {entry.rank <= 3 && (
                          <span className="ml-2">
                            {getRankIcon(entry.rank)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-dark-300">
                            {entry.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-dark-50">{entry.username}</div>
                          <div className="text-xs text-dark-400">Level {entry.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900 text-emerald-200">
                        {entry.level_title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark-50">
                      {entry.total_score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {entry.problems_solved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.streak > 0 && (
                          <>
                            <span className="text-sm font-medium text-orange-500">{entry.streak}</span>
                            <span className="ml-1 text-orange-500">🔥</span>
                          </>
                        )}
                        {entry.streak === 0 && (
                          <span className="text-sm text-dark-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {entry.domain_xp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-400">
                      {formatTimeSince(entry.last_active)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainLeaderboard;
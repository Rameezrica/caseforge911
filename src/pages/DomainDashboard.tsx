import React, { useState, useEffect } from 'react';
import { useDomain } from '../context/DomainContext';
import { apiService, DomainStats, LeaderboardEntry, LearningPath, Discussion } from '../services/api';
import { 
  Calculator, 
  Brain, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Trophy,
  Clock,
  Star,
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  Award,
  Play,
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DomainDashboard: React.FC = () => {
  const { selectedDomain, domainProgress } = useDomain();
  const [domainStats, setDomainStats] = useState<DomainStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDomain) {
      fetchDomainData();
    }
  }, [selectedDomain]);

  const fetchDomainData = async () => {
    if (!selectedDomain) return;
    
    try {
      setLoading(true);
      const [stats, leaderboardData, pathsData, discussionsData] = await Promise.all([
        apiService.getDomainStats(selectedDomain),
        apiService.getDomainLeaderboard(selectedDomain, 10),
        apiService.getDomainLearningPaths(selectedDomain),
        apiService.getDomainDiscussions(selectedDomain, 5)
      ]);

      setDomainStats(stats);
      setLeaderboard(leaderboardData.leaderboard);
      setLearningPaths(pathsData);
      setDiscussions(discussionsData);
    } catch (error) {
      console.error('Error fetching domain data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">No Domain Selected</h1>
          <p className="text-dark-400">Please select a domain to view your personalized dashboard.</p>
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

  const getDomainIcon = (domainName: string) => {
    switch (domainName) {
      case 'Finance & Investment':
        return <Calculator className="h-6 w-6" />;
      case 'Strategy & Consulting':
        return <Brain className="h-6 w-6" />;
      case 'Operations & Supply Chain':
        return <Target className="h-6 w-6" />;
      case 'Marketing & Growth':
        return <BarChart3 className="h-6 w-6" />;
      case 'Data Analytics':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Users className="h-6 w-6" />;
    }
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

  const currentLevel = domainProgress?.level || 1;
  const currentXP = domainProgress?.experience_points || 0;
  const domainLevels = domainStats?.domain_info?.levels || {};
  const nextLevel = currentLevel + 1;
  const nextLevelXP = domainLevels[nextLevel]?.xp_required || 1000;
  const currentLevelXP = domainLevels[currentLevel]?.xp_required || 0;
  const progressToNextLevel = Math.min(100, ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className={`${getColorClasses(domainStats?.domain_info?.color || 'blue')} mr-3`}>
              {getDomainIcon(selectedDomain)}
            </div>
            <h1 className="text-3xl font-bold text-dark-50">{selectedDomain} Dashboard</h1>
          </div>
          <p className="text-dark-400">Your personalized dashboard for {selectedDomain.toLowerCase()} mastery</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Progress Card */}
          <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark-50">Your Progress</h2>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-dark-300">Level {currentLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-dark-50 mb-1">
                  {domainProgress?.problems_solved || 0}
                </div>
                <div className="text-sm text-dark-400">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-dark-50 mb-1">
                  {Math.round(domainProgress?.average_score || 0)}%
                </div>
                <div className="text-sm text-dark-400">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-dark-50 mb-1">
                  {domainProgress?.streak || 0}
                </div>
                <div className="text-sm text-dark-400">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-dark-50 mb-1">
                  {Math.round((domainProgress?.time_spent || 0) / 60)}h
                </div>
                <div className="text-sm text-dark-400">Time Spent</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-300">
                  {domainLevels[currentLevel]?.title || 'Beginner'}
                </span>
                <span className="text-sm text-dark-400">
                  {currentXP} / {nextLevelXP} XP
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r from-${domainStats?.domain_info?.color || 'blue'}-500 to-${domainStats?.domain_info?.color || 'blue'}-600 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              <div className="text-xs text-dark-500 mt-1">
                {nextLevelXP - currentXP} XP to {domainLevels[nextLevel]?.title || 'Next Level'}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-dark-50 mb-4">Domain Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Total Problems</span>
                <span className="text-dark-50 font-medium">{domainStats?.total_problems || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Your Completion</span>
                <span className="text-dark-50 font-medium">
                  {domainStats?.total_problems ? Math.round(((domainProgress?.problems_solved || 0) / domainStats.total_problems) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Community Solutions</span>
                <span className="text-dark-50 font-medium">{domainStats?.total_solutions || 0}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-700">
              <h4 className="text-sm font-medium text-dark-300 mb-3">Difficulty Progress</h4>
              <div className="space-y-2">
                {Object.entries(domainStats?.difficulty_distribution || {}).map(([difficulty, count]) => (
                  <div key={difficulty} className="flex items-center justify-between text-sm">
                    <span className={`${
                      difficulty === 'Easy' ? 'text-green-500' :
                      difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {difficulty}
                    </span>
                    <span className="text-dark-400">{count} problems</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Paths */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-50">Learning Paths</h3>
              <Link to={`/domain/${selectedDomain}/learning-paths`} className="text-emerald-500 hover:text-emerald-400 text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <div key={path.id} className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-dark-50">{path.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      path.level === 'Beginner' ? 'bg-green-900 text-green-200' :
                      path.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {path.level}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400 mb-3">{path.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-dark-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {path.estimated_duration} weeks
                      </span>
                      <span className="text-dark-500">
                        <BookOpen className="h-4 w-4 inline mr-1" />
                        {path.problems?.length || 0} problems
                      </span>
                    </div>
                    <button className="text-emerald-500 hover:text-emerald-400 flex items-center">
                      Start
                      <Play className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-50">Domain Leaderboard</h3>
              <Link to={`/domain/${selectedDomain}/leaderboard`} className="text-emerald-500 hover:text-emerald-400 text-sm">
                View Full
              </Link>
            </div>
            
            <div className="space-y-3">
              {leaderboard.slice(0, 8).map((entry) => (
                <div key={entry.user_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-dark-900' :
                      entry.rank === 2 ? 'bg-gray-400 text-dark-900' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-dark-600 text-dark-300'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <div className="font-medium text-dark-50">{entry.username}</div>
                      <div className="text-xs text-dark-400">{entry.level_title}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-dark-50">{entry.total_score}</div>
                    <div className="text-xs text-dark-400">{entry.problems_solved} solved</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discussions */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-50">Community Discussions</h3>
              <Link to={`/domain/${selectedDomain}/community`} className="text-emerald-500 hover:text-emerald-400 text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="border-b border-dark-700 pb-3 last:border-b-0">
                  <h4 className="font-medium text-dark-50 mb-1 hover:text-emerald-400 cursor-pointer">
                    {discussion.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-dark-400">
                    <span>by {discussion.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Trophy className="h-3 w-3 mr-1" />
                        {discussion.upvotes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {discussion.replies}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <h3 className="text-xl font-bold text-dark-50 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link
                to={`/problems?domain=${selectedDomain}`}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse {selectedDomain} Problems
              </Link>
              
              <Link
                to={`/domain/${selectedDomain}/daily-challenge`}
                className="w-full bg-dark-700 hover:bg-dark-600 text-dark-200 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Today's Challenge
              </Link>
              
              <Link
                to={`/domain/${selectedDomain}/workspace`}
                className="w-full bg-dark-700 hover:bg-dark-600 text-dark-200 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                <Activity className="h-5 w-5 mr-2" />
                Open Workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainDashboard;
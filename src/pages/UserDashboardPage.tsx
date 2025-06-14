import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Award,
  Flame,
  Star,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserSolutions, Solution } from '../services/userApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const UserDashboardPage: React.FC = () => {
  const { user, userProgress, refreshUserData } = useAuth();
  const [recentSolutions, setRecentSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await refreshUserData();
      const solutions = await getUserSolutions();
      setRecentSolutions(solutions.slice(0, 5)); // Get last 5 solutions
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const stats = [
    {
      title: 'Problems Solved',
      value: userProgress?.total_problems_solved || 0,
      icon: BookOpen,
      color: 'text-primary',
    },
    {
      title: 'Total Score',
      value: userProgress?.total_score || 0,
      icon: Trophy,
      color: 'text-warning',
    },
    {
      title: 'Current Streak',
      value: userProgress?.current_streak || 0,
      icon: Flame,
      color: 'text-orange-600',
    },
    {
      title: 'Longest Streak',
      value: userProgress?.longest_streak || 0,
      icon: Award,
      color: 'text-purple-600',
    },
  ];

  const difficultyStats = userProgress?.problems_by_difficulty || { easy: 0, medium: 0, hard: 0 };
  const totalSolved = difficultyStats.easy + difficultyStats.medium + difficultyStats.hard;

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome back, {user?.full_name || user?.username}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to tackle some challenging business cases today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-muted`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress by Difficulty */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-brand-400" />
            <h2 className="text-xl font-semibold text-white">Progress by Difficulty</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { level: 'Easy', count: difficultyStats.easy, color: 'bg-green-500', textColor: 'text-green-400' },
              { level: 'Medium', count: difficultyStats.medium, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
              { level: 'Hard', count: difficultyStats.hard, color: 'bg-red-500', textColor: 'text-red-400' },
            ].map((item) => {
              const percentage = totalSolved > 0 ? (item.count / totalSolved) * 100 : 0;
              return (
                <div key={item.level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${item.textColor}`}>{item.level}</span>
                    <span className="text-gray-400 text-sm">{item.count} problems</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-brand-400" />
            <h2 className="text-xl font-semibold text-white">Recent Solutions</h2>
          </div>

          {recentSolutions.length > 0 ? (
            <div className="space-y-3">
              {recentSolutions.map((solution, index) => (
                <div
                  key={solution.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 border border-dark-600"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-green-400' : 
                    index === 1 ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Solution #{solution.id.slice(0, 8)}...
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(solution.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  {solution.score && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">{solution.score}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No solutions yet</p>
              <p className="text-gray-500 text-sm">Start solving problems to see your progress here</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/problems"
            className="p-4 rounded-xl border border-dark-600 bg-dark-700/30 hover:bg-dark-700/50 transition-colors group"
          >
            <Target className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">Browse Problems</h3>
            <p className="text-gray-400 text-sm">Find new challenges to solve</p>
          </a>
          
          <a
            href="/daily-challenge"
            className="p-4 rounded-xl border border-dark-600 bg-dark-700/30 hover:bg-dark-700/50 transition-colors group"
          >
            <Calendar className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">Daily Challenge</h3>
            <p className="text-gray-400 text-sm">Today's featured problem</p>
          </a>
          
          <a
            href="/leaderboard"
            className="p-4 rounded-xl border border-dark-600 bg-dark-700/30 hover:bg-dark-700/50 transition-colors group"
          >
            <TrendingUp className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white mb-1">Leaderboard</h3>
            <p className="text-gray-400 text-sm">See how you rank</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Clock, 
  Award,
  Flame,
  Settings,
  LogOut,
  Edit3,
  Save,
  X,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserSolutions, Solution } from '../services/userApi';
import ThemeSelector from '../components/common/ThemeSelector';

const UserProfilePage: React.FC = () => {
  const { user, userProgress, logout, refreshUserData } = useAuth();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      await refreshUserData();
      const userSolutions = await getUserSolutions();
      setSolutions(userSolutions);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        full_name: user?.full_name || '',
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // TODO: Implement user profile update API
    console.log('Save profile changes:', editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 dark:border-brand-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user?.created_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const achievements = [
    {
      title: 'First Solution',
      description: 'Submitted your first solution',
      icon: BookOpen,
      earned: solutions.length > 0,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Problem Solver',
      description: 'Solved 10 problems',
      icon: Trophy,
      earned: (userProgress?.total_problems_solved || 0) >= 10,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Streak Master',
      description: 'Maintained a 7-day streak',
      icon: Flame,
      earned: (userProgress?.current_streak || 0) >= 7,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Dedicated Learner',
      description: 'Solved 50 problems',
      icon: Award,
      earned: (userProgress?.total_problems_solved || 0) >= 50,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-white">
                {user?.full_name || user?.username}
              </h1>
              <button
                onClick={handleEditToggle}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                {isEditing ? (
                  <X className="h-4 w-4 text-gray-400" />
                ) : (
                  <Edit3 className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <UserIcon className="h-4 w-4" />
                  <span>@{user?.username}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors">
              <Settings className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: userProgress?.total_problems_solved || 0 },
          { label: 'Total Score', value: userProgress?.total_score || 0 },
          { label: 'Current Streak', value: userProgress?.current_streak || 0 },
          { label: 'Solutions', value: solutions.length },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl border border-dark-700 bg-dark-800/50 text-center"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className={`p-4 rounded-xl border transition-all ${
                achievement.earned
                  ? `${achievement.bgColor} border-current ${achievement.color}`
                  : 'border-dark-600 bg-dark-700/30 grayscale'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                  <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.earned ? 'text-gray-300' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Solutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-dark-700 bg-dark-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-brand-400" />
          <h2 className="text-xl font-semibold text-white">Solution History</h2>
        </div>

        {solutions.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50 border border-dark-600"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    Solution #{solution.id.slice(0, 8)}...
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(solution.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                {solution.score && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20">
                    <Trophy className="h-3 w-3 text-yellow-400" />
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
            <p className="text-gray-500 text-sm">Start solving problems to build your history</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
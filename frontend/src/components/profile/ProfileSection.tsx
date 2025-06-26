import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Trophy, TrendingUp, Target, Star, Medal,
  ChevronRight, Settings, Crown, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileSection: React.FC = () => {
  const { user, userProfile, userProgress } = useAuth();

  if (!user) return null;

  // Calculate user rank based on total score (mock calculation)
  const totalScore = userProgress?.total_score || 0;
  const rank = totalScore >= 1000 ? 'Expert' : 
               totalScore >= 500 ? 'Advanced' : 
               totalScore >= 100 ? 'Intermediate' : 'Beginner';

  const rankColor = {
    'Expert': 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
    'Advanced': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    'Intermediate': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    'Beginner': 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
  }[rank];

  const rankIcon = {
    'Expert': <Crown className="h-4 w-4" />,
    'Advanced': <Medal className="h-4 w-4" />,
    'Intermediate': <Award className="h-4 w-4" />,
    'Beginner': <Star className="h-4 w-4" />
  }[rank];

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.user_metadata?.full_name || user.user_metadata?.username || user.email;
  const username = user.user_metadata?.username || user.email?.split('@')[0];
  const initials = getInitials(displayName);

  // Calculate next milestone
  const nextMilestone = totalScore < 100 ? 100 : 
                       totalScore < 500 ? 500 : 
                       totalScore < 1000 ? 1000 : 
                       totalScore < 2500 ? 2500 : 5000;
  
  const progressPercentage = (totalScore / nextMilestone) * 100;

  return (
    <div className="win11-card p-6">
      <div className="flex items-start gap-4">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg elevation-2">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {displayName}
            </h3>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${rankColor}`}>
              {rankIcon}
              {rank}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            @{username}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {userProgress?.total_problems_solved || 0}
              </div>
              <div className="text-xs text-muted-foreground">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {totalScore}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {userProgress?.current_streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress to {nextMilestone}</span>
              <span className="font-medium text-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-win11-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/profile"
          className="p-2 rounded-lg bg-win11-gray-100 hover:bg-win11-gray-200 transition-colors group"
          title="View Profile"
        >
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/problems"
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-win11-gray-50 hover:bg-win11-gray-100 transition-colors group"
          >
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Solve Cases</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          
          <Link
            to="/leaderboard"
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-win11-gray-50 hover:bg-win11-gray-100 transition-colors group"
          >
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">Leaderboard</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>

      {/* Achievement Preview */}
      {userProgress && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Recent Achievement</h4>
            <Link to="/profile" className="text-xs text-primary hover:text-primary/80">
              View All
            </Link>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Problem Solver</div>
              <div className="text-xs text-muted-foreground">Solved your first business case</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
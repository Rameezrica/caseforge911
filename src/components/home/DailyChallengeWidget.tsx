import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Trophy, 
  Flame, ArrowRight, TrendingUp, MessageSquare 
} from 'lucide-react';
import { DailyChallenge } from '../../types';

interface DailyChallengeWidgetProps {
  challenge: DailyChallenge;
  userStreak: number;
}

const DailyChallengeWidget: React.FC<DailyChallengeWidgetProps> = ({ challenge, userStreak }) => {
  const timeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-emerald-500 mr-2" />
          <h2 className="text-xl font-bold text-dark-50">Daily Challenge</h2>
        </div>
        <div className="flex items-center text-dark-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>Ends in {timeRemaining()}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="text-dark-400 mb-2">{formatDate(challenge.date)}</div>
          <h3 className="text-2xl font-bold text-dark-50 mb-4">{challenge.problem.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-dark-400">
              <Users className="h-4 w-4 mr-2" />
              {challenge.participants} participants
            </div>
            <div className="flex items-center text-dark-400">
              <Clock className="h-4 w-4 mr-2" />
              ~{challenge.averageTime} min avg
            </div>
            <div className="flex items-center text-dark-400">
              <TrendingUp className="h-4 w-4 mr-2" />
              {challenge.completionRate}% completion
            </div>
            <div className="flex items-center text-dark-400">
              <MessageSquare className="h-4 w-4 mr-2" />
              24 discussions
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to={`/problem/${challenge.problemId}/solve`}
              className="px-6 py-3 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center"
            >
              Start Challenge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/daily-challenges/leaderboard"
              className="px-6 py-3 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 transition-colors duration-200 flex items-center"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="lg:w-64 flex flex-col justify-between p-6 bg-dark-700 rounded-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-dark-200 font-medium">Your Streak</div>
              <div className="flex items-center text-orange-500">
                <Flame className="h-5 w-5 mr-1" />
                {userStreak} days
              </div>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(userStreak % 7) / 7 * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-dark-400">
              {7 - (userStreak % 7)} days until next badge
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-600">
            <Link
              to="/daily-challenges/history"
              className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center justify-center"
            >
              View Previous Solutions
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeWidget;
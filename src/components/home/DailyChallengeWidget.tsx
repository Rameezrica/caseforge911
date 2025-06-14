import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Users, Trophy, 
  Flame, ArrowRight, TrendingUp, MessageSquare 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DailyChallenge } from '../../services/api';

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

  // Handle both data structures: challenge.problem or challenge directly
  const problem = challenge?.problem || challenge;
  const challengeDate = challenge?.date || new Date().toISOString();
  const participants = challenge?.participants || 0;
  const completionRate = challenge?.completion_rate || 0;

  if (!problem) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-bold">Daily Challenge</h2>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading daily challenge...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-xl font-bold">Daily Challenge</h2>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Ends in {timeRemaining()}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="text-muted-foreground mb-2">{formatDate(challengeDate)}</div>
          <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {participants} participants
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              ~{problem.time_limit || 60} min avg
            </div>
            <div className="flex items-center text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              {(completionRate * 100).toFixed(1)}% completion
            </div>
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              24 discussions
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to={`/solve/${problem.id}`}>
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start Challenge
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline" leftIcon={<Trophy className="h-4 w-4" />}>
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:w-64 flex flex-col justify-between p-4 bg-muted rounded-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium">Your Streak</div>
              <div className="flex items-center text-orange-500">
                <Flame className="h-4 w-4 mr-1" />
                {userStreak} days
              </div>
            </div>
            <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(userStreak % 7) / 7 * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {7 - (userStreak % 7)} days until next badge
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Link
              to="/community"
              className="text-primary hover:text-primary/80 text-sm flex items-center justify-center transition-colors"
            >
              View Previous Solutions
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DailyChallengeWidget;
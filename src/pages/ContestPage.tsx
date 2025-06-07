import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Users, Calendar, Target, Award } from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: number;
  problems: number;
  difficulty: string;
  status: 'upcoming' | 'live' | 'completed';
}

const ContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past'>('upcoming');
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  const getRelativeDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const contests: Contest[] = [
    {
      id: '1',
      title: 'March Business Challenge',
      startTime: getRelativeDate(2).toISOString(),
      endTime: getRelativeDate(2).toISOString(),
      participants: 1234,
      problems: 6,
      difficulty: 'Medium-Hard',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Finance & Investment Sprint',
      startTime: getRelativeDate(5).toISOString(),
      endTime: getRelativeDate(5).toISOString(),
      participants: 856,
      problems: 4,
      difficulty: 'Hard',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Strategy Case Competition',
      startTime: new Date().toISOString(),
      endTime: getRelativeDate(1).toISOString(),
      participants: 2145,
      problems: 5,
      difficulty: 'Medium',
      status: 'live'
    },
    {
      id: '4',
      title: 'Consulting Case Sprint',
      startTime: getRelativeDate(-3).toISOString(),
      endTime: getRelativeDate(-3).toISOString(),
      participants: 1876,
      problems: 4,
      difficulty: 'Medium-Hard',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Operations Challenge',
      startTime: getRelativeDate(-7).toISOString(),
      endTime: getRelativeDate(-7).toISOString(),
      participants: 1543,
      problems: 5,
      difficulty: 'Hard',
      status: 'completed'
    }
  ];

  const filteredContests = contests.filter(contest => {
    switch (activeTab) {
      case 'upcoming':
        return contest.status === 'upcoming';
      case 'live':
        return contest.status === 'live';
      case 'past':
        return contest.status === 'completed';
      default:
        return true;
    }
  });

  useEffect(() => {
    const updateCountdown = () => {
      const nextContest = contests.find(c => c.status === 'upcoming');
      if (nextContest) {
        const now = new Date();
        const start = new Date(nextContest.startTime);
        const diff = start.getTime() - now.getTime();
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilNext(`${days}d ${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [contests]);

  const handleJoinContest = (contestId: string) => {
    console.log('Joining contest:', contestId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getContestStatus = (contest: Contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (now < start) {
      const diff = start.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Starts in ${days}d ${hours}h`;
    } else if (now > end) {
      return 'Completed';
    } else {
      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Ends in ${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-50 mb-2">Weekly Contests</h1>
            <p className="text-dark-400">Compete with others and improve your business case solving skills</p>
          </div>
          <div className="text-right">
            <div className="text-dark-400 mb-1">Next contest in</div>
            <div className="text-2xl font-bold text-emerald-500">{timeUntilNext}</div>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h2 className="text-xl font-bold text-dark-50 mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Contest Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-dark-200">
              <Clock className="h-5 w-5 text-emerald-500 mr-2" />
              Duration: 2 hours
            </div>
            <p className="text-dark-400">
              Complete all problems within the time limit
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-dark-200">
              <Target className="h-5 w-5 text-emerald-500 mr-2" />
              4-6 Problems
            </div>
            <p className="text-dark-400">
              Varying difficulty levels and domains
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-dark-200">
              <Award className="h-5 w-5 text-emerald-500 mr-2" />
              Points System
            </div>
            <p className="text-dark-400">
              Based on accuracy, time, and efficiency
            </p>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="flex border-b border-dark-700">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'upcoming'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'live'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Live Now
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'past'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Past Contests
          </button>
        </div>

        <div className="divide-y divide-dark-700">
          {filteredContests.map(contest => (
            <div key={contest.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-dark-50 mb-2">{contest.title}</h3>
                  <div className="flex items-center space-x-4 text-dark-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(contest.startTime)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {contest.participants} registered
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinContest(contest.id)}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    contest.status === 'completed'
                      ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                      : contest.status === 'live'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-emerald-500 text-dark-900 hover:bg-emerald-600'
                  }`}
                >
                  {contest.status === 'completed' ? 'View Results' : 
                   contest.status === 'live' ? 'Join Now' : 'Register'}
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-2 py-1 bg-dark-700 text-dark-200 rounded-full">
                  {contest.problems} problems
                </span>
                <span className="px-2 py-1 bg-dark-700 text-dark-200 rounded-full">
                  {contest.difficulty}
                </span>
                <span className="px-2 py-1 bg-dark-700 text-dark-200 rounded-full">
                  2 hours
                </span>
                <span className={`px-2 py-1 rounded-full ${
                  contest.status === 'live'
                    ? 'bg-red-900 text-red-200'
                    : contest.status === 'completed'
                    ? 'bg-dark-700 text-dark-400'
                    : 'bg-emerald-900 text-emerald-200'
                }`}>
                  {getContestStatus(contest)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
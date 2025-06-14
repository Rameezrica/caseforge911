import React, { useEffect, useState } from 'react';
import { leaderboard } from '../data/mockData';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');
  const [category, setCategory] = useState<'all' | 'problems' | 'solutions' | 'community'>('all');
  
  useEffect(() => {
    document.title = 'Leaderboard - CaseForge';
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-warning" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-warning/10 text-warning rounded-xl mx-auto">
          <Award className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how you stack up against other business case solvers
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Timeframe</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={timeframe === 'all-time' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('all-time')}
              >
                All Time
              </Button>
              <Button
                variant={timeframe === 'monthly' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('monthly')}
              >
                This Month
              </Button>
              <Button
                variant={timeframe === 'weekly' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('weekly')}
              >
                This Week
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === 'all' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCategory('all')}
              >
                Overall
              </Button>
              <Button
                variant={category === 'problems' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCategory('problems')}
              >
                Problems Solved
              </Button>
              <Button
                variant={category === 'solutions' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCategory('solutions')}
              >
                Best Solutions
              </Button>
              <Button
                variant={category === 'community' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCategory('community')}
              >
                Community
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Problems Solved
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  University
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Achievement
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {leaderboard.map((user) => (
                <tr key={user.userId} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <span className="font-medium">{user.userName.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{user.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {user.problemsSolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.rank === 1 && "Harvard Business School"}
                    {user.rank === 2 && "Stanford GSB"}
                    {user.rank === 3 && "Wharton"}
                    {user.rank > 3 && "University"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.rank <= 3 ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning/10 text-warning">
                        Top Performer
                      </span>
                    ) : user.rank <= 5 ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success/10 text-success">
                        Rising Star
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted text-muted-foreground">
                        Case Solver
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Footer */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Rankings are updated daily. Keep solving problems to improve your position!
        </p>
        <Button variant="outline" className="gap-2">
          <Trophy className="h-4 w-4" />
          View historical rankings
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
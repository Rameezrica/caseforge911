import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Trophy, BookOpen, Target, 
  TrendingUp, Users, Star, Clock, Briefcase, 
  BarChart2, Rocket, CheckCircle, 
  Brain, Play
} from 'lucide-react';
import DailyChallengeWidget from '../components/home/DailyChallengeWidget';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProfileSection from '../components/profile/ProfileSection';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useStats } from '../hooks/useStats';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useProblems } from '../hooks/useProblems';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { stats, loading: statsLoading } = useStats();
  const { challenge, loading: challengeLoading } = useDailyChallenge();
  const { problems, loading: problemsLoading } = useProblems({ limit: 10 });
  const { user, userProgress } = useAuth();
  
  const totalProblems = stats?.total_problems || 0;
  const solvedCount = userProgress?.total_problems_solved || 0;
  const currentStreak = userProgress?.current_streak || 0;
  const skillLevel = userProgress?.total_score >= 1000 ? "Expert" :
                    userProgress?.total_score >= 500 ? "Advanced" :
                    userProgress?.total_score >= 100 ? "Intermediate" : "Beginner";
  const nextMilestone = solvedCount < 25 ? 25 : solvedCount < 50 ? 50 : solvedCount < 100 ? 100 : 250;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!statsLoading && !challengeLoading && !problemsLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [statsLoading, challengeLoading, problemsLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const lastProblem = problems.length > 0 ? {
    id: problems[0].id,
    title: problems[0].title,
    progress: 65,
    timeRemaining: '45 minutes'
  } : null;

  const recommendedProblem = problems.length > 1 ? {
    id: problems[1].id,
    title: problems[1].title,
    difficulty: problems[1].difficulty,
    category: problems[1].category
  } : null;

  const domains = [
    {
      name: 'Finance',
      icon: <TrendingUp className="h-5 w-5" />,
      total: stats?.difficulty_distribution ? Object.values(stats.difficulty_distribution).reduce((a, b) => a + b, 0) : 0,
      easy: stats?.difficulty_distribution?.['Easy'] || 0,
      medium: stats?.difficulty_distribution?.['Medium'] || 0,
      hard: stats?.difficulty_distribution?.['Hard'] || 0,
      color: 'domain-finance'
    },
    {
      name: 'Operations',
      icon: <Target className="h-5 w-5" />,
      total: Math.floor((stats?.total_problems || 0) * 0.2),
      easy: Math.floor((stats?.total_problems || 0) * 0.08),
      medium: Math.floor((stats?.total_problems || 0) * 0.09),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'domain-operations'
    },
    {
      name: 'Strategy',
      icon: <Briefcase className="h-5 w-5" />,
      total: Math.floor((stats?.total_problems || 0) * 0.18),
      easy: Math.floor((stats?.total_problems || 0) * 0.07),
      medium: Math.floor((stats?.total_problems || 0) * 0.08),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'domain-strategy'
    },
    {
      name: 'Marketing',
      icon: <BarChart2 className="h-5 w-5" />,
      total: Math.floor((stats?.total_problems || 0) * 0.15),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.02),
      color: 'domain-marketing'
    },
    {
      name: 'Analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      total: Math.floor((stats?.total_problems || 0) * 0.16),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'domain-analytics'
    }
  ];

  const studyPlans = [
    {
      title: 'Investment Banking Prep',
      duration: '12 weeks',
      problems: 120,
      progress: 0,
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'domain-finance'
    },
    {
      title: 'Consulting Track',
      duration: '16 weeks',
      problems: 160,
      progress: 0,
      icon: <Briefcase className="h-4 w-4" />,
      color: 'domain-strategy'
    },
    {
      title: 'Product Management',
      duration: '10 weeks',
      problems: 100,
      progress: 0,
      icon: <Rocket className="h-4 w-4" />,
      color: 'domain-operations'
    },
    {
      title: 'Data Analytics',
      duration: '8 weeks',
      problems: 80,
      progress: 0,
      icon: <BarChart2 className="h-4 w-4" />,
      color: 'domain-analytics'
    }
  ];

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Welcome Message */}
          <div className="flex-1">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-xl elevation-2">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    Welcome back, {user?.user_metadata?.full_name || user?.user_metadata?.username || 'there'}! 👋
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Ready to tackle some challenging business cases today?
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/problems" className="win11-card card-hover p-6 text-center">
                <Target className="h-8 w-8 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold mb-2 text-foreground">Browse Problems</h3>
                <p className="text-sm text-muted-foreground">Find new challenges to solve</p>
              </Link>
              
              <Link to="/daily-challenge" className="win11-card card-hover p-6 text-center">
                <Star className="h-8 w-8 text-warning mb-3 mx-auto" />
                <h3 className="font-semibold mb-2 text-foreground">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground">Today's featured problem</p>
              </Link>
              
              <Link to="/leaderboard" className="win11-card card-hover p-6 text-center">
                <TrendingUp className="h-8 w-8 text-success mb-3 mx-auto" />
                <h3 className="font-semibold mb-2 text-foreground">Leaderboard</h3>
                <p className="text-sm text-muted-foreground">See how you rank</p>
              </Link>
            </div>
          </div>

          {/* Right Column - Profile Section */}
          <div className="lg:w-80">
            <ProfileSection />
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      {challenge && (
        <section className="mb-12">
          <DailyChallengeWidget 
            challenge={challenge}
            userStreak={currentStreak}
          />
        </section>
      )}

      {/* Stats Cards */}
      <section className="mb-12">
        <div className="win11-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Problems Solved",
                value: `${solvedCount}/${totalProblems}`,
                icon: <BookOpen className="h-5 w-5" />,
                color: "domain-finance",
                progress: (solvedCount/totalProblems) * 100
              },
              {
                label: "Current Streak",
                value: `${currentStreak} days`,
                icon: <Clock className="h-5 w-5" />,
                color: "domain-marketing",
                subtitle: "Keep solving to maintain streak!"
              },
              {
                label: "Skill Rating",
                value: skillLevel,
                icon: <Star className="h-5 w-5" />,
                color: "domain-operations",
                subtitle: `Solve ${nextMilestone - solvedCount} more to level up`
              },
              {
                label: "Next Milestone",
                value: `${nextMilestone} Problems`,
                icon: <Target className="h-5 w-5" />,
                color: "domain-strategy",
                progress: (solvedCount/nextMilestone) * 100
              }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-win11-gray-100 ${stat.color} elevation-1`}>
                  {stat.icon}
                </div>
                <h3 className="text-sm text-win11-gray-600 mb-2 font-medium">{stat.label}</h3>
                <p className="text-2xl font-bold mb-1 text-foreground">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-win11-gray-500">{stat.subtitle}</p>
                )}
                {stat.progress !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-win11-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-primary transition-all duration-500`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lastProblem && (
            <div className="win11-card card-hover cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-xl elevation-1">
                  <Play className="h-5 w-5" />
                </div>
                <span className="text-sm text-win11-gray-500 font-medium">{lastProblem.timeRemaining}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Resume Last Problem</h3>
              <p className="text-win11-gray-600 mb-4">{lastProblem.title}</p>
              <div className="space-y-3">
                <div className="w-full bg-win11-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${lastProblem.progress}%` }}
                  />
                </div>
                <p className="text-sm text-win11-gray-500 font-medium">{lastProblem.progress}% complete</p>
              </div>
            </div>
          )}

          {recommendedProblem && (
            <div className="win11-card card-hover cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-win11-gray-100 text-win11-gray-700 rounded-xl elevation-1">
                  <Target className="h-5 w-5" />
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  recommendedProblem.difficulty === 'Easy' ? 'difficulty-easy' :
                  recommendedProblem.difficulty === 'Medium' ? 'difficulty-medium' :
                  'difficulty-hard'
                }`}>
                  {recommendedProblem.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Recommended Next</h3>
              <p className="text-win11-gray-600 mb-4">{recommendedProblem.title}</p>
              <p className="text-sm text-win11-gray-500">
                Matches your skill level in {recommendedProblem.category}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Practice by Domain */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Practice by Domain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {domains.map((domain) => (
            <Link key={domain.name} to={`/problems?domain=${domain.name.toLowerCase()}`}>
              <div className="win11-card card-hover text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-win11-gray-100 ${domain.color} elevation-1`}>
                  {domain.icon}
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{domain.name}</h3>
                <div className="text-2xl font-bold mb-3 text-foreground">
                  {domain.total}
                </div>
                <div className="flex items-center justify-center space-x-3 text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{domain.easy} Easy</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{domain.medium} Med</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">{domain.hard} Hard</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Study Plans */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Study Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyPlans.map((plan) => (
            <div key={plan.title} className="win11-card card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-win11-gray-100 ${plan.color} elevation-1`}>
                  {plan.icon}
                </div>
                <span className="text-sm text-win11-gray-500 font-medium">{plan.duration}</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">{plan.title}</h3>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-win11-gray-600">{plan.problems} problems</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="w-full bg-win11-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
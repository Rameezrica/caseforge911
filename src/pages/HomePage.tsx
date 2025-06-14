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
  
  const totalProblems = stats?.total_problems || 0;
  const solvedCount = 0;
  const currentStreak = 7;
  const skillLevel = "Beginner";
  const nextMilestone = 25;
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
      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary text-primary-foreground rounded-xl elevation-2">
            <Brain className="h-8 w-8" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Master Business Cases</span>
            <br />
            <span className="text-foreground">Like Never Before</span>
          </h1>
          
          <p className="text-xl text-win11-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your business acumen with practical case studies across Finance, Operations, Strategy, Marketing & Analytics
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start Solving Cases
            </Button>
            <Button variant="outline" size="lg" leftIcon={<Trophy className="h-4 w-4" />}>
              View Contests
            </Button>
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
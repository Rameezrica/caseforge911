import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Trophy, BookOpen, Target, Award,
  TrendingUp, Users, Star, Clock, Briefcase, 
  BarChart2, Rocket, CheckCircle, Play, Zap,
  ChevronRight, Sparkles, Fire, Crown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import DailyChallengeWidget from '../components/home/DailyChallengeWidget';
import ServerStatus from '../components/ui/ServerStatus';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useStats } from '../hooks/useStats';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useProblems } from '../hooks/useProblems';

const HomePage = () => {
  const { stats, loading: statsLoading, isServerOnline: statsOnline, retry: retryStats } = useStats();
  const { challenge, loading: challengeLoading, isServerOnline: challengeOnline, retry: retryChallenge } = useDailyChallenge();
  const { problems, loading: problemsLoading, isServerOnline: problemsOnline, retry: retryProblems } = useProblems({ limit: 10 });
  
  const totalProblems = stats?.total_problems || 0;
  const solvedCount = 0;
  const currentStreak = 7;
  const skillLevel = "Beginner";
  const nextMilestone = 25;
  const [loading, setLoading] = useState(true);

  const isAnyServiceOffline = !statsOnline || !challengeOnline || !problemsOnline;

  useEffect(() => {
    if (!statsLoading && !challengeLoading && !problemsLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [statsLoading, challengeLoading, problemsLoading]);

  const handleRetryAll = () => {
    retryStats();
    retryChallenge();
    retryProblems();
  };

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
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      total: stats?.difficulty_distribution ? Object.values(stats.difficulty_distribution).reduce((a, b) => a + b, 0) : 0,
      easy: stats?.difficulty_distribution?.['Easy'] || 0,
      medium: stats?.difficulty_distribution?.['Medium'] || 0,
      hard: stats?.difficulty_distribution?.['Hard'] || 0,
      gradient: 'from-emerald-500/20 via-green-500/10 to-emerald-600/20',
      hoverGradient: 'hover:from-emerald-500/30 hover:via-green-500/20 hover:to-emerald-600/30',
      description: 'Investment Banking, M&A, Valuation'
    },
    {
      name: 'Operations',
      icon: <Target className="h-6 w-6 text-blue-400" />,
      total: Math.floor((stats?.total_problems || 0) * 0.2),
      easy: Math.floor((stats?.total_problems || 0) * 0.08),
      medium: Math.floor((stats?.total_problems || 0) * 0.09),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-blue-500/20 via-cyan-500/10 to-blue-600/20',
      hoverGradient: 'hover:from-blue-500/30 hover:via-cyan-500/20 hover:to-blue-600/30',
      description: 'Process Optimization, Supply Chain'
    },
    {
      name: 'Strategy',
      icon: <Briefcase className="h-6 w-6 text-purple-400" />,
      total: Math.floor((stats?.total_problems || 0) * 0.18),
      easy: Math.floor((stats?.total_problems || 0) * 0.07),
      medium: Math.floor((stats?.total_problems || 0) * 0.08),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-purple-500/20 via-violet-500/10 to-purple-600/20',
      hoverGradient: 'hover:from-purple-500/30 hover:via-violet-500/20 hover:to-purple-600/30',
      description: 'Market Entry, Competitive Analysis'
    },
    {
      name: 'Marketing',
      icon: <BarChart2 className="h-6 w-6 text-orange-400" />,
      total: Math.floor((stats?.total_problems || 0) * 0.15),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.02),
      gradient: 'from-orange-500/20 via-amber-500/10 to-orange-600/20',
      hoverGradient: 'hover:from-orange-500/30 hover:via-amber-500/20 hover:to-orange-600/30',
      description: 'Growth, Customer Acquisition'
    },
    {
      name: 'Analytics',
      icon: <TrendingUp className="h-6 w-6 text-cyan-400" />,
      total: Math.floor((stats?.total_problems || 0) * 0.16),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-cyan-500/20 via-teal-500/10 to-cyan-600/20',
      hoverGradient: 'hover:from-cyan-500/30 hover:via-teal-500/20 hover:to-cyan-600/30',
      description: 'Data Science, Performance Metrics'
    }
  ];

  const studyPlans = [
    {
      title: 'Investment Banking Prep',
      duration: '12 weeks',
      problems: 120,
      progress: 0,
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      difficulty: 'Advanced',
      type: 'Premium'
    },
    {
      title: 'Consulting Track',
      duration: '16 weeks',
      problems: 160,
      progress: 0,
      icon: <Briefcase className="h-5 w-5 text-blue-400" />,
      difficulty: 'Intermediate',
      type: 'Popular'
    },
    {
      title: 'Product Management',
      duration: '10 weeks',
      problems: 100,
      progress: 0,
      icon: <Rocket className="h-5 w-5 text-purple-400" />,
      difficulty: 'Beginner',
      type: 'New'
    },
    {
      title: 'Data Analytics',
      duration: '8 weeks',
      problems: 80,
      progress: 0,
      icon: <BarChart2 className="h-5 w-5 text-orange-400" />,
      difficulty: 'Intermediate',
      type: 'Hot'
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <ServerStatus 
        isOnline={!isAnyServiceOffline} 
        onRetry={handleRetryAll}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden card-premium p-12 lg:p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-purple-600/10"></div>
        <div className="relative z-10 max-w-5xl">
          <div className="flex items-center space-x-2 mb-6">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30">
              <span className="text-sm font-medium text-primary-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Next-Gen Business Case Platform
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-balance">
            <span className="text-gray-100">Solve Business Cases</span>
            <br />
            <span className="text-gradient">Like Never Before</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-10 text-balance max-w-3xl leading-relaxed">
            Master Finance, Operations, Strategy, Marketing & Analytics with AI-powered practice and expert-crafted scenarios
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="xl" variant="primary" className="group" asChild>
              <Link to="/problems">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Solving
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button size="xl" variant="glass" asChild>
              <Link to="/contests">
                <Trophy className="h-5 w-5 mr-2" />
                Weekly Contest
              </Link>
            </Button>
            
            <Button size="xl" variant="outline" asChild>
              <Link to="/study-plans">
                <BookOpen className="h-5 w-5 mr-2" />
                Study Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Challenge Widget */}
      {challenge && (
        <div className="animate-slide-up">
          <DailyChallengeWidget 
            challenge={challenge}
            userStreak={currentStreak}
          />
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="card-elevated p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-100">Your Progress</h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 rounded-full status-online"></div>
            <span className="text-sm">All systems operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-modern p-6 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Problems Solved</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-100 mb-3">
              {solvedCount}
              <span className="text-lg text-gray-400 font-normal">/{totalProblems}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500 group-hover:shadow-glow"
                style={{ width: `${(solvedCount/totalProblems) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="card-modern p-6 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Current Streak</span>
              <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <Fire className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-100 mb-3 flex items-center">
              {currentStreak}
              <span className="text-2xl ml-2">🔥</span>
            </div>
            <div className="text-gray-400 text-sm">
              Keep solving to maintain your streak!
            </div>
          </div>

          <div className="card-modern p-6 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Skill Rating</span>
              <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-100 mb-3">
              {skillLevel}
            </div>
            <div className="text-gray-400 text-sm">
              Solve {nextMilestone - solvedCount} more to level up
            </div>
          </div>

          <div className="card-modern p-6 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Next Milestone</span>
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-100 mb-3">
              {nextMilestone}
              <span className="text-lg text-gray-400 font-normal"> Problems</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500 group-hover:shadow-accent-glow"
                style={{ width: `${(solvedCount/nextMilestone) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-100">Quick Start</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/problems">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lastProblem && (
            <Link
              to={`/problem/${lastProblem.id}`}
              className="card-elevated p-8 interaction-full group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <Clock className="h-7 w-7 text-blue-400" />
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <span className="font-semibold">{lastProblem.timeRemaining}</span>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 mb-3">Resume Last Problem</h3>
              <p className="text-gray-300 mb-6 line-clamp-2">{lastProblem.title}</p>
              
              <div className="space-y-3">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 group-hover:shadow-glow"
                    style={{ width: `${lastProblem.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{lastProblem.progress}% complete</span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          )}

          {recommendedProblem && (
            <Link
              to={`/problem/${recommendedProblem.id}`}
              className="card-elevated p-8 interaction-full group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Zap className="h-7 w-7 text-purple-400" />
                </div>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                  recommendedProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  recommendedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {recommendedProblem.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 mb-3">Recommended Next</h3>
              <p className="text-gray-300 mb-4 line-clamp-2">{recommendedProblem.title}</p>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Perfect for your {recommendedProblem.category} skills
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Practice by Domain */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-100">Practice by Domain</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/problems">
              Explore All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {domains.map((domain, index) => (
            <Link
              key={domain.name}
              to={`/problems?domain=${domain.name.toLowerCase()}`}
              className={`group relative overflow-hidden card-modern p-6 bg-gradient-to-br ${domain.gradient} ${domain.hoverGradient} transition-all duration-300 hover:scale-[1.05]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform duration-200">
                    {domain.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-100 mb-2">{domain.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{domain.description}</p>
                
                <div className="text-2xl font-bold text-gray-100 mb-4">
                  {domain.total}
                  <span className="text-sm text-gray-400 font-normal ml-1">problems</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-medium">{domain.easy} Easy</span>
                    <span className="text-yellow-400 font-medium">{domain.medium} Medium</span>
                    <span className="text-red-400 font-medium">{domain.hard} Hard</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Study Plans */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-100">Study Plans</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/study-plans">
              View All Plans
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyPlans.map((plan, index) => (
            <div 
              key={plan.title}
              className="card-elevated p-6 group interaction-hover"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  {plan.icon}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    plan.type === 'Premium' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' :
                    plan.type === 'Popular' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30' :
                    plan.type === 'New' ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30'
                  }`}>
                    {plan.type}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-100 mb-2 line-clamp-2">{plan.title}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-gray-300 font-medium">{plan.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Problems:</span>
                  <span className="text-gray-300 font-medium">{plan.problems}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Level:</span>
                  <span className={`font-medium ${
                    plan.difficulty === 'Beginner' ? 'text-emerald-400' :
                    plan.difficulty === 'Intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {plan.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-300 font-medium">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
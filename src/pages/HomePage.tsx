import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Trophy, BookOpen, Target, Award,
  TrendingUp, Users, Star, Clock, Briefcase, 
  BarChart2, Rocket, CheckCircle 
} from 'lucide-react';
import DailyChallengeWidget from '../components/home/DailyChallengeWidget';
import { useStats } from '../hooks/useStats';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useProblems } from '../hooks/useProblems';

const HomePage = () => {
  const { stats, loading: statsLoading } = useStats();
  const { challenge, loading: challengeLoading } = useDailyChallenge();
  const { problems, loading: problemsLoading } = useProblems({ limit: 10 });
  
  const totalProblems = stats?.total_problems || 0;
  const solvedCount = 0; // Will be replaced with user-specific data
  const currentStreak = 7;
  const skillLevel = "Beginner";
  const nextMilestone = 25;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when all data is loaded
    if (!statsLoading && !challengeLoading && !problemsLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [statsLoading, challengeLoading, problemsLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Mock data for Quick Start section - will be replaced with recent user activity
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
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      total: stats?.difficulty_distribution ? Object.values(stats.difficulty_distribution).reduce((a, b) => a + b, 0) : 0,
      easy: stats?.difficulty_distribution?.['Easy'] || 0,
      medium: stats?.difficulty_distribution?.['Medium'] || 0,
      hard: stats?.difficulty_distribution?.['Hard'] || 0,
      color: 'from-green-500/10 to-green-600/10',
      hoverColor: 'hover:from-green-500/20 hover:to-green-600/20'
    },
    {
      name: 'Operations',
      icon: <Target className="h-6 w-6 text-blue-500" />,
      total: Math.floor((stats?.total_problems || 0) * 0.2),
      easy: Math.floor((stats?.total_problems || 0) * 0.08),
      medium: Math.floor((stats?.total_problems || 0) * 0.09),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'from-blue-500/10 to-blue-600/10',
      hoverColor: 'hover:from-blue-500/20 hover:to-blue-600/20'
    },
    {
      name: 'Strategy',
      icon: <Briefcase className="h-6 w-6 text-purple-500" />,
      total: Math.floor((stats?.total_problems || 0) * 0.18),
      easy: Math.floor((stats?.total_problems || 0) * 0.07),
      medium: Math.floor((stats?.total_problems || 0) * 0.08),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'from-purple-500/10 to-purple-600/10',
      hoverColor: 'hover:from-purple-500/20 hover:to-purple-600/20'
    },
    {
      name: 'Marketing',
      icon: <BarChart2 className="h-6 w-6 text-orange-500" />,
      total: Math.floor((stats?.total_problems || 0) * 0.15),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.02),
      color: 'from-orange-500/10 to-orange-600/10',
      hoverColor: 'hover:from-orange-500/20 hover:to-orange-600/20'
    },
    {
      name: 'Analytics',
      icon: <TrendingUp className="h-6 w-6 text-cyan-500" />,
      total: Math.floor((stats?.total_problems || 0) * 0.16),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      color: 'from-cyan-500/10 to-cyan-600/10',
      hoverColor: 'hover:from-cyan-500/20 hover:to-cyan-600/20'
    }
  ];

  const studyPlans = [
    {
      title: 'Investment Banking Prep',
      duration: '12 weeks',
      problems: 120,
      progress: 0,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
      title: 'Consulting Track',
      duration: '16 weeks',
      problems: 160,
      progress: 0,
      icon: <Briefcase className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Product Management',
      duration: '10 weeks',
      problems: 100,
      progress: 0,
      icon: <Rocket className="h-5 w-5 text-purple-500" />
    },
    {
      title: 'Data Analytics',
      duration: '8 weeks',
      problems: 80,
      progress: 0,
      icon: <BarChart2 className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-dark-50 mb-3">
            Solve Business Cases Like Never Before
          </h1>
          <p className="text-xl text-dark-400 mb-6">
            Master Finance, Operations, Strategy, Marketing & Analytics with structured practice
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contests"
              className="inline-flex items-center px-6 py-3 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 transition-colors duration-200"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Weekly Contest
            </Link>
            <Link
              to="/study-plans"
              className="inline-flex items-center px-6 py-3 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 transition-colors duration-200"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Study Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Daily Challenge Widget */}
      {challenge && (
        <DailyChallengeWidget 
          challenge={challenge}
          userStreak={currentStreak}
        />
      )}

      {/* User Dashboard Widget */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Problems Solved</span>
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-dark-50 mb-2">
              {solvedCount}/{totalProblems}
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(solvedCount/totalProblems) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Current Streak</span>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-dark-50 mb-2">
              {currentStreak} days 🔥
            </div>
            <div className="text-dark-400 text-sm">
              Keep solving to maintain your streak!
            </div>
          </div>

          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Skill Rating</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-dark-50 mb-2">
              {skillLevel}
            </div>
            <div className="text-dark-400 text-sm">
              Solve {nextMilestone - solvedCount} more to level up
            </div>
          </div>

          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400">Next Milestone</span>
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-dark-50 mb-2">
              {nextMilestone} Problems
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(solvedCount/nextMilestone) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div>
        <h2 className="text-xl font-bold text-dark-50 mb-6">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Card */}
          <Link
            to={`/problem/${lastProblem.id}`}
            className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-blue-500 font-medium">{lastProblem.timeRemaining}</span>
            </div>
            <h3 className="text-lg font-medium text-dark-50 mb-2">Resume Last Problem</h3>
            <p className="text-dark-400 text-sm mb-4">{lastProblem.title}</p>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${lastProblem.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-dark-400 mt-2">{lastProblem.progress}% complete</p>
          </Link>

          {/* AI Recommended Card */}
          <Link
            to={`/problem/${recommendedProblem.id}`}
            className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full bg-red-900 text-red-200`}>
                {recommendedProblem.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-medium text-dark-50 mb-2">Recommended Next</h3>
            <p className="text-dark-400 text-sm mb-4">{recommendedProblem.title}</p>
            <p className="text-sm text-dark-400">
              Matches your skill level in {recommendedProblem.category}
            </p>
          </Link>
        </div>
      </div>

      {/* Practice by Domain Grid */}
      <div>
        <h2 className="text-xl font-bold text-dark-50 mb-4">Practice by Domain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {domains.map((domain) => (
            <Link
              key={domain.name}
              to={`/problems?domain=${domain.name.toLowerCase()}`}
              className={`bg-gradient-to-br ${domain.color} border border-dark-700 rounded-xl p-6 transition-all duration-200 ${domain.hoverColor} hover:border-dark-600`}
            >
              <div className="flex items-center mb-4">
                {domain.icon}
                <span className="ml-2 font-medium text-dark-50">{domain.name}</span>
              </div>
              <div className="text-2xl font-bold text-dark-50 mb-3">
                {domain.total}
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-green-500">{domain.easy} Easy</span>
                <span className="text-yellow-500">{domain.medium} Medium</span>
                <span className="text-red-500">{domain.hard} Hard</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Study Plans */}
      <div>
        <h2 className="text-xl font-bold text-dark-50 mb-4">Study Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyPlans.map((plan) => (
            <div 
              key={plan.title}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                {plan.icon}
                <span className="text-dark-400">{plan.duration}</span>
              </div>
              <h3 className="text-lg font-medium text-dark-50 mb-2">{plan.title}</h3>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-dark-400">{plan.problems} problems</span>
                <span className="text-emerald-500">
                  <CheckCircle className="h-4 w-4" />
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-1.5">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
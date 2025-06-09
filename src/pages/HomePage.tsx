import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Trophy, BookOpen, Target, Award,
  TrendingUp, Users, Star, Clock, Briefcase, 
  BarChart2, Rocket, CheckCircle, Zap, 
  Brain, Layers, Globe, Sparkles
} from 'lucide-react';
import DailyChallengeWidget from '../components/home/DailyChallengeWidget';
import ServerStatus from '../components/ui/ServerStatus';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useStats } from '../hooks/useStats';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { useProblems } from '../hooks/useProblems';

const HomePage = () => {
  const { stats, loading: statsLoading, isServerOnline: statsOnline, retry: retryStats } = useStats();
  const { challenge, loading: challengeLoading, isServerOnline: challengeOnline, retry: retryChallenge } = useDailyChallenge();
  const { problems, loading: problemsLoading, isServerOnline: problemsOnline, retry: retryProblems } = useProblems({ limit: 10 });
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
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
      icon: <TrendingUp className="h-6 w-6" />,
      total: stats?.difficulty_distribution ? Object.values(stats.difficulty_distribution).reduce((a, b) => a + b, 0) : 0,
      easy: stats?.difficulty_distribution?.['Easy'] || 0,
      medium: stats?.difficulty_distribution?.['Medium'] || 0,
      hard: stats?.difficulty_distribution?.['Hard'] || 0,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/20 to-teal-600/10'
    },
    {
      name: 'Operations',
      icon: <Target className="h-6 w-6" />,
      total: Math.floor((stats?.total_problems || 0) * 0.2),
      easy: Math.floor((stats?.total_problems || 0) * 0.08),
      medium: Math.floor((stats?.total_problems || 0) * 0.09),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/20 to-cyan-600/10'
    },
    {
      name: 'Strategy',
      icon: <Briefcase className="h-6 w-6" />,
      total: Math.floor((stats?.total_problems || 0) * 0.18),
      easy: Math.floor((stats?.total_problems || 0) * 0.07),
      medium: Math.floor((stats?.total_problems || 0) * 0.08),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-600/10'
    },
    {
      name: 'Marketing',
      icon: <BarChart2 className="h-6 w-6" />,
      total: Math.floor((stats?.total_problems || 0) * 0.15),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.02),
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/10'
    },
    {
      name: 'Analytics',
      icon: <BarChart2 className="h-6 w-6" />,
      total: Math.floor((stats?.total_problems || 0) * 0.16),
      easy: Math.floor((stats?.total_problems || 0) * 0.06),
      medium: Math.floor((stats?.total_problems || 0) * 0.07),
      hard: Math.floor((stats?.total_problems || 0) * 0.03),
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-600/10'
    }
  ];

  const studyPlans = [
    {
      title: 'Investment Banking Prep',
      duration: '12 weeks',
      problems: 120,
      progress: 0,
      icon: <TrendingUp className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Consulting Track',
      duration: '16 weeks',
      problems: 160,
      progress: 0,
      icon: <Briefcase className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Product Management',
      duration: '10 weeks',
      problems: 100,
      progress: 0,
      icon: <Rocket className="h-5 w-5" />,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Data Analytics',
      duration: '8 weeks',
      problems: 80,
      progress: 0,
      icon: <BarChart2 className="h-5 w-5" />,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="relative">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-1/2 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative space-y-12">
        <ServerStatus 
          isOnline={!isAnyServiceOffline} 
          onRetry={handleRetryAll}
        />

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Card variant="glass" className="p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-cyan-500/10" />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl mb-6 shadow-neon">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-6xl font-bold mb-6"
              >
                <span className="text-gradient">Master Business Cases</span>
                <br />
                <span className="text-white">Like Never Before</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Transform your business acumen with AI-powered case studies across Finance, Operations, Strategy, Marketing & Analytics
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button 
                  variant="primary" 
                  size="xl" 
                  glow 
                  shimmer
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Start Solving Cases
                </Button>
                <Button 
                  variant="glass" 
                  size="xl"
                  leftIcon={<Trophy className="h-5 w-5" />}
                >
                  View Contests
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.section>

        {/* Daily Challenge */}
        {challenge && (
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <DailyChallengeWidget 
              challenge={challenge}
              userStreak={currentStreak}
            />
          </motion.section>
        )}

        {/* Stats Cards */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Card variant="glass" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Problems Solved",
                  value: `${solvedCount}/${totalProblems}`,
                  icon: <BookOpen className="h-6 w-6" />,
                  gradient: "from-emerald-500 to-teal-600",
                  progress: (solvedCount/totalProblems) * 100
                },
                {
                  label: "Current Streak",
                  value: `${currentStreak} days 🔥`,
                  icon: <Clock className="h-6 w-6" />,
                  gradient: "from-orange-500 to-red-600",
                  subtitle: "Keep solving to maintain streak!"
                },
                {
                  label: "Skill Rating",
                  value: skillLevel,
                  icon: <Star className="h-6 w-6" />,
                  gradient: "from-yellow-500 to-orange-600",
                  subtitle: `Solve ${nextMilestone - solvedCount} more to level up`
                },
                {
                  label: "Next Milestone",
                  value: `${nextMilestone} Problems`,
                  icon: <Target className="h-6 w-6" />,
                  gradient: "from-purple-500 to-pink-600",
                  progress: (solvedCount/nextMilestone) * 100
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <Card variant="glass" className="p-6 text-center hover:shadow-premium transition-all duration-500">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl mb-4 text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-sm text-dark-400 mb-2">{stat.label}</h3>
                    <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-dark-400">{stat.subtitle}</p>
                    )}
                    {stat.progress !== undefined && (
                      <div className="mt-3">
                        <div className="w-full bg-dark-700 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 1 }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="text-gradient">Quick Start</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lastProblem && (
              <Card variant="interactive" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white shadow-lg">
                    <Clock className="h-8 w-8" />
                  </div>
                  <span className="text-blue-400 font-medium text-lg">{lastProblem.timeRemaining}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Resume Last Problem</h3>
                <p className="text-dark-300 mb-6">{lastProblem.title}</p>
                <div className="space-y-2">
                  <div className="w-full bg-dark-700 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${lastProblem.progress}%` }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-dark-400">{lastProblem.progress}% complete</p>
                </div>
              </Card>
            )}

            {recommendedProblem && (
              <Card variant="interactive" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white shadow-lg">
                    <Target className="h-8 w-8" />
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    recommendedProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    recommendedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {recommendedProblem.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Recommended Next</h3>
                <p className="text-dark-300 mb-6">{recommendedProblem.title}</p>
                <p className="text-sm text-dark-400">
                  Matches your skill level in {recommendedProblem.category}
                </p>
              </Card>
            )}
          </div>
        </motion.section>

        {/* Practice by Domain */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="text-gradient">Practice by Domain</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
              >
                <Link to={`/problems?domain=${domain.name.toLowerCase()}`}>
                  <Card variant="interactive" className="p-6 text-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${domain.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${domain.gradient} rounded-xl mb-4 text-white shadow-lg`}>
                        {domain.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{domain.name}</h3>
                      <div className="text-3xl font-bold text-white mb-4">
                        {domain.total}
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span className="text-emerald-400">{domain.easy} Easy</span>
                        <span className="text-yellow-400">{domain.medium} Med</span>
                        <span className="text-red-400">{domain.hard} Hard</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Study Plans */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="text-gradient">Study Plans</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              >
                <Card variant="glass" className="p-6 hover:shadow-premium transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 bg-gradient-to-br ${plan.gradient} rounded-lg text-white shadow-lg`}>
                      {plan.icon}
                    </div>
                    <span className="text-dark-400 text-sm">{plan.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{plan.title}</h3>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-dark-400">{plan.problems} problems</span>
                    <span className="text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${plan.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.progress}%` }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { 
  Briefcase, Award, Users, Target, 
  BookOpen, Zap, BarChart2, Rocket,
  CheckCircle, Star, Clock, TrendingUp,
  ArrowRight, ChevronRight, Building2,
  GraduationCap, Globe, Trophy
} from 'lucide-react';

const LoginPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Login - CaseForge';
  }, []);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-emerald-400" />,
      title: "Real-world Cases",
      description: "Practice with authentic business cases from top companies and industries"
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-400" />,
      title: "Community Learning",
      description: "Learn from peers, share insights, and grow together"
    },
    {
      icon: <Target className="h-6 w-6 text-emerald-400" />,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and insights"
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-400" />,
      title: "Quick Practice",
      description: "Solve cases on the go with our mobile-friendly platform"
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-emerald-400" />,
      title: "Performance Analytics",
      description: "Get detailed insights into your case-solving strengths and areas for improvement"
    },
    {
      icon: <Rocket className="h-6 w-6 text-emerald-400" />,
      title: "Structured Learning",
      description: "Follow curated learning paths designed by industry experts"
    }
  ];

  const stats = [
    { icon: <CheckCircle className="h-5 w-5 text-emerald-400" />, value: "2,847+", label: "Practice Cases" },
    { icon: <Users className="h-5 w-5 text-emerald-400" />, value: "50K+", label: "Active Users" },
    { icon: <Star className="h-5 w-5 text-emerald-400" />, value: "4.9/5", label: "User Rating" },
    { icon: <Clock className="h-5 w-5 text-emerald-400" />, value: "24/7", label: "Available" }
  ];

  const learningPaths = [
    {
      title: "Consulting Track",
      description: "Master case interviews for top consulting firms",
      icon: <Building2 className="h-6 w-6 text-emerald-400" />
    },
    {
      title: "Business School",
      description: "Prepare for MBA applications and interviews",
      icon: <GraduationCap className="h-6 w-6 text-emerald-400" />
    },
    {
      title: "Global Business",
      description: "Understand international business scenarios",
      icon: <Globe className="h-6 w-6 text-emerald-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left side - Branding and Stats */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="flex items-center mb-8">
                <Briefcase className="h-8 w-8 text-emerald-400" />
                <span className="ml-2 text-2xl font-bold text-emerald-400">CaseForge</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Master Business Cases Like Never Before
              </h1>
              
              <p className="text-lg text-emerald-100 mb-8">
                Join thousands of business students who are improving their skills and preparing for career success.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-dark-800/50 p-4 rounded-lg border border-dark-700">
                    <div className="flex items-center mb-2">
                      {stat.icon}
                      <span className="ml-2 text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-emerald-100 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 lg:pl-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-dark-300">
                  Please sign in to continue to your account
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose CaseForge?</h2>
          <p className="text-lg text-dark-300">Everything you need to excel in business case interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-dark-800/50 p-6 rounded-lg border border-dark-700 transform transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                  <p className="mt-1 text-emerald-100">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Paths Section */}
      <div className="bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Structured Learning Paths</h2>
            <p className="text-lg text-dark-300">Choose your path to success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <div 
                key={index}
                className="bg-dark-800/50 p-6 rounded-lg border border-dark-700 transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {path.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{path.title}</h3>
                    <p className="mt-1 text-emerald-100">{path.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-dark-300">Success stories from our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-800/50 p-6 rounded-lg border border-dark-700">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-dark-900 font-bold">
                S
              </div>
              <div className="ml-4">
                <h4 className="text-white font-medium">Sarah Chen</h4>
                <p className="text-emerald-100 text-sm">MBA Student, Harvard</p>
              </div>
            </div>
            <p className="text-emerald-100">
              "CaseForge has been instrumental in my case interview preparation. The real-world cases and community feedback have helped me land my dream consulting job!"
            </p>
          </div>

          <div className="bg-dark-800/50 p-6 rounded-lg border border-dark-700">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-dark-900 font-bold">
                M
              </div>
              <div className="ml-4">
                <h4 className="text-white font-medium">Michael Rodriguez</h4>
                <p className="text-emerald-100 text-sm">Business Analyst, McKinsey</p>
              </div>
            </div>
            <p className="text-emerald-100">
              "The structured learning paths and detailed feedback have helped me improve my case-solving skills significantly. Highly recommended!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
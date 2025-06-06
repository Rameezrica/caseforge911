import React from 'react';
import { useDomain } from '../../context/DomainContext';
import { 
  Calculator, 
  Brain, 
  Target, 
  BarChart3, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users
} from 'lucide-react';

const DomainSelector: React.FC = () => {
  const { domains, loading, error, setSelectedDomain } = useDomain();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Error Loading Domains</h1>
          <p className="text-dark-400">{error}</p>
        </div>
      </div>
    );
  }

  const getDomainIcon = (domainName: string) => {
    switch (domainName) {
      case 'Finance & Investment':
        return <Calculator className="h-8 w-8" />;
      case 'Strategy & Consulting':
        return <Brain className="h-8 w-8" />;
      case 'Operations & Supply Chain':
        return <Target className="h-8 w-8" />;
      case 'Marketing & Growth':
        return <BarChart3 className="h-8 w-8" />;
      case 'Data Analytics':
        return <TrendingUp className="h-8 w-8" />;
      default:
        return <Users className="h-8 w-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'from-green-500/10 to-green-600/10',
        hover: 'hover:from-green-500/20 hover:to-green-600/20',
        icon: 'text-green-500',
        border: 'border-green-500/20'
      },
      purple: {
        bg: 'from-purple-500/10 to-purple-600/10',
        hover: 'hover:from-purple-500/20 hover:to-purple-600/20',
        icon: 'text-purple-500',
        border: 'border-purple-500/20'
      },
      blue: {
        bg: 'from-blue-500/10 to-blue-600/10',
        hover: 'hover:from-blue-500/20 hover:to-blue-600/20',
        icon: 'text-blue-500',
        border: 'border-blue-500/20'
      },
      orange: {
        bg: 'from-orange-500/10 to-orange-600/10',
        hover: 'hover:from-orange-500/20 hover:to-orange-600/20',
        icon: 'text-orange-500',
        border: 'border-orange-500/20'
      },
      cyan: {
        bg: 'from-cyan-500/10 to-cyan-600/10',
        hover: 'hover:from-cyan-500/20 hover:to-cyan-600/20',
        icon: 'text-cyan-500',
        border: 'border-cyan-500/20'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-50 mb-4">
            Choose Your Domain
          </h1>
          <p className="text-xl text-dark-400 max-w-3xl mx-auto">
            Select your primary domain of interest to get a personalized experience with 
            domain-specific problems, leaderboards, learning paths, and community discussions.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {domains.map((domain) => {
            const colors = getColorClasses(domain.color);
            return (
              <div
                key={domain.name}
                onClick={() => setSelectedDomain(domain.name)}
                className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-8 cursor-pointer transition-all duration-300 ${colors.hover} hover:border-opacity-40 group`}
              >
                {/* Domain Icon & Title */}
                <div className="flex items-center mb-6">
                  <div className={`${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                    {getDomainIcon(domain.name)}
                  </div>
                  <h3 className="ml-4 text-xl font-bold text-dark-50 group-hover:text-white transition-colors">
                    {domain.name}
                  </h3>
                </div>

                {/* Problem Count */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-dark-50 mb-2">
                    {domain.problem_count}
                  </div>
                  <div className="text-sm text-dark-400">
                    Business cases available
                  </div>
                </div>

                {/* Key Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-dark-300 mb-3">Key Categories:</h4>
                  <div className="space-y-2">
                    {domain.categories.slice(0, 3).map((category) => (
                      <div key={category} className="flex items-center text-sm text-dark-400">
                        <CheckCircle className="h-4 w-4 mr-2 text-dark-500" />
                        {category}
                      </div>
                    ))}
                    {domain.categories.length > 3 && (
                      <div className="text-sm text-dark-500">
                        +{domain.categories.length - 3} more categories
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-dark-300 mb-3">Skills You'll Master:</h4>
                  <div className="flex flex-wrap gap-2">
                    {domain.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-dark-700 text-dark-300 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {domain.skills.length > 3 && (
                      <span className="px-2 py-1 bg-dark-700 text-dark-500 rounded-md text-xs">
                        +{domain.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Progression Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-dark-300 mb-3">Career Progression:</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-dark-400">
                      <span>Level 1: {domain.levels?.[1]?.title || 'Beginner'}</span>
                      <span>Level 5: {domain.levels?.[5]?.title || 'Expert'}</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-dark-600 to-dark-500 h-1.5 rounded-full w-0 group-hover:w-full transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className={`w-full ${colors.icon} bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 group-hover:shadow-lg`}>
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
          <h2 className="text-2xl font-bold text-dark-50 mb-6 text-center">
            What You Get with Domain Personalization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-emerald-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-dark-50 mb-2">Focused Learning</h3>
              <p className="text-sm text-dark-400">Domain-specific problems and challenges tailored to your career goals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-dark-50 mb-2">Progress Tracking</h3>
              <p className="text-sm text-dark-400">Detailed analytics and level progression within your chosen domain</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-dark-50 mb-2">Community</h3>
              <p className="text-sm text-dark-400">Connect with peers and experts in your domain for discussions</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-dark-50 mb-2">Leaderboards</h3>
              <p className="text-sm text-dark-400">Compete with others in your domain and climb the rankings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSelector;
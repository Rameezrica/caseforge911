import React, { useEffect, useState } from 'react';
import { useDomain } from '../../context/DomainContext';
import { 
  Calculator, 
  Brain, 
  Target, 
  BarChart3, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface DomainSelectionStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  isStandaloneFlow?: boolean;
}

const DomainSelectionStep: React.FC<DomainSelectionStepProps> = ({ 
  data, 
  updateData, 
  onNext,
  isStandaloneFlow = false 
}) => {
  const { domains, loading, error } = useDomain();
  const [selectedSecondaryInterests, setSelectedSecondaryInterests] = useState<string[]>(
    data.secondaryInterests || []
  );

  useEffect(() => {
    updateData({ secondaryInterests: selectedSecondaryInterests });
  }, [selectedSecondaryInterests, updateData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark-50 mb-2">Error Loading Domains</h1>
        <p className="text-dark-400">{error}</p>
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
        border: 'border-green-500/20',
        selected: 'from-green-500/20 to-green-600/15 border-green-500/40'
      },
      purple: {
        bg: 'from-purple-500/10 to-purple-600/10',
        hover: 'hover:from-purple-500/20 hover:to-purple-600/20',
        icon: 'text-purple-500',
        border: 'border-purple-500/20',
        selected: 'from-purple-500/20 to-purple-600/15 border-purple-500/40'
      },
      blue: {
        bg: 'from-blue-500/10 to-blue-600/10',
        hover: 'hover:from-blue-500/20 hover:to-blue-600/20',
        icon: 'text-blue-500',
        border: 'border-blue-500/20',
        selected: 'from-blue-500/20 to-blue-600/15 border-blue-500/40'
      },
      orange: {
        bg: 'from-orange-500/10 to-orange-600/10',
        hover: 'hover:from-orange-500/20 hover:to-orange-600/20',
        icon: 'text-orange-500',
        border: 'border-orange-500/20',
        selected: 'from-orange-500/20 to-orange-600/15 border-orange-500/40'
      },
      cyan: {
        bg: 'from-cyan-500/10 to-cyan-600/10',
        hover: 'hover:from-cyan-500/20 hover:to-cyan-600/20',
        icon: 'text-cyan-500',
        border: 'border-cyan-500/20',
        selected: 'from-cyan-500/20 to-cyan-600/15 border-cyan-500/40'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getUserExperienceInDomain = (domainName: string) => {
    return data.domainExperience?.[domainName] || 'none';
  };

  const getRecommendationScore = (domain: any) => {
    let score = 0;
    
    // Experience match
    const userExp = getUserExperienceInDomain(domain.name);
    if (userExp === 'advanced' || userExp === 'intermediate') score += 3;
    else if (userExp === 'basic') score += 1;
    
    // Goal alignment
    if (data.primaryGoal === 'interview_prep' && 
        (domain.name === 'Strategy & Consulting' || domain.name === 'Finance & Investment')) {
      score += 2;
    }
    
    // Problem count (more problems = better)
    if (domain.problem_count > 5) score += 1;
    
    return score;
  };

  const getRecommendationText = (score: number) => {
    if (score >= 4) return 'Highly Recommended';
    if (score >= 2) return 'Good Match';
    if (score >= 1) return 'Consider';
    return 'Explore';
  };

  const handleSecondaryInterestToggle = (domainName: string) => {
    setSelectedSecondaryInterests(prev => 
      prev.includes(domainName)
        ? prev.filter(d => d !== domainName)
        : [...prev, domainName]
    );
  };

  const sortedDomains = [...domains].sort((a, b) => {
    const scoreA = getRecommendationScore(a);
    const scoreB = getRecommendationScore(b);
    return scoreB - scoreA;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50 mb-4">
          {isStandaloneFlow ? 'Choose Your Domain' : 'Select Your Primary Domain'}
        </h1>
        <p className="text-lg text-dark-400">
          {isStandaloneFlow 
            ? 'Select your primary domain to get a personalized experience'
            : 'Based on your profile, we recommend these domains for you'
          }
        </p>
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {sortedDomains.map((domain) => {
          const colors = getColorClasses(domain.color);
          const isSelected = data.selectedDomain === domain.name;
          const recommendationScore = getRecommendationScore(domain);
          const userExp = getUserExperienceInDomain(domain.name);
          
          return (
            <div
              key={domain.name}
              onClick={() => updateData({ selectedDomain: domain.name })}
              className={`bg-gradient-to-br border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 group relative ${
                isSelected 
                  ? `${colors.selected} scale-105 shadow-xl`
                  : `${colors.bg} ${colors.border} ${colors.hover} hover:border-opacity-40`
              }`}
            >
              {/* Recommendation Badge */}
              {recommendationScore >= 2 && (
                <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-dark-900 ${
                  recommendationScore >= 4 ? 'bg-emerald-500' :
                  recommendationScore >= 3 ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  {getRecommendationText(recommendationScore)}
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              )}

              {/* Domain Icon & Title */}
              <div className="flex items-center mb-4">
                <div className={`${isSelected ? 'text-emerald-400' : colors.icon} group-hover:scale-110 transition-transform duration-300`}>
                  {getDomainIcon(domain.name)}
                </div>
                <h3 className="ml-4 text-lg font-bold text-dark-50 group-hover:text-white transition-colors">
                  {domain.name}
                </h3>
              </div>

              {/* User Experience Level */}
              {userExp !== 'none' && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-dark-300">
                      Your level: <span className="capitalize text-dark-200">{userExp}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Problem Count & Estimated Time */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="text-center bg-dark-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-dark-50 mb-1">
                    {domain.problem_count}
                  </div>
                  <div className="text-xs text-dark-400">Cases Available</div>
                </div>
                <div className="text-center bg-dark-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-dark-50 mb-1">
                    {Math.ceil(domain.problem_count * 1.5)}h
                  </div>
                  <div className="text-xs text-dark-400">Est. Practice</div>
                </div>
              </div>

              {/* Key Categories Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-dark-300 mb-2">Key Areas:</h4>
                <div className="space-y-1">
                  {domain.categories.slice(0, 3).map((category) => (
                    <div key={category} className="flex items-center text-sm text-dark-400">
                      <CheckCircle className="h-3 w-3 mr-2 text-dark-500" />
                      {category}
                    </div>
                  ))}
                  {domain.categories.length > 3 && (
                    <div className="text-xs text-dark-500 ml-5">
                      +{domain.categories.length - 3} more areas
                    </div>
                  )}
                </div>
              </div>

              {/* Career Progression */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-dark-300 mb-2">Career Path:</h4>
                <div className="flex justify-between text-xs text-dark-400 mb-1">
                  <span>{domain.levels?.[1]?.title || 'Entry Level'}</span>
                  <span>{domain.levels?.[5]?.title || 'Expert Level'}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-1.5">
                  <div className={`${colors.icon.replace('text-', 'bg-')} h-1.5 rounded-full w-0 group-hover:w-full transition-all duration-1000`}></div>
                </div>
              </div>

              {/* Action Text */}
              <div className={`text-center font-medium flex items-center justify-center transition-all duration-300 ${
                isSelected ? 'text-emerald-400' : 'text-dark-400 group-hover:text-dark-200'
              }`}>
                {isSelected ? 'Selected' : 'Select Domain'}
                {!isSelected && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Interests */}
      {!isStandaloneFlow && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-dark-50 mb-4">
            Secondary Interests <span className="text-sm text-dark-500">(optional)</span>
          </h3>
          <p className="text-dark-400 mb-4">
            Select additional domains you're interested in exploring
          </p>
          <div className="flex flex-wrap gap-3">
            {domains
              .filter(domain => domain.name !== data.selectedDomain)
              .map((domain) => (
                <button
                  key={domain.name}
                  onClick={() => handleSecondaryInterestToggle(domain.name)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedSecondaryInterests.includes(domain.name)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  {domain.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!data.selectedDomain}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            data.selectedDomain
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }`}
        >
          {isStandaloneFlow ? 'Start Learning' : 'Continue to Personalization'}
        </button>
      </div>
    </div>
  );
};

export default DomainSelectionStep;
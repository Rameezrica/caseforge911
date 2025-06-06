import React from 'react';
import { Briefcase, GraduationCap, TrendingUp, Crown } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface ExperienceStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, updateData, onNext }) => {
  const experienceLevels = [
    {
      id: 'beginner',
      title: 'New to Business',
      description: 'Just starting out or exploring business concepts',
      icon: GraduationCap,
      color: 'green',
      details: '• Student or recent graduate\n• Exploring business careers\n• Basic business knowledge'
    },
    {
      id: 'intermediate',
      title: 'Some Experience',
      description: '1-3 years in business or related field',
      icon: Briefcase,
      color: 'blue',
      details: '• Entry-level professional\n• Some case study experience\n• Looking to advance skills'
    },
    {
      id: 'advanced',
      title: 'Experienced Professional',
      description: '3+ years with solid business background',
      icon: TrendingUp,
      color: 'purple',
      details: '• Mid-level professional\n• Regular case work\n• Preparing for senior roles'
    },
    {
      id: 'expert',
      title: 'Senior Expert',
      description: 'Extensive experience, mentoring others',
      icon: Crown,
      color: 'orange',
      details: '• Senior professional\n• Complex case experience\n• Leadership and strategy focus'
    }
  ];

  const domains = [
    'Finance & Investment',
    'Strategy & Consulting', 
    'Operations & Supply Chain',
    'Marketing & Growth',
    'Data Analytics'
  ];

  const roles = [
    'Student',
    'Analyst',
    'Consultant', 
    'Manager',
    'Director',
    'VP/Executive',
    'Entrepreneur',
    'Other'
  ];

  const industries = [
    'Technology',
    'Financial Services',
    'Consulting',
    'Healthcare',
    'Retail & E-commerce',
    'Manufacturing',
    'Energy',
    'Education',
    'Government',
    'Other'
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'from-green-500/10 to-green-600/5',
        border: 'border-green-500/30',
        icon: 'text-green-500',
        selected: 'from-green-500/20 to-green-600/10 border-green-500/50'
      },
      blue: {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30',
        icon: 'text-blue-500',
        selected: 'from-blue-500/20 to-blue-600/10 border-blue-500/50'
      },
      purple: {
        bg: 'from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30',
        icon: 'text-purple-500',
        selected: 'from-purple-500/20 to-purple-600/10 border-purple-500/50'
      },
      orange: {
        bg: 'from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/30',
        icon: 'text-orange-500',
        selected: 'from-orange-500/20 to-orange-600/10 border-orange-500/50'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const handleExperienceSelect = (level: string) => {
    updateData({ overallExperience: level as any });
  };

  const handleDomainExperience = (domain: string, level: string) => {
    updateData({
      domainExperience: {
        ...data.domainExperience,
        [domain]: level as any
      }
    });
  };

  const canProceed = data.overallExperience && data.currentRole && data.industry;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50 mb-4">Tell us about your experience</h1>
        <p className="text-lg text-dark-400">
          This helps us recommend the right difficulty level and content for you
        </p>
      </div>

      {/* Overall Experience Level */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Overall Business Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {experienceLevels.map((level) => {
            const colors = getColorClasses(level.color);
            const isSelected = data.overallExperience === level.id;
            const Icon = level.icon;
            
            return (
              <button
                key={level.id}
                onClick={() => handleExperienceSelect(level.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left bg-gradient-to-br ${
                  isSelected ? colors.selected : `${colors.bg} ${colors.border}`
                } hover:scale-105`}
              >
                <Icon className={`h-8 w-8 ${colors.icon} mb-3`} />
                <h4 className="font-semibold text-dark-50 mb-2">{level.title}</h4>
                <p className="text-sm text-dark-400 mb-3">{level.description}</p>
                <div className="text-xs text-dark-500 whitespace-pre-line">
                  {level.details}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Role and Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-dark-50 mb-4">Current Role</h3>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => updateData({ currentRole: role })}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  data.currentRole === role
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-dark-50 mb-4">Industry</h3>
          <div className="grid grid-cols-2 gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => updateData({ industry })}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  data.industry === industry
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domain-specific Experience */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Domain-Specific Experience</h3>
        <p className="text-dark-400 mb-4">Rate your experience in each business domain</p>
        
        <div className="space-y-4">
          {domains.map((domain) => (
            <div key={domain} className="bg-dark-800 rounded-lg p-4">
              <h4 className="font-medium text-dark-50 mb-3">{domain}</h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None', color: 'gray' },
                  { id: 'basic', label: 'Basic', color: 'green' },
                  { id: 'intermediate', label: 'Intermediate', color: 'blue' },
                  { id: 'advanced', label: 'Advanced', color: 'purple' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleDomainExperience(domain, level.id)}
                    className={`p-2 rounded text-sm transition-colors ${
                      data.domainExperience?.[domain] === level.id
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }`}
        >
          Continue to Goals
        </button>
      </div>
    </div>
  );
};

export default ExperienceStep;
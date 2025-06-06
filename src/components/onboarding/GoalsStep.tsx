import React from 'react';
import { Target, Briefcase, GraduationCap, Award, TrendingUp } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface GoalsStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const GoalsStep: React.FC<GoalsStepProps> = ({ data, updateData, onNext }) => {
  const primaryGoals = [
    {
      id: 'interview_prep',
      title: 'Interview Preparation',
      description: 'Prepare for case interviews at top consulting and finance firms',
      icon: Target,
      color: 'emerald',
      popular: true
    },
    {
      id: 'skill_development',
      title: 'Skill Development',
      description: 'Enhance business analysis and problem-solving capabilities',
      icon: TrendingUp,
      color: 'blue',
      popular: true
    },
    {
      id: 'career_change',
      title: 'Career Transition',
      description: 'Switch to a new industry or functional area',
      icon: Briefcase,
      color: 'purple',
      popular: false
    },
    {
      id: 'academic',
      title: 'Academic Excellence',
      description: 'Improve performance in business school or courses',
      icon: GraduationCap,
      color: 'green',
      popular: false
    },
    {
      id: 'certification',
      title: 'Professional Certification',
      description: 'Prepare for business certifications and qualifications',
      icon: Award,
      color: 'orange',
      popular: false
    }
  ];

  const timeCommitments = [
    {
      id: 'casual',
      title: 'Casual Learner',
      description: '1-2 hours per week',
      details: 'Perfect for busy professionals who want to learn at their own pace'
    },
    {
      id: 'regular',
      title: 'Regular Practice',
      description: '3-5 hours per week',
      details: 'Ideal for structured learning and steady progress'
    },
    {
      id: 'intensive',
      title: 'Intensive Training',
      description: '6+ hours per week',
      details: 'For those preparing for interviews or major transitions'
    }
  ];

  const targetRoles = [
    'Strategy Consultant',
    'Management Consultant',
    'Investment Banking Analyst',
    'Private Equity Associate',
    'Product Manager',
    'Business Analyst',
    'Operations Manager',
    'Marketing Manager',
    'Data Scientist',
    'Financial Analyst',
    'Business Development',
    'Venture Capital',
    'Corporate Strategy',
    'Other'
  ];

  const targetCompanies = [
    'McKinsey & Company',
    'BCG',
    'Bain & Company',
    'Goldman Sachs',
    'Morgan Stanley',
    'JP Morgan',
    'Google',
    'Amazon',
    'Microsoft',
    'Apple',
    'Blackstone',
    'KKR',
    'Accenture',
    'Deloitte',
    'PwC',
    'Other'
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/30',
      blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/30',
      purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/30',
      green: 'from-green-500/10 to-green-600/5 border-green-500/30',
      orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/30'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const handleRoleToggle = (role: string) => {
    const currentRoles = data.targetRoles || [];
    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    updateData({ targetRoles: updatedRoles });
  };

  const handleCompanyToggle = (company: string) => {
    const currentCompanies = data.targetCompanies || [];
    const updatedCompanies = currentCompanies.includes(company)
      ? currentCompanies.filter(c => c !== company)
      : [...currentCompanies, company];
    updateData({ targetCompanies: updatedCompanies });
  };

  const canProceed = data.primaryGoal && data.timeCommitment;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50 mb-4">What are your goals?</h1>
        <p className="text-lg text-dark-400">
          Understanding your objectives helps us customize your learning path
        </p>
      </div>

      {/* Primary Goal */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Primary Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryGoals.map((goal) => {
            const isSelected = data.primaryGoal === goal.id;
            const Icon = goal.icon;
            
            return (
              <button
                key={goal.id}
                onClick={() => updateData({ primaryGoal: goal.id as any })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left bg-gradient-to-br relative ${
                  isSelected 
                    ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50' 
                    : `${getColorClasses(goal.color)} hover:scale-105`
                }`}
              >
                {goal.popular && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-dark-900 text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <Icon className={`h-8 w-8 ${isSelected ? 'text-emerald-400' : `text-${goal.color}-500`} mb-3`} />
                <h4 className="font-semibold text-dark-50 mb-2">{goal.title}</h4>
                <p className="text-sm text-dark-400">{goal.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Commitment */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Time Commitment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeCommitments.map((commitment) => {
            const isSelected = data.timeCommitment === commitment.id;
            
            return (
              <button
                key={commitment.id}
                onClick={() => updateData({ timeCommitment: commitment.id as any })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}
              >
                <h4 className="font-semibold text-dark-50 mb-2">{commitment.title}</h4>
                <p className="text-sm font-medium mb-2">{commitment.description}</p>
                <p className="text-xs text-dark-500">{commitment.details}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Roles */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Target Roles <span className="text-sm text-dark-500">(optional)</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {targetRoles.map((role) => {
            const isSelected = data.targetRoles?.includes(role);
            
            return (
              <button
                key={role}
                onClick={() => handleRoleToggle(role)}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Companies */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Target Companies <span className="text-sm text-dark-500">(optional)</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {targetCompanies.map((company) => {
            const isSelected = data.targetCompanies?.includes(company);
            
            return (
              <button
                key={company}
                onClick={() => handleCompanyToggle(company)}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                }`}
              >
                {company}
              </button>
            );
          })}
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
          Continue to Learning Preferences
        </button>
      </div>
    </div>
  );
};

export default GoalsStep;
import React from 'react';
import { GraduationCap, Briefcase, RefreshCw, Rocket } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface RoleStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  showBackButton?: boolean;
}

const RoleStep: React.FC<RoleStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  showBackButton 
}) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      emoji: '🎓',
      icon: <GraduationCap className="h-6 w-6" />,
      description: 'Currently studying or recent graduate',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      selectedColor: 'border-blue-500 bg-blue-500/10'
    },
    {
      id: 'working_professional',
      title: 'Working Professional',
      emoji: '💼',
      icon: <Briefcase className="h-6 w-6" />,
      description: 'Currently employed in the industry',
      color: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20',
      selectedColor: 'border-green-500 bg-green-500/10'
    },
    {
      id: 'career_switcher',
      title: 'Career Switcher',
      emoji: '🔁',
      icon: <RefreshCw className="h-6 w-6" />,
      description: 'Transitioning to a new career path',
      color: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20',
      selectedColor: 'border-purple-500 bg-purple-500/10'
    },
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      emoji: '🚀',
      icon: <Rocket className="h-6 w-6" />,
      description: 'Running your own business or startup',
      color: 'from-orange-500/10 to-orange-600/10',
      borderColor: 'border-orange-500/20',
      selectedColor: 'border-orange-500 bg-orange-500/10'
    }
  ];

  const handleSelect = (roleId: string) => {
    updateData({ currentRole: roleId as any });
  };

  const canProceed = data.currentRole;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Are you currently a...? 👔
        </h1>
        <p className="text-lg text-muted-foreground">
          This helps us tailor case studies to your context
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {roles.map((role) => {
          const isSelected = data.currentRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => handleSelect(role.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 bg-gradient-to-br ${
                isSelected 
                  ? role.selectedColor + ' shadow-lg' 
                  : `${role.color} ${role.borderColor} hover:border-opacity-60`
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{role.emoji}</span>
                <div className="text-emerald-500">
                  {role.icon}
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        {showBackButton ? (
          <button
            onClick={onPrev}
            className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default RoleStep;
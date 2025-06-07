import React from 'react';
import { Target, Wrench, Briefcase, Search } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface MotivationStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  showBackButton?: boolean;
}

const MotivationStep: React.FC<MotivationStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  showBackButton 
}) => {
  const motivations = [
    {
      id: 'crack_interviews',
      title: 'Crack job interviews',
      emoji: '🎯',
      icon: <Target className="h-6 w-6" />,
      description: 'Prepare for consulting, finance, and business interviews',
      color: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20',
      selectedColor: 'border-red-500 bg-red-500/10'
    },
    {
      id: 'build_skills',
      title: 'Build real-world skills',
      emoji: '🛠️',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Develop practical business problem-solving abilities',
      color: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20',
      selectedColor: 'border-green-500 bg-green-500/10'
    },
    {
      id: 'land_internships',
      title: 'Land internships',
      emoji: '💼',
      icon: <Briefcase className="h-6 w-6" />,
      description: 'Prepare for competitive internship programs',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      selectedColor: 'border-blue-500 bg-blue-500/10'
    },
    {
      id: 'exploring',
      title: 'Just exploring',
      emoji: '🤔',
      icon: <Search className="h-6 w-6" />,
      description: 'Curious about business cases and want to learn',
      color: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20',
      selectedColor: 'border-purple-500 bg-purple-500/10'
    }
  ];

  const handleSelect = (motivationId: string) => {
    updateData({ motivation: motivationId as any });
  };

  const canProceed = data.motivation;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          What motivates you to use CaseForge? 🚀
        </h1>
        <p className="text-lg text-muted-foreground">
          Help us understand your goals so we can personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {motivations.map((motivation) => {
          const isSelected = data.motivation === motivation.id;
          
          return (
            <button
              key={motivation.id}
              onClick={() => handleSelect(motivation.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 bg-gradient-to-br ${
                isSelected 
                  ? motivation.selectedColor + ' shadow-lg' 
                  : `${motivation.color} ${motivation.borderColor} hover:border-opacity-60`
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{motivation.emoji}</span>
                <div className="text-emerald-500">
                  {motivation.icon}
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{motivation.title}</h3>
              <p className="text-sm text-muted-foreground">{motivation.description}</p>
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
          Complete Setup →
        </button>
      </div>
    </div>
  );
};

export default MotivationStep;
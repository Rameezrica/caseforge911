import React from 'react';
import { GraduationCap, Briefcase, Crown } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface ExperienceStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  showBackButton?: boolean;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  showBackButton 
}) => {
  const experienceLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      emoji: '👶',
      description: 'New to business cases',
      details: 'Just starting out or exploring business concepts'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      emoji: '👨‍💼',
      description: 'Some business experience',
      details: '1-3 years in business or related field'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      emoji: '🧠',
      description: 'Experienced professional',
      details: '3+ years with solid business background'
    }
  ];

  const handleSelect = (level: string) => {
    updateData({ experienceLevel: level as any });
  };

  const canProceed = data.experienceLevel;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          What's your current level of experience? 📊
        </h1>
        <p className="text-lg text-muted-foreground">
          This helps us recommend the right difficulty level for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {experienceLevels.map((level) => {
          const isSelected = data.experienceLevel === level.id;
          
          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg' 
                  : 'border-border bg-card/50 hover:border-emerald-500/50'
              }`}
            >
              <div className="text-4xl mb-3">{level.emoji}</div>
              <h3 className="font-semibold text-foreground mb-2">{level.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
              <p className="text-xs text-muted-foreground">{level.details}</p>
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

export default ExperienceStep;
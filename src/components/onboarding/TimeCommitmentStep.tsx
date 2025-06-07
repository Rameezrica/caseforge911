import React from 'react';
import { Clock, Calendar, Brain } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface TimeCommitmentStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  showBackButton?: boolean;
}

const TimeCommitmentStep: React.FC<TimeCommitmentStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  showBackButton 
}) => {
  const timeOptions = [
    {
      id: '2-4',
      title: '2–4 hrs',
      emoji: '⏱️',
      icon: <Clock className="h-6 w-6" />,
      description: 'Light practice, perfect for busy schedules',
      details: '1-2 cases per week',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      selectedColor: 'border-blue-500 bg-blue-500/10'
    },
    {
      id: '5-7',
      title: '5–7 hrs',
      emoji: '📆',
      icon: <Calendar className="h-6 w-6" />,
      description: 'Regular practice for steady improvement',
      details: '3-4 cases per week',
      color: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20',
      selectedColor: 'border-green-500 bg-green-500/10'
    },
    {
      id: '8+',
      title: '8+ hrs',
      emoji: '🧠',
      icon: <Brain className="h-6 w-6" />,
      description: 'Intensive practice for rapid progress',
      details: '5+ cases per week',
      color: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20',
      selectedColor: 'border-purple-500 bg-purple-500/10'
    }
  ];

  const handleSelect = (timeId: string) => {
    updateData({ timeCommitment: timeId as any });
  };

  const canProceed = data.timeCommitment;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          How much time can you commit per week? ⏰
        </h1>
        <p className="text-lg text-muted-foreground">
          We'll customize your learning plan based on your availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {timeOptions.map((option) => {
          const isSelected = data.timeCommitment === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 bg-gradient-to-br ${
                isSelected 
                  ? option.selectedColor + ' shadow-lg' 
                  : `${option.color} ${option.borderColor} hover:border-opacity-60`
              }`}
            >
              <div className="text-4xl mb-3">{option.emoji}</div>
              <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
              <p className="text-xs text-muted-foreground">{option.details}</p>
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

export default TimeCommitmentStep;
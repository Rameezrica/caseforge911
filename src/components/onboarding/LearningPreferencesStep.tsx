import React from 'react';
import { Eye, Wrench, BookOpen, Shuffle, Clock, BarChart, Zap, Calendar } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface LearningPreferencesStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const LearningPreferencesStep: React.FC<LearningPreferencesStepProps> = ({ data, updateData, onNext }) => {
  const learningStyles = [
    {
      id: 'visual',
      title: 'Visual Learner',
      description: 'Learn best through charts, diagrams, and visual frameworks',
      icon: Eye,
      color: 'blue',
      features: ['Framework diagrams', 'Visual case breakdowns', 'Chart-based problems']
    },
    {
      id: 'hands_on',
      title: 'Hands-On Learner',
      description: 'Prefer interactive exercises and practical application',
      icon: Wrench,
      color: 'green',
      features: ['Interactive worksheets', 'Simulation exercises', 'Real case studies']
    },
    {
      id: 'theoretical',
      title: 'Theoretical Learner',
      description: 'Enjoy deep concepts, frameworks, and structured approaches',
      icon: BookOpen,
      color: 'purple',
      features: ['Detailed explanations', 'Framework mastery', 'Conceptual depth']
    },
    {
      id: 'mixed',
      title: 'Mixed Approach',
      description: 'Benefit from a combination of different learning methods',
      icon: Shuffle,
      color: 'orange',
      features: ['Varied content types', 'Adaptive approach', 'Best of all methods']
    }
  ];

  const difficultyPreferences = [
    {
      id: 'gradual',
      title: 'Gradual Progression',
      description: 'Start easy and gradually increase difficulty',
      icon: BarChart,
      details: 'Build confidence with easier problems before tackling complex cases'
    },
    {
      id: 'challenging',
      title: 'Jump Into Challenge',
      description: 'Prefer challenging problems from the start',
      icon: Zap,
      details: 'Learn faster by diving into complex, real-world business problems'
    },
    {
      id: 'mixed',
      title: 'Mixed Difficulty',
      description: 'Variety of easy, medium, and hard problems',
      icon: Shuffle,
      details: 'Keep learning engaging with a balanced mix of problem difficulties'
    }
  ];

  const sessionLengths = [
    {
      id: '15-30',
      title: '15-30 minutes',
      description: 'Quick practice sessions',
      icon: Clock,
      best_for: 'Daily practice, busy schedules'
    },
    {
      id: '30-60',
      title: '30-60 minutes',
      description: 'Standard study sessions',
      icon: Clock,
      best_for: 'Regular learning, most popular'
    },
    {
      id: '60-90',
      title: '60-90 minutes',
      description: 'Deep dive sessions',
      icon: Clock,
      best_for: 'Comprehensive case work'
    },
    {
      id: '90+',
      title: '90+ minutes',
      description: 'Extended practice',
      icon: Clock,
      best_for: 'Interview preparation, intensive study'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const canProceed = data.learningStyle && data.preferredDifficulty && data.studySessionLength;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50 mb-4">How do you learn best?</h1>
        <p className="text-lg text-dark-400">
          We'll customize the content format and difficulty to match your preferences
        </p>
      </div>

      {/* Learning Style */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Learning Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningStyles.map((style) => {
            const isSelected = data.learningStyle === style.id;
            const Icon = style.icon;
            
            return (
              <button
                key={style.id}
                onClick={() => updateData({ learningStyle: style.id as any })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`h-8 w-8 mt-1 ${isSelected ? 'text-emerald-400' : getColorClasses(style.color)}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-dark-50 mb-2">{style.title}</h4>
                    <p className="text-sm text-dark-400 mb-3">{style.description}</p>
                    <div className="space-y-1">
                      {style.features.map((feature, index) => (
                        <div key={index} className="text-xs text-dark-500 flex items-center">
                          <div className="w-1 h-1 bg-dark-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Preference */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Difficulty Preference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyPreferences.map((difficulty) => {
            const isSelected = data.preferredDifficulty === difficulty.id;
            const Icon = difficulty.icon;
            
            return (
              <button
                key={difficulty.id}
                onClick={() => updateData({ preferredDifficulty: difficulty.id as any })}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                }`}
              >
                <Icon className={`h-6 w-6 mb-3 ${isSelected ? 'text-emerald-400' : 'text-dark-400'}`} />
                <h4 className="font-semibold text-dark-50 mb-2">{difficulty.title}</h4>
                <p className="text-sm text-dark-400 mb-2">{difficulty.description}</p>
                <p className="text-xs text-dark-500">{difficulty.details}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Study Session Length */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Preferred Study Session Length</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessionLengths.map((session) => {
            const isSelected = data.studySessionLength === session.id;
            const Icon = session.icon;
            
            return (
              <button
                key={session.id}
                onClick={() => updateData({ studySessionLength: session.id as any })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-emerald-400' : 'text-dark-400'}`} />
                <h4 className="font-semibold text-dark-50 mb-1">{session.title}</h4>
                <p className="text-sm text-dark-400 mb-2">{session.description}</p>
                <p className="text-xs text-dark-500">{session.best_for}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalization Preview */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-dark-50 mb-3">Your Personalized Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-emerald-400 font-medium mb-1">Content Format</div>
            <div className="text-dark-300">
              {data.learningStyle === 'visual' && 'Visual frameworks & diagrams'}
              {data.learningStyle === 'hands_on' && 'Interactive exercises'}
              {data.learningStyle === 'theoretical' && 'Detailed explanations'}
              {data.learningStyle === 'mixed' && 'Varied content types'}
              {!data.learningStyle && 'Select learning style'}
            </div>
          </div>
          <div>
            <div className="text-emerald-400 font-medium mb-1">Difficulty Path</div>
            <div className="text-dark-300">
              {data.preferredDifficulty === 'gradual' && 'Easy → Medium → Hard'}
              {data.preferredDifficulty === 'challenging' && 'Start with complex cases'}
              {data.preferredDifficulty === 'mixed' && 'Balanced mix of difficulties'}
              {!data.preferredDifficulty && 'Select difficulty preference'}
            </div>
          </div>
          <div>
            <div className="text-emerald-400 font-medium mb-1">Session Design</div>
            <div className="text-dark-300">
              {data.studySessionLength ? `Optimized for ${data.studySessionLength} minute sessions` : 'Select session length'}
            </div>
          </div>
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
          Continue to Domain Selection
        </button>
      </div>
    </div>
  );
};

export default LearningPreferencesStep;
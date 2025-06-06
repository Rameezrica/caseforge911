import React from 'react';
import { CheckCircle, Rocket, Target, BookOpen, Trophy, Clock } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface CompletionStepProps {
  data: Partial<OnboardingData>;
  onComplete: () => void;
  isSubmitting: boolean;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ data, onComplete, isSubmitting }) => {
  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours();
    if (timeOfDay < 12) return 'Good morning';
    if (timeOfDay < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (data.primaryGoal === 'interview_prep') {
      steps.push({
        icon: Target,
        title: 'Take a Practice Interview',
        description: 'Start with a medium-difficulty case from your domain',
        action: 'Browse Problems'
      });
    } else {
      steps.push({
        icon: BookOpen,
        title: 'Explore Learning Paths',
        description: 'Follow structured paths designed for your skill level',
        action: 'View Learning Paths'
      });
    }
    
    steps.push({
      icon: Trophy,
      title: 'Check the Leaderboard',
      description: 'See how you rank in your domain and get motivated',
      action: 'View Leaderboard'
    });
    
    if (data.notifications?.dailyChallenge) {
      steps.push({
        icon: Clock,
        title: 'Daily Challenge',
        description: 'Complete today\'s challenge to start your streak',
        action: 'Take Challenge'
      });
    }
    
    return steps;
  };

  const getDomainStats = () => {
    // These would come from the domain data in a real implementation
    const stats = {
      'Finance & Investment': { avgTime: '45 min', difficulty: 'High', completion: '67%' },
      'Strategy & Consulting': { avgTime: '55 min', difficulty: 'Very High', completion: '52%' },
      'Operations & Supply Chain': { avgTime: '35 min', difficulty: 'Medium', completion: '73%' },
      'Marketing & Growth': { avgTime: '40 min', difficulty: 'Medium', completion: '69%' },
      'Data Analytics': { avgTime: '50 min', difficulty: 'High', completion: '61%' }
    };
    
    return stats[data.selectedDomain as keyof typeof stats] || stats['Finance & Investment'];
  };

  const nextSteps = getNextSteps();
  const domainStats = getDomainStats();

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="relative bg-emerald-500 rounded-full w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-dark-50 mb-4">
          {getWelcomeMessage()}, you're all set! 🎉
        </h1>
        <p className="text-xl text-dark-400">
          Your personalized CaseForge experience is ready
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Your Learning Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-dark-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{data.selectedDomain}</div>
            <div className="text-sm text-dark-400">Primary Domain</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1 capitalize">
              {data.overallExperience || 'Intermediate'}
            </div>
            <div className="text-sm text-dark-400">Experience Level</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {data.studySessionLength || '30-60'} min
            </div>
            <div className="text-sm text-dark-400">Session Length</div>
          </div>
        </div>

        {/* Domain Insights */}
        <div className="bg-dark-800/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-dark-50 mb-3">What to Expect in {data.selectedDomain}</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-dark-400">Avg. Problem Time</div>
              <div className="font-medium text-dark-200">{domainStats.avgTime}</div>
            </div>
            <div>
              <div className="text-dark-400">Difficulty Level</div>
              <div className="font-medium text-dark-200">{domainStats.difficulty}</div>
            </div>
            <div>
              <div className="text-dark-400">Completion Rate</div>
              <div className="font-medium text-dark-200">{domainStats.completion}</div>
            </div>
          </div>
        </div>

        {/* Personalization Features */}
        <div className="text-left">
          <h3 className="font-semibold text-dark-50 mb-3">Your Personalized Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.learningStyle && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="capitalize">{data.learningStyle.replace('_', ' ')} learning approach</span>
              </div>
            )}
            {data.preferredDifficulty && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="capitalize">{data.preferredDifficulty} difficulty progression</span>
              </div>
            )}
            {data.notifications?.dailyChallenge && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Daily challenges enabled</span>
              </div>
            )}
            {data.competitiveMode && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Competitive mode activated</span>
              </div>
            )}
            {data.secondaryInterests && data.secondaryInterests.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>{data.secondaryInterests.length} secondary interests</span>
              </div>
            )}
            {data.targetRoles && data.targetRoles.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Career goals: {data.targetRoles.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nextSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-dark-800 border border-dark-700 rounded-xl p-6 text-left">
                <div className="bg-emerald-500/10 rounded-lg p-3 w-fit mb-4">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-dark-50 mb-2">{step.title}</h3>
                <p className="text-sm text-dark-400 mb-4">{step.description}</p>
                <div className="text-emerald-400 text-sm font-medium">{step.action} →</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className={`w-full md:w-auto px-12 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Setting up your dashboard...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Enter Your Dashboard
            </>
          )}
        </button>
        
        <p className="text-sm text-dark-500">
          You can always change these preferences later in your settings
        </p>
      </div>
    </div>
  );
};

export default CompletionStep;
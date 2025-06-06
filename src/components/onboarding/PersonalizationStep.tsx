import React from 'react';
import { Bell, Trophy, Shield, Clock, Target, Zap, Users, BookOpen } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface PersonalizationStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ data, updateData, onNext }) => {
  const handleNotificationChange = (key: keyof OnboardingData['notifications'], value: boolean) => {
    updateData({
      notifications: {
        ...data.notifications,
        [key]: value
      }
    });
  };

  const notificationOptions = [
    {
      key: 'dailyChallenge' as const,
      title: 'Daily Challenge',
      description: 'Get a new problem every day to keep your skills sharp',
      icon: Target,
      recommended: true
    },
    {
      key: 'weeklyProgress' as const,
      title: 'Weekly Progress Report',
      description: 'Receive insights about your learning progress and achievements',
      icon: Trophy,
      recommended: true
    },
    {
      key: 'newProblems' as const,
      title: 'New Problems',
      description: 'Be notified when new problems are added to your domain',
      icon: BookOpen,
      recommended: false
    },
    {
      key: 'communityUpdates' as const,
      title: 'Community Updates',
      description: 'Stay updated on discussions and community activities',
      icon: Users,
      recommended: false
    }
  ];

  const getPersonalizationSummary = () => {
    const summary = [];
    
    if (data.selectedDomain) {
      summary.push(`Primary focus: ${data.selectedDomain}`);
    }
    
    if (data.preferredDifficulty) {
      const diffMap = {
        gradual: 'Gradual progression',
        challenging: 'Jump into challenges',
        mixed: 'Mixed difficulty'
      };
      summary.push(`Difficulty: ${diffMap[data.preferredDifficulty as keyof typeof diffMap]}`);
    }
    
    if (data.studySessionLength) {
      summary.push(`Session length: ${data.studySessionLength} minutes`);
    }
    
    if (data.timeCommitment) {
      const timeMap = {
        casual: 'Casual learner (1-2h/week)',
        regular: 'Regular practice (3-5h/week)',
        intensive: 'Intensive training (6+h/week)'
      };
      summary.push(`Commitment: ${timeMap[data.timeCommitment as keyof typeof timeMap]}`);
    }
    
    return summary;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-50 mb-4">Customize Your Experience</h1>
        <p className="text-lg text-dark-400">
          Set up notifications and preferences to optimize your learning journey
        </p>
      </div>

      {/* Personalization Summary */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">Your Personalized Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getPersonalizationSummary().map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-dark-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            const isEnabled = data.notifications?.[option.key] || false;
            
            return (
              <div 
                key={option.key}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isEnabled ? 'bg-emerald-500/10' : 'bg-dark-700'}`}>
                    <Icon className={`h-6 w-6 ${isEnabled ? 'text-emerald-400' : 'text-dark-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-dark-50">{option.title}</h4>
                      {option.recommended && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark-400">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange(option.key, !isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-emerald-600' : 'bg-dark-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">Additional Preferences</h3>
        <div className="space-y-4">
          {/* Competitive Mode */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${data.competitiveMode ? 'bg-orange-500/10' : 'bg-dark-700'}`}>
                <Trophy className={`h-6 w-6 ${data.competitiveMode ? 'text-orange-400' : 'text-dark-400'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-dark-50">Competitive Mode</h4>
                <p className="text-sm text-dark-400">
                  Show your ranking on leaderboards and enable competitive features
                </p>
              </div>
            </div>
            <button
              onClick={() => updateData({ competitiveMode: !data.competitiveMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                data.competitiveMode ? 'bg-orange-600' : 'bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  data.competitiveMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Private Profile */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${data.privateProfile ? 'bg-blue-500/10' : 'bg-dark-700'}`}>
                <Shield className={`h-6 w-6 ${data.privateProfile ? 'text-blue-400' : 'text-dark-400'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-dark-50">Private Profile</h4>
                <p className="text-sm text-dark-400">
                  Keep your progress and statistics private from other users
                </p>
              </div>
            </div>
            <button
              onClick={() => updateData({ privateProfile: !data.privateProfile })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                data.privateProfile ? 'bg-blue-600' : 'bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  data.privateProfile ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preview of Experience */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">What to Expect</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Target className="h-8 w-8 text-emerald-500" />
            </div>
            <h4 className="font-medium text-dark-50 mb-2">Personalized Dashboard</h4>
            <p className="text-sm text-dark-400">
              Get a customized view of your progress, recommendations, and daily challenges
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <h4 className="font-medium text-dark-50 mb-2">Curated Content</h4>
            <p className="text-sm text-dark-400">
              Problems and learning paths tailored to your experience level and goals
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
            <h4 className="font-medium text-dark-50 mb-2">Smart Progress</h4>
            <p className="text-sm text-dark-400">
              AI-powered insights and recommendations to accelerate your learning
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default PersonalizationStep;
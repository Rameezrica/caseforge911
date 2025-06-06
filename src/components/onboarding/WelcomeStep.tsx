import React from 'react';
import { Briefcase, Target, TrendingUp, Users } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface WelcomeStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Main Logo and Welcome */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-dark-900" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-dark-50 mb-4">
          Welcome to <span className="text-emerald-500">CaseForge</span>
        </h1>
        <p className="text-xl text-dark-400 leading-relaxed">
          Your personalized platform for mastering business case studies and accelerating your career growth
        </p>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-xl p-6">
          <div className="bg-emerald-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-dark-50 mb-2">Personalized Learning</h3>
          <p className="text-dark-400 text-sm">
            Get tailored case studies based on your experience level, career goals, and preferred domains
          </p>
        </div>
        
        <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-xl p-6">
          <div className="bg-blue-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-dark-50 mb-2">Track Progress</h3>
          <p className="text-dark-400 text-sm">
            Monitor your growth with detailed analytics, skill assessments, and domain-specific level progression
          </p>
        </div>
        
        <div className="bg-dark-800/50 backdrop-blur border border-dark-700 rounded-xl p-6">
          <div className="bg-purple-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-dark-50 mb-2">Community Driven</h3>
          <p className="text-dark-400 text-sm">
            Learn from peers, participate in discussions, and compete on domain-specific leaderboards
          </p>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-dark-50 mb-4">What's Next?</h3>
        <p className="text-dark-300 mb-4">
          We'll ask you a few questions to understand your background, goals, and preferences. 
          This helps us create the perfect learning experience for you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-dark-400">
          <div>📊 Experience Level</div>
          <div>🎯 Career Goals</div>
          <div>📚 Learning Style</div>
          <div>🏢 Domain Focus</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <button
          onClick={onNext}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Let's Get Started
        </button>
        <p className="text-sm text-dark-500">
          Takes just 2-3 minutes • Completely personalized • Start learning immediately
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
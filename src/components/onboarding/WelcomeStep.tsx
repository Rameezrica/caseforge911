import React from 'react';
import { Briefcase, Target, TrendingUp, Users } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface WelcomeStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {/* Main Logo and Welcome */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">CaseForge</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Your personalized platform for mastering business case studies and accelerating your career growth
        </p>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
          <div className="bg-emerald-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Personalized Learning</h3>
          <p className="text-muted-foreground text-sm">
            Get tailored case studies based on your experience level, career goals, and preferred domains
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
          <div className="bg-blue-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Track Progress</h3>
          <p className="text-muted-foreground text-sm">
            Monitor your growth with detailed analytics, skill assessments, and domain-specific progression
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
          <div className="bg-purple-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Community Driven</h3>
          <p className="text-muted-foreground text-sm">
            Learn from peers, participate in discussions, and compete on domain-specific leaderboards
          </p>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">What's Next?</h3>
        <p className="text-muted-foreground mb-4">
          We'll ask you 5 quick questions to personalize your learning experience. 
          This takes just 2 minutes and helps us recommend the perfect cases for you.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <span className="text-2xl mr-2">👶</span>
            <span>Experience</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">💰</span>
            <span>Domain</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎓</span>
            <span>Role</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">⏱️</span>
            <span>Time</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            <span>Goals</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <button
          onClick={onNext}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Let's Get Started ✨
        </button>
        <p className="text-sm text-muted-foreground">
          Takes just 2 minutes • Completely personalized • Start learning immediately
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
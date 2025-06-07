import React from 'react';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface CompletionStepProps {
  data: Partial<OnboardingData>;
  onComplete: () => void;
  isSubmitting: boolean;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ 
  data, 
  onComplete, 
  isSubmitting 
}) => {
  const getExperienceDisplay = (level: string) => {
    switch (level) {
      case 'beginner': return '👶 Beginner';
      case 'intermediate': return '👨‍💼 Intermediate';
      case 'advanced': return '🧠 Advanced';
      default: return level;
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'student': return '🎓 Student';
      case 'working_professional': return '💼 Working Professional';
      case 'career_switcher': return '🔁 Career Switcher';
      case 'entrepreneur': return '🚀 Entrepreneur';
      default: return role;
    }
  };

  const getTimeDisplay = (time: string) => {
    switch (time) {
      case '2-4': return '⏱️ 2–4 hrs per week';
      case '5-7': return '📆 5–7 hrs per week';
      case '8+': return '🧠 8+ hrs per week';
      default: return time;
    }
  };

  const getMotivationDisplay = (motivation: string) => {
    switch (motivation) {
      case 'crack_interviews': return '🎯 Crack job interviews';
      case 'build_skills': return '🛠️ Build real-world skills';
      case 'land_internships': return '💼 Land internships';
      case 'exploring': return '🤔 Just exploring';
      default: return motivation;
    }
  };

  const getDomainEmoji = (domain: string) => {
    switch (domain) {
      case 'Finance & Investment': return '💰';
      case 'Marketing & Growth': return '📈';
      case 'Strategy & Consulting': return '♟️';
      case 'Operations & Supply Chain': return '⚙️';
      case 'Data Analytics': return '📊';
      default: return '🏢';
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-bounce" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Perfect! Your profile is ready ✨
        </h1>
        <p className="text-lg text-muted-foreground">
          We've personalized CaseForge based on your preferences
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Learning Profile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-muted-foreground mb-1">Experience Level</div>
            <div className="font-medium text-foreground">
              {getExperienceDisplay(data.experienceLevel || '')}
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-muted-foreground mb-1">Primary Domain</div>
            <div className="font-medium text-foreground">
              {getDomainEmoji(data.selectedDomain || '')} {data.selectedDomain}
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-muted-foreground mb-1">Current Role</div>
            <div className="font-medium text-foreground">
              {getRoleDisplay(data.currentRole || '')}
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-muted-foreground mb-1">Time Commitment</div>
            <div className="font-medium text-foreground">
              {getTimeDisplay(data.timeCommitment || '')}
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3 md:col-span-2">
            <div className="text-muted-foreground mb-1">Primary Goal</div>
            <div className="font-medium text-foreground">
              {getMotivationDisplay(data.motivation || '')}
            </div>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-3">What's Next?</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
            <span>Personalized case recommendations based on your profile</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
            <span>Track your progress in {data.selectedDomain}</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
            <span>Join the community and start solving cases</span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onComplete}
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Setting up your dashboard...
          </div>
        ) : (
          <div className="flex items-center">
            Let's begin your journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        )}
      </button>
    </div>
  );
};

export default CompletionStep;
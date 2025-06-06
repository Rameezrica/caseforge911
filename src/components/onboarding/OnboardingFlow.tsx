import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDomain } from '../../context/DomainContext';
import { apiService } from '../../services/api';
import WelcomeStep from './WelcomeStep';
import ExperienceStep from './ExperienceStep';
import GoalsStep from './GoalsStep';
import LearningPreferencesStep from './LearningPreferencesStep';
import DomainSelectionStep from './DomainSelectionStep';
import PersonalizationStep from './PersonalizationStep';
import CompletionStep from './CompletionStep';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface OnboardingData {
  // Experience Assessment
  overallExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  domainExperience: Record<string, 'none' | 'basic' | 'intermediate' | 'advanced'>;
  currentRole: string;
  industry: string;
  
  // Goals and Aspirations
  primaryGoal: 'interview_prep' | 'skill_development' | 'career_change' | 'academic' | 'certification';
  targetRoles: string[];
  timeCommitment: 'casual' | 'regular' | 'intensive';
  targetCompanies: string[];
  
  // Learning Preferences
  learningStyle: 'visual' | 'hands_on' | 'theoretical' | 'mixed';
  preferredDifficulty: 'gradual' | 'challenging' | 'mixed';
  studySessionLength: '15-30' | '30-60' | '60-90' | '90+';
  
  // Domain Preferences
  selectedDomain: string;
  secondaryInterests: string[];
  
  // Personalization
  notifications: {
    dailyChallenge: boolean;
    weeklyProgress: boolean;
    newProblems: boolean;
    communityUpdates: boolean;
  };
  competitiveMode: boolean;
  privateProfile: boolean;
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedDomain } = useDomain();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    notifications: {
      dailyChallenge: true,
      weeklyProgress: true,
      newProblems: false,
      communityUpdates: false,
    },
    competitiveMode: true,
    privateProfile: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we're coming from domain switch (skip to domain selection)
  useEffect(() => {
    if (location.pathname === '/select-domain') {
      setCurrentStep(4); // Jump to domain selection step
    }
  }, [location.pathname]);

  const steps = [
    { id: 'welcome', title: 'Welcome', component: WelcomeStep },
    { id: 'experience', title: 'Experience', component: ExperienceStep },
    { id: 'goals', title: 'Goals', component: GoalsStep },
    { id: 'preferences', title: 'Learning', component: LearningPreferencesStep },
    { id: 'domain', title: 'Domain', component: DomainSelectionStep },
    { id: 'personalization', title: 'Customize', component: PersonalizationStep },
    { id: 'completion', title: 'Complete', component: CompletionStep },
  ];

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipToCompletion = async () => {
    // For domain switching, just select domain and redirect
    if (location.pathname === '/select-domain' && onboardingData.selectedDomain) {
      setSelectedDomain(onboardingData.selectedDomain);
      
      // Save minimal preferences
      try {
        await apiService.setUserPreferences('user_1', {
          preferred_domain: onboardingData.selectedDomain,
          difficulty_preference: 'Medium',
          notification_settings: onboardingData.notifications
        });
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
      
      navigate('/dashboard');
      return;
    }
    
    // Complete full onboarding
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    if (!onboardingData.selectedDomain) return;
    
    setIsSubmitting(true);
    try {
      // Set domain in context
      setSelectedDomain(onboardingData.selectedDomain);
      
      // Save user preferences to backend
      await apiService.setUserPreferences('user_1', {
        preferred_domain: onboardingData.selectedDomain,
        difficulty_preference: onboardingData.preferredDifficulty === 'gradual' ? 'Easy' : 
                              onboardingData.preferredDifficulty === 'challenging' ? 'Hard' : 'Medium',
        notification_settings: onboardingData.notifications,
        onboarding_data: onboardingData
      });
      
      // Mark onboarding as completed
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="bg-dark-800 border-b border-dark-700 px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-300">
                  Step {currentStep} of {steps.length - 2}
                </span>
                <span className="text-sm text-dark-400">
                  {Math.round((currentStep / (steps.length - 2)) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / (steps.length - 2)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <StepComponent
              data={onboardingData}
              updateData={updateData}
              onNext={nextStep}
              onSkip={skipToCompletion}
              onComplete={completeOnboarding}
              isSubmitting={isSubmitting}
              isStandaloneFlow={location.pathname === '/select-domain'}
            />
          </div>
        </div>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="bg-dark-800 border-t border-dark-700 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-dark-400 hover:text-dark-200 transition-colors"
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>

              <div className="flex items-center space-x-2">
                {steps.slice(1, -1).map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index + 1 === currentStep ? 'bg-emerald-500' :
                      index + 1 < currentStep ? 'bg-emerald-600' : 'bg-dark-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={currentStep === steps.length - 2 ? skipToCompletion : nextStep}
                className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {currentStep === steps.length - 2 ? 'Complete' : 'Continue'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
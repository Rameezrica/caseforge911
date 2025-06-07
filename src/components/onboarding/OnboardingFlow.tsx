import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDomain } from '../../context/DomainContext';
import { apiService } from '../../services/api';
import WelcomeStep from './WelcomeStep';
import ExperienceStep from './ExperienceStep';
import DomainSelectionStep from './DomainSelectionStep';
import RoleStep from './RoleStep';
import TimeCommitmentStep from './TimeCommitmentStep';
import MotivationStep from './MotivationStep';
import CompletionStep from './CompletionStep';
import { Progress } from '../ui/progress';

export interface OnboardingData {
  // Step 1: Experience Level
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  
  // Step 2: Domain Selection
  selectedDomain: string;
  
  // Step 3: Current Role
  currentRole: 'student' | 'working_professional' | 'career_switcher' | 'entrepreneur' | '';
  
  // Step 4: Time Commitment
  timeCommitment: '2-4' | '5-7' | '8+' | '';
  
  // Step 5: Motivation
  motivation: 'crack_interviews' | 'build_skills' | 'land_internships' | 'exploring' | '';
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedDomain } = useDomain();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    experienceLevel: '',
    selectedDomain: '',
    currentRole: '',
    timeCommitment: '',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', component: WelcomeStep },
    { id: 'experience', title: 'Experience', component: ExperienceStep },
    { id: 'domain', title: 'Domain', component: DomainSelectionStep },
    { id: 'role', title: 'Role', component: RoleStep },
    { id: 'time', title: 'Time', component: TimeCommitmentStep },
    { id: 'motivation', title: 'Motivation', component: MotivationStep },
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

  const skipOnboarding = () => {
    // Set default preferences and redirect to dashboard
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
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
        difficulty_preference: onboardingData.experienceLevel === 'beginner' ? 'Easy' : 
                              onboardingData.experienceLevel === 'advanced' ? 'Hard' : 'Medium',
        notification_settings: {
          dailyChallenge: true,
          weeklyProgress: true,
          newProblems: false,
          communityUpdates: false,
        },
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

  // Calculate progress for steps 1-5 (excluding welcome and completion)
  const progressValue = currentStep === 0 || currentStep === steps.length - 1 
    ? 0 
    : ((currentStep - 1) / (steps.length - 3)) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/3 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Skip Button */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={skipOnboarding}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="bg-card/50 backdrop-blur border-b border-border px-6 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep} of {steps.length - 2}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressValue)}% Complete
                </span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <StepComponent
              data={onboardingData}
              updateData={updateData}
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipOnboarding}
              onComplete={completeOnboarding}
              isSubmitting={isSubmitting}
              canGoBack={currentStep > 0}
              showBackButton={currentStep > 1 && currentStep < steps.length - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
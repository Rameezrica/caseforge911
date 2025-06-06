import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { DomainProvider, useDomain } from './context/DomainContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import DomainProblemsPage from './pages/DomainProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SolutionPage from './pages/SolutionPage';
import CommunityPage from './pages/CommunityPage';
import ContestPage from './pages/ContestPage';
import StudyPlansPage from './pages/StudyPlansPage';
import SmartWorkspace from './components/workspace/SmartWorkspace';
import { NotFoundPage } from './pages/NotFoundPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import DomainDashboard from './pages/DomainDashboard';
import DomainLeaderboard from './pages/DomainLeaderboard';
import DomainLearningPaths from './pages/DomainLearningPaths';

// Domain-aware routing component
const DomainAwareRoutes: React.FC = () => {
  const { selectedDomain } = useDomain();
  const location = useLocation();
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
  
  // If no domain is selected and not on onboarding/domain selection pages, redirect to onboarding
  if (!selectedDomain && !hasCompletedOnboarding && 
      location.pathname !== '/onboarding' && 
      location.pathname !== '/select-domain' && 
      location.pathname !== '/') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If domain is selected but haven't completed onboarding, and not on onboarding page
  if (selectedDomain && !hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If completed onboarding but no domain selected, go to domain selector
  if (!selectedDomain && hasCompletedOnboarding && 
      location.pathname !== '/select-domain' && 
      location.pathname !== '/onboarding' && 
      location.pathname !== '/') {
    return <Navigate to="/select-domain" replace />;
  }

  return (
    <Routes>
      {/* Onboarding Flow */}
      <Route path="/onboarding" element={<OnboardingFlow />} />
      
      {/* Domain Selection */}
      <Route path="/select-domain" element={<OnboardingFlow />} />
      
      {/* Homepage - redirect based on state */}
      <Route path="/" element={
        !hasCompletedOnboarding ? (
          <Navigate to="/onboarding" replace />
        ) : selectedDomain ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/select-domain" replace />
        )
      } />
      
      {/* Domain Dashboard */}
      <Route path="/dashboard" element={
        selectedDomain ? (
          <LayoutWrapper><DomainDashboard /></LayoutWrapper>
        ) : (
          <Navigate to="/select-domain" replace />
        )
      } />
      
      {/* Domain-specific routes */}
      <Route path="/domain/:domain/leaderboard" element={<LayoutWrapper><DomainLeaderboard /></LayoutWrapper>} />
      <Route path="/domain/:domain/learning-paths" element={<LayoutWrapper><DomainLearningPaths /></LayoutWrapper>} />
      <Route path="/leaderboard" element={<LayoutWrapper><DomainLeaderboard /></LayoutWrapper>} />
      <Route path="/learning-paths" element={<LayoutWrapper><DomainLearningPaths /></LayoutWrapper>} />
      
      {/* Enhanced existing routes with domain awareness */}
      <Route path="/problems" element={<LayoutWrapper><DomainProblemsPage /></LayoutWrapper>} />
      <Route path="/problem/:id" element={<LayoutWrapper><ProblemDetailPage /></LayoutWrapper>} />
      <Route path="/profile" element={<LayoutWrapper><ProfilePage /></LayoutWrapper>} />
      <Route path="/solution/:id" element={<LayoutWrapper><SolutionPage /></LayoutWrapper>} />
      <Route path="/community" element={<LayoutWrapper><CommunityPage /></LayoutWrapper>} />
      <Route path="/contests" element={<LayoutWrapper><ContestPage /></LayoutWrapper>} />
      <Route path="/study-plans" element={<LayoutWrapper><StudyPlansPage /></LayoutWrapper>} />
      <Route path="/solve/:id" element={<SmartWorkspace />} />
      
      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Wrapper component to handle layout
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isOnboardingPage = location.pathname === '/onboarding' || location.pathname === '/select-domain';

  if (isAuthPage || isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DomainProvider>
      <Router>
        <DomainAwareRoutes />
      </Router>
    </DomainProvider>
  );
};

export default App;
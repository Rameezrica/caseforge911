import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { DomainProvider, useDomain } from './context/DomainContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SolutionPage from './pages/SolutionPage';
import CommunityPage from './pages/CommunityPage';
import ContestPage from './pages/ContestPage';
import StudyPlansPage from './pages/StudyPlansPage';
import SmartWorkspace from './components/workspace/SmartWorkspace';
import { NotFoundPage } from './pages/NotFoundPage';
import DomainSelector from './components/domain/DomainSelector';
import DomainDashboard from './pages/DomainDashboard';
import DomainLeaderboard from './pages/DomainLeaderboard';

// Domain-aware routing component
const DomainAwareRoutes: React.FC = () => {
  const { selectedDomain } = useDomain();
  const location = useLocation();
  
  // If no domain is selected and not on domain selection page, redirect to domain selector
  if (!selectedDomain && location.pathname !== '/select-domain' && location.pathname !== '/') {
    return <Navigate to="/select-domain" replace />;
  }

  return (
    <Routes>
      {/* Domain Selection */}
      <Route path="/select-domain" element={<DomainSelector />} />
      
      {/* Main Routes - Domain aware */}
      <Route path="/" element={
        selectedDomain ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <LayoutWrapper><HomePage /></LayoutWrapper>
        )
      } />
      
      {/* Domain Dashboard */}
      <Route path="/dashboard" element={<LayoutWrapper><DomainDashboard /></LayoutWrapper>} />
      
      {/* Domain-specific routes */}
      <Route path="/domain/:domain/leaderboard" element={<LayoutWrapper><DomainLeaderboard /></LayoutWrapper>} />
      <Route path="/leaderboard" element={<LayoutWrapper><DomainLeaderboard /></LayoutWrapper>} />
      
      {/* Enhanced existing routes with domain awareness */}
      <Route path="/problems" element={<LayoutWrapper><ProblemsPage /></LayoutWrapper>} />
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
  const isDomainSelector = location.pathname === '/select-domain';

  if (isAuthPage || isDomainSelector) {
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
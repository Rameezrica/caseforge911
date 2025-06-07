import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import CaseSolverPage from './pages/CaseSolverPage';
import { NotFoundPage } from './pages/NotFoundPage';
import ErrorBoundary from './components/ui/ErrorBoundary';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutWrapper><HomePage /></LayoutWrapper>} />
          <Route path="/problems" element={<LayoutWrapper><ProblemsPage /></LayoutWrapper>} />
          <Route path="/problem/:id" element={<LayoutWrapper><ProblemDetailPage /></LayoutWrapper>} />
          <Route path="/leaderboard" element={<LayoutWrapper><LeaderboardPage /></LayoutWrapper>} />
          <Route path="/profile" element={<LayoutWrapper><ProfilePage /></LayoutWrapper>} />
          <Route path="/solution/:id" element={<LayoutWrapper><SolutionPage /></LayoutWrapper>} />
          <Route path="/community" element={<LayoutWrapper><CommunityPage /></LayoutWrapper>} />
          <Route path="/contests" element={<LayoutWrapper><ContestPage /></LayoutWrapper>} />
          <Route path="/study-plans" element={<LayoutWrapper><StudyPlansPage /></LayoutWrapper>} />
          <Route path="/solve/:id" element={<LayoutWrapper><CaseSolverPage /></LayoutWrapper>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
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

// User authentication imports
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Admin panel imports
import AdminLoginPageSimple from './pages/admin/AdminLoginPageSimple';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProblemsPage from './pages/admin/AdminProblemsPage';
import AdminCompetitionsPage from './pages/admin/AdminCompetitionsPage';
import AdminLayout from './components/admin/layout/AdminLayout';
import ProtectedRouteAdmin from './components/admin/ProtectedRouteAdmin';
import { AdminAuthProvider } from './context/AdminAuthContext';


const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Exclude admin routes and auth pages from the main LayoutWrapper as they have their own layout
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname.startsWith('/admin');

  if (isAuthPage) {
    // For auth pages and admin routes, don't use the main app layout
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <main className="relative z-10 pt-20 pb-12">
        <div className="container-lg">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Routes */}
              <Route path="/" element={<LayoutWrapper><HomePage /></LayoutWrapper>} />
              <Route path="/problems" element={<LayoutWrapper><ProblemsPage /></LayoutWrapper>} />
              <Route path="/problem/:id" element={<LayoutWrapper><ProblemDetailPage /></LayoutWrapper>} />
              <Route path="/leaderboard" element={<LayoutWrapper><LeaderboardPage /></LayoutWrapper>} />
              <Route path="/community" element={<LayoutWrapper><CommunityPage /></LayoutWrapper>} />
              <Route path="/contests" element={<LayoutWrapper><ContestPage /></LayoutWrapper>} />
              <Route path="/study-plans" element={<LayoutWrapper><StudyPlansPage /></LayoutWrapper>} />

              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper><UserDashboardPage /></LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper><UserProfilePage /></LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-profile" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper><ProfilePage /></LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/solution/:id" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper><SolutionPage /></LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/solve/:id" 
                element={
                  <ProtectedRoute>
                    <LayoutWrapper><CaseSolverPage /></LayoutWrapper>
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPageSimple />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRouteAdmin>
                    <AdminLayout />
                  </ProtectedRouteAdmin>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="problems" element={<AdminProblemsPage />} />
                <Route path="competitions" element={<AdminCompetitionsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
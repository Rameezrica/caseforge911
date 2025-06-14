import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, Briefcase, Tag, ArrowLeft, 
  FileText, MessageSquare, Award, ExternalLink,
  Loader2, CheckCircle, X
} from 'lucide-react';
import { useProblem } from '../hooks/useProblems';
import DifficultyBadge from '../components/common/DifficultyBadge';

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'problem' | 'solutions' | 'discussions'>('problem');
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  
  const { problem, loading, error } = useProblem(id || '');
  
  useEffect(() => {
    if (problem) {
      document.title = `${problem.title} - CaseForge`;
    }
  }, [problem]);

  useEffect(() => {
    // Check if there's a success message from navigation state
    if (location.state?.message) {
      setShowMessage(true);
      // Clear the message from navigation state
      window.history.replaceState({}, document.title);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowMessage(false), 5000);
    }
  }, [location.state]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-dark-400">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (!problem && error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-dark-800 p-8 rounded-lg shadow-md max-w-md w-full text-center border border-dark-700">
          <div className="text-red-500 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-dark-50 mb-2">Problem Not Found</h2>
          <p className="text-dark-400 mb-6">
            We couldn't find the business case you're looking for.
          </p>
          <Link 
            to="/problems" 
            className="inline-flex items-center px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <Link 
          to="/problems" 
          className="inline-flex items-center text-dark-400 hover:text-dark-200 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Problems
        </Link>
        <h1 className="text-2xl font-bold text-dark-50 mb-4">{problem.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={problem.difficulty} size="lg" />
          <span className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm">
            {problem.category}
          </span>
          <span className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {problem.timeLimit} min
          </span>
          {problem.companyContext && (
            <span className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm flex items-center">
              <Briefcase className="mr-1 h-4 w-4" />
              {problem.companyContext}
            </span>
          )}
        </div>
      </div>

      <div className="lg:flex gap-6">
        <div className="lg:flex-1">
          <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
            <div className="flex border-b border-dark-700">
              <button
                onClick={() => setActiveTab('problem')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'problem'
                    ? 'text-emerald-500 border-b-2 border-emerald-500'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'solutions'
                    ? 'text-emerald-500 border-b-2 border-emerald-500'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Solutions (0)
              </button>
              <button
                onClick={() => setActiveTab('discussions')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'discussions'
                    ? 'text-emerald-500 border-b-2 border-emerald-500'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Discussions
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'problem' && (
                <div className="space-y-6">
                  {problem.companyContext && (
                    <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                      <h3 className="text-lg font-semibold text-dark-50 mb-2">Company Context</h3>
                      <p className="text-dark-200">{problem.companyContext}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-dark-50 mb-3">Problem Description</h3>
                    <div className="prose prose-dark max-w-none">
                      {problem.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-dark-300">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  {problem.frameworkSuggestions && (
                    <div>
                      <h3 className="text-lg font-semibold text-dark-50 mb-3">Suggested Framework</h3>
                      <div className="bg-dark-700 text-dark-200 rounded-lg px-4 py-3">
                        {problem.frameworkSuggestions.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => navigate(`/solve/${problem.id}`)}
                      className="px-6 py-3 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      Start Solving
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-dark-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-dark-50 mb-2">No solutions yet</h3>
                  <p className="text-dark-400 max-w-md mx-auto mb-6">
                    Be the first to submit a solution for this business case and help others learn.
                  </p>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="text-center py-10">
                  <MessageSquare className="h-12 w-12 text-dark-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-dark-50 mb-2">No discussions yet</h3>
                  <p className="text-dark-400 max-w-md mx-auto mb-6">
                    Start a discussion about this problem to share insights and learn from others.
                  </p>
                  <button
                    className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                  >
                    Start Discussion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
            <h3 className="font-semibold text-dark-50 mb-3">Problem Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Category</span>
                <span className="font-medium text-dark-50">{problem.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Time Limit</span>
                <span className="font-medium text-dark-50">{problem.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Difficulty</span>
                <span className="font-medium text-dark-50">{problem.difficulty}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
            <h3 className="font-semibold text-dark-50 mb-3">Need Help?</h3>
            <p className="text-dark-400 text-sm mb-4">
              Not sure where to start with this case? Check out these resources:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="flex items-center text-emerald-500 hover:text-emerald-400">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Business Case Framework Guide
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-emerald-500 hover:text-emerald-400">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  How to Structure Your Answer
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-emerald-500 hover:text-emerald-400">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Example Solutions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblem } from '../hooks/useProblems';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Clock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const CaseSolverPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { problem, loading, error } = useProblem(id || '');
  const { user } = useAuth();
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (problem) {
      document.title = `Solve: ${problem.title} - CaseForge`;
    }
  }, [problem]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-dark-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Problem Not Found</h1>
          <p className="text-dark-400 mb-4">The business case you're looking for could not be found.</p>
          <button
            onClick={() => navigate('/problems')}
            className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-400 mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/problem/${problem.id}`)}
              className="flex items-center text-dark-400 hover:text-dark-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Problem
            </button>
            <div>
              <h1 className="text-xl font-bold text-dark-50">{problem.title}</h1>
              <p className="text-dark-400 text-sm">{problem.category} • {problem.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-dark-400">
              <Clock className="h-5 w-5 mr-2" />
              <span>{problem.timeLimit || 60} minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-dark-50 mb-4">Problem Context</h2>
              <div className="space-y-4">
                <div className="text-sm text-dark-300 leading-relaxed">
                  {problem.description.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                    <p key={idx} className="mb-3">{paragraph}</p>
                  ))}
                </div>
                {problem.frameworkSuggestions && (
                  <div>
                    <h3 className="font-medium text-dark-50 mb-2">Suggested Framework</h3>
                    <div className="bg-dark-700 text-dark-200 rounded-lg px-3 py-2 text-sm">
                      {problem.frameworkSuggestions.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
              <h2 className="text-lg font-semibold text-dark-50 mb-6">Your Solution</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Write your solution to this business case:
                  </label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full h-96 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Start writing your solution here...

Consider the following structure:
1. Problem Analysis
2. Key Issues Identification  
3. Strategic Recommendations
4. Implementation Plan
5. Expected Outcomes"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => navigate(`/problem/${problem.id}`)}
                    className="px-6 py-2 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSolution}
                    disabled={isSubmitting || !solution.trim()}
                    className="px-6 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Solution'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseSolverPage;
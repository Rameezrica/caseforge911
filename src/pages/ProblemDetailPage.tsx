import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, Briefcase, Tag, ArrowLeft, 
  FileText, MessageSquare, Award, ExternalLink 
} from 'lucide-react';
import { getProblemById, getSolutionsForProblem } from '../data/mockData';
import DifficultyBadge from '../components/common/DifficultyBadge';

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'problem' | 'solutions' | 'discussions'>('problem');
  
  const problem = id ? getProblemById(id) : undefined;
  const solutions = id ? getSolutionsForProblem(id) : [];
  
  useEffect(() => {
    if (problem) {
      document.title = `${problem.title} - CaseForge`;
    }
  }, [problem]);
  
  if (!problem) {
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
      {/* Header */}
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
          <span className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm flex items-center">
            <Briefcase className="mr-1 h-4 w-4" />
            {problem.companyContext}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:flex-1">
          {/* Tabs */}
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
                Solutions ({solutions.length})
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

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'problem' && (
                <div className="space-y-6">
                  <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                    <h3 className="text-lg font-semibold text-dark-50 mb-2">Company Context</h3>
                    <p className="text-dark-200">{problem.companyContext}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-dark-50 mb-3">Problem Description</h3>
                    <div className="prose prose-dark max-w-none">
                      {problem.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-dark-300">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-dark-50 mb-3">Key Questions</h3>
                    <ul className="space-y-2">
                      {problem.questions.map((question, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 bg-dark-700 text-emerald-500 rounded-full mr-2 font-medium text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-dark-300">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {problem.frameworkSuggestions && (
                    <div>
                      <h3 className="text-lg font-semibold text-dark-50 mb-3">Suggested Frameworks</h3>
                      <div className="flex flex-wrap gap-2">
                        {problem.frameworkSuggestions.map((framework, idx) => (
                          <div key={idx} className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm flex items-center">
                            {framework}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-8">
                    <Link 
                      to={`/problem/${problem.id}/solve`}
                      className="px-6 py-3 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      Start Solving
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'solutions' && (
                <div>
                  {solutions.length > 0 ? (
                    <div className="space-y-6">
                      {solutions.map((solution) => (
                        <div key={solution.id} className="border border-dark-700 rounded-lg overflow-hidden">
                          <div className="border-b border-dark-700 bg-dark-700 px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="font-medium text-dark-50">{solution.userName}</div>
                              <span className="mx-2 text-dark-500">•</span>
                              <div className="text-sm text-dark-400">
                                {new Date(solution.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="bg-dark-600 text-emerald-500 rounded-full px-3 py-1 text-sm flex items-center">
                                <Award className="mr-1 h-4 w-4" />
                                AI Score: {solution.aiScore}
                              </div>
                              <div className="bg-dark-600 text-emerald-500 rounded-full px-3 py-1 text-sm">
                                +{solution.votes}
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-dark-800">
                            <h3 className="font-medium text-dark-50 mb-2">Executive Summary</h3>
                            <p className="text-dark-300 mb-4">{solution.executiveSummary}</p>
                            <Link 
                              to={`/solution/${solution.id}`} 
                              className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center text-sm"
                            >
                              View full solution
                              <ExternalLink className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-dark-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-dark-50 mb-2">No solutions yet</h3>
                      <p className="text-dark-400 max-w-md mx-auto mb-6">
                        Be the first to submit a solution for this business case and help others learn.
                      </p>
                      <Link 
                        to={`/problem/${problem.id}/solve`}
                        className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                      >
                        Submit a Solution
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="text-center py-10">
                  <MessageSquare className="h-12 w-12 text-dark-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-dark-50 mb-2">Join the discussion</h3>
                  <p className="text-dark-400 max-w-md mx-auto mb-6">
                    Share your thoughts on this case or ask questions to the community.
                  </p>
                  <button 
                    className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                  >
                    Start a Discussion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
            <h3 className="font-semibold text-dark-50 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag, idx) => (
                <div key={idx} className="bg-dark-700 text-dark-200 rounded-full px-3 py-1 text-sm flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
            <h3 className="font-semibold text-dark-50 mb-3">Problem Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Success Rate</span>
                <span className="font-medium text-dark-50">{problem.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Time Limit</span>
                <span className="font-medium text-dark-50">{problem.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Solutions</span>
                <span className="font-medium text-dark-50">{solutions.length}</span>
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
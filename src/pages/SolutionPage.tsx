import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Award } from 'lucide-react';

const mockSolution = {
  id: '1',
  problemId: '1',
  problemTitle: 'Coffee Shop Pricing Strategy',
  userName: 'Alex Johnson',
  submittedAt: '2023-11-10T14:30:00Z',
  votes: 12,
  aiScore: 85,
  aiFeedback: 'Strong overall analysis with excellent price tiering strategy. Consider adding more quantitative analysis on price elasticity and specific price points for key products.',
  content: {
    executiveSummary: 'The coffee shop should implement a tiered pricing strategy with premium options and loyalty discounts to increase margins while maintaining customer base.',
    problemAnalysis: `Analysis of current market conditions, competitive landscape, and customer preferences shows price sensitivity among students but willingness to pay premium prices for quality and experience among professionals.
    
    The local coffee shop chain faces a challenging competitive environment with pressure from both national chains (lower prices) and artisanal cafes (higher quality perception). 
    
    Key insights from customer data:
    - Young professionals (60% of customers) prioritize quality and experience, with moderate price sensitivity
    - Students (40% of customers) are highly price-sensitive but value the atmosphere for studying
    - Current pricing positions the chain in a middle ground without clear differentiation
    - Customer frequency (2.5 visits/week) suggests loyalty potential
    - Current margins are being squeezed by rising costs`,
    
    recommendations: `Implement a three-tier pricing model with:
    
    1. Basic options at competitive rates to retain price-sensitive students
       - Regular drip coffee priced at or slightly below national chains
       - Simple pastries at competitive price points
       - Student discount program (10% with valid ID)
    
    2. Premium options at higher margins for professionals
       - Specialty drinks with unique ingredients at 15-20% premium
       - Artisanal pastries and light meals with 25-30% margins
       - Emphasize quality and craftsmanship in marketing
    
    3. Bundle deals and loyalty program
       - Coffee + pastry bundles at 10% discount from individual prices
       - Digital loyalty program offering 10th drink free
       - Monthly subscription option for daily coffee at discount`,
    
    implementationPlan: `Phase 1 (Month 1):
    - Conduct detailed price elasticity testing at 2 locations
    - Design new menu layouts highlighting tiered options
    - Develop digital loyalty program infrastructure
    
    Phase 2 (Month 2):
    - Roll out new pricing across all locations
    - Launch loyalty program with promotional campaign
    - Train staff on communicating value proposition
    
    Phase 3 (Month 3):
    - Analyze results and make necessary adjustments
    - Expand premium offerings based on performance
    - Implement targeted marketing for different customer segments`,
    
    riskAssessment: `Potential risks include:
    
    1. Customer pushback on premium pricing
       - Mitigation: Clear communication of value proposition and maintaining basic options
    
    2. Competitive response from national chains or artisanal cafes
       - Mitigation: Monitor competitor actions and be prepared to adjust strategy
    
    3. Operational complexity of tiered pricing
       - Mitigation: Thorough staff training and simplified POS system updates
    
    4. Insufficient uptake of premium options
       - Mitigation: Sampling programs and promotional introductions to build awareness`
  },
  comments: [
    {
      id: '1',
      userName: 'Taylor Smith',
      content: 'Great approach on the tiered pricing strategy. I would add that the coffee shop could consider seasonal pricing variations to capitalize on changing consumer preferences throughout the year.',
      createdAt: '2023-11-10T16:45:00Z',
      votes: 5
    },
    {
      id: '2',
      userName: 'Morgan Lee',
      content: 'I like the overall strategy, but I think the risk assessment could be more comprehensive. Have you considered the impact on regular customers who might feel alienated by the new premium pricing?',
      createdAt: '2023-11-11T10:20:00Z',
      votes: 7
    }
  ]
};

const SolutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [solution, setSolution] = useState(mockSolution);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  
  useEffect(() => {
    if (solution) {
      document.title = `Solution for ${solution.problemTitle} - CaseForge`;
    }
  }, [solution]);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvoted(false);
      setSolution(prev => ({ ...prev, votes: prev.votes - 1 }));
    } else {
      setUpvoted(true);
      if (downvoted) {
        setDownvoted(false);
        setSolution(prev => ({ ...prev, votes: prev.votes + 2 }));
      } else {
        setSolution(prev => ({ ...prev, votes: prev.votes + 1 }));
      }
    }
  };

  const handleDownvote = () => {
    if (downvoted) {
      setDownvoted(false);
      setSolution(prev => ({ ...prev, votes: prev.votes + 1 }));
    } else {
      setDownvoted(true);
      if (upvoted) {
        setUpvoted(false);
        setSolution(prev => ({ ...prev, votes: prev.votes - 2 }));
      } else {
        setSolution(prev => ({ ...prev, votes: prev.votes - 1 }));
      }
    }
  };

  if (!solution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <MessageSquare className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the solution you're looking for.
          </p>
          <Link 
            to="/problems" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-blue-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to={`/problem/${solution.problemId}`} 
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Problem
          </Link>
          <h1 className="text-2xl font-bold text-white">Solution for {solution.problemTitle}</h1>
          
          <div className="mt-4 flex items-center text-blue-100">
            <span>By {solution.userName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(solution.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {/* Solution Score and Actions */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium flex items-center mr-2">
                    <Award className="mr-1 h-4 w-4" />
                    AI Score: {solution.aiScore}/100
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleUpvote}
                      className={`p-1 rounded-full ${upvoted ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <span className={`font-medium ${solution.votes > 0 ? 'text-green-600' : solution.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {solution.votes}
                    </span>
                    <button 
                      onClick={handleDownvote}
                      className={`p-1 rounded-full ${downvoted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Share Solution
                  </button>
                </div>
              </div>
              
              {/* Solution Content */}
              <div className="p-6">
                {/* Executive Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Executive Summary</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{solution.content.executiveSummary}</p>
                  </div>
                </div>
                
                {/* Problem Analysis */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Problem Analysis</h2>
                  <div className="prose max-w-none text-gray-700">
                    {solution.content.problemAnalysis.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Recommendations</h2>
                  <div className="prose max-w-none text-gray-700">
                    {solution.content.recommendations.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* Implementation Plan */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Implementation Plan</h2>
                  <div className="prose max-w-none text-gray-700">
                    {solution.content.implementationPlan.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {/* Risk Assessment */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Risk Assessment</h2>
                  <div className="prose max-w-none text-gray-700">
                    {solution.content.riskAssessment.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Comments ({solution.comments.length})
                </h2>
              </div>
              
              <div className="p-6">
                {solution.comments.length > 0 ? (
                  <div className="space-y-6">
                    {solution.comments.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium text-gray-900">{comment.userName}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center text-sm">
                          <button className="text-gray-500 hover:text-gray-700 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({comment.votes})
                          </button>
                          <button className="ml-4 text-gray-500 hover:text-gray-700">Reply</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-6">No comments yet. Be the first to comment on this solution.</p>
                )}
                
                {/* Add Comment Form */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add Your Comment</h3>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your thoughts on this solution..."
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200">
                      Submit Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {/* AI Feedback */}
            <div className="bg-white rounded-lg shadow-md p-5 mb-6">
              <div className="flex items-center mb-3">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">AI Feedback</h3>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
                {solution.aiFeedback}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-600">Structure</span>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Analysis</span>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Recommendations</span>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Implementation</span>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Similar Problems */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Similar Problems</h3>
              <div className="space-y-3">
                <Link 
                  to="/problem/4" 
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Fitness App Pricing Strategy</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 font-medium mr-2">
                      Easy
                    </span>
                    <span>Marketing & Growth</span>
                  </div>
                </Link>
                <Link 
                  to="/problem/2" 
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Tech Startup Market Entry Strategy</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 font-medium mr-2">
                      Medium
                    </span>
                    <span>Strategy & Consulting</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;
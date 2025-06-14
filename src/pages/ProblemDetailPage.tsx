import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, Briefcase, Tag, ArrowLeft, 
  FileText, MessageSquare, Award, ExternalLink,
  Loader2, CheckCircle, X
} from 'lucide-react';
import { useProblem } from '../hooks/useProblems';
import DifficultyBadge from '../components/common/DifficultyBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
        <LoadingSpinner size="lg" text="Loading problem details..." />
      </div>
    );
  }

  if (!problem && error) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-destructive mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the business case you're looking for.
          </p>
          <Button asChild>
            <Link to="/problems">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Problems
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Success Message */}
      {showMessage && location.state?.message && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-success mr-3" />
            <span className="text-success font-medium">{location.state.message}</span>
          </div>
          <button
            onClick={() => setShowMessage(false)}
            className="text-success/70 hover:text-success"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <Card className="p-6">
        <Link 
          to="/problems" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Problems
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-4">{problem.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={problem.difficulty} size="lg" />
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
            {problem.category}
          </span>
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {problem.timeLimit} min
          </span>
          {problem.companyContext && (
            <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center">
              <Briefcase className="mr-1 h-4 w-4" />
              {problem.companyContext}
            </span>
          )}
        </div>
      </Card>

      <div className="lg:flex gap-6">
        <div className="lg:flex-1">
          <Card className="overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('problem')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                  activeTab === 'problem'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                  activeTab === 'solutions'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Solutions (0)
              </button>
              <button
                onClick={() => setActiveTab('discussions')}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                  activeTab === 'discussions'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Discussions
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'problem' && (
                <div className="space-y-6">
                  {problem.companyContext && (
                    <Card className="p-4 bg-muted/50">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Company Context</h3>
                      <p className="text-muted-foreground">{problem.companyContext}</p>
                    </Card>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Problem Description</h3>
                    <div className="prose max-w-none">
                      {problem.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-muted-foreground leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  {problem.frameworkSuggestions && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Suggested Framework</h3>
                      <Card className="p-4 bg-muted/50">
                        <p className="text-muted-foreground">
                          {problem.frameworkSuggestions.join(', ')}
                        </p>
                      </Card>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      size="lg"
                      onClick={() => navigate(`/solve/${problem.id}`)}
                    >
                      Start Solving
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No solutions yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Be the first to submit a solution for this business case and help others learn.
                  </p>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No discussions yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Start a discussion about this problem to share insights and learn from others.
                  </p>
                  <Button variant="outline">
                    Start Discussion
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6 mt-6 lg:mt-0">
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Problem Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{problem.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Limit</span>
                <span className="font-medium text-foreground">{problem.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium text-foreground">{problem.difficulty}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Not sure where to start with this case? Check out these resources:
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Business Case Framework Guide
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  How to Structure Your Answer
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Example Solutions
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
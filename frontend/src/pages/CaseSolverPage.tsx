import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblem } from '../hooks/useProblems';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Clock, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const CaseSolverPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { problem, loading, error } = useProblem(id || '');
  const { user } = useAuth();
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      document.title = `Solve: ${problem.title} - CaseForge`;
    }
  }, [problem]);

  const handleSubmitSolution = async () => {
    if (!solution.trim() || !user) {
      setSubmitError('Please provide a solution before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await apiService.submitSolution(problem.id, solution.trim(), user.id);
      setSubmitted(true);
      
      // Show success message and redirect after a short delay
      setTimeout(() => {
        navigate(`/problem/${problem.id}`, { 
          state: { message: 'Solution submitted successfully!' }
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting solution:', error);
      setSubmitError('Failed to submit solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem || error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h1>
            <p className="text-muted-foreground mb-4">The business case you're looking for could not be found.</p>
            <Button onClick={() => navigate('/problems')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/problem/${problem.id}`)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Problem
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{problem.title}</h1>
              <p className="text-muted-foreground text-sm">{problem.category} • {problem.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-5 w-5 mr-2" />
            <span>{problem.timeLimit || 60} minutes</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Context Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Problem Context</h2>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground leading-relaxed">
                {problem.description.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                  <p key={idx} className="mb-3">{paragraph}</p>
                ))}
              </div>
              {problem.frameworkSuggestions && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Suggested Framework</h3>
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                    {problem.frameworkSuggestions.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Solution Editor */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Your Solution</h2>
            
            <div className="space-y-4">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Solution Submitted!</h3>
                  <p className="text-muted-foreground">Thank you for your solution. Redirecting you back to the problem...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Write your solution to this business case:
                    </label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="w-full h-96 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Start writing your solution here...

Consider the following structure:
1. Problem Analysis
2. Key Issues Identification  
3. Strategic Recommendations
4. Implementation Plan
5. Expected Outcomes"
                    />
                  </div>
                  
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{submitError}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/problem/${problem.id}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitSolution}
                      disabled={isSubmitting || !solution.trim()}
                      leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseSolverPage;
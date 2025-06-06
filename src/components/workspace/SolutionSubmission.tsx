import React, { useState } from 'react';
import { FileText, Send, Save, Eye, Download } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
  questions?: string[];
}

interface SolutionSubmissionProps {
  problem: Problem;
  solution: string;
  onSolutionChange: (solution: string) => void;
  onSubmit: () => void;
}

const SolutionSubmission: React.FC<SolutionSubmissionProps> = ({
  problem,
  solution,
  onSolutionChange,
  onSubmit
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');

  const handleSubmit = () => {
    // Here you would normally submit to backend
    console.log('Submitting solution:', { solution, submissionNotes });
    onSubmit();
  };

  const formatSolutionPreview = (text: string) => {
    // Convert markdown-like formatting to HTML
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-dark-50 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-dark-50 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-dark-50 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-dark-50">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-dark-200">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="text-dark-300 mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-dark-300 mb-4">')
      .replace(/^(?!<)/gm, '<p class="text-dark-300 mb-4">')
      .replace(/$(?!>)/gm, '</p>');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dark-50 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Solution Submission
            </h3>
            <p className="text-sm text-dark-400 mt-1">
              Submit your analysis for: {problem.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded-lg transition-colors ${
                isPreview ? 'bg-blue-600 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 bg-dark-700 text-dark-300 hover:bg-dark-600 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 bg-dark-700 text-dark-300 hover:bg-dark-600 rounded-lg transition-colors">
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {!isPreview ? (
          // Editor Mode
          <div className="flex-1 p-6">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Your Solution Analysis
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => onSolutionChange(e.target.value)}
                  placeholder="Write your comprehensive business case analysis here. Use markdown formatting for better structure:

# Executive Summary
Brief overview of your recommendation...

## Analysis Framework
Which framework(s) did you use and why...

## Key Findings
- Finding 1: Supporting evidence
- Finding 2: Supporting evidence

## Recommendations
1. Primary recommendation with rationale
2. Secondary recommendation with rationale

## Implementation Plan
Step-by-step approach...

## Risk Assessment
Potential risks and mitigation strategies..."
                  className="w-full h-96 bg-dark-700 border border-dark-600 rounded-lg p-4 text-dark-50 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Submission Notes (Optional)
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Any additional notes about your approach, assumptions made, or areas where you'd like specific feedback..."
                  className="w-full h-24 bg-dark-700 border border-dark-600 rounded-lg p-3 text-dark-50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-dark-400">
                  Word count: {solution.split(/\s+/).filter(word => word.length > 0).length} words
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!solution.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-dark-600 disabled:text-dark-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Preview Mode
          <div className="flex-1 p-6">
            <div className="bg-dark-700 rounded-lg p-6 h-full overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: solution ? formatSolutionPreview(solution) : '<p class="text-dark-400 italic">No solution content to preview</p>' 
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar with Tips */}
        <div className="w-80 bg-dark-800 border-l border-dark-700 p-4">
          <h4 className="text-lg font-medium text-dark-50 mb-4">Submission Guidelines</h4>
          
          <div className="space-y-4">
            <div className="bg-dark-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-dark-50 mb-2">Structure Your Response</h5>
              <ul className="text-xs text-dark-400 space-y-1">
                <li>• Start with executive summary</li>
                <li>• Use clear section headers</li>
                <li>• Support claims with data</li>
                <li>• End with actionable recommendations</li>
              </ul>
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-dark-50 mb-2">Domain-Specific Tips</h5>
              {problem.domain.toLowerCase().includes('finance') && (
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Include financial metrics and ratios</li>
                  <li>• Show calculation methodology</li>
                  <li>• Consider risk factors</li>
                  <li>• Provide valuation range</li>
                </ul>
              )}
              {problem.domain.toLowerCase().includes('strategy') && (
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Use strategic frameworks</li>
                  <li>• Analyze competitive landscape</li>
                  <li>• Consider market dynamics</li>
                  <li>• Address implementation challenges</li>
                </ul>
              )}
              {problem.domain.toLowerCase().includes('operations') && (
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Map current vs. future state</li>
                  <li>• Quantify efficiency gains</li>
                  <li>• Address capacity constraints</li>
                  <li>• Consider change management</li>
                </ul>
              )}
              {problem.domain.toLowerCase().includes('marketing') && (
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Define target customer segments</li>
                  <li>• Analyze customer journey</li>
                  <li>• Calculate customer economics</li>
                  <li>• Measure success metrics</li>
                </ul>
              )}
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-dark-50 mb-2">Evaluation Criteria</h5>
              <ul className="text-xs text-dark-400 space-y-1">
                <li>• Analytical rigor (30%)</li>
                <li>• Framework application (25%)</li>
                <li>• Practical recommendations (25%)</li>
                <li>• Communication clarity (20%)</li>
              </ul>
            </div>

            {problem.questions && problem.questions.length > 0 && (
              <div className="bg-dark-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-dark-50 mb-2">Key Questions to Address</h5>
                <ul className="text-xs text-dark-400 space-y-1">
                  {problem.questions.map((question, index) => (
                    <li key={index}>• {question}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-400 mb-2">💡 Pro Tip</h5>
              <p className="text-xs text-blue-300">
                Use the workspace tools to generate charts, calculations, and frameworks, then 
                incorporate those insights into your solution narrative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSubmission;
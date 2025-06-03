import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Clock, Save, RefreshCw, Send, HelpCircle,
  ChevronDown, FileText, CheckCircle, AlertTriangle
} from 'lucide-react';
import { getProblemById } from '../data/mockData';

interface Section {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  minWords?: number;
}

const CaseSolverPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const problem = id ? getProblemById(id) : undefined;
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(problem?.timeLimit ? problem.timeLimit * 60 : 0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [showFrameworks, setShowFrameworks] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const [sections, setSections] = useState<Section[]>([
    {
      id: 'problem-definition',
      title: '1. Problem Definition',
      content: '',
      wordCount: 0,
      minWords: 100
    },
    {
      id: 'analysis-framework',
      title: '2. Analysis Framework',
      content: '',
      wordCount: 0,
      minWords: 200
    },
    {
      id: 'strategic-options',
      title: '3. Strategic Options',
      content: '',
      wordCount: 0,
      minWords: 300
    },
    {
      id: 'recommendation',
      title: '4. Recommendation',
      content: '',
      wordCount: 0,
      minWords: 200
    },
    {
      id: 'implementation-plan',
      title: '5. Implementation Plan',
      content: '',
      wordCount: 0,
      minWords: 200
    }
  ]);

  useEffect(() => {
    if (timerEnabled && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerEnabled, timeRemaining]);

  useEffect(() => {
    const autoSave = () => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1000);
    };

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [sections]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContentChange = (sectionId: string, content: string) => {
    if (!timerStarted && content.trim().length > 0) {
      setTimerStarted(true);
      setTimerEnabled(true);
    }
    setHasStartedTyping(true);
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content,
          wordCount: content.trim().split(/\s+/).length
        };
      }
      return section;
    }));
  };

  const frameworks = [
    { name: 'SWOT Analysis', description: 'Strengths, Weaknesses, Opportunities, Threats' },
    { name: "Porter's 5 Forces", description: 'Industry competition analysis framework' },
    { name: '4Ps Marketing Mix', description: 'Product, Price, Place, Promotion' },
    { name: 'BCG Matrix', description: 'Portfolio management tool' },
    { name: 'Value Chain Analysis', description: 'Primary and support activities' }
  ];

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      setSections(prev => prev.map(section => ({ ...section, content: '', wordCount: 0 })));
    }
  };

  const handleSubmit = () => {
    setTimerEnabled(false);
    
    const incompleteSections = sections.filter(section => 
      section.minWords && section.wordCount < section.minWords
    );

    if (incompleteSections.length > 0) {
      alert(`Please complete the following sections:\n${
        incompleteSections.map(s => s.title).join('\n')
      }`);
      return;
    }

    console.log('Submitting solution:', sections);
  };

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-dark-50">{problem?.title}</h1>
              <div className="flex items-center space-x-4 text-dark-400 text-sm mt-1">
                <span>{problem?.companyContext}</span>
                <span>•</span>
                <span>{problem?.category}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`font-mono text-lg ${
                  timeRemaining < 300 ? 'text-red-500' : 'text-dark-200'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>

              <div className="text-sm">
                {autoSaveStatus === 'saving' && (
                  <span className="text-dark-400">Saving...</span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-emerald-500 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Saved
                  </span>
                )}
                {autoSaveStatus === 'error' && (
                  <span className="text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Error saving
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-dark-400 hover:text-dark-200 transition-colors duration-200"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowFrameworks(!showFrameworks)}
                  className="px-3 py-2 text-dark-400 hover:text-dark-200 transition-colors duration-200"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            {sections.map(section => (
              <div
                key={section.id}
                className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
              >
                <div className="p-4 border-b border-dark-700">
                  <h2 className="text-lg font-semibold text-dark-50">{section.title}</h2>
                  {section.minWords && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-dark-400">
                        Minimum words: {section.minWords}
                      </span>
                      <span className={`${
                        section.wordCount >= (section.minWords || 0)
                          ? 'text-emerald-500'
                          : 'text-dark-400'
                      }`}>
                        {section.wordCount} words
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <textarea
                    value={section.content}
                    onChange={(e) => handleContentChange(section.id, e.target.value)}
                    className="w-full h-48 bg-dark-700 text-dark-50 p-4 rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder={`Enter your ${section.title.toLowerCase()}...`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="w-80 space-y-6">
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">Problem Details</h3>
              <div className="space-y-4 text-dark-300">
                {problem.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">Suggested Frameworks</h3>
              <div className="space-y-3">
                {frameworks.map((framework, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors duration-200"
                  >
                    <div className="font-medium text-dark-50 mb-1">{framework.name}</div>
                    <div className="text-sm text-dark-400">{framework.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
              <h3 className="text-lg font-semibold text-dark-50 mb-4">Attachments</h3>
              <div className="border-2 border-dashed border-dark-600 rounded-lg p-4 text-center">
                <FileText className="h-8 w-8 text-dark-400 mx-auto mb-2" />
                <div className="text-sm text-dark-400">
                  Drag & drop files here or{' '}
                  <button className="text-emerald-500 hover:text-emerald-400">browse</button>
                </div>
                <div className="text-xs text-dark-500 mt-1">
                  Supported: PDF, Excel, Images (max 10MB)
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Save, 
  Download, 
  Share2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  domain: string;
  company?: string;
  timeLimit?: number;
}

interface WorkspaceHeaderProps {
  problem: Problem;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ problem }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(problem.timeLimit ? problem.timeLimit * 60 : 3600);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  // Auto-save simulation
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-900 text-green-200';
      case 'medium':
        return 'bg-yellow-900 text-yellow-200';
      case 'hard':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/problems')}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-dark-300" />
          </button>
          
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-dark-50 truncate max-w-md">
                {problem.title}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {problem.company && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-900 text-blue-200 rounded-full">
                  {problem.company}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-dark-400">{problem.category}</span>
              <span className="text-dark-600">•</span>
              <span className="text-sm text-dark-400">{problem.domain}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Timer */}
          <div className="flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4 text-dark-300" />
            <span className={`font-mono text-sm ${timeRemaining < 300 ? 'text-red-400' : 'text-dark-200'}`}>
              {formatTime(timeRemaining)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:bg-dark-600 rounded"
            >
              {isTimerRunning ? (
                <Pause className="h-3 w-3 text-dark-400" />
              ) : (
                <Play className="h-3 w-3 text-dark-400" />
              )}
            </button>
            <button
              onClick={() => {
                setTimeRemaining(problem.timeLimit ? problem.timeLimit * 60 : 3600);
                setIsTimerRunning(true);
              }}
              className="p-1 hover:bg-dark-600 rounded"
            >
              <RotateCcw className="h-3 w-3 text-dark-400" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-dark-400">
              {autoSaved && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Auto-saved</span>
                </>
              )}
            </div>
            
            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
              <Save className="h-4 w-4 text-dark-300" />
            </button>
            
            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
              <Download className="h-4 w-4 text-dark-300" />
            </button>
            
            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
              <Share2 className="h-4 w-4 text-dark-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
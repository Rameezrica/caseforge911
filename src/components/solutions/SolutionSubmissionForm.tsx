import React, { useState, useEffect, ChangeEvent, DragEvent, useImperativeHandle } from 'react';
import { Clock, Save, AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import PremiumCard from '../ui/PremiumCard';
import PremiumToast from '../ui/PremiumToast';
import PremiumModal from '../ui/PremiumModal';

interface SolutionSubmissionFormProps {
  problemId: string;
  timeLimit: number;
  questions: string[];
  onSubmit: (solution: { answers: string[]; files: File[] }) => void;
  onCancel: () => void;
  refInsert?: React.MutableRefObject<((template: string) => void) | undefined>;
}

const MIN_WORDS = 200;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'image/png',
  'image/jpeg',
];

const SolutionSubmissionForm: React.FC<SolutionSubmissionFormProps> = ({
  problemId,
  timeLimit,
  questions,
  onSubmit,
  onCancel,
  refInsert
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // seconds
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
  const [files, setFiles] = useState<File[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // step-by-step navigation
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({ message: '', type: 'info', visible: false });

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-save effect
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (answers.some(ans => ans.trim() !== '')) {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          localStorage.setItem(`solution_${problemId}`, JSON.stringify(answers));
          setAutoSaveStatus('saved');
        }, 1000);
      }
    }, 30000);
    return () => clearInterval(autoSaveTimer);
  }, [answers, problemId]);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem(`solution_${problemId}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {}
    }
  }, [problemId]);

  // Expose insert function to parent via refInsert
  useEffect(() => {
    if (!refInsert) return;
    refInsert.current = (template: string) => {
      setAnswers(prev => {
        const idx = currentStep;
        const textarea = textareaRef.current;
        if (!textarea) return prev;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = prev[idx].slice(0, start);
        const after = prev[idx].slice(end);
        const newValue = before + template + after;
        // Move cursor after inserted template
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + template.length;
        }, 0);
        return prev.map((ans, i) => (i === idx ? newValue : ans));
      });
    };
  }, [refInsert, currentStep]);

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers(prev => prev.map((ans, i) => (i === idx ? value : ans)));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => ACCEPTED_TYPES.includes(file.type));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => ACCEPTED_TYPES.includes(file.type));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    setAnswers(questions.map(() => ''));
    setFiles([]);
    localStorage.removeItem(`solution_${problemId}`);
    setToast({ message: 'All answers and attachments have been reset.', type: 'info', visible: true });
    setShowResetModal(false);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    // All questions must be answered (not blank), but no word count enforcement
    const allAnswered = answers.every(ans => ans.trim().length > 0);
    if (!allAnswered) {
      setToast({ message: 'You need to answer all questions in order to submit your solution.', type: 'error', visible: true });
      return;
    }
    setIsSubmitting(true);
    onSubmit({ answers, files });
    setToast({ message: 'Solution submitted successfully!', type: 'success', visible: true });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Progress calculation
  const totalQuestions = questions.length;
  const answeredCount = answers.filter(ans => ans.replace(/<[^>]+>/g, '').trim().length > 0).length;
  const overallProgress = (currentStep + 1) / totalQuestions;

  // Estimate time remaining based on pace
  const elapsed = timeLimit * 60 - timeLeft;
  const avgTimePerQ = answeredCount > 0 ? elapsed / answeredCount : 0;
  const estTimeRemaining = avgTimePerQ > 0 ? Math.round((totalQuestions - answeredCount) * avgTimePerQ) : timeLeft;
  const formatEst = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  // Add wrapper handlers for textarea drag events (fix linter errors)
  const handleTextareaDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    handleDrop(e as unknown as DragEvent<HTMLDivElement>);
  };
  const handleTextareaDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    handleDragOver(e as unknown as DragEvent<HTMLDivElement>);
  };
  const handleTextareaDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    handleDragLeave(e as unknown as DragEvent<HTMLDivElement>);
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-dark-50 font-semibold text-lg">
            Question {currentStep + 1} of {totalQuestions}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {questions.map((_, idx) => (
            <div key={idx} className={`flex items-center justify-center w-7 h-7 rounded-full border-2 ${answers[idx].replace(/<[^>]+>/g, '').trim().length > 0 ? 'bg-emerald-500 border-emerald-500' : 'bg-dark-900 border-dark-700'} transition-colors duration-200`}>
              {answers[idx].replace(/<[^>]+>/g, '').trim().length > 0 ? (
                <CheckCircle2 className="h-5 w-5 text-dark-900" />
              ) : (
                <span className="text-dark-400 text-xs">{idx + 1}</span>
              )}
            </div>
          ))}
          <div className="flex-1 flex justify-center ml-4">
            <div className="relative w-1/3 h-2 rounded-full border border-dark-700 bg-dark-700 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Header: Timer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <div className="flex items-center text-dark-400">
          <Clock className="h-5 w-5 mr-2" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center text-dark-400">
          {autoSaveStatus === 'saving' && <><Save className="h-4 w-4 mr-1 animate-spin" /><span>Saving...</span></>}
          {autoSaveStatus === 'saved' && <><CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" /><span>All changes saved</span></>}
          {autoSaveStatus === 'error' && <><AlertCircle className="h-4 w-4 mr-1 text-red-500" /><span>Error saving</span></>}
        </div>
      </div>
      {/* Step-by-step Question & Answer */}
      <div className="space-y-8">
        <PremiumCard className="mb-8">
          <div className="mb-2 text-dark-50 font-semibold">Q{currentStep + 1}: {questions[currentStep]}</div>
          <div
            className={`relative rounded-2xl border transition-colors duration-200 shadow-md bg-dark-900 ${dragActive ? 'border-emerald-500 ring-2 ring-emerald-400' : 'border-dark-700'}`}
            style={{ minHeight: '10rem' }}
          >
            {/* Drag overlay */}
            {dragActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-900 bg-opacity-80 rounded-2xl pointer-events-none">
                <span className="text-emerald-400 font-semibold text-lg">Drop files to attach</span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={answers[currentStep]}
              onChange={e => handleAnswerChange(currentStep, e.target.value)}
              placeholder="Type your answer here..."
              className="answer-textarea w-full h-40 p-4 bg-transparent border-none rounded-2xl text-dark-50 placeholder-dark-400 focus:outline-none resize-none pr-12"
              style={{ backgroundColor: 'transparent', color: '#f3f4f6', zIndex: 1 }}
              onDrop={handleTextareaDrop}
              onDragOver={handleTextareaDragOver}
              onDragLeave={handleTextareaDragLeave}
            />
            <label className="absolute bottom-4 right-4 cursor-pointer text-dark-400 hover:text-emerald-400" title="Attach files">
              <input
                type="file"
                multiple
                accept={ACCEPTED_TYPES.join(',')}
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="h-5 w-5" />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center bg-dark-700 rounded-lg px-3 py-1 text-xs text-dark-200 shadow border border-dark-600">
                  <span className="mr-2">
                    {file.type.startsWith('image/') ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    ) : file.type.includes('pdf') ? (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
                    ) : file.type.includes('word') ? (
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
                    ) : file.type.includes('excel') ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
                    ) : file.type.includes('presentation') ? (
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
                    ) : (
                      <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    )}
                  </span>
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button onClick={() => handleRemoveFile(idx)} className="ml-2 text-red-500 hover:text-red-400" title="Remove">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Navigation and action buttons - minimal vertical gap, no horizontal gap */}
          <div className="flex justify-between items-center mt-1">
            <div>
              {currentStep > 0 && (
                <PremiumButton
                  variant="secondary"
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                >
                  Previous
                </PremiumButton>
              )}
            </div>
            <div className="flex gap-1">
              <PremiumButton
                variant="secondary"
                ariaLabel="Reset answers"
                onClick={() => setShowResetModal(true)}
              >
                Reset
              </PremiumButton>
              {currentStep < totalQuestions - 1 && (
                <PremiumButton
                  variant="primary"
                  onClick={() => setCurrentStep(s => Math.min(totalQuestions - 1, s + 1))}
                >
                  Next
                </PremiumButton>
              )}
              {/* Always show Submit on last question, gray/disabled look if not all answered, but not disabled */}
              {currentStep === totalQuestions - 1 && (
                <PremiumButton
                  variant="primary"
                  ariaLabel="Submit solution"
                  onClick={() => handleSubmit()}
                  className={
                    answers.every(ans => ans.replace(/<[^>]+>/g, '').trim().length > 0)
                      ? ''
                      : 'bg-dark-700 text-dark-400 cursor-not-allowed hover:bg-dark-700'
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </PremiumButton>
              )}
            </div>
          </div>
        </PremiumCard>
      </div>
      {/* Footer intentionally left empty (no Cancel button) */}
      <PremiumToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
      <PremiumModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Answers?"
        actions={
          <>
            <PremiumButton variant="secondary" ariaLabel="Cancel reset" onClick={() => setShowResetModal(false)}>Cancel</PremiumButton>
            <PremiumButton variant="danger" ariaLabel="Confirm reset" onClick={handleReset}>Reset</PremiumButton>
          </>
        }
      >
        Are you sure you want to reset all answers and attachments? This cannot be undone.
      </PremiumModal>
    </div>
  );
};

export default SolutionSubmissionForm; 
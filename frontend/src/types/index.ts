export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'Finance & Investment'
  | 'Operations & Supply Chain'
  | 'Management'
  | 'Strategy & Consulting'
  | 'Marketing & Growth'
  | 'Strategy'
  | 'Marketing'
  | 'Operations'
  | 'Finance'
  | 'Data Analytics';

export interface User {
  id: string;
  name: string;
  email: string;
  problemsSolved: number;
  rank: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedOn?: string;
}

// Backend Problem interface (matches API response)
export interface BackendProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  domain: string;
  difficulty: string;
  company?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

// Frontend Problem interface (what the UI expects)
export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit: number;
  tags?: string[];
  companyContext?: string;
  createdAt: string;
  solvedCount: number;
  averageScore?: number;
  successRate?: number;
  questions?: string[];
  frameworkSuggestions?: string[];
  domain?: string;
  company?: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  problemId: string;
  participants: number;
  averageTime: number;
  completionRate: number;
  problem: Problem;
}

export interface Solution {
  id: string;
  userId: string;
  userName: string;
  problemId: string;
  content: string;
  executiveSummary: string;
  problemAnalysis: string;
  recommendations: string;
  implementationPlan: string;
  riskAssessment: string;
  submittedAt: string;
  votes: number;
  aiScore: number;
  aiFeedback: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// Utility function to transform backend problem to frontend problem
export function transformBackendProblem(backendProblem: BackendProblem): Problem {
  return {
    id: backendProblem.id,
    title: backendProblem.title,
    description: backendProblem.description,
    category: backendProblem.category,
    difficulty: backendProblem.difficulty as Difficulty,
    timeLimit: getDefaultTimeLimit(backendProblem.difficulty),
    tags: backendProblem.tags || [],
    companyContext: backendProblem.company || undefined,
    createdAt: backendProblem.created_at,
    solvedCount: 0, // Default value - could be enhanced later
    averageScore: undefined,
    successRate: undefined,
    questions: getDefaultQuestions(backendProblem.category),
    frameworkSuggestions: backendProblem.tags || [],
    domain: backendProblem.domain,
    company: backendProblem.company
  };
}

function getDefaultTimeLimit(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 30;
    case 'medium': return 60;
    case 'hard': return 90;
    default: return 60;
  }
}

function getDefaultQuestions(category: string): string[] {
  const questionMap: Record<string, string[]> = {
    'Strategy': [
      'What is the key strategic challenge?',
      'Who are the main stakeholders?',
      'What are the critical success factors?'
    ],
    'Marketing': [
      'What is the target market?',
      'What is the value proposition?',
      'How should we position this in the market?'
    ],
    'Operations': [
      'What are the main operational challenges?',
      'How can we optimize the process?',
      'What resources are required?'
    ],
    'Finance': [
      'What are the key financial metrics?',
      'What is the ROI/NPV?',
      'What are the main financial risks?'
    ]
  };
  
  return questionMap[category] || [
    'What is the core problem?',
    'What are the key considerations?',
    'What would you recommend?'
  ];
}
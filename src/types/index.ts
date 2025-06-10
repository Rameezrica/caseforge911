export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'Finance & Investment'
  | 'Operations & Supply Chain'
  | 'Management'
  | 'Strategy & Consulting'
  | 'Marketing & Growth';

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

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  timeLimit: number;
  tags?: string[];
  companyContext?: string;
  createdAt: string;
  solvedCount?: number;
  averageScore?: number;
  successRate?: number;
  questions: string[];
  frameworkSuggestions?: string[];
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
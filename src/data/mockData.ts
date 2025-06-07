import { Problem, User, Solution, Achievement, Category, Difficulty, DailyChallenge } from '../types';

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Case Novice',
    description: 'Solved your first business case',
    icon: 'award',
  },
  {
    id: '2',
    name: 'Strategy Expert',
    description: 'Solved 10 strategy & consulting cases',
    icon: 'briefcase',
  },
  {
    id: '3',
    name: 'Finance Guru',
    description: 'Solved 5 finance & investment cases with high ratings',
    icon: 'trending-up',
  },
  {
    id: '4',
    name: 'All-Rounder',
    description: 'Solved at least one problem from each category',
    icon: 'circle',
  },
  {
    id: '5',
    name: 'Community Helper',
    description: 'Posted 10 comments that received upvotes',
    icon: 'users',
  }
];

const problems: Problem[] = [
  {
    id: '1',
    title: 'Market Entry Strategy for Electric Vehicles',
    description: 'Develop a comprehensive market entry strategy for a new electric vehicle manufacturer targeting the European market.',
    category: 'Strategy & Consulting',
    difficulty: 'Hard',
    timeLimit: 90,
    tags: ['Market Analysis', 'Competitive Strategy', 'Growth Strategy'],
    companyContext: 'A leading automotive manufacturer planning to enter the EV market',
    createdAt: '2024-03-15T10:00:00Z',
    solvedCount: 245,
    averageScore: 78,
    successRate: 65,
    questions: [
      'What are the key market dynamics and trends in the European EV market?',
      'Who are the main competitors and what are their strengths and weaknesses?',
      'What is the optimal market entry strategy (timing, location, product mix)?',
      'How should the company position itself in the market?',
      'What are the key risks and how should they be mitigated?'
    ],
    frameworkSuggestions: [
      'Porter\'s Five Forces',
      'PESTEL Analysis',
      'Market Entry Strategy Framework',
      'Competitive Positioning Matrix'
    ]
  },
  {
    id: '2',
    title: 'Supply Chain Optimization for E-commerce',
    description: 'Analyze and optimize the supply chain operations of a fast-growing e-commerce company to improve efficiency and reduce costs.',
    category: 'Operations & Supply Chain',
    difficulty: 'Medium',
    timeLimit: 60,
    tags: ['Supply Chain', 'Process Improvement', 'Cost Optimization'],
    companyContext: 'A mid-sized e-commerce retailer experiencing rapid growth',
    createdAt: '2024-03-14T15:30:00Z',
    solvedCount: 189,
    averageScore: 82,
    successRate: 70,
    questions: [
      'What are the current bottlenecks in the supply chain?',
      'How can inventory management be improved?',
      'What opportunities exist for cost reduction?',
      'How can the company scale its operations efficiently?',
      'What technology solutions should be implemented?'
    ],
    frameworkSuggestions: [
      'Supply Chain Operations Reference (SCOR)',
      'Lean Six Sigma',
      'Total Cost of Ownership',
      'Inventory Optimization Models'
    ]
  },
  {
    id: '3',
    title: 'Financial Analysis of Tech Startup',
    description: 'Conduct a detailed financial analysis of a tech startup seeking Series A funding, including valuation and growth projections.',
    category: 'Finance & Investment',
    difficulty: 'Medium',
    timeLimit: 75,
    tags: ['Financial Modeling', 'Valuation', 'Startup Finance'],
    companyContext: 'A B2B SaaS startup with $2M ARR',
    createdAt: '2024-03-13T09:15:00Z',
    solvedCount: 156,
    averageScore: 75,
    successRate: 60,
    questions: [
      'What is the appropriate valuation methodology for this startup?',
      'How should growth projections be modeled?',
      'What are the key financial metrics to focus on?',
      'How should the funding round be structured?',
      'What are the key risks and how should they be addressed?'
    ],
    frameworkSuggestions: [
      'DCF Analysis',
      'Comparable Company Analysis',
      'Venture Capital Method',
      'Risk-Adjusted Return Models'
    ]
  },
  {
    id: '4',
    title: 'Digital Marketing Campaign Optimization',
    description: 'Analyze and optimize the digital marketing campaigns of a consumer goods company to improve ROI and customer acquisition.',
    category: 'Marketing & Growth',
    difficulty: 'Easy',
    timeLimit: 45,
    tags: ['Digital Marketing', 'Campaign Analysis', 'ROI Optimization'],
    companyContext: 'A consumer goods company with $50M annual revenue',
    createdAt: '2024-03-12T14:45:00Z',
    solvedCount: 312,
    averageScore: 85,
    successRate: 75,
    questions: [
      'Which marketing channels are performing best?',
      'How can customer acquisition costs be reduced?',
      'What is the optimal marketing mix?',
      'How can campaign ROI be improved?',
      'What new channels should be explored?'
    ],
    frameworkSuggestions: [
      'Marketing Mix Modeling',
      'Customer Acquisition Cost Analysis',
      'Channel Attribution Models',
      'ROI Optimization Framework'
    ]
  },
  {
    id: '5',
    title: 'Organizational Restructuring Plan',
    description: 'Develop a comprehensive plan for restructuring a traditional manufacturing company to improve efficiency and adapt to digital transformation.',
    category: 'Management',
    difficulty: 'Hard',
    timeLimit: 90,
    tags: ['Organizational Design', 'Change Management', 'Digital Transformation'],
    companyContext: 'A 50-year-old manufacturing company with 1000+ employees',
    createdAt: '2024-03-11T11:20:00Z',
    solvedCount: 98,
    averageScore: 72,
    successRate: 55,
    questions: [
      'What is the optimal organizational structure?',
      'How should the company transition to digital operations?',
      'What changes are needed in the company culture?',
      'How should the workforce be reskilled?',
      'What is the implementation timeline and resource requirements?'
    ],
    frameworkSuggestions: [
      'McKinsey 7S Framework',
      'Kotter\'s 8-Step Change Model',
      'Organizational Design Principles',
      'Digital Transformation Roadmap'
    ]
  }
];

export const dailyChallenge: DailyChallenge = {
  id: 'dc-1',
  date: new Date().toISOString(),
  problemId: '2',
  participants: 234,
  averageTime: 45,
  completionRate: 68,
  problem: {
    id: '2',
    title: 'Startup Series A Valuation',
    difficulty: 'Hard' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'TechFlow (AI Startup)',
    description: 'An AI startup with $2M ARR and 150% growth rate seeks Series A funding. Determine fair valuation using multiple methods and assess investment risks for VCs.',
    questions: [
      'What valuation methods are most appropriate for this startup?',
      'How should the growth rate and market potential be factored in?',
      'What are the key investment risks and how can they be mitigated?',
      'What terms should be included in the investment agreement?'
    ],
    frameworkSuggestions: ['Venture Capital Valuation', 'Risk Assessment Matrix', 'Growth Metrics Analysis'],
    timeLimit: 60,
    tags: ['Startup', 'Valuation', 'Venture Capital', 'AI Technology'],
    successRate: 34,
    createdAt: new Date().toISOString(),
    solvedCount: 234,
    averageScore: 72
  }
};

export const leaderboard = [
  { userId: '3', userName: 'Morgan Lee', problemsSolved: 42, rank: 1 },
  { userId: '1', userName: 'Alex Johnson', problemsSolved: 27, rank: 2 },
  { userId: '2', userName: 'Sarah Chen', problemsSolved: 15, rank: 3 },
  { userId: '4', userName: 'Jamie Wilson', problemsSolved: 14, rank: 4 },
  { userId: '5', userName: 'Casey Brown', problemsSolved: 12, rank: 5 },
  { userId: '6', userName: 'Jordan Miller', problemsSolved: 10, rank: 6 },
  { userId: '7', userName: 'Riley Davis', problemsSolved: 9, rank: 7 },
  { userId: '8', userName: 'Avery Martinez', problemsSolved: 8, rank: 8 },
  { userId: '9', userName: 'Quinn Thompson', problemsSolved: 7, rank: 9 },
  { userId: '10', userName: 'Parker Robinson', problemsSolved: 6, rank: 10 }
];

export { problems };
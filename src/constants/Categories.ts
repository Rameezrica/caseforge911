export const CATEGORIES = {
  'Strategy & Consulting': [
    'Market Analysis',
    'Growth Strategy', 
    'Digital Transformation',
    'Competitive Strategy',
    'Business Model Design'
  ],
  'Finance & Investment': [
    'Financial Modeling',
    'Investment Analysis',
    'Corporate Finance', 
    'Personal Finance',
    'Quantitative Finance'
  ],
  'Operations & Supply Chain': [
    'Supply Chain Optimization',
    'Process Improvement',
    'Quality Management',
    'Project Management', 
    'Production Planning'
  ],
  'Marketing & Growth': [
    'Customer Segmentation',
    'Pricing Strategy',
    'Campaign Optimization',
    'Brand Strategy',
    'Digital Marketing'
  ],
  'Data Analytics': [
    'Business Intelligence',
    'Data Analysis',
    'Performance Metrics',
    'Reporting',
    'Analytics'
  ]
} as const;

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export const TIME_RANGES = [30, 45, 60, 90, 120] as const;

export type Category = keyof typeof CATEGORIES;
export type Difficulty = typeof DIFFICULTIES[number];
export type TimeRange = typeof TIME_RANGES[number];
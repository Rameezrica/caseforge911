import { Problem, User, Solution, Comment, Achievement, Category, Difficulty, DailyChallenge } from '../types';

// Mock Achievements
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

// Mock Problems
export const problems: Problem[] = [
  // Finance & Investment Cases (1-12)
  {
    id: '1',
    title: 'Apple Stock Buyback Analysis',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Apple Inc.',
    description: 'Apple has $200B in cash reserves. Analyze whether they should continue aggressive stock buybacks, increase dividends, or invest in new ventures. Consider impact on EPS, market perception, and growth opportunities.',
    questions: [
      'What are the pros and cons of each capital allocation option?',
      'How would different strategies impact shareholder value?',
      'What is the optimal mix of buybacks, dividends, and investments?',
      'How should Apple communicate its decision to the market?'
    ],
    frameworkSuggestions: ['Capital Allocation Framework', 'Shareholder Value Analysis', 'Market Sentiment Analysis'],
    timeLimit: 45,
    tags: ['Capital Allocation', 'Corporate Finance', 'Technology', 'Shareholder Value'],
    successRate: 58
  },
  {
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
    successRate: 34
  },
  {
    id: '3',
    title: 'Bank Credit Risk Assessment',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'JPMorgan Chase',
    description: 'Develop a credit scoring model for small business loans during economic uncertainty. Balance risk management with growth targets and regulatory requirements.',
    questions: [
      'What key factors should be included in the credit scoring model?',
      'How can we balance risk and growth objectives?',
      'What regulatory requirements must be considered?',
      'How should the model be validated and monitored?'
    ],
    frameworkSuggestions: ['Risk Assessment Framework', 'Regulatory Compliance', 'Credit Analysis'],
    timeLimit: 50,
    tags: ['Risk Management', 'Banking', 'Credit Analysis', 'Regulation'],
    successRate: 52
  },
  {
    id: '4',
    title: 'Private Equity Buyout Analysis',
    difficulty: 'Hard' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'KKR & Co.',
    description: 'Evaluate a $5B leveraged buyout of a manufacturing company. Analyze deal structure, financing options, operational improvements, and exit strategies.',
    questions: [
      'What is the optimal deal structure?',
      'How should the acquisition be financed?',
      'What operational improvements can create value?',
      'What exit strategies should be considered?'
    ],
    frameworkSuggestions: ['LBO Analysis', 'Value Creation', 'Exit Strategy'],
    timeLimit: 75,
    tags: ['Private Equity', 'LBO', 'Manufacturing', 'M&A'],
    successRate: 28
  },
  {
    id: '5',
    title: 'Cryptocurrency Exchange Valuation',
    difficulty: 'Hard' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Coinbase',
    description: 'Value Coinbase during crypto market volatility. Consider regulatory risks, competition, and evolving business model from trading fees to diversified services.',
    questions: [
      'How should crypto exchanges be valued?',
      'What are the key regulatory risks?',
      'How can the business model evolve?',
      'What competitive advantages exist?'
    ],
    frameworkSuggestions: ['Fintech Valuation', 'Regulatory Analysis', 'Business Model Canvas'],
    timeLimit: 55,
    tags: ['Cryptocurrency', 'Fintech', 'Valuation', 'Regulation'],
    successRate: 31
  },
  {
    id: '6',
    title: 'Real Estate Investment Trust (REIT) Analysis',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Simon Property Group',
    description: 'Analyze a retail REIT\'s performance post-COVID. Evaluate portfolio optimization, tenant mix changes, and dividend sustainability amid e-commerce growth.',
    questions: [
      'How should the property portfolio be optimized?',
      'What is the optimal tenant mix?',
      'Is the current dividend sustainable?',
      'How can the REIT adapt to e-commerce growth?'
    ],
    frameworkSuggestions: ['Real Estate Analysis', 'Portfolio Optimization', 'Dividend Policy'],
    timeLimit: 40,
    tags: ['Real Estate', 'REIT', 'Portfolio Management', 'Retail'],
    successRate: 61
  },
  {
    id: '7',
    title: 'Insurance Company Capital Allocation',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Berkshire Hathaway',
    description: 'Optimize capital allocation across insurance operations, stock investments, and wholly-owned subsidiaries. Balance regulatory capital requirements with growth opportunities.',
    questions: [
      'How should capital be allocated across business lines?',
      'What regulatory requirements must be met?',
      'How can investment returns be optimized?',
      'What growth opportunities should be pursued?'
    ],
    frameworkSuggestions: ['Capital Allocation', 'Insurance Operations', 'Investment Strategy'],
    timeLimit: 45,
    tags: ['Insurance', 'Capital Management', 'Investments', 'Regulation'],
    successRate: 55
  },
  {
    id: '8',
    title: 'Merger Arbitrage Strategy',
    difficulty: 'Hard' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Hedge Fund Analysis',
    description: 'Analyze a proposed $50B merger between two tech companies. Assess arbitrage opportunity, deal completion probability, and risk-adjusted returns.',
    questions: [
      'What is the probability of deal completion?',
      'What are the key risks to consider?',
      'How should the position be sized?',
      'What hedging strategies should be employed?'
    ],
    frameworkSuggestions: ['Merger Analysis', 'Risk Assessment', 'Portfolio Management'],
    timeLimit: 50,
    tags: ['M&A', 'Arbitrage', 'Risk Management', 'Hedge Funds'],
    successRate: 37
  },
  {
    id: '9',
    title: 'Municipal Bond Investment Decision',
    difficulty: 'Easy' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'BlackRock',
    description: 'Evaluate municipal bond investments for a tax-exempt fund. Consider credit quality, tax implications, and interest rate sensitivity across different municipalities.',
    questions: [
      'How should municipal bonds be evaluated?',
      'What are the key credit risks?',
      'How should interest rate risk be managed?',
      'What tax considerations are important?'
    ],
    frameworkSuggestions: ['Fixed Income Analysis', 'Credit Analysis', 'Tax Strategy'],
    timeLimit: 30,
    tags: ['Fixed Income', 'Municipal Bonds', 'Tax Strategy', 'Portfolio Management'],
    successRate: 73
  },
  {
    id: '10',
    title: 'Pension Fund Asset Allocation',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'CalPERS',
    description: 'Redesign asset allocation for a $400B pension fund facing demographic changes. Balance return targets with risk management and ESG requirements.',
    questions: [
      'What is the optimal asset allocation?',
      'How should ESG factors be incorporated?',
      'What are the key risks to manage?',
      'How should performance be measured?'
    ],
    frameworkSuggestions: ['Asset Allocation', 'ESG Integration', 'Risk Management'],
    timeLimit: 55,
    tags: ['Asset Management', 'Pension Funds', 'ESG', 'Portfolio Strategy'],
    successRate: 48
  },
  {
    id: '11',
    title: 'Distressed Debt Investment',
    difficulty: 'Hard' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Oaktree Capital',
    description: 'Evaluate investment in distressed retail chain\'s debt. Analyze restructuring scenarios, recovery rates, and potential equity upside through debt-to-equity conversion.',
    questions: [
      'What is the expected recovery rate?',
      'What restructuring scenarios are possible?',
      'How should the investment be structured?',
      'What are the key risks and mitigants?'
    ],
    frameworkSuggestions: ['Distressed Analysis', 'Restructuring', 'Recovery Analysis'],
    timeLimit: 65,
    tags: ['Distressed Debt', 'Restructuring', 'Retail', 'Credit'],
    successRate: 29
  },
  {
    id: '12',
    title: 'Foreign Exchange Hedging Strategy',
    difficulty: 'Medium' as Difficulty,
    category: 'Finance & Investment' as Category,
    companyContext: 'Coca-Cola',
    description: 'Design FX hedging strategy for a multinational with 60% international revenue. Balance cost of hedging with earnings volatility across multiple currencies.',
    questions: [
      'What currencies should be hedged?',
      'What hedging instruments should be used?',
      'How much exposure should be hedged?',
      'How should hedge effectiveness be measured?'
    ],
    frameworkSuggestions: ['FX Risk Management', 'Hedging Strategy', 'Cost-Benefit Analysis'],
    timeLimit: 40,
    tags: ['Foreign Exchange', 'Risk Management', 'International', 'Treasury'],
    successRate: 56
  },

  // Operations & Supply Chain Cases (13-24)
  {
    id: '13',
    title: 'Amazon Warehouse Automation',
    difficulty: 'Hard' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Amazon',
    description: 'Evaluate ROI of implementing advanced robotics in fulfillment centers. Consider automation costs, labor savings, productivity gains, and implementation timeline.',
    questions: [
      'What is the expected ROI of automation?',
      'How should implementation be phased?',
      'What are the key risks to consider?',
      'How will this affect the workforce?'
    ],
    frameworkSuggestions: ['ROI Analysis', 'Change Management', 'Process Optimization'],
    timeLimit: 60,
    tags: ['Automation', 'Warehousing', 'Technology', 'Change Management'],
    successRate: 41
  },
  {
    id: '14',
    title: 'Semiconductor Supply Chain Resilience',
    difficulty: 'Hard' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'TSMC',
    description: 'Design supply chain strategy to reduce geopolitical risks while maintaining cost efficiency. Consider fab location, supplier diversification, and inventory strategies.',
    questions: [
      'How can supply chain risks be mitigated?',
      'What locations should be considered for new fabs?',
      'How should supplier relationships be managed?',
      'What inventory strategies are appropriate?'
    ],
    frameworkSuggestions: ['Supply Chain Risk', 'Location Analysis', 'Inventory Management'],
    timeLimit: 70,
    tags: ['Semiconductors', 'Supply Chain', 'Risk Management', 'Manufacturing'],
    successRate: 33
  },
  {
    id: '15',
    title: 'Fast Fashion Inventory Optimization',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Zara',
    description: 'Optimize inventory levels across 2,000+ stores with fast-changing fashion trends. Balance stockouts vs. markdowns while maintaining quick response to trends.',
    questions: [
      'How should inventory be allocated?',
      'What replenishment strategy is optimal?',
      'How can markdowns be minimized?',
      'How should trend forecasting be improved?'
    ],
    frameworkSuggestions: ['Inventory Optimization', 'Demand Forecasting', 'Retail Operations'],
    timeLimit: 45,
    tags: ['Fashion', 'Retail', 'Inventory Management', 'Forecasting'],
    successRate: 62
  },
  {
    id: '16',
    title: 'Electric Vehicle Battery Supply Chain',
    difficulty: 'Hard' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Tesla',
    description: 'Secure lithium-ion battery supply for 2M vehicles annually. Evaluate vertical integration vs. partnerships, raw material sourcing, and recycling programs.',
    questions: [
      'Should battery production be vertically integrated?',
      'How should raw materials be secured?',
      'What role should recycling play?',
      'How can supply chain risks be mitigated?'
    ],
    frameworkSuggestions: ['Make vs Buy Analysis', 'Supply Chain Strategy', 'Sustainability'],
    timeLimit: 65,
    tags: ['Electric Vehicles', 'Batteries', 'Sustainability', 'Manufacturing'],
    successRate: 38
  },
  {
    id: '17',
    title: 'Pharmaceutical Cold Chain Management',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Pfizer',
    description: 'Design global distribution network for temperature-sensitive vaccines. Ensure cold chain integrity while optimizing costs and delivery speed.',
    questions: [
      'How should the distribution network be designed?',
      'What temperature monitoring is needed?',
      'How can costs be optimized?',
      'What contingency plans are required?'
    ],
    frameworkSuggestions: ['Network Design', 'Quality Management', 'Risk Mitigation'],
    timeLimit: 50,
    tags: ['Pharmaceuticals', 'Cold Chain', 'Distribution', 'Healthcare'],
    successRate: 54
  },
  {
    id: '18',
    title: 'Restaurant Chain Kitchen Optimization',
    difficulty: 'Easy' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'McDonald\'s',
    description: 'Redesign kitchen operations to reduce order fulfillment time by 30%. Consider equipment layout, staff workflow, and technology integration.',
    questions: [
      'How can workflow be optimized?',
      'What technology solutions are needed?',
      'How should staff be trained?',
      'What are the implementation challenges?'
    ],
    frameworkSuggestions: ['Process Optimization', 'Workflow Analysis', 'Change Management'],
    timeLimit: 35,
    tags: ['Restaurants', 'Operations', 'Process Improvement', 'Technology'],
    successRate: 78
  },
  {
    id: '19',
    title: 'Airline Route Optimization',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Delta Air Lines',
    description: 'Optimize route network post-COVID considering changed travel patterns, fuel costs, and aircraft utilization. Balance hub efficiency with point-to-point demand.',
    questions: [
      'How should routes be optimized?',
      'What is the optimal fleet allocation?',
      'How can hub efficiency be improved?',
      'What demand patterns should be considered?'
    ],
    frameworkSuggestions: ['Network Optimization', 'Demand Analysis', 'Resource Allocation'],
    timeLimit: 55,
    tags: ['Airlines', 'Route Planning', 'Network Optimization', 'Transportation'],
    successRate: 47
  },
  {
    id: '20',
    title: 'Renewable Energy Grid Integration',
    difficulty: 'Hard' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'NextEra Energy',
    description: 'Integrate 50% renewable energy into the grid while maintaining reliability. Address intermittency challenges through storage, demand response, and grid modernization.',
    questions: [
      'How can grid stability be maintained?',
      'What storage solutions are needed?',
      'How should demand response be implemented?',
      'What grid modernization is required?'
    ],
    frameworkSuggestions: ['Energy Systems', 'Grid Management', 'Technology Integration'],
    timeLimit: 60,
    tags: ['Renewable Energy', 'Grid Management', 'Technology', 'Sustainability'],
    successRate: 35
  },
  {
    id: '21',
    title: 'E-commerce Last-Mile Delivery',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'UPS',
    description: 'Optimize last-mile delivery costs in urban areas. Evaluate drones, electric vehicles, pickup points, and route optimization to reduce per-package costs.',
    questions: [
      'What delivery methods should be used?',
      'How can routes be optimized?',
      'What technology investments are needed?',
      'How can costs be reduced?'
    ],
    frameworkSuggestions: ['Last-Mile Logistics', 'Route Optimization', 'Cost Analysis'],
    timeLimit: 45,
    tags: ['Logistics', 'E-commerce', 'Transportation', 'Technology'],
    successRate: 59
  },
  {
    id: '22',
    title: 'Manufacturing Lean Implementation',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Toyota',
    description: 'Implement lean manufacturing principles in a new plant. Design production system to minimize waste, reduce inventory, and improve quality.',
    questions: [
      'How should lean principles be implemented?',
      'What KPIs should be tracked?',
      'How should staff be trained?',
      'What are the expected benefits?'
    ],
    frameworkSuggestions: ['Lean Manufacturing', 'Process Design', 'Change Management'],
    timeLimit: 40,
    tags: ['Manufacturing', 'Lean', 'Quality Management', 'Process Improvement'],
    successRate: 65
  },
  {
    id: '23',
    title: 'Hospital Supply Chain Optimization',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Mayo Clinic',
    description: 'Optimize medical supply inventory across hospital network. Balance cost reduction with patient safety, considering critical vs. non-critical supplies.',
    questions: [
      'How should inventory be managed?',
      'What safety stock levels are needed?',
      'How can costs be reduced?',
      'What are the key risks?'
    ],
    frameworkSuggestions: ['Inventory Management', 'Risk Assessment', 'Cost Optimization'],
    timeLimit: 50,
    tags: ['Healthcare', 'Supply Chain', 'Inventory Management', 'Risk Management'],
    successRate: 52
  },
  {
    id: '24',
    title: 'Retail Omnichannel Fulfillment',
    difficulty: 'Medium' as Difficulty,
    category: 'Operations & Supply Chain' as Category,
    companyContext: 'Target',
    description: 'Design fulfillment strategy integrating online orders with physical stores. Optimize inventory allocation between channels and implement ship-from-store capabilities.',
    questions: [
      'How should inventory be allocated?',
      'What fulfillment options are optimal?',
      'How can stores be leveraged?',
      'What technology is needed?'
    ],
    frameworkSuggestions: ['Omnichannel Strategy', 'Inventory Allocation', 'Process Design'],
    timeLimit: 45,
    tags: ['Retail', 'E-commerce', 'Omnichannel', 'Fulfillment'],
    successRate: 58
  },

  // Strategy & Consulting Cases (25-31)
  {
    id: '25',
    title: 'Disney+ vs Netflix Competition',
    difficulty: 'Hard' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'The Walt Disney Company',
    description: 'Develop strategy for Disney+ to compete with Netflix globally. Consider content strategy, pricing, international expansion, and bundling with other Disney services.',
    questions: [
      'What should be the content strategy?',
      'How should pricing be structured?',
      'What markets should be prioritized?',
      'How can Disney leverage its ecosystem?'
    ],
    frameworkSuggestions: ['Competitive Strategy', 'Market Entry', 'Platform Strategy'],
    timeLimit: 65,
    tags: ['Streaming', 'Entertainment', 'Digital Strategy', 'Competition'],
    successRate: 42
  },
  {
    id: '26',
    title: 'Uber Profitability Strategy',
    difficulty: 'Hard' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Uber',
    description: 'Design path to sustainable profitability for Uber\'s ride-sharing business. Address driver economics, pricing strategy, and competition from autonomous vehicles.',
    questions: [
      'How can unit economics be improved?',
      'What pricing strategy is optimal?',
      'How should autonomous vehicles be addressed?',
      'What new revenue streams are possible?'
    ],
    frameworkSuggestions: ['Unit Economics', 'Pricing Strategy', 'Business Model Innovation'],
    timeLimit: 70,
    tags: ['Ride-sharing', 'Profitability', 'Technology', 'Business Model'],
    successRate: 36
  },
  {
    id: '27',
    title: 'Starbucks China Expansion',
    difficulty: 'Medium' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Starbucks',
    description: 'Accelerate growth in China while competing with local coffee chains and tea culture. Adapt menu, store formats, and digital strategy for Chinese consumers.',
    questions: [
      'How should the expansion be structured?',
      'What adaptations are needed?',
      'How can digital be leveraged?',
      'What are the key risks?'
    ],
    frameworkSuggestions: ['Market Entry', 'Localization Strategy', 'Digital Integration'],
    timeLimit: 50,
    tags: ['International Expansion', 'Retail', 'Food & Beverage', 'Digital'],
    successRate: 61
  },
  {
    id: '28',
    title: 'Meta Metaverse Strategy',
    difficulty: 'Hard' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Meta (Facebook)',
    description: 'Justify $10B+ annual investment in metaverse development. Create roadmap for monetization, user adoption, and competitive positioning against Apple and Microsoft.',
    questions: [
      'How can the investment be justified?',
      'What are the key success metrics?',
      'How should monetization work?',
      'What are the competitive risks?'
    ],
    frameworkSuggestions: ['Technology Strategy', 'Platform Economics', 'Competitive Analysis'],
    timeLimit: 60,
    tags: ['Metaverse', 'Technology', 'Digital Strategy', 'Innovation'],
    successRate: 29
  },
  {
    id: '29',
    title: 'Walmart vs Amazon Competition',
    difficulty: 'Medium' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Walmart',
    description: 'Strengthen Walmart\'s competitive position against Amazon. Leverage physical store network, supply chain, and grocery expertise for omnichannel advantage.',
    questions: [
      'What are Walmart\'s key advantages?',
      'How can stores be leveraged?',
      'What digital capabilities are needed?',
      'How should grocery be positioned?'
    ],
    frameworkSuggestions: ['Competitive Strategy', 'Omnichannel Retail', 'Digital Transformation'],
    timeLimit: 55,
    tags: ['Retail', 'E-commerce', 'Competition', 'Omnichannel'],
    successRate: 54
  },
  {
    id: '30',
    title: 'Pharmaceutical Patent Cliff Strategy',
    difficulty: 'Hard' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Pfizer',
    description: 'Address revenue decline from expiring patents on blockbuster drugs. Develop strategy combining R&D investment, acquisitions, and new therapeutic areas.',
    questions: [
      'How should revenue be replaced?',
      'What R&D investments are needed?',
      'What acquisitions make sense?',
      'How can pipeline risk be managed?'
    ],
    frameworkSuggestions: ['Portfolio Strategy', 'R&D Management', 'M&A Strategy'],
    timeLimit: 65,
    tags: ['Pharmaceuticals', 'R&D', 'M&A', 'Innovation'],
    successRate: 38
  },
  {
    id: '31',
    title: 'Tesla Energy Business Strategy',
    difficulty: 'Medium' as Difficulty,
    category: 'Strategy & Consulting' as Category,
    companyContext: 'Tesla',
    description: 'Scale Tesla\'s energy business (solar, batteries, grid services). Develop strategy for growth, profitability, and integration with EV ecosystem.',
    questions: [
      'How can the energy business scale?',
      'What synergies exist with EVs?',
      'How should products be positioned?',
      'What are the key success factors?'
    ],
    frameworkSuggestions: ['Growth Strategy', 'Business Model Innovation', 'Ecosystem Strategy'],
    timeLimit: 45,
    tags: ['Energy', 'Technology', 'Sustainability', 'Innovation'],
    successRate: 51
  }
];

// Mock Solutions
export const solutions: Solution[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Johnson',
    problemId: '1',
    content: 'This is the full solution content with detailed analysis and recommendations...',
    executiveSummary: 'Apple should maintain a balanced approach to capital allocation, with continued stock buybacks but at a reduced rate.',
    problemAnalysis: 'Analysis of current market conditions, competitive landscape, and investment opportunities shows potential for strategic investments.',
    recommendations: 'Implement a three-part strategy: (1) Reduce buybacks by 30%, (2) Increase R&D investment in AI/AR, (3) Maintain current dividend policy.',
    implementationPlan: 'Phase the changes over 18 months to allow market adjustment and proper communication of the strategy.',
    riskAssessment: 'Key risks include market reaction to reduced buybacks and execution risk on new investments. Mitigate through clear communication and staged implementation.',
    submittedAt: '2024-03-10T14:30:00Z',
    votes: 12,
    aiScore: 85,
    aiFeedback: 'Strong analysis with good balance between financial and strategic considerations. Consider adding more quantitative analysis on investment returns.'
  }
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Taylor Smith',
    solutionId: '1',
    content: 'Excellent analysis of the capital allocation trade-offs. The phased implementation approach makes a lot of sense.',
    createdAt: '2024-03-10T16:45:00Z',
    votes: 5
  }
];

// Mock stats for homepage
export const siteStats = {
  totalUsers: 12547,
  totalProblemsSolved: 287690,
  totalProblems: problems.length,
  activeCommunityMembers: 8760
};

// Current logged in user (mock)
export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@university.edu',
  university: 'Harvard Business School',
  graduationYear: 2024,
  areasOfFocus: ['Consulting', 'Finance'],
  problemsSolved: 27,
  achievements: [achievements[0], achievements[1]],
  joinedDate: '2023-09-15',
  dailyStreak: 7,
  lastDailyChallenge: new Date().toISOString()
};

// Helper functions
export const getProblemsByCategory = (category: Category): Problem[] => {
  return problems.filter(problem => problem.category === category);
};

export const getProblemsByDifficulty = (difficulty: Difficulty): Problem[] => {
  return problems.filter(problem => problem.difficulty === difficulty);
};

export const getProblemById = (id: string): Problem | undefined => {
  return problems.find(problem => problem.id === id);
};

export const getSolutionsForProblem = (problemId: string): Solution[] => {
  return solutions.filter(solution => solution.problemId === problemId);
};

export const getCommentsForSolution = (solutionId: string): Comment[] => {
  return comments.filter(comment => comment.solutionId === solutionId);
};

// Leaderboard data
export const leaderboard = [
  { userId: '3', userName: 'Morgan Lee', problemsSolved: 42, rank: 1 },
  { userId: '1', userName: 'Alex Johnson', problemsSolved: 27, rank: 2 },
  { userId: '2', userName: 'Taylor Smith', problemsSolved: 15, rank: 3 },
  { userId: '4', userName: 'Jamie Wilson', problemsSolved: 14, rank: 4 },
  { userId: '5', userName: 'Casey Brown', problemsSolved: 12, rank: 5 },
  { userId: '6', userName: 'Jordan Miller', problemsSolved: 10, rank: 6 },
  { userId: '7', userName: 'Riley Davis', problemsSolved: 9, rank: 7 },
  { userId: '8', userName: 'Avery Martinez', problemsSolved: 8, rank: 8 },
  { userId: '9', userName: 'Quinn Thompson', problemsSolved: 7,rank: 9 },
  { userId: '10', userName: 'Parker Robinson', problemsSolved: 6, rank: 10 }
];

// Add daily challenge mock data
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
    successRate: 34
  }
};
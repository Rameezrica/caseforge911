import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Grid3X3,
  MapPin,
  BarChart3
} from 'lucide-react';
import FrameworkBuilder from './strategy/FrameworkBuilder';
import ScenarioPlanning from './strategy/ScenarioPlanning';
import CompetitiveAnalysis from './strategy/CompetitiveAnalysis';
import BusinessModelCanvas from './strategy/BusinessModelCanvas';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface StrategyWorkspaceProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const StrategyWorkspace: React.FC<StrategyWorkspaceProps> = ({ problem, onSolutionChange }) => {
  const [activeModule, setActiveModule] = useState('frameworks');

  const modules = [
    {
      id: 'frameworks',
      name: 'Strategic Frameworks',
      icon: <Grid3X3 className="h-4 w-4" />,
      description: 'SWOT, Porter\'s 5 Forces, PESTEL, Value Chain'
    },
    {
      id: 'scenarios',
      name: 'Scenario Planning',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'What-if analysis and future scenarios'
    },
    {
      id: 'competitive',
      name: 'Competitive Analysis',
      icon: <Target className="h-4 w-4" />,
      description: 'Competitor mapping and positioning'
    },
    {
      id: 'business-model',
      name: 'Business Model Canvas',
      icon: <MapPin className="h-4 w-4" />,
      description: 'Visual business model design'
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'frameworks':
        return <FrameworkBuilder problem={problem} onSolutionChange={onSolutionChange} />;
      case 'scenarios':
        return <ScenarioPlanning problem={problem} onSolutionChange={onSolutionChange} />;
      case 'competitive':
        return <CompetitiveAnalysis problem={problem} onSolutionChange={onSolutionChange} />;
      case 'business-model':
        return <BusinessModelCanvas problem={problem} onSolutionChange={onSolutionChange} />;
      default:
        return <FrameworkBuilder problem={problem} onSolutionChange={onSolutionChange} />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Module Sidebar */}
      <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-50 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Strategy Toolkit
          </h2>
          <p className="text-sm text-dark-400 mt-1">Advanced strategic analysis tools</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                activeModule === module.id
                  ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                  : 'bg-dark-700 border border-transparent text-dark-300 hover:bg-dark-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {module.icon}
                <span className="font-medium">{module.name}</span>
              </div>
              <p className="text-xs opacity-75">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-dark-700">
          <h3 className="text-sm font-medium text-dark-300 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Generate Strategy Report
            </button>
            <button className="w-full bg-dark-700 hover:bg-dark-600 text-dark-300 text-sm py-2 px-3 rounded-lg transition-colors">
              Export Framework
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-dark-800 border-b border-dark-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dark-50">
                {modules.find(m => m.id === activeModule)?.name}
              </h3>
              <p className="text-sm text-dark-400">
                {modules.find(m => m.id === activeModule)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-400">Problem:</span>
              <span className="text-sm text-dark-200">{problem.category}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  );
};

export default StrategyWorkspace;
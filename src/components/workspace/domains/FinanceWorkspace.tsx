import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Table,
  DollarSign,
  Target,
  ArrowUpDown
} from 'lucide-react';
import FinancialSpreadsheet from './finance/FinancialSpreadsheet';
import ValuationModels from './finance/ValuationModels';
import FinancialCharts from './finance/FinancialCharts';
import RatioCalculator from './finance/RatioCalculator';
import SensitivityAnalysis from './finance/SensitivityAnalysis';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface FinanceWorkspaceProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const FinanceWorkspace: React.FC<FinanceWorkspaceProps> = ({ problem, onSolutionChange }) => {
  const [activeModule, setActiveModule] = useState('spreadsheet');
  const [financialData, setFinancialData] = useState<any>({});

  const modules = [
    {
      id: 'spreadsheet',
      name: 'Financial Spreadsheet',
      icon: <Table className="h-4 w-4" />,
      description: 'Excel-like interface for financial modeling'
    },
    {
      id: 'valuation',
      name: 'Valuation Models',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'DCF, NPV, IRR, and multiples analysis'
    },
    {
      id: 'charts',
      name: 'Financial Charts',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Interactive financial visualizations'
    },
    {
      id: 'ratios',
      name: 'Ratio Calculator',
      icon: <Calculator className="h-4 w-4" />,
      description: 'Financial ratio analysis tools'
    },
    {
      id: 'sensitivity',
      name: 'Sensitivity Analysis',
      icon: <ArrowUpDown className="h-4 w-4" />,
      description: 'What-if scenario analysis'
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'spreadsheet':
        return <FinancialSpreadsheet data={financialData} onDataChange={setFinancialData} />;
      case 'valuation':
        return <ValuationModels data={financialData} onSolutionChange={onSolutionChange} />;
      case 'charts':
        return <FinancialCharts data={financialData} />;
      case 'ratios':
        return <RatioCalculator data={financialData} onSolutionChange={onSolutionChange} />;
      case 'sensitivity':
        return <SensitivityAnalysis data={financialData} onSolutionChange={onSolutionChange} />;
      default:
        return <FinancialSpreadsheet data={financialData} onDataChange={setFinancialData} />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Module Sidebar */}
      <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-50 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Finance Toolkit
          </h2>
          <p className="text-sm text-dark-400 mt-1">Advanced financial analysis tools</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                activeModule === module.id
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
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
            <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Generate Financial Report
            </button>
            <button className="w-full bg-dark-700 hover:bg-dark-600 text-dark-300 text-sm py-2 px-3 rounded-lg transition-colors">
              Export to Excel
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

export default FinanceWorkspace;
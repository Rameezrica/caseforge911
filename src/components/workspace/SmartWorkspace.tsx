import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblemById } from '../../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import FinanceWorkspace from './domains/FinanceWorkspace';
import OperationsWorkspace from './domains/OperationsWorkspace';
import StrategyWorkspace from './domains/StrategyWorkspace';
import MarketingWorkspace from './domains/MarketingWorkspace';
import HRWorkspace from './domains/HRWorkspace';
import WorkspaceHeader from './WorkspaceHeader';
import SolutionSubmission from './SolutionSubmission';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users,
  Brain,
  FileText,
  Settings
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
  company?: string;
  timeLimit?: number;
  questions?: string[];
}

const SmartWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState('workspace');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    if (id) {
      const problemData = getProblemById(id);
      setProblem(problemData);
    }
  }, [id]);

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-50 mb-2">Problem Not Found</h1>
          <button
            onClick={() => navigate('/problems')}
            className="px-4 py-2 bg-emerald-500 text-dark-900 rounded-lg hover:bg-emerald-400 mt-4"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'finance':
      case 'finance & investment':
        return <Calculator className="h-5 w-5" />;
      case 'operations':
      case 'operations & supply chain':
        return <Target className="h-5 w-5" />;
      case 'strategy':
      case 'strategy & consulting':
        return <Brain className="h-5 w-5" />;
      case 'marketing':
      case 'marketing & growth':
        return <BarChart3 className="h-5 w-5" />;
      case 'hr':
      case 'human resources':
        return <Users className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getDomainWorkspace = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'finance':
      case 'finance & investment':
        return <FinanceWorkspace problem={problem} onSolutionChange={setSolution} />;
      case 'operations':
      case 'operations & supply chain':
        return <OperationsWorkspace problem={problem} onSolutionChange={setSolution} />;
      case 'strategy':
      case 'strategy & consulting':
        return <StrategyWorkspace problem={problem} onSolutionChange={setSolution} />;
      case 'marketing':
      case 'marketing & growth':
        return <MarketingWorkspace problem={problem} onSolutionChange={setSolution} />;
      case 'hr':
      case 'human resources':
        return <HRWorkspace problem={problem} onSolutionChange={setSolution} />;
      default:
        return <StrategyWorkspace problem={problem} onSolutionChange={setSolution} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <WorkspaceHeader problem={problem} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-dark-700 px-6">
              <TabsList className="bg-dark-800 border border-dark-700">
                <TabsTrigger value="workspace" className="flex items-center gap-2">
                  {getDomainIcon(problem.domain)}
                  {problem.domain} Workspace
                </TabsTrigger>
                <TabsTrigger value="solution" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Solution
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="workspace" className="flex-1 p-6">
              {getDomainWorkspace(problem.domain)}
            </TabsContent>

            <TabsContent value="solution" className="flex-1 p-6">
              <SolutionSubmission 
                problem={problem}
                solution={solution}
                onSolutionChange={setSolution}
                onSubmit={() => navigate(`/problem/${problem.id}`)}
              />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-6">
              <div className="bg-dark-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-dark-50 mb-4">Workspace Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Auto-save interval
                    </label>
                    <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-dark-50">
                      <option value="30">Every 30 seconds</option>
                      <option value="60">Every minute</option>
                      <option value="300">Every 5 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Default view
                    </label>
                    <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-dark-50">
                      <option value="split">Split view</option>
                      <option value="workspace">Workspace only</option>
                      <option value="solution">Solution only</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SmartWorkspace;
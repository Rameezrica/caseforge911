import React, { useState } from 'react';
import { BarChart3, Users, TrendingUp, Target } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface MarketingWorkspaceProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const MarketingWorkspace: React.FC<MarketingWorkspaceProps> = ({ problem, onSolutionChange }) => {
  return (
    <div className="flex h-full">
      <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-50 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Marketing Toolkit
          </h2>
          <p className="text-sm text-dark-400 mt-1">Customer analysis and campaign tools</p>
        </div>
        <div className="flex-1 p-4">
          <div className="text-center text-dark-400 mt-20">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Marketing Workspace</p>
            <p className="text-sm">Coming in next update</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="bg-dark-700 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-dark-50 mb-4">Marketing Analysis Tools</h3>
          <p className="text-dark-400">Customer journey mapping, campaign planning, and pricing optimization tools will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingWorkspace;
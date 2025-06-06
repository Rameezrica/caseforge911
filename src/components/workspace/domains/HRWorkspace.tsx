import React, { useState } from 'react';
import { Users, TrendingUp, Target, Settings } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface HRWorkspaceProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const HRWorkspace: React.FC<HRWorkspaceProps> = ({ problem, onSolutionChange }) => {
  return (
    <div className="flex h-full">
      <div className="w-80 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-dark-50 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-500" />
            HR Toolkit
          </h2>
          <p className="text-sm text-dark-400 mt-1">Human resources and organizational tools</p>
        </div>
        <div className="flex-1 p-4">
          <div className="text-center text-dark-400 mt-20">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>HR Workspace</p>
            <p className="text-sm">Coming in next update</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="bg-dark-700 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-dark-50 mb-4">HR Analysis Tools</h3>
          <p className="text-dark-400">Organizational charts, performance evaluation, and workforce planning tools will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default HRWorkspace;
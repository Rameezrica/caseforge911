import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface ScenarioPlanningProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const ScenarioPlanning: React.FC<ScenarioPlanningProps> = ({ problem, onSolutionChange }) => {
  return (
    <div className="bg-dark-700 rounded-lg p-8 text-center">
      <TrendingUp className="h-16 w-16 mx-auto mb-4 text-dark-500" />
      <h3 className="text-xl font-semibold text-dark-50 mb-2">Scenario Planning</h3>
      <p className="text-dark-400">What-if analysis and future scenario modeling coming soon</p>
    </div>
  );
};

export default ScenarioPlanning;
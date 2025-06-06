import React, { useState } from 'react';
import { Target, Users, BarChart3 } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface CompetitiveAnalysisProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ problem, onSolutionChange }) => {
  return (
    <div className="bg-dark-700 rounded-lg p-8 text-center">
      <Target className="h-16 w-16 mx-auto mb-4 text-dark-500" />
      <h3 className="text-xl font-semibold text-dark-50 mb-2">Competitive Analysis</h3>
      <p className="text-dark-400">Competitor mapping and positioning analysis coming soon</p>
    </div>
  );
};

export default CompetitiveAnalysis;
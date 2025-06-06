import React, { useState } from 'react';
import { MapPin, Layers, Users } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface BusinessModelCanvasProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({ problem, onSolutionChange }) => {
  return (
    <div className="bg-dark-700 rounded-lg p-8 text-center">
      <MapPin className="h-16 w-16 mx-auto mb-4 text-dark-500" />
      <h3 className="text-xl font-semibold text-dark-50 mb-2">Business Model Canvas</h3>
      <p className="text-dark-400">Visual business model design coming soon</p>
    </div>
  );
};

export default BusinessModelCanvas;
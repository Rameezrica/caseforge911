import React, { useState } from 'react';
import { Grid3X3, Plus, Download, Save } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  domain: string;
}

interface FrameworkBuilderProps {
  problem: Problem;
  onSolutionChange: (solution: string) => void;
}

const FrameworkBuilder: React.FC<FrameworkBuilderProps> = ({ problem, onSolutionChange }) => {
  const [activeFramework, setActiveFramework] = useState('swot');
  const [swotData, setSwotData] = useState({
    strengths: [''],
    weaknesses: [''],
    opportunities: [''],
    threats: ['']
  });

  const frameworks = [
    { id: 'swot', name: 'SWOT Analysis' },
    { id: 'porter', name: 'Porter\'s Five Forces' },
    { id: 'pestel', name: 'PESTEL Analysis' },
    { id: 'value-chain', name: 'Value Chain Analysis' }
  ];

  const generateSWOTAnalysis = () => {
    const analysis = `
# SWOT Analysis

## Strengths
${swotData.strengths.filter(s => s.trim()).map(s => `- ${s}`).join('\n')}

## Weaknesses
${swotData.weaknesses.filter(w => w.trim()).map(w => `- ${w}`).join('\n')}

## Opportunities
${swotData.opportunities.filter(o => o.trim()).map(o => `- ${o}`).join('\n')}

## Threats
${swotData.threats.filter(t => t.trim()).map(t => `- ${t}`).join('\n')}

## Strategic Implications
Based on the SWOT analysis, key strategic priorities should focus on:
1. Leveraging strengths to capitalize on opportunities
2. Addressing critical weaknesses that could impact performance
3. Mitigating threats through strategic positioning
    `;
    onSolutionChange(analysis);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-dark-700 border-b border-dark-600 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark-50">Strategic Framework Builder</h3>
          <div className="flex gap-2">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setActiveFramework(framework.id)}
                className={`px-3 py-1 text-sm rounded ${
                  activeFramework === framework.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-600 text-dark-300 hover:bg-dark-500'
                }`}
              >
                {framework.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeFramework === 'swot' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-green-400 mb-3">Strengths</h4>
                <div className="space-y-2">
                  {swotData.strengths.map((strength, index) => (
                    <input
                      key={index}
                      type="text"
                      value={strength}
                      onChange={(e) => {
                        const newStrengths = [...swotData.strengths];
                        newStrengths[index] = e.target.value;
                        setSwotData({...swotData, strengths: newStrengths});
                      }}
                      placeholder="Enter a strength..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-dark-50 text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setSwotData({...swotData, strengths: [...swotData.strengths, '']})}
                    className="w-full border-2 border-dashed border-dark-500 rounded px-3 py-2 text-dark-400 text-sm hover:border-dark-400"
                  >
                    + Add Strength
                  </button>
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-red-400 mb-3">Weaknesses</h4>
                <div className="space-y-2">
                  {swotData.weaknesses.map((weakness, index) => (
                    <input
                      key={index}
                      type="text"
                      value={weakness}
                      onChange={(e) => {
                        const newWeaknesses = [...swotData.weaknesses];
                        newWeaknesses[index] = e.target.value;
                        setSwotData({...swotData, weaknesses: newWeaknesses});
                      }}
                      placeholder="Enter a weakness..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-dark-50 text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setSwotData({...swotData, weaknesses: [...swotData.weaknesses, '']})}
                    className="w-full border-2 border-dashed border-dark-500 rounded px-3 py-2 text-dark-400 text-sm hover:border-dark-400"
                  >
                    + Add Weakness
                  </button>
                </div>
              </div>

              {/* Opportunities */}
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-blue-400 mb-3">Opportunities</h4>
                <div className="space-y-2">
                  {swotData.opportunities.map((opportunity, index) => (
                    <input
                      key={index}
                      type="text"
                      value={opportunity}
                      onChange={(e) => {
                        const newOpportunities = [...swotData.opportunities];
                        newOpportunities[index] = e.target.value;
                        setSwotData({...swotData, opportunities: newOpportunities});
                      }}
                      placeholder="Enter an opportunity..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-dark-50 text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setSwotData({...swotData, opportunities: [...swotData.opportunities, '']})}
                    className="w-full border-2 border-dashed border-dark-500 rounded px-3 py-2 text-dark-400 text-sm hover:border-dark-400"
                  >
                    + Add Opportunity
                  </button>
                </div>
              </div>

              {/* Threats */}
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-yellow-400 mb-3">Threats</h4>
                <div className="space-y-2">
                  {swotData.threats.map((threat, index) => (
                    <input
                      key={index}
                      type="text"
                      value={threat}
                      onChange={(e) => {
                        const newThreats = [...swotData.threats];
                        newThreats[index] = e.target.value;
                        setSwotData({...swotData, threats: newThreats});
                      }}
                      placeholder="Enter a threat..."
                      className="w-full bg-dark-600 border border-dark-500 rounded px-3 py-2 text-dark-50 text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setSwotData({...swotData, threats: [...swotData.threats, '']})}
                    className="w-full border-2 border-dashed border-dark-500 rounded px-3 py-2 text-dark-400 text-sm hover:border-dark-400"
                  >
                    + Add Threat
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateSWOTAnalysis}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Generate SWOT Analysis
              </button>
            </div>
          </div>
        )}

        {activeFramework !== 'swot' && (
          <div className="bg-dark-700 rounded-lg p-8 text-center">
            <Grid3X3 className="h-16 w-16 mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-semibold text-dark-50 mb-2">{frameworks.find(f => f.id === activeFramework)?.name}</h3>
            <p className="text-dark-400">Framework builder coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameworkBuilder;
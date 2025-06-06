import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

interface SensitivityAnalysisProps {
  data: any;
  onSolutionChange: (solution: string) => void;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ data, onSolutionChange }) => {
  const [baseCase, setBaseCase] = useState({
    revenue: 10000000,
    growthRate: 0.05,
    operatingMargin: 0.20,
    discountRate: 0.10,
    terminalGrowthRate: 0.02
  });

  const [sensitivity, setSensitivity] = useState({
    variable: 'growthRate',
    range: 0.02, // +/- 2%
    steps: 5
  });

  const [scenario, setScenario] = useState('base');

  const calculateNPV = (inputs: typeof baseCase) => {
    const { revenue, growthRate, operatingMargin, discountRate, terminalGrowthRate } = inputs;
    const years = 5;
    let npv = 0;

    // Project cash flows
    for (let year = 1; year <= years; year++) {
      const yearRevenue = revenue * Math.pow(1 + growthRate, year);
      const cashFlow = yearRevenue * operatingMargin;
      const pv = cashFlow / Math.pow(1 + discountRate, year);
      npv += pv;
    }

    // Terminal value
    const terminalRevenue = revenue * Math.pow(1 + growthRate, years);
    const terminalCashFlow = terminalRevenue * operatingMargin * (1 + terminalGrowthRate);
    const terminalValue = terminalCashFlow / (discountRate - terminalGrowthRate);
    const terminalPV = terminalValue / Math.pow(1 + discountRate, years);

    return npv + terminalPV;
  };

  const generateSensitivityTable = () => {
    const results = [];
    const baseNPV = calculateNPV(baseCase);
    
    for (let i = -sensitivity.steps; i <= sensitivity.steps; i++) {
      const variation = (i / sensitivity.steps) * sensitivity.range;
      const inputs = {
        ...baseCase,
        [sensitivity.variable]: baseCase[sensitivity.variable as keyof typeof baseCase] * (1 + variation)
      };
      
      const npv = calculateNPV(inputs);
      const change = ((npv - baseNPV) / baseNPV) * 100;
      
      results.push({
        variation: variation * 100,
        npv,
        change,
        input: inputs[sensitivity.variable as keyof typeof baseCase]
      });
    }
    
    return results;
  };

  const generateScenarioAnalysis = () => {
    const scenarios = {
      optimistic: {
        ...baseCase,
        growthRate: baseCase.growthRate * 1.5,
        operatingMargin: baseCase.operatingMargin * 1.2,
        discountRate: baseCase.discountRate * 0.9
      },
      base: baseCase,
      pessimistic: {
        ...baseCase,
        growthRate: baseCase.growthRate * 0.5,
        operatingMargin: baseCase.operatingMargin * 0.8,
        discountRate: baseCase.discountRate * 1.1
      }
    };

    return Object.entries(scenarios).map(([name, inputs]) => ({
      name,
      npv: calculateNPV(inputs),
      inputs
    }));
  };

  const sensitivityResults = generateSensitivityTable();
  const scenarioResults = generateScenarioAnalysis();
  const baseNPV = calculateNPV(baseCase);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const generateAnalysis = () => {
    const analysis = `
# Sensitivity Analysis Results

## Base Case NPV
**${formatCurrency(baseNPV)}**

### Key Assumptions:
- Revenue Growth Rate: ${formatPercentage(baseCase.growthRate * 100)}
- Operating Margin: ${formatPercentage(baseCase.operatingMargin * 100)}
- Discount Rate: ${formatPercentage(baseCase.discountRate * 100)}

## Sensitivity to ${sensitivity.variable}
The NPV shows the following sensitivity to changes in ${sensitivity.variable}:

${sensitivityResults.map(result => 
  `- ${result.variation >= 0 ? '+' : ''}${formatPercentage(result.variation)} change: ${formatCurrency(result.npv)} (${result.change >= 0 ? '+' : ''}${formatPercentage(result.change)} from base)`
).join('\n')}

## Scenario Analysis
- **Optimistic Case**: ${formatCurrency(scenarioResults.find(s => s.name === 'optimistic')?.npv || 0)}
- **Base Case**: ${formatCurrency(scenarioResults.find(s => s.name === 'base')?.npv || 0)}
- **Pessimistic Case**: ${formatCurrency(scenarioResults.find(s => s.name === 'pessimistic')?.npv || 0)}

## Risk Assessment
${baseNPV > 0 ? '✓ Project shows positive NPV in base case' : '⚠ Project shows negative NPV in base case'}
${sensitivityResults[0].npv > 0 ? '✓ Project remains viable in worst-case sensitivity' : '⚠ Project at risk in adverse scenarios'}

## Recommendations
Based on the sensitivity analysis:
1. Monitor ${sensitivity.variable} closely as it significantly impacts project value
2. Consider risk mitigation strategies for key variables
3. Focus on ${baseNPV > 0 ? 'maximizing upside potential' : 'reducing downside risk'}
    `;
    onSolutionChange(analysis);
  };

  return (
    <div className="h-full flex">
      {/* Controls Panel */}
      <div className="w-80 bg-dark-700 border-r border-dark-600 p-4">
        <h3 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-orange-500" />
          Analysis Controls
        </h3>

        {/* Base Case Inputs */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-dark-300 mb-3">Base Case Assumptions</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Revenue ($)</label>
              <input
                type="number"
                value={baseCase.revenue}
                onChange={(e) => setBaseCase({...baseCase, revenue: Number(e.target.value)})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Growth Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={baseCase.growthRate * 100}
                onChange={(e) => setBaseCase({...baseCase, growthRate: Number(e.target.value) / 100})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Operating Margin (%)</label>
              <input
                type="number"
                step="0.01"
                value={baseCase.operatingMargin * 100}
                onChange={(e) => setBaseCase({...baseCase, operatingMargin: Number(e.target.value) / 100})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Discount Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={baseCase.discountRate * 100}
                onChange={(e) => setBaseCase({...baseCase, discountRate: Number(e.target.value) / 100})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sensitivity Settings */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-dark-300 mb-3">Sensitivity Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-dark-400 mb-1">Variable to Test</label>
              <select
                value={sensitivity.variable}
                onChange={(e) => setSensitivity({...sensitivity, variable: e.target.value})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              >
                <option value="growthRate">Growth Rate</option>
                <option value="operatingMargin">Operating Margin</option>
                <option value="discountRate">Discount Rate</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Variation Range (±%)</label>
              <input
                type="number"
                step="0.01"
                value={sensitivity.range * 100}
                onChange={(e) => setSensitivity({...sensitivity, range: Number(e.target.value) / 100})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1">Number of Steps</label>
              <input
                type="number"
                value={sensitivity.steps}
                onChange={(e) => setSensitivity({...sensitivity, steps: Number(e.target.value)})}
                className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateAnalysis}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          Generate Analysis
        </button>
      </div>

      {/* Results Panel */}
      <div className="flex-1 p-6 space-y-6">
        <h3 className="text-xl font-semibold text-dark-50">Sensitivity Analysis Results</h3>

        {/* Base Case Summary */}
        <div className="bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Base Case NPV
          </h4>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {formatCurrency(baseNPV)}
          </div>
          <div className="text-sm text-dark-400">
            Based on current assumptions and 5-year projection
          </div>
        </div>

        {/* Sensitivity Table */}
        <div className="bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Sensitivity to {sensitivity.variable}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left py-2 text-dark-300">Change</th>
                  <th className="text-right py-2 text-dark-300">New Value</th>
                  <th className="text-right py-2 text-dark-300">NPV</th>
                  <th className="text-right py-2 text-dark-300">% Change</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityResults.map((result, index) => (
                  <tr key={index} className="border-b border-dark-600">
                    <td className="py-2 text-dark-50">
                      {result.variation >= 0 ? '+' : ''}{formatPercentage(result.variation)}
                    </td>
                    <td className="text-right py-2 text-dark-50">
                      {sensitivity.variable.includes('Rate') || sensitivity.variable.includes('Margin') 
                        ? formatPercentage(result.input as number * 100)
                        : formatCurrency(result.input as number)
                      }
                    </td>
                    <td className="text-right py-2 text-dark-50">{formatCurrency(result.npv)}</td>
                    <td className={`text-right py-2 ${result.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.change >= 0 ? '+' : ''}{formatPercentage(result.change)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className="bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Scenario Analysis
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {scenarioResults.map((scenario) => (
              <div 
                key={scenario.name}
                className={`p-4 rounded-lg border-2 ${
                  scenario.name === 'optimistic' ? 'border-green-500 bg-green-500/5' :
                  scenario.name === 'base' ? 'border-blue-500 bg-blue-500/5' :
                  'border-red-500 bg-red-500/5'
                }`}
              >
                <div className="text-center">
                  <h5 className="text-sm font-medium text-dark-300 mb-2 capitalize">
                    {scenario.name} Case
                  </h5>
                  <div className={`text-xl font-bold mb-1 ${
                    scenario.name === 'optimistic' ? 'text-green-400' :
                    scenario.name === 'base' ? 'text-blue-400' :
                    'text-red-400'
                  }`}>
                    {formatCurrency(scenario.npv)}
                  </div>
                  <div className="text-xs text-dark-500">
                    {scenario.npv > 0 ? 'Positive NPV' : 'Negative NPV'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-dark-50 mb-4">Risk Assessment</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-dark-300 mb-2">Key Risks</h5>
              <ul className="space-y-1 text-sm text-dark-400">
                <li>• {sensitivity.variable} sensitivity: {formatPercentage(Math.abs(sensitivityResults[0].change))} downside risk</li>
                <li>• Pessimistic scenario: {formatCurrency(scenarioResults[2].npv)} NPV</li>
                <li>• Break-even analysis needed for critical variables</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-dark-300 mb-2">Upside Potential</h5>
              <ul className="space-y-1 text-sm text-dark-400">
                <li>• Optimistic case: {formatCurrency(scenarioResults[0].npv)} NPV</li>
                <li>• {formatPercentage(Math.abs(sensitivityResults[sensitivityResults.length - 1].change))} upside potential</li>
                <li>• Focus on maximizing {sensitivity.variable} performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensitivityAnalysis;
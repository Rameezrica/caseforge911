import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target } from 'lucide-react';

interface ValuationModelsProps {
  data: any;
  onSolutionChange: (solution: string) => void;
}

const ValuationModels: React.FC<ValuationModelsProps> = ({ data, onSolutionChange }) => {
  const [activeModel, setActiveModel] = useState('dcf');
  const [dcfInputs, setDcfInputs] = useState({
    freeCashFlow: 1000000,
    growthRate: 0.05,
    terminalGrowthRate: 0.02,
    discountRate: 0.10,
    projectionYears: 5
  });
  const [comparableInputs, setComparableInputs] = useState({
    revenue: 10000000,
    ebitda: 2000000,
    revenueMultiple: 3.5,
    ebitdaMultiple: 12
  });

  const calculateDCF = () => {
    const { freeCashFlow, growthRate, terminalGrowthRate, discountRate, projectionYears } = dcfInputs;
    
    let presentValue = 0;
    let projectedCashFlows = [];
    
    // Calculate projected cash flows
    for (let year = 1; year <= projectionYears; year++) {
      const cashFlow = freeCashFlow * Math.pow(1 + growthRate, year);
      const pv = cashFlow / Math.pow(1 + discountRate, year);
      presentValue += pv;
      projectedCashFlows.push({
        year,
        cashFlow,
        presentValue: pv
      });
    }
    
    // Terminal value
    const terminalCashFlow = freeCashFlow * Math.pow(1 + growthRate, projectionYears) * (1 + terminalGrowthRate);
    const terminalValue = terminalCashFlow / (discountRate - terminalGrowthRate);
    const terminalPV = terminalValue / Math.pow(1 + discountRate, projectionYears);
    
    const enterpriseValue = presentValue + terminalPV;
    
    return {
      projectedCashFlows,
      terminalValue,
      terminalPV,
      presentValueOfCashFlows: presentValue,
      enterpriseValue
    };
  };

  const calculateComparables = () => {
    const { revenue, ebitda, revenueMultiple, ebitdaMultiple } = comparableInputs;
    
    return {
      revenueBasedValuation: revenue * revenueMultiple,
      ebitdaBasedValuation: ebitda * ebitdaMultiple,
      averageValuation: (revenue * revenueMultiple + ebitda * ebitdaMultiple) / 2
    };
  };

  const dcfResults = calculateDCF();
  const comparableResults = calculateComparables();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const models = [
    { id: 'dcf', name: 'DCF Model', icon: <Calculator className="h-4 w-4" /> },
    { id: 'comparable', name: 'Comparable Analysis', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'precedent', name: 'Precedent Transactions', icon: <Target className="h-4 w-4" /> },
    { id: 'summary', name: 'Valuation Summary', icon: <DollarSign className="h-4 w-4" /> }
  ];

  const generateSolution = () => {
    const solution = `
# Valuation Analysis

## DCF Model Results
- Enterprise Value: ${formatCurrency(dcfResults.enterpriseValue)}
- Present Value of Cash Flows: ${formatCurrency(dcfResults.presentValueOfCashFlows)}
- Terminal Value: ${formatCurrency(dcfResults.terminalValue)}

### Key Assumptions
- Growth Rate: ${formatPercentage(dcfInputs.growthRate)}
- Terminal Growth Rate: ${formatPercentage(dcfInputs.terminalGrowthRate)}
- Discount Rate: ${formatPercentage(dcfInputs.discountRate)}

## Comparable Company Analysis
- Revenue-based Valuation: ${formatCurrency(comparableResults.revenueBasedValuation)}
- EBITDA-based Valuation: ${formatCurrency(comparableResults.ebitdaBasedValuation)}
- Average Valuation: ${formatCurrency(comparableResults.averageValuation)}

## Valuation Range
Based on the analysis, the company valuation range is:
- Low: ${formatCurrency(Math.min(dcfResults.enterpriseValue, comparableResults.averageValuation))}
- High: ${formatCurrency(Math.max(dcfResults.enterpriseValue, comparableResults.averageValuation))}
- Midpoint: ${formatCurrency((dcfResults.enterpriseValue + comparableResults.averageValuation) / 2)}
    `;
    onSolutionChange(solution);
  };

  return (
    <div className="h-full flex">
      {/* Model Navigation */}
      <div className="w-64 bg-dark-700 border-r border-dark-600 p-4">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">Valuation Models</h3>
        <div className="space-y-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setActiveModel(model.id)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-2 ${
                activeModel === model.id
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'text-dark-300 hover:bg-dark-600'
              }`}
            >
              {model.icon}
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Model Content */}
      <div className="flex-1 p-6">
        {activeModel === 'dcf' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">DCF Model</h3>
            
            {/* Inputs */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-4">Model Inputs</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Free Cash Flow (Year 1)
                    </label>
                    <input
                      type="number"
                      value={dcfInputs.freeCashFlow}
                      onChange={(e) => setDcfInputs({...dcfInputs, freeCashFlow: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Growth Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcfInputs.growthRate}
                      onChange={(e) => setDcfInputs({...dcfInputs, growthRate: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Terminal Growth Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcfInputs.terminalGrowthRate}
                      onChange={(e) => setDcfInputs({...dcfInputs, terminalGrowthRate: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Discount Rate (WACC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dcfInputs.discountRate}
                      onChange={(e) => setDcfInputs({...dcfInputs, discountRate: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-4">Valuation Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-300">PV of Cash Flows:</span>
                    <span className="text-dark-50 font-medium">{formatCurrency(dcfResults.presentValueOfCashFlows)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">Terminal Value:</span>
                    <span className="text-dark-50 font-medium">{formatCurrency(dcfResults.terminalPV)}</span>
                  </div>
                  <div className="border-t border-dark-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-dark-50 font-medium">Enterprise Value:</span>
                      <span className="text-green-400 font-bold text-lg">{formatCurrency(dcfResults.enterpriseValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Flow Projections */}
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-dark-50 mb-4">Cash Flow Projections</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-2 text-dark-300">Year</th>
                      <th className="text-right py-2 text-dark-300">Cash Flow</th>
                      <th className="text-right py-2 text-dark-300">Present Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dcfResults.projectedCashFlows.map((cf, index) => (
                      <tr key={index} className="border-b border-dark-600">
                        <td className="py-2 text-dark-50">{cf.year}</td>
                        <td className="text-right py-2 text-dark-50">{formatCurrency(cf.cashFlow)}</td>
                        <td className="text-right py-2 text-dark-50">{formatCurrency(cf.presentValue)}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-dark-600">
                      <td className="py-2 text-dark-50 font-medium">Terminal</td>
                      <td className="text-right py-2 text-dark-50">{formatCurrency(dcfResults.terminalValue)}</td>
                      <td className="text-right py-2 text-dark-50">{formatCurrency(dcfResults.terminalPV)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'comparable' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Comparable Company Analysis</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-4">Company Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Annual Revenue
                    </label>
                    <input
                      type="number"
                      value={comparableInputs.revenue}
                      onChange={(e) => setComparableInputs({...comparableInputs, revenue: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      EBITDA
                    </label>
                    <input
                      type="number"
                      value={comparableInputs.ebitda}
                      onChange={(e) => setComparableInputs({...comparableInputs, ebitda: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Revenue Multiple
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={comparableInputs.revenueMultiple}
                      onChange={(e) => setComparableInputs({...comparableInputs, revenueMultiple: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      EBITDA Multiple
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={comparableInputs.ebitdaMultiple}
                      onChange={(e) => setComparableInputs({...comparableInputs, ebitdaMultiple: Number(e.target.value)})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-dark-50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-4">Valuation Results</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dark-300">Revenue-based:</span>
                    <span className="text-dark-50 font-medium">{formatCurrency(comparableResults.revenueBasedValuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">EBITDA-based:</span>
                    <span className="text-dark-50 font-medium">{formatCurrency(comparableResults.ebitdaBasedValuation)}</span>
                  </div>
                  <div className="border-t border-dark-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-dark-50 font-medium">Average Valuation:</span>
                      <span className="text-blue-400 font-bold text-lg">{formatCurrency(comparableResults.averageValuation)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModel === 'summary' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Valuation Summary</h3>
            
            <div className="bg-dark-700 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {formatCurrency(dcfResults.enterpriseValue)}
                  </div>
                  <div className="text-sm text-dark-400">DCF Valuation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {formatCurrency(comparableResults.averageValuation)}
                  </div>
                  <div className="text-sm text-dark-400">Comparable Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {formatCurrency((dcfResults.enterpriseValue + comparableResults.averageValuation) / 2)}
                  </div>
                  <div className="text-sm text-dark-400">Average Valuation</div>
                </div>
              </div>

              <div className="border-t border-dark-600 pt-4">
                <h4 className="text-lg font-medium text-dark-50 mb-3">Valuation Range</h4>
                <div className="bg-dark-600 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-300">Low:</span>
                    <span className="text-dark-50 font-medium">
                      {formatCurrency(Math.min(dcfResults.enterpriseValue, comparableResults.averageValuation))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-dark-300">High:</span>
                    <span className="text-dark-50 font-medium">
                      {formatCurrency(Math.max(dcfResults.enterpriseValue, comparableResults.averageValuation))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-dark-500">
                    <span className="text-dark-50 font-medium">Midpoint:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatCurrency((dcfResults.enterpriseValue + comparableResults.averageValuation) / 2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={generateSolution}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Generate Solution Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValuationModels;
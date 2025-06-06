import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';

interface RatioCalculatorProps {
  data: any;
  onSolutionChange: (solution: string) => void;
}

const RatioCalculator: React.FC<RatioCalculatorProps> = ({ data, onSolutionChange }) => {
  const [financials, setFinancials] = useState({
    // Assets
    currentAssets: 2500000,
    totalAssets: 10000000,
    inventory: 800000,
    // Liabilities
    currentLiabilities: 1000000,
    totalLiabilities: 4000000,
    // Equity
    shareholdersEquity: 6000000,
    // Income Statement
    revenue: 15000000,
    netIncome: 1500000,
    grossProfit: 6000000,
    operatingIncome: 2000000,
    interestExpense: 200000,
    // Market Data
    marketValue: 12000000,
    sharesOutstanding: 1000000,
    dividendsPerShare: 1.50
  });

  const calculateRatios = () => {
    const {
      currentAssets, totalAssets, inventory, currentLiabilities, totalLiabilities,
      shareholdersEquity, revenue, netIncome, grossProfit, operatingIncome,
      interestExpense, marketValue, sharesOutstanding, dividendsPerShare
    } = financials;

    // Liquidity Ratios
    const currentRatio = currentAssets / currentLiabilities;
    const quickRatio = (currentAssets - inventory) / currentLiabilities;
    const cashRatio = (currentAssets * 0.2) / currentLiabilities; // Assuming 20% cash

    // Leverage Ratios
    const debtToEquity = totalLiabilities / shareholdersEquity;
    const debtToAssets = totalLiabilities / totalAssets;
    const equityRatio = shareholdersEquity / totalAssets;
    const interestCoverage = operatingIncome / interestExpense;

    // Profitability Ratios
    const grossMargin = grossProfit / revenue;
    const operatingMargin = operatingIncome / revenue;
    const netMargin = netIncome / revenue;
    const roe = netIncome / shareholdersEquity;
    const roa = netIncome / totalAssets;

    // Efficiency Ratios
    const assetTurnover = revenue / totalAssets;
    const inventoryTurnover = (revenue * 0.6) / inventory; // Assuming COGS = 60% of revenue
    const receivablesTurnover = revenue / (currentAssets * 0.3); // Assuming 30% receivables

    // Market Ratios
    const pricePerShare = marketValue / sharesOutstanding;
    const pe = pricePerShare / (netIncome / sharesOutstanding);
    const priceToBook = marketValue / shareholdersEquity;
    const dividendYield = dividendsPerShare / pricePerShare;

    return {
      liquidity: {
        currentRatio,
        quickRatio,
        cashRatio
      },
      leverage: {
        debtToEquity,
        debtToAssets,
        equityRatio,
        interestCoverage
      },
      profitability: {
        grossMargin,
        operatingMargin,
        netMargin,
        roe,
        roa
      },
      efficiency: {
        assetTurnover,
        inventoryTurnover,
        receivablesTurnover
      },
      market: {
        pricePerShare,
        pe,
        priceToBook,
        dividendYield
      }
    };
  };

  const ratios = calculateRatios();

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatNumber = (value: number, decimals = 2) => value.toFixed(decimals);
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const getRatioStatus = (value: number, good: number, warning: number) => {
    if (value >= good) return { color: 'text-green-400', status: 'Good' };
    if (value >= warning) return { color: 'text-yellow-400', status: 'Warning' };
    return { color: 'text-red-400', status: 'Poor' };
  };

  const generateAnalysis = () => {
    const analysis = `
# Financial Ratio Analysis

## Liquidity Analysis
- **Current Ratio**: ${formatNumber(ratios.liquidity.currentRatio)} - Company can cover short-term obligations ${formatNumber(ratios.liquidity.currentRatio)} times over
- **Quick Ratio**: ${formatNumber(ratios.liquidity.quickRatio)} - Excluding inventory, company has ${formatNumber(ratios.liquidity.quickRatio)}x coverage
- **Cash Ratio**: ${formatNumber(ratios.liquidity.cashRatio)} - Most liquid assets provide ${formatNumber(ratios.liquidity.cashRatio)}x coverage

## Leverage Analysis
- **Debt-to-Equity**: ${formatNumber(ratios.leverage.debtToEquity)} - Debt represents ${formatPercentage(ratios.leverage.debtToEquity / (1 + ratios.leverage.debtToEquity))} of capital structure
- **Interest Coverage**: ${formatNumber(ratios.leverage.interestCoverage)}x - Operating income covers interest ${formatNumber(ratios.leverage.interestCoverage)} times

## Profitability Analysis
- **Gross Margin**: ${formatPercentage(ratios.profitability.grossMargin)} - Strong pricing power and cost control
- **Operating Margin**: ${formatPercentage(ratios.profitability.operatingMargin)} - Efficient operations
- **Net Margin**: ${formatPercentage(ratios.profitability.netMargin)} - Overall profitability
- **ROE**: ${formatPercentage(ratios.profitability.roe)} - Return to shareholders
- **ROA**: ${formatPercentage(ratios.profitability.roa)} - Asset efficiency

## Efficiency Analysis
- **Asset Turnover**: ${formatNumber(ratios.efficiency.assetTurnover)}x - Assets generate ${formatNumber(ratios.efficiency.assetTurnover)}x revenue
- **Inventory Turnover**: ${formatNumber(ratios.efficiency.inventoryTurnover)}x - Inventory turns ${formatNumber(ratios.efficiency.inventoryTurnover)} times per year

## Market Valuation
- **P/E Ratio**: ${formatNumber(ratios.market.pe)}x - Trading at ${formatNumber(ratios.market.pe)} times earnings
- **Price-to-Book**: ${formatNumber(ratios.market.priceToBook)}x - Market values company at ${formatNumber(ratios.market.priceToBook)}x book value
- **Dividend Yield**: ${formatPercentage(ratios.market.dividendYield)} - Provides ${formatPercentage(ratios.market.dividendYield)} annual yield

## Overall Assessment
Based on the ratio analysis, the company shows:
${ratios.liquidity.currentRatio > 2 ? '✓ Strong liquidity position' : '⚠ Liquidity concerns'}
${ratios.leverage.debtToEquity < 1 ? '✓ Conservative debt levels' : '⚠ High leverage'}
${ratios.profitability.roe > 0.15 ? '✓ Strong profitability' : '⚠ Below average profitability'}
${ratios.efficiency.assetTurnover > 1 ? '✓ Efficient asset utilization' : '⚠ Low asset efficiency'}
    `;
    onSolutionChange(analysis);
  };

  return (
    <div className="h-full flex">
      {/* Input Panel */}
      <div className="w-80 bg-dark-700 border-r border-dark-600 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-dark-50 mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-500" />
          Financial Inputs
        </h3>

        <div className="space-y-6">
          {/* Balance Sheet */}
          <div>
            <h4 className="text-sm font-medium text-dark-300 mb-3">Balance Sheet</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Current Assets</label>
                <input
                  type="number"
                  value={financials.currentAssets}
                  onChange={(e) => setFinancials({...financials, currentAssets: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Total Assets</label>
                <input
                  type="number"
                  value={financials.totalAssets}
                  onChange={(e) => setFinancials({...financials, totalAssets: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Current Liabilities</label>
                <input
                  type="number"
                  value={financials.currentLiabilities}
                  onChange={(e) => setFinancials({...financials, currentLiabilities: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Total Liabilities</label>
                <input
                  type="number"
                  value={financials.totalLiabilities}
                  onChange={(e) => setFinancials({...financials, totalLiabilities: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Shareholders' Equity</label>
                <input
                  type="number"
                  value={financials.shareholdersEquity}
                  onChange={(e) => setFinancials({...financials, shareholdersEquity: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Income Statement */}
          <div>
            <h4 className="text-sm font-medium text-dark-300 mb-3">Income Statement</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-dark-400 mb-1">Revenue</label>
                <input
                  type="number"
                  value={financials.revenue}
                  onChange={(e) => setFinancials({...financials, revenue: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Net Income</label>
                <input
                  type="number"
                  value={financials.netIncome}
                  onChange={(e) => setFinancials({...financials, netIncome: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1">Operating Income</label>
                <input
                  type="number"
                  value={financials.operatingIncome}
                  onChange={(e) => setFinancials({...financials, operatingIncome: Number(e.target.value)})}
                  className="w-full bg-dark-600 border border-dark-500 rounded px-2 py-1 text-dark-50 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-50">Financial Ratio Analysis</h3>
          <button
            onClick={generateAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Generate Analysis
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Liquidity Ratios */}
          <div className="bg-dark-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Liquidity Ratios
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Current Ratio</div>
                  <div className="text-xs text-dark-500">Current Assets / Current Liabilities</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.liquidity.currentRatio, 2, 1.5).color}`}>
                    {formatNumber(ratios.liquidity.currentRatio)}
                  </div>
                  <div className="text-xs text-dark-500">
                    {getRatioStatus(ratios.liquidity.currentRatio, 2, 1.5).status}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Quick Ratio</div>
                  <div className="text-xs text-dark-500">(Current Assets - Inventory) / Current Liabilities</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.liquidity.quickRatio, 1.5, 1).color}`}>
                    {formatNumber(ratios.liquidity.quickRatio)}
                  </div>
                  <div className="text-xs text-dark-500">
                    {getRatioStatus(ratios.liquidity.quickRatio, 1.5, 1).status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leverage Ratios */}
          <div className="bg-dark-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Leverage Ratios
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Debt-to-Equity</div>
                  <div className="text-xs text-dark-500">Total Liabilities / Shareholders' Equity</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(1 / ratios.leverage.debtToEquity, 2, 1).color}`}>
                    {formatNumber(ratios.leverage.debtToEquity)}
                  </div>
                  <div className="text-xs text-dark-500">
                    {ratios.leverage.debtToEquity < 1 ? 'Conservative' : 'High'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Interest Coverage</div>
                  <div className="text-xs text-dark-500">Operating Income / Interest Expense</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.leverage.interestCoverage, 5, 2.5).color}`}>
                    {formatNumber(ratios.leverage.interestCoverage)}x
                  </div>
                  <div className="text-xs text-dark-500">
                    {getRatioStatus(ratios.leverage.interestCoverage, 5, 2.5).status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profitability Ratios */}
          <div className="bg-dark-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Profitability Ratios
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Net Margin</div>
                  <div className="text-xs text-dark-500">Net Income / Revenue</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.profitability.netMargin, 0.15, 0.05).color}`}>
                    {formatPercentage(ratios.profitability.netMargin)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">ROE</div>
                  <div className="text-xs text-dark-500">Net Income / Shareholders' Equity</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.profitability.roe, 0.15, 0.10).color}`}>
                    {formatPercentage(ratios.profitability.roe)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">ROA</div>
                  <div className="text-xs text-dark-500">Net Income / Total Assets</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getRatioStatus(ratios.profitability.roa, 0.10, 0.05).color}`}>
                    {formatPercentage(ratios.profitability.roa)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Ratios */}
          <div className="bg-dark-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-dark-50 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-purple-500" />
              Market Ratios
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">P/E Ratio</div>
                  <div className="text-xs text-dark-500">Price per Share / Earnings per Share</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-purple-400">
                    {formatNumber(ratios.market.pe)}x
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Price-to-Book</div>
                  <div className="text-xs text-dark-500">Market Value / Book Value</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-purple-400">
                    {formatNumber(ratios.market.priceToBook)}x
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dark-300">Dividend Yield</div>
                  <div className="text-xs text-dark-500">Dividends per Share / Price per Share</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-purple-400">
                    {formatPercentage(ratios.market.dividendYield)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-dark-50 mb-4">Ratio Analysis Summary</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{formatNumber(ratios.liquidity.currentRatio)}</div>
              <div className="text-sm text-dark-400">Current Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{formatNumber(ratios.leverage.debtToEquity)}</div>
              <div className="text-sm text-dark-400">Debt-to-Equity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{formatPercentage(ratios.profitability.roe)}</div>
              <div className="text-sm text-dark-400">ROE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{formatNumber(ratios.market.pe)}x</div>
              <div className="text-sm text-dark-400">P/E Ratio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioCalculator;
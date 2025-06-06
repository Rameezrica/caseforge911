import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface FinancialChartsProps {
  data: any;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState('revenue');

  // Sample financial data
  const revenueData = [
    { year: '2020', revenue: 800000, profit: 120000, expenses: 680000 },
    { year: '2021', revenue: 950000, profit: 180000, expenses: 770000 },
    { year: '2022', revenue: 1100000, profit: 220000, expenses: 880000 },
    { year: '2023', revenue: 1300000, profit: 280000, expenses: 1020000 },
    { year: '2024', revenue: 1500000, profit: 350000, expenses: 1150000 },
  ];

  const expenseBreakdown = [
    { name: 'Personnel', value: 450000, color: '#8884d8' },
    { name: 'Operations', value: 300000, color: '#82ca9d' },
    { name: 'Marketing', value: 200000, color: '#ffc658' },
    { name: 'R&D', value: 150000, color: '#ff7300' },
    { name: 'Other', value: 50000, color: '#0088fe' },
  ];

  const cashFlowData = [
    { quarter: 'Q1', operating: 150000, investing: -50000, financing: 25000 },
    { quarter: 'Q2', operating: 180000, investing: -30000, financing: -10000 },
    { quarter: 'Q3', operating: 220000, investing: -80000, financing: 40000 },
    { quarter: 'Q4', operating: 250000, investing: -20000, financing: -15000 },
  ];

  const ratioData = [
    { metric: 'Current Ratio', value: 2.5, benchmark: 2.0 },
    { metric: 'Quick Ratio', value: 1.8, benchmark: 1.5 },
    { metric: 'Debt-to-Equity', value: 0.4, benchmark: 0.5 },
    { metric: 'ROE', value: 0.15, benchmark: 0.12 },
    { metric: 'ROA', value: 0.08, benchmark: 0.06 },
  ];

  const charts = [
    { id: 'revenue', name: 'Revenue & Profit', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'expenses', name: 'Expense Breakdown', icon: <PieChartIcon className="h-4 w-4" /> },
    { id: 'cashflow', name: 'Cash Flow', icon: <Activity className="h-4 w-4" /> },
    { id: 'ratios', name: 'Financial Ratios', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-full flex">
      {/* Chart Navigation */}
      <div className="w-64 bg-dark-700 border-r border-dark-600 p-4">
        <h3 className="text-lg font-semibold text-dark-50 mb-4">Financial Charts</h3>
        <div className="space-y-2">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-2 ${
                activeChart === chart.id
                  ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                  : 'text-dark-300 hover:bg-dark-600'
              }`}
            >
              {chart.icon}
              {chart.name}
            </button>
          ))}
        </div>

        <div className="mt-6 p-3 bg-dark-600 rounded-lg">
          <h4 className="text-sm font-medium text-dark-300 mb-2">Chart Options</h4>
          <div className="space-y-2">
            <button className="w-full text-left text-xs text-dark-400 hover:text-dark-300 p-1">
              Export as PNG
            </button>
            <button className="w-full text-left text-xs text-dark-400 hover:text-dark-300 p-1">
              Export as PDF
            </button>
            <button className="w-full text-left text-xs text-dark-400 hover:text-dark-300 p-1">
              Download Data
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 p-6">
        {activeChart === 'revenue' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Revenue & Profit Trends</h3>
            
            <div className="bg-dark-700 rounded-lg p-6">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Profit"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-dark-300 mb-2">Revenue Growth</h4>
                <div className="text-2xl font-bold text-blue-400">+23.1%</div>
                <div className="text-xs text-dark-500">YoY Growth</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-dark-300 mb-2">Profit Margin</h4>
                <div className="text-2xl font-bold text-green-400">23.3%</div>
                <div className="text-xs text-dark-500">Net Margin</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-dark-300 mb-2">Revenue Run Rate</h4>
                <div className="text-2xl font-bold text-purple-400">{formatCurrency(1500000)}</div>
                <div className="text-xs text-dark-500">Annual</div>
              </div>
            </div>
          </div>
        )}

        {activeChart === 'expenses' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Expense Breakdown</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-700 rounded-lg p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-dark-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-dark-50 mb-4">Expense Details</h4>
                <div className="space-y-3">
                  {expenseBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-dark-300">{item.name}</span>
                      </div>
                      <span className="text-dark-50 font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-dark-600">
                  <div className="flex justify-between">
                    <span className="text-dark-300 font-medium">Total Expenses:</span>
                    <span className="text-dark-50 font-bold">
                      {formatCurrency(expenseBreakdown.reduce((sum, item) => sum + item.value, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeChart === 'cashflow' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Cash Flow Analysis</h3>
            
            <div className="bg-dark-700 rounded-lg p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="quarter" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar dataKey="operating" fill="#10B981" name="Operating Cash Flow" />
                  <Bar dataKey="investing" fill="#F59E0B" name="Investing Cash Flow" />
                  <Bar dataKey="financing" fill="#8B5CF6" name="Financing Cash Flow" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {cashFlowData.map((quarter, index) => (
                <div key={index} className="bg-dark-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-dark-300 mb-2">{quarter.quarter}</h4>
                  <div className="text-lg font-bold text-green-400">
                    {formatCurrency(quarter.operating + quarter.investing + quarter.financing)}
                  </div>
                  <div className="text-xs text-dark-500">Net Cash Flow</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChart === 'ratios' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-dark-50">Financial Ratios</h3>
            
            <div className="bg-dark-700 rounded-lg p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ratioData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="metric" type="category" stroke="#9CA3AF" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" name="Actual" />
                  <Bar dataKey="benchmark" fill="#6B7280" name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-3">Liquidity Ratios</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-dark-300">Current Ratio:</span>
                    <span className="text-green-400 font-medium">2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">Quick Ratio:</span>
                    <span className="text-green-400 font-medium">1.8</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-dark-50 mb-3">Profitability Ratios</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-dark-300">ROE:</span>
                    <span className="text-green-400 font-medium">15.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-300">ROA:</span>
                    <span className="text-green-400 font-medium">8.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialCharts;
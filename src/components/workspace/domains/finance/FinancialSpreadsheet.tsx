import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Save } from 'lucide-react';

interface FinancialSpreadsheetProps {
  data: any;
  onDataChange: (data: any) => void;
}

interface CellData {
  value: string | number;
  formula?: string;
  type: 'text' | 'number' | 'currency' | 'percentage';
}

const FinancialSpreadsheet: React.FC<FinancialSpreadsheetProps> = ({ data, onDataChange }) => {
  const [spreadsheetData, setSpreadsheetData] = useState<Record<string, CellData>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaInput, setFormulaInput] = useState('');

  // Sample financial template
  useEffect(() => {
    const sampleData: Record<string, CellData> = {
      'A1': { value: 'Income Statement', type: 'text' },
      'A2': { value: 'Year', type: 'text' },
      'B2': { value: 2023, type: 'number' },
      'C2': { value: 2024, type: 'number' },
      'D2': { value: 2025, type: 'number' },
      'A3': { value: 'Revenue', type: 'text' },
      'B3': { value: 1000000, type: 'currency' },
      'C3': { value: 1200000, type: 'currency' },
      'D3': { value: 1440000, type: 'currency' },
      'A4': { value: 'COGS', type: 'text' },
      'B4': { value: 400000, type: 'currency' },
      'C4': { value: 480000, type: 'currency' },
      'D4': { value: 576000, type: 'currency' },
      'A5': { value: 'Gross Profit', type: 'text' },
      'B5': { value: 600000, type: 'currency', formula: '=B3-B4' },
      'C5': { value: 720000, type: 'currency', formula: '=C3-C4' },
      'D5': { value: 864000, type: 'currency', formula: '=D3-D4' },
      'A6': { value: 'Operating Expenses', type: 'text' },
      'B6': { value: 300000, type: 'currency' },
      'C6': { value: 350000, type: 'currency' },
      'D6': { value: 400000, type: 'currency' },
      'A7': { value: 'EBITDA', type: 'text' },
      'B7': { value: 300000, type: 'currency', formula: '=B5-B6' },
      'C7': { value: 370000, type: 'currency', formula: '=C5-C6' },
      'D7': { value: 464000, type: 'currency', formula: '=D5-D6' },
    };
    setSpreadsheetData(sampleData);
  }, []);

  const formatCellValue = (cell: CellData) => {
    if (typeof cell.value === 'number') {
      switch (cell.type) {
        case 'currency':
          return `$${cell.value.toLocaleString()}`;
        case 'percentage':
          return `${(cell.value * 100).toFixed(2)}%`;
        default:
          return cell.value.toLocaleString();
      }
    }
    return cell.value;
  };

  const getCellId = (row: number, col: number) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row}`;
  };

  const updateCell = (cellId: string, value: string) => {
    const newData = { ...spreadsheetData };
    const existingCell = newData[cellId] || { value: '', type: 'text' as const };
    
    // Check if it's a formula
    if (value.startsWith('=')) {
      newData[cellId] = {
        ...existingCell,
        formula: value,
        value: evaluateFormula(value, newData)
      };
    } else {
      // Try to parse as number
      const numValue = parseFloat(value);
      newData[cellId] = {
        ...existingCell,
        value: isNaN(numValue) ? value : numValue,
        type: isNaN(numValue) ? 'text' : 'number'
      };
    }
    
    setSpreadsheetData(newData);
    onDataChange(newData);
  };

  const evaluateFormula = (formula: string, data: Record<string, CellData>): number => {
    // Simple formula evaluation (basic arithmetic)
    const expression = formula.slice(1); // Remove '='
    
    // Replace cell references with values
    const cellRefRegex = /[A-Z]\d+/g;
    const processedExpression = expression.replace(cellRefRegex, (match) => {
      const cell = data[match];
      return cell ? String(cell.value) : '0';
    });
    
    try {
      // Basic evaluation (in real app, use a proper formula parser)
      return eval(processedExpression.replace(/[^0-9+\-*/().]/g, ''));
    } catch {
      return 0;
    }
  };

  const rows = 15;
  const cols = 8;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-dark-700 border-b border-dark-600 p-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-dark-600 rounded-lg">
            <Plus className="h-4 w-4 text-dark-300" />
          </button>
          <button className="p-2 hover:bg-dark-600 rounded-lg">
            <Upload className="h-4 w-4 text-dark-300" />
          </button>
          <button className="p-2 hover:bg-dark-600 rounded-lg">
            <Download className="h-4 w-4 text-dark-300" />
          </button>
          <button className="p-2 hover:bg-dark-600 rounded-lg">
            <Save className="h-4 w-4 text-dark-300" />
          </button>
        </div>
        
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="Formula bar (e.g., =B3+C3)"
            value={selectedCell ? (spreadsheetData[selectedCell]?.formula || spreadsheetData[selectedCell]?.value || '') : ''}
            onChange={(e) => setFormulaInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && selectedCell) {
                updateCell(selectedCell, formulaInput);
              }
            }}
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-dark-50 text-sm"
          />
        </div>

        <div className="text-sm text-dark-400">
          {selectedCell && `Selected: ${selectedCell}`}
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-12 h-8 bg-dark-700 border border-dark-600 text-xs text-dark-400"></th>
              {Array.from({ length: cols }, (_, i) => (
                <th key={i} className="w-32 h-8 bg-dark-700 border border-dark-600 text-xs text-dark-400 font-medium">
                  {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 h-8 bg-dark-700 border border-dark-600 text-xs text-dark-400 text-center font-medium">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: cols }, (_, colIndex) => {
                  const cellId = getCellId(rowIndex + 1, colIndex);
                  const cell = spreadsheetData[cellId];
                  const isSelected = selectedCell === cellId;
                  
                  return (
                    <td
                      key={colIndex}
                      className={`w-32 h-8 border border-dark-600 cursor-cell ${
                        isSelected ? 'bg-blue-500/20 border-blue-500' : 'bg-dark-800 hover:bg-dark-700'
                      }`}
                      onClick={() => {
                        setSelectedCell(cellId);
                        setFormulaInput(cell?.formula || cell?.value?.toString() || '');
                      }}
                    >
                      <input
                        type="text"
                        value={cell ? formatCellValue(cell) : ''}
                        onChange={(e) => updateCell(cellId, e.target.value)}
                        className="w-full h-full bg-transparent text-dark-50 text-sm px-2 border-none outline-none"
                        onFocus={() => {
                          setSelectedCell(cellId);
                          setFormulaInput(cell?.formula || cell?.value?.toString() || '');
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Templates */}
      <div className="bg-dark-700 border-t border-dark-600 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-300">Quick Templates:</span>
          <button
            onClick={() => {
              // Load income statement template
              const template = {
                'A1': { value: 'Income Statement', type: 'text' as const },
                'A2': { value: 'Revenue', type: 'text' as const },
                'B2': { value: 1000000, type: 'currency' as const },
                'A3': { value: 'COGS', type: 'text' as const },
                'B3': { value: 400000, type: 'currency' as const },
                'A4': { value: 'Gross Profit', type: 'text' as const },
                'B4': { value: 600000, type: 'currency' as const, formula: '=B2-B3' },
              };
              setSpreadsheetData(template);
            }}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
          >
            Income Statement
          </button>
          <button
            onClick={() => {
              // Load DCF template
              const template = {
                'A1': { value: 'DCF Model', type: 'text' as const },
                'A2': { value: 'Free Cash Flow', type: 'text' as const },
                'B2': { value: 100000, type: 'currency' as const },
                'A3': { value: 'Growth Rate', type: 'text' as const },
                'B3': { value: 0.1, type: 'percentage' as const },
                'A4': { value: 'Discount Rate', type: 'text' as const },
                'B4': { value: 0.12, type: 'percentage' as const },
              };
              setSpreadsheetData(template);
            }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            DCF Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialSpreadsheet;
import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface DataTableColumn<T> {
  header: string;
  accessor: ((row: T) => ReactNode) | keyof T;
  cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'No data found' 
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border hover:bg-accent/50"
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  {column.cell ? column.cell(row) : 
                    typeof column.accessor === 'function' 
                      ? column.accessor(row)
                      : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
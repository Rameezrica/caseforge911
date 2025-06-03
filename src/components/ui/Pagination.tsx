import React from 'react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} items
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" disabled={page === totalPages || total === 0} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}; 
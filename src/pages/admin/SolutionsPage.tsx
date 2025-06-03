import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { DataTable, DataTableColumn } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { useAdmin } from '../../hooks/useAdmin';

interface Solution {
  id: string;
  problem: string;
  user: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  score: number;
  submittedAt: string;
}

export const AdminSolutionsPage: React.FC = () => {
  const { admin } = useAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [totalSolutions, setTotalSolutions] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await fetch(`/api/admin/solutions?page=${page}&search=${search}`);
        if (!response.ok) throw new Error('Failed to fetch solutions');
        const data = await response.json();
        setSolutions(data.solutions);
        setTotalSolutions(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [page, search]);

  const columns: DataTableColumn<Solution>[] = [
    { 
      header: 'Problem', 
      accessor: 'problem',
      cell: (row) => (
        <span className="font-medium text-foreground">{row.problem}</span>
      )
    },
    { 
      header: 'User', 
      accessor: 'user',
      cell: (row) => (
        <span className="text-muted-foreground">{row.user}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: (row) => (
        <span className={`flex items-center gap-2 ${
          row.status === 'Accepted' ? 'text-green-500' : 
          row.status === 'Rejected' ? 'text-red-500' : 
          'text-yellow-500'
        }`}>
          {row.status === 'Accepted' ? <CheckCircle className="h-4 w-4" /> : 
           row.status === 'Rejected' ? <XCircle className="h-4 w-4" /> : 
           <Star className="h-4 w-4" />}
          {row.status}
        </span>
      )
    },
    { 
      header: 'Score', 
      accessor: (row) => (
        <span className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          {row.score}
        </span>
      )
    },
    {
      header: 'Submitted',
      accessor: (row) => new Date(row.submittedAt).toLocaleDateString(),
      cell: (row) => (
        <span className="text-muted-foreground">
          {new Date(row.submittedAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  };

  if (error) {
    return (
      <div className="p-4">
        <PageHeader title="Solutions" />
        <Card>
          <div className="p-6 text-center text-red-500">
            {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Solutions" />
      <SearchBar 
        placeholder="Search solutions..." 
        value={search} 
        onChange={setSearch} 
        onFilterClick={handleFilter} 
      />
      <Card>
        <DataTable 
          columns={columns} 
          data={solutions} 
          emptyMessage="No solutions found"
          loading={loading}
        />
      </Card>
      <Pagination 
        page={page} 
        total={totalSolutions} 
        pageSize={pageSize} 
        onPageChange={setPage} 
      />
    </div>
  );
}; 
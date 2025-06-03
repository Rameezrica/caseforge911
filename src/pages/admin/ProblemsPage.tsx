import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { DataTable, DataTableColumn } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';

interface Problem {
  title: string;
  category: string;
  difficulty: string;
  status: string;
}

const problems: Problem[] = [];

export const AdminProblemsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  // Pagination state (for demo)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const columns: DataTableColumn<Problem>[] = [
    { header: 'Title', accessor: 'title' },
    { header: 'Category', accessor: 'category' },
    { header: 'Difficulty', accessor: 'difficulty' },
    { header: 'Status', accessor: 'status' },
    { header: 'Actions', accessor: () => (
      <div className="flex gap-2 justify-center">
        <Edit className="h-4 w-4 cursor-pointer text-primary" />
        <Trash2 className="h-4 w-4 cursor-pointer text-destructive" />
      </div>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Problems" actionLabel="Add Problem" actionIcon={<Plus className="h-4 w-4" />} />
      <SearchBar placeholder="Search problems..." value={search} onChange={setSearch} onFilterClick={() => {}} />
      <Card>
        <DataTable columns={columns} data={problems} emptyMessage="No problems found" />
      </Card>
      <Pagination page={page} total={0} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}; 
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { DataTable, DataTableColumn } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: User[] = [];

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const columns: DataTableColumn<User>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: (row) => (
      <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{row.email}</span>
    ) },
    { header: 'Role', accessor: 'role' },
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
      <PageHeader title="Users" actionLabel="Add User" actionIcon={<Plus className="h-4 w-4" />} />
      <SearchBar placeholder="Search users..." value={search} onChange={setSearch} onFilterClick={() => {}} />
      <Card>
        <DataTable columns={columns} data={users} emptyMessage="No users found" />
      </Card>
      <Pagination page={page} total={0} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}; 
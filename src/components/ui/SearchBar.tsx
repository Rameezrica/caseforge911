import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from './button';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onFilterClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChange, onFilterClick }) => (
  <div className="mb-6 flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
    {onFilterClick && (
      <Button variant="outline" onClick={onFilterClick}>
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    )}
  </div>
); 
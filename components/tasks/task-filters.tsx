'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { TaskFilters } from '@/types';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  showPublicFilter?: boolean;
}

export function TaskFiltersComponent({ 
  filters, 
  onFiltersChange, 
  showPublicFilter = true 
}: TaskFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue, page: 1 });
  };

  const handleCompletionFilter = (value: string) => {
    const isCompleted = value === 'completed' ? true : value === 'pending' ? false : undefined;
    onFiltersChange({ ...filters, isCompleted, page: 1 });
  };

  const handlePublicFilter = (value: string) => {
    const isPublic = value === 'public' ? true : value === 'private' ? false : undefined;
    onFiltersChange({ ...filters, isPublic, page: 1 });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = filters.search || filters.isCompleted !== undefined || 
    (showPublicFilter && filters.isPublic !== undefined);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher des tâches..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Select
          value={
            filters.isCompleted === true 
              ? 'completed' 
              : filters.isCompleted === false 
                ? 'pending' 
                : 'all'
          }
          onValueChange={handleCompletionFilter}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En cours</SelectItem>
            <SelectItem value="completed">Terminées</SelectItem>
          </SelectContent>
        </Select>

        {showPublicFilter && (
          <Select
            value={
              filters.isPublic === true 
                ? 'public' 
                : filters.isPublic === false 
                  ? 'private' 
                  : 'all'
            }
            onValueChange={handlePublicFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="public">Publiques</SelectItem>
              <SelectItem value="private">Privées</SelectItem>
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Effacer les filtres
          </Button>
        )}
      </div>
    </div>
  );
}
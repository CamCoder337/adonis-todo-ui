'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useMyTasks } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskFiltersComponent } from '@/components/tasks/task-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskFilters } from '@/types';

export default function MyTasksPage() {
  const [filters, setFilters] = useState<Omit<TaskFilters, 'isPublic'>>({ page: 1, limit: 10 });
  const { data: tasks, isLoading, error } = useMyTasks(filters);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    const { isPublic, ...myTaskFilters } = newFilters;
    setFilters(myTaskFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const completedTasks = tasks?.data?.filter(task => task.isCompleted).length || 0;
  const pendingTasks = (tasks?.total || 0) - completedTasks;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement de vos tâches
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes tâches</h1>
          <p className="text-muted-foreground">
            {tasks?.total ? (
              <>
                {tasks.total} tâche{tasks.total > 1 ? 's' : ''} au total 
                ({completedTasks} terminée{completedTasks > 1 ? 's' : ''}, {pendingTasks} en cours)
              </>
            ) : (
              'Gérez vos tâches personnelles'
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks/create">
            <Plus className="mr-2 h-4 w-4" />
            Créer une tâche
          </Link>
        </Button>
      </div>

      <TaskFiltersComponent 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        showPublicFilter={false}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : tasks?.data && tasks.data.length > 0 ? (
        <>
          <div className="grid gap-6">
            {tasks.data.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showActions={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {tasks.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(tasks.page - 1)}
                disabled={tasks.page <= 1}
              >
                Précédent
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: tasks.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === tasks.totalPages || 
                    Math.abs(page - tasks.page) <= 2
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        variant={page === tasks.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(tasks.page + 1)}
                disabled={tasks.page >= tasks.totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune tâche trouvée</h3>
              <p className="mb-4">
                {Object.keys(filters).length > 2 
                  ? 'Aucune de vos tâches ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore créé de tâche.'
                }
              </p>
              <Button asChild>
                <Link href="/tasks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre première tâche
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
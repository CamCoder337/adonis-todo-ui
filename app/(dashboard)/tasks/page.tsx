'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTasks } from '@/hooks/use-tasks';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskFiltersComponent } from '@/components/tasks/task-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskFilters } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
  const { data: tasks, isLoading, error } = useTasks(filters);
  const { data: subscriptions } = useSubscriptions();

  const subscribedTaskIds = new Set(subscriptions?.map(sub => sub.taskId) || []);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement des tâches
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Toutes les tâches</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches et découvrez celles des autres
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
        showPublicFilter={true}
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
                isSubscribed={subscribedTaskIds.has(task.id)}
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
                  ? 'Aucune tâche ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre première tâche.'
                }
              </p>
              <Button asChild>
                <Link href="/tasks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une tâche
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
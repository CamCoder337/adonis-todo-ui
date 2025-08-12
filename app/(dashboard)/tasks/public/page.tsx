'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { usePublicTasks } from '@/hooks/use-tasks';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskFiltersComponent } from '@/components/tasks/task-filters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskFilters } from '@/types';

export default function PublicTasksPage() {
  const [filters, setFilters] = useState<Omit<TaskFilters, 'isPublic'>>({ page: 1, limit: 10 });
  const { data: tasks, isLoading, error } = usePublicTasks(filters);
  const { data: subscriptions } = useSubscriptions();

  const subscribedTaskIds = new Set(subscriptions?.map(sub => sub.taskId) || []);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    const { isPublic, ...publicTaskFilters } = newFilters;
    setFilters(publicTaskFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement des tâches publiques
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          Tâches publiques
        </h1>
        <p className="text-muted-foreground">
          Découvrez les tâches partagées par la communauté et abonnez-vous à celles qui vous intéressent
        </p>
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
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune tâche publique trouvée</h3>
              <p>
                {Object.keys(filters).length > 2 
                  ? 'Aucune tâche publique ne correspond à vos critères de recherche.'
                  : 'Il n\'y a pas encore de tâches publiques disponibles.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
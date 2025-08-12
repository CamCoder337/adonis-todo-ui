'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, HeartOff } from 'lucide-react';
import { useSubscriptions, useUnsubscribeFromTask } from '@/hooks/use-subscriptions';
import { TaskCard } from '@/components/tasks/task-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  const unsubscribeFromTask = useUnsubscribeFromTask();

  const handleUnsubscribe = (taskId: number) => {
    unsubscribeFromTask.mutate(taskId);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement de vos abonnements
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-purple-600" />
          Mes abonnements
        </h1>
        <p className="text-muted-foreground">
          {subscriptions?.length 
            ? `Vous suivez ${subscriptions.length} tâche${subscriptions.length > 1 ? 's' : ''}`
            : 'Gérez vos abonnements aux tâches publiques'
          }
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : subscriptions && subscriptions.length > 0 ? (
        <div className="grid gap-6">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="relative">
              <TaskCard 
                task={subscription.task} 
                showActions={false}
              />
              <div className="absolute top-4 right-4 z-10">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <HeartOff className="h-3 w-3 mr-1" />
                      Se désabonner
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Se désabonner de la tâche</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir vous désabonner de la tâche "{subscription.task.title}" ? 
                        Vous ne recevrez plus de notifications pour cette tâche.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleUnsubscribe(subscription.taskId)}
                        disabled={unsubscribeFromTask.isPending}
                      >
                        Se désabonner
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucun abonnement</h3>
              <p className="mb-4">
                Vous n'êtes abonné à aucune tâche pour le moment.
              </p>
              <Button asChild>
                <Link href="/tasks/public">
                  <Users className="mr-2 h-4 w-4" />
                  Découvrir les tâches publiques
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
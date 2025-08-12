'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Globe, 
  Lock, 
  Calendar, 
  User, 
  Users,
  Heart,
  HeartOff,
  CheckCircle,
  Circle
} from 'lucide-react';
import Link from 'next/link';
import { useTask, useDeleteTask, useToggleTaskCompletion } from '@/hooks/use-tasks';
import { useTaskSubscribers, useSubscribeToTask, useUnsubscribeFromTask, useSubscriptions } from '@/hooks/use-subscriptions';
import { useAuth } from '@/providers/auth-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);
  const { user } = useAuth();

  const { data: task, isLoading: taskLoading, error } = useTask(taskId);
  const { data: subscribers, isLoading: subscribersLoading } = useTaskSubscribers(taskId);
  const { data: userSubscriptions } = useSubscriptions();
  
  const deleteTask = useDeleteTask();
  const toggleCompletion = useToggleTaskCompletion();
  const subscribeToTask = useSubscribeToTask();
  const unsubscribeFromTask = useUnsubscribeFromTask();

  const isOwner = user?.id === task?.userId;
  const canSubscribe = !isOwner && task?.isPublic;
  const isSubscribed = userSubscriptions?.some(sub => sub.taskId === taskId) || false;

  const handleToggleCompletion = () => {
    if (task) {
      toggleCompletion.mutate({ id: task.id, isCompleted: !task.isCompleted });
    }
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(taskId);
    router.push('/tasks/mine');
  };

  const handleSubscriptionToggle = () => {
    if (isSubscribed) {
      unsubscribeFromTask.mutate(taskId);
    } else {
      subscribeToTask.mutate(taskId);
    }
  };

  if (taskLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Tâche introuvable ou erreur lors du chargement
          </div>
          <div className="text-center mt-4">
            <Button asChild>
              <Link href="/tasks">Retour aux tâches</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className={cn(
              "text-3xl font-bold",
              task.isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h1>
            {task.isCompleted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Terminée
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{task.owner.fullName || task.owner.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Créée le {format(new Date(task.createdAt), 'PPP', { locale: fr })}
              </span>
            </div>
            <Badge variant={task.isPublic ? 'default' : 'secondary'}>
              {task.isPublic ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Privé
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de la tâche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.description ? (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Aucune description fournie
                </p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Statut</p>
                  <div className="flex items-center gap-2">
                    {task.isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Terminée</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">En cours</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Dernière modification</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(task.updatedAt), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {canSubscribe && (
                  <Button
                    variant="outline"
                    onClick={handleSubscriptionToggle}
                    disabled={subscribeToTask.isPending || unsubscribeFromTask.isPending}
                  >
                    {isSubscribed ? (
                      <>
                        <HeartOff className="h-4 w-4 mr-2" />
                        Se désabonner
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        S'abonner
                      </>
                    )}
                  </Button>
                )}

                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleToggleCompletion}
                      disabled={toggleCompletion.isPending}
                    >
                      {task.isCompleted ? (
                        <>
                          <Circle className="h-4 w-4 mr-2" />
                          Marquer comme non terminée
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marquer comme terminée
                        </>
                      )}
                    </Button>

                    <Button variant="outline" asChild>
                      <Link href={`/tasks/${task.id}/edit`}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la tâche</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
                            {subscribers && subscribers.length > 0 && (
                              <span className="block mt-2 font-medium text-orange-600">
                                Attention : {subscribers.length} utilisateur{subscribers.length > 1 ? 's' : ''} 
                                {subscribers.length > 1 ? ' sont abonnés' : ' est abonné'} à cette tâche.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteTask.isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer définitivement
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscribers */}
          {task.isPublic && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Abonnés
                </CardTitle>
                <CardDescription>
                  Utilisateurs qui suivent cette tâche
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscribersLoading ? (
                  <LoadingSpinner size="sm" />
                ) : subscribers && subscribers.length > 0 ? (
                  <div className="space-y-2">
                    {subscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {subscriber.fullName || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subscriber.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun abonné pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Task Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID de la tâche</span>
                <span className="font-mono">{task.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Créée le</span>
                <span>{format(new Date(task.createdAt), 'PPP', { locale: fr })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Modifiée le</span>
                <span>{format(new Date(task.updatedAt), 'PPP', { locale: fr })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visibilité</span>
                <Badge variant={task.isPublic ? 'default' : 'secondary'} className="text-xs">
                  {task.isPublic ? 'Public' : 'Privé'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
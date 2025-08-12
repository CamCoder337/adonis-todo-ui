'use client';

import { Task } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Globe, 
  Lock, 
  Users,
  Heart,
  HeartOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { useToggleTaskCompletion, useDeleteTask } from '@/hooks/use-tasks';
import { useSubscribeToTask, useUnsubscribeFromTask } from '@/hooks/use-subscriptions';
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

interface TaskCardProps {
  task: Task;
  showActions?: boolean;
  isSubscribed?: boolean;
}

export function TaskCard({ task, showActions = true, isSubscribed = false }: TaskCardProps) {
  const { user } = useAuth();
  const toggleCompletion = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();
  const subscribeToTask = useSubscribeToTask();
  const unsubscribeFromTask = useUnsubscribeFromTask();

  const isOwner = user?.id === task.userId;
  const canSubscribe = !isOwner && task.isPublic;

  const handleToggleCompletion = () => {
    toggleCompletion.mutate({ id: task.id, isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  const handleSubscriptionToggle = () => {
    if (isSubscribed) {
      unsubscribeFromTask.mutate(task.id);
    } else {
      subscribeToTask.mutate(task.id);
    }
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      task.isCompleted && 'opacity-75'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              {showActions && isOwner && (
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={handleToggleCompletion}
                  disabled={toggleCompletion.isPending}
                />
              )}
              <h3 className={cn(
                'font-semibold text-lg leading-tight',
                task.isCompleted && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{task.owner.fullName || task.owner.email}</span>
              <Calendar className="h-3 w-3 ml-2" />
              <span>
                Créée {formatDistanceToNow(new Date(task.createdAt), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge variant={task.isPublic ? 'default' : 'secondary'} className="text-xs">
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
            
            {task.isCompleted && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Terminée
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {task.description && (
        <CardContent className="py-2">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="pt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {task.subscribers && task.subscribers.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{task.subscribers.length} abonné{task.subscribers.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1">
            {canSubscribe && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubscriptionToggle}
                disabled={subscribeToTask.isPending || unsubscribeFromTask.isPending}
                className="h-8"
              >
                {isSubscribed ? (
                  <>
                    <HeartOff className="h-3 w-3 mr-1" />
                    Se désabonner
                  </>
                ) : (
                  <>
                    <Heart className="h-3 w-3 mr-1" />
                    S'abonner
                  </>
                )}
              </Button>
            )}

            <Button variant="outline" size="sm" asChild className="h-8">
              <Link href={`/tasks/${task.id}`}>
                <Eye className="h-3 w-3 mr-1" />
                Voir
              </Link>
            </Button>

            {isOwner && (
              <>
                <Button variant="outline" size="sm" asChild className="h-8">
                  <Link href={`/tasks/${task.id}/edit`}>
                    <Edit2 className="h-3 w-3 mr-1" />
                    Modifier
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la tâche</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteTask.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
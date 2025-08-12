'use client';

import { Notification } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, Bell, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMarkNotificationAsRead, useDeleteNotification } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NotificationItemProps {
  notification: Notification;
}

const notificationIcons = {
  task_updated: Bell,
  task_completed: CheckCircle,
  task_deleted: AlertTriangle,
  new_subscriber: Users,
};

const notificationColors = {
  task_updated: 'text-blue-600',
  task_completed: 'text-green-600',
  task_deleted: 'text-red-600',
  new_subscriber: 'text-purple-600',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const Icon = notificationIcons[notification.type];
  const colorClass = notificationColors[notification.type];

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleDelete = () => {
    deleteNotification.mutate(notification.id);
  };

  const getTaskLink = () => {
    if (notification.relatedTaskId && notification.type !== 'task_deleted') {
      return `/tasks/${notification.relatedTaskId}`;
    }
    return null;
  };

  const taskLink = getTaskLink();

  return (
    <Card className={cn(
      'transition-all hover:shadow-sm',
      !notification.isRead && 'ring-1 ring-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('mt-1', colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {taskLink ? (
                  <Link 
                    href={taskLink}
                    className="text-sm text-foreground hover:underline"
                    onClick={handleMarkAsRead}
                  >
                    {notification.message}
                  </Link>
                ) : (
                  <p className="text-sm text-foreground">
                    {notification.message}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                  
                  {!notification.isRead && (
                    <Badge variant="secondary" className="text-xs">
                      Nouveau
                    </Badge>
                  )}
                </div>
                
                {notification.relatedTask && (
                  <div className="mt-2 p-2 rounded-md bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground">
                      Tâche: {notification.relatedTask.title}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    disabled={markAsRead.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteNotification.isPending}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
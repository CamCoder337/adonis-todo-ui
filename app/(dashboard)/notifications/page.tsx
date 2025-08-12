'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { useNotifications, useMarkAllNotificationsAsRead } from '@/hooks/use-notifications';
import { NotificationItem } from '@/components/notifications/notification-item';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { NotificationFilters } from '@/types';

export default function NotificationsPage() {
  const [filters, setFilters] = useState<NotificationFilters>({ page: 1, limit: 20 });
  const { data: notifications, isLoading, error } = useNotifications(filters);
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleReadFilter = (value: string) => {
    const isRead = value === 'read' ? true : value === 'unread' ? false : undefined;
    setFilters({ ...filters, isRead, page: 1 });
  };

  const handleTypeFilter = (value: string) => {
    const type = value === 'all' ? undefined : value as NotificationFilters['type'];
    setFilters({ ...filters, type, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const unreadCount = notifications?.data?.filter(n => !n.isRead).length || 0;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erreur lors du chargement des notifications
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {notifications?.total 
              ? `${notifications.total} notification${notifications.total > 1 ? 's' : ''} au total${unreadCount > 0 ? ` (${unreadCount} non lue${unreadCount > 1 ? 's' : ''})` : ''}`
              : 'Centre de notifications'
            }
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marquer tout comme lu
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={
            filters.isRead === true 
              ? 'read' 
              : filters.isRead === false 
                ? 'unread' 
                : 'all'
          }
          onValueChange={handleReadFilter}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="unread">Non lues</SelectItem>
            <SelectItem value="read">Lues</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type || 'all'}
          onValueChange={handleTypeFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="task_updated">Tâche mise à jour</SelectItem>
            <SelectItem value="task_completed">Tâche terminée</SelectItem>
            <SelectItem value="task_deleted">Tâche supprimée</SelectItem>
            <SelectItem value="new_subscriber">Nouvel abonné</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications?.data && notifications.data.length > 0 ? (
        <>
          <div className="space-y-4">
            {notifications.data.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>

          {/* Pagination */}
          {notifications.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(notifications.page - 1)}
                disabled={notifications.page <= 1}
              >
                Précédent
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: notifications.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === notifications.totalPages || 
                    Math.abs(page - notifications.page) <= 2
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        variant={page === notifications.page ? "default" : "outline"}
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
                onClick={() => handlePageChange(notifications.page + 1)}
                disabled={notifications.page >= notifications.totalPages}
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
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p>
                {Object.keys(filters).length > 2 
                  ? 'Aucune notification ne correspond à vos critères de filtre.'
                  : 'Vous n\'avez pas encore de notifications.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
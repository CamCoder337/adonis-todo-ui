'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, Bell, Users, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useMyTasks, usePublicTasks } from '@/hooks/use-tasks';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { useUnreadNotificationsCount } from '@/hooks/use-notifications';
import { useAuth } from '@/providers/auth-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskCard } from '@/components/tasks/task-card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: myTasks, isLoading: myTasksLoading } = useMyTasks({ limit: 5 });
  const { data: publicTasks, isLoading: publicTasksLoading } = usePublicTasks({ limit: 3 });
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const stats = [
    {
      title: 'Mes tâches',
      value: myTasks?.total || 0,
      description: 'Tâches créées',
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/tasks/mine',
    },
    {
      title: 'Abonnements',
      value: subscriptions?.length || 0,
      description: 'Tâches suivies',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/subscriptions',
    },
    {
      title: 'Notifications',
      value: unreadCount?.count || 0,
      description: 'Non lues',
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/notifications',
    },
    {
      title: 'Tâches publiques',
      value: publicTasks?.total || 0,
      description: 'Disponibles',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/tasks/public',
    },
  ];

  const completedTasks = myTasks?.data?.filter(task => task.isCompleted).length || 0;
  const pendingTasks = (myTasks?.total || 0) - completedTasks;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bon retour, {user?.fullName || 'Utilisateur'} !
        </h1>
        <p className="text-muted-foreground mt-2">
          Voici un aperçu de vos tâches et activités.
          Membre depuis {user?.createdAt && formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: fr })}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Button variant="ghost" size="sm" asChild className="mt-2 p-0 h-auto">
                  <Link href={stat.href}>
                    Voir tout →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tasks/create">
                <Plus className="mr-2 h-4 w-4" />
                Créer une tâche
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tasks/public">
                <Globe className="mr-2 h-4 w-4" />
                Explorer les tâches publiques
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Voir les notifications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mes tâches récentes</CardTitle>
                <CardDescription>
                  {completedTasks} terminées, {pendingTasks} en cours
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tasks/mine">Voir toutes</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myTasksLoading ? (
              <LoadingSpinner />
            ) : myTasks?.data && myTasks.data.length > 0 ? (
              <div className="space-y-4">
                {myTasks.data.slice(0, 3).map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <TaskCard task={task} showActions={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune tâche créée</p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/tasks/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer votre première tâche
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Public Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tâches publiques récentes</CardTitle>
                <CardDescription>
                  Découvrez ce que font les autres
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tasks/public">Voir toutes</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {publicTasksLoading ? (
              <LoadingSpinner />
            ) : publicTasks?.data && publicTasks.data.length > 0 ? (
              <div className="space-y-4">
                {publicTasks.data.slice(0, 3).map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <TaskCard task={task} showActions={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune tâche publique disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
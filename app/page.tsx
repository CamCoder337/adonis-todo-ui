'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Users, Bell, Globe } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { usePublicTasks } from '@/hooks/use-tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { data: publicTasks, isLoading } = usePublicTasks({ limit: 6 });

  const features = [
    {
      icon: CheckSquare,
      title: 'Gestion de tâches',
      description: 'Créez, organisez et suivez vos tâches avec une interface intuitive'
    },
    {
      icon: Globe,
      title: 'Tâches publiques',
      description: 'Partagez vos tâches avec la communauté et découvrez celles des autres'
    },
    {
      icon: Users,
      title: 'Abonnements',
      description: 'Suivez les tâches qui vous intéressent et restez informé de leur progression'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Recevez des notifications en temps réel sur les tâches que vous suivez'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">ATodo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Gérez vos tâches avec{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ATodo
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Une application moderne de gestion de tâches avec des fonctionnalités sociales. 
            Créez, partagez et suivez vos tâches en collaboration avec d'autres utilisateurs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-3">
                  <Link href="/register">Commencer gratuitement</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                  <Link href="/login">Se connecter</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link href="/dashboard">Accéder au Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez tout ce qu'ATodo peut vous offrir pour améliorer votre productivité
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Public Tasks Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tâches publiques récentes
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez ce que font les autres utilisateurs
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : publicTasks?.data && publicTasks.data.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {publicTasks.data.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Aucune tâche publique pour le moment
          </div>
        )}
        
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href={isAuthenticated ? '/tasks/public' : '/login'}>
              Voir toutes les tâches publiques
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 ATodo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { useParams, useRouter } from 'next/navigation';
import { TaskForm } from '@/components/tasks/task-form';
import { useTask, useUpdateTask } from '@/hooks/use-tasks';
import { useAuth } from '@/providers/auth-provider';
import { TaskFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);
  const { user } = useAuth();

  const { data: task, isLoading, error } = useTask(taskId);
  const updateTask = useUpdateTask();

  const isOwner = user?.id === task?.userId;

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await updateTask.mutateAsync({ id: taskId, data });
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
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
          <div className="text-center text-red-600 mb-4">
            Tâche introuvable ou erreur lors du chargement
          </div>
          <div className="text-center">
            <Button asChild>
              <Link href="/tasks">Retour aux tâches</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600 mb-4">
            Vous n'êtes pas autorisé à modifier cette tâche
          </div>
          <div className="text-center">
            <Button asChild>
              <Link href={`/tasks/${taskId}`}>Retour à la tâche</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/tasks/${taskId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Modifier la tâche</h1>
          <p className="text-muted-foreground">
            Mettez à jour les informations de votre tâche
          </p>
        </div>
      </div>

      <TaskForm
        initialData={task}
        onSubmit={handleSubmit}
        isSubmitting={updateTask.isPending}
        submitButtonText="Enregistrer les modifications"
      />
    </div>
  );
}
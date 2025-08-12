'use client';

import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/tasks/task-form';
import { useCreateTask } from '@/hooks/use-tasks';
import { TaskFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTaskPage() {
  const router = useRouter();
  const createTask = useCreateTask();

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await createTask.mutateAsync(data);
      router.push('/tasks/mine');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/tasks/mine">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Créer une nouvelle tâche</h1>
          <p className="text-muted-foreground">
            Ajoutez une nouvelle tâche à votre liste
          </p>
        </div>
      </div>

      <TaskForm
        onSubmit={handleSubmit}
        isSubmitting={createTask.isPending}
        submitButtonText="Créer la tâche"
      />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TaskFormData, taskSchema } from '@/lib/validations';
import { Task } from '@/types';
import { Loader2 } from 'lucide-react';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function TaskForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  submitButtonText = 'Créer la tâche' 
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      isPublic: initialData?.isPublic || false,
    },
  });

  const isPublic = watch('isPublic');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Titre de la tâche..."
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la tâche..."
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => setValue('isPublic', !!checked)}
            />
            <Label 
              htmlFor="isPublic" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rendre cette tâche publique
            </Label>
          </div>
          
          {isPublic && (
            <p className="text-xs text-muted-foreground">
              Les tâches publiques sont visibles par tous les utilisateurs et ils peuvent s'y abonner pour recevoir des notifications.
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
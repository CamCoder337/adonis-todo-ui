import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskSubscription, User } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async (): Promise<TaskSubscription[]> => {
      const response = await api.get('/subscriptions');
      return response.data;
    },
  });
}

export function useTaskSubscribers(taskId: number) {
  return useQuery({
    queryKey: ['task-subscribers', taskId],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get(`/tasks/${taskId}/subscribers`);
      return response.data;
    },
    enabled: !!taskId,
  });
}

export function useSubscribeToTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number): Promise<void> => {
      await api.post(`/tasks/${taskId}/subscribe`);
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['task-subscribers', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success('Abonnement à la tâche réussi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'abonnement à la tâche');
    },
  });
}

export function useUnsubscribeFromTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number): Promise<void> => {
      await api.delete(`/tasks/${taskId}/unsubscribe`);
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['task-subscribers', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      toast.success('Désabonnement de la tâche réussi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du désabonnement de la tâche');
    },
  });
}
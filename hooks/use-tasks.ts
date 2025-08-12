import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, PaginatedResponse, TaskFilters, TaskFormData } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async (): Promise<PaginatedResponse<Task>> => {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.isCompleted !== undefined) params.set('isCompleted', filters.isCompleted.toString());
      if (filters?.isPublic !== undefined) params.set('isPublic', filters.isPublic.toString());
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());

      const response = await api.get(`/tasks?${params.toString()}`);
      return response.data;
    },
  });
}

export function useMyTasks(filters?: Omit<TaskFilters, 'isPublic'>) {
  return useQuery({
    queryKey: ['my-tasks', filters],
    queryFn: async (): Promise<PaginatedResponse<Task>> => {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.isCompleted !== undefined) params.set('isCompleted', filters.isCompleted.toString());
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());

      const response = await api.get(`/tasks/mine?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePublicTasks(filters?: Omit<TaskFilters, 'isPublic'>) {
  return useQuery({
    queryKey: ['public-tasks', filters],
    queryFn: async (): Promise<PaginatedResponse<Task>> => {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.isCompleted !== undefined) params.set('isCompleted', filters.isCompleted.toString());
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());

      const response = await api.get(`/tasks/public?${params.toString()}`);
      return response.data;
    },
    enabled: true, // Always enabled for public tasks
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async (): Promise<Task> => {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaskFormData): Promise<Task> => {
      const response = await api.post('/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      if (arguments[1]?.isPublic) {
        queryClient.invalidateQueries({ queryKey: ['public-tasks'] });
      }
      toast.success('Tâche créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la tâche');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TaskFormData> }): Promise<Task> => {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['public-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      toast.success('Tâche mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la tâche');
    },
  });
}

export function useToggleTaskCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: number; isCompleted: boolean }): Promise<Task> => {
      const response = await api.put(`/tasks/${id}`, { isCompleted });
      return response.data;
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['public-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      toast.success(updatedTask.isCompleted ? 'Tâche marquée comme terminée' : 'Tâche marquée comme non terminée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de la tâche');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['public-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Tâche supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression de la tâche');
    },
  });
}
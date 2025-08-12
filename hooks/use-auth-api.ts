import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponse, LoginFormData, RegisterFormData } from '@/types';
import { setAuthData } from '@/lib/auth';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';

export function useLogin() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: async (authData) => {
      setAuthData(authData);
      await refreshUser();
      queryClient.clear(); // Clear all queries to fetch fresh data
      toast.success('Connexion réussie');
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la connexion');
    },
  });
}

export function useRegister() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterFormData): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: async (authData) => {
      setAuthData(authData);
      await refreshUser();
      queryClient.clear();
      toast.success('Inscription réussie');
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      toast.success('Déconnexion réussie');
    },
    onError: () => {
      // Logout locally even if server request fails
      logout();
      toast.success('Déconnexion réussie');
    },
  });
}
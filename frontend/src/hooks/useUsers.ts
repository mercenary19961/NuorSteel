import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { User } from '../types';

export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.data as User[];
    },
  });
}

export function useUser(id: number | undefined) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${id}`);
      return data.data as User;
    },
    enabled: !!id,
  });
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'editor';
  is_active?: boolean;
}

interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: 'admin' | 'editor';
  is_active?: boolean;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const { data } = await api.post('/admin/users', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload & { id: number }) => {
      const { data } = await api.put(`/admin/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/admin/users/${id}/toggle`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
